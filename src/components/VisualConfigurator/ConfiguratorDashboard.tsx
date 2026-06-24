import React, { useState } from 'react';
import { Material, PricingRule, DimensionRule, ProductTemplate, Quotation, ConfigSettings } from '../../types/configurator';
import { 
  Wrench, Layers, Sliders, DollarSign, FileCheck, HelpCircle, 
  Trash2, Plus, Edit, Check, X, ShieldCheck, TrendingUp, Save, 
  Sparkles, ListTodo, PlusCircle, ExternalLink, Calendar, Percent
} from 'lucide-react';

interface ConfiguratorDashboardProps {
  isAr: boolean;
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  pricingRules: PricingRule[];
  setPricingRules: React.Dispatch<React.SetStateAction<PricingRule[]>>;
  dimensionRules: DimensionRule[];
  setDimensionRules: React.Dispatch<React.SetStateAction<DimensionRule[]>>;
  productTemplates: ProductTemplate[];
  setProductTemplates: React.Dispatch<React.SetStateAction<ProductTemplate[]>>;
  quotations: Quotation[];
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>;
  settings: ConfigSettings;
  setSettings: React.Dispatch<React.SetStateAction<ConfigSettings>>;
  onSaveToCloud: (field: string, payload: any) => void;
  isCloudSyncing?: boolean;
}

