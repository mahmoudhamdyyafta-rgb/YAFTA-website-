/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, ShieldCheck, Clock, Plus, Trash2, Edit2, Download, 
  Upload, Tag, AlertTriangle, CheckCircle, Search, Info, HelpCircle,
  FileCheck, ShieldAlert, Award, FileSpreadsheet, Lock, Briefcase
} from 'lucide-react';

interface LegalDoc {
  id: string;
  name: string;
  size: string;
  type: string; // "Tax Card" "Commercial Registry" "Insurance Plan" "Civil Defense"
  uploadedAt: string;
}

interface Contract {
  id: string;
  projectName: string;
  clientName: string;
  templateType: 'Signage Fabrication' | 'Facade Cladding Lease' | 'Premium LED Maintenance';
  amount: number;
  startDate: string;
  endDate: string;
  approvalWorkflow: 'Draft' | 'Legal Approved' | 'Shared' | 'Signed' | 'Active';
  signedBy: string;
  sigDate: string;
  agreementText: string;
}

export default function ContractManagementModule({ isAr, canEdit, userRole = 'Employee' }: { isAr: boolean; canEdit: boolean; userRole?: string }) {
  const [contracts, setContracts] = useState<Contract[]>(() => {
    const saved = localStorage.getItem('yafta_contracts_list');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'c-1',
        projectName: 'Al-Masry Restaurant Backlit Signboard',
        clientName: 'Al-Masry Restaurant',
        templateType: 'Signage Fabrication',
        amount: 45000,
        startDate: '2026-06-18',
        endDate: '2027-06-18',
        approvalWorkflow: 'Signed',
        signedBy: 'Al-Masry Procurement Desk',
        sigDate: '2026-06-19',
        agreementText: 'عقد توريد وتركيب لافتات إعلانية مضيئة: يلتزم الطرف الأول (وكالة يافطة) بتوريد وتركيب مجرى ستانلس ستيل عيار 304 مرايا مقاوم للصدأ مع حبات ليد سامسونج الكورية بضمان كامل 10 سنوات على المخرجات وهيكل الضوء الكلي للطرف الثاني (المطعم المصري).'
      },
      {
        id: 'c-2',
        projectName: 'Zayed Avenue ACP Cladding Facade Project',
        clientName: 'Elite Real Estate',
        templateType: 'Facade Cladding Lease',
        amount: 125000,
        startDate: '2026-06-15',
        endDate: '2026-07-15',
        approvalWorkflow: 'Active',
        signedBy: 'Sherif Aly',
        sigDate: '2026-06-16',
        agreementText: 'عقد توريد ومهام تركيب واجهات كلادينج: تلتزم يافطة للدعاية والإعلان بكساء واجهة بنية النود الفضي المتجانسة للطرف الثاني (إيليت العقارية) بمساحة كلية مقدرة بـ 80 متر مربع، وفق محرك التثبيت الهيكلي المعتمد بالرسومات الهندسية.'
      },
      {
        id: 'c-3',
        projectName: 'Mado Shop Backlit Maintainance Retainer',
        clientName: 'Mado Desserts Egypt',
        templateType: 'Premium LED Maintenance',
        amount: 15400,
        startDate: '2026-06-10',
        endDate: '2026-07-09', // Expiring in 20 days!
        approvalWorkflow: 'Legal Approved',
        signedBy: '',
        sigDate: '',
        agreementText: 'ملحق صيانة وقاية دورية: يلتزم المهندس الفني بيافطة بزيارة شهرية لتفقد التوصيلات والحس الميكانيكي للافتات وسند تغذية الكهرباء 12 فولت.'
      }
    ];
  });

  const [legalDocs, setLegalDocs] = useState<LegalDoc[]>(() => {
    const saved = localStorage.getItem('yafta_legal_docs');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'l-1', name: 'Al_Masry_Tax_Card_2026.pdf', size: '1.4 MB', type: 'Tax Card', uploadedAt: '2026-06-18' },
      { id: 'l-2', name: 'Y_Burger_Commercial_Registry.pdf', size: '2.8 MB', type: 'Commercial Registry', uploadedAt: '2026-06-12' },
      { id: 'l-3', name: 'YAFTA_Civil_Safety_Plan_Cert.pdf', size: '4.5 MB', type: 'Civil Defense', uploadedAt: '2026-06-01' }
    ];
  });

  const [activeContractId, setActiveContractId] = useState<string>('c-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [addingContract, setAddingContract] = useState(false);

  // Form states
  const [projName, setProjName] = useState('');
  const [clientName, setClientName] = useState('');
  const [conType, setConType] = useState<Contract['templateType']>('Signage Fabrication');
  const [conAmount, setConAmount] = useState<number>(30000);
  const [startDInput, setStartDInput] = useState(new Date().toISOString().split('T')[0]);
  const [endDInput, setEndDInput] = useState('2027-06-18');
  const [rawText, setRawText] = useState('');

  // Upload simulation states
  const [selDocType, setSelDocType] = useState('Tax Card');
  const [simUpload, setSimUpload] = useState(false);

  useEffect(() => {
    localStorage.setItem('yafta_contracts_list', JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem('yafta_legal_docs', JSON.stringify(legalDocs));
  }, [legalDocs]);

  const activeContract = contracts.find(c => c.id === activeContractId) || contracts[0];

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName || !clientName) return;

    // Build custom direct text template depending on type selection
    const generatedText = rawText || (
      isAr 
        ? `عقد توريد مبرم بين وكالة يافطة والطرف الثاني: ${clientName} للمشروع الفني: ${projName} بقيمة نهائية ومكتوبة قدرها ${conAmount.toLocaleString()} ج.م يسري ابتداءً من تاريخ ${startDInput} وينقضي في ${endDInput}.`
        : `Fabrication Agreement structured between YAFTA Signage and client counterpart: ${clientName} for ${projName} with net committed budget of EGP ${conAmount.toLocaleString()}, starting on ${startDInput} terminating on ${endDInput}.`
    );

    const newContract: Contract = {
      id: `c-${Date.now()}`,
      projectName: projName,
      clientName: clientName,
      templateType: conType,
      amount: conAmount,
      startDate: startDInput,
      endDate: endDInput,
      approvalWorkflow: 'Draft',
      signedBy: '',
      sigDate: '',
      agreementText: generatedText
    };

    setContracts([newContract, ...contracts]);
    setActiveContractId(newContract.id);
    setProjName('');
    setClientName('');
    setRawText('');
    setAddingContract(false);
  };

  const handleApproveStage = (stage: Contract['approvalWorkflow']) => {
    const updated = contracts.map(c => {
      if (c.id === activeContract.id) {
        return { 
          ...c, 
          approvalWorkflow: stage,
          signedBy: stage === 'Signed' || stage === 'Active' ? 'Client Counterpart Signed' : c.signedBy,
          sigDate: stage === 'Signed' || stage === 'Active' ? new Date().toISOString().split('T')[0] : c.sigDate
        };
      }
      return c;
    });
    setContracts(updated);
  };

  const deleteContract = (id: string) => {
    if (confirm(isAr ? 'حذف هذا العقد؟' : 'Delete this contract node?')) {
      setContracts(contracts.filter(c => c.id !== id));
    }
  };

  // Expiration Days Counter Alerts
  const calculateDaysLeft = (dateString: string) => {
    const end = new Date(dateString);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Upload doc simulation
  const handleDocUploadSim = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setSimUpload(true);
      const name = e.target.files[0].name;
      const sizeStr = `${(e.target.files[0].size / (1024 * 1024)).toFixed(1)} MB`;
      setTimeout(() => {
        const newDoc: LegalDoc = {
          id: `l-${Date.now()}`,
          name,
          size: sizeStr,
          type: selDocType,
          uploadedAt: new Date().toISOString().split('T')[0]
        };
        setLegalDocs([newDoc, ...legalDocs]);
        setSimUpload(false);
        alert(isAr ? 'تم حفظ ومطابقة الأوراق القانونية بنجاح!' : 'Legal document file added successfully to secure vault.');
      }, 1500);
    }
  };

  const filteredContracts = contracts.filter(c => 
    c.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-neutral-950 p-6 rounded-2xl border border-gold-505/20 text-right font-sans space-y-6">
      
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-row-reverse">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-end">
            <ShieldCheck className="w-5 h-5 text-gold-505" />
            <span>{isAr ? 'منصة الصياغة وإدارة العقود القانونية' : 'Corporate Contract Vault & Signatures'}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isAr ? 'صياغة عروض التوريد، مطابقة التواقيع الإلكترونية، وتتبع تاريخ انتهاء العقود والميزانية' : 'Formulate signage supply contracts, process electronic signatures, log expiration countdown benchmarks.'}
          </p>
        </div>

        {canEdit && (
          <button 
            onClick={() => setAddingContract(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-gold-300 to-gold-505 text-black hover:opacity-90 text-xs font-black rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إدراج وصياغة عقد جديد' : 'Draft New Contract'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Archive Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-850 space-y-4">
            
            {/* Search Bar */}
            <div className="relative">
              <input 
                type="text"
                placeholder={isAr ? 'ابحث في أرشيف العقود...' : 'Search archived contract...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-950 border border-gold-505/10 focus:border-gold-505 text-xs text-zinc-100 placeholder-zinc-500 py-2 pr-8 pl-3 rounded-lg focus:outline-none text-right font-sans"
              />
              <Search className="w-4 h-4 text-gold-505 absolute right-2.5 top-2.5" />
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {filteredContracts.map(c => {
                const daysLeft = calculateDaysLeft(c.endDate);
                const isUrgent = daysLeft > 0 && daysLeft <= 30;
                
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveContractId(c.id)}
                    className={`w-full text-right p-3 rounded-lg border text-xs flex flex-col gap-1.5 cursor-pointer relative transition-all ${
                      activeContractId === c.id
                        ? 'border-gold-505 bg-gold-950/10'
                        : 'border-neutral-850 bg-neutral-900/20 hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full flex-row-reverse">
                      <span className="font-extrabold text-white truncate max-w-[140px]">{c.clientName}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                        c.approvalWorkflow === 'Active' ? 'bg-emerald-950 text-emerald-300' :
                        c.approvalWorkflow === 'Signed' ? 'bg-blue-950 text-blue-300' :
                        'bg-neutral-800 text-zinc-400'
                      }`}>
                        {c.approvalWorkflow}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 truncate w-full">{c.projectName}</p>
                    
                    {/* Expiration alert bubble */}
                    <div className="flex justify-between items-center w-full flex-row-reverse text-[9px] mt-1 font-mono">
                      <span className="text-zinc-500">{c.endDate}</span>
                      {daysLeft > 0 ? (
                        <span className={isUrgent ? 'text-red-400 font-bold animate-pulse' : 'text-zinc-400'}>
                          {daysLeft} {isAr ? 'يوم متبقي' : 'days left'} {isUrgent && '⚠️'}
                        </span>
                      ) : (
                        <span className="text-rose-500 font-bold uppercase">{isAr ? 'منتهي الصلاحية' : 'Expired'}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legal Documents Storage Vault */}
          <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-850 space-y-4">
            <h4 className="text-xs font-black text-white flex items-center justify-end gap-1.5 pb-2 border-b border-neutral-800">
              <span>{isAr ? 'خزانة المستندات القانونية والمستندات:' : 'Legal PDF Vault (Commercial & Tax docs):'}</span>
              <Lock className="w-3.5 h-3.5 text-gold-505" />
            </h4>

            {/* upload widget */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 space-y-3.5">
              <div className="flex justify-between items-center flex-row-reverse">
                <span className="text-[10px] text-zinc-400">{isAr ? 'نوع الملف الفني:' : 'Sub-type categorizer:'}</span>
                <select 
                  value={selDocType}
                  onChange={(e) => setSelDocType(e.target.value)}
                  className="bg-neutral-900 text-[10px] text-gold-300 font-bold border border-neutral-800 p-1 rounded focus:outline-none"
                >
                  <option value="Tax Card">{isAr ? 'بطاقة ضريبية' : 'Tax Card'}</option>
                  <option value="Commercial Registry">{isAr ? 'سجل تجاري' : 'Commercial Registry'}</option>
                  <option value="Insurance Plan">{isAr ? 'ملف التأمين' : 'Insurance Certificate'}</option>
                  <option value="Civil Defense">{isAr ? 'الدفاع المدني والأمان' : 'Civil Safety'}</option>
                </select>
              </div>

              <label className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 text-[10px] text-white border border-neutral-800 hover:border-gold-505/30 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer font-bold select-none">
                <Upload className="w-3.5 h-3.5 text-gold-505" />
                <span>{simUpload ? (isAr ? 'جاري الفهرسة والتشفير...' : 'Encoding...') : (isAr ? 'رفع ملف PDF قانوني' : 'Upload Legal Copy')}</span>
                <input type="file" onChange={handleDocUploadSim} className="hidden" disabled={simUpload} />
              </label>
            </div>

            {/* List document archives */}
            <div className="divide-y divide-neutral-950 max-h-[220px] overflow-y-auto">
              {legalDocs.map(doc => (
                <div key={doc.id} className="py-2.5 flex items-center justify-between text-xs hover:bg-neutral-900/30">
                  <button 
                    onClick={() => alert(`Simulating safe download for ledger document: ${doc.name}`)}
                    className="p-1 hover:bg-neutral-900 text-gold-505 rounded cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-right">
                    <span className="font-bold text-white block text-[11px] truncate max-w-[170px]">{doc.name}</span>
                    <span className="text-[9px] text-zinc-500 font-mono block mt-0.5">{doc.type} | {doc.size}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Right Details Contract Display & Signboard Block */}
        <div className="lg:col-span-2">
          {activeContract ? (
            <div className="bg-neutral-900/60 p-5 rounded-2xl border border-neutral-850 space-y-5 text-right relative">
              
              {/* Expiration warning banner */}
              {calculateDaysLeft(activeContract.endDate) <= 30 && calculateDaysLeft(activeContract.endDate) > 0 && (
                <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl flex items-center justify-between flex-row-reverse text-right animate-pulse">
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span className="text-[10px] font-black text-rose-300">{isAr ? 'تنبيه: هذا العقد على وشك الانتهاء!' : 'WARNING: Expiration window closing soon (<30 days)!'}</span>
                  </div>
                  <strong className="text-[10px] text-rose-400 font-mono font-bold leading-none">{calculateDaysLeft(activeContract.endDate)} {isAr ? 'أيام متبقية' : 'days remain'}</strong>
                </div>
              )}

              <div className="flex justify-between items-center border-b border-neutral-800 pb-3 flex-row-reverse">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-white">{activeContract.projectName}</h3>
                  <p className="text-[10px] text-zinc-400">CLIENT: {activeContract.clientName} | {isAr ? 'نوع الصياغة:' : 'Template:'} <strong className="text-zinc-300">{activeContract.templateType}</strong></p>
                </div>
                <div className="text-left">
                  <strong className="text-gold-505 text-sm font-mono block">EGP {activeContract.amount.toLocaleString()}</strong>
                  <span className="text-[9px] text-zinc-500 font-semibold uppercase">{isAr ? 'القيمة الإجمالية للعقد' : 'Total Value'}</span>
                </div>
              </div>

              {/* Digital contract editing area */}
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-850 font-sans space-y-3 relative">
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <button 
                    onClick={() => alert('Exporting legal document copy as structural pdf...')}
                    className="p-1 hover:bg-neutral-900 text-gold-505 rounded border border-neutral-850 transition-colors"
                    title={isAr ? 'حمل الملف المعتمد بختم يافطة' : 'Download copy'}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
                <label className="text-[10px] text-gold-300 block font-bold leading-none pb-2">{isAr ? 'نصوص وملحقات البنود الإلزامية:' : 'Drafted Agreement Clauses:'}</label>
                <div className="text-xs text-zinc-300 leading-relaxed text-right p-3 bg-neutral-900/40 border border-neutral-900 rounded-lg min-h-[140px] max-h-[220px] overflow-y-auto whitespace-pre-wrap font-sans">
                  {activeContract.agreementText}
                </div>
              </div>

              {/* Timeline Stage workflow process */}
              <div className="space-y-3">
                <strong className="text-xs text-white block">{isAr ? 'مراحل مراجعة واعتماد الصياغة القانونية:' : 'Secured Lifecyle approval chain:'}</strong>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {[
                    { id: 'Draft' as const, ar: 'مسودة', en: 'Draft' },
                    { id: 'Legal Approved' as const, ar: 'فحص مالي وقانوني', en: 'Audit Passed' },
                    { id: 'Shared' as const, ar: 'أرسل للشريك', en: 'Broadcasted' },
                    { id: 'Signed' as const, ar: 'مصادقة وتوقيع', en: 'Signed' },
                    { id: 'Active' as const, ar: 'تفعيل وتشغيل', en: 'Active' }
                  ].map((stage, idx) => {
                    const isPassed = ['Draft', 'Legal Approved', 'Shared', 'Signed', 'Active'].indexOf(activeContract.approvalWorkflow) >= idx;
                    
                    return (
                      <button
                        key={stage.id}
                        disabled={!canEdit}
                        onClick={() => handleApproveStage(stage.id)}
                        className={`p-2 rounded-lg border text-[9.5px] font-bold text-center transition-all cursor-pointer ${
                          isPassed 
                            ? 'border-gold-505 bg-gold-950/20 text-gold-300' 
                            : 'border-neutral-850 hover:bg-neutral-900 bg-neutral-950 text-neutral-500'
                        }`}
                      >
                        <div className="font-black text-gold-505 text-right font-mono text-[9px]">0{idx+1}</div>
                        <div className="truncate mt-1">{isAr ? stage.ar : stage.en}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Digital/Electronic signature details */}
              {activeContract.signedBy ? (
                <div className="p-4 bg-emerald-950/20 rounded-xl border border-emerald-500/10 flex items-center gap-3.5 flex-row-reverse text-right">
                  <div className="w-9 h-9 rounded-full bg-emerald-900 border border-emerald-500 flex items-center justify-center text-emerald-300 shrink-0">
                    <FileCheck className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                      {isAr ? 'العقد ممضي ومبرم رقمياً' : 'LEGALLY APPLIED & ENCRYPTED SIGNATURE'}
                    </span>
                    <p className="text-xs text-neutral-300 font-semibold font-mono mt-1 leading-relaxed">
                      {isAr ? `توقيع الشريك المعتمد: "${activeContract.signedBy}" في ${activeContract.sigDate}` : `Printed signatory metadata: "${activeContract.signedBy}" on ${activeContract.sigDate}`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-850 flex items-center gap-3.5 flex-row-reverse text-right">
                  <div className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] bg-neutral-900 border border-neutral-850 text-neutral-400 px-2.5 py-0.5 rounded font-black uppercase tracking-wider">
                      {isAr ? 'بانتظار مصادقة وتوقيع الطرف الثاني' : 'AWAITING ELECTRONIC SIGNATORY EXECUTION'}
                    </span>
                    <p className="text-xs text-neutral-500 font-medium mt-1 leading-relaxed">
                      {isAr ? 'العقد الحالي سليم قانونياً، يمكنك تعديله أو التوقيع والموافقة آلياً بالاستفادة من الرتب المخولة.' : 'Once signature keys are typed under matching authentication guidelines, full PDF manifests are logged.'}
                    </p>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <p className="p-12 text-zinc-500 text-center font-bold">{isAr ? 'الرجاء تحديد عقد للمعاينة الفلسفية' : 'Select contract from archive menu.'}</p>
          )}
        </div>
      </div>

      {/* Creation Slide Dialog Modal */}
      {addingContract && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-lg w-full relative space-y-5 text-right">
            <h3 className="text-base font-black text-white flex items-center gap-1.5 justify-end">
              <span>{isAr ? 'صياغة بنود ومكملات اتفاق توريد جديد' : 'Formulate Supplier Contract Blueprint'}</span>
              <FileCheck className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleCreateContract} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'اسم العميل / الشريك المقرون بالعقد:' : 'Counterpart Client Name:'}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Al-Masry Restaurant"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white text-right focus:outline-none focus:border-gold-505"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'اسم وتفاصيل الهيكل الإعلاني الواقي:' : 'Project signage Name:'}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Backlit metal signage letters"
                    value={projName}
                    onChange={e => setProjName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white text-right focus:outline-none focus:border-gold-505"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'نموذج العقد وصنف الهيكل' : 'Contract supplied layout'}</label>
                  <select 
                    value={conType}
                    onChange={e => setConType(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2.5 rounded text-white font-bold"
                  >
                    <option value="Signage Fabrication">{isAr ? 'عقد تصنيع وتوريد لافتات (Signage)' : 'Signage supply contract'}</option>
                    <option value="Facade Cladding Lease">{isAr ? 'اتفاق تشييد وكساء واجهة (Cladding)' : 'Facade Cladding Agreement'}</option>
                    <option value="Premium LED Maintenance">{isAr ? 'عقد صيانة وقائية ممتدة لـ 12 شهرًا' : 'LED Maintenance agreement'}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'القيمة المالية الكلية (ج.م):' : 'Contract Total Amount EGP:'}</label>
                  <input 
                    type="number" 
                    min={100}
                    required
                    value={conAmount}
                    onChange={e => setConAmount(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-white text-right font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'تاريخ يسير العمل:' : 'Start Date:'}</label>
                  <input 
                    type="date" 
                    required
                    value={startDInput}
                    onChange={e => setStartDInput(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2 rounded text-white text-right focus:border-gold-505"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'تاريخ انقضاء العقد وعملية التسليم:' : 'End/Exp. Date:'}</label>
                  <input 
                    type="date" 
                    required
                    value={endDInput}
                    onChange={e => setEndDInput(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2 rounded text-white text-right focus:border-gold-505"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'تعديل بنود الاتفاق وتخصيص التفاصيل القانونية (اختياري):' : 'Custom legal agreement text override (optional):'}</label>
                <textarea 
                  rows={3}
                  placeholder={isAr ? 'ملاحظة: إذا تركت فارغاً، سيتم توليد الشروط الافتراضية المناسبة لنوع العقد المختار...' : 'Custom notes for supply terms...'}
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2.5 rounded text-white text-right focus:border-gold-505 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setAddingContract(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg border border-neutral-850 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 text-xs font-black rounded-lg transition-all cursor-pointer shadow-md text-neutral-905 hover:bg-gold-400"
                >
                  {isAr ? 'صياغة ونشر عقد الاتفاق' : 'Create & Share'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
