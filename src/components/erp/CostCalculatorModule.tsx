import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, DollarSign, Settings, Layers, Wrench, Truck, 
  Layers3, Percent, Check, AlertCircle, FileText, BarChart4, Sparkles 
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface Props {
  isAr: boolean;
}

const MATERIALS_PRESETS = [
  { nameAr: 'أكريليك مصبوب تايواني', nameEn: 'Taiwanese Acrylic', baseCostPerSqm: 450, baseProfitMargin: 40 },
  { nameAr: 'خشب MDF معالج', nameEn: 'MDF Wood Board', baseCostPerSqm: 280, baseProfitMargin: 35 },
  { nameAr: 'ألواح PVC فوم بور', nameEn: 'PVC Foam Board', baseCostPerSqm: 180, baseProfitMargin: 30 },
  { nameAr: 'كلادينج ألومنيوم معزول', nameEn: 'Aluminum Cladding ACP', baseCostPerSqm: 650, baseProfitMargin: 45 },
  { nameAr: 'ستانلس ستيل ليزر ٣٠٤', nameEn: 'Stainless Steel 304', baseCostPerSqm: 800, baseProfitMargin: 50 },
  { nameAr: 'قطاعات ألومنيوم مطلي', nameEn: 'Coated Aluminum', baseCostPerSqm: 380, baseProfitMargin: 40 },
  { nameAr: 'لوحات ليد ذكية مضيئة', nameEn: 'Smart LED Modules', baseCostPerSqm: 300, baseProfitMargin: 35 }
];

const THICKNESS_MULTIPLIERS = [
  { val: '2mm', label: '2 مم', multiplier: 1.0 },
  { val: '3mm', label: '3 مم', multiplier: 1.15 },
  { val: '5mm', label: '5 مم', multiplier: 1.3 },
  { val: '10mm', label: '10 مم', multiplier: 1.6 },
  { val: '15mm', label: '15 مم', multiplier: 1.9 },
  { val: '18mm', label: '18 مم', multiplier: 2.2 }
];

const PRINTING_OPTIONS = [
  { val: 'none', labelAr: 'بدون طباعة (قص ليزر/ألوان سادة)', labelEn: 'No Printing (Solid Color Laser Cut)', costPerSqm: 0 },
  { val: 'uv', labelAr: 'طباعة مسطحة UV فوق بنفسجية', labelEn: 'UV Flatbed Premium Ink', costPerSqm: 250 },
  { val: 'eco', labelAr: 'طباعة جلود إن دور فوتو عالي الدقة', labelEn: 'Eco-Solvent High-Res Photo', costPerSqm: 120 }
];

