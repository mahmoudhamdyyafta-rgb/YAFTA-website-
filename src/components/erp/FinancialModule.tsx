/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Receipt, TrendingUp, CreditCard, Plus, ArrowUpRight, 
  ArrowDownLeft, Filter, Calendar, BarChart2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FinanceRecord {
  id: string;
  title: string;
  type: 'Revenue' | 'Expense';
  amount: number;
  category: string;
  payMethod: 'Bank Transfer' | 'Cash' | 'Credit Card' | 'Installment';
  date: string;
}

interface Props {
  isAr: boolean;
  canEdit: boolean;
}

export default function FinancialModule({ isAr, canEdit }: Props) {
  // Financial Records (Expenses & Revenues)
  const [records, setRecords] = useState<FinanceRecord[]>(() => {
    const saved = localStorage.getItem('yafta_erp_finance');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'tx-1', title: 'Payment for Cladding Facade - Elite Care', type: 'Revenue', amount: 85000, category: 'Commercial Signage', payMethod: 'Bank Transfer', date: '2026-06-18' },
      { id: 'tx-2', title: 'Purchase of Samsung 12V LED chips bulk #90', type: 'Expense', amount: 32000, category: 'Production Materials', payMethod: 'Credit Card', date: '2026-06-15' },
      { id: 'tx-3', title: 'Design branding deposit - Y Burger', type: 'Revenue', amount: 45000, category: 'Graphics Design Service', payMethod: 'Cash', date: '2026-06-12' },
      { id: 'tx-4', title: 'Monthly Rental for Workshop CNC area Cairo', type: 'Expense', amount: 18000, category: 'Operations & Rent', payMethod: 'Bank Transfer', date: '2026-06-01' },
      { id: 'tx-5', title: 'Neon Flex materials custom shipment import', type: 'Expense', amount: 11500, category: 'Workshop cons.', payMethod: 'Bank Transfer', date: '2026-06-05' },
      { id: 'tx-6', title: 'Installation logistics fuel and crane rental Dokki', type: 'Expense', amount: 6500, category: 'Logistics', payMethod: 'Cash', date: '2026-06-14' },
      { id: 'tx-7', title: 'Full payment - Signature Hair Salon backlit signage', type: 'Revenue', amount: 25000, category: 'Commercial Signage', payMethod: 'Bank Transfer', date: '2026-06-10' }
    ];
  });

  const [filterType, setFilterType] = useState<'all' | 'Revenue' | 'Expense'>('all');
  const [addingRecord, setAddingRecord] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Revenue' | 'Expense'>('Revenue');
  const [amount, setAmount] = useState(15000);
  const [category, setCategory] = useState('Commercial Signage');
  const [payMethod, setPayMethod] = useState<'Bank Transfer' | 'Cash' | 'Credit Card' | 'Installment'>('Bank Transfer');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Aggregate stats
  const totalRevenue = records.filter(r => r.type === 'Revenue').reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = records.filter(r => r.type === 'Expense').reduce((sum, r) => sum + r.amount, 0);
  const netProfit = totalRevenue - totalExpense;

  useEffect(() => {
    localStorage.setItem('yafta_erp_finance', JSON.stringify(records));
  }, [records]);

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newRecord: FinanceRecord = {
      id: `tx-${Date.now()}`,
      title,
      type,
      amount,
      category,
      payMethod,
      date
    };

    setRecords([newRecord, ...records]);
    setTitle('');
    setAddingRecord(false);
    alert(isAr ? 'تم تقييد القيد المالي بالحسابات المعتمدة لـ يافطة!' : 'Financial record posted to general ledger.');
  };

  const filteredRecords = records.filter(r => filterType === 'all' || r.type === filterType);

  // Recharts Chart Data aggregation
  const chartData = [
    { name: 'May 20', Revenue: 60000, Expense: 20000 },
    { name: 'May 30', Revenue: 95000, Expense: 35000 },
    { name: 'Jun 10', Revenue: 135000, Expense: 55000 },
    { name: 'Jun 19', Revenue: totalRevenue, Expense: totalExpense }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 flex-row-reverse text-right">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-end">
            <DollarSign className="w-5 h-5 text-gold-505" />
            <span>{isAr ? 'منظومة الإدارة المالية والحسابات المركزية' : 'Billing Ledger & Finance Center'}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isAr ? 'الإيرادات، تكاليف تصنيع اللوحات الميدانية، والأرباح الصافية للوكالة' : 'Supervise incoming client wire deposits, bulk raw bills, margin metrics.'}
          </p>
        </div>

        <div>
          {canEdit && (
            <button 
              onClick={() => {
                setTitle('');
                setAddingRecord(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-gold-300 to-gold-505 hover:from-gold-250 text-black text-xs font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'تسجيل معاملة مالية (قيد)' : 'Post Ledger Entry'}</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI summaries cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { labelAr: 'إجمالي المقبوضات والإيرادات', labelEn: 'Aggregate Revenues', val: `${totalRevenue.toLocaleString()} ج.م`, icon: <ArrowUpRight className="w-5 h-5 text-emerald-400" />, bg: 'border-emerald-500/20' },
          { labelAr: 'المصاريف والخامات والمصنعيات', labelEn: 'Disbursements & Raw costs', val: `${totalExpense.toLocaleString()} ج.م`, icon: <ArrowDownLeft className="w-5 h-5 text-rose-400" />, bg: 'border-rose-500/20' },
          { labelAr: 'صافي الأرباح الصالحة للميزانية', labelEn: 'Net Balance margin', val: `${netProfit.toLocaleString()} ج.م`, icon: <TrendingUp className="w-5 h-5 text-gold-505" />, bg: 'border-gold-505/20' }
        ].map((stat, i) => (
          <div key={i} className={`bg-neutral-950 p-5 rounded-2xl border ${stat.bg} flex items-center justify-between text-right`}>
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0">
              {stat.icon}
            </div>
            <div className="space-y-1">
              <span className="text-xs text-neutral-400 block">{isAr ? stat.labelAr : stat.labelEn}</span>
              <strong className="text-xl md:text-2xl font-black text-white block font-mono">{stat.val}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Split visual chart and ledger table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        
        {/* Visual Analytics Chart */}
        <div className="lg:col-span-1 bg-neutral-950 rounded-2xl border border-gold-500/10 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 justify-end text-right">
            <span>{isAr ? 'التدفقات المالية للأشهر الأخيرة:' : 'Financial Cash Flow analysis:'}</span>
            <BarChart2 className="w-4 h-4 text-gold-505" />
          </h3>
          <p className="text-[10px] text-neutral-400 text-right">
            {isAr ? 'مقارنة بين إجمالي الدخل الوارد من مشاريع الإعلان مقابل تكاليف التشديد بالقطاع' : 'Dynamic comparison of client sign orders vs raw import bills.'}
          </p>

          <div className="h-60 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenues" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222"/>
                <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 9 }}/>
                <YAxis stroke="#666" tick={{ fontSize: 9 }}/>
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#d4af37', color: '#fff', fontSize: '11px', textRight: 'true' }}/>
                <Area type="monotone" dataKey="Revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenues)" strokeWidth={2.5} name={isAr ? 'الإيرادات':'Revenue'}/>
                <Area type="monotone" dataKey="Expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2.5} name={isAr ? 'المصروفات':'Expenses'}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ledger general table */}
        <div className="lg:col-span-2 bg-neutral-950 rounded-2xl border border-gold-500/10 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-neutral-900 pb-3 flex-row-reverse text-right">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{isAr ? 'دفتر اليومية وقيود الحسابات:' : 'General journal ledger ledger entries:'}</span>
              <Receipt className="w-4 h-4 text-gold-505" />
            </h3>

            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="bg-neutral-900 border border-neutral-800 text-neutral-300 p-1.5 text-xs rounded-lg focus:outline-none"
              >
                <option value="all">{isAr ? 'الكل' : 'All transactions'}</option>
                <option value="Revenue">{isAr ? 'المقبووضات فقط' : 'Incoming deposits'}</option>
                <option value="Expense">{isAr ? 'المصروفات فقط' : 'Expenses'}</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto text-xs text-right">
            <table className="w-full divide-y divide-neutral-900">
              <thead className="bg-neutral-900 text-gold-300 font-bold">
                <tr>
                  <th className="p-3 text-right">{isAr ? 'البيان التعاقدي' : 'Transaction Remarks'}</th>
                  <th className="p-3 text-right">{isAr ? 'النوع' : 'Class'}</th>
                  <th className="p-3 text-right">{isAr ? 'القيمة المالية' : 'Invoice Amount'}</th>
                  <th className="p-3 text-right">{isAr ? 'البنك / طريقة الدفع' : 'Payment Method'}</th>
                  <th className="p-3 text-right">{isAr ? 'التاريخ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/50 text-neutral-300">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-neutral-900/30">
                    <td className="p-3 font-semibold text-white">{rec.title}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        rec.type === 'Revenue' 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/15' 
                          : 'bg-rose-950 text-rose-300 border border-rose-500/10'
                      }`}>
                        {isAr ? (rec.type === 'Revenue' ? 'إيراد' : 'مصروف') : rec.type}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-black text-white">{rec.amount.toLocaleString()} ج.م</td>
                    <td className="p-3 text-zinc-400">{rec.payMethod}</td>
                    <td className="p-3 font-mono text-[10px]">{rec.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Record Dialogue */}
      {addingRecord && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-md w-full relative space-y-6 text-right font-sans">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 justify-end border-b border-neutral-900 pb-3">
              <span>{isAr ? 'تسجيل قيد مالي جديد بالحسابات' : 'Post Financial Record to Ledger'}</span>
              <DollarSign className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleCreateRecord} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-350 text-neutral-300 font-bold block">{isAr ? 'البيان / تفصيل السداد:' : 'Particulars/Narration:'}</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: دفعة تحت الحساب لواجهة كودو"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-805 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-550 text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'الفئة والتصنيف:' : 'Category Class:'}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2 text-xs text-white"
                  >
                    <option value="Commercial Signage">Commercial Signage</option>
                    <option value="Production Materials">Production Materials</option>
                    <option value="Graphics Design Service">Graphics Design Specialty</option>
                    <option value="Operations & Rent">Operations & Office Rent</option>
                    <option value="Logistics">Workshop Logistics & Crane</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'طبيعية المعاملة:' : 'Entry Class:'}</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2 text-xs text-white font-bold text-center"
                  >
                    <option value="Revenue">{isAr ? 'مقبوضات (Revenue)' : 'Revenue'}</option>
                    <option value="Expense">{isAr ? 'مصروفات (Expense)' : 'Expense'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'قيمة المعاملة (EGP):' : 'Amount EGP:'}</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2 text-xs text-white text-center font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'البنك / طريقة التسوية:' : 'Settlement node:'}</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2 text-xs text-white text-center"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Installment">Installment</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'التاريخ المالي:' : 'Posting Date:'}</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-xs text-white text-center font-mono"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setAddingRecord(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black text-xs font-black rounded-lg cursor-pointer"
                >
                  {isAr ? 'تقييد الحساب 💳' : 'Post Ledger Entry 💳'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
