/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { CompanyInfo, PageId } from '../types';
import { Mail, Phone, MapPin, Send, MessageSquare, Calculator, Check, Sparkles, Trash2, Printer, Download, Plus, Landmark, ExternalLink } from 'lucide-react';

interface Props {
  isAr: boolean;
  companyInfo: CompanyInfo;
  setActivePage: (page: PageId) => void;
  onAddInquiry?: (inquiry: any) => void;
}

interface SavedEstimate {
  id: string;
  category: string;
  categoryLabel: string;
  productLabel: string;
  dimensions: string;
  quantity: number;
  subtotal: number;
  vat: number;
  total: number;
  date: string;
}

export default function Contact({ isAr, companyInfo, setActivePage, onAddInquiry }: Props) {
  // Quote calculator categories
  const [calcCategory, setCalcCategory] = useState<'signage' | 'printing' | 'digital'>('signage');

  // Input States
  const [selectedProduct, setSelectedProduct] = useState<string>('acrylic');
  const [widthM, setWidthM] = useState<number>(3.5);
  const [heightM, setHeightM] = useState<number>(1.2);
  const [quantity, setQuantity] = useState<number>(10);

  // Add-ons States
  const [addonSteelSupport, setAddonSteelSupport] = useState<boolean>(false);
  const [addonTitaniumFinish, setAddonTitaniumFinish] = useState<boolean>(false);
  const [addonSamsungRGB, setAddonSamsungRGB] = useState<boolean>(false);
  const [addonRushDelivery, setAddonRushDelivery] = useState<boolean>(false);

  // Saved quotes state
  const [savedQuotes, setSavedQuotes] = useState<SavedEstimate[]>([]);

  // Contact form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [messageSubmitted, setMessageSubmitted] = useState(false);

  // PRODUCT METADATA & UNIT PRICES DEFINITIONS
  const productDatabase = {
    signage: [
      { id: 'acrylic', nameAr: 'حروف أكريليك مضيئة', nameEn: 'Acrylic Letters', unitRate: 480, pricingModel: 'letter-inch' },
      { id: 'stainless', nameAr: 'حروف استانلس ستيل فاخرة', nameEn: 'Stainless Steel Letters', unitRate: 620, pricingModel: 'letter-inch' },
      { id: 'illuminated', nameAr: 'حروف مضيئة كورية صب', nameEn: 'Illuminated Letters', unitRate: 750, pricingModel: 'letter-inch' },
      { id: 'channel', nameAr: 'حروف ليد بارزة ألواح', nameEn: 'Channel Letters', unitRate: 680, pricingModel: 'letter-inch' },
      { id: 'flex', nameAr: 'يافطة فليكس فیس مضيئة', nameEn: 'Flex Face Signs', unitRate: 3500, pricingModel: 'sqm' },
      { id: 'led', nameAr: 'شاشات عرض ليد رقمية متحركة', nameEn: 'LED Signs', unitRate: 14500, pricingModel: 'sqm' },
      { id: 'cladding_facade', nameAr: 'واجهات كلادينج ألومنيوم معزول', nameEn: 'Cladding Facades', unitRate: 2605, pricingModel: 'sqm' },
      { id: 'shopfront', nameAr: 'لافتة واجهة محلات متكاملة', nameEn: 'Shopfront Signs', unitRate: 7800, pricingModel: 'sqm' },
      { id: 'totem', nameAr: 'توتيم إعلاني معدني خارجي', nameEn: 'Totems', unitRate: 42000, pricingModel: 'piece' },
      { id: 'pylon', nameAr: 'أعمدة لافتات إعلامية عملاقة', nameEn: 'Pylons', unitRate: 115000, pricingModel: 'piece' },
    ],
    printing: [
      { id: 'banners', nameAr: 'بنر إعلاني خارجي مشدود', nameEn: 'Banners', unitRate: 185, pricingModel: 'sqm' },
      { id: 'vinyl', nameAr: 'فينيل لاصق لواجهات الزجاج', nameEn: 'Vinyl', unitRate: 210, pricingModel: 'sqm' },
      { id: 'stickers', nameAr: 'ملصقات ومطبوعات ليزر', nameEn: 'Stickers', unitRate: 140, pricingModel: 'sqm' },
      { id: 'rollups', nameAr: 'رول آب إعلاني هيدروليكي', nameEn: 'Roll-Ups', unitRate: 1350, pricingModel: 'piece' },
      { id: 'brochures', nameAr: 'بروشورات تسويقية 3 طيات', nameEn: 'Brochures', unitRate: 4.8, pricingModel: 'piece' },
      { id: 'flyers', nameAr: 'فلايرات ورقية لمستويات النشر', nameEn: 'Flyers', unitRate: 2.5, pricingModel: 'piece' },
      { id: 'business_cards', nameAr: 'كروت شخصية لمسة مخملية', nameEn: 'Business Cards', unitRate: 1.5, pricingModel: 'piece' },
      { id: 'catalogs', nameAr: 'كتالوج بروفايل شركات فاخر', nameEn: 'Catalogs', unitRate: 42, pricingModel: 'piece' },
      { id: 'packaging', nameAr: 'علب وكرتون تعبئة فاخرة', nameEn: 'Packaging', unitRate: 19.5, pricingModel: 'piece' },
    ],
    digital: [
      { id: 'branding', nameAr: 'تصميم الهوية البصرية وشعار العلامة', nameEn: 'Branding', unitRate: 14000, pricingModel: 'piece' },
      { id: 'logo', nameAr: 'ابتكار وتصميم لوغو احترافي', nameEn: 'Logo Design', unitRate: 4800, pricingModel: 'piece' },
      { id: 'social', nameAr: 'إدارة وتصميم السوشيال ميديا (شهري)', nameEn: 'Social Media Management', unitRate: 8800, pricingModel: 'piece' },
      { id: 'websites', nameAr: 'تطوير موقع ويب تعريفي سريع للشركة', nameEn: 'Websites', unitRate: 17500, pricingModel: 'piece' },
      { id: 'mobile_apps', nameAr: 'برمجة تطبيق موبايل ذكي هجين', nameEn: 'Mobile Apps', unitRate: 49000, pricingModel: 'piece' },
      { id: 'motion', nameAr: 'فيديو موشن جرافيك ترويجي ثنائي الأبعاد', nameEn: 'Motion Graphics', unitRate: 11000, pricingModel: 'piece' },
      { id: 'marketing', nameAr: 'حملات تسويقية رقمية للتنمية', nameEn: 'Digital Marketing', unitRate: 9000, pricingModel: 'piece' },
      { id: 'seo', nameAr: 'تهيئة الموقع لمحركات البحث ومسك كلمات', nameEn: 'SEO', unitRate: 7200, pricingModel: 'piece' },
      { id: 'digital_products', nameAr: 'تصميم واجهة مستخدم UX للبرمجيات', nameEn: 'Digital Products', unitRate: 16000, pricingModel: 'piece' },
    ]
  };

  // Switch category defaults
  const handleCategorySwitch = (cat: 'signage' | 'printing' | 'digital') => {
    setCalcCategory(cat);
    const firstProd = productDatabase[cat][0];
    setSelectedProduct(firstProd.id);
    if (cat === 'signage') {
      setWidthM(3.5);
      setHeightM(1.2);
      setQuantity(10); // 10 letters
    } else if (cat === 'printing') {
      setWidthM(2);
      setHeightM(1);
      setQuantity(1000); // 1000 flyers
    } else if (cat === 'digital') {
      setWidthM(1);
      setHeightM(1);
      setQuantity(1); // 1 package
    }
  };

  // AREA MATH
  const areaSqm = Number((widthM * heightM).toFixed(2));

  // CURRENT RECONCILED PRODUCT DETAILS
  const currentProduct = productDatabase[calcCategory].find(p => p.id === selectedProduct) || productDatabase[calcCategory][0];

  // CALCULATE BASE RATE & SUB TOTAL VALUES
  const getCalculationBase = (): { rate: number, pricingLabel: string, baseSubtotal: number } => {
    const rate = currentProduct.unitRate;
    let baseSubtotal = 0;
    let pricingLabel = '';

    if (calcCategory === 'signage') {
      if (currentProduct.pricingModel === 'letter-inch') {
        // letterHeight * lettersCount * rate
        // Height in meters to cm conversion (default approx letter height is 40cm, or derived from layout height * 100 / font aspect ratio)
        const approxHeightCm = Math.round(heightM * 100 / 3) || 40;
        baseSubtotal = approxHeightCm * quantity * rate;
        pricingLabel = isAr ? `${approxHeightCm} سم ارتفاع لكل حرف` : `${approxHeightCm}cm height per letter`;
      } else if (currentProduct.pricingModel === 'sqm') {
        // Area * rate
        baseSubtotal = areaSqm * rate;
        pricingLabel = isAr ? 'سعر لكل متر مربع' : 'Price per SQM';
      } else {
        // flat piece * quantity
        baseSubtotal = rate * quantity;
        pricingLabel = isAr ? 'سعر القطعة المكتملة' : 'Flat rate per piece';
      }
    } else if (calcCategory === 'printing') {
      if (currentProduct.pricingModel === 'sqm') {
        baseSubtotal = areaSqm * quantity * rate;
        pricingLabel = isAr ? 'طباعة لكل متر مربع' : 'Print rate per SQM';
      } else {
        // Large volume discounts scaling
        const discountFactor = quantity >= 5000 ? 0.70 : quantity >= 2500 ? 0.80 : quantity >= 1000 ? 0.90 : 1.0;
        baseSubtotal = rate * quantity * discountFactor;
        pricingLabel = isAr ? 'سعر النسخة مع خصم الكميات' : 'Copy price with bulk discount';
      }
    } else if (calcCategory === 'digital') {
      baseSubtotal = rate * quantity;
      pricingLabel = isAr ? 'خدمة مدمجة' : 'Dedicated package';
    }

    return { rate, pricingLabel, baseSubtotal: Math.round(baseSubtotal) };
  };

  const { rate, pricingLabel, baseSubtotal } = getCalculationBase();

  // ADD-ONS VALUE MATH
  const getAddonsBreakdown = () => {
    let list: { labelAr: string, labelEn: string, val: number }[] = [];
    if (calcCategory === 'signage' || calcCategory === 'printing') {
      if (addonSteelSupport) {
        list.push({
          labelAr: 'شاسيه حديد ثقيل مشدود داعم',
          labelEn: 'Heavy-Duty Anti-corrosion Steel Frame',
          val: Math.round(baseSubtotal * 0.15)
        });
      }
      if (addonTitaniumFinish) {
        list.push({
          labelAr: 'معالجة تيتانيوم PVD ذهبي ميرور',
          labelEn: 'Premium PVD Titanium Gold Mirror finishing',
          val: Math.round(baseSubtotal * 0.20)
        });
      }
      if (addonSamsungRGB) {
        list.push({
          labelAr: 'نظام ليد سامسونج كوري ملوّن',
          labelEn: 'Korean Original Samsung Premium Multi-color LED',
          val: Math.round(baseSubtotal * 0.10)
        });
      }
    }
    if (addonRushDelivery) {
      list.push({
        labelAr: 'توصيل عاجل وتركيب في خلال 48 ساعة فقط',
        labelEn: 'Rapid 48hr Dispatch & Express Scaffolding',
        val: 4500
      });
    }
    return list;
  };

  const activeAddonsList = getAddonsBreakdown();
  const addonsTotalCost = activeAddonsList.reduce((acc, curr) => acc + curr.val, 0);

  // TAX (14% VAT) & FINAL SUMS
  const subtotalCost = baseSubtotal + addonsTotalCost;
  const vatEgyptTax = Math.round(subtotalCost * 0.14);
  const grandTotalCost = subtotalCost + vatEgyptTax;

  // WHATSAPP QUOTATION PRESET
  const handleWhatsAppQuote = () => {
    const title = isAr ? 'يافطة الفاخرة للدعاية والإعلان' : 'YAFTA Luxury Signage Platform';
    const clientDetailsStr = clientName ? `👤 ${isAr ? 'العميل:' : 'Client:'} ${clientName} | ${clientPhone}` : '';
    
    let breakdownLines = `
*${title}*
------------------------------
${clientDetailsStr}
📂 *${isAr ? 'نوع الخدمة:' : 'Category:'}* ${isAr ? (calcCategory === 'signage' ? 'لافتات ثلاثية الأبعاد' : calcCategory === 'printing' ? 'مطبوعات فاخرة' : 'حلول رقمية') : calcCategory.toUpperCase()}
💡 *${isAr ? 'المنتج:' : 'Product:'}* ${isAr ? currentProduct.nameAr : currentProduct.nameEn}
📐 *${isAr ? 'المقاس المقدر:' : 'Dimensions:'}* ${widthM}م × ${heightM}م (${areaSqm} ${isAr ? 'متر مربع' : 'Sqm'})
🔢 *${isAr ? 'الكمية/العدد:' : 'Quantity/Count:'}* ${quantity} ${isAr ? (calcCategory === 'signage' ? 'حرف/قطعة' : 'نسخة/عقد') : 'units'}

📊 *${isAr ? 'تفصيل التكلفة:' : 'Cost Breakdown:'}*
- ${isAr ? 'القيمة الأساسية:' : 'Base Subtotal:'} ${baseSubtotal.toLocaleString()} EGP (${pricingLabel})
${activeAddonsList.map(a => `- ${isAr ? a.labelAr : a.labelEn}: +${a.val.toLocaleString()} EGP`).join('\n')}

💰 *${isAr ? 'المجموع والضرائب:' : 'Summary & Tax:'}*
- ${isAr ? 'المجموع الفرعي وبدون ضريبة:' : 'Subtotal excl VAT:'} ${subtotalCost.toLocaleString()} EGP
- ${isAr ? 'ضريبة القيمة المضافة الإلزامية (14%):' : 'VAT (14% Egypt):'} ${vatEgyptTax.toLocaleString()} EGP
🏆 *${isAr ? 'إجمالي تكلفة المشروع:' : 'Grand Total Budget:'} ${grandTotalCost.toLocaleString()} EGP*
------------------------------
_✓ ${isAr ? 'مشمول تركيب ومعاينة هندسية ميدانية ورفع مقايسات مجاني.' : 'Included: Laser on-site measurement and 10-year structural warranty.'}_
    `;

    const enc = encodeURIComponent(breakdownLines.trim());
    window.open(`https://wa.me/${companyInfo.whatsapp || '201116210464'}?text=${enc}`, '_blank');
  };

  // ADD TO SAVED STORAGE LIST
  const handleSaveQuote = () => {
    const productLabel = isAr ? currentProduct.nameAr : currentProduct.nameEn;
    const categoryLabel = isAr ? (calcCategory === 'signage' ? 'لافتات وحروف' : calcCategory === 'printing' ? 'مطبوعات' : 'حلول رقمية') : calcCategory;
    const dateStr = new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    
    const newQuote: SavedEstimate = {
      id: Math.random().toString(36).substr(2, 9),
      category: calcCategory,
      categoryLabel,
      productLabel,
      dimensions: `${widthM}M x ${heightM}M (${areaSqm}m²)`,
      quantity,
      subtotal: subtotalCost,
      vat: vatEgyptTax,
      total: grandTotalCost,
      date: dateStr
    };

    setSavedQuotes([newQuote, ...savedQuotes]);
  };

  // REMOVE SAVED QUOTE
  const handleDeleteSaved = (id: string) => {
    setSavedQuotes(savedQuotes.filter(q => q.id !== id));
  };

  // PRINT ESTIMATE OVERLAY
  const handlePrintQuote = () => {
    window.print();
  };

  // CONTACT FORM ACTION
  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (clientName && clientPhone) {
      if (onAddInquiry) {
        onAddInquiry({
          name: clientName,
          phone: clientPhone,
          email: clientEmail,
          company: clientCompany || (isAr ? 'شراكة تجارية' : 'Corporate Account'),
          message: clientMessage || (isAr ? 'طلب معاينة مع الحوسبة' : 'Automated instant estimate review request'),
          category: isAr ? 'استبيان اتصال ومبيعات' : 'Contact Proposal',
          estimate: grandTotalCost,
          date: new Date().toLocaleDateString('ar-EG') + ', ' + new Date().toLocaleTimeString('ar-EG', { hour: 'numeric', minute: 'numeric', hour12: true }),
        });
      }
      setMessageSubmitted(true);
      setTimeout(() => {
        setClientName('');
        setClientPhone('');
        setClientEmail('');
        setClientCompany('');
        setClientMessage('');
        setMessageSubmitted(false);
      }, 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-16 font-sans">
      
      {/* Printable Sheet styling injected solely for window.print() */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background: white !important;
            color: black !important;
          }
          #print-invoice-sheet, #print-invoice-sheet * {
            visibility: visible;
          }
          #print-invoice-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

      {/* Secret hidden invoice sheet only visual on print command */}
      <div id="print-invoice-sheet" className="hidden">
        <div style={{ direction: isAr ? 'rtl' : 'ltr', textAlign: isAr ? 'right' : 'left', fontFamily: 'sans-serif' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid #e5c060', paddingBottom: '20px' }}>
            <div>
              <h1 style={{ color: '#000', margin: 0, fontWeight: 900 }}>YAFTA</h1>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>{isAr ? 'الهندسة واللافتات الإعلانية الفاخرة' : 'PREMIUM ARCHITECTURAL SIGNAGE'}</p>
            </div>
            <div style={{ textAlign: isAr ? 'left' : 'right' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{isAr ? 'مقايسة فنية رسمية مبدئية' : 'PROVISIONAL DESIGN ESTIMATE'}</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#666' }}>{isAr ? 'الموقع الإلكتروني الرسمي' : 'Official Portal Issued'}: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div style={{ margin: '40px 0', fontSize: '13px' }}>
            <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>{isAr ? 'تفاصيل بنود المشروع بالتحديد:' : 'Estimated Production Line Items:'}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', textAlign: isAr ? 'right' : 'left' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>{isAr ? 'الخدمة والملف' : 'Item Description'}</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>{isAr ? 'الأبعاد' : 'Sizing'}</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>{isAr ? 'الكمية' : 'Qty'}</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>{isAr ? 'التكلفة الإجمالية' : 'Total (EGP)'}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <strong>{isAr ? currentProduct.nameAr : currentProduct.nameEn}</strong><br/>
                    <small style={{ color: '#666' }}>{pricingLabel}</small>
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{widthM}M x {heightM}M ({areaSqm}m²)</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{quantity}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{baseSubtotal.toLocaleString()} EGP</td>
                </tr>
                {activeAddonsList.map((a, idx) => (
                  <tr key={idx}>
                    <td colSpan={3} style={{ padding: '10px', border: '1px solid #ddd', color: '#555' }}>
                      + {isAr ? a.labelAr : a.labelEn}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{a.val.toLocaleString()} EGP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
            <div style={{ width: '300px', fontSize: '13px', borderTop: '2px solid #ddd', paddingTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal excl tax:'}</span>
                <span>{subtotalCost.toLocaleString()} EGP</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <span>{isAr ? 'ضريبة القيمة المضافة (14%):' : 'VAT Egypt (14%):'}</span>
                <span>{vatEgyptTax.toLocaleString()} EGP</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '2px double #ddd', fontSize: '16px', fontWeight: 'bold', color: '#000' }}>
                <span>{isAr ? 'الإجمالي الكلي النهائي:' : 'GRAND TOTAL:'}</span>
                <span>{grandTotalCost.toLocaleString()} EGP</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '100px', borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '11px', color: '#777', textAlign: 'center' }}>
            <p>{isAr ? 'شركة يافطة للدعاية والإعلان - ورش التصنيع الثقيلة بالمنطقة الصناعية بالقاهرة بمصر.' : 'YAFTA CO. Signage Execs — Certified structures calculated by licensed engineers.'}</p>
          </div>
        </div>
      </div>

      {/* 1. Header Hero section */}
      <section className="text-center space-y-4 max-w-4xl mx-auto pt-8">
        <span className="text-xs font-bold tracking-[0.3em] text-[#e5c060] uppercase">
          {isAr ? 'بوابة الحوسبة السريعة وعروض الأسعار' : 'INTELLIGENT ENTERPISE QUOTE PLATFORM'}
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-normal">
          {isAr ? (
            <>
              احسب تكلفة واجهتك بـ <span className="gold-gradient-text drop-shadow-[0_2px_15px_rgba(229,192,96,0.35)]">الحسابات الأتوماتيكية</span> الفورية
            </>
          ) : (
            <>
              Autogenerate Your Facade Costing with <span className="gold-gradient-text drop-shadow-[0_2px_15px_rgba(229,192,96,0.35)]">Instant Calculations</span>
            </>
          )}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {isAr 
            ? 'تلتزم يافطة بتوفير أعلى مستويات الفخامة مع الأسعار الشفافة الموحدة بدون رسوم خفية. حدد الخدمة والأبعاد واحسب مقايسة مشروعك في ثوان كالمحترفين.' 
            : 'Access real-time, precise unit-rate evaluations across physical signs, corporate design and high-volume offset printing services backed by premium parameters.'}
        </p>
      </section>

      {/* 2. DYNAMIC INTERACTIVE PRICING CALCULATOR */}
      <section className="bg-neutral-950/70 rounded-3xl border border-[#e5c060]/20 overflow-hidden shadow-2xl relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-gold-950/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Switch Header bars */}
        <div className="p-6 md:p-8 bg-neutral-950/90 border-b border-[#e5c060]/10 flex flex-col lg:flex-row items-center justify-between gap-6 z-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gold-950 border border-[#e5c060]/30 flex items-center justify-center text-[#e5c060] shadow-md shadow-gold-500/5">
              <Calculator className="w-5 h-5 animate-pulse" />
            </div>
            <div className={`text-right ${isAr ? 'md:text-right' : 'md:text-left'}`}>
              <h3 className="text-lg font-extrabold text-white">{isAr ? 'مهندس التكلفة الذكي 📊' : 'Bespoke Production Quotation'}</h3>
              <p className="text-xs text-neutral-400">{isAr ? 'تقدير تسعيري موثّق مع احتساب مساحات الحائط والتيتانيوم والضرائب' : 'Reconciled material indices, area math and VAT 14% Egypt'}</p>
            </div>
          </div>

          {/* Calculator category segment switches */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-neutral-900 border border-gold-500/10 rounded-xl max-w-full">
            {[
              { id: 'signage', ar: 'لافتات ومجسمات ثلاثية الأبعاد 💡', en: '3D Signage 💡' },
              { id: 'printing', ar: 'مطبوعات وعلب كارتون 📦', en: 'Print & Packaging 📦' },
              { id: 'digital', ar: 'الهويات والحلول الرقمية 💻', en: 'Design & Software 💻' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySwitch(cat.id as any)}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
                  calcCategory === cat.id
                    ? 'bg-gradient-to-r from-gold-300 to-gold-500 text-black font-black scale-102 shadow-md shadow-gold-500/10'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isAr ? cat.ar : cat.en}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace core grids */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 relative">
          
          {/* LEFT: Inputs controls block (Col-span 2) */}
          <div className="lg:col-span-2 space-y-6 text-right font-sans">
            
            <div className={`grid grid-cols-1 ${calcCategory === 'digital' ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-6`}>
              {/* Dropdown product selectors */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#e5c060] flex items-center justify-end gap-1">
                  <span>{isAr ? 'اختر المنتج أو الموديل المحدد:' : 'Select Exact Product:'}</span>
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-neutral-900 border border-gold-550/15 text-xs text-neutral-200 rounded-xl p-3 focus:outline-none focus:border-[#e5c060] font-sans font-extrabold cursor-pointer text-right"
                >
                  {productDatabase[calcCategory].map(p => (
                    <option key={p.id} value={p.id}>{isAr ? p.nameAr : p.nameEn}</option>
                  ))}
                </select>
              </div>

              {/* Sizing Width/Height sliders (Not required for Pure Flat rate digital packages) */}
              {calcCategory !== 'digital' && (
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-[#e5c060]">
                    {isAr ? 'مقاس واجهة المبنى أو التصميم (متر):' : 'Rough Design Sizing (Meters):'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 bg-neutral-900 border border-gold-500/10 rounded-xl p-2.5">
                      <span className="text-[10px] text-neutral-400 block">{isAr ? 'العرض (W)' : 'Width (W)'}</span>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gold-300 font-mono font-bold">M</span>
                        <input
                          type="number"
                          step="0.1"
                          min="0.5"
                          max="25"
                          value={widthM}
                          onChange={(e) => setWidthM(Math.max(0.2, parseFloat(e.target.value) || 0.2))}
                          className="bg-transparent text-white font-extrabold text-sm text-right w-16 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 bg-neutral-900 border border-gold-500/10 rounded-xl p-2.5">
                      <span className="text-[10px] text-neutral-400 block">{isAr ? 'الارتفاع (H)' : 'Height (H)'}</span>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gold-300 font-mono font-bold">M</span>
                        <input
                          type="number"
                          step="0.1"
                          min="0.2"
                          max="15"
                          value={heightM}
                          onChange={(e) => setHeightM(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                          className="bg-transparent text-white font-extrabold text-sm text-right w-16 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Middle Section: Auto calculations area & Volume Quantity inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-gold-500/10">
              
              {/* Dynamic computed specs container */}
              <div className="bg-neutral-900/60 border border-gold-500/10 rounded-2xl p-4 flex flex-col justify-center space-y-1 text-center font-mono">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">{isAr ? 'تحليل المساحة الهندسية التلقائي' : 'DYNAMIC GEOMETRIC COMPILATION'}</span>
                {calcCategory !== 'digital' ? (
                  <div className="text-2xl font-black text-white py-1">
                    <span className="text-gold-300">{areaSqm}</span>
                    <span className="text-xs text-neutral-400 font-sans ml-1">{isAr ? 'متر مربع (m²)' : 'SQM'}</span>
                  </div>
                ) : (
                  <div className="text-xl font-bold text-[#e5c060] py-1 font-sans">
                    {isAr ? 'باقة مخصصة للشركات' : 'Integrated Enterprise Spec'}
                  </div>
                )}
                <span className="text-[9px] text-neutral-500 font-sans">
                  {isAr 
                    ? `*معدل تسعير الوحدة للمنتج الحصري: ${rate.toLocaleString()} ج.م (${pricingLabel})` 
                    : `*Reconciled Unit Pricing Rate: ${rate.toLocaleString()} EGP (${pricingLabel})`}
                </span>
              </div>

              {/* Quantity dynamic inputs */}
              <div className="space-y-2 text-right">
                <label className="text-xs font-extrabold text-[#e5c060] block">
                  {calcCategory === 'signage' 
                    ? (isAr ? 'عدد الحروف الكلي المتوقع بالشعار:' : 'Estimated Total Character Count:')
                    : calcCategory === 'printing'
                    ? (isAr ? 'الكمية الإجمالية المطلوبة (كروت/بروشور/بنر):' : 'Quantity Volume Required:')
                    : (isAr ? 'عدد العقود أو الإضافات كعناصر:' : 'Number of accounts/bundles:')}
                </label>
                
                <div className="bg-neutral-900 border border-gold-550/15 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    {calcCategory === 'signage' ? (isAr ? 'حرف بارز' : 'letters') : calcCategory === 'printing' ? (isAr ? 'نسخة برنت' : 'copies') : (isAr ? 'حزم' : 'bundle')}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={100000}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="bg-transparent text-white text-base font-extrabold text-left w-24 focus:outline-none font-mono"
                  />
                </div>

                {calcCategory === 'signage' && currentProduct.pricingModel === 'letter-inch' && (
                  <span className="text-[10px] text-neutral-400 block">
                    {isAr ? `💡 الارتفاع التقريبي لكل حرف بارز هو ${Math.round(heightM * 100 / 3) || 40} سم حسب توازن الواجهة.` : `💡 Approx calculated character line height is ${Math.round(heightM * 100 / 3) || 40}cm.`}
                  </span>
                )}
              </div>
            </div>

            {/* Structural Add-ons options selections */}
            <div className="space-y-3 pt-4 border-t border-gold-500/5 text-right">
              <span className="text-xs font-extrabold text-[#e5c060] block">
                {isAr ? 'العناصر الهيكلية والإضافات الاختيارية (مقاومة الصدأ والعواصف):' : 'Enterprise Structural Upgrades (Wind & Salt Shielding):'}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-xs">
                {/* Structural support chassis - signage or prints */}
                {(calcCategory === 'signage' || calcCategory === 'printing') && (
                  <>
                    <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      addonSteelSupport ? 'bg-gold-950/40 border-[#e5c060] text-white' : 'bg-neutral-900/30 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}>
                      <input 
                        type="checkbox" 
                        checked={addonSteelSupport}
                        onChange={(e) => setAddonSteelSupport(e.target.checked)}
                        className="rounded-md border-neutral-800 accent-[#e5c060] w-4 h-4"
                      />
                      <div className="flex-1">
                        <span className="font-extrabold text-white block">{isAr ? 'هيكل حديدي ثقيل مدعّم (+15%)' : 'Heavy-Duty Steel Chassis (+15%)'}</span>
                        <span className="text-[9px] text-neutral-400 block font-normal">{isAr ? 'زاويا حديد ميكانيكية 2 بوصة مقاومة لعصف الرياح القوية بمصر' : 'Rigid 2" black iron support frame structurally welded'}</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      addonTitaniumFinish ? 'bg-gold-950/40 border-[#e5c060] text-white' : 'bg-neutral-900/30 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}>
                      <input 
                        type="checkbox" 
                        checked={addonTitaniumFinish}
                        onChange={(e) => setAddonTitaniumFinish(e.target.checked)}
                        className="rounded-md border-neutral-800 accent-[#e5c060] w-4 h-4"
                      />
                      <div className="flex-1">
                        <span className="font-extrabold text-white block">{isAr ? 'تغليف تيتانيوم PVD ذهبي ميرور (+20%)' : 'PVD Titanium Mirror Coating (+20%)'}</span>
                        <span className="text-[9px] text-neutral-400 block font-normal">{isAr ? 'طلاء تيتانيوم من الصنف الأول يمنع الرطوبة وتغير البريق لـ 10 سنوات' : 'Sputtered luxury titanium rose/yellow gold mirror casing'}</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      addonSamsungRGB ? 'bg-gold-950/40 border-[#e5c060] text-white' : 'bg-neutral-900/30 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}>
                      <input 
                        type="checkbox" 
                        checked={addonSamsungRGB}
                        onChange={(e) => setAddonSamsungRGB(e.target.checked)}
                        className="rounded-md border-neutral-800 accent-[#e5c060] w-4 h-4"
                      />
                      <div className="flex-1">
                        <span className="font-extrabold text-white block">{isAr ? 'إنارة سامسونج RGB ملوّنة ذكية (+10%)' : 'Samsung Smart RGB Lighting (+10%)'}</span>
                        <span className="text-[9px] text-neutral-400 block font-normal">{isAr ? 'ديودات كورية تفرز طيف نيون تفاعلي وتتحكم به بالموبايل' : 'App-controlled low-amperage Korean chips with bluetooth interface'}</span>
                      </div>
                    </label>
                  </>
                )}

                {/* Rush express delivery - available globally */}
                <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  addonRushDelivery ? 'bg-gold-950/40 border-[#e5c060] text-white' : 'bg-neutral-900/30 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}>
                  <input 
                    type="checkbox" 
                    checked={addonRushDelivery}
                    onChange={(e) => setAddonRushDelivery(e.target.checked)}
                    className="rounded-md border-neutral-800 accent-[#e5c060] w-4 h-4"
                  />
                  <div className="flex-1">
                    <span className="font-extrabold text-white block">{isAr ? 'تصنيع وتركيب عاجل خلال 48 ساعة (+4,500 ج.م)' : 'Rush Fabrication 48hr (+4,500 EGP)'}</span>
                    <span className="text-[9px] text-neutral-400 block font-normal">{isAr ? 'أولوية قصوى لورش الليزر والحدادة لإنهاء المعاينة والتعليق الفوري' : 'Laser cutters & argon welders assigned on double-shifts'}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Standard preformed inclusions */}
            <div className="bg-neutral-900/20 p-4 rounded-xl border border-gold-500/10 mt-4 text-neutral-300">
              <span className="text-[10px] font-extrabold text-[#e5c060] block mb-1">
                {isAr ? 'مزايا فنية تقدمها شركة يافطة مجاناً مع التقييم:' : 'YAFTA Complementary Engineering Package:'}
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px] text-neutral-400">
                <li>✓ {isAr ? 'عزل كامل رطوبة IP67 وترانسات معزولة' : 'Full Rain / Storm protection IP67 block'}</li>
                <li>✓ {isAr ? 'ثلاثة سنوات ضمان وتغيير مجاني للمشغل' : '3-year replacement guarantee on transformers'}</li>
                <li>✓ {isAr ? 'لوحات تصميم ومحاكاة نيون نهارية وليلية' : 'Full HD dual simulated spatial previews'}</li>
              </ul>
            </div>
          </div>

          {/* RIGHT: Live invoice breakdown & active pricing estimates */}
          <div className="bg-neutral-950 p-6 rounded-2xl border border-gold-550/20 flex flex-col justify-between space-y-6">
            
            {/* Computed sum indicators */}
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-[9px] uppercase font-mono font-black tracking-widest text-[#e5c060] bg-gold-950/80 px-2.5 py-1.5 rounded-full border border-[#e5c060]/30 inline-block">
                  {isAr ? 'تقدير بنود الفاتورة المبدئية' : 'LIVE BUDGET PROPOSAL SHEET'}
                </span>
                
                <div className="text-4xl md:text-5xl font-black text-white py-4 font-mono select-all tracking-tight drop-shadow-[0_2px_15px_rgba(229,192,96,0.25)]">
                  <span className="gold-gradient-text">
                    {grandTotalCost.toLocaleString()}
                  </span>
                  <span className="text-xs text-neutral-400 font-sans block mt-1.5">{isAr ? 'جنيه مصري شامل القيمة المضافة' : 'Egyptian Pounds (Incl. VAT Egypt)'}</span>
                </div>
              </div>

              {/* itemized list items sheet details */}
              <div className="border-t border-gold-500/10 pt-3 space-y-2 text-xs font-sans">
                <div className="flex justify-between text-neutral-400">
                  <span className="font-mono">{baseSubtotal.toLocaleString()} EGP</span>
                  <span>{isAr ? 'القيمة الأساسية للمنتج:' : 'Base price:'}</span>
                </div>
                
                {activeAddonsList.map((a, i) => (
                  <div key={i} className="flex justify-between text-neutral-400">
                    <span className="font-mono">+{a.val.toLocaleString()} EGP</span>
                    <span className="text-right text-[11px] max-w-[170px] line-clamp-1">{isAr ? a.labelAr : a.labelEn}</span>
                  </div>
                ))}

                <div className="border-t border-neutral-900 pt-1 flex justify-between text-neutral-300 font-bold">
                  <span className="font-mono">{subtotalCost.toLocaleString()} EGP</span>
                  <span>{isAr ? 'المجموع بدون ضريبة:' : 'Subtotal:'}</span>
                </div>

                <div className="flex justify-between text-neutral-400 text-[11px]">
                  <span className="font-mono">{vatEgyptTax.toLocaleString()} EGP</span>
                  <span>{isAr ? 'ضريبة القيمة المضافة (14%):' : 'Egypt VAT (14%):'}</span>
                </div>
              </div>
            </div>

            {/* Actions triggers button group */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleWhatsAppQuote}
                className="w-full py-3.5 bg-[#075e54] hover:bg-[#128c7e] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/40"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>{isAr ? 'إرسال المقايسة ومراجعتها واتساب 💬' : 'Approve & Send on WhatsApp 💬'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSaveQuote}
                  className="py-2.5 bg-neutral-900 border border-gold-505/20 hover:border-gold-300 text-gold-300 hover:bg-neutral-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  title="Save Quote locally for side-by-side comparison"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'حفظ الحوسبة' : 'Save as Draft'}</span>
                </button>

                <button
                  onClick={handlePrintQuote}
                  className="py-2.5 bg-neutral-900 border border-gold-505/20 hover:border-gold-300 text-gold-300 hover:bg-neutral-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isAr ? 'طباعة المقايسة' : 'Print Invoice'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2.5 LOCAL SAVED ESTIMATES DRAWER (If any saved) */}
      {savedQuotes.length > 0 && (
        <section className="bg-neutral-950 p-6 rounded-3xl border border-gold-500/10 space-y-4">
          <div className="flex items-center justify-between border-b border-gold-500/10 pb-3">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-pulse"></span>
              <span>{isAr ? `المقايسات التقديرية المحفوظة لديك (${savedQuotes.length})` : `My Saved Session Quotations (${savedQuotes.length})`}</span>
            </h4>
            <span className="text-[10px] text-neutral-400 font-mono">Offline session database stored locally</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedQuotes.map((q) => (
              <div key={q.id} className="bg-neutral-950 border border-gold-505/15 rounded-2xl p-4 flex flex-col justify-between space-y-4 relative hover:border-gold-400 transition-all">
                <div className="space-y-2 text-right">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => handleDeleteSaved(q.id)}
                      className="p-1 rounded bg-neutral-900 text-red-400 hover:text-red-300 hover:bg-red-950/40 cursor-pointer"
                      title="Delete Quote"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[9px] font-mono text-neutral-400">{q.date}</span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="font-extrabold text-[#e5c060] text-sm">{q.productLabel}</p>
                    <p className="text-neutral-300"><span className="text-neutral-500">{isAr ? 'المواصفات:' : 'Specs:'}</span> {q.dimensions}</p>
                    <p className="text-neutral-300"><span className="text-neutral-500">{isAr ? 'الكمية لوغو:' : 'Qty:'}</span> {q.quantity}</p>
                  </div>
                </div>

                <div className="border-t border-neutral-900 pt-2.5 flex items-center justify-between">
                  <span className="font-mono font-black text-white text-base select-all">{q.total.toLocaleString()} EGP</span>
                  <span className="text-[9px] bg-gold-950 text-gold-300 border border-gold-505/20 px-2 py-0.5 rounded uppercase font-bold">{q.categoryLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. CONTACT CHANNELS & CUSTOM FORM */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 relative">
        
        {/* Contact info channels (Col-span 1) */}
        <div className="space-y-6">
          <div className="bg-neutral-950 p-6 rounded-2xl border border-gold-500/10 space-y-6">
            <h4 className="text-base font-black text-white">{isAr ? 'معلومات الاتصال المباشر:' : 'Direct Corporate Lines:'}</h4>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 text-right">
                <div className="w-10 h-10 rounded-xl bg-gold-950 border border-gold-505/20 flex items-center justify-center text-gold-505 shrink-0 mt-0.5 shadow">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-neutral-200">{isAr ? 'عنوان ورشتنا والإدارة:' : 'Main Factories & Boardroom:'}</p>
                  <p className="text-neutral-400 mt-1 leading-relaxed">{isAr ? companyInfo.addressAr : companyInfo.addressEn}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-right">
                <div className="w-10 h-10 rounded-xl bg-gold-950 border border-[#e5c060]/20 flex items-center justify-center text-[#e5c060] shrink-0 mt-0.5 shadow">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-neutral-200">{isAr ? 'اتصال المبيعات والمتابعة المباشرة:' : 'Direct Phone Lines:'}</p>
                  <p className="text-neutral-400 mt-1 font-mono hover:underline"><a href={`tel:${companyInfo.phone}`}>{companyInfo.phone}</a></p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-right">
                <div className="w-10 h-10 rounded-xl bg-gold-950 border border-gold-505/20 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5 shadow">
                  <MessageSquare className="w-4 h-4 text-emerald-500 fill-current" />
                </div>
                <div className="text-xs font-sans">
                  <p className="font-extrabold text-neutral-200">{isAr ? 'واتساب المراسلة الفورية مبيعات:' : 'Active WhatsApp Operations:'}</p>
                  <a href={`https://wa.me/${companyInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-gold-550 hover:underline text-gold-300 font-mono mt-1 block font-black">
                    {companyInfo.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 text-right">
                <div className="w-10 h-10 rounded-xl bg-gold-950 border border-[#e5c060]/20 flex items-center justify-center text-gold-505 shrink-0 mt-0.5 shadow">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-xs font-sans">
                  <p className="font-extrabold text-neutral-200">{isAr ? 'غرفة البريد الإلكتروني للعملاء:' : 'Email Desk:'}</p>
                  <p className="text-neutral-400 mt-1">
                    {companyInfo.emails[1]} <br />
                    {companyInfo.emails[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Genuine Geography visual widget */}
          <div className="bg-neutral-950 p-6 rounded-2xl border border-gold-500/10 space-y-4 text-center">
            <h4 className="text-sm font-bold text-white mb-2">{isAr ? 'موقعنا الجغرافي على الخريطة:' : 'Google Maps Location:'}</h4>
            
            <div className="h-36 bg-neutral-900 rounded-xl border border-gold-505/10 relative overflow-hidden flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400')` }}>
              <div className="absolute inset-0 bg-neutral-950/70"></div>
              <div className="relative z-10 text-center space-y-2">
                <MapPin className="w-8 h-8 text-[#e5c060] mx-auto animate-bounce" />
                <span className="text-[10px] text-white font-bold block">{isAr ? 'عين شمس - القاهرة' : 'Ain Shams, Cairo'}</span>
              </div>
            </div>

            <a 
              href="https://maps.google.com/?q=Ain+Shams+Cairo+Egypt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-3 bg-neutral-900 border border-[#e5c060]/20 hover:border-[#e5c060] text-gold-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{isAr ? 'فتح الموقع في خرائط Google' : 'Open in Google Maps'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Custom inquiry form submission wrapper */}
        <div className="lg:col-span-2 bg-neutral-950 p-6 md:p-8 rounded-2xl border border-gold-500/10 space-y-6">
          <div className="text-right md:text-right">
            <h4 className="text-lg font-black text-white">{isAr ? 'أرسل لنا بيانات مشروعك فنيًا ⚡' : 'Request Premium Structural Proposal:'}</h4>
            <p className="text-xs text-neutral-400 mt-1">{isAr ? 'قم بملء النموذج، وسيتم التواصل معك مباشرة بالهاتف لتنسيق موعد معاينة مجانًا في موقعك.' : 'Submit details to sync with our core engineering queue for certified blueprint design.'}</p>
          </div>

          {messageSubmitted ? (
            <div className="p-8 bg-emerald-950/40 border-2 border-emerald-500/25 rounded-2xl text-center space-y-3 animate-pulse">
              <Check className="w-12 h-12 text-emerald-400 mx-auto bg-emerald-900 rounded-full p-2.5 border border-emerald-505" />
              <h5 className="text-base font-black text-white">
                {isAr ? 'تم استلام وتمرير طلب معاينتك بنجاح! 🎉' : 'Inquiry Synced with CMS CRM Successfully! 🎉'}
              </h5>
              <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                {isAr 
                  ? 'تم استلام بياناتك لبرنامج المعاينة. تم إعطاؤك الأولوية، وسيتصل بكم أحد المندوبين بالهاتف اليوم للتنسيق والبدء.' 
                  : 'Your specifications and calculated grand-totals have been logged. Our structural layout division will contact you within one operational hour.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 text-right">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gold-300 font-bold block">{isAr ? 'الاسم الكامل والتحيّة:' : 'Full Name:'}</label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'أكتب أسمك الكريم هنا...' : 'e.g. Al-Mansoor'}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-neutral-900 border border-gold-500/15 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-505 text-right font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gold-300 font-bold block">{isAr ? 'رقم الهاتف (الخلوي):' : 'Phone Number (Required):'}</label>
                  <input
                    type="tel"
                    required
                    placeholder={isAr ? 'مثال: 01111621046' : '01xxxxxxxxx'}
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-neutral-900 border border-gold-500/15 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-505 text-right font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gold-300 font-bold block">{isAr ? 'البريد الإلكتروني:' : 'Email Address:'}</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-neutral-900 border border-gold-500/15 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-505 text-right font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gold-300 font-bold block">{isAr ? 'اسم الشركة أو المحل التجاري (اختياري):' : 'Company or Store Name (Optional):'}</label>
                  <input
                    type="text"
                    placeholder={isAr ? 'أكتب عيادتك، مطعمك أو علامتك الموقرة...' : 'e.g. Elite Lounge'}
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    className="w-full bg-neutral-900 border border-gold-500/15 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-505 text-right font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gold-300 font-bold block">{isAr ? 'تفاصيل ومتطلبات الاستمارة فنيًا:' : 'Inquiry details & custom instructions:'}</label>
                <textarea
                  rows={4}
                  placeholder={isAr ? 'أكتب هنا ملاحظات إضافية عن رغبتك بالواجهة أو لافتات النيون المقدرة...' : 'Any comments on colors, scaffolding, or special layouts...'}
                  value={clientMessage}
                  onChange={(e) => setClientMessage(e.target.value)}
                  className="w-full bg-neutral-900 border border-gold-500/15 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-505 text-right font-sans"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-gradient-to-r from-gold-300 to-gold-500 text-neutral-950 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-lg shadow-gold-500/5 hover:from-gold-200"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>{isAr ? 'إرسال المقايسة وبدء المعاينة الهندسية' : 'Transmit Sizing Inquiries'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </section>

    </div>
  );
}
