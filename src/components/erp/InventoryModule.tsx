/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Package, Truck, ClipboardList, TrendingDown, ArrowDownLeft, ArrowUpRight, 
  AlertTriangle, Plus, Search, Filter, RefreshCw
} from 'lucide-react';

interface Material {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'Acrylic' | 'Vinyl' | 'Flex' | 'LED' | 'Cladding' | 'Structure';
  stock: number;
  unitAr: string;
  unitEn: string;
  supplier: string;
  safetyLimit: number;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  materials: string;
  rating: number;
  status: 'active' | 'inactive';
}

interface StockMovement {
  id: string;
  materialName: string;
  type: 'In' | 'Out';
  qty: number;
  notes: string;
  date: string;
}

interface Props {
  isAr: boolean;
  canEdit: boolean;
}

export default function InventoryModule({ isAr, canEdit }: Props) {
  // Stock materials
  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('yafta_erp_materials');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'mat-1', nameAr: 'أكريليك كاست تايواني 3 مم شفاف', nameEn: 'Taiwanese Acrylic Cast 3mm Clear', category: 'Acrylic', stock: 145, unitAr: 'لوح', unitEn: 'sheets', supplier: 'Al-Rowad Plastics', safetyLimit: 30 },
      { id: 'mat-2', nameAr: 'ستيكر أوراكال 651 ألماني مطفي', nameEn: 'Oracal 651 Vinyl German Matte', category: 'Vinyl', stock: 12, unitAr: 'رول', unitEn: 'rolls', supplier: 'Delta Trading', safetyLimit: 5 },
      { id: 'mat-3', nameAr: 'بانر ستار فليكس 440 جرام كوري', nameEn: 'Star Flex Banner 440g Korean', category: 'Flex', stock: 240, unitAr: 'متر مربع', unitEn: 'sq.m', supplier: 'Sina Graphics', safetyLimit: 50 },
      { id: 'mat-4', nameAr: 'ليد سامسونج 3 ديود كوري أصلي', nameEn: 'Samsung 3-LED Modules Low Draw', category: 'LED', stock: 85, unitAr: 'ديود', unitEn: 'chips', supplier: 'Yatta Glow Co.', safetyLimit: 500 }, // Trigger warning on startup!
      { id: 'mat-5', nameAr: 'كلادينج ألومنيوم مقاوم للحريق 4 مم', nameEn: 'Aluminium Cladding Fireproof 4mm', category: 'Cladding', stock: 38, unitAr: 'لوح', unitEn: 'sheets', supplier: 'Emaar Metals', safetyLimit: 15 },
      { id: 'mat-6', nameAr: 'حديد أسود مجوف سمك 2 مم للهياكل', nameEn: 'Black Steel Hollow Tubing 2mm Skeleton', category: 'Structure', stock: 95, unitAr: 'عود', unitEn: 'bars', supplier: 'El-Ezaby Iron', safetyLimit: 20 }
    ];
  });

  // Suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('yafta_erp_suppliers');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'sup-1', name: 'Al-Rowad Plastics', contact: '+201009988771', materials: 'Acrylic Cast, PVC Sheets', rating: 4.8, status: 'active' },
      { id: 'sup-2', name: 'Delta Trading', contact: '+201223344556', materials: 'Oracal Vinyl, Double-tape', rating: 4.2, status: 'active' },
      { id: 'sup-3', name: 'Yatta Glow Co.', contact: '+201050512141', materials: 'Samsung LED, Transformers', rating: 5.0, status: 'active' },
      { id: 'sup-4', name: 'El-Ezaby Iron', contact: '+201111222333', materials: 'Steel pipes, welding wire', rating: 4.5, status: 'active' }
    ];
  });

  // Stock movements log
  const [movements, setMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('yafta_erp_movements');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'mov-1', materialName: 'Taiwanese Acrylic Cast 3mm Clear', type: 'Out', qty: 15, notes: 'Consumed for Mado sign face panels', date: '2026-06-18 10:30 AM' },
      { id: 'mov-2', materialName: 'Samsung 3-LED Modules Low Draw', type: 'In', qty: 2500, notes: 'Restocked by Yatta Glow Co. Order #90', date: '2026-06-15 01:20 PM' },
      { id: 'mov-3', materialName: 'Aluminium Cladding Fireproof 4mm', type: 'Out', qty: 24, notes: 'Facade coverage cladding skeleton', date: '2026-06-12 04:45 PM' }
    ];
  });

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [addingMaterial, setAddingMaterial] = useState(false);
  const [recordingMovement, setRecordingMovement] = useState(false);

  // Form States
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState<'Acrylic' | 'Vinyl' | 'Flex' | 'LED' | 'Cladding' | 'Structure'>('Acrylic');
  const [stock, setStock] = useState(50);
  const [unitAr, setUnitAr] = useState('لوح');
  const [unitEn, setUnitEn] = useState('sheets');
  const [supplier, setSupplier] = useState('');
  const [safetyLimit, setSafetyLimit] = useState(10);

  // Movement Form
  const [targetMaterialId, setTargetMaterialId] = useState('');
  const [moveType, setMoveType] = useState<'In' | 'Out'>('Out');
  const [moveQty, setMoveQty] = useState(10);
  const [moveNotes, setMoveNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('yafta_erp_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('yafta_erp_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('yafta_erp_movements', JSON.stringify(movements));
  }, [movements]);

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !nameEn) return;

    const newMat: Material = {
      id: `mat-${Date.now()}`,
      nameAr,
      nameEn,
      category,
      stock,
      unitAr,
      unitEn,
      supplier: supplier || suppliers[0]?.name || 'Direct Wholesale',
      safetyLimit
    };

    setMaterials([...materials, newMat]);
    setNameAr('');
    setNameEn('');
    setAddingMaterial(false);
    alert(isAr ? 'تم قيد وتسجيل الخامة الجديدة بنجاح بالرقم التسلسلي الموحد!' : 'New material recorded in local warehouse directory!');
  };

  const handleRecordMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMaterialId) return;

    const mat = materials.find(m => m.id === targetMaterialId);
    if (!mat) return;

    if (moveType === 'Out' && mat.stock < moveQty) {
      alert(isAr ? 'خطأ: الكمية المطلوبة غير متوفرة حالياً بالمستودع الأساسي!' : 'Error: Insufficient stock for this withdrawal request!');
      return;
    }

    // Update stock levels
    const finalStock = moveType === 'In' ? mat.stock + moveQty : mat.stock - moveQty;
    setMaterials(materials.map(m => m.id === targetMaterialId ? { ...m, stock: finalStock } : m));

    // Save movement transaction
    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      materialName: mat.nameEn,
      type: moveType,
      qty: moveQty,
      notes: moveNotes || (moveType === 'In' ? 'Standard Restock' : 'Workshop Withdrawal'),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setMovements([newMovement, ...movements]);
    setRecordingMovement(false);
    setMoveNotes('');
    alert(isAr ? 'تم حفظ المعاملة وتدقيق ميزان المخازن فوراً!' : 'Stock movement transaction verified and logged.');
  };

  const lowStockItems = materials.filter(m => m.stock < m.safetyLimit);

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = (isAr ? m.nameAr : m.nameEn).toLowerCase().includes(search.toLowerCase()) || m.supplier.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || m.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header and top tools */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 flex-row-reverse text-right">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-end">
            <Package className="w-5 h-5 text-gold-505" />
            <span>{isAr ? 'إدارة التوريدات والمستودعات والكلادينج' : 'Material Inventory & Suppliers'}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isAr ? 'مستويات مخزون الأكريليك والليدات ومحاكاة التوريد والتنبيهات المسبقة' : 'Solder stock levels, flex rolls, suppliers rating logs, and alert bounds.'}
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {canEdit && (
            <>
              <button 
                onClick={() => setAddingMaterial(true)}
                className="px-4 py-2 bg-gradient-to-r from-gold-300 to-gold-505 hover:from-gold-250 text-black text-xs font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة صنف مخزني' : 'Register Material'}</span>
              </button>

              <button 
                onClick={() => setRecordingMovement(true)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-gold-505/20 text-gold-300 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-gold-505" />
                <span>{isAr ? 'تحديث المخزون (صادر/وارد)' : 'Solder Adjustment'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Critical Low Stock Alert Banners */}
      {lowStockItems.length > 0 && (
        <div className="p-4 bg-rose-950/40 border-2 border-rose-500/40 rounded-2xl flex flex-row-reverse items-center justify-between gap-4 animate-pulse">
          <div className="flex gap-2.5 items-center flex-row-reverse text-right">
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <h4 className="text-sm font-black text-white">{isAr ? 'تنبيه: وجود نواقص على حافة النفاد 🚨' : 'Alert: Critical Low-Stock Detected 🚨'}</h4>
              <p className="text-xs text-neutral-300 leading-snug">
                {isAr 
                  ? `أصناف (${lowStockItems.map(m => isAr ? m.nameAr : m.nameEn).join(', ')}) انخفضت لما دون الحد الآمن للتصنيع المتكامل في مصر!` 
                  : `Please dispatch procurement orders for: ${lowStockItems.map(m => m.nameEn).join(', ')}.`}
              </p>
            </div>
          </div>
          <button 
            onClick={() => alert(isAr ? 'يتلقى الموردون المعتمدون مكالمة آلية الآن بالتوريد المستعجل!' : 'Low-stock report transmitted to suppliers.')}
            className="px-3.5 py-1.5 bg-rose-505 bg-rose-900 border border-rose-500 text-white rounded text-[10px] font-black cursor-pointer shadow whitespace-nowrap"
          >
            {isAr ? 'طلب توريد من المورد المعتمد 🚛' : 'Auto Restock 🚛'}
          </button>
        </div>
      )}

      {/* Sub sections Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Inventory Table lists */}
        <div className="lg:col-span-3 bg-neutral-950 rounded-2xl border border-gold-500/10 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-neutral-900 pb-3 flex-row-reverse text-right">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{isAr ? 'جرد كميات المستودع الرئيسي وبطاقة الصنف:' : 'Current warehouse catalog & unit specifications:'}</span>
              <ClipboardList className="w-4 h-4 text-gold-505" />
            </h3>

            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-neutral-300 p-2 text-xs rounded-lg focus:outline-none"
              >
                <option value="all">{isAr ? 'جميع التصنيفات' : 'All categories'}</option>
                <option value="Acrylic">{isAr ? 'أكريليك' : 'Acrylic'}</option>
                <option value="Vinyl">{isAr ? 'فينيل ورول ستيكر' : 'Vinyl'}</option>
                <option value="Flex">{isAr ? 'فليكس وبنرات' : 'Flex'}</option>
                <option value="LED">{isAr ? 'ليدات ومحولات' : 'LED'}</option>
                <option value="Cladding">{isAr ? 'ألواح الألمنيوم' : 'Cladding'}</option>
                <option value="Structure">{isAr ? 'الحديد والهياكل' : 'Steel Skeleton'}</option>
              </select>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder={isAr ? 'البحث عن خامة...' : 'Search stock...'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-neutral-900/80 border border-neutral-800 rounded-lg p-2 pl-9 text-xs text-white focus:outline-none focus:border-gold-300 text-right placeholder-zinc-500 w-44"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto text-xs text-right">
            <table className="w-full divide-y divide-neutral-900">
              <thead className="bg-neutral-900/60 text-gold-300 font-bold">
                <tr>
                  <th className="p-3 text-right">{isAr ? 'الصنف الفني' : 'Material Specification'}</th>
                  <th className="p-3 text-right">{isAr ? 'التصنيف' : 'Category'}</th>
                  <th className="p-3 text-right">{isAr ? 'الرصيد المتاح' : 'Available Stock'}</th>
                  <th className="p-3 text-right">{isAr ? 'المورد المعتمد' : 'Wholesale Supplier'}</th>
                  <th className="p-3 text-right">{isAr ? 'حد الأمان' : 'Safety Margin'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/40 text-neutral-300">
                {filteredMaterials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-neutral-900/30">
                    <td className="p-3 font-medium">
                      <span className="block text-white font-bold">{isAr ? mat.nameAr : mat.nameEn}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">SKU: YAFTA-{mat.id.toUpperCase()}</span>
                    </td>
                    <td className="p-3 text-zinc-400">{mat.category}</td>
                    <td className="p-3 font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded ${
                        mat.stock < mat.safetyLimit 
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/20' 
                          : 'text-white'
                      }`}>
                        {mat.stock} {isAr ? mat.unitAr : mat.unitEn}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-400">{mat.supplier}</td>
                    <td className="p-3 font-mono text-zinc-500">{mat.safetyLimit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar stock Movements and transactions */}
        <div className="bg-neutral-950 rounded-2xl border border-gold-500/10 p-5 space-y-4 text-right">
          <div className="border-b border-neutral-900 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 justify-end">
              <span>{isAr ? 'المعاملات وحجوزات الورش:' : 'Recent shop consumption:'}</span>
              <Truck className="w-4 h-4 text-gold-505" />
            </h3>
            <p className="text-[10px] text-neutral-400 mt-1">
              {isAr ? 'تتبع سحب الخامات للإنتاج الميداني' : 'Real-time materials movement timeline.'}
            </p>
          </div>

          <div className="space-y-3.5 max-h-[350px] overflow-y-auto w-full">
            {movements.map((mov) => (
              <div key={mov.id} className="p-3 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-850 rounded-xl space-y-1 font-sans">
                <div className="flex justify-between items-center text-[10px] flex-row-reverse">
                  <span className="font-extrabold text-white truncate max-w-[130px]">{mov.materialName}</span>
                  <span className={`px-1 rounded font-black text-[8px] flex items-center gap-0.5 ${
                    mov.type === 'In' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                  }`}>
                    {mov.type === 'In' ? <ArrowUpRight className="w-2 h-2" /> : <ArrowDownLeft className="w-2 h-2" />}
                    <span>{mov.qty}</span>
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-snug">{mov.notes}</p>
                <div className="text-[9px] text-neutral-500 font-mono text-left">
                  {mov.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Material Dialog Modal */}
      {addingMaterial && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-lg w-full relative space-y-6 text-right font-sans">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 justify-end border-b border-neutral-900 pb-3">
              <span>{isAr ? 'إدراج صنف وتوريد للمستودعات' : 'Register Material to Stock'}</span>
              <Package className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleCreateMaterial} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'اسم الصنف باللغة العربية:' : 'Material description (AR):'}</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أكريليك أسود 4 مل كاست تايواني"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-550 text-right"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'اسم الصنف باللغة الإنجليزية:' : 'Material description (EN):'}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Black Acrylic 4mm Cast"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-550 text-left font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'التصنيف:' : 'Category Group:'}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-850 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="Acrylic">Acrylic</option>
                    <option value="Vinyl">Vinyl</option>
                    <option value="Flex">Flex</option>
                    <option value="LED">LED</option>
                    <option value="Cladding">Cladding</option>
                    <option value="Structure">Structure</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'وحدة القياس السائدة:' : 'Unit expression:'}</label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'مثال: لوح، رول، ديود' : 'e.g. sheets, rolls'}
                    value={unitEn}
                    onChange={(e) => {
                      setUnitEn(e.target.value);
                      setUnitAr(isAr ? e.target.value : 'وحدة');
                    }}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'المخزون الأولي المتاح:' : 'Initial Quantity:'}</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white text-center font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'الحد الأدنى للأمان (Safety Limit):' : 'Reorder bounds:'}</label>
                  <input
                    type="number"
                    value={safetyLimit}
                    onChange={(e) => setSafetyLimit(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white text-center font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'المورد:' : 'Supplier Partner:'}</label>
                  <select
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-850 rounded-lg p-2.5 text-xs text-white"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setAddingMaterial(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg cursor-pointer border border-neutral-850"
                >
                  {isAr ? 'إلغاء' : 'Close'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black text-xs font-black rounded-lg cursor-pointer"
                >
                  {isAr ? 'إضافه' : 'Register Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Stock Movement Modal Dialog */}
      {recordingMovement && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-md w-full relative space-y-6 text-right font-sans">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 justify-end border-b border-neutral-900 pb-3">
              <span>{isAr ? 'أمر صرف أو توريد خامات الورش:' : 'Process Materials Disbursement'}</span>
              <RefreshCw className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleRecordMovement} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-bold block">{isAr ? 'الصنف المستهدف بعملية السحب/الإدخال:' : 'Select Warehouse Item:'}</label>
                <select
                  value={targetMaterialId}
                  onChange={(e) => setTargetMaterialId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-805 p-2.5 text-xs text-white focus:outline-none"
                  required
                >
                  <option value="">{isAr ? 'اختر الخامه...' : 'Select item...'}</option>
                  {materials.map(m => (
                    <option key={m.id} value={m.id}>{(isAr ? m.nameAr : m.nameEn)} | {m.stock} {isAr ? m.unitAr : m.unitEn}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-300 font-bold block">{isAr ? 'الكمية المستهدفة:' : 'Quantity:'}</label>
                  <input
                    type="number"
                    value={moveQty}
                    onChange={(e) => setMoveQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-xs text-white focus:outline-none text-center font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-300 font-bold block">{isAr ? 'نوع الحركة:' : 'Movement type:'}</label>
                  <select
                    value={moveType}
                    onChange={(e) => setMoveType(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2 text-xs text-white font-bold text-center"
                  >
                    <option value="Out">{isAr ? 'صرف (سحب للإنتاج)' : 'Out / Withdrawal'}</option>
                    <option value="In">{isAr ? 'توريد (إدخال للمخزن)' : 'In / Supplier Delivery'}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-bold block">{isAr ? 'رقم المشروع أو سبب الصرف:' : 'Project ID or Remarks:'}</label>
                <textarea
                  rows={2}
                  placeholder={isAr ? 'مثال: صرف لورشة اللحام لفرع واجهة مادو' : 'e.g. Soldering skeleton #4'}
                  value={moveNotes}
                  onChange={(e) => setMoveNotes(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-xs text-white focus:outline-none text-right"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setRecordingMovement(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black text-xs font-black rounded-lg cursor-pointer"
                >
                  {isAr ? 'تأكيد المعاملة ⚡' : 'Confirm Movement ⚡'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
