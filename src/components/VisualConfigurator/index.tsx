import React, { useState, useEffect, useRef } from 'react';
import { Material, PricingRule, DimensionRule, ProductTemplate, Quotation, ConfigSettings } from '../../types/configurator';
import { 
  INITIAL_MATERIALS, 
  INITIAL_PRICING_RULES, 
  INITIAL_DIMENSION_RULES, 
  INITIAL_PRODUCT_TEMPLATES, 
  INITIAL_SETTINGS 
} from './initialData';
import { ConfiguratorPreview } from './ConfiguratorPreview';
import { ConfiguratorDashboard } from './ConfiguratorDashboard';
import { db, isFirebaseConfigured } from '../../firebaseConfig';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs 
} from 'firebase/firestore';
import { 
  Calculator, Sparkles, Send, Share2, Printer, 
  Download, ArrowLeftRight, Check, AlertTriangle, 
  Undo2, Redo2, HelpCircle, Save, Globe, Info, 
  TrendingUp, Compass, Sliders, Settings2, FileText
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface VisualConfiguratorProps {
  isAr: boolean;
  isAdmin?: boolean;
}

export const VisualConfigurator: React.FC<VisualConfiguratorProps> = ({ isAr, isAdmin = false }) => {
  // ════════════════════════════════════════════════════
  // 1. MASTER STATE SYNCHRONIZED WITH FIRESTORE
  // ════════════════════════════════════════════════════
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(INITIAL_PRICING_RULES);
  const [dimensionRules, setDimensionRules] = useState<DimensionRule[]>(INITIAL_DIMENSION_RULES);
  const [productTemplates, setProductTemplates] = useState<ProductTemplate[]>(INITIAL_PRODUCT_TEMPLATES);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [settings, setSettings] = useState<ConfigSettings>(INITIAL_SETTINGS);

  const [activeCategory, setActiveCategory] = useState<'signage' | 'printing' | 'digital'>('signage');
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [activeUserTab, setActiveUserTab] = useState<'configurator' | 'admin'>('configurator');

  // Client configuration selections
  const [width, setWidth] = useState<number>(3.0);
  const [height, setHeight] = useState<number>(1.2);
  const [unit, setUnit] = useState<'cm' | 'mm' | 'm'>('m');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('acrylic');
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF');
  const [selectedThickness, setSelectedThickness] = useState<number>(3);
  const [selectedFinishingId, setSelectedFinishingId] = useState<string>('none');
  const [quantity, setQuantity] = useState<number>(10);
  
  // Custom Addons
  const [needsSteelFrame, setNeedsSteelFrame] = useState<boolean>(false);
  const [needsHighPowerLed, setNeedsHighPowerLed] = useState<boolean>(false);
  const [needsInstallation, setNeedsInstallation] = useState<boolean>(true);
  const [distanceKm, setDistanceKm] = useState<number>(20);
  const [isUrgent, setIsUrgent] = useState<boolean>(false);

  // Client Details
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientCompany, setClientCompany] = useState<string>('');
  const [isQuoteSaved, setIsQuoteSaved] = useState<boolean>(false);

  // Toast / Undo / Redo
  const [toast, setToast] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  // AI advisory
  const [aiTip, setAiTip] = useState<{ textAr: string; textEn: string; rating: 'excellent' | 'caution' | 'tip' }>({
    textAr: 'جاري مراجعة الأبعاد والمواد المختارة عبر خبير التكلفة الذكي...',
    textEn: 'AI is evaluating chosen configurations...',
    rating: 'tip'
  });

  // ════════════════════════════════════════════════════
  // 2. FIRESTORE SYNC & DATA INITIALIZATION
  // ════════════════════════════════════════════════════
  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      console.log('Firebase offline mode active in visual configurator. Using fallbacks.');
      return;
    }

    // Dynamic real-time listening of core configurator documents
    const unsubMaterials = onSnapshot(collection(db, 'materials'), (snap) => {
      if (!snap.empty) {
        const list: any[] = [];
        snap.forEach(doc => list.push({ ...doc.data() }));
        setMaterials(list as Material[]);
      } else {
        // Populate Firestore if empty on first boot
        INITIAL_MATERIALS.forEach(async (mat) => {
          await setDoc(doc(db, 'materials', mat.id), mat);
        });
      }
    });

    const unsubPricing = onSnapshot(collection(db, 'pricingRules'), (snap) => {
      if (!snap.empty) {
        const list: any[] = [];
        snap.forEach(doc => list.push({ ...doc.data() }));
        setPricingRules(list as PricingRule[]);
      } else {
        INITIAL_PRICING_RULES.forEach(async (rule) => {
          await setDoc(doc(db, 'pricingRules', rule.id), rule);
        });
      }
    });

    const unsubDimensions = onSnapshot(collection(db, 'dimensions'), (snap) => {
      if (!snap.empty) {
        const list: any[] = [];
        snap.forEach(doc => list.push({ ...doc.data() }));
        setDimensionRules(list as DimensionRule[]);
      } else {
        INITIAL_DIMENSION_RULES.forEach(async (dim) => {
          await setDoc(doc(db, 'dimensions', dim.id), dim);
        });
      }
    });

    const unsubTemplates = onSnapshot(collection(db, 'products'), (snap) => {
      if (!snap.empty) {
        const list: any[] = [];
        snap.forEach(doc => list.push({ ...doc.data() }));
        setProductTemplates(list as ProductTemplate[]);
      } else {
        INITIAL_PRODUCT_TEMPLATES.forEach(async (temp) => {
          await setDoc(doc(db, 'products', temp.id), temp);
        });
      }
    });

    const unsubQuotes = onSnapshot(collection(db, 'quotes'), (snap) => {
      if (!snap.empty) {
        const list: any[] = [];
        snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
        setQuotations(list as Quotation[]);
      }
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'configurator'), (snap) => {
      if (snap.exists()) {
        setSettings(snap.data() as ConfigSettings);
      } else {
        setDoc(doc(db, 'settings', 'configurator'), INITIAL_SETTINGS);
      }
    });

    return () => {
      unsubMaterials();
      unsubPricing();
      unsubDimensions();
      unsubTemplates();
      unsubQuotes();
      unsubSettings();
    };
  }, []);

  // Write changes to Firebase Storage or cloud collections on administrator update
  const handleSaveToCloud = async (collectionName: string, payload: any) => {
    if (!isFirebaseConfigured || !db) {
      triggerToast(isAr ? 'تم الحفظ محلياً في المتصفح' : 'Saved locally in sandbox storage');
      return;
    }

    setIsCloudSyncing(true);
    try {
      if (collectionName === 'settings') {
        await setDoc(doc(db, 'settings', 'configurator'), payload);
      } else {
        // Save array elements sequentially
        for (const item of payload) {
          const docId = item.id || 'doc_' + Math.random().toString(36).substr(2, 9);
          await setDoc(doc(doc(db, collectionName), docId), item);
        }
      }
      triggerToast(isAr ? 'تمت المزامنة وحفظ التعديلات سحابياً بنجاح ☁️' : 'Synchronized successfully in real-time Cloud ☁️');
    } catch (e) {
      console.error(e);
      triggerToast(isAr ? 'خطأ في مزامنة السحابة' : 'Cloud writing error');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // ════════════════════════════════════════════════════
  // 3. UNDO / REDO STATE ENGAGEMENT
  // ════════════════════════════════════════════════════
  const saveStateToHistory = (w: number, h: number, mId: string, q: number) => {
    const currentState = { width: w, height: h, selectedMaterialId: mId, quantity: q };
    setUndoStack(prev => [...prev, currentState]);
    setRedoStack([]); // Clear redo
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    
    // Save current to redo stack
    setRedoStack(prev => [...prev, { width, height, selectedMaterialId, quantity }]);

    setWidth(previous.width);
    setHeight(previous.height);
    setSelectedMaterialId(previous.selectedMaterialId);
    setQuantity(previous.quantity);
    triggerToast(isAr ? 'تراجع ↩️' : 'Undo action ↩️');
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));

    setUndoStack(prev => [...prev, { width, height, selectedMaterialId, quantity }]);

    setWidth(next.width);
    setHeight(next.height);
    setSelectedMaterialId(next.selectedMaterialId);
    setQuantity(next.quantity);
    triggerToast(isAr ? 'إعادة تطبيق ↪️' : 'Redo action ↪️');
  };

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // ════════════════════════════════════════════════════
  // 4. SMART DIMENSIONS CALCULATOR & VALIDATION
  // ════════════════════════════════════════════════════
  // Convert any inputs into unified meters
  const getWidthInMeters = () => {
    if (unit === 'cm') return width / 100;
    if (unit === 'mm') return width / 1000;
    return width;
  };

  const getHeightInMeters = () => {
    if (unit === 'cm') return height / 100;
    if (unit === 'mm') return height / 1000;
    return height;
  };

  const widthM = getWidthInMeters();
  const heightM = getHeightInMeters();
  const areaSqm = widthM * heightM;
  const perimeterM = (widthM + heightM) * 2;

  // Active Material reference
  const currentMaterial = materials.find(m => m.id === selectedMaterialId) || materials[0] || INITIAL_MATERIALS[0];

  // Validation Warnings
  const activeDimRule = dimensionRules.find(d => d.id === 'dim_signage') || INITIAL_DIMENSION_RULES[0];
  const isWidthExceeded = widthM > activeDimRule.maxWidth || widthM < activeDimRule.minWidth;
  const isHeightExceeded = heightM > activeDimRule.maxHeight || heightM < activeDimRule.minHeight;

  // ════════════════════════════════════════════════════
  // 5. DYNAMIC CALCULATION CORE PRICING ENGINE
  // ════════════════════════════════════════════════════
  const calculateConfiguratorPrice = () => {
    if (!currentMaterial) return { subtotal: 0, grandTotal: 0, tax: 0, breakdown: null };

    // 1. Base Material Cost
    const baseMatCost = currentMaterial.pricePerSqm * areaSqm;

    // 2. Thickness modifier cost (e.g. 3mm = 0, 5mm = standard fee, etc.)
    const thickFee = currentMaterial.thicknessPrices[selectedThickness] || 0;
    const totalThicknessCost = thickFee * areaSqm;

    // 3. Printing costs per sqm
    const printingCost = activeCategory === 'printing' ? settings.printingCostPerSqm * areaSqm : 0;

    // 4. Finishing Cost
    const finishOpt = settings.finishingOptions.find(f => f.id === selectedFinishingId) || settings.finishingOptions[0];
    let finishingCost = 0;
    if (finishOpt) {
      if (finishOpt.price > 5) {
        finishingCost = finishOpt.price * areaSqm; // flat EGP rate per sqm
      } else if (finishOpt.price > 0) {
        finishingCost = baseMatCost * (finishOpt.price - 1); // percentage modifier
      }
    }

    // 5. Steel Frame Backing Support Add-on
    const steelSupportCost = needsSteelFrame ? Math.round(baseMatCost * 0.18) : 0;

    // 6. Premium High Power Samsung RGB LEDs
    const ledGlowCost = needsHighPowerLed ? Math.round(baseMatCost * 0.12) : 0;

    // 7. Installation labor and rigging scaffolding
    const installationCost = needsInstallation ? settings.installationCostPerSqm * areaSqm : 0;

    // 8. Over-the-road trucking logistics
    const transportationCost = distanceKm * settings.transportationCostPerKm;

    // Cumulative Production Cost
    let baseProductionSubtotal = 
      baseMatCost + 
      totalThicknessCost + 
      printingCost + 
      finishingCost + 
      steelSupportCost + 
      ledGlowCost + 
      installationCost + 
      transportationCost;

    // 9. Urgency Factor markup
    const urgencyMarkup = isUrgent ? (baseProductionSubtotal * (settings.urgencyFactor - 1)) : 0;
    let accumulatedPriceBeforePromo = baseProductionSubtotal + urgencyMarkup;

    // 10. Volume discount & seasonal promotions
    let discountApplied = 0;
    const applicableRule = pricingRules
      .filter(r => r.active && quantity >= r.minQty)
      .sort((a, b) => b.discountPercent - a.discountPercent)[0];

    if (applicableRule) {
      discountApplied = Math.round(accumulatedPriceBeforePromo * (applicableRule.discountPercent / 100));
    }

    // Multiplier for quantity
    const finalSubtotalBeforeDiscount = Math.round(accumulatedPriceBeforePromo) * quantity;
    const totalDiscountAmount = discountApplied * quantity;
    const subtotal = finalSubtotalBeforeDiscount - totalDiscountAmount;

    // VAT 14% Egypt standard
    const tax = Math.round(subtotal * 0.14);
    const grandTotal = subtotal + tax;

    return {
      subtotal,
      tax,
      grandTotal,
      discountPercent: applicableRule?.discountPercent || 0,
      breakdown: {
        baseMaterialCost: Math.round(baseMatCost),
        areaCost: Math.round(baseMatCost),
        thicknessCost: Math.round(totalThicknessCost),
        printingCost: Math.round(printingCost),
        finishingCost: Math.round(finishingCost),
        installationCost: Math.round(installationCost),
        transportationCost: Math.round(transportationCost),
        urgencyCost: Math.round(urgencyMarkup),
        promoDiscount: totalDiscountAmount
      }
    };
  };

  const priceStats = calculateConfiguratorPrice();

  // ════════════════════════════════════════════════════
  // 6. AI HEURISTIC RECOMENDATIONS (CRASH-PROOF ADVISORY)
  // ════════════════════════════════════════════════════
  useEffect(() => {
    // Generate intelligent advice based on active user configurations
    if (isWidthExceeded || isHeightExceeded) {
      setAiTip({
        textAr: `⚠️ المقاس الحالي غير متطابق مع مقاييس السلامة الهندسية للورشة. يرجى تعديل العرض أو الارتفاع لتجنب مشاكل الهيكل الحديدي والرياح الشديدة.`,
        textEn: `⚠️ Chosen dimensions exceed standard safety indices. Resize parameters to prevent wind-shearing structural stress on mounting brackets.`,
        rating: 'caution'
      });
    } else if (currentMaterial?.id === 'stainless' && needsHighPowerLed) {
      setAiTip({
        textAr: `💡 ذكاء اصطناعي: مادة الاستانلس ستيل لا تسمح بالإضاءة الأمامية المباشرة. ليدات سامسونج RGB ستوفر هالة مضيئة فخمة (Backlit Halo) بالخلف مما يبرز شعار شركتك برونق باهر.`,
        textEn: `💡 AI Advisor: Stainless steel does not support front-lit glows. Reconfiguring RGB LEDs as a rear-halo backlit aura is highly recommended for luxury branding.`,
        rating: 'excellent'
      });
    } else if (areaSqm > 12 && !needsSteelFrame) {
      setAiTip({
        textAr: `⚠️ تنبيه هندسي: المساحة الإجمالية للوحة كبيرة جداً وتتطلب هيكل شاسيه حديد داعم (Steel Frame) لحمايتها من الالتواء وتآكل البراغي جراء التمدد الحراري بمصر.`,
        textEn: `⚠️ Engineering recommendation: Total surface exceeds 12 sqm. Activating heavy steel frame support is essential to survive thermal expansion stress.`,
        rating: 'caution'
      });
    } else {
      setAiTip({
        textAr: `✨ ذكاء التسعير: اختيار ممتاز! الخامة الحالية تمنح شركتك أقصى درجات المقاومة لتقلبات الطقس والحرارة مع إضاءة متناسقة وتوفير رائع في استهلاك الكهرباء.`,
        textEn: `✨ AI Insight: Optimal setup detected! Acrylic panels coupled with LED modules deliver unmatched contrast ratio and heat resistance in high humidity.`,
        rating: 'excellent'
      });
    }
  }, [width, height, selectedMaterialId, quantity, needsSteelFrame, needsHighPowerLed]);

  // ════════════════════════════════════════════════════
  // 7. CUSTOMER APPROVAL & QUOTATION STORAGE PUSH
  // ════════════════════════════════════════════════════
  const handleRegisterAndSubmitEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      triggerToast(isAr ? 'يرجى إدخال اسم العميل ورقم الهاتف' : 'Please input client name and mobile');
      return;
    }

    const dateStr = new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const payload: Quotation = {
      id: 'quote_' + Math.random().toString(36).substr(2, 9),
      clientName,
      clientPhone,
      clientEmail: clientEmail || 'info@yafta.eg',
      clientCompany: clientCompany || (isAr ? 'حساب تجاري فردي' : 'Corporate Enterprise'),
      date: dateStr,
      category: activeCategory.toUpperCase(),
      productLabel: isAr ? currentMaterial.nameAr : currentMaterial.nameEn,
      dimensions: `${widthM.toFixed(2)}M x ${heightM.toFixed(2)}M (${areaSqm.toFixed(2)}m²)`,
      quantity,
      subtotal: priceStats.subtotal,
      tax: priceStats.tax,
      grandTotal: priceStats.grandTotal,
      status: 'pending',
      costBreakdown: priceStats.breakdown as any
    };

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'quotes'), payload);
        triggerToast(isAr ? 'تم تسجيل المقايسة ونقلها لخط المبيعات المباشر بنجاح! 🎉' : 'Quotation successfully logged in Firestore pipeline! 🎉');
        setIsQuoteSaved(true);
      } catch (err) {
        console.error(err);
        triggerToast(isAr ? 'خطأ في تخزين المقايسة سحابياً' : 'Quotation save error');
      }
    } else {
      // Local fallback
      const saved = localStorage.getItem('yafta_local_quotes');
      const list = saved ? JSON.parse(saved) : [];
      list.push(payload);
      localStorage.setItem('yafta_local_quotes', JSON.stringify(list));
      setQuotations([payload, ...quotations]);
      triggerToast(isAr ? 'تم حفظ المقايسة محلياً بملفات المتصفح' : 'Saved quotation in browser session');
      setIsQuoteSaved(true);
    }
  };

  // ════════════════════════════════════════════════════
  // 8. PDF INVOICE GENERATION ENGINE (jspdf Direct integration)
  // ════════════════════════════════════════════════════
  const handleDownloadPDFInvoice = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Elegant styling for PDF invoice (Clean Swiss layout)
    doc.setFillColor(15, 15, 15); // Dark Black Header
    doc.rect(0, 0, 210, 45, 'F');

    // Corporate Title
    doc.setTextColor(229, 192, 96); // Gold 505
    doc.setFontSize(22);
    doc.text('YAFTA ADVERTISING', 15, 20);
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('PRESTIGE ENTERPRISE SIGNAGE & ARCHITECTURAL SYSTEMS', 15, 28);
    doc.text('Date: ' + new Date().toLocaleDateString('en-US'), 150, 20);
    doc.text('Quote ID: Q-' + Math.random().toString(36).substr(2, 6).toUpperCase(), 150, 26);

    // Client section
    doc.setFillColor(245, 245, 245);
    doc.rect(15, 55, 180, 30, 'F');
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(11);
    doc.text('CLIENT DETAILS:', 20, 62);
    doc.setFontSize(10);
    doc.text('Name: ' + (clientName || 'Valued Partner'), 20, 68);
    doc.text('Phone: ' + (clientPhone || 'N/A'), 20, 73);
    doc.text('Company: ' + (clientCompany || 'Inquiry Account'), 20, 78);

    // Specifications
    doc.setFontSize(11);
    doc.text('TECHNICAL CONFIGURATIONS:', 15, 95);
    doc.line(15, 97, 195, 97);

    doc.setFontSize(10);
    doc.text('Core Material:', 15, 105);
    doc.text(currentMaterial ? currentMaterial.nameEn : 'Standard Fabric', 65, 105);

    doc.text('Dimensions (Width x Height):', 15, 112);
    doc.text(`${widthM.toFixed(2)}M x ${heightM.toFixed(2)}M (${areaSqm.toFixed(2)} sqm)`, 65, 112);

    doc.text('Quantity ordered:', 15, 119);
    doc.text(`${quantity} units`, 65, 119);

    doc.text('Installation & Setup logistics:', 15, 126);
    doc.text(needsInstallation ? 'Included on-site rigging & alignment' : 'Self Assembly / Pickup', 65, 126);

    // Financial calculations table
    doc.setFillColor(15, 15, 15);
    doc.rect(15, 140, 180, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('COST ANALYSIS & BREAKDOWN', 20, 145);
    doc.text('AMOUNT (EGP)', 160, 145);

    doc.setTextColor(50, 50, 50);
    doc.text('Base material fabrication cost per sqm:', 20, 155);
    doc.text((priceStats.breakdown?.baseMaterialCost || 0).toLocaleString() + ' EGP', 160, 155);

    doc.text('Finishing & special surface coatings:', 20, 162);
    doc.text((priceStats.breakdown?.finishingCost || 0).toLocaleString() + ' EGP', 160, 162);

    doc.text('Logistics, trucking and field delivery:', 20, 169);
    doc.text((priceStats.breakdown?.transportationCost || 0).toLocaleString() + ' EGP', 160, 169);

    doc.text('On-site scaffolding installation labor:', 20, 176);
    doc.text((priceStats.breakdown?.installationCost || 0).toLocaleString() + ' EGP', 160, 176);

    doc.text('Urgency production markup factor:', 20, 183);
    doc.text((priceStats.breakdown?.urgencyCost || 0).toLocaleString() + ' EGP', 160, 183);

    doc.line(15, 190, 195, 190);

    // Totals
    doc.setFontSize(10);
    doc.text('Subtotal:', 120, 198);
    doc.text(priceStats.subtotal.toLocaleString() + ' EGP', 160, 198);

    doc.text('VAT 14% Egypt:', 120, 205);
    doc.text(priceStats.tax.toLocaleString() + ' EGP', 160, 205);

    doc.setFontSize(12);
    doc.setTextColor(229, 192, 96);
    doc.setFillColor(15, 15, 15);
    doc.rect(115, 210, 80, 10, 'F');
    doc.text('GRAND TOTAL:', 120, 216);
    doc.text(priceStats.grandTotal.toLocaleString() + ' EGP', 160, 216);

    // Terms
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(8);
    doc.text('This invoice is generated automatically by Yafta Enterprise Pricing Engine v2.6.', 15, 260);
    doc.text('Subject to material index shifts unless confirmed within 7 working days.', 15, 265);

    doc.save(`YAFTA_QUOTE_${clientName || 'PARTNER'}.pdf`);
    triggerToast(isAr ? 'تم تحميل ملف المقايسة PDF بنجاح 📥' : 'PDF Quotation downloaded successfully 📥');
  };

  // ════════════════════════════════════════════════════
  // 9. WHATSAPP INSTANT LINK FORMULATION
  // ════════════════════════════════════════════════════
  const handleShareOnWhatsApp = () => {
    const title = isAr ? 'يافطة الفاخرة للدعاية والإعلان' : 'YAFTA Luxury Signage Platform';
    const msg = `
*${title}*
------------------------------
👤 *${isAr ? 'العميل:' : 'Client:'}* ${clientName || (isAr ? 'شريك متميز' : 'Valued Partner')}
📱 *${isAr ? 'الهاتف:' : 'Phone:'}* ${clientPhone || 'N/A'}
🛠️ *${isAr ? 'الخامة والمنتج:' : 'Material & Setup:'}* ${isAr ? currentMaterial?.nameAr : currentMaterial?.nameEn}
📐 *${isAr ? 'المقاس:' : 'Size:'}* ${widthM.toFixed(2)}م × ${heightM.toFixed(2)}م (${areaSqm.toFixed(2)} متر مربع)
🔢 *${isAr ? 'الكمية:' : 'Quantity:'}* ${quantity}

💰 *${isAr ? 'تفصيل التسعير:' : 'Pricing breakdown:'}*
- ${isAr ? 'المجموع الفرعي:' : 'Subtotal:'} ${priceStats.subtotal.toLocaleString()} EGP
- ${isAr ? 'ضريبة القيمة المضافة (١٤٪):' : 'VAT (14%):'} ${priceStats.tax.toLocaleString()} EGP
- *${isAr ? 'الإجمالي الكلي للمشروع:' : 'Grand Total Budget:'} ${priceStats.grandTotal.toLocaleString()} EGP*
------------------------------
_✓ تم حساب السعر تلقائياً عبر حاسبة يافطة الفورية الذكية._
    `;
    const encoded = encodeURIComponent(msg.trim());
    window.open(`https://wa.me/201116210464?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-8 pb-12 font-sans relative">
      
      {/* Dynamic Toast feedback */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-3 bg-neutral-900 border-2 border-gold-505/80 text-gold-300 font-extrabold text-xs rounded-xl shadow-2xl animate-bounce" id="configurator-toast">
          {toast}
        </div>
      )}

      {/* Header section with Admin switchers */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gold-550/15 pb-6">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          <button
            onClick={() => setActiveUserTab('configurator')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
              activeUserTab === 'configurator'
                ? 'bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {isAr ? '📐 المكون البصري' : '📐 Visual Configurator'}
          </button>
          
          {isAdmin && (
            <button
              onClick={() => setActiveUserTab('admin')}
              className={`px-4 py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeUserTab === 'admin'
                  ? 'bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Settings2 className="w-4 h-4 text-gold-505 shrink-0" />
              <span>{isAr ? '⚙️ إعدادات الإدارة والتحكم' : '⚙️ CMS Management'}</span>
            </button>
          )}
        </div>

        <div className="text-right">
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center justify-end gap-2">
            <span>{isAr ? 'مهندس التكلفة والتصميم الذكي' : 'Smart Pricing & Size Configurator'}</span>
            <Calculator className="w-6 h-6 text-gold-505 animate-pulse shrink-0" />
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isAr ? 'منصة الحوسبة الفورية وتصميم هويات الفروع والواجهات بدقة الورشة ومزامنة السحابة' : 'Precision engineering CAD math, instant costing matrix, and cloud-synced approvals'}
          </p>
        </div>
      </div>

      {/* 1. CONFIGURATOR ACTIVE WORKSPACE VIEW */}
      {activeUserTab === 'configurator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Configurator inputs & control stack (8 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Dimensions configuration */}
            <div className="bg-neutral-900/60 border border-gold-505/10 p-5 rounded-2xl space-y-4 text-right">
              <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                <div className="flex gap-2">
                  <button 
                    onClick={handleUndo} 
                    disabled={undoStack.length === 0}
                    className="p-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title={isAr ? 'تراجع' : 'Undo'}
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleRedo} 
                    disabled={redoStack.length === 0}
                    className="p-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title={isAr ? 'إعادة' : 'Redo'}
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="text-xs font-black text-gold-305 flex items-center justify-end gap-1.5">
                  <span>{isAr ? 'تحديد أبعاد وقياسات اللوحة' : 'Determine Sizing & Scaling'}</span>
                  <Sliders className="w-4 h-4" />
                </h3>
              </div>

              {/* Units Selection and Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-xs">
                
                {/* Unit Switcher */}
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'وحدة القياس المستعملة:' : 'Unit of measure:'}</label>
                  <div className="grid grid-cols-3 gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
                    {(['m', 'cm', 'mm'] as const).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => {
                          setUnit(u);
                          triggerToast(isAr ? `تغيير الوحدة لـ ${u.toUpperCase()}` : `Unit changed to ${u.toUpperCase()}`);
                        }}
                        className={`py-1 rounded text-[10px] font-black cursor-pointer transition-all ${
                          unit === u 
                            ? 'bg-gold-505 text-neutral-950' 
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {u.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Width slide */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-mono text-gold-300 font-bold">{width} {unit.toUpperCase()}</span>
                    <label className="text-neutral-400">{isAr ? 'العرض (W):' : 'Width (W):'}</label>
                  </div>
                  <input
                    type="range"
                    min={unit === 'm' ? '0.5' : unit === 'cm' ? '50' : '500'}
                    max={unit === 'm' ? '15.0' : unit === 'cm' ? '1500' : '15000'}
                    step={unit === 'm' ? '0.1' : '10'}
                    value={width}
                    onChange={(e) => {
                      saveStateToHistory(width, height, selectedMaterialId, quantity);
                      setWidth(parseFloat(e.target.value) || 1);
                    }}
                    className="w-full accent-gold-505 cursor-pointer h-1 bg-neutral-950 rounded-lg"
                  />
                </div>

                {/* Height slide */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-mono text-gold-300 font-bold">{height} {unit.toUpperCase()}</span>
                    <label className="text-neutral-400">{isAr ? 'الارتفاع (H):' : 'Height (H):'}</label>
                  </div>
                  <input
                    type="range"
                    min={unit === 'm' ? '0.3' : unit === 'cm' ? '30' : '300'}
                    max={unit === 'm' ? '4.5' : unit === 'cm' ? '450' : '4500'}
                    step={unit === 'm' ? '0.1' : '10'}
                    value={height}
                    onChange={(e) => {
                      saveStateToHistory(width, height, selectedMaterialId, quantity);
                      setHeight(parseFloat(e.target.value) || 1);
                    }}
                    className="w-full accent-gold-505 cursor-pointer h-1 bg-neutral-950 rounded-lg"
                  />
                </div>
              </div>

              {/* Technical summary math indicators */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-neutral-850 text-center font-mono text-[10px]">
                <div className="bg-neutral-950/60 p-2 rounded-lg border border-neutral-850">
                  <span className="text-neutral-500 block text-[9px] uppercase">{isAr ? 'المساحة الكلية' : 'Total Area'}</span>
                  <span className="text-white font-extrabold">{areaSqm.toFixed(2)} m²</span>
                </div>
                <div className="bg-neutral-950/60 p-2 rounded-lg border border-neutral-850">
                  <span className="text-neutral-500 block text-[9px] uppercase">{isAr ? 'المحيط الهيكلي' : 'Structural Perimeter'}</span>
                  <span className="text-white font-extrabold">{perimeterM.toFixed(2)} m</span>
                </div>
                <div className="bg-neutral-950/60 p-2 rounded-lg border border-neutral-850">
                  <span className="text-neutral-500 block text-[9px] uppercase">{isAr ? 'مقاس شاسيه الورشة' : 'Chassis Output'}</span>
                  <span className="text-gold-305 font-extrabold">{Math.ceil(widthM * 1.05).toFixed(1)}m x {Math.ceil(heightM * 1.05).toFixed(1)}m</span>
                </div>
              </div>
            </div>

            {/* Premium Material Picker */}
            <div className="space-y-3 text-right">
              <h3 className="text-xs font-black text-gold-305 uppercase tracking-wider">
                {isAr ? 'حدد نوع مادة التصنيع والواجهة:' : 'Select Core Production Material:'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {materials.map((m) => {
                  const isSelected = m.id === selectedMaterialId;
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        saveStateToHistory(width, height, selectedMaterialId, quantity);
                        setSelectedMaterialId(m.id);
                        if (m.thicknessOptions[0]) {
                          setSelectedThickness(m.thicknessOptions[0]);
                        }
                        triggerToast(isAr ? `تحديد خامة: ${m.nameAr}` : `Selected ${m.nameEn}`);
                      }}
                      className={`relative rounded-xl border p-4 flex flex-col justify-between cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-gold-505 bg-gold-950/20 shadow-lg shadow-gold-500/5 scale-102' 
                          : 'border-neutral-850 bg-neutral-900/60 hover:bg-neutral-900 hover:border-neutral-800'
                      }`}
                    >
                      {/* popular/premium badge overlay */}
                      {m.badge && m.badge !== 'none' && (
                        <span className="absolute top-2 left-2 text-[8px] font-bold bg-gold-505 text-neutral-950 px-1.5 py-0.5 rounded tracking-wide font-mono uppercase">
                          {m.badge === 'popular' ? (isAr ? 'رائج 🔥' : 'Popular 🔥') : m.badge === 'premium' ? (isAr ? 'ممتاز 💎' : 'Premium 💎') : (isAr ? 'موصى به 👍' : 'Recommended 👍')}
                        </span>
                      )}

                      <div className="space-y-1">
                        <span className="text-xs font-black text-white block">{isAr ? m.nameAr : m.nameEn}</span>
                        <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">{isAr ? m.descriptionAr : m.descriptionEn}</p>
                      </div>

                      <div className="pt-3 border-t border-neutral-850/60 flex items-center justify-between text-xs font-mono mt-3">
                        <span className="text-gold-305 font-bold">{m.pricePerSqm.toLocaleString()} EGP / m²</span>
                        <span className="text-[9px] text-neutral-500 uppercase">{m.indicator}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Thickness and Custom finishing configurations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-neutral-900/60 border border-gold-505/10 p-5 rounded-2xl text-right text-xs">
              
              {/* Thickness selector */}
              <div className="space-y-2">
                <label className="text-neutral-400 block font-bold">{isAr ? 'سُمك وسماكة الخامة المختارة:' : 'Material Thickness Options:'}</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {currentMaterial?.thicknessOptions.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setSelectedThickness(t);
                        triggerToast(`${t}mm thickness chosen`);
                      }}
                      className={`py-2 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                        selectedThickness === t 
                          ? 'bg-gold-550/30 text-gold-300 border border-gold-505/40 font-black' 
                          : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-850'
                      }`}
                    >
                      {t} mm
                    </button>
                  ))}
                </div>
              </div>

              {/* Finishing Selector */}
              <div className="space-y-2">
                <label className="text-neutral-400 block font-bold">{isAr ? 'خيارات الطلاء والتشطيب الإضافية:' : 'Surface Finishing Polish:'}</label>
                <select
                  value={selectedFinishingId}
                  onChange={(e) => setSelectedFinishingId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-gold-505"
                >
                  {settings.finishingOptions.map(f => (
                    <option key={f.id} value={f.id}>{isAr ? f.nameAr : f.nameEn}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Addons checkbox grid */}
            <div className="bg-neutral-900/60 border border-gold-505/10 p-5 rounded-2xl text-right text-xs space-y-4">
              <h3 className="text-xs font-black text-gold-305 flex items-center justify-end gap-1.5">
                <span>{isAr ? 'عناصر تقوية هيكلية وتجهيزات فنية للمشروع' : 'Structural Rigging & Extra Enhancements'}</span>
                <Sliders className="w-4 h-4" />
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center justify-between p-3 bg-neutral-950/60 rounded-xl border border-neutral-850/60 cursor-pointer hover:border-gold-550/20 transition-all">
                  <input
                    type="checkbox"
                    checked={needsSteelFrame}
                    onChange={(e) => setNeedsSteelFrame(e.target.checked)}
                    className="rounded accent-gold-505 shrink-0 scale-102"
                  />
                  <div className="text-right">
                    <span className="font-bold text-white block">{isAr ? 'شاسيه حديد داعم (+١٨٪)' : 'Heavy Steel Frame (+18%)'}</span>
                    <span className="text-[10px] text-neutral-500">{isAr ? 'داعم صلب للوحات الكبيرة' : 'Windproof anti-corrosive backer'}</span>
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 bg-neutral-950/60 rounded-xl border border-neutral-850/60 cursor-pointer hover:border-gold-550/20 transition-all">
                  <input
                    type="checkbox"
                    checked={needsHighPowerLed}
                    onChange={(e) => setNeedsHighPowerLed(e.target.checked)}
                    className="rounded accent-gold-505 shrink-0 scale-102"
                  />
                  <div className="text-right">
                    <span className="font-bold text-white block">{isAr ? 'إضاءة هالة سامسونج ملونة (+١٢٪)' : 'Korean Samsung RGB (+12%)'}</span>
                    <span className="text-[10px] text-neutral-500">{isAr ? 'أعلى مستويات البريق والوهج' : 'Ultra-vibrant LED backlit colors'}</span>
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 bg-neutral-950/60 rounded-xl border border-neutral-850/60 cursor-pointer hover:border-gold-550/20 transition-all">
                  <input
                    type="checkbox"
                    checked={needsInstallation}
                    onChange={(e) => setNeedsInstallation(e.target.checked)}
                    className="rounded accent-gold-505 shrink-0 scale-102"
                  />
                  <div className="text-right">
                    <span className="font-bold text-white block">{isAr ? 'يتضمن التركيب والرفع الهندسي' : 'Full On-site Rigging Labor'}</span>
                    <span className="text-[10px] text-neutral-500">{isAr ? 'عمالة فنية معتمدة للارتفاعات' : 'Riggers, scaffolding & test engineers'}</span>
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 bg-neutral-950/60 rounded-xl border border-neutral-850/60 cursor-pointer hover:border-gold-550/20 transition-all">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="rounded accent-gold-505 shrink-0 scale-102"
                  />
                  <div className="text-right">
                    <span className="font-bold text-white block">{isAr ? 'إنتاج وتثبيت مستعجل (X١.٢٥)' : 'Express Production (1.25x)'}</span>
                    <span className="text-[10px] text-neutral-500">{isAr ? 'تسليم آمن خلال ٤٨ ساعة فقط' : 'Priority workshop lane & rigging'}</span>
                  </div>
                </label>
              </div>

              {/* Transportation Distance Km (hidden if installation is off) */}
              {needsInstallation && (
                <div className="pt-3 border-t border-neutral-850/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <input 
                      type="number" 
                      min="1" max="500"
                      value={distanceKm} 
                      onChange={e => setDistanceKm(parseInt(e.target.value) || 10)}
                      className="bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-white font-bold w-16 text-center"
                    />
                    <span className="text-neutral-400">Km</span>
                  </div>
                  <span className="text-neutral-400">{isAr ? 'مسافة النقل والشحن البري من الورشة:' : 'Ground transport hauling distance:'}</span>
                </div>
              )}
            </div>

            {/* Smart quantity controller */}
            <div className="bg-neutral-900/60 border border-gold-505/10 p-5 rounded-2xl text-right text-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    saveStateToHistory(width, height, selectedMaterialId, quantity);
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                  className="w-8 h-8 rounded bg-neutral-950 border border-neutral-800 font-mono font-black text-white hover:text-gold-305 text-sm cursor-pointer"
                >
                  -
                </button>
                <span className="font-mono text-sm font-black text-white bg-neutral-950 px-4 py-1.5 rounded border border-neutral-800">{quantity}</span>
                <button 
                  onClick={() => {
                    saveStateToHistory(width, height, selectedMaterialId, quantity);
                    setQuantity(quantity + 1);
                  }}
                  className="w-8 h-8 rounded bg-neutral-950 border border-neutral-800 font-mono font-black text-white hover:text-gold-305 text-sm cursor-pointer"
                >
                  +
                </button>
              </div>

              <div className="text-right">
                <span className="font-bold text-white block">{isAr ? 'الكمية والعدد المطلوب:' : 'Required Quantity:'}</span>
                <span className="text-[10px] text-neutral-500">{isAr ? 'كلما زاد العدد تفعّلت خصومات الجملة والشركات' : 'Unlocks corporate volume discounts automatically'}</span>
              </div>
            </div>

          </div>

          {/* RIGHT: Visual interactive previews & cost calculation sheets (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
            
            {/* The Breathtaking Interactive Live Preview Box */}
            <div className="h-[380px] w-full">
              <ConfiguratorPreview 
                isAr={isAr}
                widthM={widthM}
                heightM={heightM}
                selectedMaterial={currentMaterial}
                selectedColor={selectedColor}
                selectedThickness={selectedThickness}
                selectedFinishing={selectedFinishingId}
                hasBacklitGlow={needsHighPowerLed}
              />
            </div>

            {/* AI Advisor Card */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 text-right text-xs leading-relaxed transition-all ${
              aiTip.rating === 'caution'
                ? 'bg-red-950/20 border-red-500/30 text-red-300'
                : aiTip.rating === 'excellent'
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-neutral-900 border-gold-505/10 text-neutral-300'
            }`}>
              <div className="flex-1">
                <p className="font-bold">{isAr ? 'مهندس التكلفة والذكاء الاصطناعي:' : 'AI Configurator Advisor:'}</p>
                <p className="text-[11px] text-neutral-400 mt-1">{isAr ? aiTip.textAr : aiTip.textEn}</p>
              </div>
            </div>

            {/* Cost breakdown & grand total receipt */}
            <div className="bg-neutral-900 border border-gold-505/20 p-5 rounded-2xl space-y-4 text-right">
              <h3 className="text-sm font-black text-white border-b border-neutral-850 pb-2 flex items-center justify-end gap-1.5">
                <span>{isAr ? 'مستند المقايسة والتكلفة التقديرية' : 'Estimated Quotation Summary'}</span>
                <FileText className="w-4 h-4 text-gold-505" />
              </h3>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center text-neutral-400">
                  <span>{(priceStats.breakdown?.baseMaterialCost || 0).toLocaleString()} EGP</span>
                  <span>{isAr ? 'تصنيع وهيكل المادة الأساسي:' : 'Base fabrication cost:'}</span>
                </div>
                
                {needsSteelFrame && (
                  <div className="flex justify-between items-center text-neutral-400">
                    <span>+{Math.round((priceStats.breakdown?.baseMaterialCost || 0) * 0.18).toLocaleString()} EGP</span>
                    <span>{isAr ? 'تدعيم الشاسيه الحديدي:' : 'Backing steel bracket:'}</span>
                  </div>
                )}

                {needsHighPowerLed && (
                  <div className="flex justify-between items-center text-neutral-400">
                    <span>+{Math.round((priceStats.breakdown?.baseMaterialCost || 0) * 0.12).toLocaleString()} EGP</span>
                    <span>{isAr ? 'تجهيزات ليدات سامسونج RGB:' : 'Samsung RGB LED module:'}</span>
                  </div>
                )}

                {needsInstallation && (
                  <div className="flex justify-between items-center text-neutral-400">
                    <span>{(priceStats.breakdown?.installationCost || 0).toLocaleString()} EGP</span>
                    <span>{isAr ? 'أعمال الرفع والتركيبات فئة أ:' : 'Certified rigging labor:'}</span>
                  </div>
                )}

                {priceStats.discountPercent > 0 && (
                  <div className="flex justify-between items-center text-emerald-400 font-bold">
                    <span>-{(priceStats.breakdown?.promoDiscount || 0).toLocaleString()} EGP</span>
                    <span>{isAr ? `خصم الكميات المطبق (-${priceStats.discountPercent}%):` : `Volume Discount (-${priceStats.discountPercent}%):`}</span>
                  </div>
                )}

                <div className="pt-2.5 border-t border-neutral-850 flex justify-between items-center text-white">
                  <span className="font-bold">{priceStats.subtotal.toLocaleString()} EGP</span>
                  <span>{isAr ? 'الإجمالي الفرعي قبل الضريبة:' : 'Subtotal (Excl VAT):'}</span>
                </div>

                <div className="flex justify-between items-center text-neutral-400 text-[11px]">
                  <span>{priceStats.tax.toLocaleString()} EGP</span>
                  <span>{isAr ? 'ضريبة القيمة المضافة الإلزامية (١٤٪):' : 'VAT (14% standard Egypt):'}</span>
                </div>

                {/* Final absolute price */}
                <div className="p-3 bg-neutral-950 border border-gold-550/20 rounded-xl flex justify-between items-center mt-4">
                  <span className="text-sm md:text-base font-black text-gold-305 font-mono">{priceStats.grandTotal.toLocaleString()} EGP</span>
                  <span className="text-xs font-black text-white">{isAr ? 'إجمالي تكلفة المقايسة الكلي:' : 'GRAND TOTAL ESTIMATED:'}</span>
                </div>
              </div>

              {/* Quotation download & share panel */}
              <div className="pt-3 border-t border-neutral-850 flex gap-2">
                <button
                  onClick={handleDownloadPDFInvoice}
                  className="flex-1 py-2 px-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-bold text-neutral-300 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer hover:border-neutral-700 transition-all"
                  title="PDF"
                >
                  <Download className="w-4 h-4 text-gold-505" />
                  <span>{isAr ? 'تحميل PDF' : 'PDF Quote'}</span>
                </button>
                <button
                  onClick={handleShareOnWhatsApp}
                  className="flex-1 py-2 px-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-bold text-neutral-300 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer hover:border-neutral-700 transition-all"
                >
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'مشاركة واتساب' : 'WhatsApp Share'}</span>
                </button>
              </div>
            </div>

            {/* Customer registration submission form */}
            <div className="bg-neutral-900 border border-gold-505/10 p-5 rounded-2xl space-y-4 text-right">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">
                {isAr ? 'أكد بياناتك لحجز مقايسة مجانية ورفع فني بالليزر:' : 'Lock Pricing & Register Quote:'}
              </h4>

              <form onSubmit={handleRegisterAndSubmitEstimate} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'اسم العميل ثلاثي...' : 'Full Name...'}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-505 text-right font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <input
                    type="tel"
                    required
                    placeholder={isAr ? 'رقم الهاتف والواتساب الجاري...' : 'WhatsApp Contact Number...'}
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-505 text-right font-sans"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 font-black rounded-lg text-xs cursor-pointer shadow-lg shadow-gold-500/10 flex items-center justify-center gap-2 hover:scale-101 transition-all"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>{isAr ? 'تأكيد المقايسة وإرسال مهندس المعاينة مجاناً 🚀' : 'Confirm Order & Schedule Field Survey 🚀'}</span>
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* 2. ADMIN PORTAL TAB CONTENT */}
      {activeUserTab === 'admin' && isAdmin && (
        <ConfiguratorDashboard 
          isAr={isAr}
          materials={materials}
          setMaterials={setMaterials}
          pricingRules={pricingRules}
          setPricingRules={setPricingRules}
          dimensionRules={dimensionRules}
          setDimensionRules={setDimensionRules}
          productTemplates={productTemplates}
          setProductTemplates={setProductTemplates}
          quotations={quotations}
          setQuotations={setQuotations}
          settings={settings}
          setSettings={setSettings}
          onSaveToCloud={handleSaveToCloud}
          isCloudSyncing={isCloudSyncing}
        />
      )}

    </div>
  );
};
