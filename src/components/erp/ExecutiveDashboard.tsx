import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, DollarSign, Briefcase, Users, FileText, CheckCircle2, 
  AlertTriangle, Package, ArrowUpRight, ArrowDownLeft, Sparkles, RefreshCw, BarChart3, PieChart as PieIcon, HelpCircle, ShieldAlert, TrendingDown
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface ExecutiveDashboardProps {
  isAr: boolean;
  projectsCount: number;
  inquiriesCount: number;
}

export default function ExecutiveDashboard({ isAr, projectsCount, inquiriesCount }: ExecutiveDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'financial' | 'operations'>('all');

  // Exact executive parameters configured under C-level specifications
  const stats = {
    todayRevenue: 18500,
    todayGrowth: '+12%',
    monthlyRevenue: 245000,
    monthlyGrowth: '+18.4%',
    yearlyRevenue: 1850000,
    yearlyGrowth: '+24.1%',
    netProfit: 720000,
    profitMargin: '38.9%',
    pendingOrders: 12,
    activeProjects: projectsCount || 8,
    newLeads: inquiriesCount || 6,
    inventoryAlerts: 3,
    outstandingCustomers: 120000,
    outstandingSuppliers: 45700
  };

  // Modern corporate trends
  const profitTrendData = [
    { name: isAr ? 'يناير' : 'Jan', Revenue: 110000, Profit: 42000, Margin: 38 },
    { name: isAr ? 'فبراير' : 'Feb', Revenue: 135000, Profit: 51000, Margin: 37 },
    { name: isAr ? 'مارس' : 'Mar', Revenue: 180000, Profit: 72000, Margin: 40 },
    { name: isAr ? 'أبريل' : 'Apr', Revenue: 165000, Profit: 64000, Margin: 38 },
    { name: isAr ? 'مايو' : 'May', Revenue: 210000, Profit: 81000, Margin: 38 },
    { name: isAr ? 'يونيو' : 'Jun', Revenue: stats.monthlyRevenue, Profit: 98000, Margin: 40 },
  ];

  const topMaterials = [
    { name: 'Acrylic Cast 3mm', value: 85, fill: '#e5c060' },
    { name: 'LED Samsung Blue', value: 72, fill: '#60a5fa' },
    { name: 'Steel 304 laser', value: 55, fill: '#a78bfa' },
    { name: 'Aluminum Clad', value: 48, fill: '#f87171' },
    { name: 'German Vinyl Oracal', value: 35, fill: '#34d399' },
  ];

  const [aiInsight, setAiInsight] = useState<string>(
    isAr 
      ? 'تحليل الذكاء الاصطناعي (Gemini BI): يُنصح بتوجيه سداد عاجل لمستحقات الموردين البالغة ٤٥,٧٠٠ ج.م لضمان استمرارية خصم الحجم، وتوجيه فريق المبيعات للتركيز على عقود الكلادينج لارتفاع هوامش أرباحها الصافية إلى ٤٢٪.'
      : 'Executive Summary (Gemini BI): We recommend clearing the outstanding supplier balance of 45,700 EGP to retain raw material volume discounts. Cladding facade contracts exhibit 42% margins; prioritize these in current marketing campaigns.'
  );

  const triggerAiRegen = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAiInsight(
        isAr
          ? 'تحديث ذكي: رصدنا زيادة بنسبة ١٥٪ في استهلاك الأكريليك المصبوب تايواني، يوصى بتمويل الخزينة لتفادي تغير أسعار الصرف، وجدولة تسليمات فرع مادو لرفع معدل دوران رأس المال التشغيلي.'
          : 'Refreshed Advisor: Cast acrylic consumption has risen 15%. Fund raw material reserves immediately to lock in stable supplier pricing and accelerate Mado project deliveries to release trapped EGP liquidity.'
      );
    }, 1000);
  };

  return (
    <div className="space-y-8 font-sans text-right" dir="rtl">
      
      {/* 1. CEO EXECUTIVE SCORECARD (Animated Grid) */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* Today's Revenue */}
        <div className="bg-neutral-950 p-4 rounded-xl border border-gold-500/10 hover:border-gold-505/30 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-12 h-12 bg-gold-950/10 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-[10px] text-zinc-400 block font-bold">{isAr ? 'إيرادات اليوم' : "Today's Revenue"}</span>
          <strong className="text-xl md:text-2xl font-black block mt-1.5 font-mono text-emerald-400">
            {stats.todayRevenue.toLocaleString()} ج.م
          </strong>
          <div className="flex justify-between items-center mt-2.5 border-t border-neutral-900/60 pt-1.5 text-[9px] flex-row-reverse">
            <span className="text-emerald-400 font-mono font-bold">{stats.todayGrowth} ↑</span>
            <span className="text-zinc-500">YAFTA SECURE</span>
          </div>
        </div>

        {/* This Month Revenue */}
        <div className="bg-neutral-950 p-4 rounded-xl border border-gold-500/10 hover:border-gold-505/30 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-12 h-12 bg-gold-950/10 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-[10px] text-zinc-400 block font-bold">{isAr ? 'إيرادات الشهر الحالي' : 'Monthly Revenue'}</span>
          <strong className="text-xl md:text-2xl font-black block mt-1.5 font-mono text-emerald-400">
            {stats.monthlyRevenue.toLocaleString()} ج.m
          </strong>
          <div className="flex justify-between items-center mt-2.5 border-t border-neutral-900/60 pt-1.5 text-[9px] flex-row-reverse">
            <span className="text-emerald-400 font-mono font-bold">{stats.monthlyGrowth} ↑</span>
            <span className="text-zinc-500">YAFTA SECURE</span>
          </div>
        </div>

        {/* Yearly Revenue */}
        <div className="bg-neutral-950 p-4 rounded-xl border border-gold-500/10 hover:border-gold-505/30 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-12 h-12 bg-gold-950/10 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-[10px] text-zinc-400 block font-bold">{isAr ? 'الإيرادات السنوية الكلية' : 'Yearly Revenue'}</span>
          <strong className="text-xl md:text-2xl font-black block mt-1.5 font-mono text-emerald-400">
            {stats.yearlyRevenue.toLocaleString()} ج.م
          </strong>
          <div className="flex justify-between items-center mt-2.5 border-t border-neutral-900/60 pt-1.5 text-[9px] flex-row-reverse">
            <span className="text-emerald-400 font-mono font-bold">{stats.yearlyGrowth} ↑</span>
            <span className="text-zinc-500">YAFTA SECURE</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-neutral-950 p-4 rounded-xl border border-gold-500/10 hover:border-gold-505/30 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-12 h-12 bg-gold-950/10 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-[10px] text-zinc-400 block font-bold">{isAr ? 'صافي أرباح التشغيل' : 'Net Profit'}</span>
          <strong className="text-xl md:text-2xl font-black block mt-1.5 font-mono text-gold-300">
            {stats.netProfit.toLocaleString()} ج.م
          </strong>
          <div className="flex justify-between items-center mt-2.5 border-t border-neutral-900/60 pt-1.5 text-[9px] flex-row-reverse">
            <span className="text-gold-300 font-mono font-bold">{stats.profitMargin} Net</span>
            <span className="text-zinc-500">YAFTA SECURE</span>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-neutral-950 p-4 rounded-xl border border-gold-500/10 hover:border-gold-505/30 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-12 h-12 bg-rose-950/10 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-[10px] text-zinc-400 block font-bold">{isAr ? 'تنبيهات المخازن والخامات' : 'Inventory Alerts'}</span>
          <strong className="text-xl md:text-2xl font-black block mt-1.5 font-mono text-rose-400">
            {stats.inventoryAlerts} {isAr ? 'خامات منخفضة' : 'Low Stock'}
          </strong>
          <div className="flex justify-between items-center mt-2.5 border-t border-neutral-900/60 pt-1.5 text-[9px] flex-row-reverse">
            <span className="text-rose-400 font-mono font-bold">{isAr ? 'فحص عاجل' : 'Check'}</span>
            <span className="text-zinc-500">YAFTA SECURE</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-neutral-950 p-4 rounded-xl border border-gold-500/10 hover:border-gold-505/30 transition-all relative overflow-hidden group">
          <span className="text-[10px] text-zinc-400 block font-bold">{isAr ? 'الطلبيات المعلقة' : 'Pending Orders'}</span>
          <strong className="text-xl md:text-2xl font-black block mt-1.5 font-mono text-amber-400">
            {stats.pendingOrders} {isAr ? 'طلب' : 'Units'}
          </strong>
          <div className="flex justify-between items-center mt-2.5 border-t border-neutral-900/60 pt-1.5 text-[9px] flex-row-reverse">
            <span className="text-amber-400 font-mono">{isAr ? 'بانتظار التعميد' : 'Approval'}</span>
            <span className="text-zinc-500">YAFTA SECURE</span>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-neutral-950 p-4 rounded-xl border border-gold-500/10 hover:border-gold-505/30 transition-all relative overflow-hidden group">
          <span className="text-[10px] text-zinc-400 block font-bold">{isAr ? 'المشاريع قيد التصنيع' : 'Active Projects'}</span>
          <strong className="text-xl md:text-2xl font-black block mt-1.5 font-mono text-blue-400">
            {stats.activeProjects} {isAr ? 'موقع نشط' : 'Sites'}
          </strong>
          <div className="flex justify-between items-center mt-2.5 border-t border-neutral-900/60 pt-1.5 text-[9px] flex-row-reverse">
            <span className="text-blue-400 font-mono">{isAr ? 'تشغيل CNC' : 'Production'}</span>
            <span className="text-zinc-500">YAFTA SECURE</span>
          </div>
        </div>

        {/* New Leads */}
        <div className="bg-neutral-950 p-4 rounded-xl border border-gold-500/10 hover:border-gold-505/30 transition-all relative overflow-hidden group">
          <span className="text-[10px] text-zinc-400 block font-bold">{isAr ? 'العملاء والفرص الجديدة' : 'New Leads'}</span>
          <strong className="text-xl md:text-2xl font-black block mt-1.5 font-mono text-purple-400">
            {stats.newLeads} {isAr ? 'مهتم' : 'Leads'}
          </strong>
          <div className="flex justify-between items-center mt-2.5 border-t border-neutral-900/60 pt-1.5 text-[9px] flex-row-reverse">
            <span className="text-purple-400 font-mono">{isAr ? 'متابعة CRM' : 'CRM Pipe'}</span>
            <span className="text-zinc-500">YAFTA SECURE</span>
          </div>
        </div>

        {/* Outstanding Customer Balances */}
        <div className="bg-neutral-950 p-4 rounded-xl border border-gold-500/10 hover:border-gold-505/30 transition-all relative overflow-hidden group">
          <span className="text-[10px] text-zinc-400 block font-bold">{isAr ? 'مستحقات على العملاء للتحصيل' : 'Outstanding Cust. EGP'}</span>
          <strong className="text-xl md:text-2xl font-black block mt-1.5 font-mono text-emerald-400">
            {stats.outstandingCustomers.toLocaleString()} ج.م
          </strong>
          <div className="flex justify-between items-center mt-2.5 border-t border-neutral-900/60 pt-1.5 text-[9px] flex-row-reverse">
            <span className="text-emerald-400 font-mono">{isAr ? 'مطالبات نشطة' : 'Receivables'}</span>
            <span className="text-zinc-500">YAFTA SECURE</span>
          </div>
        </div>

        {/* Outstanding Supplier Balances */}
        <div className="bg-neutral-950 p-4 rounded-xl border border-gold-500/10 hover:border-gold-505/30 transition-all relative overflow-hidden group">
          <span className="text-[10px] text-zinc-400 block font-bold">{isAr ? 'مستحقات للموردين والتجار' : 'Outstanding Supp. EGP'}</span>
          <strong className="text-xl md:text-2xl font-black block mt-1.5 font-mono text-rose-400">
            {stats.outstandingSuppliers.toLocaleString()} ج.م
          </strong>
          <div className="flex justify-between items-center mt-2.5 border-t border-neutral-900/60 pt-1.5 text-[9px] flex-row-reverse">
            <span className="text-rose-400 font-mono">{isAr ? 'مدفوعات مطلوبة' : 'Payables'}</span>
            <span className="text-zinc-500">YAFTA SECURE</span>
          </div>
        </div>

      </section>

      {/* 2. GEMINI BI INTELLIGENCE DESK */}
      <div className="p-5 bg-gold-950/20 border border-gold-550/25 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-right flex-row-reverse relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-gold-505/5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="flex gap-3 items-start flex-row-reverse">
          <div className="w-10 h-10 rounded-xl bg-gold-950/80 border border-gold-505/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-gold-505" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-gold-300 flex items-center gap-1.5 justify-end">
              <span>{isAr ? 'مستشار ذكاء الأعمال والنمو الاستراتيجي (Gemini BI)' : 'Gemini BI - Corporate Growth Analytics'}</span>
            </h4>
            <p className="text-[11px] text-neutral-200 leading-relaxed max-w-4xl">
              {aiInsight}
            </p>
          </div>
        </div>
        <button 
          onClick={triggerAiRegen}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-gold-300 via-gold-505 to-gold-400 hover:from-gold-200 text-black text-[10px] font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer select-none shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{isAr ? 'تحديث التحليل الذكي ⚡' : 'Refresh Insights ⚡'}</span>
        </button>
      </div>

      {/* 3. ENTERPRISE REVENUE GROWTH & PROFIT TRENDS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profit and Revenue Trends (8/12 width) */}
        <div className="lg:col-span-8 bg-neutral-950 p-5 rounded-2xl border border-gold-500/10 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4 flex-row-reverse">
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <span>{isAr ? 'منحنى نمو الإيرادات وصافي الأرباح:' : 'Executive Inflow & Net Margin Progression:'}</span>
              <BarChart3 className="w-4 h-4 text-gold-505" />
            </h4>
            <span className="text-[9px] text-zinc-500 font-bold uppercase">H1 Fiscal Report</span>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitTrendData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e5c060" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#e5c060" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" />
                <XAxis dataKey="name" stroke="#444" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                <YAxis stroke="#444" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ backgroundColor: '#050505', borderColor: '#d4af37', fontSize: '10px', borderRadius: '12px', textAlign: 'right' }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', direction: 'rtl' }} />
                <Area name={isAr ? 'الإيرادات التشغيلية' : 'Operating Revenue'} type="monotone" dataKey="Revenue" stroke="#e5c060" strokeWidth={2.5} fillOpacity={1} fill="url(#profitGrad)" />
                <Line name={isAr ? 'صافي أرباح الشركة' : 'Net Corporate Profit'} type="monotone" dataKey="Profit" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Warehouse Material Consumption Index (4/12 width) */}
        <div className="lg:col-span-4 bg-neutral-950 p-5 rounded-2xl border border-gold-500/10 space-y-4">
          <h4 className="text-xs font-black text-white flex items-center gap-1.5 justify-end">
            <span>{isAr ? 'معدل سحب واستهلاك خامات التصنيع:' : 'Raw Material Sourcing Burn rate:'}</span>
            <Package className="w-4 h-4 text-gold-505" />
          </h4>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topMaterials} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" />
                <XAxis type="number" stroke="#444" tick={{ fontSize: 9 }} />
                <YAxis dataKey="name" type="category" stroke="#444" tick={{ fontSize: 8, fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ backgroundColor: '#050505', borderColor: '#d4af37', fontSize: '10px' }} />
                <Bar name={isAr ? 'معدل الاستهلاك' : 'Burn index'} dataKey="value" fill="#e5c060" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

    </div>
  );
}
