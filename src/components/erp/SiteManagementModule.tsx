/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, CheckSquare, Clock, User, Plus, Trash2, 
  Settings, Image, CheckCircle, Navigation, Info, 
  Map, FileText, ChevronRight, CheckSquare2, FileCheck, Award, Maximize2
} from 'lucide-react';

interface SiteSurvey {
  id: string;
  projectName: string;
  clientName: string;
  locationName: string;
  coordinates: { lat: number; lng: number };
  claddingHeightMeters: number;
  facadeWidthMeters: number;
  electricityCapacityAmps: number;
  materialType: string;
  hazardousRating: 'Standard' | 'Elevated Danger' | 'Critical High';
}

interface InstallationJob {
  id: string;
  projectName: string;
  dueDate: string;
  assignedTechnician: string;
  progress: 'Surveying' | 'Fabricating' | 'Transporting' | 'Mounting' | 'QC-Check' | 'Done';
  checklist: {
    safetyHarnessChecked: boolean;
    windStressComputed: boolean;
    powerLoadVerified: boolean;
    mountingBracketsLeveled: boolean;
    ledIsotopesTested: boolean;
    structuralCleanupDone: boolean;
  };
  beforePhoto: string;
  afterPhoto: string;
  completionReport: {
    submitted: boolean;
    reportedHours: number;
    completionNotes: string;
    finalRating: number;
  };
}

interface Props {
  isAr: boolean;
  canEdit: boolean;
  userRole?: string;
  onPostActivityLog?: (ar: string, en: string, type: any) => void;
}