export const ConfiguratorDashboard: React.FC<ConfiguratorDashboardProps> = ({
  isAr,
  materials,
  setMaterials,
  pricingRules,
  setPricingRules,
  dimensionRules,
  setDimensionRules,
  productTemplates,
  setProductTemplates,
  quotations,
  setQuotations,
  settings,
  setSettings,
  onSaveToCloud,
  isCloudSyncing = false
}) => {
  const [activeTab, setActiveTab] = useState<string>('materials');

  // Modal / Form States for Material
  const [editingMaterial, setEditingMaterial] = useState<Partial<Material> | null>(null);
  const [newMaterialMode, setNewMaterialMode] = useState<boolean>(false);

  // States for Pricing Rule
  const [editingRule, setEditingRule] = useState<Partial<PricingRule> | null>(null);
  const [newRuleMode, setNewRuleMode] = useState<boolean>(false);

  // States for Product Template
  const [editingTemplate, setEditingTemplate] = useState<Partial<ProductTemplate> | null>(null);
  const [newTemplateMode, setNewTemplateMode] = useState<boolean>(false);

  // Heuristic Calculator values
  const [calcWidth, setCalcWidth] = useState<number>(3.0);
  const [calcHeight, setCalcHeight] = useState<number>(1.2);
  const [calcMaterialId, setCalcMaterialId] = useState<string>(materials[0]?.id || 'acrylic');
  const [calcQty, setCalcQty] = useState<number>(10);
  const [calcFinishingId, setCalcFinishingId] = useState<string>('none');
  const [calcNeedsInstallation, setCalcNeedsInstallation] = useState<boolean>(true);
  const [calcDistance, setCalcDistance] = useState<number>(20); // in Km
  const [calcIsUrgent, setCalcIsUrgent] = useState<boolean>(false);

  // ════════════════════════════════════════════════════
  // 1. MATERIAL CRUD HANDLERS
  // ════════════════════════════════════════════════════
  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial || !editingMaterial.id) return;

    let updatedList: Material[];
    if (newMaterialMode) {
      updatedList = [...materials, editingMaterial as Material];
    } else {
      updatedList = materials.map(m => m.id === editingMaterial.id ? (editingMaterial as Material) : m);
    }

    setMaterials(updatedList);
    onSaveToCloud('materials', updatedList);
    setEditingMaterial(null);
    setNewMaterialMode(false);
  };

  const handleDeleteMaterial = (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذه المادة تماماً من الكتالوج؟' : 'Are you sure you want to delete this material?')) return;
    const updatedList = materials.filter(m => m.id !== id);
    setMaterials(updatedList);
    onSaveToCloud('materials', updatedList);
  };

  // ════════════════════════════════════════════════════
  // 2. PRICING RULES CRUD HANDLERS
  // ════════════════════════════════════════════════════
  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule || !editingRule.id) return;

    let updatedList: PricingRule[];
    if (newRuleMode) {
      updatedList = [...pricingRules, editingRule as PricingRule];
    } else {
      updatedList = pricingRules.map(r => r.id === editingRule.id ? (editingRule as PricingRule) : r);
    }

    setPricingRules(updatedList);
    onSaveToCloud('pricingRules', updatedList);
    setEditingRule(null);
    setNewRuleMode(false);
  };

  const handleDeleteRule = (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من إلغاء هذه القاعدة السعرية؟' : 'Are you sure you want to delete this pricing rule?')) return;
    const updatedList = pricingRules.filter(r => r.id !== id);
    setPricingRules(updatedList);
    onSaveToCloud('pricingRules', updatedList);
  };

  // ════════════════════════════════════════════════════
  // 3. PRODUCT TEMPLATE CRUD HANDLERS
  // ════════════════════════════════════════════════════
  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate || !editingTemplate.id) return;

    let updatedList: ProductTemplate[];
    if (newTemplateMode) {
      updatedList = [...productTemplates, editingTemplate as ProductTemplate];
    } else {
      updatedList = productTemplates.map(t => t.id === editingTemplate.id ? (editingTemplate as ProductTemplate) : t);
    }

    setProductTemplates(updatedList);
    onSaveToCloud('productTemplates', updatedList);
    setEditingTemplate(null);
    setNewTemplateMode(false);
  };

  const handleDeleteTemplate = (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا القالب؟' : 'Are you sure you want to delete this template?')) return;
    const updatedList = productTemplates.filter(t => t.id !== id);
    setProductTemplates(updatedList);
    onSaveToCloud('productTemplates', updatedList);
  };

  // ════════════════════════════════════════════════════
  // 4. QUOTATION MANAGER HANDLERS
  // ════════════════════════════════════════════════════
  const handleUpdateQuoteStatus = (id: string, status: 'pending' | 'approved' | 'rejected') => {
    const updatedList = quotations.map(q => q.id === id ? { ...q, status } : q);
    setQuotations(updatedList);
    onSaveToCloud('quotes', updatedList);
  };

  const handleDeleteQuote = (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا العرض بالكامل؟' : 'Are you sure you want to delete this quote?')) return;
    const updatedList = quotations.filter(q => q.id !== id);
    setQuotations(updatedList);
    onSaveToCloud('quotes', updatedList);
  };

  // ════════════════════════════════════════════════════
  // 5. SETTINGS UPDATES HANDLERS
  // ════════════════════════════════════════════════════
  const handleSaveGlobalSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveToCloud('settings', settings);
  };

  // ════════════════════════════════════════════════════
  // HEURISTIC COST CALCULATOR CORE ENGINE
  // ════════════════════════════════════════════════════
  const runEngineCalculations = () => {
    const material = materials.find(m => m.id === calcMaterialId) || materials[0];
    if (!material) return { subtotal: 0, tax: 0, total: 0, marginVal: 0, profitVal: 0 };

    const area = calcWidth * calcHeight;
    const baseMatCost = material.pricePerSqm * area;
    
    // Thickness added cost
    const thickCost = 0; // standard multiplier/factor is flat
    
    // Printing extra cost
    const printCost = settings.printingCostPerSqm * area;

    // Finishing
    const finishOpt = settings.finishingOptions.find(f => f.id === calcFinishingId) || settings.finishingOptions[0];
    let finishCost = 0;
    if (finishOpt) {
      finishCost = finishOpt.price > 5 ? finishOpt.price : baseMatCost * (finishOpt.price - 1);
    }

    // Assembly / Processing Base
    const procCost = settings.baseProcessingCost;

    // Installation
    const installCost = calcNeedsInstallation ? settings.installationCostPerSqm * area : 0;

    // Shipping
    const shipCost = calcDistance * settings.transportationCostPerKm;

    // Production Total Cost
    let totalProdCost = baseMatCost + thickCost + printCost + finishCost + procCost + installCost + shipCost;

    // Urgency
    if (calcIsUrgent) {
      totalProdCost *= settings.urgencyFactor;
    }

    // Profit Margin added values
    const profitMarginPercent = settings.profitMargin;
    const sellingPrice = Math.round(totalProdCost * (1 + profitMarginPercent / 100));
    const profitVal = sellingPrice - Math.round(totalProdCost);

    const taxVal = Math.round(sellingPrice * 0.14); // VAT
    const grandTotal = sellingPrice + taxVal;

    return {
      prodCost: Math.round(totalProdCost),
      sellingPrice,
      profitVal,
      taxVal,
      grandTotal,
      area
    };
  };

  const engineResults = runEngineCalculations();

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Mini Title bar with Live Cloud Sync Feedback */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900/60 p-4 rounded-xl border border-gold-505/10">
        <div className="flex items-center gap-2">
          {isCloudSyncing ? (
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          )}
          <span className="text-xs font-bold text-neutral-300 font-mono">
            {isCloudSyncing 
              ? (isAr ? 'جاري مزامنة الإعدادات فورياً بسحابة جوجل...' : 'Pushing delta payload to Firestore...')
              : (isAr ? 'قاعدة البيانات السحابية محدثة ومحمية بالكامل' : 'Global configurations fully persistent in Cloud')}
          </span>
        </div>

        <h3 className="text-base font-black text-white flex items-center gap-1.5 justify-end">
          <span>{isAr ? 'لوحة تحكم إعدادات التسعير والمنظومة' : 'Configurator Enterprise Management'}</span>
          <Sliders className="w-4.5 h-4.5 text-gold-505" />
        </h3>
      </div>

      {/* Internal Navigation Sub-tabs */}
      <div className="flex flex-wrap items-center justify-start gap-1.5 p-1 bg-neutral-900 rounded-xl" dir={isAr ? 'rtl' : 'ltr'}>
        {[
          { id: 'materials', labelAr: '🛠️ كتالوج الخامات', labelEn: 'Materials' },
          { id: 'rules', labelAr: '🏷️ قواعد الخصم', labelEn: 'Pricing Rules' },
          { id: 'dimensions', labelAr: '📐 حدود الأبعاد', labelEn: 'Dimensions' },
          { id: 'templates', labelAr: '📦 قوالب المنتجات', labelEn: 'Templates' },
          { id: 'quotes', labelAr: '📩 عروض الأسعار', labelEn: 'Quotes' },
          { id: 'cost_calc', labelAr: '📊 حاسبة الهوامش', labelEn: 'Margin Costing' },
          { id: 'production', labelAr: '⚙️ الإنتاج والشحن', labelEn: 'Production' },
          { id: 'installation', labelAr: '🏗️ التركيبات', labelEn: 'Installation' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
              activeTab === t.id
                ? 'bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 font-black'
                : 'text-neutral-400 hover:text-white bg-neutral-950/45'
            }`}
          >
            {isAr ? t.labelAr : t.labelEn}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          1. TAB: MATERIALS MANAGER
          ════════════════════════════════════════════════════ */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setEditingMaterial({
                  id: 'material_' + Date.now().toString(36),
                  nameAr: '',
                  nameEn: '',
                  descriptionAr: '',
                  descriptionEn: '',
                  image: 'https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=300',
                  thicknessOptions: [3, 5, 8],
                  thicknessPrices: { 3: 0, 5: 250, 8: 600 },
                  durabilityAr: 'عالية',
                  durabilityEn: 'High Durability',
                  indicator: 'both',
                  pricePerSqm: 3500,
                  badge: 'none',
                  advantagesAr: [],
                  advantagesEn: [],
                  disadvantagesAr: [],
                  disadvantagesEn: []
                });
                setNewMaterialMode(true);
              }}
              className="py-1.5 px-3.5 bg-gold-950 border border-gold-505/30 text-gold-300 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-gold-900"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة خامة جديدة للكتالوج' : 'Add New Material'}</span>
            </button>
            <h4 className="text-sm font-black text-gold-300">{isAr ? 'إدارة كتالوج المواد والأسعار الأساسية لكل متر مربع' : 'Material Catalog & Square-Meter Indexing'}</h4>
          </div>

          {/* Form Editor Panel */}
          {editingMaterial && (
            <form onSubmit={handleSaveMaterial} className="bg-neutral-900 border border-gold-505/20 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <button type="button" onClick={() => setEditingMaterial(null)} className="text-neutral-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
                <h5 className="text-xs font-black text-white uppercase tracking-widest font-mono">
                  {newMaterialMode ? (isAr ? 'إدخال خامة جديدة' : 'Insert Material') : (isAr ? 'تعديل بيانات الخامة' : 'Modify Material')}
                </h5>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'اسم الخامة (بالعربية):' : 'Name (Arabic):'}</label>
                  <input 
                    type="text" 
                    required
                    value={editingMaterial.nameAr || ''} 
                    onChange={e => setEditingMaterial({ ...editingMaterial, nameAr: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-505 text-right"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'اسم الخامة (بالإنجليزية):' : 'Name (English):'}</label>
                  <input 
                    type="text" 
                    required
                    value={editingMaterial.nameEn || ''} 
                    onChange={e => setEditingMaterial({ ...editingMaterial, nameEn: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-505 text-left"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'سعر البيع الأساسي (لكل متر مربع) ج.م:' : 'Base Price (per Sqm) EGP:'}</label>
                  <input 
                    type="number" 
                    required
                    value={editingMaterial.pricePerSqm || ''} 
                    onChange={e => setEditingMaterial({ ...editingMaterial, pricePerSqm: parseInt(e.target.value) || 0 })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-505 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'وسام أو شارة مميزة:' : 'Special Badge Indicator:'}</label>
                  <select 
                    value={editingMaterial.badge || 'none'} 
                    onChange={e => setEditingMaterial({ ...editingMaterial, badge: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-505"
                  >
                    <option value="none">{isAr ? 'بدون شارة' : 'None'}</option>
                    <option value="popular">{isAr ? 'الأكثر مبيعاً ⭐' : 'Most Popular ⭐'}</option>
                    <option value="premium">{isAr ? 'نخبة متميزة 💎' : 'Premium Luxury 💎'}</option>
                    <option value="recommended">{isAr ? 'موصى به هندسياً 👍' : 'Recommended 👍'}</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-neutral-400 block">{isAr ? 'وصف الخامة بالتفصيل (عربي):' : 'Detailed Description (Arabic):'}</label>
                  <textarea 
                    value={editingMaterial.descriptionAr || ''} 
                    onChange={e => setEditingMaterial({ ...editingMaterial, descriptionAr: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 h-16 text-white focus:outline-none focus:border-gold-505 text-right resize-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setEditingMaterial(null)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 rounded-lg text-xs font-black cursor-pointer shadow-md"
                >
                  {isAr ? 'حفظ الخامة وتحديث السحابة 💾' : 'Save & Publish to Cloud 💾'}
                </button>
              </div>
            </form>
          )}

          {/* Grid of Existing Materials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map(m => (
              <div key={m.id} className="bg-neutral-900/80 border border-neutral-800/80 p-4 rounded-xl flex flex-col justify-between space-y-3 hover:border-gold-505/20 transition-all">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => {
                          setEditingMaterial(m);
                          setNewMaterialMode(false);
                        }}
                        className="p-1 rounded bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
                        title={isAr ? 'تعديل' : 'Edit'}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteMaterial(m.id)}
                        className="p-1 rounded bg-red-950/20 text-red-400 hover:text-red-300 border border-red-900/20 cursor-pointer"
                        title={isAr ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <span className="text-xs font-black text-white">{isAr ? m.nameAr : m.nameEn}</span>
                  </div>

                  <p className="text-[10px] text-neutral-400 line-clamp-2 h-7">{isAr ? m.descriptionAr : m.descriptionEn}</p>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-gold-305 font-bold">{m.pricePerSqm.toLocaleString()} EGP</span>
                  <span className="text-[9px] bg-neutral-950 text-neutral-400 px-2 py-0.5 rounded border border-neutral-800">
                    {m.indicator === 'both' ? (isAr ? 'داخلي وخارجي' : 'Indoor/Outdoor') : m.indicator === 'indoor' ? (isAr ? 'داخلي فقط' : 'Indoor Only') : (isAr ? 'خارجي فقط' : 'Outdoor Only')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          2. TAB: PRICING RULES MANAGER
          ════════════════════════════════════════════════════ */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setEditingRule({
                  id: 'rule_' + Date.now().toString(36),
                  nameAr: '',
                  nameEn: '',
                  type: 'bulk',
                  discountPercent: 10,
                  minQty: 10,
                  active: true
                });
                setNewRuleMode(true);
              }}
              className="py-1.5 px-3.5 bg-gold-950 border border-gold-505/30 text-gold-300 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-gold-900"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة قاعدة خصم جديدة' : 'Add Discount Rule'}</span>
            </button>
            <h4 className="text-sm font-black text-gold-300">{isAr ? 'إدارة القواعد السعرية والمحفزات التسويقية ونسب الخصم' : 'Campaign Discounts & Dynamic Pricing Rules'}</h4>
          </div>

          {editingRule && (
            <form onSubmit={handleSaveRule} className="bg-neutral-900 border border-gold-505/20 p-5 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'عنوان القاعدة (عربي):' : 'Title (Arabic):'}</label>
                  <input 
                    type="text" required
                    value={editingRule.nameAr || ''} 
                    onChange={e => setEditingRule({ ...editingRule, nameAr: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-505 text-right"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'نسبة الخصم %:' : 'Discount Percent %:'}</label>
                  <input 
                    type="number" min="1" max="90" required
                    value={editingRule.discountPercent || ''} 
                    onChange={e => setEditingRule({ ...editingRule, discountPercent: parseInt(e.target.value) || 0 })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-505 font-mono"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingRule(null)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg text-xs font-bold">{isAr ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 rounded-lg text-xs font-black">{isAr ? 'تأكيد الحفظ' : 'Confirm Save'}</button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {pricingRules.map(r => (
              <div key={r.id} className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-850 flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  <button onClick={() => { setEditingRule(r); setNewRuleMode(false); }} className="p-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDeleteRule(r.id)} className="p-1 rounded bg-red-950/20 text-red-400 hover:text-red-300 border border-red-900/20 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-gold-950 text-gold-300 px-2.5 py-1 rounded font-mono font-bold">-{r.discountPercent}%</span>
                  <div className="text-right">
                    <p className="text-xs font-black text-white">{isAr ? r.nameAr : r.nameEn}</p>
                    <p className="text-[10px] text-neutral-500 font-mono">Min Quantity threshold: {r.minQty} units</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          3. TAB: DIMENSION RULES MANAGER
          ════════════════════════════════════════════════════ */}
      {activeTab === 'dimensions' && (
        <div className="space-y-4">
          <h4 className="text-sm font-black text-gold-300">{isAr ? 'إعدادات حدود ومقاسات لوحات الورشة والتركيبات' : 'Workshop Sizing Limits & Preset Templates'}</h4>
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-4">
            {dimensionRules.map(dim => (
              <div key={dim.id} className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-lg space-y-3 text-right">
                <h5 className="text-xs font-black text-gold-305 flex items-center justify-end gap-2">
                  <span>{isAr ? dim.nameAr : dim.nameEn}</span>
                  <Sliders className="w-4 h-4" />
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-850">
                    <span className="text-[10px] text-neutral-400 block">{isAr ? 'أقل عرض (م)' : 'Min Width'}</span>
                    <span className="text-white font-bold">{dim.minWidth} M</span>
                  </div>
                  <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-850">
                    <span className="text-[10px] text-neutral-400 block">{isAr ? 'أقصى عرض (م)' : 'Max Width'}</span>
                    <span className="text-white font-bold">{dim.maxWidth} M</span>
                  </div>
                  <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-850">
                    <span className="text-[10px] text-neutral-400 block">{isAr ? 'أقل ارتفاع (م)' : 'Min Height'}</span>
                    <span className="text-white font-bold">{dim.minHeight} M</span>
                  </div>
                  <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-850">
                    <span className="text-[10px] text-neutral-400 block">{isAr ? 'أقصى ارتفاع (م)' : 'Max Height'}</span>
                    <span className="text-white font-bold">{dim.maxHeight} M</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          4. TAB: PRODUCT TEMPLATES
          ════════════════════════════════════════════════════ */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setEditingTemplate({
                  id: 'temp_' + Date.now().toString(36),
                  nameAr: '',
                  nameEn: '',
                  category: 'signage',
                  baseMaterialId: materials[0]?.id || 'acrylic',
                  defaultWidth: 3.5,
                  defaultHeight: 1.2,
                  defaultQty: 10
                });
                setNewTemplateMode(true);
              }}
              className="py-1.5 px-3.5 bg-gold-950 border border-gold-505/30 text-gold-300 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-gold-900"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إنشاء قالب منتج جديد' : 'New Template'}</span>
            </button>
            <h4 className="text-sm font-black text-gold-300">{isAr ? 'قوالب ونماذج تسعير جاهزة للعملاء' : 'Configure Reusable Product Presets'}</h4>
          </div>

          {editingTemplate && (
            <form onSubmit={handleSaveTemplate} className="bg-neutral-900 border border-gold-505/20 p-5 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'اسم القالب (عربي):' : 'Name (Arabic):'}</label>
                  <input 
                    type="text" required
                    value={editingTemplate.nameAr || ''} 
                    onChange={e => setEditingTemplate({ ...editingTemplate, nameAr: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'الخامة الافتراضية الداعمة:' : 'Core Material:'}</label>
                  <select
                    value={editingTemplate.baseMaterialId || ''}
                    onChange={e => setEditingTemplate({ ...editingTemplate, baseMaterialId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                  >
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{isAr ? m.nameAr : m.nameEn}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingTemplate(null)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg text-xs font-bold">{isAr ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 rounded-lg text-xs font-black">{isAr ? 'حفظ القالب' : 'Save Template'}</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {productTemplates.map(t => (
              <div key={t.id} className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-850 flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  <button onClick={() => handleDeleteTemplate(t.id)} className="p-1 rounded bg-red-950/20 text-red-400 hover:text-red-300 border border-red-900/20 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <div className="text-right">
                  <h5 className="text-xs font-black text-white">{isAr ? t.nameAr : t.nameEn}</h5>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    Default: {t.defaultWidth}M × {t.defaultHeight}M | Qty: {t.defaultQty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          5. TAB: QUOTATIONS MANAGER
          ════════════════════════════════════════════════════ */}
      {activeTab === 'quotes' && (
        <div className="space-y-4">
          <h4 className="text-sm font-black text-gold-300">{isAr ? 'سجل عروض وأسعار العملاء ومراجعة الموافقات' : 'Global Client Quotations Log & Pipelines'}</h4>
          
          <div className="space-y-2.5 max-h-[400px] overflow-y-auto scrollbar-thin">
            {quotations.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 italic">
                {isAr ? 'لا يوجد طلبات تسعير مسجلة حالياً' : 'No recorded quotation logs found'}
              </div>
            ) : (
              quotations.map(q => (
                <div key={q.id} className="bg-neutral-900 p-4 rounded-xl border border-neutral-850 flex flex-col md:flex-row items-center justify-between gap-4 text-right">
                  
                  {/* Status Pipeline triggers */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button 
                      onClick={() => handleUpdateQuoteStatus(q.id, 'approved')}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                        q.status === 'approved' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-neutral-950 text-neutral-500 hover:text-white'
                      }`}
                    >
                      {isAr ? 'موافقة العميل ✓' : 'Approve ✓'}
                    </button>
                    <button 
                      onClick={() => handleUpdateQuoteStatus(q.id, 'rejected')}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                        q.status === 'rejected' 
                          ? 'bg-red-950 text-red-400 border border-red-500/30' 
                          : 'bg-neutral-950 text-neutral-500 hover:text-white'
                      }`}
                    >
                      {isAr ? 'مرفوض ❌' : 'Reject ❌'}
                    </button>
                    <button 
                      onClick={() => handleDeleteQuote(q.id)}
                      className="p-1 rounded bg-neutral-950 hover:bg-neutral-805 text-red-400 border border-neutral-800 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Financial Total */}
                  <div className="text-left font-mono shrink-0">
                    <p className="text-xs font-black text-gold-305">{(q.grandTotal || q.total).toLocaleString()} EGP</p>
                    <p className="text-[9px] text-neutral-500">{q.date || 'Today'}</p>
                  </div>

                  {/* Client / Product spec */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-white truncate">{q.clientName || 'Anonymous Client'} • {q.clientPhone}</p>
                    <p className="text-[10.5px] text-neutral-400 truncate mt-0.5">
                      {q.productLabel} ({q.dimensions}) • Qty: {q.quantity}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          6. TAB: COST CALCULATOR & PROFIT MARGIN ENGINE
          ════════════════════════════════════════════════════ */}
      {activeTab === 'cost_calc' && (
        <div className="space-y-4">
          <h4 className="text-sm font-black text-gold-300">{isAr ? 'حاسبة هوامش الأرباح التقديرية والتكاليف الصناعية' : 'Industrial Cost Estimation & Margin Analysis'}</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Inputs Column */}
            <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 p-5 rounded-xl space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'الخامة المختبرة:' : 'Material Under Test:'}</label>
                  <select 
                    value={calcMaterialId} 
                    onChange={e => setCalcMaterialId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                  >
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{isAr ? m.nameAr : m.nameEn}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'التشطيب والطلاء:' : 'Finishing Option:'}</label>
                  <select 
                    value={calcFinishingId} 
                    onChange={e => setCalcFinishingId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                  >
                    {settings.finishingOptions.map(f => (
                      <option key={f.id} value={f.id}>{isAr ? f.nameAr : f.nameEn}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'عرض اللوحة (م):' : 'Width (Meters):'}</label>
                  <input 
                    type="number" step="0.1"
                    value={calcWidth} 
                    onChange={e => setCalcWidth(parseFloat(e.target.value) || 1)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'ارتفاع اللوحة (م):' : 'Height (Meters):'}</label>
                  <input 
                    type="number" step="0.1"
                    value={calcHeight} 
                    onChange={e => setCalcHeight(parseFloat(e.target.value) || 1)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2 border-t border-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={calcNeedsInstallation} 
                    onChange={e => setCalcNeedsInstallation(e.target.checked)}
                    className="rounded accent-gold-505"
                  />
                  <span>{isAr ? 'يتطلب تركيبات ميدانية في الموقع' : 'Requires Rigging & On-site Installation'}</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={calcIsUrgent} 
                    onChange={e => setCalcIsUrgent(e.target.checked)}
                    className="rounded accent-gold-505"
                  />
                  <span>{isAr ? 'طلب إنتاج مستعجل (X1.25)' : 'Mark Urgent (1.25x)'}</span>
                </label>
              </div>
            </div>

            {/* Live Analytics Dashboard Block */}
            <div className="bg-neutral-900 border border-gold-505/20 p-5 rounded-xl space-y-4">
              <h5 className="text-xs font-black text-white flex items-center justify-end gap-1.5">
                <span>{isAr ? 'تحليل الأرباح والهوامش' : 'Commercial Profit Index'}</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </h5>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-2.5 bg-neutral-950/40 rounded border border-neutral-800 font-mono">
                  <span className="text-neutral-400">{engineResults.prodCost.toLocaleString()} EGP</span>
                  <span className="text-neutral-300">{isAr ? 'تكلفة الإنتاج الإجمالية:' : 'Production Cost:'}</span>
                </div>
                
                <div className="flex justify-between p-2.5 bg-neutral-950/40 rounded border border-neutral-800 font-mono">
                  <span className="text-emerald-400 font-black">+{engineResults.profitVal.toLocaleString()} EGP</span>
                  <span className="text-neutral-300">{isAr ? 'صافي الربح المستهدف:' : 'Target Net Profit:'}</span>
                </div>

                <div className="flex justify-between p-2.5 bg-neutral-950/40 rounded border border-neutral-800 font-mono">
                  <span className="text-gold-305 font-black">{engineResults.sellingPrice.toLocaleString()} EGP</span>
                  <span className="text-neutral-300">{isAr ? 'سعر البيع المقترح:' : 'Suggested Quote price:'}</span>
                </div>

                <div className="flex justify-between p-2.5 bg-neutral-950/40 rounded border border-neutral-800 font-mono">
                  <span className="text-neutral-300 font-black">{engineResults.grandTotal.toLocaleString()} EGP</span>
                  <span className="text-neutral-300">{isAr ? 'الإجمالي مع الضريبة (١٤٪):' : 'Grand Total Incl VAT:'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          7. TAB: PRODUCTION SETTINGS
          ════════════════════════════════════════════════════ */}
      {activeTab === 'production' && (
        <form onSubmit={handleSaveGlobalSettings} className="bg-neutral-900 border border-neutral-850 p-5 rounded-xl space-y-4">
          <h4 className="text-sm font-black text-gold-300">{isAr ? 'تعديل المعاملات الصناعية لآلات القطع بالليزر والسي ان سي' : 'CNC Laser Tooling & Workshop Processing Rates'}</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-neutral-400 block">{isAr ? 'تكلفة التحضير الصناعي الأساسية للطلب ج.م:' : 'Order Prep & Base Setup Fee EGP:'}</label>
              <input 
                type="number" 
                value={settings.baseProcessingCost} 
                onChange={e => setSettings({ ...settings, baseProcessingCost: parseInt(e.target.value) || 0 })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 block">{isAr ? 'معامل الاستعجال للمشاريع العاجلة (مضاعف):' : 'Urgency Multiplier:'}</label>
              <input 
                type="number" step="0.05"
                value={settings.urgencyFactor} 
                onChange={e => setSettings({ ...settings, urgencyFactor: parseFloat(e.target.value) || 1.0 })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 font-black rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md">
              <Save className="w-4 h-4" />
              <span>{isAr ? 'حفظ إعدادات التشغيل الورشية 💾' : 'Save Production Profiles 💾'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ════════════════════════════════════════════════════
          8. TAB: INSTALLATION SETTINGS
          ════════════════════════════════════════════════════ */}
      {activeTab === 'installation' && (
        <form onSubmit={handleSaveGlobalSettings} className="bg-neutral-900 border border-neutral-850 p-5 rounded-xl space-y-4">
          <h4 className="text-sm font-black text-gold-300">{isAr ? 'تسعير خدمات الأوناش والتركيبات وسقالات العمل المرتفع والمسافات' : 'Rigging Scaffolding & Logistics Costing Factors'}</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-neutral-400 block">{isAr ? 'تكلفة التركيب والرفع لكل متر مربع ج.م:' : 'Installation Cost per SQM EGP:'}</label>
              <input 
                type="number" 
                value={settings.installationCostPerSqm} 
                onChange={e => setSettings({ ...settings, installationCostPerSqm: parseInt(e.target.value) || 0 })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 block">{isAr ? 'تكلفة النقل والشحن البري لكل كيلومتر ج.م:' : 'Transport Fee per Kilometer EGP:'}</label>
              <input 
                type="number" 
                value={settings.transportationCostPerKm} 
                onChange={e => setSettings({ ...settings, transportationCostPerKm: parseInt(e.target.value) || 0 })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 font-black rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md">
              <Save className="w-4 h-4" />
              <span>{isAr ? 'حفظ إحصاءات النقل والتركيبات 💾' : 'Save Rigging logistics 💾'}</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
