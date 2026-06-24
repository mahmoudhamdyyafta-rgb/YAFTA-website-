import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Hammer, ShieldCheck, Clock, Calendar, Check, AlertCircle, Wrench, Package, Sparkles } from 'lucide-react';
import { PageId } from '../types';
import { db, isFirebaseConfigured } from '../firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

interface RepairTicket {
  id: string;
  customerName: string;
  deviceType: string;
  deviceModel: string;
  faultDescription: string;
  technicianName: string;
  repairCost: number;
  warrantyStatus: string;
  estimatedDeliveryDate: string;
  status: 'Received' | 'Diagnosed' | 'Waiting Parts' | 'Repairing' | 'Testing' | 'Ready' | 'Delivered';
  notes: string;
  imageUrl?: string;
}

interface Props {
  setActivePage: (page: PageId) => void;
  isAr: boolean;
}

const DEFAULT_REPAIRS: RepairTicket[] = [
  {
    id: 'REP-7402',
    customerName: 'مطاعم مادو التركية',
    deviceType: 'شاشة خارجية P10 LED مضيئة',
    deviceModel: 'Outdoor P10 LED 2x3m',
    faultDescription: 'احتراق لوحة باور سبلاي وتلف بعض خلايا ليد نتيجة ماس كهربائي',
    technicianName: 'المهندس مصطفى كامل',
    repairCost: 3500,
    warrantyStatus: 'ضمان ممتد لمدة 12 شهر على قطع الغيار',
    estimatedDeliveryDate: '2026-06-28',
    status: 'Repairing',
    notes: 'تم استبدال الباور سبلاي التالف وجاري تركيب خلايا ليد بديلة واختبار استقرار الفولتية.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'REP-9081',
    customerName: 'صيدليات سيف',
    deviceType: 'حروف بارزة أكريليك مضيئة',
    deviceModel: 'Acrylic 3D Illuminated Sign',
    faultDescription: 'ضعف عام في الإضاءة الخلفية وتلف بعض محولات التيار المطرية',
    technicianName: 'المهندس تامر يوسف',
    repairCost: 1800,
    warrantyStatus: 'ضمان فني لمدة 6 أشهر',
    estimatedDeliveryDate: '2026-06-25',
    status: 'Ready',
    notes: 'تم استبدال محولات التيار بأخرى أصلية مضادة للمياه ومقاومة للعوامل الجوية واختبار شدة الإضاءة بنجاح.',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80'
  }
];

const STAGES: { id: string; labelAr: string; labelEn: string; descAr: string; descEn: string }[] = [
  { id: 'Received', labelAr: 'تم الاستلام', labelEn: 'Received', descAr: 'تم استلام اللوحة بمركز الصيانة', descEn: 'Signage received at service station' },
  { id: 'Diagnosed', labelAr: 'تم الفحص والمعاينة', labelEn: 'Diagnosed', descAr: 'تحديد الأعطال وتكلفة قطع الغيار', descEn: 'Faults identified and cost calculated' },
  { id: 'Waiting Parts', labelAr: 'في انتظار قطع الغيار', labelEn: 'Waiting Parts', descAr: 'طلب الخامات وقطع الغيار الأصلية', descEn: 'Awaiting specialized original components' },
  { id: 'Repairing', labelAr: 'جاري الإصلاح واللحام', labelEn: 'Repairing', descAr: 'العمل الفني قائم بالورشة الآن', descEn: 'Active hardware benchwork in progress' },
  { id: 'Testing', labelAr: 'اختبار الجودة والتشغيل', labelEn: 'Testing', descAr: 'تشغيل مستمر لمدة 24 ساعة لاختبار الأمان', descEn: '24-hour stress-testing and quality check' },
  { id: 'Ready', labelAr: 'جاهز للاستلام', labelEn: 'Ready', descAr: 'العمل اكتمل تماماً وبانتظار العميل', descEn: 'Repair completed and ready for release' },
  { id: 'Delivered', labelAr: 'تم التسليم والتركيب', labelEn: 'Delivered', descAr: 'تسليم اللوحة للعميل وتفعيل الضمان', descEn: 'Delivered to client and warranty active' },
];