export default function CostCalculatorModule({ isAr }: Props) {
  const [width, setWidth] = useState<number>(1.5);
  const [height, setHeight] = useState<number>(1.0);
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS_PRESETS[0]);
  const [selectedThickness, setSelectedThickness] = useState(THICKNESS_MULTIPLIERS[1]);
  const [selectedPrinting, setSelectedPrinting] = useState(PRINTING_OPTIONS[0]);
  const [isInstallRequired, setIsInstallRequired] = useState(true);
  const [isTransportRequired, setIsTransportRequired] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [customProfitMargin, setCustomProfitMargin] = useState<number>(40);

  // Calculated State
  const [outputs, setOutputs] = useState({
    area: 0,
    materialCost: 0,
    printingCost: 0,
    assemblyLabor: 0,
    installFee: 0,
    deliveryFee: 0,
    totalBaseCost: 0,
    suggestedSellingPrice: 0,
    netProfit: 0,
    pricePerUnit: 0,
    totalPrice: 0,
    totalProfit: 0
  });

  const [savedQuotes, setSavedQuotes] = useState<any[]>([]);

  useEffect(() => {
    // Math Core Calculations
    const calculatedArea = width * height;
    
    // 1. Raw material base cost * thickness multiplier * area * quantity
    const matCostUnit = selectedMaterial.baseCostPerSqm * selectedThickness.multiplier * calculatedArea;
    const materialCost = matCostUnit * quantity;

    // 2. Printing ink costs
    const printingCost = selectedPrinting.costPerSqm * calculatedArea * quantity;

    // 3. Labor / Assembly (constant base rate + complex size scale factor)
    const assemblyLabor = (150 * calculatedArea + 200) * quantity;

    // 4. Installation rigging fee (height scaling + safety crew)
    const installFee = isInstallRequired ? (250 * calculatedArea + 400) * quantity : 0;

    // 5. Logistics delivery fee
    const deliveryFee = isTransportRequired ? (180 + 50 * calculatedArea) * quantity : 0;

    // 6. Synthesis
    const totalBaseCost = materialCost + printingCost + assemblyLabor + installFee + deliveryFee;
    
    // Profit margin calculation: SellingPrice = Cost / (1 - Margin/100)
    const marginRatio = customProfitMargin / 100;
    const totalSellingPrice = marginRatio >= 1 ? totalBaseCost * 2 : totalBaseCost / (1 - marginRatio);
    const totalProfit = totalSellingPrice - totalBaseCost;

    setOutputs({
      area: calculatedArea,
      materialCost,
      printingCost,
      assemblyLabor,
      installFee,
      deliveryFee,
      totalBaseCost,
      suggestedSellingPrice: totalSellingPrice,
      netProfit: totalProfit,
      pricePerUnit: totalSellingPrice / quantity,
      totalPrice: totalSellingPrice,
      totalProfit: totalProfit
    });
  }, [width, height, selectedMaterial, selectedThickness, selectedPrinting, isInstallRequired, isTransportRequired, quantity, customProfitMargin]);

  // Load quotes from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('yafta_calculator_quotes');
    if (saved) {
      setSavedQuotes(JSON.parse(saved));
    }
  }, []);

  const handleSaveQuote = () => {
    const newQuote = {
      id: `QTE-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('ar-EG'),
      dimensions: `${width}م × ${height}م`,
      material: isAr ? selectedMaterial.nameAr : selectedMaterial.nameEn,
      quantity,
      price: outputs.totalPrice,
      profit: outputs.totalProfit
    };

    const updated = [newQuote, ...savedQuotes];
    setSavedQuotes(updated);
    localStorage.setItem('yafta_calculator_quotes', JSON.stringify(updated));
    alert(isAr ? 'تم حفظ عرض أسعار المشروع بنجاح!' : 'Quotation saved successfully!');
  };

  const handleDeleteQuote = (id: string) => {
    const updated = savedQuotes.filter(q => q.id !== id);
    setSavedQuotes(updated);
    localStorage.setItem('yafta_calculator_quotes', JSON.stringify(updated));
  };

  // Recharts Chart Data formatting
  const chartData = [
    { name: isAr ? 'الخامات الأساسية' : 'Raw Materials', value: Math.round(outputs.materialCost), fill: '#e5c060' },
    { name: isAr ? 'الطباعة والألوان' : 'Printing & Ink', value: Math.round(outputs.printingCost), fill: '#60a5fa' },
    { name: isAr ? 'أجور التجميع والعمال' : 'Labor & Assembly', value: Math.round(outputs.assemblyLabor), fill: '#a78bfa' },
    { name: isAr ? 'فنيي الرفع والتركيب' : 'Rigging & Install', value: Math.round(outputs.installFee), fill: '#34d399' },
    { name: isAr ? 'الشحن والتوصيل' : 'Delivery Logistics', value: Math.round(outputs.deliveryFee), fill: '#f87171' }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-8 font-sans text-right" dir="rtl">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* INPUT PARAMETERS CARD (8/12 width) */}
        <div className="lg:col-span-7 bg-neutral-950 border border-gold-500/10 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-900 flex-row-reverse text-right">
            <div>
              <h3 className="text-base font-black text-white">{isAr ? 'محددات وعوامل تسعير الورشة الفنية' : 'Signage Specification Controls'}</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">{isAr ? 'قم بإدخال المقاسات والخامات لحساب التكاليف فورا' : 'Slide metrics to calibrate enterprise quotation ledger'}</p>
            </div>
            <Calculator className="w-5 h-5 text-gold-505" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Width Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs flex-row-reverse">
                <span className="text-zinc-400 font-bold">{isAr ? 'العرض بالامتار' : 'Width (meters)'}</span>
                <span className="text-gold-300 font-mono font-bold">{width} {isAr ? 'متر' : 'm'}</span>
              </div>
              <input 
                type="range" 
                min="0.2" 
                max="12" 
                step="0.1"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value))}
                className="w-full accent-gold-505"
              />
            </div>

            {/* Height Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs flex-row-reverse">
                <span className="text-zinc-400 font-bold">{isAr ? 'الارتفاع بالامتار' : 'Height (meters)'}</span>
                <span className="text-gold-300 font-mono font-bold">{height} {isAr ? 'متر' : 'm'}</span>
              </div>
              <input 
                type="range" 
                min="0.2" 
                max="6" 
                step="0.1"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value))}
                className="w-full accent-gold-505"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            
            {/* Materials selection */}
            <div className="space-y-1.5 text-right">
              <label className="text-zinc-400 font-bold">{isAr ? 'الخامة الأساسية للوحة' : 'Core Material'}</label>
              <select
                value={selectedMaterial.nameEn}
                onChange={(e) => {
                  const found = MATERIALS_PRESETS.find(m => m.nameEn === e.target.value);
                  if (found) {
                    setSelectedMaterial(found);
                    setCustomProfitMargin(found.baseProfitMargin);
                  }
                }}
                className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-bold"
              >
                {MATERIALS_PRESETS.map((m, i) => (
                  <option key={i} value={m.nameEn}>{isAr ? m.nameAr : m.nameEn}</option>
                ))}
              </select>
            </div>

            {/* Thickness Selection */}
            <div className="space-y-1.5 text-right">
              <label className="text-zinc-400 font-bold">{isAr ? 'سماكة وسماكة اللوح' : 'Sheet Thickness'}</label>
              <select
                value={selectedThickness.val}
                onChange={(e) => {
                  const found = THICKNESS_MULTIPLIERS.find(t => t.val === e.target.value);
                  if (found) setSelectedThickness(found);
                }}
                className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-bold"
              >
                {THICKNESS_MULTIPLIERS.map((t, i) => (
                  <option key={i} value={t.val}>{t.label} ({t.multiplier}x cost)</option>
                ))}
              </select>
            </div>

            {/* Printing Options */}
            <div className="space-y-1.5 text-right">
              <label className="text-zinc-400 font-bold">{isAr ? 'نوع طباعة الرول أو المسطحات' : 'Ink / Flatbed Printing'}</label>
              <select
                value={selectedPrinting.val}
                onChange={(e) => {
                  const found = PRINTING_OPTIONS.find(p => p.val === e.target.value);
                  if (found) setSelectedPrinting(found);
                }}
                className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-bold"
              >
                {PRINTING_OPTIONS.map((p, i) => (
                  <option key={i} value={p.val}>{isAr ? p.labelAr : p.labelEn}</option>
                ))}
              </select>
            </div>

            {/* Quantity Controls */}
            <div className="space-y-1.5 text-right">
              <label className="text-zinc-400 font-bold">{isAr ? 'الكمية المطلوبة' : 'Production Quantity'}</label>
              <input 
                type="number" 
                min="1" 
                max="500"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono font-bold"
              />
            </div>

          </div>

          {/* TOGGLE OPTIONS (Installation & Delivery) */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            
            <button
              onClick={() => setIsInstallRequired(!isInstallRequired)}
              className={`p-3.5 rounded-xl border text-right transition-all flex flex-row-reverse items-center justify-between cursor-pointer ${
                isInstallRequired 
                  ? 'bg-gold-950/20 border-gold-505/30 text-gold-505' 
                  : 'bg-neutral-900/40 border-neutral-800 text-zinc-500'
              }`}
            >
              <Wrench className="w-5 h-5 shrink-0" />
              <div>
                <span className="block text-xs font-black">{isAr ? 'خدمات التركيب والرفع' : 'Installation Rigging'}</span>
                <span className="block text-[10px] text-zinc-500 mt-0.5">{isAr ? 'تأمين فنيين وسقالات للرفع' : 'Include specialized rigging crew'}</span>
              </div>
            </button>

            <button
              onClick={() => setIsTransportRequired(!isTransportRequired)}
              className={`p-3.5 rounded-xl border text-right transition-all flex flex-row-reverse items-center justify-between cursor-pointer ${
                isTransportRequired 
                  ? 'bg-gold-950/20 border-gold-505/30 text-gold-505' 
                  : 'bg-neutral-900/40 border-neutral-800 text-zinc-500'
              }`}
            >
              <Truck className="w-5 h-5 shrink-0" />
              <div>
                <span className="block text-xs font-black">{isAr ? 'النقل والشحن اللوجستي' : 'Secure Transport'}</span>
                <span className="block text-[10px] text-zinc-500 mt-0.5">{isAr ? 'توصيل مغلف مع حماية' : 'Secure delivery to storefront'}</span>
              </div>
            </button>

          </div>

          {/* PROFIT MARGIN SCALE */}
          <div className="space-y-2 border-t border-neutral-900/60 pt-4">
            <div className="flex justify-between text-xs flex-row-reverse">
              <span className="text-zinc-400 font-bold">{isAr ? 'هامش الربح المستهدف لمجلس الإدارة' : 'Target Gross Margin'}</span>
              <span className="text-emerald-400 font-bold font-mono">{customProfitMargin}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="80" 
              step="5"
              value={customProfitMargin}
              onChange={(e) => setCustomProfitMargin(parseInt(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

        </div>

        {/* FINANCIAL SUMMARY & ANALYTIC CHARTS (5/12 width) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* PRICING STAT CARD */}
          <div className="bg-neutral-950 border border-gold-505 p-6 rounded-2xl space-y-5 text-right relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold-505/5 rounded-full blur-2xl pointer-events-none animate-pulse"></div>
            
            <div className="border-b border-neutral-900 pb-3 flex justify-between items-center flex-row-reverse text-right">
              <span className="text-[10px] bg-gold-950 border border-gold-505/30 text-gold-505 font-black uppercase px-2.5 py-1 rounded">
                {isAr ? 'فاتورة تقديرية أولية' : 'BOM Ledger Quote'}
              </span>
              <strong className="text-xs text-zinc-400">{isAr ? 'المساحة الكلية:' : 'Total Area:'} {outputs.area.toFixed(2)} {isAr ? 'م²' : 'sqm'}</strong>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-zinc-500 block text-xs font-bold mb-1">{isAr ? 'إجمالي تكلفة التصنيع المباشرة' : 'Direct Manufacturing Cost'}</span>
                <span className="text-xl font-black text-white font-mono">{outputs.totalBaseCost.toLocaleString()} ج.م</span>
              </div>

              <div>
                <span className="text-zinc-500 block text-xs font-bold mb-1">{isAr ? 'سعر البيع المقترح للمستهلك' : 'Suggested Selling Price'}</span>
                <span className="text-3xl font-black text-gold-300 font-mono">
                  {outputs.totalPrice.toLocaleString()}
                  <span className="text-sm text-neutral-400 font-sans mr-1">{isAr ? 'ج.م' : 'EGP'}</span>
                </span>
                {quantity > 1 && (
                  <span className="block text-[11px] text-zinc-400 mt-1">
                    {isAr ? 'سعر الوحدة الواحدة:' : 'Unit price:'} {outputs.pricePerUnit.toLocaleString()} ج.م
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-900/60 text-xs">
                <div>
                  <span className="text-zinc-500 block mb-0.5">{isAr ? 'صافي الربح المستهدف' : 'Net Profit (EGP)'}</span>
                  <strong className="text-emerald-400 font-black font-mono">+{outputs.totalProfit.toLocaleString()} ج.م</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-0.5">{isAr ? 'معدل الكفاءة والربحية' : 'Profit Efficiency'}</span>
                  <strong className="text-gold-305 text-gold-400 font-black block font-mono">{(outputs.totalProfit / outputs.totalPrice * 100).toFixed(1)}%</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={handleSaveQuote}
                className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-gold-505 hover:text-white rounded-xl text-xs font-extrabold border border-gold-550/20 text-center cursor-pointer transition-all"
              >
                {isAr ? 'تثبيت وحفظ العرض ⚡' : 'Lock & Save Quotation ⚡'}
              </button>
            </div>
          </div>

          {/* RECHARTS SUMMARY DISTRIBUTION PIE CHART */}
          <div className="bg-neutral-950 border border-gold-500/10 p-5 rounded-2xl text-right space-y-4">
            <h4 className="text-xs font-black text-white flex items-center gap-2 justify-end">
              <span>{isAr ? 'توزيع وتوزيع نسب تكاليف المواد' : 'Direct Expense Distribution'}</span>
              <BarChart4 className="w-4 h-4 text-gold-505" />
            </h4>

            <div className="h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '12px', color: '#fff', fontSize: '11px', textAlign: 'right' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legend checklist */}
              <div className="space-y-1.5 shrink-0 text-[10px]">
                {chartData.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center justify-end">
                    <span className="text-zinc-400 font-bold">{item.name}</span>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }}></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* SAVED HISTORICAL QUOTATIONS LOG */}
      {savedQuotes.length > 0 && (
        <div className="bg-neutral-950 border border-gold-500/10 p-6 rounded-2xl space-y-4 text-right">
          <h4 className="text-sm font-black text-white">{isAr ? 'المحفوظات وعروض الأسعار النشطة بالسيستم' : 'Active Quotation History Logs'}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedQuotes.map((q) => (
              <div key={q.id} className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl flex items-center justify-between text-right flex-row-reverse">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-[9px] bg-gold-950 text-gold-505 px-1.5 py-0.5 rounded font-mono font-bold">{q.id}</span>
                    <strong className="text-xs text-white">{q.material}</strong>
                  </div>
                  <span className="block text-[10px] text-zinc-500">{q.dimensions} | {q.quantity} وحدة | {q.date}</span>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <strong className="text-xs text-emerald-400 font-mono">+{q.profit.toLocaleString()} ج.م</strong>
                  <button 
                    onClick={() => handleDeleteQuote(q.id)}
                    className="text-[9px] text-red-400 hover:text-red-300 font-bold mt-1"
                  >
                    {isAr ? 'حذف' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
