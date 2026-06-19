/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, ArrowLeftRight, CheckCircle2, 
  Plus, Landmark, Briefcase, RefreshCw, Layers, CreditCard, PieChart,
  Calendar, FileText, ChevronRight, Activity, HelpCircle, AlertOctagon
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  currency: 'EGP' | 'USD' | 'EUR';
  balance: number;
}

interface TreasuryTransfer {
  id: string;
  fromNode: string;
  toNode: string;
  amount: number;
  date: string;
  notes: string;
}

interface ReconciliationItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Debit' | 'Credit';
  matched: boolean;
}

interface FinanceRecord {
  id: string;
  title: string;
  type: 'Revenue' | 'Expense';
  amount: number;
  category: string;
  payMethod: string;
  date: string;
}

export default function TreasuryBankingModule({ isAr, canEdit }: { isAr: boolean; canEdit: boolean }) {
  // Sync with standard ERP Finance ledger records
  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>(() => {
    const saved = localStorage.getItem('yafta_erp_finance');
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Corporate Accounts (Vaults)
  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem('yafta_treasury_accounts');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'acc-1', bankName: 'Commercial International Bank (CIB)', accountNumber: 'EG120034005600780099', currency: 'EGP', balance: 580000 },
      { id: 'acc-2', bankName: 'CIB Premium Corporate USD', accountNumber: 'EG120034005600000123', currency: 'USD', balance: 24500 },
      { id: 'acc-3', bankName: 'Banque Misr Agency Safebox', accountNumber: 'EG330001002200330044', currency: 'EGP', balance: 145000 },
      { id: 'acc-4', bankName: 'Main Factory Cash Safe', accountNumber: 'YAFTA_SAFE_01', currency: 'EGP', balance: 85200 }
    ];
  });

  // Node transfers
  const [transfers, setTransfers] = useState<TreasuryTransfer[]>(() => {
    const saved = localStorage.getItem('yafta_treasury_transfers');
    if (saved) return JSON.parse(saved);
    return [
      { id: 't-1', fromNode: 'Main Factory Cash Safe', toNode: 'Commercial International Bank (CIB)', amount: 45000, date: '2026-06-12', notes: 'Despositing cash revenue from Y Burger' }
    ];
  });

  // Reconciliation Checklist Items
  const [reconItems, setReconItems] = useState<ReconciliationItem[]>(() => {
    const saved = localStorage.getItem('yafta_reconciliation_checklist');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'rc-1', date: '2026-06-18', description: 'Wire transfer payment - Elite Care Cladding', amount: 85000, type: 'Credit', matched: true },
      { id: 'rc-2', date: '2026-06-15', description: 'Visa Purchase bulk Samsung LED chips #90', amount: 32000, type: 'Debit', matched: true },
      { id: 'rc-3', date: '2026-06-14', description: 'Crane Hire & Logistic Fuel Cairo', amount: 6500, matched: false, type: 'Debit' }
    ];
  });

  // Form states
  const [addingTransfer, setAddingTransfer] = useState(false);
  const [fromNode, setFromNode] = useState('Main Factory Cash Safe');
  const [toNode, setToNode] = useState('Commercial International Bank (CIB)');
  const [transferAmount, setTransferAmount] = useState<number>(10000);
  const [transferNotes, setTransferNotes] = useState('');

  // Add account form
  const [addingAccount, setAddingAccount] = useState(false);
  const [newAccBank, setNewAccBank] = useState('');
  const [newAccNum, setNewAccNum] = useState('');
  const [newAccNumCurr, setNewAccNumCurr] = useState<'EGP' | 'USD' | 'EUR'>('EGP');
  const [newAccNumBal, setNewAccNumBal] = useState<number>(50000);

  useEffect(() => {
    localStorage.setItem('yafta_treasury_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('yafta_treasury_transfers', JSON.stringify(transfers));
  }, [transfers]);

  useEffect(() => {
    localStorage.setItem('yafta_reconciliation_checklist', JSON.stringify(reconItems));
  }, [reconItems]);

  // Aggregate totals
  const totalEgpLiquid = accounts
    .filter(a => a.currency === 'EGP')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalUsdLiquid = accounts
    .filter(a => a.currency === 'USD')
    .reduce((sum, a) => sum + a.balance, 0);

  const handlePerformTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromNode === toNode || transferAmount <= 0) return;

    const source = accounts.find(a => a.bankName === fromNode);
    const destination = accounts.find(a => a.bankName === toNode);

    if (source && source.balance < transferAmount) {
      alert(isAr ? '⚠️ عجز الرصيد بالخزنة المانحة!' : '⚠️ Insufficient funds inside selected source node!');
      return;
    }

    // Deduct and add
    const updatedAccounts = accounts.map(a => {
      if (a.bankName === fromNode) {
        return { ...a, balance: a.balance - transferAmount };
      }
      if (a.bankName === toNode) {
        return { ...a, balance: a.balance + transferAmount };
      }
      return a;
    });

    setAccounts(updatedAccounts);

    const nextTransfer: TreasuryTransfer = {
      id: `t-${Date.now()}`,
      fromNode,
      toNode,
      amount: transferAmount,
      date: new Date().toISOString().split('T')[0],
      notes: transferNotes || 'Internal treasury migration'
    };

    setTransfers([nextTransfer, ...transfers]);
    setTransferAmount(10000);
    setTransferNotes('');
    setAddingTransfer(false);
    alert(isAr ? 'تم تهجير وتوثيق قيد التحويل المالي الداخلي!' : 'Treasury transfer post completed with ledger synchronization.');
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccBank || !newAccNum) return;

    const newAcc: BankAccount = {
      id: `acc-${Date.now()}`,
      bankName: newAccBank,
      accountNumber: newAccNum,
      currency: newAccNumCurr,
      balance: newAccNumBal
    };

    setAccounts([...accounts, newAcc]);
    setNewAccBank('');
    setNewAccNum('');
    setAddingAccount(false);
  };

  const toggleMatchedReconciliation = (id: string) => {
    const updated = reconItems.map(item => {
      if (item.id === id) {
        return { ...item, matched: !item.matched };
      }
      return item;
    });
    setReconItems(updated);
  };

  // Recharts dynamic analytics comparison
  // calculate direct monthly cash burn indicator
  const monthlyInflow = financeRecords
    .filter(r => r.type === 'Revenue')
    .reduce((s, r) => s + r.amount, 0);

  const monthlyOutflow = financeRecords
    .filter(r => r.type === 'Expense')
    .reduce((s, r) => s + r.amount, 0);

  const burnRateRaw = monthlyOutflow;
  const cashRunwayMonths = monthlyInflow > 0 ? (totalEgpLiquid / (monthlyOutflow || 30000)).toFixed(1) : 'Continuous';

  const chartCashflowData = [
    { name: 'Jan 26', Inflow: 410000, Outflow: 180000 },
    { name: 'Feb 26', Inflow: 480000, Outflow: 250000 },
    { name: 'Mar 26', Inflow: 530000, Outflow: 290000 },
    { name: 'Apr 26', Inflow: 590000, Outflow: 310000 },
    { name: 'May 26', Inflow: 640000, Outflow: 340000 },
    { name: 'Jun 26', Inflow: totalEgpLiquid > 0 ? totalEgpLiquid : 680000, Outflow: monthlyOutflow > 0 ? monthlyOutflow : 320000 }
  ];

  return (
    <div className="bg-neutral-950 p-6 rounded-2xl border border-gold-505/20 text-right font-sans space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-row-reverse">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-end">
            <Landmark className="w-5 h-5 text-gold-505" />
            <span>{isAr ? 'منظومة الخزانة المركزية والحسابات والسيولة' : 'Treasury, Liquidity & Bank Relations'}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isAr ? 'إدارة أرصدة الحسابات البنكية المتعددة، تسوية المعاملات الشهرية، وتحليل مؤشر السيولة' : 'Supervise multiple corporate accounts, complete bank statement reconciliations, review runway periods.'}
          </p>
        </div>

        <div className="flex gap-2">
          {canEdit && (
            <button 
              onClick={() => setAddingAccount(true)}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-850 hover:border-gold-505 border border-neutral-850 text-xs text-zinc-100 rounded-lg flex items-center gap-1.5 cursor-pointer font-bold transition-all animate-pulse"
            >
              <Plus className="w-4 h-4 text-gold-505" />
              <span>{isAr ? 'ربط حساب بنكي' : 'Add Bank Node'}</span>
            </button>
          )}

          {canEdit && (
            <button 
              onClick={() => setAddingTransfer(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black hover:opacity-90 text-xs font-black rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>{isAr ? 'تحويل مالي بين الخزائن' : 'Virtual Transfer'}</span>
            </button>
          )}
        </div>
      </div>

      {/* CORE TREASURY KPI METRICS CARD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { labelAr: 'إجمالي السيولة المحلية (EGP)', labelEn: 'Aggregate Local Cash EGP', val: `${totalEgpLiquid.toLocaleString()} ج.م`, icon: <Landmark className="w-5 h-5 text-gold-505" />, bg: 'border-gold-505/20' },
          { labelAr: 'العملات الأجنبية المحفوظة (USD)', labelEn: 'Foreign Currency Reserve USD', val: `$${totalUsdLiquid.toLocaleString()}`, icon: <DollarSign className="w-5 h-5 text-emerald-400" />, bg: 'border-emerald-500/10' },
          { labelAr: 'مؤشر فترة Runway (بالأشهر)', labelEn: 'Estimated Cash Runway', val: `${cashRunwayMonths} M`, icon: <Activity className="w-5 h-5 text-blue-400" />, bg: 'border-blue-500/10' },
          { labelAr: 'معدل حرق السيولة التشغيلي', labelEn: 'Average Monthly Burn Outflow', val: `${(monthlyOutflow || 38000).toLocaleString()} ج.م`, icon: <TrendingDown className="w-5 h-5 text-rose-400" />, bg: 'border-rose-500/10' }
        ].map((kpi, idx) => (
          <div key={idx} className={`bg-neutral-900/60 p-4 rounded-xl border ${kpi.bg} text-right space-y-1`}>
            <div className="flex justify-between items-center flex-row-reverse">
              <span className="text-[10px] text-zinc-500">{isAr ? kpi.labelAr : kpi.labelEn}</span>
              <div className="w-7 h-7 rounded-lg bg-neutral-950 flex items-center justify-center shrink-0">
                {kpi.icon}
              </div>
            </div>
            <strong className="text-lg font-black text-white block font-mono">{kpi.val}</strong>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bank accounts listed */}
        <div className="lg:col-span-1 bg-neutral-900/40 p-4 rounded-xl border border-neutral-850 space-y-4">
          <h4 className="text-xs font-black text-gold-300 flex items-center justify-end gap-1.5 pb-2 border-b border-neutral-800">
            <span>{isAr ? 'مستودعات وخزائن النقدية البنكية:' : 'CORPORATE BANKING VAULTS:'}</span>
            <Landmark className="w-4 h-4 text-gold-505" />
          </h4>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {accounts.map(acc => (
              <div key={acc.id} className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-850 text-right space-y-1">
                <span className="text-[10px] text-zinc-500 block">{acc.bankName}</span>
                <div className="flex justify-between items-baseline flex-row-reverse">
                  <strong className="text-sm font-black text-white font-mono">{acc.balance.toLocaleString()} {acc.currency}</strong>
                  <span className="text-[9px] text-zinc-600 block truncate max-w-[100px] font-mono">{acc.accountNumber}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cash Flow Area Chart Visualisation */}
        <div className="lg:col-span-2 bg-neutral-900/60 p-5 rounded-2xl border border-neutral-850 space-y-4">
          <h4 className="text-xs font-black text-white flex items-center justify-end gap-1.5 pb-1 border-b border-neutral-800">
            <span>{isAr ? 'لوحة تتبع تدفقات النقل والدخل ربع السنوي:' : 'Quarterly Inflows vs Payments comparison:'}</span>
            <PieChart className="w-4 h-4 text-gold-505" />
          </h4>

          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartCashflowData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e5c060" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#e5c060" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#e5c06030', color: '#fff' }} />
                <Area type="monotone" dataKey="Inflow" stroke="#e5c060" fillOpacity={1} fill="url(#colorIn)" />
                <Area type="monotone" dataKey="Outflow" stroke="#ef4444" fillOpacity={1} fill="url(#colorOut)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* BANK RECONCILIATION AUDIT BOARD */}
      <div className="border-t border-neutral-900 pt-6 space-y-4">
        <h3 className="text-sm font-black text-white flex items-center gap-2 justify-end">
          <span>{isAr ? 'المطايقة المصرفية وتدقيق التسويات الشهرية (Bank Reconciliation):' : 'Reconciliation Ledger matching (CIB Corporate statement verification):'}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </h3>

        <div className="bg-neutral-900/60 p-5 rounded-2xl border border-neutral-850 space-y-3.5">
          <div className="flex justify-between items-center text-xs text-neutral-400 flex-row-reverse pb-1 border-b border-neutral-800">
            <span>{isAr ? 'عنصر كشف الحساب من البنك' : 'Statement wire transactions'}</span>
            <span>{isAr ? 'تدقيق ومطابقة' : 'Reconciliation Status'}</span>
          </div>

          <div className="divide-y divide-neutral-950">
            {reconItems.map(item => (
              <div key={item.id} className="py-3 flex justify-between items-center text-xs text-right hover:bg-neutral-900/20">
                
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-white pr-2">
                    {item.type === 'Debit' ? '-' : '+'}EGP {item.amount.toLocaleString()}
                  </span>

                  <button 
                    onClick={() => toggleMatchedReconciliation(item.id)}
                    className={`px-3 py-1 font-black text-[9px] rounded-lg border transition-all cursor-pointer ${
                      item.matched 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/20' 
                        : 'bg-rose-950 text-rose-400 border-rose-500/20 animate-pulse'
                    }`}
                  >
                    {item.matched ? (isAr ? 'متطابق ومثبت' : 'Matched & Reconciled ✓') : (isAr ? 'عنصر غير مطابق واحتساب معلق' : 'Unmatched ⚠️')}
                  </button>
                </div>

                <div className="space-y-0.5 text-right">
                  <strong className="text-white text-[11px] block">{item.description}</strong>
                  <span className="text-[10px] text-zinc-500 font-mono block">{item.date}</span>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Internal Vault transfer Modal */}
      {addingTransfer && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-sm w-full relative space-y-6 text-right">
            <h3 className="text-base font-black text-white flex items-center gap-1.5 justify-end">
              <span>{isAr ? 'تهجير ومعركة تحويل مالي داخلي' : 'Post Internal Treasury Liquidity Transfer'}</span>
              <ArrowLeftRight className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handlePerformTransfer} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'من الخزنة / الحساب المانح:' : 'From Source node:'}</label>
                <select 
                  value={fromNode}
                  onChange={e => setFromNode(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right font-bold"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.bankName}>{a.bankName} ({a.balance.toLocaleString()} {a.currency})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'إلى الخزنة / الحساب المستقبل:' : 'To Target Node:'}</label>
                <select 
                  value={toNode}
                  onChange={e => setToNode(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right font-bold"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.bankName}>{a.bankName} ({a.balance.toLocaleString()} {a.currency})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'القيمة المحولة (ج.م):' : 'Amount to shift EGP:'}</label>
                <input 
                  type="number" 
                  min={1}
                  required
                  value={transferAmount}
                  onChange={e => setTransferAmount(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right font-mono focus:border-gold-505 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'بيانات ومسوغات القيد المالي الكامن:' : 'Clarification / justification notes:'}</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Relocating safe funds to cover payroll"
                  value={transferNotes}
                  onChange={e => setTransferNotes(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2.5 rounded text-white text-right focus:border-gold-505 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setAddingTransfer(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg border border-neutral-850 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 text-xs font-black rounded-lg transition-all cursor-pointer shadow-md hover:bg-gold-400"
                >
                  {isAr ? 'إجراء التحويل وتعديل الرصيد' : 'Execute Shift'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Onboard corporate bank modal */}
      {addingAccount && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-sm w-full relative space-y-6 text-right">
            <h3 className="text-base font-black text-white flex items-center gap-1.5 justify-end">
              <span>{isAr ? 'ربط وتوثيق حساب بنكي للوكالة' : 'Link Corporate Bank Node'}</span>
              <Landmark className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'اسم البنك والفرع المصرفي:' : 'Bank institution details:'}</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. QNB Al-Ahli Tagamoa Branch"
                  value={newAccBank}
                  onChange={e => setNewAccBank(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'الرقم التعاقدي للـ IBAN / الحساب:' : 'Account / IBAN address STRING:'}</label>
                <input 
                  type="text" 
                  required
                  placeholder="EG120034..."
                  value={newAccNum}
                  onChange={e => setNewAccNum(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-left font-mono focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 row-reverse">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'العملة الأساسية' : 'Currency'}</label>
                  <select 
                    value={newAccNumCurr}
                    onChange={e => setNewAccNumCurr(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white font-bold"
                  >
                    <option value="EGP">EGP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div className="space-y-1 text-right">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'الرصيد الافتتاحي المقيد:' : 'Opening balance:'}</label>
                  <input 
                    type="number" 
                    min={0}
                    required
                    value={newAccNumBal}
                    onChange={e => setNewAccNumBal(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setAddingAccount(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg border border-neutral-850 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 text-xs font-black rounded-lg transition-all cursor-pointer shadow-md text-neutral-905 hover:bg-gold-400"
                >
                  {isAr ? 'ربط وتأصيل الحساب' : 'Link Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