export default function TrackRepair({ setActivePage, isAr }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets, setTickets] = useState<RepairTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<RepairTicket | null>(null);
  const [searched, setSearched] = useState(false);

  // Synchronize repair tickets from Firestore if online, otherwise fallback to local/defaults
  useEffect(() => {
    // Check local storage first
    const saved = localStorage.getItem('yafta_repairs_list');
    const initialRepairs = saved ? JSON.parse(saved) : DEFAULT_REPAIRS;
    setTickets(initialRepairs);

    if (isFirebaseConfigured && db) {
      const unsub = onSnapshot(collection(db, 'repairs'), (snap) => {
        const fetched: RepairTicket[] = [];
        snap.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as RepairTicket);
        });
        if (fetched.length > 0) {
          setTickets(fetched);
          localStorage.setItem('yafta_repairs_list', JSON.stringify(fetched));
        }
      });
      return () => unsub();
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryClean = searchQuery.trim().toUpperCase();
    const found = tickets.find(t => t.id === queryClean);
    if (found) {
      setSelectedTicket(found);
    } else {
      setSelectedTicket(null);
    }
    setSearched(true);
  };

  const selectQuickDemo = (id: string) => {
    setSearchQuery(id);
    const found = tickets.find(t => t.id === id);
    if (found) {
      setSelectedTicket(found);
      setSearched(true);
    }
  };

  const getStageIndex = (status: string) => {
    return STAGES.findIndex(s => s.id === status);
  };

  const activeStageIndex = selectedTicket ? getStageIndex(selectedTicket.status) : -1;

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-950/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-neutral-900/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-505/20 bg-gold-950/20 text-gold-505 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'بوابة التتبع المباشر لمركز الصيانة' : 'Live Maintenance Repair Tracker'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#fffbf0] via-[#e5c060] to-[#aa7c11]">
            {isAr ? 'تتبع صيانة لوحتك الإعلانية' : 'Track Your Advertising Sign Repair'}
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            {isAr 
              ? 'أدخل رقم طلب الصيانة المسلم لك عند المعاينة للاطلاع الفوري على حالة العمل الحالي، تفاصيل القطع المبدلة وتاريخ الاستلام المتوقع.' 
              : 'Enter the maintenance code provided to check hardware diagnostics, replaced components, warranty status, and real-time technician bench progression.'}
          </p>
        </div>

        {/* SEARCH BAR PANEL */}
        <div className="p-6 bg-neutral-950 border border-gold-500/10 rounded-2xl shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder={isAr ? "أدخل رقم كود الصيانة (مثال: REP-7402)" : "Enter maintenance ticket code (e.g. REP-7402)"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-800 focus:border-gold-505 focus:outline-none rounded-xl text-sm font-bold tracking-wider placeholder-zinc-600 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-gradient-to-r from-gold-300 via-gold-505 to-gold-400 hover:from-gold-200 hover:to-gold-300 text-black font-extrabold rounded-xl transition-all shadow-lg text-sm uppercase tracking-wider"
            >
              {isAr ? 'تتبع الحالة ⚡' : 'Search Progress ⚡'}
            </button>
          </form>

          {/* QUICK DEMO TRIGGERS */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 text-xs text-zinc-500">
            <span>{isAr ? 'أكواد تجريبية سريعة:' : 'Quick demonstration tickets:'}</span>
            <button 
              onClick={() => selectQuickDemo('REP-7402')} 
              className="px-2.5 py-1 rounded bg-neutral-900 border border-gold-500/10 hover:border-gold-505 text-gold-300 font-mono font-bold transition-all"
            >
              REP-7402
            </button>
            <button 
              onClick={() => selectQuickDemo('REP-9081')} 
              className="px-2.5 py-1 rounded bg-neutral-900 border border-gold-500/10 hover:border-gold-505 text-gold-300 font-mono font-bold transition-all"
            >
              REP-9081
            </button>
          </div>
        </div>

        {/* TICKET DETAILS RENDER */}
        <AnimatePresence mode="wait">
          {searched && selectedTicket && (
            <motion.div
              key="ticket-found"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              
              {/* TIMELINE CONTROLLER */}
              <div className="p-6 bg-neutral-950 border border-gold-500/10 rounded-2xl space-y-8">
                <div className="flex justify-between items-center pb-4 border-b border-neutral-900 flex-row-reverse text-right">
                  <div>
                    <h3 className="text-base font-black text-white">{isAr ? 'المخطط الزمني ومراحل الإنجاز' : 'Signage Repair Progression'}</h3>
                    <p className="text-xs text-neutral-400 mt-1">{isAr ? 'متابعة حية لخطوات العمل داخل معامل يافطة' : 'Live updates synchronized from workshop telemetry'}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-gold-950 border border-gold-505/20 text-gold-505 font-mono text-xs font-bold">
                    {selectedTicket.id}
                  </span>
                </div>

                {/* VISUAL TIMELINE NODES */}
                <div className="relative pt-6">
                  {/* Background Progress line */}
                  <div className="absolute top-11 left-4 right-4 sm:left-12 sm:right-12 h-1 bg-neutral-900 rounded-full z-0" />
                  
                  {/* Filled Progress line */}
                  <div 
                    className="absolute top-11 left-4 sm:left-12 h-1 bg-gradient-to-r from-gold-600 to-gold-400 rounded-full z-0 transition-all duration-1000"
                    style={{
                      width: `${(activeStageIndex / (STAGES.length - 1)) * 90}%`
                    }}
                  />

                  {/* Horizontal list of stages */}
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-6 relative z-10">
                    {STAGES.map((stg, index) => {
                      const isCompleted = index < activeStageIndex;
                      const isActive = index === activeStageIndex;
                      const isPending = index > activeStageIndex;

                      return (
                        <div key={stg.id} className="flex flex-col items-center text-center space-y-3">
                          {/* Circle indicator */}
                          <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              isCompleted 
                                ? 'bg-gold-505 border-gold-505 text-black shadow-[0_0_15px_#e5c060]' 
                                : isActive 
                                ? 'bg-black border-gold-505 text-gold-505 animate-pulse shadow-[0_0_20px_rgba(229,192,96,0.3)]' 
                                : 'bg-neutral-950 border-neutral-800 text-zinc-600'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-5 h-5 stroke-[3]" />
                            ) : (
                              <span className="text-xs font-black font-mono">{index + 1}</span>
                            )}
                          </div>

                          {/* Stage details */}
                          <div className="space-y-1 px-1">
                            <span className={`block text-[11px] font-black leading-tight transition-colors ${isActive ? 'text-gold-505' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'}`}>
                              {isAr ? stg.labelAr : stg.labelEn}
                            </span>
                            <span className="hidden md:block text-[9px] text-zinc-500 leading-snug">
                              {isAr ? stg.descAr : stg.descEn}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* DETAILS LEDGER */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Panel 1: Primary Details */}
                <div className="md:col-span-2 p-6 bg-neutral-950 border border-gold-500/10 rounded-2xl space-y-5 text-right flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-white border-b border-neutral-900 pb-2 flex items-center gap-2 justify-end">
                      <span>{isAr ? 'تشخيص العطل وتفاصيل المعاينة' : 'Diagnostic Logs & Scope'}</span>
                      <Wrench className="w-4 h-4 text-gold-505" />
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-zinc-500 block mb-1">{isAr ? 'اسم العميل' : 'Customer Client'}</span>
                        <strong className="text-white font-bold">{selectedTicket.customerName}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block mb-1">{isAr ? 'المنتج / اللوحة' : 'Device / Sign Type'}</span>
                        <strong className="text-white font-bold">{selectedTicket.deviceType}</strong>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-neutral-900/40">
                        <span className="text-zinc-500 block mb-1">{isAr ? 'وصف المشكلة والأعطال' : 'Fault Description'}</span>
                        <p className="text-neutral-200 text-xs leading-relaxed">{selectedTicket.faultDescription}</p>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-neutral-900/40">
                        <span className="text-zinc-500 block mb-1">{isAr ? 'إجراءات وملاحظات فني الصيانة' : 'Technician Action Log'}</span>
                        <p className="text-neutral-300 text-xs bg-neutral-900/60 p-3 rounded-xl border border-neutral-800 leading-relaxed font-semibold">
                          {selectedTicket.notes}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-900 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-zinc-500 block mb-1">{isAr ? 'المهندس المشرف' : 'Lead Engineer'}</span>
                      <span className="text-white font-bold">{selectedTicket.technicianName}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block mb-1">{isAr ? 'الاستلام المتوقع' : 'Estimated Return'}</span>
                      <span className="text-gold-300 font-bold font-mono flex items-center gap-1 justify-end">
                        <Calendar className="w-3.5 h-3.5 inline text-gold-505" />
                        {selectedTicket.estimatedDeliveryDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Panel 2: Financial & Warranty Card */}
                <div className="p-6 bg-neutral-950 border border-gold-500/10 rounded-2xl flex flex-col justify-between text-right gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-white border-b border-neutral-900 pb-2 flex items-center gap-2 justify-end">
                      <span>{isAr ? 'الفاتورة والضمان' : 'Finance & Warranty'}</span>
                      <ShieldCheck className="w-4 h-4 text-gold-505" />
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <span className="text-zinc-500 block text-xs mb-1">{isAr ? 'تكلفة الصيانة وقطع الغيار' : 'Total Repair Invoice'}</span>
                        <span className="text-3xl font-black text-gold-300 font-mono">
                          {selectedTicket.repairCost.toLocaleString()}
                          <span className="text-xs text-neutral-400 font-sans mr-1">{isAr ? 'ج.م' : 'EGP'}</span>
                        </span>
                      </div>

                      <div className="p-3 bg-neutral-900 rounded-xl border border-gold-505/10 text-xs space-y-1">
                        <span className="text-zinc-500 block font-bold">{isAr ? 'حالة الضمان ومستوى الأمان' : 'Warranty status'}</span>
                        <strong className="text-emerald-400 block font-black">{selectedTicket.warrantyStatus}</strong>
                      </div>
                    </div>
                  </div>

                  {selectedTicket.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-neutral-800 relative group aspect-video">
                      <img 
                        src={selectedTicket.imageUrl} 
                        alt="Signboard image" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2.5">
                        <span className="text-[10px] text-white/80 font-mono tracking-widest uppercase">Bench Diagnostics Pic</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setActivePage('contact')}
                    className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-gold-550/20 text-gold-505 rounded-xl font-bold text-xs uppercase tracking-wider text-center cursor-pointer transition-colors"
                  >
                    {isAr ? 'استشارة الدعم الفني 📞' : 'Contact Tech Support 📞'}
                  </button>
                </div>

              </div>

            </motion.div>
          )}

          {searched && !selectedTicket && (
            <motion.div
              key="ticket-not-found"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-12 text-center bg-neutral-950 border border-red-500/10 rounded-2xl max-w-lg mx-auto space-y-4"
            >
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-black text-white">{isAr ? 'كود الصيانة غير مسجل بالسيستم' : 'Ticket Code Not Detected'}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {isAr 
                  ? 'يرجى التحقق من صحة الرمز المدخل المكتوب في سند الاستلام أو التواصل مع خدمة العملاء للتأكد من ربط طلبك بقواعد البيانات.' 
                  : 'Verify the specific spelling and hyphens on your physically printed invoice, or reach out to client assistance to bind your record.'}
              </p>
              <button
                onClick={() => setSearchQuery('REP-7402')}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-gold-400 rounded-lg text-xs font-bold transition-all"
              >
                {isAr ? 'تجربة كود صحيح تلقائياً' : 'Use valid demo ticket code'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
