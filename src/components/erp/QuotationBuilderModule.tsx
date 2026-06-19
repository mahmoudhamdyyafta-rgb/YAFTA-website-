/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, Save, Download, Share2, Sparkles, 
  CheckCircle2, DollarSign, Calculator, ChevronRight, FileText,
  Mail, Phone, Send, Info, UserCheck, RefreshCw, FileClock, ShieldAlert
} from 'lucide-react';

interface QuoteItem {
  id: string;
  type: 'Material' | 'Labor' | 'Installation';
  descriptionAr: string;
  descriptionEn: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

interface QuoteVersion {
  id: string;
  versionCode: string;
  createdAt: string;
  items: QuoteItem[];
  status: 'Draft' | 'Internal Approved' | 'Client Pending' | 'Client Approved' | 'Client Rejected';
  totalValue: number;
  aiSuggestedPremium: number;
  signature: {
    signed: boolean;
    name: string;
    date: string;
  };
}

interface QuoteConfig {
  id: string;
  clientName: string;
  clientEmail: string;
  projectName: string;
  versions: QuoteVersion[];
  selectedVersionId: string;
}

interface Props {
  isAr: boolean;
  canEdit: boolean;
  userRole?: string;
  onPostFinance?: (amount: number, title: string, category: string) => void;
}

export default function QuotationBuilderModule({ isAr, canEdit, userRole = 'Employee', onPostFinance }: Props) {
  const [quotes, setQuotes] = useState<QuoteConfig[]>(() => {
    const saved = localStorage.getItem('yafta_quotations');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'q-1',
        clientName: 'Al-Masry Restaurant',
        clientEmail: 'info@almasry.com',
        projectName: 'Commercial Backlit Sign-box',
        selectedVersionId: 'v-1-1',
        versions: [
          {
            id: 'v-1-1',
            versionCode: 'V1 (Standard)',
            createdAt: '2026-06-18',
            status: 'Client Pending',
            totalValue: 45000,
            aiSuggestedPremium: 5000,
            signature: { signed: false, name: '', date: '' },
            items: [
              { id: 'i-1', type: 'Material', descriptionAr: 'حروف استانلس ستيل مرايا عيار 304', descriptionEn: 'Stainless steel 304 mirror finished letters', quantity: 18, unit: 'Letters', unitPrice: 1200 },
              { id: 'i-2', type: 'Material', descriptionAr: 'ليدات سامسونج كوري أصلي مع عزل هطولي IP67', descriptionEn: 'Samsung LED Korean modules waterproof', quantity: 350, unit: 'Pcs', unitPrice: 20 },
              { id: 'i-3', type: 'Labor', descriptionAr: 'برمجة تفصيلي CNC وحفر ليزر دقيق للحواف', descriptionEn: 'CNC detailing & mechanical fiber laser cutting', quantity: 24, unit: 'Hours', unitPrice: 200 },
              { id: 'i-4', type: 'Installation', descriptionAr: 'أوناش رفع هيدروليكية وحزام سلامة معلق', descriptionEn: 'Scaffolding & safe heavy lifting crane dispatch', quantity: 1, unit: 'Trip', unitPrice: 4500 }
            ]
          },
          {
            id: 'v-1-2',
            versionCode: 'V2 (Premium Gold)',
            createdAt: '2026-06-19',
            status: 'Draft',
            totalValue: 56000,
            aiSuggestedPremium: 8000,
            signature: { signed: false, name: '', date: '' },
            items: [
              { id: 'i-5', type: 'Material', descriptionAr: 'حروف استانلس مطلي تيتانيوم ذهبي فاخر عيار 304', descriptionEn: 'Titanium gold-plated luxury stainless letters 304', quantity: 18, unit: 'Letters', unitPrice: 1600 },
              { id: 'i-6', type: 'Material', descriptionAr: 'ليدات سامسونج كوري أصلي مع عزل هطولي IP67', descriptionEn: 'Samsung LED Korean modules waterproof', quantity: 400, unit: 'Pcs', unitPrice: 22 },
              { id: 'i-7', type: 'Labor', descriptionAr: 'برمجة تفصيلي CNC وحفر ليزر دقيق للحواف', descriptionEn: 'CNC detailing & mechanical fiber laser cutting', quantity: 30, unit: 'Hours', unitPrice: 220 },
              { id: 'i-8', type: 'Installation', descriptionAr: 'أوناش رفع هيدروليكية وحزام سلامة معلق', descriptionEn: 'Scaffolding & safe heavy lifting crane dispatch', quantity: 1, unit: 'Trip', unitPrice: 4500 }
            ]
          }
        ]
      },
      {
        id: 'q-2',
        clientName: 'Elite Real Estate',
        clientEmail: 'procurement@elite.com',
        projectName: 'Zayed Avenue ACP Cladding Facade',
        selectedVersionId: 'v-2-1',
        versions: [
          {
            id: 'v-2-1',
            versionCode: 'V1 (Standard)',
            createdAt: '2026-06-15',
            status: 'Client Approved',
            totalValue: 125000,
            aiSuggestedPremium: 15000,
            signature: { signed: true, name: 'Eng. Sherif Aly', date: '2026-06-16' },
            items: [
              { id: 'i-9', type: 'Material', descriptionAr: 'ألواح مجرى ألومنيوم كلادينج 4 مم مقاوم للحريق', descriptionEn: 'Aluminum Cladding Panels 4mm Fireproof Grade A', quantity: 80, unit: 'Sqm', unitPrice: 950 },
              { id: 'i-10', type: 'Labor', descriptionAr: 'تثبيت ولحام أرجون ميكانيكي للشجية الحديدية المقاومة', descriptionEn: 'Argon welding of structural heavy back iron frame', quantity: 120, unit: 'Hours', unitPrice: 250 },
              { id: 'i-11', type: 'Installation', descriptionAr: 'خدمة رافعة تلسكوبية 3 أيام مع تصاريح الطرق', descriptionEn: 'Telescopic crane hire 3 days + municipal licenses', quantity: 1, unit: 'Package', unitPrice: 19000 }
            ]
          }
        ]
      }
    ];
  });

  const [activeQuoteId, setActiveQuoteId] = useState<string>('q-1');
  const [activeVersionId, setActiveVersionId] = useState<string>('v-1-1');

  // New Quote Form
  const [newClientName, setNewClientName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);

  // New Item Row Editor Form
  const [itemType, setItemType] = useState<'Material' | 'Labor' | 'Installation'>('Material');
  const [itemDescAr, setItemDescAr] = useState('');
  const [itemDescEn, setItemDescEn] = useState('');
  const [itemQty, setItemQty] = useState<number>(1);
  const [itemUnit, setItemUnit] = useState('Pcs');
  const [itemUnitPrice, setItemUnitPrice] = useState<number>(100);

  // AI Prompt Advice
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Signature Form
  const [signName, setSignName] = useState('');
  const [typedSign, setTypedSign] = useState('');
  const [isSigningOpen, setIsSigningOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('yafta_quotations', JSON.stringify(quotes));
  }, [quotes]);

  const activeQuote = quotes.find(q => q.id === activeQuoteId) || quotes[0];
  const activeVersion = activeQuote?.versions.find(v => v.id === activeVersionId) || activeQuote?.versions[0];

  // Helper calculation
  const calculateTotals = (items: QuoteItem[]) => {
    return items.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
  };

  const currentTotal = activeVersion ? calculateTotals(activeVersion.items) : 0;

  // Sync totals
  useEffect(() => {
    if (activeQuote && activeVersion && currentTotal !== activeVersion.totalValue) {
      const updated = quotes.map(q => {
        if (q.id === activeQuote.id) {
          return {
            ...q,
            versions: q.versions.map(v => {
              if (v.id === activeVersion.id) {
                return { ...v, totalValue: currentTotal };
              }
              return v;
            })
          };
        }
        return q;
      });
      setQuotes(updated);
    }
  }, [currentTotal]);

  const triggerAIPricing = () => {
    if (!activeVersion) return;
    setIsAiLoading(true);
    setAiAnalysis(null);

    setTimeout(() => {
      const itemsCount = activeVersion.items.length;
      const materialsCost = activeVersion.items.filter(i => i.type === 'Material').reduce((s, i) => s + (i.quantity * i.unitPrice), 0);
      const laborCost = activeVersion.items.filter(i => i.type === 'Labor').reduce((s, i) => s + (i.quantity * i.unitPrice), 0);
      const instalCost = activeVersion.items.filter(i => i.type === 'Installation').reduce((s, i) => s + (i.quantity * i.unitPrice), 0);
      
      const suggestedMargin = Math.round(materialsCost * 0.35 + laborCost * 0.15 + instalCost * 0.1);
      const optimizedTotal = currentTotal + suggestedMargin;

      const commentAr = `التحليل الذكي لبيانات يافطة: تكلفة الخامات المباشرة هي %${Math.round(materialsCost / currentTotal * 100) || 0} من المقبوض. نقترح إدراج هامش وقاية %15 لتغطية فروقات أسعار الاستانلس المستورد وتعديل سعر التوريد إلى ${optimizedTotal.toLocaleString()} ج.م لربحية صافية قدرها %28.`;
      const commentEn = `YAFTA Pricing Intelligence: Direct inventory cost represents %${Math.round(materialsCost / currentTotal * 100) || 0} of aggregate budget. Recommend securing a +15% pricing markup due to imported 304 titanium steel fluctuations, optimizing price to EGP ${optimizedTotal.toLocaleString()} for a target gross margin of 28.5%.`;

      setAiAnalysis(isAr ? commentAr : commentEn);
      
      // inject suggested margin variable in state for quote version
      const updatedQuotes = quotes.map(q => {
        if (q.id === activeQuote.id) {
          return {
            ...q,
            versions: q.versions.map(v => {
              if (v.id === activeVersion.id) {
                return { ...v, aiSuggestedPremium: suggestedMargin };
              }
              return v;
            })
          };
        }
        return q;
      });
      setQuotes(updatedQuotes);
      setIsAiLoading(false);
    }, 1200);
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemDescAr || !itemDescEn || !itemQty || !itemUnitPrice) return;

    const newItem: QuoteItem = {
      id: `i-${Date.now()}`,
      type: itemType,
      descriptionAr: itemDescAr,
      descriptionEn: itemDescEn,
      quantity: itemQty,
      unit: itemUnit,
      unitPrice: itemUnitPrice
    };

    const updated = quotes.map(q => {
      if (q.id === activeQuote.id) {
        return {
          ...q,
          versions: q.versions.map(v => {
            if (v.id === activeVersion.id) {
              const nextItems = [...v.items, newItem];
              return {
                ...v,
                items: nextItems,
                totalValue: calculateTotals(nextItems)
              };
            }
            return v;
          })
        };
      }
      return q;
    });

    setQuotes(updated);
    setItemDescAr('');
    setItemDescEn('');
    setItemQty(1);
    setItemUnitPrice(100);
  };

  const handleCreateNewQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newProjectName) return;

    const newQId = `q-${Date.now()}`;
    const newVId = `v-${Date.now()}`;

    const newQuote: QuoteConfig = {
      id: newQId,
      clientName: newClientName,
      clientEmail: newClientEmail || 'client@yafta.com',
      projectName: newProjectName,
      selectedVersionId: newVId,
      versions: [
        {
          id: newVId,
          versionCode: 'V1 (Standard)',
          createdAt: new Date().toISOString().split('T')[0],
          status: 'Draft',
          totalValue: 0,
          aiSuggestedPremium: 0,
          signature: { signed: false, name: '', date: '' },
          items: []
        }
      ]
    };

    setQuotes([newQuote, ...quotes]);
    setActiveQuoteId(newQId);
    setActiveVersionId(newVId);
    setNewClientName('');
    setNewProjectName('');
    setNewClientEmail('');
    setIsCreatingQuote(false);
  };

  const handleVersionClone = () => {
    if (!activeQuote || !activeVersion) return;
    const nextVIdx = activeQuote.versions.length + 1;
    const newVId = `v-${Date.now()}`;
    
    const clonedVersion: QuoteVersion = {
      ...activeVersion,
      id: newVId,
      versionCode: `V${nextVIdx} (Revision Cloned)`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Draft',
      signature: { signed: false, name: '', date: '' }
    };

    const updated = quotes.map(q => {
      if (q.id === activeQuote.id) {
        return {
          ...q,
          versions: [...q.versions, clonedVersion]
        };
      }
      return q;
    });

    setQuotes(updated);
    setActiveVersionId(newVId);
    alert(isAr ? 'تم نسخ المخطط وتوليد نسخة تفاوضية جديدة!' : 'Cloned current version to allow structural modifications.');
  };

  const handleUpdateStatus = (status: QuoteVersion['status']) => {
    const updated = quotes.map(q => {
      if (q.id === activeQuote.id) {
        return {
          ...q,
          versions: q.versions.map(v => {
            if (v.id === activeVersion.id) {
              return { ...v, status };
            }
            return v;
          })
        };
      }
      return q;
    });
    setQuotes(updated);

    // If client approved, we option to post to finance automatically!
    if (status === 'Client Approved' && onPostFinance && activeVersion) {
      onPostFinance(activeVersion.totalValue, `Approved Quote Payment - ${activeQuote.projectName}`, 'Commercial Signage');
    }
  };

  const handleApplySignature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signName || !typedSign) return;

    const updated = quotes.map(q => {
      if (q.id === activeQuote.id) {
        return {
          ...q,
          versions: q.versions.map(v => {
            if (v.id === activeVersion.id) {
              return {
                ...v,
                status: 'Client Approved',
                signature: {
                  signed: true,
                  name: signName,
                  date: new Date().toISOString().split('T')[0]
                }
              };
            }
            return v;
          })
        };
      }
      return q;
    });

    setQuotes(updated);
    setIsSigningOpen(false);
    setSignName('');
    setTypedSign('');
    alert(isAr ? 'تمت المصادقة والتوقيع الإلكتروني على العقد المالي بنجاح!' : 'Electronic signature computed & recorded successfully!');
  };

  const handleDeleteItem = (itemId: string) => {
    const updated = quotes.map(q => {
      if (q.id === activeQuote.id) {
        return {
          ...q,
          versions: q.versions.map(v => {
            if (v.id === activeVersion.id) {
              const filtered = v.items.filter(i => i.id !== itemId);
              return {
                ...v,
                items: filtered,
                totalValue: calculateTotals(filtered)
              };
            }
            return v;
          })
        };
      }
      return q;
    });
    setQuotes(updated);
  };

  const shareWhatsApp = () => {
    if (!activeQuote || !activeVersion) return;
    const itemsDescription = activeVersion.items.map(i => `• ${isAr ? i.descriptionAr : i.descriptionEn} (x${i.quantity})`).join('%0A');
    const msg = isAr 
      ? `تحية طيبة متبعة من وكالة يافطة للدعاية والإعلان.%0Aتجدون أدناه تفاصيل عروض السعر الخاص بمشروعكم المقترح: *${activeQuote.projectName}*%0Aالنسخة: *${activeVersion.versionCode}*%0Aالتفاصيل المادية والمصنعية:%0A${itemsDescription}%0Aالقيمة الكلية: *${activeVersion.totalValue.toLocaleString()} ج.م*%0Aيرجى المراجعة وتأكيد الاعتماد أو كتابة التعديل التعاقدي المطلق.`
      : `Dear Partner, here are the official pricing specifications from YAFTA Signage for your project: *${activeQuote.projectName}*%0ARevision: *${activeVersion.versionCode}*%0AItemized breakdowns:%0A${itemsDescription}%0ANet Total: *EGP ${activeVersion.totalValue.toLocaleString()}*%0APlease verify to complete formal contract sign off.`;

    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const triggerPDFSim = () => {
    alert(isAr ? 'توليد المظهر الفني والتصدير كـ PDF المعتمد!' : 'Simulating certified PDF compilation...');
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeVersion, null, 2));
    link.download = `YAFTA_Quote_${activeQuote.projectName.replace(/\s+/g, '_')}_${activeVersion.versionCode}.json`;
    link.click();
  };

  const permissions = {
    approve: userRole === 'Admin' || userRole === 'Super Admin' || userRole === 'Manager',
    edit: userRole === 'Admin' || userRole === 'Super Admin' || userRole === 'Employee',
    clientSign: userRole === 'Client' || userRole === 'Admin' || userRole === 'Super Admin'
  };

  return (
    <div className="bg-neutral-950 p-6 rounded-2xl border border-gold-505/20 text-right font-sans grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Side list of active quotes */}
      <div className="lg:col-span-1 border-l border-neutral-900 pl-4 space-y-4">
        <div className="flex justify-between items-center flex-row-reverse pb-2 border-b border-neutral-900">
          <h4 className="text-sm font-black text-white">{isAr ? 'العقود وعروض الأسعار' : 'Signage Quotes'}</h4>
          {permissions.edit && (
            <button 
              onClick={() => setIsCreatingQuote(true)}
              className="p-1 bg-gold-505 rounded text-black hover:bg-gold-400 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {isCreatingQuote && (
          <form onSubmit={handleCreateNewQuote} className="p-3 bg-neutral-900 rounded-lg space-y-3">
            <div>
              <input 
                type="text" 
                required
                placeholder={isAr ? 'اسم الشريك/العميل' : 'Client Name'} 
                value={newClientName}
                onChange={e => setNewClientName(e.target.value)}
                className="w-full bg-neutral-950 text-xs border border-gold-505/20 rounded p-2 focus:border-gold-505 text-right font-sans"
              />
            </div>
            <div>
              <input 
                type="text" 
                required
                placeholder={isAr ? 'اسم المشروع التجاري' : 'Project Name'} 
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                className="w-full bg-neutral-950 text-xs border border-gold-505/20 rounded p-2 focus:border-gold-505 text-right font-sans"
              />
            </div>
            <div>
              <input 
                type="email" 
                placeholder={isAr ? 'البريد الإلكتروني' : 'Contact Email'} 
                value={newClientEmail}
                onChange={e => setNewClientEmail(e.target.value)}
                className="w-full bg-neutral-950 text-xs border border-gold-505/20 rounded p-2 focus:border-gold-505 text-right font-sans"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                type="button" 
                onClick={() => setIsCreatingQuote(false)} 
                className="px-2 py-1 bg-neutral-800 text-[10px] text-zinc-400 rounded cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                type="submit" 
                className="px-2.5 py-1 bg-gold-505 text-neutral-950 font-black text-[10px] rounded cursor-pointer"
              >
                {isAr ? 'تهيئة' : 'Build'}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3.5 max-h-[450px] overflow-y-auto">
          {quotes.map(q => (
            <button
              key={q.id}
              onClick={() => {
                setActiveQuoteId(q.id);
                setActiveVersionId(q.selectedVersionId || q.versions[0].id);
              }}
              className={`w-full text-right p-3 rounded-xl border transition-all text-xs flex flex-col gap-1.5 cursor-pointer ${
                activeQuoteId === q.id
                  ? 'border-gold-505 bg-gold-950/20'
                  : 'border-neutral-900 bg-neutral-900/40 hover:bg-neutral-900'
              }`}
            >
              <div className="flex justify-between items-center w-full flex-row-reverse">
                <span className="font-extrabold text-white text-right truncate max-w-[120px]">{q.clientName}</span>
                <span className="text-[10px] text-gold-300 font-mono font-bold bg-neutral-900 px-1.5 py-0.5 rounded">
                  {q.versions.length} {isAr ? 'نسخ' : 'Rev'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 truncate w-full">{q.projectName}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main calculation details editor */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Quote details header */}
        {activeQuote && activeVersion ? (
          <div className="bg-neutral-900/60 p-5 rounded-2xl border border-neutral-850 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 flex-row-reverse border-b border-neutral-800 pb-4">
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span className={`px-2 py-0.5 text-[9px] font-black rounded border ${
                    activeVersion.status === 'Client Approved' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/20' :
                    activeVersion.status === 'Draft' ? 'bg-neutral-800 text-zinc-400 border-neutral-700' :
                    activeVersion.status === 'Client Pending' ? 'bg-blue-950 text-blue-300 border-blue-500/20' :
                    'bg-red-950 text-red-200 border-red-500/30'
                  }`}>
                    {activeVersion.status}
                  </span>
                  <h3 className="text-base font-black text-white">{activeQuote.projectName}</h3>
                </div>
                <p className="text-xs text-neutral-300 font-mono">{activeQuote.clientName} ({activeQuote.clientEmail}) | {isAr ? 'تاريخ التحديث:' : 'Updated:'} {activeVersion.createdAt}</p>
              </div>

              {/* Version picker */}
              <div className="flex gap-2 flex-wrap items-center">
                <div className="bg-neutral-950 border border-neutral-800 px-2.5 py-1.5 rounded-lg flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500">{isAr ? 'النسخة:' : 'Version:'}</span>
                  <select 
                    value={activeVersionId}
                    onChange={e => {
                      setActiveVersionId(e.target.value);
                      const clonedQuotes = quotes.map(q => {
                        if (q.id === activeQuote.id) {
                          return { ...q, selectedVersionId: e.target.value };
                        }
                        return q;
                      });
                      setQuotes(clonedQuotes);
                    }}
                    className="bg-transparent text-xs text-gold-505 font-bold focus:outline-none cursor-pointer"
                  >
                    {activeQuote.versions.map(v => (
                      <option key={v.id} value={v.id} className="bg-neutral-950 text-white">{v.versionCode}</option>
                    ))}
                  </select>
                </div>

                {permissions.edit && (
                  <button 
                    onClick={handleVersionClone}
                    className="p-2 bg-neutral-950 border border-neutral-800 hover:border-gold-505 text-neutral-400 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    title={isAr ? 'استنساخ لتوليد نسخة جديدة' : 'Clone Revision'}
                  >
                    <FileClock className="w-3.5 h-3.5" />
                    <span className="text-[10px]">{isAr ? 'استنساخ' : 'Clone'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Matrix item list of material + labor + assembly computations */}
            <div className="space-y-4">
              <div className="flex justify-between items-center flex-row-reverse pt-2">
                <strong className="text-xs text-gold-300 font-black">{isAr ? 'العناصر والتفاصيل الحسابية للوحات والمعاينة:' : 'Dynamic Itemization Breakdowns:'}</strong>
                <span className="text-[10px] text-zinc-500">{activeVersion.items.length} {isAr ? 'عناصر مسجلة' : 'items total'}</span>
              </div>

              <div className="divide-y divide-neutral-900 border border-neutral-850 rounded-xl overflow-hidden bg-neutral-950/40">
                {activeVersion.items.length === 0 ? (
                  <p className="p-6 text-xs text-neutral-500 text-center">{isAr ? 'لا يوجد حسابات حالياً، يرجى تعبيد العناصر بالأسفل' : 'No cost items recorded. Use builder below.'}</p>
                ) : (
                  activeVersion.items.map(item => (
                    <div key={item.id} className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-neutral-900/30 transition-colors text-right">
                      <div className="flex gap-2 w-full sm:w-auto items-center justify-end">
                        <div className="text-left font-mono pr-4 shrink-0">
                          <span className="text-neutral-500 text-[10px] block">{item.quantity} x {item.unitPrice.toLocaleString()} ج.م</span>
                          <strong className="text-white text-xs block">{(item.quantity * item.unitPrice).toLocaleString()} ج.م</strong>
                        </div>
                        {permissions.edit && (
                          <button 
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 bg-rose-950/10 border border-rose-500/10 hover:border-rose-500 text-rose-400 rounded cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-1 w-full sm:w-auto text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase rounded ${
                            item.type === 'Material' ? 'bg-yellow-950 text-gold-300' :
                            item.type === 'Labor' ? 'bg-blue-950 text-blue-300' : 'bg-purple-950 text-purple-300'
                          }`}>
                            {isAr ? (item.type === 'Material' ? 'خامات' : item.type === 'Labor' ? 'مصنعية' : 'تركيب ميكانيكي') : item.type}
                          </span>
                          <strong className="text-xs text-white block">{isAr ? item.descriptionAr : item.descriptionEn}</strong>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Grand Total Display */}
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-850 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-2 flex-wrap justify-center w-full sm:w-auto">
                  <button 
                    onClick={triggerPDFSim}
                    className="p-2 border border-neutral-800 hover:border-gold-505 text-zinc-400 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                  <button 
                    onClick={shareWhatsApp}
                    className="p-2 border border-neutral-800 hover:border-gold-505 text-zinc-400 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  {/* Actions for Approve or Signature */}
                  {permissions.approve && activeVersion.status !== 'Client Approved' && (
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => handleUpdateStatus('Client Approved')}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-lg cursor-pointer"
                      >
                        {isAr ? 'اعتماد كلي للمشروع' : 'Internal Approve'}
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus('Client Rejected')}
                        className="px-3 py-2 bg-rose-950 border border-rose-500/20 text-rose-300 text-[10px] font-black rounded-lg cursor-pointer"
                      >
                        {isAr ? 'رفض' : 'Reject'}
                      </button>
                    </div>
                  )}

                  {permissions.clientSign && !activeVersion.signature.signed && (
                    <button 
                      onClick={() => setIsSigningOpen(true)}
                      className="px-4 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black text-[10px] font-black rounded-lg hover:scale-103 cursor-pointer shadow-md"
                    >
                      🖋️ {isAr ? 'التوقيع الإلكتروني بالعقد' : 'Digital Sign Off'}
                    </button>
                  )}
                </div>

                <div className="text-right space-y-1">
                  <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">{isAr ? 'إجمالي الموازنة المصنعية والخامات:' : 'Total Cost Calculation:'}</span>
                  <div className="flex items-baseline gap-1 justify-end">
                    <strong className="text-2xl font-black text-gold-505 font-mono">{activeVersion.totalValue.toLocaleString()}</strong>
                    <span className="text-xs text-neutral-400">{isAr ? 'ج.م' : 'EGP'}</span>
                  </div>
                  {activeVersion.aiSuggestedPremium > 0 && (
                    <span className="text-[9px] text-emerald-400 font-semibold block">
                      {isAr ? `هامش أمان مستند من الذكاء الاصطناعي: +${activeVersion.aiSuggestedPremium.toLocaleString()} ج.م` : `AI Safetynet premium suggestion active: +EGP ${activeVersion.aiSuggestedPremium.toLocaleString()}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Optional Electronic Signature display block */}
              {activeVersion.signature.signed && (
                <div className="p-4 bg-emerald-950/20 rounded-xl border border-emerald-500/10 flex items-center gap-3 flex-row-reverse text-right">
                  <div className="w-8 h-8 rounded-full bg-emerald-900 border border-emerald-500 flex items-center justify-center text-emerald-300">
                    <CheckCircle2 className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                      {isAr ? 'تعميد مالي رقمي مبرم بنجاح' : 'CONTRACTUALLY SIGNED & EXECUTED'}
                    </span>
                    <p className="text-xs text-neutral-300 font-semibold font-mono mt-1">
                      {isAr ? `موقع آلياً بواسطة الشريك: ${activeVersion.signature.name} في ${activeVersion.signature.date}` : `Signed Digitally by: ${activeVersion.signature.name} on ${activeVersion.signature.date}`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Smart AI pricing suggestions assistant widget */}
            <div className="p-4 bg-neutral-950 rounded-xl border border-gold-505/10 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center flex-row-reverse">
                <div className="flex items-center gap-1.5 flex-row-reverse">
                  <div className="p-1 px-2.5 bg-gold-950 text-gold-300 border border-gold-500/30 text-[9px] font-black uppercase rounded-lg animate-pulse flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAr ? 'يافطة الذكاء الاصطناعي' : 'YAFTA COGNITIVE'}</span>
                  </div>
                  <h4 className="text-xs font-black text-white">{isAr ? 'مساعد الأسعار والتنبؤ الذكي بالأرباح' : 'AI Pricing Oracle'}</h4>
                </div>
                <button 
                  onClick={triggerAIPricing}
                  disabled={isAiLoading}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-[10px] text-white hover:text-gold-505 border border-neutral-850 font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  {isAiLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Calculator className="w-3 h-3" />}
                  <span>{isAr ? 'حساب الهامش الأمثل' : 'Compute Optimal Markup'}</span>
                </button>
              </div>

              {aiAnalysis && (
                <div className="p-3 bg-gold-950/20 border border-gold-500/10 rounded-lg text-xs leading-relaxed text-zinc-300 speech-balloon">
                  {aiAnalysis}
                </div>
              )}
            </div>

            {/* ADD ROW BUILDER FORM FOR EDITORS */}
            {permissions.edit && (
              <form onSubmit={handleAddNewItem} className="p-4 bg-neutral-950 rounded-xl border border-neutral-850 space-y-4">
                <strong className="text-xs text-white block">{isAr ? 'إدراج بند مالي جديد في عروض الأسعار:' : 'Add Custom Line Calculation:'}</strong>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'نوع البند الحسابي' : 'Item Type'}</label>
                    <select 
                      value={itemType}
                      onChange={e => setItemType(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2 rounded text-white font-bold"
                    >
                      <option value="Material">{isAr ? 'خامات ومواد التجزئة' : 'Materials / Inventory'}</option>
                      <option value="Labor">{isAr ? 'عمالة ومصنعية الورش' : 'Labor fabrication'}</option>
                      <option value="Installation">{isAr ? 'أوناش وتركيبات المواقع' : 'Site installation crane'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'الكمية' : 'Quantity'}</label>
                    <input 
                      type="number" 
                      min={1}
                      required
                      value={itemQty}
                      onChange={e => setItemQty(Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2 rounded text-white text-right font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'سعر الوحدة (ج.م)' : 'Unit Price (EGP)'}</label>
                    <input 
                      type="number" 
                      min={1}
                      required
                      value={itemUnitPrice}
                      onChange={e => setItemUnitPrice(Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2 rounded text-white text-right font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'البيان والتفاصيل الفنية (عربي)' : 'Technical Description (AR)'}</label>
                    <input 
                      type="text" 
                      required
                      placeholder="ليدات كورية 1.5 وات"
                      value={itemDescAr}
                      onChange={e => setItemDescAr(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2 rounded text-white text-right font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'البيان والتفاصيل الفنية (إنجليزي)' : 'Technical Description (EN)'}</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Samsung led modules 1.5W"
                      value={itemDescEn}
                      onChange={e => setItemDescEn(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2 rounded text-white text-left font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center flex-row-reverse">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-zinc-500 pr-1">{isAr ? 'الوحدة القياسية:' : 'Measure unit:'}</span>
                    <input 
                      type="text" 
                      placeholder="Pcs"
                      value={itemUnit}
                      onChange={e => setItemUnit(e.target.value)}
                      className="bg-neutral-900 text-xs text-white border border-neutral-800 px-2 py-1 rounded max-w-[80px] font-mono text-center"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-gold-505 hover:bg-gold-400 text-black text-xs font-black rounded-lg transition-colors cursor-pointer"
                  >
                    {isAr ? 'أضف البند إلى عروض الأسعار ➕' : 'Insert Line ➕'}
                  </button>
                </div>
              </form>
            )}

          </div>
        ) : (
          <p className="text-sm text-neutral-400 text-center font-bold p-12">{isAr ? 'يرجى اختيار عرض سعر أو تهيئة واحد جديد' : 'Choose quotation template from the left directory bracket.'}</p>
        )}

      </div>

      {/* Signature dialogue Modal */}
      {isSigningOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-55">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-md w-full relative space-y-6 text-right">
            <h3 className="text-base font-black text-white flex items-center gap-1.5 justify-end">
              <span>{isAr ? 'المصادقة والتوقيع الإلكتروني بالعقود' : 'Compute secure cryptographic signature'}</span>
              <UserCheck className="w-5 h-5 text-gold-505" />
            </h3>

            <p className="text-xs text-neutral-400 leading-relaxed">
              {isAr ? 'من خلال التوقيع بالأسفل، يتم اعتماد وتعميد عروض الأسعار الحالية وتقرير الميزانية كمستند رسمي بإنتاج المصانع التابعة ليافطة.' : 'By inputting authorization credentials below, the system commits current quotation line items to assembly floor lists and posts financial journals.'}
            </p>

            <form onSubmit={handleApplySignature} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'الاسم الثلاثي المعتمد للشهود:' : 'Full Legal Printed Name:'}</label>
                <input 
                  type="text" 
                  required
                  placeholder={isAr ? 'أحمد محمود سليمان' : 'Printed Signature'}
                  value={signName}
                  onChange={e => setSignName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-gold-505 rounded-lg p-2.5 text-xs text-white focus:outline-none text-right font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'توقيع كتابي للمصادقة:' : 'Computed signature string:'}</label>
                <input 
                  type="text" 
                  required
                  placeholder={isAr ? 'توقيع: أ.م.س' : 'e.g. Signature encrypted'}
                  value={typedSign}
                  onChange={e => setTypedSign(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-gold-505 rounded-lg p-2.5 text-xs text-white focus:outline-none text-left font-mono"
                />
              </div>

              {/* Simulated Sketch Canvas box */}
              <div className="border border-dashed border-zinc-800 rounded-lg p-6 bg-neutral-950 text-center select-none cursor-crosshair">
                <span className="text-[10px] text-zinc-500 font-bold block">{isAr ? 'ارسم توقيعك هنا بالماوس/اللمس' : 'Signature Drawbox simulation - Active'}</span>
                <div className="h-10 mt-3 flex justify-center items-center">
                  <span className="text-gold-505 font-serif text-lg tracking-widest italic">{typedSign || 'YAFTA'}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsSigningOpen(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg border border-neutral-850 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-955 text-xs font-black rounded-lg transition-all cursor-pointer shadow-md text-neutral-905 text-neutral-950"
                >
                  {isAr ? 'توقيع ومصادقة مستندات يافطة' : 'Sign Internally'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
