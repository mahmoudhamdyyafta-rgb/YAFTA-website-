import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Plus, Trash2, Edit, Star, Phone, MessageSquare, 
  MapPin, Clipboard, DollarSign, Award, Truck, AlertCircle, Sparkles, Filter 
} from 'lucide-react';
import { db, isFirebaseConfigured } from '../../firebaseConfig';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';

interface Supplier {
  id: string;
  name: string;
  mobile: string;
  whatsApp: string;
  address: string;
  materialsProvided: string;
  lastPurchaseDate: string;
  currentBalance: number;
  rating: number; // 1 to 5
  notes: string;
  performanceCategory: 'Best Price' | 'Fastest Delivery' | 'Highest Quality' | 'Standard';
}

interface Dealer {
  id: string;
  name: string;
  phone: string;
  purchasesCount: number;
  paymentsSum: number;
  remainingBalance: number;
}

const DEFAULT_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Al-Rowad Acrylics & Plastics',
    mobile: '01002345678',
    whatsApp: '201002345678',
    address: 'المنطقة الصناعية السادسة، مدينة 6 أكتوبر',
    materialsProvided: 'Acrylic Sheets, PVC Foam Board, Polycarbonate',
    lastPurchaseDate: '2026-06-20',
    currentBalance: 14500,
    rating: 5,
    notes: 'أفضل جودة ألواح أكريليك مصبوبة غير قابلة للاصفرار بالبلاد. تعامل مرن بآجل ٣٠ يوماً.',
    performanceCategory: 'Highest Quality'
  },
  {
    id: 'sup-2',
    name: 'EgyLED Electronics',
    mobile: '01124567890',
    whatsApp: '201124567890',
    address: 'باب اللوق، وسط البلد، القاهرة',
    materialsProvided: 'LED Modules, Rainproof Power Supplies, RGB Controllers',
    lastPurchaseDate: '2026-06-18',
    currentBalance: 8200,
    rating: 4,
    notes: 'سرعة توصيل خارقة في نفس اليوم للمشاريع المستعجلة وأسعار منافسة للغاية.',
    performanceCategory: 'Fastest Delivery'
  },
  {
    id: 'sup-3',
    name: 'El-Alfy Steel & Aluminum Rails',
    mobile: '01234567891',
    whatsApp: '201234567891',
    address: 'السبتية، بولاق أبو العلا، القاهرة',
    materialsProvided: 'Stainless Steel 304, Aluminum Angles, Iron Frames',
    lastPurchaseDate: '2026-06-15',
    currentBalance: 23000,
    rating: 4,
    notes: 'أسعار معادن خام غير قابلة للمنافسة، خامات معتمدة ومطابقة لشهادة المواصفات ٣٠٤.',
    performanceCategory: 'Best Price'
  }
];

const DEFAULT_DEALERS: Dealer[] = [
  {
    id: 'dl-1',
    name: 'معرض الأثاث الراقي (أبو الفتوح)',
    phone: '01098765432',
    purchasesCount: 4,
    paymentsSum: 45000,
    remainingBalance: 15000
  },
  {
    id: 'dl-2',
    name: 'سلسلة أسواق التيسير الغذائية',
    phone: '01154321098',
    purchasesCount: 8,
    paymentsSum: 110000,
    remainingBalance: 24000
  }
];

interface Props {
  isAr: boolean;
}

