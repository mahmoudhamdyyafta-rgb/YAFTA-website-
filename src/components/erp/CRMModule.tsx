/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, Phone, Calendar, Clock, Plus, Send, 
  Trash2, Edit, AlertCircle, FileText, CheckCircle, Search, Sparkles
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  interest: string;
  value: number;
  stage: 'New' | 'Contacted' | 'Proposal Sent' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  followUpDate: string;
  notes: string;
  callCount: number;
  whatsAppSent: boolean;
}

interface CallLog {
  id: string;
  leadName: string;
  type: 'Inbound' | 'Outbound';
  duration: string;
  outcome: string;
  date: string;
  operator: string;
}

interface Props {
  isAr: boolean;
  canEdit: boolean;
}

export default function CRMModule({ isAr, canEdit }: Props) {
  // Leads list
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('yafta_erp_leads');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Al-Masry Restaurant', phone: '+201012345678', email: 'info@almasry.com', company: 'Al-Masry Group', interest: 'Stainless Backlit Signage', value: 45000, stage: 'New', followUpDate: '2026-06-25', notes: 'Needs premium titanium mirror letters with Samsung LED.', callCount: 1, whatsAppSent: false },
      { id: '2', name: 'Elite Real Estate', phone: '+201287654321', email: 'marketing@elite-eg.com', company: 'Elite Eg', interest: 'Aluminium Cladding Facade', value: 125000, stage: 'Contacted', followUpDate: '2026-06-22', notes: 'Requested quotation based on 15m width.', callCount: 2, whatsAppSent: true },
      { id: '3', name: 'Y Burger Zayed', phone: '+201199887766', email: 'zayed@yburger.com', company: 'Y Burger LLC', interest: 'Acrylic Lightbox & Digital LED', value: 35000, stage: 'Proposal Sent', followUpDate: '2026-06-18', notes: 'Proposal delivered yesterday. Awaiting technical review.', callCount: 3, whatsAppSent: true },
      { id: '4', name: 'Cairo Business Hub', phone: '+201055443322', email: 'procurement@cbhub.com', company: 'Cairo Hub', interest: 'Roof Signs Grid Skeleton', value: 320000, stage: 'Negotiation', followUpDate: '2026-06-20', notes: 'Client negotiating pricing terms. Engineering wind-safety load calculation presented.', callCount: 5, whatsAppSent: false },
      { id: '5', name: 'Signature Hair Salon', phone: '+201144332211', email: 'salon@signature.com', company: 'Signature Group', interest: 'Neon Rose LED', value: 18000, stage: 'Closed Won', followUpDate: '2026-06-10', notes: 'Deposit paid 15,000 ج.م. Production order sent to workspace.', callCount: 2, whatsAppSent: true }
    ];
  });

  // Call Logs
  const [callLogs, setCallLogs] = useState<CallLog[]>(() => {
    const saved = localStorage.getItem('yafta_erp_calllogs');
    if (saved) return JSON.parse(saved);
    return [
      { id: '101', leadName: 'Al-Masry Restaurant', type: 'Inbound', duration: '3m 15s', outcome: 'Asked for gold cladding prices', date: '2026-06-18 11:20 AM', operator: 'Sherif Aly' },
      { id: '102', leadName: 'Y Burger Zayed', type: 'Outbound', duration: '5m 40s', outcome: 'Follow up on design proposal details', date: '2026-06-17 04:15 PM', operator: 'Eman Radi' },
      { id: '103', leadName: 'Cairo Business Hub', type: 'Outbound', duration: '12m 30s', outcome: 'Discussed wind loads and safety certificates', date: '2026-06-16 02:00 PM', operator: 'Eng. Amr Soliman' }
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [addingLead, setAddingLead] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [interest, setInterest] = useState('Stainless Backlit Signage');
  const [value, setValue] = useState(25000);
  const [stage, setStage] = useState<'New' | 'Contacted' | 'Proposal Sent' | 'Negotiation' | 'Closed Won' | 'Closed Lost'>('New');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');

  // Call Logging Form State
  const [callLead, setCallLead] = useState('');
  const [callType, setCallType] = useState<'Inbound' | 'Outbound'>('Outbound');
  const [callDuration, setCallDuration] = useState('2m 30s');
  const [callOutcome, setCallOutcome] = useState('');
  const [isLoggingCall, setIsLoggingCall] = useState(false);

  useEffect(() => {
    localStorage.setItem('yafta_erp_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('yafta_erp_calllogs', JSON.stringify(callLogs));
  }, [callLogs]);

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    if (selectedLead) {
      // Update
      const updated = leads.map(l => l.id === selectedLead.id ? {
        ...l, name, phone, email, company, interest, value, stage, followUpDate, notes
      } : l);
      setLeads(updated);
      setSelectedLead(null);
    } else {
      // Create new
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        name, phone, email, company, interest, value, stage, followUpDate, notes,
        callCount: 0,
        whatsAppSent: false
      };
      setLeads([newLead, ...leads]);
    }

    // Reset Form
    setName('');
    setPhone('');
    setEmail('');
    setCompany('');
    setInterest('Stainless Backlit Signage');
    setValue(25000);
    setStage('New');
    setFollowUpDate('');
    setNotes('');
    setAddingLead(false);
  };

  const handleDeleteLead = (id: string) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذا العميل المرشح؟' : 'Are you sure you want to delete this lead?')) {
      setLeads(leads.filter(l => l.id !== id));
    }
  };

  const handleWhatsAppSim = (lead: Lead) => {
    const template = isAr 
      ? `مرحباً أ/ *${lead.name}*، عساك بخير. مهندسي الوكالة يافطة أرسلوا مقترح تصميم واجهة *${lead.interest}* لشركتكم الموقرة *${lead.company}*. نأمل في بدء التعاون الفني قريباً!` 
      : `Dear *${lead.name}*, trust you are well. This is YAFTA Advertising. We have finalized the engineering blueprint and offer for your *${lead.interest}* project. Let me know when we can proceed.`;

    const encoded = encodeURIComponent(template);
    // Open in separate simulation link
    window.open(`https://wa.me/${lead.phone.replace('+', '')}?text=${encoded}`, '_blank');
    
    // Mark as sent
    setLeads(leads.map(l => l.id === lead.id ? { ...l, whatsAppSent: true } : l));
    alert(isAr ? 'تم محاكاة إرسال الرسالة وتسجيلها في السجلات الرقمية للعميل!' : 'WhatsApp dispatch processed and recorded on CRM timeline.');
  };

  const handleLogCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callLead || !callOutcome) return;

    const log: CallLog = {
      id: `call-${Date.now()}`,
      leadName: callLead,
      type: callType,
      duration: callDuration,
      outcome: callOutcome,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      operator: 'Account Manager'
    };

    setCallLogs([log, ...callLogs]);
    
    // Increment lead callCount
    setLeads(leads.map(l => l.name === callLead ? { ...l, callCount: l.callCount + 1 } : l));

    setCallLead('');
    setCallOutcome('');
    setIsLoggingCall(false);
    alert(isAr ? 'تم تسجيل سجل المكالمة وبصمتها على العميل!' : 'Call log saved successfully onto Lead profile.');
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setName(lead.name);
    setPhone(lead.phone);
    setEmail(lead.email);
    setCompany(lead.company);
    setInterest(lead.interest);
    setValue(lead.value);
    setStage(lead.stage);
    setFollowUpDate(lead.followUpDate);
    setNotes(lead.notes);
    setAddingLead(true);
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.interest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and top tools */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 flex-row-reverse text-right">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-end">
            <Users className="w-5 h-5 text-gold-505" />
            <span>{isAr ? 'منظومة إدارة العملاء والمبيعات (CRM)' : 'Advertising CRM System'}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isAr ? 'متابعة الاتفاقات، العملاء المهتمين، سجل الاتصالات، والربط بالواتساب' : 'Track marketing leads, deals pipeline, call interactions, and client relations.'}
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {canEdit && (
            <>
              <button 
                onClick={() => {
                  setSelectedLead(null);
                  setName('');
                  setPhone('');
                  setEmail('');
                  setCompany('');
                  setInterest('Stainless Backlit Signage');
                  setValue(25000);
                  setStage('New');
                  setFollowUpDate('');
                  setNotes('');
                  setAddingLead(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-gold-300 to-gold-505 hover:from-gold-250 text-black text-xs font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة عميل مرشح' : 'Add New Lead'}</span>
              </button>

              <button 
                onClick={() => setIsLoggingCall(true)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-gold-505/20 text-gold-303 text-gold-300 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>{isAr ? 'تسجيل مكالمة' : 'Log Phone Call'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* CRM Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { labelAr: 'إجمالي قيمة الصفقات المتوقعة', labelEn: 'Pipeline Deal Value', val: `${leads.reduce((s, l) => s + l.value, 0).toLocaleString()} ج.م`, color: 'text-gold-300' },
          { labelAr: 'العملاء المرشحين الفعالين', labelEn: 'Active Prospects', val: leads.filter(l => l.stage !== 'Closed Won' && l.stage !== 'Closed Lost').length, color: 'text-blue-400' },
          { labelAr: 'صفقات ناجحة ومستلمة', labelEn: 'Deals Won (Closed)', val: leads.filter(l => l.stage === 'Closed Won').length, color: 'text-emerald-400' },
          { labelAr: 'معدل النجاح التقريبي', labelEn: 'Avg Conversion rate', val: `${Math.round((leads.filter(l => l.stage === 'Closed Won').length / leads.length) * 100) || 0}%`, color: 'text-white' }
        ].map((stat, i) => (
          <div key={i} className="bg-neutral-950 p-4 rounded-xl border border-gold-500/10 text-right">
            <span className="text-[10px] text-neutral-400 block">{isAr ? stat.labelAr : stat.labelEn}</span>
            <span className={`text-base md:text-lg font-mono font-black ${stat.color}`}>{stat.val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Table Card */}
        <div className="lg:col-span-2 bg-neutral-950 rounded-2xl border border-gold-500/10 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-neutral-900 pb-3 flex-row-reverse text-right">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{isAr ? 'جدول المتابعة والفرص التسويقية:' : 'Lead follow-up & prospect opportunities:'}</span>
              <Sparkles className="w-4 h-4 text-gold-550" />
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
              <input
                type="text"
                placeholder={isAr ? 'البحث عن عميل...' : 'Search deals...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900/80 border border-neutral-800 rounded-lg p-2 pl-9 text-xs text-white focus:outline-none focus:border-gold-300 text-right placeholder-zinc-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right divide-y divide-neutral-900">
              <thead className="bg-neutral-900 text-gold-300 font-bold">
                <tr>
                  <th className="p-3 text-right">{isAr ? 'الشركة / الاسم' : 'Prospective Company'}</th>
                  <th className="p-3 text-right">{isAr ? 'الخدمة المطلوبة' : 'Interest Sector'}</th>
                  <th className="p-3 text-right">{isAr ? 'القيمة المتوقعة' : 'Est. Deal Value'}</th>
                  <th className="p-3 text-right">{isAr ? 'مرحلة البيع' : 'Pipeline Stage'}</th>
                  <th className="p-3 text-right">{isAr ? 'المتابعة القادمة' : 'Next Follow-up'}</th>
                  <th className="p-3 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/60 text-neutral-300">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="p-3">
                      <div className="font-extrabold text-white">{lead.company}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">{lead.name} | {lead.phone}</div>
                    </td>
                    <td className="p-3">{lead.interest}</td>
                    <td className="p-3 font-mono font-bold text-white">{lead.value.toLocaleString()} ج.م</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        lead.stage === 'Closed Won' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/20' :
                        lead.stage === 'Closed Lost' ? 'bg-rose-950 text-rose-300 border border-rose-500/10' :
                        lead.stage === 'Negotiation' ? 'bg-blue-955 bg-blue-950 text-blue-300' :
                        lead.stage === 'Proposal Sent' ? 'bg-yellow-950 text-gold-300' : 'bg-neutral-900 text-neutral-400'
                      }`}>
                        {isAr ? (
                          lead.stage === 'New' ? 'جديد' :
                          lead.stage === 'Contacted' ? 'تم الاتصال' :
                          lead.stage === 'Proposal Sent' ? 'تم تقديم العرض' :
                          lead.stage === 'Negotiation' ? 'مفاوضات' :
                          lead.stage === 'Closed Won' ? 'مغلق ناجح' : 'مغلق خاسر'
                        ) : lead.stage}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[10px]">{lead.followUpDate || '—'}</td>
                    <td className="p-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleWhatsAppSim(lead)}
                          className={`p-1.5 rounded transition-all cursor-pointer ${
                            lead.whatsAppSent 
                              ? 'bg-neutral-900 text-emerald-500 hover:bg-neutral-850' 
                              : 'bg-emerald-900/25 text-emerald-400 hover:bg-emerald-900 hover:text-white'
                          }`}
                          title={isAr ? 'محاكاة رسالة واتساب' : 'WhatsApp customer follow-up'}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        {canEdit && (
                          <>
                            <button
                              onClick={() => handleEditLead(lead)}
                              className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded cursor-pointer"
                              title={isAr ? 'تعديل البيانات' : 'Edit prospect Details'}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 bg-neutral-900 hover:bg-rose-950 text-rose-400 rounded cursor-pointer"
                              title={isAr ? 'حذف من النظام' : 'Remove deal'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Call logs & follow ups */}
        <div className="bg-neutral-950 rounded-2xl border border-gold-500/10 p-5 space-y-4 text-right">
          <div className="border-b border-neutral-900 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 justify-end">
              <span>{isAr ? 'سجل المكالمات والنشاط الأخير:' : 'Call communications history:'}</span>
              <Phone className="w-4 h-4 text-gold-550" />
            </h3>
            <p className="text-[10px] text-neutral-400 mt-1">
              {isAr ? 'الاتصالات الواردة والصادرة مع مسؤولي الحسابات' : 'Incoming and outgoing discussion records.'}
            </p>
          </div>

          <div className="space-y-3.5 max-h-[350px] overflow-y-auto">
            {callLogs.map((log) => (
              <div key={log.id} className="p-3 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-850 rounded-xl space-y-1 font-sans">
                <div className="flex justify-between items-center text-[10px] flex-row-reverse">
                  <span className="font-extrabold text-white">{log.leadName}</span>
                  <span className={`px-1.5 rounded font-black text-[8px] uppercase ${
                    log.type === 'Inbound' ? 'bg-blue-950 text-blue-300' : 'bg-gold-950 text-gold-300'
                  }`}>
                    {isAr ? (log.type === 'Inbound' ? 'وارد' : 'صادر') : log.type}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-snug">{log.outcome}</p>
                <div className="flex justify-between text-[9px] text-neutral-500 pt-1 font-mono">
                  <span>{log.date}</span>
                  <span>{log.operator} | {log.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Lead Dialog */}
      {addingLead && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-lg w-full relative space-y-6 text-right font-sans">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 justify-end border-b border-neutral-900 pb-3">
              <span>{selectedLead ? (isAr ? 'تعديل بيانات العميل المرشح' : 'Edit Sales Lead') : (isAr ? 'إدخال عميل فرصة جديدة' : 'Add Strategic Sales Lead')}</span>
              <Sparkles className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleSaveLead} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'الشركة / الكيان:' : 'Company/Brand:'}</label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'مثل: بنك مصر، مطعم البرنس' : 'e.g. Banque Misr'}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-550 text-right"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'اسم جهة الاتصال:' : 'Contact Person Name:'}</label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'أدخل اسم العميل المسؤول' : 'John Doe'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-550 text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'البريد الإلكتروني:' : 'Contact Email:'}</label>
                  <input
                    type="email"
                    placeholder="email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-550 text-left"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'رقم الهاتف (الواتساب):' : 'Phone Account (WhatsApp):'}</label>
                  <input
                    type="text"
                    required
                    placeholder="+2010xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-550 text-left font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'منظومة البيع:' : 'Quota Stage:'}</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-850 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="New">{isAr ? 'جديد (New)' : 'New'}</option>
                    <option value="Contacted">{isAr ? 'تم الاتصال (Contacted)' : 'Contacted'}</option>
                    <option value="Proposal Sent">{isAr ? 'تقديم المقترح (Proposal)' : 'Proposal Sent'}</option>
                    <option value="Negotiation">{isAr ? 'تفاوض وحسم (Negotiation)' : 'Negotiation'}</option>
                    <option value="Closed Won">{isAr ? 'ناجح تام (Closed Won)' : 'Closed Won'}</option>
                    <option value="Closed Lost">{isAr ? 'خاسر ومغلق (Closed Lost)' : 'Closed Lost'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'الاهتمام والخدمة:' : 'Interest Item:'}</label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-850 rounded-lg p-2 text-xs text-white truncate"
                  >
                    <option value="Stainless Backlit Signage">{isAr ? 'حروف استانلس مضيئة' : 'Stainless Backlit'}</option>
                    <option value="Aluminium Cladding Facade">{isAr ? 'واجهات كلادينج' : 'Cladding Facade'}</option>
                    <option value="Acrylic Lightbox">{isAr ? 'صندوق ليد أكريليك' : 'Acrylic Lightbox'}</option>
                    <option value="Neon Rose LED">{isAr ? 'نيون عتيق مرن' : 'Neon Flex Rose'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'قيمة الصفقة (EGP):' : 'Est. Deal Value (EGP):'}</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white text-left font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'تاريخ المتابعة القادمة:' : 'Next Followup Date:'}</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-center font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'الملاحظات والتعليمات الفنية للورشة:' : 'Strategic notes:'}</label>
                <textarea
                  rows={2}
                  placeholder={isAr ? 'مثال: العميل طلب معاينة يوم الإثنين فجراً...' : 'e.g. client requested site assessment...'}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-gold-550 text-right"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setAddingLead(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg cursor-pointer border border-neutral-850"
                >
                  {isAr ? 'إلغاء' : 'Close'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black text-xs font-black rounded-lg cursor-pointer"
                >
                  {selectedLead ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'إدراج الفرصة' : 'Commit Lead')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Call dialog */}
      {isLoggingCall && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-md w-full relative space-y-6 text-right font-sans">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 justify-end border-b border-neutral-900 pb-3">
              <span>{isAr ? 'تسجيل تفاصيل اتصال العميل' : 'Log Phone Call Interaction'}</span>
              <Phone className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleLogCall} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-bold block">{isAr ? 'العميل المستهدف:' : 'Select Prospect target:'}</label>
                <select
                  value={callLead}
                  onChange={(e) => setCallLead(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-xs text-white focus:outline-none"
                  required
                >
                  <option value="">{isAr ? 'اختر العميل...' : 'Choose lead...'}</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.name}>{l.company} ({l.name})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-300 font-bold block">{isAr ? 'مدة المكالمة:' : 'Duration:'}</label>
                  <input
                    type="text"
                    value={callDuration}
                    onChange={(e) => setCallDuration(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-xs text-white focus:outline-none text-center font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-300 font-bold block">{isAr ? 'نوع الاتصال:' : 'Direction:'}</label>
                  <select
                    value={callType}
                    onChange={(e) => setCallType(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2 text-xs text-white font-bold text-center"
                  >
                    <option value="Outbound">{isAr ? 'اتصال صادر' : 'Outbound'}</option>
                    <option value="Inbound">{isAr ? 'اتصال وارد' : 'Inbound'}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-bold block">{isAr ? 'ملخص المكالمة والنتيجة:' : 'Discussion outcome:'}</label>
                <textarea
                  rows={2}
                  required
                  placeholder={isAr ? 'مثال: طلب عينة خامة الكلادينج الفضي للوقوف على جودتها' : 'e.g. Approved design drafts, asked for invoicing terms'}
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-xs text-white focus:outline-none text-right"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsLoggingCall(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black text-xs font-black rounded-lg cursor-pointer"
                >
                  {isAr ? 'حفظ المكالمة' : 'Save interaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
