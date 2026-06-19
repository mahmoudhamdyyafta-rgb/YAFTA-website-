/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Cpu, Layers, Zap, ToggleLeft, Plus, Trash2, CheckCircle, 
  MessageSquare, Users, AlertTriangle, ShieldCheck, Mail, Play,
  Settings, Clock, Bell, RefreshCw, Sparkles, Sliders, PlayCircle
} from 'lucide-react';

interface WorkflowRule {
  id: string;
  nameAr: string;
  nameEn: string;
  triggerEvent: string; // e.g. "Quotation Approved" "Design Filed" "Site Survey Done"
  actionResult: string; // e.g. "Create Formal Contract" "Notify Installation Crew" "Push Android Notice"
  active: boolean;
  type: 'SLA' | 'Task Dispatch' | 'Email Alerts' | 'Webhooks';
}

interface AutomationLog {
  id: string;
  ruleName: string;
  timestamp: string;
  status: 'Success' | 'Warning' | 'Executing';
  details: string;
}

interface AssignedCrewScore {
  name: string;
  activeJobs: number;
  completedJobs: number;
  workloadScore: number; // calculated: activeJobs * 10 - completedJobs
}

export default function WorkflowAutomationModule({ isAr, canEdit }: { isAr: boolean; canEdit: boolean }) {
  // Saved rules list
  const [rules, setRules] = useState<WorkflowRule[]>(() => {
    const saved = localStorage.getItem('yafta_automation_rules');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'rule-1', nameAr: 'توليد العقد القانوني وتنبيه العميل آلياً', nameEn: 'Contract dispatch upon Approved Quote', triggerEvent: 'Quotation Approved', actionResult: 'Create Formal Contract & Send Mail', active: true, type: 'Task Dispatch' },
      { id: 'rule-2', nameAr: 'إرسال معاينة الموقع لفريق الرفع والمقاسات', nameEn: 'Assign site surveyors immediately', triggerEvent: 'Contract Signed', actionResult: 'Schedule Site Survey Job', active: true, type: 'Task Dispatch' },
      { id: 'rule-3', nameAr: 'تصعيد التأخير والمواعيد وتنبيه المدير الفني', nameEn: 'Escalate checklist delay (>48 Hours)', triggerEvent: 'Site Installation Delayed', actionResult: 'Dispatch Critical Escalation SMS to CEO', active: true, type: 'SLA' },
      { id: 'rule-4', nameAr: 'إشعار آلي بالدفعات المالية المحصلة للورّاق', nameEn: 'Broadcast payment deposits to Ledger', triggerEvent: 'Invoice Fully Paid', actionResult: 'Post Revenue to Treasury Banking Safe', active: false, type: 'Email Alerts' }
    ];
  });

  // Recent process execution logs
  const [logs, setLogs] = useState<AutomationLog[]>(() => {
    const saved = localStorage.getItem('yafta_automation_logs');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'l-1', ruleName: 'Contract dispatch upon Approved Quote', timestamp: '2026-06-19 14:15:33', status: 'Success', details: 'Client approved Standard Quotation. Cloned draft and sent legal boilerplate to Elite Real Estate.' },
      { id: 'l-2', ruleName: 'Assign site surveyors immediately', timestamp: '2026-06-19 12:00:10', status: 'Success', details: 'Contract for Al-Masry signed. Autodispatched coordinates map to Sherif Abdel Wahab.' },
      { id: 'l-3', ruleName: 'Escalate checklist delay (>48 Hours)', timestamp: '2026-06-18 09:05:00', status: 'Warning', details: 'Job Zayed Avenue ACP Cladding exceeded mounting limit by 24h. SMS notice sent to Manager.' }
    ];
  });

  // Crews metrics values
  const [crews, setCrews] = useState<AssignedCrewScore[]>([
    { name: 'Sherif Abdel Wahab', activeJobs: 2, completedJobs: 14, workloadScore: 6 },
    { name: 'Ibrahim Farouk', activeJobs: 1, completedJobs: 19, workloadScore: -9 },
    { name: 'Islam Hamdy', activeJobs: 0, completedJobs: 24, workloadScore: -24 }
  ]);

  // Form Rule builder states
  const [addingRule, setAddingRule] = useState(false);
  const [ruleNameAr, setRuleNameAr] = useState('');
  const [ruleNameEn, setRuleNameEn] = useState('');
  const [trigEv, setTrigEv] = useState('Quotation Approved');
  const [actRes, setActRes] = useState('Create Formal Contract');
  const [ruleType, setRuleType] = useState<WorkflowRule['type']>('Task Dispatch');

  useEffect(() => {
    localStorage.setItem('yafta_automation_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('yafta_automation_logs', JSON.stringify(logs));
  }, [logs]);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleNameAr || !ruleNameEn) return;

    const newRule: WorkflowRule = {
      id: `rule-${Date.now()}`,
      nameAr: ruleNameAr,
      nameEn: ruleNameEn,
      triggerEvent: trigEv,
      actionResult: actRes,
      active: true,
      type: ruleType
    };

    setRules([newRule, ...rules]);
    setRuleNameAr('');
    setRuleNameEn('');
    setAddingRule(false);

    // Append manual execution trigger log
    const initialLog: AutomationLog = {
      id: `l-${Date.now()}`,
      ruleName: newRule.nameEn,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'Executing',
      details: 'Workflow rule initialized and indexed in general CPU executor.'
    };
    setLogs([initialLog, ...logs]);
  };

  const toggleRuleActive = (id: string) => {
    const updated = rules.map(r => {
      if (r.id === id) {
        return { ...r, active: !r.active };
      }
      return r;
    });
    setRules(updated);
  };

  const deleteRule = (id: string) => {
    if (confirm(isAr ? 'حذف هذه التعميدة البرمجية؟' : 'Delete this automation rule?')) {
      setRules(rules.filter(r => r.id !== id));
    }
  };

  const triggerTestRun = (ruleName: string) => {
    const nextLog: AutomationLog = {
      id: `test-${Date.now()}`,
      ruleName,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'Success',
      details: 'PROTOTYPE SIMULATION RUN: Evaluated triggers, nested payloads matched successfully, execution committed.'
    };
    setLogs([nextLog, ...logs]);
    alert(isAr ? `تنبيه: تم إطلاق تجربة آمنة للقاعدة "${ruleName}"!` : `Success: Test execution dispatched for rule "${ruleName}"!`);
  };

  return (
    <div className="bg-neutral-950 p-6 rounded-2xl border border-gold-505/20 text-right font-sans space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-row-reverse">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-end">
            <Cpu className="w-5 h-5 text-gold-505" />
            <span>{isAr ? 'محرك الربط الذاتي والعمليات الآلية' : 'Workflow Automation & Process Orchestration'}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isAr ? 'بناء مسارات تلقائية للمهام: عند تفعيل الاعتمادات المالية -> توزيع المعاينات وإشعارات الموردين' : 'Define trigger-action rules, automatically dispatch site surveyor tickets, monitor SLA delay indicators.'}
          </p>
        </div>

        {canEdit && (
          <button 
            onClick={() => setAddingRule(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-gold-300 to-gold-505 text-black hover:opacity-90 text-xs font-black rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'تهيئة معالجة ذاتية جديدة' : 'Build Process Rule'}</span>
          </button>
        )}
      </div>

      {/* ACTIVE SCHEMES / RULES MAP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rules Board list */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-black text-white flex items-center justify-end gap-1.5 pb-2 border-b border-neutral-800">
            <span>{isAr ? 'عقد ومعالجات محرك العمليات المصنفة:' : 'ACTIVE LOGICAL TRANSITION SCHEMES:'}</span>
            <Zap className="w-4 h-4 text-gold-505" />
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rules.map(rule => (
              <div 
                key={rule.id} 
                className={`p-4 bg-neutral-900/60 rounded-xl border text-right space-y-4 flex flex-col justify-between ${
                  rule.active ? 'border-gold-505/15' : 'border-neutral-850'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center flex-row-reverse pb-1.5 border-b border-neutral-950">
                    <span className={`px-1.5 py-0.5 text-[8.5px] font-black rounded uppercase ${
                      rule.type === 'SLA' ? 'bg-rose-950 text-rose-300' : 'bg-neutral-950 text-zinc-400'
                    }`}>
                      {rule.type}
                    </span>

                    {/* Toggle activation button */}
                    <button 
                      onClick={() => toggleRuleActive(rule.id)}
                      className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <ToggleLeft className={`w-6 h-6 ${rule.active ? 'text-gold-505 rotate-180' : 'text-neutral-700'}`} />
                    </button>
                  </div>

                  <strong className="text-xs text-white block truncate">{isAr ? rule.nameAr : rule.nameEn}</strong>
                  
                  {/* Step diagram layout representation */}
                  <div className="bg-neutral-950 p-2.5 rounded text-[10px] text-zinc-400 divide-y divide-neutral-900 leading-normal">
                    <div className="flex justify-between items-center py-1 flex-row-reverse">
                      <span className="text-zinc-500">WHEN:</span>
                      <strong className="text-zinc-300 truncate max-w-[150px]">{rule.triggerEvent}</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 flex-row-reverse">
                      <span className="text-zinc-500">THEN DO:</span>
                      <strong className="text-gold-300 truncate max-w-[150px]">{rule.actionResult}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-neutral-950 pt-2 bg-transparent flex-row-reverse">
                  <button 
                    onClick={() => triggerTestRun(rule.nameEn)}
                    className="p-1 px-3.5 bg-neutral-950 hover:bg-neutral-850 border border-neutral-850 text-white hover:text-gold-505 hover:border-gold-505/30 transition-all text-[9px] font-bold rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3 text-gold-505" />
                    <span>{isAr ? 'تجربة القاعدة' : 'Test Run'}</span>
                  </button>

                  {canEdit && (
                    <button 
                      onClick={() => deleteRule(rule.id)}
                      className="text-[9px] text-zinc-500 hover:text-red-500"
                    >
                      {isAr ? 'مسح' : 'Delete'}
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* WORKLOAD SCORE DISPATCH CHART */}
        <div className="lg:col-span-1 bg-neutral-905 bg-neutral-900/40 p-4 rounded-xl border border-neutral-850 space-y-4">
          <h4 className="text-xs font-black text-gold-300 flex items-center justify-end gap-1.5 pb-2 border-b border-neutral-800">
            <span>{isAr ? 'مؤشر أوزان الفنيين وإسناد المهام:' : 'CREW WORKLOAD CAPACITY SCORE:'}</span>
            <Users className="w-4 h-4 text-gold-505" />
          </h4>

          <div className="space-y-4">
            <p className="text-[10px] text-neutral-400 text-right leading-relaxed fallback">
              {isAr 
                ? 'يفحص محرك المهام الذكي حجم ضغط العمل الفعلي (عدد التركيبات التشغيلية النشطة للرتبة) ويوجه تلقائياً الشحنات للأقل انشغالاً:'
                : 'Process rules direct new site survey assignments automatically to installers containing the healthiest (lowest) current load scores:'}
            </p>

            <div className="divide-y divide-neutral-900 border border-neutral-900 rounded bg-neutral-950/40">
              {crews.map((crew, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-neutral-900/30 text-right flex-row-reverse">
                  <div>
                    <strong className="text-white block text-[11px] font-semibold">{crew.name}</strong>
                    <span className="text-[9px] text-zinc-500 font-mono block mt-0.5">{crew.activeJobs} active / {crew.completedJobs} done</span>
                  </div>

                  <div className="text-left font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      crew.workloadScore < -10 ? 'bg-emerald-950 text-emerald-300' :
                      crew.workloadScore < 0 ? 'bg-yellow-950 text-gold-300' : 'bg-rose-950 text-rose-300'
                    }`}>
                      {crew.workloadScore} Score
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* REAL-TIME SIMULATION EXECUTING LOGS */}
      <div className="border-t border-neutral-900 pt-6 space-y-4 font-mono text-right">
        <h3 className="text-sm font-black text-white flex items-center gap-2 justify-end font-sans">
          <span>{isAr ? 'سجلات معالجة البيانات الآلية النشطة (Automation Telegram logs):' : 'Secure cognitive workflow dispatch audit logs:'}</span>
          <CheckCircle className="w-4 h-4 text-gold-505" />
        </h3>

        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 space-y-3.5 max-h-[300px] overflow-y-auto">
          {logs.map(log => (
            <div key={log.id} className="text-xs flex flex-col sm:flex-row justify-between items-start gap-2 py-2 border-b border-neutral-900/80">
              <span className="text-zinc-600 text-[10px] shrink-0 font-mono">{log.timestamp}</span>
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <span className={`px-1 text-[8px] rounded uppercase font-black ${
                    log.status === 'Success' ? 'bg-emerald-950 text-emerald-400' :
                    log.status === 'Warning' ? 'bg-rose-950 text-rose-400' : 'bg-blue-950 text-blue-300 font-bold'
                  }`}>
                    {log.status}
                  </span>
                  <strong className="text-white text-[11px] block">{log.ruleName}</strong>
                </div>
                <p className="text-[10px] text-zinc-400 leading-normal font-sans">{log.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules Builder dialog Modal */}
      {addingRule && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 font-sans">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-sm w-full relative space-y-5 text-right">
            <h3 className="text-base font-black text-white flex items-center gap-1.5 justify-end">
              <span>{isAr ? 'بناء قاعدة تعميد آلية ذكية' : 'Draft visual automation transition'}</span>
              <Sparkles className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div className="space-y-1 text-right">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'اسم القاعدة بالكامل (عربي):' : 'Rule descriptor (AR):'}</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: عند توقيع العقد -> أرسل معاينات عاجلة"
                  value={ruleNameAr}
                  onChange={e => setRuleNameAr(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right focus:outline-none focus:border-gold-505"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] text-gold-300 block font-bold text-right">{isAr ? 'اسم القاعدة بالكامل (إنجليزي):' : 'Rule descriptor (EN):'}</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Broadcast SMS on delayed work check"
                  value={ruleNameEn}
                  onChange={e => setRuleNameEn(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-left focus:outline-none focus:border-gold-505 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'مثير الحدث (IF trigger):' : 'Trigger mechanism (WHEN):'}</label>
                <select 
                  value={trigEv}
                  onChange={e => setTrigEv(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white text-right font-bold focus:outline-none"
                >
                  <option value="Quotation Approved">{isAr ? 'اعتماد عرض السعر تجاريا' : 'Quotation Approved'}</option>
                  <option value="Contract Signed">{isAr ? 'توقيع العقد إلكترونياً وبثه' : 'Contract Signed'}</option>
                  <option value="Site Survey Done">{isAr ? 'تقفيل مقاسات المعاينة الميدانية' : 'Site Survey Done'}</option>
                  <option value="Invoice Fully Paid">{isAr ? 'تصفية وتسجيل استلام الفاتورة' : 'Invoice Fully Paid'}</option>
                  <option value="Site Installation Delayed">{isAr ? 'تخطى حاجز وقت التركيب بالورش' : 'Site Installation Delayed'}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'الحدث الناتج (THEN action):' : 'Action Result (THEN DO):'}</label>
                <select 
                  value={actRes}
                  onChange={e => setActRes(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white text-right font-bold focus:outline-none"
                >
                  <option value="Create Formal Contract & Send Mail">{isAr ? 'صياغة وبث العقد الافتراضي للشريك' : 'Create Formal Contract & Send Mail'}</option>
                  <option value="Schedule Site Survey Job">{isAr ? 'إسناد المعاينة وتتبع الإحداثيات' : 'Schedule Site Survey Job'}</option>
                  <option value="Dispatch Critical Escalation SMS to CEO">{isAr ? 'تصعيد المشكلة وإرسال إنذار لرئيس الإدارة' : 'Dispatch Critical Escalation SMS to CEO'}</option>
                  <option value="Post Revenue to Treasury Banking Safe">{isAr ? 'تقييد التدفقات بحساب البنك' : 'Post Revenue to Treasury Banking Safe'}</option>
                </select>
              </div>

              <div className="space-y-1 text-right">
                <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'أصناف وقنوات القاعدة:' : 'Rule category classification:'}</label>
                <select 
                  value={ruleType}
                  onChange={e => setRuleType(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white font-bold"
                >
                  <option value="Task Dispatch">{isAr ? 'توجيه وتوزيع الفنيين' : 'Crew Task Dispatch'}</option>
                  <option value="SLA">{isAr ? 'مراقبة جودة الخدمة والأوقات (SLA)' : 'SLA delay monitors'}</option>
                  <option value="Email Alerts">{isAr ? 'إشعارات البريد والرسائل' : 'Dynamic notification alert'}</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setAddingRule(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg border border-neutral-850 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 text-xs font-black rounded-lg transition-all cursor-pointer shadow-md hover:bg-gold-400"
                >
                  {isAr ? 'تأهيل وتفعيل القاعدة' : 'Deploy Automation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
