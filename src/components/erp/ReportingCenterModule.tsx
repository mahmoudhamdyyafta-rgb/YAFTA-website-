/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileSpreadsheet, Award, Calendar, DollarSign, Package, Users, Download,
  TrendingUp, BarChart2, CheckCircle2, ShieldCheck, Sparkles
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Props {
  isAr: boolean;
}

export default function ReportingCenterModule({ isAr }: Props) {
  const [activeTab, setActiveTab] = useState<'sales' | 'inventory' | 'hr'>('sales');

  // Trigger simulated files export of CSV
  const handleExportCSV = (reportType: string) => {
    let headers: string[] = [];
    let rows: any[] = [];
    
    if (reportType === 'sales_financial') {
      headers = ['Transaction ID', 'Item Particulars', 'Flow Group', 'Amount EGP', 'Posting Date'];
      rows = [
        ['TX-01', 'Elite Care Facade Final Wire', 'Revenue', 85000, '2026-06-18'],
        ['TX-02', 'Samsung 12V LED chips bulk #90', 'Expense', 32000, '2026-06-15'],
        ['TX-03', 'Y Burger Design deposit', 'Revenue', 45000, '2026-06-12'],
        ['TX-04', 'CNC Workshop Lease', 'Expense', 18000, '2026-06-01']
      ];
    } else if (reportType === 'materials_inventory') {
      headers = ['SKU ID', 'Material Description', 'Current In Stock', 'Unit measure', 'Supplier name'];
      rows = [
        ['MAT-1', 'Taiwanese Acrylic Clear 3mm', 145, 'sheets', 'Al-Rowad Plastics'],
        ['MAT-2', 'Oracal Vinyl German Matte', 12, 'rolls', 'Delta Trading'],
        ['MAT-3', 'Samsung LED korean original', 85, 'chips', 'Yatta Glow Co.'],
        ['MAT-4', 'Aluminium Fireproof Cladding', 38, 'sheets', 'Emaar Metals']
      ];
    } else {
      headers = ['ID Number', 'Name', 'Department Domain', 'Rating Quality', 'Net waged EGP'];
      rows = [
        ['EMP-1', 'Eng. Amr Soliman', 'Engineering & Design', 5, 31500],
        ['EMP-2', 'Sherif Aly', 'Sales & Marketing', 4, 18950],
        ['EMP-3', 'Zaki Abdelrahman', 'Welding & Assembly', 5, 13500]
      ];
    }

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" // Add UTF-8 BOM for Arabic/Special chars
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `yafta_erp_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(isAr 
      ? 'تم توليد وتنزيل الجدول الحسابي (Excel CSV) الموثق بأمان بنجاح!' 
      : 'Excel CSV Sheet generated locally and transmitted to your browser download queue!'
    );
  };

  const handleExportPDF = (reportName: string) => {
    alert(isAr
      ? `جاري تهيئة خادم يافطة الإعلاني لتجهيز وطبع التقرير المصدق عالي الدقة (${reportName}.pdf)...`
      : `Generating secured corporate PDF document for [${reportName}]. Please prepare local printer...`
    );
    window.print();
  };

  // Recharts Sales distribution metrics
  const conversionData = [
    { name: 'Initial Lead', count: 18 },
    { name: 'Contact Established', count: 12 },
    { name: 'Quote Delivered', count: 8 },
    { name: 'Closed-Won Contracts', count: 5 }
  ];

  const inventorySpread = [
    { name: 'Acrylic Casts', value: 45 },
    { name: 'Led chips', value: 25 },
    { name: 'Iron tubing', value: 18 },
    { name: 'Vinyl sheets', value: 12 }
  ];

  const COLORS = ['#d4af37', '#1a1a1a', '#a3a3a3', '#525252'];

  return (
    <div className="space-y-6">
      {/* Header and top buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 flex-row-reverse text-right">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-end">
            <FileSpreadsheet className="w-5 h-5 text-gold-505" />
            <span>{isAr ? 'مركز لوحات التقارير والتدقيق الحسابي' : 'Analytical Corporate Reporting Center'}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isAr ? 'لوحة القيادة البيانية، تقارير النواقص، كشوفات الجرد الفورية، تصدير ملفات إكسل وبي دي إف' : 'Export unified audit ledgers, staff performance lists, material logs.'}
          </p>
        </div>

        {/* Global summary status indicator */}
        <span className="text-[10px] bg-neutral-900 border border-gold-505/20 text-gold-303 text-gold-300 px-3 py-1.5 rounded-xl font-mono uppercase">
          ✦ System integrity status: clean 100%
        </span>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-sans">
        
        {/* Navigation block */}
        <div className="lg:col-span-1 bg-neutral-950 p-5 rounded-2xl border border-gold-500/10 space-y-4 text-right">
          <h3 className="text-xs font-black text-gold-300 tracking-wider uppercase pb-2 border-b border-neutral-900 flex items-center gap-1.5 justify-end">
            <span>{isAr ? 'مستندات الجرد المتاحة:' : 'COMPLIANCE AUDIT SHEETS:'}</span>
            <Sparkles className="w-4 h-4 text-gold-505" />
          </h3>

          <div className="flex flex-col gap-2">
            {[
              { id: 'sales', titleAr: 'المبيعات وتحليلات الحسم 📈', titleEn: 'Sales & Revenue Analytics' },
              { id: 'inventory', titleAr: 'جرد التوريدات والمخازن 📦', titleEn: 'Warehouse & Materials Log' },
              { id: 'hr', titleAr: 'الأداء الفني وكفاءة الورش 📇', titleEn: 'Teammates & Operations Output' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-right p-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-neutral-900 border-gold-505 text-white'
                    : 'bg-transparent border-transparent text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                {isAr ? tab.titleAr : tab.titleEn}
              </button>
            ))}
          </div>

          <div className="border-t border-neutral-900 pt-4 space-y-2">
            <h4 className="text-[10px] text-neutral-500 font-extrabold uppercase mb-2">{isAr ? 'تصدير الكشوفات الموثقة:' : 'DISPATCH LEDGER:'}</h4>
            
            <button
              onClick={() => handleExportCSV('sales_financial')}
              className="w-full text-right p-2.5 bg-neutral-900 hover:bg-neutral-850 hover:border-gold-505/20 text-[10px] text-white font-bold border border-neutral-800 rounded-lg flex items-center justify-between cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-gold-505" />
              <span>{isAr ? 'تصدير مسير الرواتب (Excel)' : 'Export Payroll (Excel)'}</span>
            </button>

            <button
              onClick={() => handleExportPDF('yafta_audits')}
              className="w-full text-right p-2.5 bg-neutral-900 hover:bg-neutral-850 hover:border-gold-505/20 text-[10px] text-white font-bold border border-neutral-800 rounded-lg flex items-center justify-between cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-gold-505" />
              <span>{isAr ? 'تصفح و طباعة (PDF)' : 'Print PDF Ledger (PDF)'}</span>
            </button>
          </div>
        </div>

        {/* Visual report display panel */}
        <div className="lg:col-span-3 bg-neutral-950 p-5 rounded-2xl border border-gold-500/10 space-y-6">
          
          {/* SALES MODULE REPORT */}
          {activeTab === 'sales' && (
            <div className="space-y-6 text-right">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{isAr ? 'تقرير تحويل المبيعات وقمع الفرص:' : 'Sales Pipeline Lead Conversion report:'}</h3>
                <p className="text-[11px] text-neutral-400">{isAr ? 'عزل أداء المبيعات من العميل الأول حتى توقيع العقد الهندسي بالورشة' : 'Metrics tracking deal conversion rates from strategic entry down to invoice clearance.'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="h-60 w-full pt-4 font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversionData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222"/>
                      <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 9 }}/>
                      <YAxis stroke="#666" tick={{ fontSize: 9 }}/>
                      <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#d4af37', color: '#fff', fontSize: '11px' }}/>
                      <Bar dataKey="count" fill="#d4af37" radius={[4, 4, 0, 0]} name={isAr ? 'عدد الصفقات':'Deal Count'}>
                        {conversionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-neutral-900/50 p-4 border border-neutral-850 rounded-xl space-y-4">
                  <h4 className="text-xs font-bold text-gold-300 border-b border-neutral-850 pb-2">{isAr ? 'أهم تحليلات مبيعات الربع الجاري:' : 'Strategic Core Sales Insights:'}</h4>
                  
                  {[
                    { labelAr: 'إجمالي الحفر الفولاذي المعتمد', labelEn: 'Stainless backlight sales share', val: '54%' },
                    { labelAr: 'متر واجهات كلادينج إدارية بمصر', labelEn: 'Average cladding width sold', val: '185 Meter' },
                    { labelAr: 'متوسط الأيام لإغلاق صفقة ناجحة', labelEn: 'Average deal resolution speed', val: '8 Days' }
                  ].map((insight, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs flex-row-reverse font-sans">
                      <span className="text-neutral-300">{isAr ? insight.labelAr : insight.labelEn}</span>
                      <strong className="text-white font-mono font-bold">{insight.val}</strong>
                    </div>
                  ))}

                  <button 
                    onClick={() => handleExportCSV('sales_financial')}
                    className="w-full py-2 bg-gold-505 hover:bg-gold-400 text-black text-xs font-black rounded-lg transition-colors cursor-pointer block text-center"
                  >
                    {isAr ? 'تنزيل التقرير المالي الشامل (Excel)' : 'Download Sales Quota Sheet (CSV)'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* INVENTORY REPORT */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 text-right">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{isAr ? 'دراسة توزع وتقويم مواد المخازن:' : 'Current Materials Inventory Distribution:'}</h3>
                <p className="text-[11px] text-neutral-400">{isAr ? 'توزيع المواد الخام المستهلكة في صناعة هياكل يافطة الفنية' : 'Breakdown by cost-shares of raw acrylic boards, Korean LED chips, and metal rods.'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="h-60 w-full flex justify-center items-center font-sans">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inventorySpread}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {inventorySpread.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#d4af37', color: '#fff', fontSize: '11px' }}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-neutral-900/50 p-4 border border-neutral-850 rounded-xl space-y-4">
                  <h4 className="text-xs font-bold text-gold-300 border-b border-neutral-855 pb-2">{isAr ? 'أهم تحليلات الخامات والتوريدات:' : 'Supplies & Wholesale metrics:'}</h4>
                  
                  {[
                    { labelAr: 'مستوى استهلاك الأكريليك الشهري', labelEn: 'Est. Acrylic cost per deal', val: '4,500 EGP' },
                    { labelAr: 'درجة اعتمادية الموردين الكورية', labelEn: 'Supplier compliance rating', val: '99.5%' },
                    { labelAr: 'معدل سحب الحديد لتطويل الارتفاع', labelEn: 'Hollow tubing safety stock rate', val: 'Satisfied' }
                  ].map((insight, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs flex-row-reverse font-sans">
                      <span className="text-neutral-300">{isAr ? insight.labelAr : insight.labelEn}</span>
                      <strong className="text-white font-mono font-bold">{insight.val}</strong>
                    </div>
                  ))}

                  <button 
                    onClick={() => handleExportCSV('materials_inventory')}
                    className="w-full py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black text-xs font-black rounded-lg transition-colors cursor-pointer text-center block"
                  >
                    {isAr ? 'تحميل جرد المستودعات (Excel)' : 'Download Stock Inventory sheet (CSV)'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* HR & STAFF REPORT */}
          {activeTab === 'hr' && (
            <div className="space-y-6 text-right">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{isAr ? 'تقويم الإنتاجية وتكلفة الكادر الفني:' : 'Workforce Allocation & Efficiency Scorecard:'}</h3>
                <p className="text-[11px] text-neutral-400">{isAr ? 'الوقوف على نقاط كفاءة فنيي اللحام لضمان استقرار لافتات يافطة الحاصلة على كفالة أمان' : 'Assess quality index based on wind-stress safety targets and assembly hours.'}</p>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-850 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-gold-300">{isAr ? 'كوكبة عمالقة تجميع اللوحات والكلادينج بمصر:' : 'Top Welding & Cladding Staff Rating Index:'}</h4>
                
                <div className="space-y-2.5 divide-y divide-neutral-900">
                  {[
                    { name: 'Eng. Amr Soliman', rating: '5/5 Stars', dept: 'Engineering', score: '100% Wind safety scale' },
                    { name: 'Zaki Abdelrahman', rating: '5/5 Stars', dept: 'CNC & Weld', score: 'Samsung Original LED isolation cert.' },
                    { name: 'Tarek Refaat', rating: '4.9/5 Stars', dept: 'Installation', score: 'Crane operations supervisor' }
                  ].map((item, idx) => (
                    <div key={idx} className="pt-2 flex justify-between items-center text-xs flex-row-reverse font-sans">
                      <div>
                        <b className="text-white block">{item.name}</b>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">{item.dept}</span>
                      </div>
                      <div className="text-left font-mono">
                        <span className="text-gold-300 font-bold block">{item.rating}</span>
                        <span className="text-[10px] text-zinc-400 block">{item.score}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex gap-2">
                  <button 
                    onClick={() => handleExportCSV('hr_workers')}
                    className="w-1/2 py-2 bg-neutral-900 hover:bg-neutral-850 hover:border-gold-550 border border-neutral-800 text-white text-xs font-black rounded-lg transition-colors cursor-pointer text-center block"
                  >
                    {isAr ? 'تحميل جدول الموظفين (Excel)' : 'Download workforce (CSV)'}
                  </button>
                  <button 
                    onClick={() => handleExportPDF('staff_performance')}
                    className="w-1/2 py-2 bg-gold-505 hover:bg-gold-400 text-black text-xs font-black rounded-lg transition-colors cursor-pointer text-center block"
                  >
                    {isAr ? 'طباعة بطاقات الكفاءة (PDF)' : 'Print Staff Performance (PDF)'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
