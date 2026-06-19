/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Network, CheckSquare, Calendar, UserPlus, FileText, ChevronRight,
  TrendingUp, Clock, AlertCircle, Plus, Info, CheckCircle2
} from 'lucide-react';

interface ErpProject {
  id: string;
  client: string;
  title: string;
  stage: 'Inspection' | 'Engineering' | 'CNC Cutting' | 'LED Wiring' | 'QC Inspection' | 'On-site Assembly' | 'Completed';
  leader: string;
  milestonesCount: number;
  completedMilestones: number;
  deliveryDate: string;
  priority: 'Urgent' | 'Normal' | 'Low';
}

interface InstallationEvent {
  id: string;
  projectTitle: string;
  crewLeader: string;
  date: string;
  address: string;
  status: 'Scheduled' | 'Committed' | 'Postponed';
}

interface Props {
  isAr: boolean;
  canEdit: boolean;
}

export default function ProjectTrackingModule({ isAr, canEdit }: Props) {
  // Projects tracking state
  const [projects, setProjects] = useState<ErpProject[]>(() => {
    const saved = localStorage.getItem('yafta_erp_projects');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'prj-101', client: 'Mado Restaurant Zayed', title: 'Matte ACP Cladding & Backlit Stainless Core', stage: 'CNC Cutting', leader: 'Zaki Abdelrahman', milestonesCount: 5, completedMilestones: 2, deliveryDate: '2026-06-25', priority: 'Urgent' },
      { id: 'prj-102', client: 'Elite Real Estate Group', title: 'Structural Pillar Cladding & Giant Acrylic Box', stage: 'Engineering', leader: 'Eng. Amr Soliman', milestonesCount: 7, completedMilestones: 1, deliveryDate: '2026-07-15', priority: 'Normal' },
      { id: 'prj-103', client: 'Y Burger Sheikh Zayed', title: 'Neon Rose LED & Flexible UV Star Banners', stage: 'QC Inspection', leader: 'Mahmoud Hassan', milestonesCount: 4, completedMilestones: 3, deliveryDate: '2026-06-20', priority: 'Urgent' },
      { id: 'prj-104', client: 'Banque Misr Fifth Sett.', title: 'Heavy Roof Signboard Steel Grid Base', stage: 'On-site Assembly', leader: 'Tarek Refaat', milestonesCount: 8, completedMilestones: 7, deliveryDate: '2026-06-22', priority: 'Urgent' }
    ];
  });

  // Installation schedules
  const [installationAgenda, setInstallationAgenda] = useState<InstallationEvent[]>(() => {
    const saved = localStorage.getItem('yafta_erp_installations');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'ins-1', projectTitle: 'Banque Misr Roof Signboard Base', crewLeader: 'Tarek Refaat + Crane Crew', date: '2026-06-22 09:00 AM', address: 'Plot 15, North Investors Area, New Cairo', status: 'Scheduled' },
      { id: 'ins-2', projectTitle: 'Y Burger Sheikh Zayed Neon installation', crewLeader: 'Mahmoud Hassan', date: '2026-06-20 02:00 PM', address: 'Strip Mall 2, Beverly Hills Zayed', status: 'Scheduled' }
    ];
  });

  const [addingPrj, setAddingPrj] = useState(false);
  const [addingIns, setAddingIns] = useState(false);

  // Form project states
  const [client, setClient] = useState('');
  const [title, setTitle] = useState('');
  const [leader, setLeader] = useState('Zaki Abdelrahman');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [priority, setPriority] = useState<'Urgent' | 'Normal' | 'Low'>('Normal');

  // Form installation state
  const [insProjName, setInsProjName] = useState('');
  const [insLeader, setInsLeader] = useState('Tarek Refaat');
  const [insDate, setInsDate] = useState('');
  const [insAddress, setInsAddress] = useState('');

  useEffect(() => {
    localStorage.setItem('yafta_erp_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('yafta_erp_installations', JSON.stringify(installationAgenda));
  }, [installationAgenda]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !title) return;

    const newPrj: ErpProject = {
      id: `prj-${Date.now()}`,
      client,
      title,
      stage: 'Inspection',
      leader,
      milestonesCount: 6,
      completedMilestones: 1,
      deliveryDate: deliveryDate || new Date().toISOString().split('T')[0],
      priority
    };

    setProjects([...projects, newPrj]);
    setClient('');
    setTitle('');
    setAddingPrj(false);
    alert(isAr ? 'تم استصدار بطاقة إنتاج وتتبع جديدة للمشروع وحجز الرقم الهندسي!' : 'Engineering workshop routing card issued successfully!');
  };

  const handleScheduleInstallation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insProjName || !insAddress) return;

    const newIns: InstallationEvent = {
      id: `ins-${Date.now()}`,
      projectTitle: insProjName,
      crewLeader: insLeader,
      date: insDate || new Date().toISOString().replace('T', ' ').substring(0, 16),
      address: insAddress,
      status: 'Scheduled'
    };

    setInstallationAgenda([...installationAgenda, newIns]);
    setInsProjName('');
    setInsAddress('');
    setAddingIns(false);
    alert(isAr ? 'تم جدولة موعد الرفع والتثبيت الخارجي بالتنسيق مع كرين الورشة!' : 'Crane installation schedule recorded in workspace logistics logs.');
  };

  const advanceProjectStage = (id: string, currentStage: string) => {
    if (!canEdit) return;
    const stages: ErpProject['stage'][] = [
      'Inspection', 'Engineering', 'CNC Cutting', 'LED Wiring', 'QC Inspection', 'On-site Assembly', 'Completed'
    ];
    const currentIndex = stages.indexOf(currentStage as any);
    const nextIndex = (currentIndex + 1) % stages.length;
    const nextStage = stages[nextIndex];

    setProjects(projects.map(p => {
      if (p.id === id) {
        // Increment milestone if stage advanced
        const nextMilestone = Math.min(p.milestonesCount, p.completedMilestones + 1);
        return { ...p, stage: nextStage, completedMilestones: nextStage === 'Completed' ? p.milestonesCount : nextMilestone };
      }
      return p;
    }));
  };

  const toggleInstallationStatus = (id: string) => {
    if (!canEdit) return;
    setInstallationAgenda(installationAgenda.map(ins => {
      if (ins.id === id) {
        const nextStatus = ins.status === 'Scheduled' ? 'Committed' : 'Scheduled';
        return { ...ins, status: nextStatus };
      }
      return ins;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 flex-row-reverse text-right">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-end">
            <Network className="w-5 h-5 text-gold-505" />
            <span>{isAr ? 'نظام تتبع وإدارة المشاريع والتركيبات الخارجية' : 'Project Pipeline & Site Installation schedules'}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isAr ? 'مراحل التقطيع السلكي، تثبيت الليدات، الرفع بالأوناش والرافعات المعتمدة بمصر' : 'Cycle ACP panel cutting, backlit soldering processes, crane operations.'}
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {canEdit && (
            <>
              <button 
                onClick={() => setAddingPrj(true)}
                className="px-4 py-2 bg-gradient-to-r from-gold-300 to-gold-505 hover:from-gold-250 text-black text-xs font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إنشاء مشروع تشغيل' : 'Open Project Card'}</span>
              </button>

              <button 
                onClick={() => setAddingIns(true)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-gold-505/20 text-gold-300 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-gold-505" />
                <span>{isAr ? 'جدولة تركيب أوناش' : 'Schedule Crane Install'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Track Grid bento split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-sans">
        
        {/* Project stages tracker */}
        <div className="lg:col-span-3 bg-neutral-950 p-5 rounded-2xl border border-gold-500/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5 justify-end text-right">
            <span>{isAr ? 'بطاقات تقدم صناعة اللوحات الفنية (Kanban):' : 'Active factory floor project stage routing:'}</span>
            <CheckSquare className="w-4 h-4 text-gold-505" />
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((prj) => (
              <div key={prj.id} className="p-4 bg-neutral-900 border border-neutral-850 hover:border-gold-505/20 transition-all rounded-xl flex flex-col justify-between gap-4 text-right">
                <div>
                  <div className="flex justify-between items-start flex-row-reverse gap-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      prj.priority === 'Urgent' ? 'bg-rose-950 text-rose-300 border border-rose-500/20' : 'bg-neutral-800 text-zinc-400'
                    }`}>
                      {prj.priority}
                    </span>
                    <div className="space-y-0.5">
                      <h4 className="text-xs text-neutral-400 font-bold block">{prj.client}</h4>
                      <strong className="text-sm text-white block mt-0.5 leading-snug">{prj.title}</strong>
                    </div>
                  </div>

                  {/* Stage Status with progress bar */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-[10px] flex-row-reverse text-neutral-400">
                      <span>{isAr ? 'قائد فرقة الورشة:' : 'Operations Crew Leaded by:'} <strong className="text-white">{prj.leader}</strong></span>
                      <span className="font-mono">{Math.round((prj.completedMilestones / prj.milestonesCount) * 100)}%</span>
                    </div>

                    <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-gold-600 via-gold-505 to-gold-300 rounded-full"
                        style={{ width: `${(prj.completedMilestones / prj.milestonesCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Bottom line with stage control advance */}
                <div className="flex items-center justify-between border-t border-neutral-850/60 pt-3 flex-row-reverse">
                  <div className="flex gap-1.5 items-center flex-row-reverse">
                    <span className="text-[10px] text-zinc-500 font-mono font-bold">STAGE:</span>
                    <span className="text-xs font-mono font-bold text-gold-300 uppercase bg-gold-950 px-2 py-0.5 rounded border border-gold-500/20">
                      {prj.stage}
                    </span>
                  </div>

                  {canEdit && prj.stage !== 'Completed' && (
                    <button
                      onClick={() => advanceProjectStage(prj.id, prj.stage)}
                      className="px-2.5 py-1 text-[10px] font-black bg-neutral-950 hover:bg-gold-505 hover:text-black hover:border-gold-505 text-neutral-350 border border-neutral-800 rounded transition-all flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{isAr ? 'تأكيد الخطوة التالية ⚡' : 'Cycle Next ⚡'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Installation calendar agenda */}
        <div className="bg-neutral-950 p-5 rounded-2xl border border-gold-500/10 space-y-4 text-right">
          <div className="border-b border-neutral-900 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 justify-end">
              <span>{isAr ? 'أجندة الرفع والتثبيت الخارجي:' : 'Installation and logistics roster:'}</span>
              <Calendar className="w-4 h-4 text-gold-505" />
            </h3>
            <p className="text-[10px] text-neutral-400 mt-1">
              {isAr ? 'مواعيد تحريك رافعات الورشة والواجهات' : 'Scheduled safety site assemblies.'}
            </p>
          </div>

          <div className="space-y-4 max-h-[350px] overflow-y-auto">
            {installationAgenda.map((ins) => (
              <div key={ins.id} className="p-3 bg-neutral-900 border border-neutral-850 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] flex-row-reverse">
                  <span className="font-extrabold text-white truncate max-w-[140px]">{ins.projectTitle}</span>
                  <button 
                    onClick={() => toggleInstallationStatus(ins.id)}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-black cursor-pointer uppercase ${
                      ins.status === 'Committed' 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/20' 
                        : 'bg-yellow-950 text-gold-300 border border-gold-500/10'
                    }`}
                  >
                    {isAr ? (ins.status === 'Committed' ? 'تم الرفع' : 'مجدول') : ins.status}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-400 line-clamp-1">{ins.address}</p>
                <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono">
                  <span>{ins.crewLeader}</span>
                  <strong>{ins.date}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add Project Modal Dialogue */}
      {addingPrj && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-md w-full relative space-y-6 text-right font-sans">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 justify-end border-b border-neutral-900 pb-3">
              <span>{isAr ? 'استخراج بطاقة إنتاج وتشغيل' : 'Open Workshop Production Card'}</span>
              <Network className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'الشركة المالكة للعلامة:' : 'Corporate Client Name:'}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. mado holding, we egypt"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-550 text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'تفاصيل العمل والمواصفات العامة:' : 'Work particulars & size:'}</label>
                <input
                  type="text"
                  required
                  value={title}
                  placeholder={isAr ? 'مثال: علبة أكريليك مضيئة حجم 4م مع هيكل حديدي' : 'Signage specs titanium and LED size'}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-805 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'قائد الورشة المعتمد:' : 'Shift Crew leader:'}</label>
                  <select
                    value={leader}
                    onChange={(e) => setLeader(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2 text-xs text-white"
                  >
                    <option value="Zaki Abdelrahman">Zaki Abdelrahman (CNC Welding)</option>
                    <option value="Eng. Amr Soliman">Eng. Amr Soliman (Design & Calc)</option>
                    <option value="Mahmoud Hassan">Mahmoud Hassan (Printing uv)</option>
                    <option value="Tarek Refaat">Tarek Refaat (Crane Assemblies)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'الأولوية الزمنية:' : 'Production speed priority:'}</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2 text-xs text-white font-bold text-center"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent priority</option>
                    <option value="Low">Low / Flexible</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'تاريخ التسليم والتركيب المقترح:' : 'Target Dispatch Date:'}</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-xs text-white text-center font-mono"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setAddingPrj(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black text-xs font-black rounded-lg cursor-pointer"
                >
                  {isAr ? 'تعميد بطاقة الهندسة ⚡' : 'Activate workshop routing ⚡'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Installation Modal dialogue */}
      {addingIns && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-md w-full relative space-y-6 text-right font-sans">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 justify-end border-b border-neutral-900 pb-2">
              <span>{isAr ? 'جدولة موعد رفع وتثبيت بالرافعة' : 'Book Crane Site Assembly'}</span>
              <Calendar className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleScheduleInstallation} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-bold block">{isAr ? 'المشروع أو الواجهة المستهدفة:' : 'Facade targeting:'}</label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: واجهة بنك مصر فرع التجمع' : 'e.g. Banque Misr Fifth Sett'}
                  value={insProjName}
                  onChange={(e) => setInsProjName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-xs text-white text-right focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-300 font-bold block">{isAr ? 'قائد فرقة التركيب:' : 'Crew Safety Leader:'}</label>
                  <select
                    value={insLeader}
                    onChange={(e) => setInsLeader(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-805 p-2 text-xs text-white"
                  >
                    <option value="Tarek Refaat + Crane Crew">Tarek Refaat (External Crane)</option>
                    <option value="Mahmoud Hassan">Mahmoud Hassan (Fascia Mounts)</option>
                    <option value="Zaki Abdelrahman">Zaki Abdelrahman (Metal brackets)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-300 font-bold block">{isAr ? 'تاريخ التناغم والرفع:' : 'Date & hour booking:'}</label>
                  <input
                    type="text"
                    placeholder="2026-06-22 09:00 AM"
                    value={insDate}
                    onChange={(e) => setInsDate(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-xs text-white text-center font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-bold block">{isAr ? 'العنوان والموقع الميداني بالتفصيل:' : 'Site address details/permissions:'}</label>
                <textarea
                  rows={2}
                  required
                  placeholder={isAr ? 'أدخل عنوان التحرير وتأمين المارينا لرافعات crane...' : 'Safety parameters, street permissions...'}
                  value={insAddress}
                  onChange={(e) => setInsAddress(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-xs text-white text-right focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setAddingIns(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black text-xs font-black rounded-lg cursor-pointer"
                >
                  {isAr ? 'عقد الموعد بالسيستم' : 'Dispatch Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