export default function SiteManagementModule({ isAr, canEdit, userRole = 'Employee', onPostActivityLog }: Props) {
  const [surveys, setSurveys] = useState<SiteSurvey[]>(() => {
    const saved = localStorage.getItem('yafta_site_surveys');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 's-1',
        projectName: 'Al-Masry Restaurant Backlit',
        clientName: 'Al-Masry Group',
        locationName: 'Dokki, Giza Road 12',
        coordinates: { lat: 30.0388, lng: 31.2114 },
        claddingHeightMeters: 6.5,
        facadeWidthMeters: 12.0,
        electricityCapacityAmps: 40,
        materialType: 'Granite + Stucco',
        hazardousRating: 'Standard'
      },
      {
        id: 's-2',
        projectName: 'Zayed Avenue ACP Cladding',
        clientName: 'Elite Real Estate',
        locationName: 'Sheikh Zayed, Entrance 2',
        coordinates: { lat: 30.0155, lng: 30.9822 },
        claddingHeightMeters: 18.5,
        facadeWidthMeters: 28.0,
        electricityCapacityAmps: 120,
        materialType: 'Concrete skeleton',
        hazardousRating: 'Elevated Danger'
      }
    ];
  });

  const [installations, setInstallations] = useState<InstallationJob[]>(() => {
    const saved = localStorage.getItem('yafta_installation_jobs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'job-1',
        projectName: 'Al-Masry Restaurant Backlit',
        dueDate: '2026-06-24',
        assignedTechnician: 'Sherif Abdel Wahab',
        progress: 'Mounting',
        beforePhoto: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600',
        afterPhoto: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=600',
        checklist: {
          safetyHarnessChecked: true,
          windStressComputed: true,
          powerLoadVerified: false,
          mountingBracketsLeveled: true,
          ledIsotopesTested: false,
          structuralCleanupDone: false
        },
        completionReport: {
          submitted: false,
          reportedHours: 12,
          completionNotes: '',
          finalRating: 5
        }
      },
      {
        id: 'job-2',
        projectName: 'Zayed Avenue ACP Cladding',
        dueDate: '2026-06-28',
        assignedTechnician: 'Ibrahim Farouk',
        progress: 'Surveying',
        beforePhoto: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=600',
        afterPhoto: 'https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=600',
        checklist: {
          safetyHarnessChecked: false,
          windStressComputed: false,
          powerLoadVerified: false,
          mountingBracketsLeveled: false,
          ledIsotopesTested: false,
          structuralCleanupDone: false
        },
        completionReport: {
          submitted: false,
          reportedHours: 0,
          completionNotes: '',
          finalRating: 5
        }
      }
    ];
  });

  const [activeSurveyId, setActiveSurveyId] = useState<string>('s-1');
  const [activeJobId, setActiveJobId] = useState<string>('job-1');

  // Form states
  const [surveyProjName, setSurveyProjName] = useState('');
  const [surveyClientName, setSurveyClientName] = useState('');
  const [surveyLocName, setSurveyLocName] = useState('New Cairo, Sector 5');
  const [surveyHeight, setSurveyHeight] = useState<number>(4);
  const [surveyWidth, setSurveyWidth] = useState<number>(10);
  const [surveyElectricity, setSurveyElectricity] = useState<number>(30);
  const [surveyMaterial, setSurveyMaterial] = useState('Aluminium cladding shell');
  const [surveyHazard, setSurveyHazard] = useState<'Standard' | 'Elevated Danger' | 'Critical High'>('Standard');
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  // Completion report states
  const [repHours, setRepHours] = useState<number>(8);
  const [repNotes, setRepNotes] = useState('');
  const [repRating, setRepRating] = useState<number>(5);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // New installation job scheduler form
  const [scholProjName, setScholProjName] = useState('');
  const [scholDate, setScholDate] = useState(new Date().toISOString().split('T')[0]);
  const [scholTech, setScholTech] = useState('Sherif Abdel Wahab');
  const [isScholOpen, setIsScholOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('yafta_site_surveys', JSON.stringify(surveys));
  }, [surveys]);

  useEffect(() => {
    localStorage.setItem('yafta_installation_jobs', JSON.stringify(installations));
  }, [installations]);

  const activeSurvey = surveys.find(s => s.id === activeSurveyId) || surveys[0];
  const activeJob = installations.find(j => j.id === activeJobId) || installations[0];

  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyProjName || !surveyClientName) return;

    // Simulate different coordinates on Egypt Map depending on Location Name
    const lat = 30.0 + Math.random() * 0.1;
    const lng = 31.0 + Math.random() * 0.2;

    const newSurvey: SiteSurvey = {
      id: `s-${Date.now()}`,
      projectName: surveyProjName,
      clientName: surveyClientName,
      locationName: surveyLocName,
      coordinates: { lat, lng },
      claddingHeightMeters: surveyHeight,
      facadeWidthMeters: surveyWidth,
      electricityCapacityAmps: surveyElectricity,
      materialType: surveyMaterial,
      hazardousRating: surveyHazard
    };

    setSurveys([newSurvey, ...surveys]);
    setActiveSurveyId(newSurvey.id);

    if (onPostActivityLog) {
      onPostActivityLog(
        `تم تسجيل وتصدير تقرير معاينة بنية الموقع لقرية: ${surveyProjName}`,
        `Site survey coordinates and structures dispatched for: ${surveyProjName}`,
        'info'
      );
    }

    setSurveyProjName('');
    setSurveyClientName('');
    setIsSurveyOpen(false);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholProjName) return;

    const newJob: InstallationJob = {
      id: `job-${Date.now()}`,
      projectName: scholProjName,
      dueDate: scholDate,
      assignedTechnician: scholTech,
      progress: 'Surveying',
      beforePhoto: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600',
      afterPhoto: 'https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=600',
      checklist: {
        safetyHarnessChecked: false,
        windStressComputed: false,
        powerLoadVerified: false,
        mountingBracketsLeveled: false,
        ledIsotopesTested: false,
        structuralCleanupDone: false
      },
      completionReport: {
        submitted: false,
        reportedHours: 0,
        completionNotes: '',
        finalRating: 5
      }
    };

    setInstallations([newJob, ...installations]);
    setActiveJobId(newJob.id);
    setIsScholOpen(false);
    setScholProjName('');
  };

  const handleToggleChecklist = (field: keyof InstallationJob['checklist']) => {
    const updated = installations.map(j => {
      if (j.id === activeJob.id) {
        return {
          ...j,
          checklist: {
            ...j.checklist,
            [field]: !j.checklist[field]
          }
        };
      }
      return j;
    });
    setInstallations(updated);
  };

  const handleUpdateProgress = (progress: InstallationJob['progress']) => {
    const updated = installations.map(j => {
      if (j.id === activeJob.id) {
        return { ...j, progress };
      }
      return j;
    });
    setInstallations(updated);
  };

  const handleSubmitCompletionReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repNotes) return;

    const updated = installations.map(j => {
      if (j.id === activeJob.id) {
        return {
          ...j,
          progress: 'Done' as const,
          checklist: {
            safetyHarnessChecked: true,
            windStressComputed: true,
            powerLoadVerified: true,
            mountingBracketsLeveled: true,
            ledIsotopesTested: true,
            structuralCleanupDone: true
          },
          completionReport: {
            submitted: true,
            reportedHours: repHours,
            completionNotes: repNotes,
            finalRating: repRating
          }
        };
      }
      return j;
    });

    setInstallations(updated);
    setIsReportOpen(false);
    setRepNotes('');
    alert(isAr ? 'تم سكب تقرير التقفيل المالي للموقع وإبرام الاستلام من العميل بنجاح!' : 'Site Completion dispatch closed and submitted successfully!');
  };

  const deleteSurvey = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(isAr ? 'حذف هذا التقرير؟' : 'Delete this survey report?')) {
      setSurveys(surveys.filter(s => s.id !== id));
    }
  };

  return (
    <div className="bg-neutral-950 p-6 rounded-2xl border border-gold-505/20 text-right font-sans space-y-8">
      
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-row-reverse">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-end">
            <Navigation className="w-5 h-5 text-gold-505" />
            <span>{isAr ? 'جدولة وتركيبات المواقع والدراسات الميدانية' : 'Site Surveys & Heavy Installations Manager'}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isAr ? 'دراسة واجهة المعاينة الفنية، المقاسات، وإسناد الفنيين مع تتبع GPS' : 'Wind stress calculators, coordinates maps, safety harnesses logs and crew checklists.'}
          </p>
        </div>

        <div className="flex gap-2">
          {canEdit && (
            <button 
              onClick={() => setIsSurveyOpen(true)}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-850 hover:border-gold-505 text-xs text-white border border-neutral-850 rounded-lg flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <MapPin className="w-4 h-4 text-gold-505" />
              <span>{isAr ? 'تسجيل معاينة ومقاسات موقع' : 'New Site Survey'}</span>
            </button>
          )}

          {canEdit && (
            <button 
              onClick={() => setIsScholOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black hover:opacity-90 text-xs font-black rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>{isAr ? 'إسناد وجدولة تركيب' : 'Schedule Crew'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Surveys Board List */}
        <div className="lg:col-span-1 bg-neutral-900/40 p-4 rounded-xl border border-neutral-850 space-y-4">
          <h4 className="text-xs font-black text-gold-300 uppercase pb-2 border-b border-neutral-800 flex items-center justify-end gap-1.5">
            <span>{isAr ? 'المعاينات الميدانية المسجلة:' : 'ACTIVE SITE SURVEYS DATABASE:'}</span>
            <Map className="w-4 h-4 text-gold-505" />
          </h4>

          <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
            {surveys.map(s => (
              <div
                key={s.id}
                onClick={() => setActiveSurveyId(s.id)}
                className={`p-3 rounded-lg border text-xs text-right cursor-pointer transition-all space-y-1.5 relative ${
                  activeSurveyId === s.id
                    ? 'border-gold-505 bg-gold-950/10'
                    : 'border-neutral-850 hover:bg-neutral-900/60 bg-neutral-900/20'
                }`}
              >
                <div className="flex justify-between items-center flex-row-reverse">
                  <span className="font-extrabold text-white">{s.projectName}</span>
                  {canEdit && (
                    <button 
                      onClick={(e) => deleteSurvey(s.id, e)}
                      className="text-zinc-650 hover:text-rose-400 p-0.5 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-neutral-500 hover:text-red-500" />
                    </button>
                  )}
                </div>
                <div className="flex justify-between text-[10px] text-neutral-400 flex-row-reverse font-mono">
                  <span>{s.locationName}</span>
                  <span className="text-gold-505">{s.hazardousRating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Map and Survey Details View */}
        <div className="lg:col-span-2 space-y-6">
          {activeSurvey ? (
            <div className="bg-neutral-900/60 p-5 rounded-2xl border border-neutral-850 space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 flex-row-reverse">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-white">{activeSurvey.projectName}</h3>
                  <p className="text-[10px] text-zinc-400 font-mono">CLIENT: {activeSurvey.clientName} | {activeSurvey.locationName}</p>
                </div>
                <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-gold-300 font-mono font-bold px-2 py-1 rounded">
                  GPS MAP REF
                </span>
              </div>

              {/* Simulated GPS Interactive Map */}
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl relative overflow-hidden h-44 flex flex-col justify-between">
                {/* Visual grid representing the coordinates map */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e5c060_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
                <div className="absolute inset-0 opacity-30 bg-gradient-to-t from-black to-transparent"></div>
                
                <div className="relative z-10 flex justify-between items-start flex-row-reverse">
                  <div className="text-right bg-neutral-900/90 p-2 rounded-lg border border-neutral-800 text-[10px] font-mono leading-relaxed text-zinc-300">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{isAr ? 'عقد الإشارة: متصل' : 'GPS Signal Lock: secured'}</span>
                    </div>
                    <div>LAT: {activeSurvey.coordinates.lat.toFixed(4)}</div>
                    <div>LNG: {activeSurvey.coordinates.lng.toFixed(4)}</div>
                  </div>
                  <div className="p-2 rounded bg-neutral-900/60 text-xs text-white uppercase font-black font-semibold">
                    {isAr ? 'تحديث الإحداثيات' : 'Egypt Regional Node'}
                  </div>
                </div>

                <div className="relative z-10 flex justify-center pb-2">
                  <div className="flex bg-neutral-900/90 px-3 py-1.5 rounded-full border border-gold-505/20 items-center gap-1.5 text-xs text-gold-300 animate-bounce">
                    <MapPin className="w-4 h-4 text-gold-505" />
                    <span>{activeSurvey.locationName}</span>
                  </div>
                </div>
              </div>

              {/* Engineering specifications parameters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { labelAr: 'ارتفاع الواجهة (متر)', labelEn: 'Facade Height (m)', val: `${activeSurvey.claddingHeightMeters}m`, desc: isAr ? 'أوناش صقارة' : 'Crane required' },
                  { labelAr: 'مساحة العلبة الفنية', labelEn: 'Facade Width (m)', val: `${activeSurvey.facadeWidthMeters}m`, desc: isAr ? 'أبعاد الهيكل' : 'Frame dimension' },
                  { labelAr: 'القدرة الكهربائية المقاسة', labelEn: 'Electricity capacity', val: `${activeSurvey.electricityCapacityAmps}A`, desc: isAr ? 'جهد سامسونج ليد' : 'Samsung LED isolation' },
                  { labelAr: 'بنية الواجهة المعتمدة', labelEn: 'Structural Facade material', val: activeSurvey.materialType, desc: isAr ? 'حفر ليزر وربط' : 'Mounting anchor' }
                ].map((spec, i) => (
                  <div key={i} className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 text-right space-y-1">
                    <span className="text-[10px] text-zinc-500 block truncate">{isAr ? spec.labelAr : spec.labelEn}</span>
                    <strong className="text-xs text-white block truncate">{spec.val}</strong>
                    <span className="text-[9px] text-gold-300 font-mono block">{spec.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 text-center">{isAr ? 'لا يوجد معاينات نشطة' : 'No survey node selected.'}</p>
          )}
        </div>
      </div>

      {/* Crews and Installation checklists */}
      <div className="border-t border-neutral-900 pt-6 space-y-4">
        <div className="flex justify-between items-center flex-row-reverse pb-2">
          <h3 className="text-sm font-black text-white flex items-center gap-2 justify-end">
            <span>{isAr ? 'فنيي التركيب والتقدم بالموقع:' : 'Active Site Installation Schedules:'}</span>
            <CheckSquare2 className="w-4 h-4 text-gold-505" />
          </h3>
          <span className="text-xs text-neutral-400">{installations.length} {isAr ? 'مشاريع تشغيل نشطة' : 'active installation schedules'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* List of active schedules */}
          <div className="md:col-span-1 border-l border-neutral-900 pl-4 space-y-2 max-h-[350px] overflow-y-auto">
            {installations.map(j => (
              <button
                key={j.id}
                onClick={() => setActiveJobId(j.id)}
                className={`w-full text-right p-3.5 rounded-xl border transition-all text-xs flex flex-col gap-1.5 cursor-pointer ${
                  activeJobId === j.id
                    ? 'border-gold-505 bg-gold-950/10'
                    : 'border-neutral-900 bg-neutral-900/40 hover:bg-neutral-900'
                }`}
              >
                <div className="flex justify-between items-center w-full flex-row-reverse">
                  <span className="font-extrabold text-white text-right truncate max-w-[130px]">{j.projectName}</span>
                  <span className="text-[10px] bg-neutral-950 text-gold-505 px-1.5 py-0.5 rounded font-mono font-bold">
                    {j.progress}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-neutral-400 w-full flex-row-reverse">
                  <span>{j.assignedTechnician}</span>
                  <span>{j.dueDate}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Checklist & Crew Management Details */}
          <div className="md:col-span-2 bg-neutral-900/60 p-5 rounded-2xl border border-neutral-850 space-y-5">
            {activeJob ? (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 flex-row-reverse border-b border-neutral-800 pb-3">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-white">{activeJob.projectName}</h4>
                    <p className="text-[10px] text-neutral-400">{isAr ? 'فني التركيب المعتمد:' : 'Chief Rigger assigned:'} <strong className="text-gold-505">{activeJob.assignedTechnician}</strong></p>
                  </div>

                  {/* Move installation stage */}
                  <div className="flex gap-1">
                    {['Surveying', 'Fabricating', 'Transporting', 'Mounting', 'QC-Check', 'Done'].map(st => (
                      <button
                        key={st}
                        onClick={() => handleUpdateProgress(st as any)}
                        className={`text-[8.5px] font-black uppercase px-2 py-1 rounded transition-colors cursor-pointer ${
                          activeJob.progress === st
                            ? 'bg-gold-505 text-neutral-950'
                            : 'bg-neutral-950 border border-neutral-850 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress comparators before/after */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative rounded-xl overflow-hidden h-28 bg-neutral-950 border border-neutral-800">
                    <img referrerPolicy="no-referrer" src={activeJob.beforePhoto} className="w-full h-full object-cover opacity-50" alt="Before" />
                    <span className="absolute bottom-2 right-2 bg-neutral-950/80 px-2 py-0.5 text-[9px] text-zinc-100 uppercase font-black font-semibold rounded">{isAr ? 'قبل التركيب 📁' : 'Before Facade 📁'}</span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden h-28 bg-neutral-950 border border-neutral-800">
                    <img referrerPolicy="no-referrer" src={activeJob.afterPhoto} className="w-full h-full object-cover opacity-60" alt="After" />
                    <span className="absolute bottom-2 right-2 bg-gold-950/80 px-2 py-0.5 text-[9px] text-gold-300 uppercase font-black font-semibold rounded">{isAr ? 'بعد التركيب والتشطيب ✨' : 'After Signage Rendering ✨'}</span>
                  </div>
                </div>

                {/* Checklist section */}
                <div className="space-y-3.5">
                  <strong className="text-xs text-white block">{isAr ? 'قائمة الفحوصات والتدقيق الميكانيكي للموقع:' : 'Site Safety & Quality Checklist:'}</strong>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      { key: 'safetyHarnessChecked' as const, labelAr: 'فحص أحزمة الأمان والسباكة للخارج', labelEn: 'Riggers safety harness secured' },
                      { key: 'windStressComputed' as const, labelAr: 'حساب معامل ضغط الرياح الميكانيكي على الهيكل', labelEn: 'Wind load stress limits approved' },
                      { key: 'powerLoadVerified' as const, labelAr: 'مطابقة تغذية الطاقة الكلية وحماية القاطع للكهرباء', labelEn: 'Samsung LED power redundancy checked' },
                      { key: 'mountingBracketsLeveled' as const, labelAr: 'ميزان مائي لربط الشجية الحديدية والكلادينج', labelEn: 'Structural anchor leveling verified' },
                      { key: 'ledIsotopesTested' as const, labelAr: 'اختبار الليد وحبات الإضاءة (الهالة الخلفية)', labelEn: 'Light luminosity & isolation test' },
                      { key: 'structuralCleanupDone' as const, labelAr: 'تسوية ونظافة الموقع الفردية وإزالة النواتج', labelEn: 'Site restoration & cleanup' }
                    ].map(item => (
                      <button
                        key={item.key}
                        onClick={() => handleToggleChecklist(item.key)}
                        className="flex items-center justify-between text-right p-2.5 rounded-lg border bg-neutral-950 text-xs w-full text-zinc-300 hover:border-gold-505/20 cursor-pointer flex-row-reverse"
                      >
                        <span className="text-right leading-snug">{isAr ? item.labelAr : item.labelEn}</span>
                        <input
                          type="checkbox"
                          checked={activeJob.checklist[item.key]}
                          readOnly
                          className="w-4 h-4 accent-gold-505 cursor-pointer shrink-0"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Completion Report trigger */}
                <div className="flex justify-between items-center flex-row-reverse border-t border-neutral-800 pt-4">
                  {activeJob.completionReport.submitted ? (
                    <div className="flex items-center gap-1.5 flex-row-reverse">
                      <span className="text-emerald-400 flex items-center gap-1 text-xs font-bold leading-none">
                        <CheckCircle className="w-4 h-4" />
                        <span>{isAr ? 'تم سكب تقرير التقفيل المالي للموقع' : 'Site report finalized'}</span>
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">HOURS: {activeJob.completionReport.reportedHours} hrs</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsReportOpen(true)}
                      className="px-4 py-2 bg-neutral-950 border border-gold-550/30 hover:border-gold-505 text-[10px] font-black text-gold-300 hover:text-white rounded-lg transition-all cursor-pointer shadow-md"
                    >
                      🖋️ {isAr ? 'تقديم تقرير الاستلام الكلي' : 'Submit Completion Report'}
                    </button>
                  )}
                  <span className="text-[10px] text-neutral-500 font-mono">JOB-ID: {activeJob.id}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-500 text-center shrink-0">{isAr ? 'يرجى اختيار مشروع تلميع أو تركيب المعلقات' : 'Select schedule crew item.'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Survey Creation Modal */}
      {isSurveyOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-lg w-full relative space-y-6 text-right">
            <h3 className="text-base font-black text-gold-300 flex items-center gap-1.5 justify-end">
              <span>{isAr ? 'تسجيل مقاسات ومعاينة واجهة الموقع' : 'Establish Corporate Site Survey'}</span>
              <MapPin className="w-5 h-5 text-gold-505 animate-bounce" />
            </h3>

            <form onSubmit={handleCreateSurvey} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'اسم الشريك/العميل المقترح:' : 'Proposed Client Name:'}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Al-Masry Restaurant"
                    value={surveyClientName}
                    onChange={e => setSurveyClientName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white text-right focus:outline-none focus:border-gold-505"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'تفاصيل الهيكل فني الإعلاني:' : 'Sign Project Name:'}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Grand backlit logo metal"
                    value={surveyProjName}
                    onChange={e => setSurveyProjName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white text-right focus:outline-none focus:border-gold-505"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'ارتفاع الواجهة بالكامل (متر)' : 'Height meters'}</label>
                  <input 
                    type="number" 
                    min={1}
                    required
                    value={surveyHeight}
                    onChange={e => setSurveyHeight(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2 rounded text-white text-right font-mono focus:border-gold-505 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'عرض الواجهة المرشحة (متر)' : 'Width meters'}</label>
                  <input 
                    type="number" 
                    min={1}
                    required
                    value={surveyWidth}
                    onChange={e => setSurveyWidth(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2 rounded text-white text-right font-mono focus:border-gold-505 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'قدرة مخرج الكهرباء (أمبير)' : 'Electricity Amps'}</label>
                  <input 
                    type="number" 
                    min={5}
                    required
                    value={surveyElectricity}
                    onChange={e => setSurveyElectricity(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2 rounded text-white text-right font-mono focus:border-gold-505 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'بنية الواجهة الأساسية (طريقة التثبيت)' : 'Substrate material'}</label>
                  <input 
                    type="text" 
                    value={surveyMaterial}
                    onChange={e => setSurveyMaterial(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2 rounded text-white text-right focus:border-gold-505 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'مستويات الخطورة والأحمال' : 'Hazard Risk factor'}</label>
                  <select 
                    value={surveyHazard}
                    onChange={e => setSurveyHazard(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2 rounded text-white font-bold"
                  >
                    <option value="Standard">{isAr ? 'مستويات اعتيادية (Standard)' : 'Standard safety factor'}</option>
                    <option value="Elevated Danger">{isAr ? 'ارتفاع عالي (Elevated)' : 'Elevated Heights danger'}</option>
                    <option value="Critical High">{isAr ? 'خطورة قصوى أوناش ثقيلة (Critical)' : 'Critical / Heavy riggers only'}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'المنطقة الجغرافية التقريبية:' : 'Regional Address details:'}</label>
                <input 
                  type="text" 
                  value={surveyLocName}
                  onChange={e => setSurveyLocName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2.5 rounded text-white text-right focus:border-gold-505 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsSurveyOpen(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg border border-neutral-850 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 text-xs font-black rounded-lg transition-all cursor-pointer shadow-md"
                >
                  {isAr ? 'تحديث وتنزيل ببيانات الموقع' : 'Confirm Survey'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Completion Report Creation Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-md w-full relative space-y-6 text-right">
            <h3 className="text-base font-black text-white flex items-center gap-1.5 justify-end">
              <span>{isAr ? 'تحرير محضر استلام ميكانيكي وتسليم العميل' : 'Issue Site Completion Certificate'}</span>
              <FileCheck className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleSubmitCompletionReport} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'إجمالي الساعات المصنعية المستهلكة بالموقع:' : 'Site hours spent (Crews):'}</label>
                <input 
                  type="number" 
                  required
                  value={repHours}
                  onChange={e => setRepHours(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right focus:outline-none focus:border-gold-505 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'تأكيد سلامة اللحام وتماسك الهيكل:' : 'Completion Notes & Quality Audit:'}</label>
                <textarea 
                  required
                  rows={3}
                  placeholder={isAr ? 'مثال: تم ربط الحروف واللوحة بزوايا حديد 4مم مجلفن، الفولت المقاس 11.9 فولت، الاستلام كامل من المحل.' : 'e.g. Backbone galvanized iron welded properly. Samsung LED tested waterproof.'}
                  value={repNotes}
                  onChange={e => setRepNotes(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right focus:outline-none focus:border-gold-505 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'التقييم الجمالي النهائي للتركيب:' : 'Core Aesthetic evaluation rating:'}</label>
                <select 
                  value={repRating}
                  onChange={e => setRepRating(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white font-bold"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (Excellent / Handled properly)</option>
                  <option value={4}>⭐⭐⭐⭐ (Standard / clean)</option>
                  <option value={3}>⭐⭐⭐ (Delivered with notes)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsReportOpen(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg border border-neutral-850 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 text-xs font-black rounded-lg transition-all cursor-pointer shadow-md text-neutral-905 text-neutral-905 hover:bg-gold-400"
                >
                  {isAr ? 'إرسال وتعميد الاستلام الكلي' : 'Commit Completion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Crew Scheduler Modal */}
      {isScholOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-sm w-full relative space-y-6 text-right">
            <h3 className="text-base font-black text-white flex items-center gap-1.5 justify-end">
              <span>{isAr ? 'إسناد وجدولة طاقم التركيبات الشاهقة' : 'Schedule High Installation Crew'}</span>
              <Calendar className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'اسم مشروع التوريد والكلادينج:' : 'Select Signage/Facade Project:'}</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Al-Masry Restaurant"
                  value={scholProjName}
                  onChange={e => setScholProjName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right focus:outline-none focus:border-gold-505"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'تاريخ البدء المعتمد:' : 'Scheduled Date:'}</label>
                <input 
                  type="date" 
                  required
                  value={scholDate}
                  onChange={e => setScholDate(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white tracking-widest text-right focus:outline-none focus:border-gold-505 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'فني التركيب ومسؤول كتل الأحمال:' : 'Technician Leader:'}</label>
                <select 
                  value={scholTech}
                  onChange={e => setScholTech(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white font-bold"
                >
                  <option value="Sherif Abdel Wahab">{isAr ? 'المهندس شريف عبد الوهاب (كبير مهندسي التركيب)' : 'Sherif Abdel Wahab (Lead rigger)'}</option>
                  <option value="Ibrahim Farouk">{isAr ? 'الأستاذ إبراهيم فاروق (مبرمج CNC والخامات)' : 'Ibrahim Farouk (CNC Workshop)'}</option>
                  <option value="Islam Hamdy">{isAr ? 'المصمم إسلام حمدي (شؤون الضوء والمحاكاة)' : 'Islam Hamdy (Creative 3D Visualizer)'}</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsScholOpen(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg border border-neutral-850 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 text-xs font-black rounded-lg transition-all cursor-pointer shadow-md text-neutral-905 hover:bg-gold-400"
                >
                  {isAr ? 'تعميد وجدولة الموقع المقترح' : 'Schedule Crew'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