export default function SuppliersModule({ isAr }: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [activeTab, setActiveTab] = useState<'suppliers' | 'dealers'>('suppliers');

  // Supplier Form state
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierForm, setSupplierForm] = useState<Omit<Supplier, 'id'>>({
    name: '',
    mobile: '',
    whatsApp: '',
    address: '',
    materialsProvided: '',
    lastPurchaseDate: '',
    currentBalance: 0,
    rating: 5,
    notes: '',
    performanceCategory: 'Standard'
  });

  // Dealer Form state
  const [showAddDealerModal, setShowAddDealerModal] = useState(false);
  const [editingDealer, setEditingDealer] = useState<Dealer | null>(null);
  const [dealerForm, setDealerForm] = useState<Omit<Dealer, 'id'>>({
    name: '',
    phone: '',
    purchasesCount: 0,
    paymentsSum: 0,
    remainingBalance: 0
  });

  useEffect(() => {
    // 1. Sync Suppliers
    const savedSuppliers = localStorage.getItem('yafta_suppliers');
    setSuppliers(savedSuppliers ? JSON.parse(savedSuppliers) : DEFAULT_SUPPLIERS);

    if (isFirebaseConfigured && db) {
      const unsub = onSnapshot(collection(db, 'suppliers'), (snap) => {
        const fetched: Supplier[] = [];
        snap.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Supplier);
        });
        if (fetched.length > 0) {
          setSuppliers(fetched);
          localStorage.setItem('yafta_suppliers', JSON.stringify(fetched));
        }
      });
      return () => unsub();
    }
  }, []);

  useEffect(() => {
    // 2. Sync Dealers
    const savedDealers = localStorage.getItem('yafta_dealers');
    setDealers(savedDealers ? JSON.parse(savedDealers) : DEFAULT_DEALERS);

    if (isFirebaseConfigured && db) {
      const unsub = onSnapshot(collection(db, 'dealers'), (snap) => {
        const fetched: Dealer[] = [];
        snap.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Dealer);
        });
        if (fetched.length > 0) {
          setDealers(fetched);
          localStorage.setItem('yafta_dealers', JSON.stringify(fetched));
        }
      });
      return () => unsub();
    }
  }, []);

  // Supplier Actions
  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingSupplier ? editingSupplier.id : `sup-${Date.now()}`;
    const newSupplierData = { ...supplierForm, id };

    let updatedList: Supplier[] = [];
    if (editingSupplier) {
      updatedList = suppliers.map(s => s.id === editingSupplier.id ? newSupplierData : s);
    } else {
      updatedList = [newSupplierData, ...suppliers];
    }

    setSuppliers(updatedList);
    localStorage.setItem('yafta_suppliers', JSON.stringify(updatedList));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'suppliers', id), supplierForm);
      } catch (err) {
        console.error("Firestore save failed:", err);
      }
    }

    setShowAddSupplierModal(false);
    setEditingSupplier(null);
    setSupplierForm({
      name: '',
      mobile: '',
      whatsApp: '',
      address: '',
      materialsProvided: '',
      lastPurchaseDate: '',
      currentBalance: 0,
      rating: 5,
      notes: '',
      performanceCategory: 'Standard'
    });
  };

  const handleEditSupplier = (sup: Supplier) => {
    setEditingSupplier(sup);
    setSupplierForm({
      name: sup.name,
      mobile: sup.mobile,
      whatsApp: sup.whatsApp,
      address: sup.address,
      materialsProvided: sup.materialsProvided,
      lastPurchaseDate: sup.lastPurchaseDate,
      currentBalance: sup.currentBalance,
      rating: sup.rating,
      notes: sup.notes,
      performanceCategory: sup.performanceCategory
    });
    setShowAddSupplierModal(true);
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من رغبتك بحذف هذا المورد نهائياً؟' : 'Are you sure you want to delete this supplier?')) return;
    
    const updated = suppliers.filter(s => s.id !== id);
    setSuppliers(updated);
    localStorage.setItem('yafta_suppliers', JSON.stringify(updated));

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'suppliers', id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Dealer Actions
  const handleSaveDealer = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingDealer ? editingDealer.id : `dl-${Date.now()}`;
    const newDealerData = { ...dealerForm, id };

    let updatedList: Dealer[] = [];
    if (editingDealer) {
      updatedList = dealers.map(d => d.id === editingDealer.id ? newDealerData : d);
    } else {
      updatedList = [newDealerData, ...dealers];
    }

    setDealers(updatedList);
    localStorage.setItem('yafta_dealers', JSON.stringify(updatedList));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'dealers', id), dealerForm);
      } catch (err) {
        console.error(err);
      }
    }

    setShowAddDealerModal(false);
    setEditingDealer(null);
    setDealerForm({
      name: '',
      phone: '',
      purchasesCount: 0,
      paymentsSum: 0,
      remainingBalance: 0
    });
  };

  const handleEditDealer = (dl: Dealer) => {
    setEditingDealer(dl);
    setDealerForm({
      name: dl.name,
      phone: dl.phone,
      purchasesCount: dl.purchasesCount,
      paymentsSum: dl.paymentsSum,
      remainingBalance: dl.remainingBalance
    });
    setShowAddDealerModal(true);
  };

  const handleDeleteDealer = async (id: string) => {
    if (!confirm(isAr ? 'حذف بيانات التاجر؟' : 'Delete dealer record?')) return;

    const updated = dealers.filter(d => d.id !== id);
    setDealers(updated);
    localStorage.setItem('yafta_dealers', JSON.stringify(updated));

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'dealers', id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'Highest Quality': return 'bg-gold-950 border-gold-505/30 text-gold-505';
      case 'Fastest Delivery': return 'bg-emerald-950/80 border-emerald-500/20 text-emerald-400';
      case 'Best Price': return 'bg-cyan-950 border-cyan-500/20 text-cyan-400';
      default: return 'bg-neutral-900 border-neutral-800 text-zinc-400';
    }
  };

  const totalOutstandingSuppliers = suppliers.reduce((sum, s) => sum + s.currentBalance, 0);
  const totalOutstandingDealers = dealers.reduce((sum, d) => sum + d.remainingBalance, 0);

  return (
    <div className="space-y-8 font-sans text-right" dir="rtl">
      
      {/* MODULE HEADER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-5 bg-neutral-950 border border-gold-500/10 rounded-2xl flex flex-row-reverse items-center justify-between">
          <div className="p-3 bg-gold-950 rounded-xl border border-gold-505/20 text-gold-505">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-zinc-500 block text-xs font-bold">{isAr ? 'إجمالي الموردين والشركات' : 'Suppliers Registry'}</span>
            <strong className="text-2xl font-black text-white font-mono mt-1 block">{suppliers.length}</strong>
          </div>
        </div>

        <div className="p-5 bg-neutral-950 border border-gold-500/10 rounded-2xl flex flex-row-reverse items-center justify-between">
          <div className="p-3 bg-red-955 bg-red-950/40 rounded-xl border border-red-500/20 text-red-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-zinc-500 block text-xs font-bold">{isAr ? 'مستحقات معلقة للموردين' : 'Outstanding Supplier Bills'}</span>
            <strong className="text-2xl font-black text-red-400 font-mono mt-1 block">
              {totalOutstandingSuppliers.toLocaleString()} <span className="text-xs font-sans text-neutral-400">{isAr ? 'ج.م' : 'EGP'}</span>
            </strong>
          </div>
        </div>

        <div className="p-5 bg-neutral-950 border border-gold-500/10 rounded-2xl flex flex-row-reverse items-center justify-between">
          <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/20 text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-zinc-500 block text-xs font-bold">{isAr ? 'مستحقات معلقة على التجار' : 'Outstanding Dealer Receivables'}</span>
            <strong className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
              {totalOutstandingDealers.toLocaleString()} <span className="text-xs font-sans text-neutral-400">{isAr ? 'ج.م' : 'EGP'}</span>
            </strong>
          </div>
        </div>

      </div>

      {/* HORIZONTAL INNER SECTION NAVIGATION */}
      <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
        <div className="flex gap-2.5">
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'suppliers' 
                ? 'bg-gold-505 text-black' 
                : 'bg-neutral-950 text-zinc-400 hover:text-white border border-neutral-900'
            }`}
          >
            {isAr ? '🚚 إدارة الموردين والشركات' : '🚚 Supplier Network'}
          </button>
          <button
            onClick={() => setActiveTab('dealers')}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'dealers' 
                ? 'bg-gold-505 text-black' 
                : 'bg-neutral-950 text-zinc-400 hover:text-white border border-neutral-900'
            }`}
          >
            {isAr ? '👥 سجل التجار والموزعين آجل' : '👥 Dealer Registry'}
          </button>
        </div>

        <button
          onClick={() => activeTab === 'suppliers' ? setShowAddSupplierModal(true) : setShowAddDealerModal(true)}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-gold-550/20 text-gold-505 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === 'suppliers' ? (isAr ? 'إضافة مورد جديد' : 'Add Supplier') : (isAr ? 'إضافة تاجر/موزع' : 'Add Dealer')}</span>
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}
      <AnimatePresence mode="wait">
        {activeTab === 'suppliers' ? (
          <motion.div
            key="suppliers-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right"
          >
            {suppliers.map((sup) => (
              <div 
                key={sup.id} 
                className="bg-neutral-950 border border-gold-500/10 hover:border-gold-505/30 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between transition-colors"
              >
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start flex-row-reverse text-right">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded border ${getCategoryBadgeClass(sup.performanceCategory)}`}>
                      {sup.performanceCategory}
                    </span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < sup.rating ? 'text-gold-505 fill-gold-505' : 'text-zinc-700'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-black text-white">{sup.name}</h4>
                    <p className="text-[11px] text-zinc-500 font-bold flex items-center gap-1 justify-end">
                      <MapPin className="w-3.5 h-3.5 text-gold-505 inline" />
                      {sup.address}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-900/40 space-y-2 text-xs">
                    <div>
                      <span className="text-zinc-500 block mb-0.5">{isAr ? 'الخامات والمواد المزودة:' : 'Materials:'}</span>
                      <strong className="text-neutral-300 font-semibold">{sup.materialsProvided}</strong>
                    </div>

                    <div className="flex justify-between flex-row-reverse items-center pt-1">
                      <div>
                        <span className="text-zinc-500 block text-[10px]">{isAr ? 'آخر توريد:' : 'Last In:'}</span>
                        <span className="text-white font-mono font-bold">{sup.lastPurchaseDate}</span>
                      </div>
                      <div className="text-left">
                        <span className="text-zinc-500 block text-[10px]">{isAr ? 'الحساب المتبقي:' : 'Balance:'}</span>
                        <span className="text-gold-300 font-mono font-black">{sup.currentBalance.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                      </div>
                    </div>

                    {sup.notes && (
                      <div className="p-2 bg-neutral-900/50 rounded-xl text-[11px] text-zinc-400 leading-relaxed border border-neutral-900 text-right">
                        {sup.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-900 flex justify-between items-center gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSupplier(sup)}
                      className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 text-gold-400 hover:text-white cursor-pointer transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSupplier(sup.id)}
                      className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-900/20 text-red-400 cursor-pointer transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`tel:${sup.mobile}`}
                      className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-850 text-zinc-300 hover:text-white border border-neutral-850 flex items-center justify-center transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`https://wa.me/${sup.whatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-emerald-950/40 hover:bg-emerald-950/80 text-emerald-400 border border-emerald-900/30 flex items-center justify-center transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="dealers-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-neutral-950 border border-gold-500/10 rounded-2xl overflow-x-auto text-right"
          >
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="border-b border-neutral-900 text-zinc-500 font-bold">
                  <th className="pb-3 text-right">{isAr ? 'التاجر / المعرض' : 'Dealer Name'}</th>
                  <th className="pb-3 text-right">{isAr ? 'الهاتف' : 'Phone'}</th>
                  <th className="pb-3 text-right">{isAr ? 'عدد التعاقدات' : 'Contracts Count'}</th>
                  <th className="pb-3 text-right">{isAr ? 'إجمالي المدفوعات' : 'Payments'}</th>
                  <th className="pb-3 text-right">{isAr ? 'الرصيد المتبقي (آجل)' : 'Outstanding Credit'}</th>
                  <th className="pb-3 text-left">{isAr ? 'خيارات' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/40">
                {dealers.map((dl) => (
                  <tr key={dl.id} className="hover:bg-neutral-900/20 transition-colors">
                    <td className="py-4 font-extrabold text-white">{dl.name}</td>
                    <td className="py-4 font-mono text-zinc-300">{dl.phone}</td>
                    <td className="py-4 font-mono font-bold text-gold-300">{dl.purchasesCount}</td>
                    <td className="py-4 font-mono text-emerald-400 font-bold">{dl.paymentsSum.toLocaleString()} ج.م</td>
                    <td className="py-4 font-mono text-red-400 font-black">{dl.remainingBalance.toLocaleString()} ج.م</td>
                    <td className="py-4 text-left">
                      <div className="flex gap-2 justify-start">
                        <button
                          onClick={() => handleEditDealer(dl)}
                          className="p-1.5 rounded bg-neutral-900 border border-neutral-850 text-gold-400 hover:text-white cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDealer(dl.id)}
                          className="p-1.5 rounded bg-red-950/20 text-red-400 border border-red-900/10 cursor-pointer hover:bg-red-950/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUPPLIER MODAL CONTAINER */}
      <AnimatePresence>
        {showAddSupplierModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-950 border border-gold-550/30 rounded-2xl p-6 max-w-xl w-full text-right space-y-4"
            >
              <h3 className="text-lg font-black text-white border-b border-neutral-950 pb-2">
                {editingSupplier ? (isAr ? 'تعديل بيانات مورد' : 'Edit Supplier') : (isAr ? 'إضافة مورد وتثبيت الخامات' : 'Add New Supplier')}
              </h3>

              <form onSubmit={handleSaveSupplier} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-500 font-bold">{isAr ? 'اسم الشركة / المصنع' : 'Supplier Company'}</label>
                    <input 
                      type="text" 
                      required
                      value={supplierForm.name}
                      onChange={(e) => setSupplierForm({...supplierForm, name: e.target.value})}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500 font-bold">{isAr ? 'تصنيف الكفاءة والتميز' : 'Performance Class'}</label>
                    <select
                      value={supplierForm.performanceCategory}
                      onChange={(e: any) => setSupplierForm({...supplierForm, performanceCategory: e.target.value})}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-bold"
                    >
                      <option value="Highest Quality">{isAr ? 'أعلى جودة ومواصفات' : 'Highest Quality'}</option>
                      <option value="Fastest Delivery">{isAr ? 'الأسرع في الشحن واللوجستيات' : 'Fastest Delivery'}</option>
                      <option value="Best Price">{isAr ? 'السعر الاقتصادي المنافس' : 'Best Price'}</option>
                      <option value="Standard">{isAr ? 'مستوى قياسي قياسي' : 'Standard'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-500 font-bold">{isAr ? 'رقم المحمول' : 'Mobile'}</label>
                    <input 
                      type="text" 
                      required
                      value={supplierForm.mobile}
                      onChange={(e) => setSupplierForm({...supplierForm, mobile: e.target.value})}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500 font-bold">{isAr ? 'رقم واتساب (مع كود الدولة)' : 'WhatsApp (Country Code)'}</label>
                    <input 
                      type="text" 
                      required
                      value={supplierForm.whatsApp}
                      onChange={(e) => setSupplierForm({...supplierForm, whatsApp: e.target.value})}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500 font-bold">{isAr ? 'الخامات والمواد المقدمة' : 'Materials Supplied'}</label>
                  <input 
                    type="text" 
                    required
                    value={supplierForm.materialsProvided}
                    onChange={(e) => setSupplierForm({...supplierForm, materialsProvided: e.target.value})}
                    placeholder="مثال: Acrylic Sheets, LED Transformers..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-bold"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-500 font-bold">{isAr ? 'تاريخ آخر توريد' : 'Last Delivery'}</label>
                    <input 
                      type="date" 
                      value={supplierForm.lastPurchaseDate}
                      onChange={(e) => setSupplierForm({...supplierForm, lastPurchaseDate: e.target.value})}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500 font-bold">{isAr ? 'مستحقات معلقة' : 'Outstanding (EGP)'}</label>
                    <input 
                      type="number" 
                      value={supplierForm.currentBalance}
                      onChange={(e) => setSupplierForm({...supplierForm, currentBalance: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500 font-bold">{isAr ? 'التقييم (١ - ٥)' : 'Rating'}</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="5"
                      value={supplierForm.rating}
                      onChange={(e) => setSupplierForm({...supplierForm, rating: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500 font-bold">{isAr ? 'العنوان والمصنع' : 'Address'}</label>
                  <input 
                    type="text" 
                    value={supplierForm.address}
                    onChange={(e) => setSupplierForm({...supplierForm, address: e.target.value})}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500 font-bold">{isAr ? 'ملاحظات وتفاصيل الدفع' : 'Notes & Pay Terms'}</label>
                  <textarea 
                    value={supplierForm.notes}
                    onChange={(e) => setSupplierForm({...supplierForm, notes: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-semibold"
                  />
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddSupplierModal(false)}
                    className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-zinc-400 font-bold cursor-pointer hover:text-white"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-gold-505 text-black font-extrabold cursor-pointer"
                  >
                    {isAr ? 'حفظ البيانات ⚡' : 'Save Supplier ⚡'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DEALER MODAL CONTAINER */}
      <AnimatePresence>
        {showAddDealerModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-950 border border-gold-550/30 rounded-2xl p-6 max-w-lg w-full text-right space-y-4"
            >
              <h3 className="text-sm font-black text-white border-b border-neutral-950 pb-2">
                {editingDealer ? 'تعديل تاجر' : 'إضافة تاجر/موزع معتمد للتعامل المالي'}
              </h3>

              <form onSubmit={handleSaveDealer} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-500 font-bold">اسم العميل / المعرض</label>
                  <input 
                    type="text" 
                    required
                    value={dealerForm.name}
                    onChange={(e) => setDealerForm({...dealerForm, name: e.target.value})}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500 font-bold">رقم الهاتف</label>
                  <input 
                    type="text" 
                    required
                    value={dealerForm.phone}
                    onChange={(e) => setDealerForm({...dealerForm, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-500 font-bold">عدد التعاقدات</label>
                    <input 
                      type="number" 
                      value={dealerForm.purchasesCount}
                      onChange={(e) => setDealerForm({...dealerForm, purchasesCount: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500 font-bold">إجمالي السداد</label>
                    <input 
                      type="number" 
                      value={dealerForm.paymentsSum}
                      onChange={(e) => setDealerForm({...dealerForm, paymentsSum: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500 font-bold">الرصيد المعلق (آجل)</label>
                    <input 
                      type="number" 
                      value={dealerForm.remainingBalance}
                      onChange={(e) => setDealerForm({...dealerForm, remainingBalance: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddDealerModal(false)}
                    className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-zinc-400 font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-gold-505 text-black font-extrabold cursor-pointer"
                  >
                    حفظ البيانات ⚡
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
