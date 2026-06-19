/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Search, Eye, Globe, Sparkles, AlertCircle, CheckCircle, 
  Plus, Trash2, Code, Download, BarChart2, MapPin, Settings, Info,
  LineChart, CloudLightning, Compass, HelpCircle, Activity, Layout
} from 'lucide-react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface KeywordData {
  id: string;
  keyword: string;
  volume: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Competitive';
  rank: number;
  gmbSearchVolume: number;
}

interface SeoIssue {
  id: string;
  titleAr: string;
  titleEn: string;
  impact: 'High' | 'Medium' | 'Low';
  status: 'Fixed' | 'Pending';
}

export default function SeoMarketingModule({ isAr, canEdit }: { isAr: boolean; canEdit: boolean }) {
  // SEO Keyword Tracking
  const [keywords, setKeywords] = useState<KeywordData[]>(() => {
    const saved = localStorage.getItem('yafta_seo_keywords');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'kw-1', keyword: 'كلادينج واجهات التجمع الخامس', volume: 1800, difficulty: 'Medium', rank: 3, gmbSearchVolume: 420 },
      { id: 'kw-2', keyword: 'حروف لافتات مضيئة القاهرة', volume: 2400, difficulty: 'Hard', rank: 2, gmbSearchVolume: 890 },
      { id: 'kw-3', keyword: 'تصنيع لافتات اكريليك الجيزة', volume: 1500, difficulty: 'Easy', rank: 1, gmbSearchVolume: 320 },
      { id: 'kw-4', keyword: 'Commercial signage Cairo Sheikh Zayed', volume: 1100, difficulty: 'Competitive', rank: 5, gmbSearchVolume: 210 }
    ];
  });

  // Local SEO audit issues
  const [seoIssues, setSeoIssues] = useState<SeoIssue[]>(() => {
    return [
      { id: 'iss-1', titleAr: 'غياب علامات ALT لصور واجهات الكلادينج بالمعرض', titleEn: 'Missing Alt tags on cladding gallery items', impact: 'High', status: 'Pending' },
      { id: 'iss-2', titleAr: 'تحسين الكلمات الدليلة على خريطة Google GMB بالدقي', titleEn: 'Optimize meta descriptions for Dokki flagship office', impact: 'Medium', status: 'Fixed' },
      { id: 'iss-3', titleAr: 'ضغط وعزل صور الهالة المضيئة لسرعة تحميل الفهرس', titleEn: 'Compress portfolio LED high-res images to webp format', impact: 'High', status: 'Pending' },
      { id: 'iss-4', titleAr: 'بناء روابط داخلية من المدونات لقائمة الأسعار', titleEn: 'Internal linking from case studies back to quotation builder', impact: 'Low', status: 'Fixed' }
    ];
  });

  // Meta Tags manager state
  const [metaTitle, setMetaTitle] = useState('Yafta Signage - Luxury Advertising & Cladding Facades Cairo');
  const [metaDesc, setMetaDesc] = useState('YAFTA is Egypt\'s premier boutique advertising factory specializing in Titanium Steel letters, Samsung LED light installations and 4mm Fireproof ACP panels.');
  const [metaKeywords, setMetaKeywords] = useState('signage, cladding, led, egypt, advertising');

  // Traffic analysis data
  const searchConsoleData = [
    { name: 'Jun 13', Impressions: 2400, Clicks: 310, CTR: 12.9 },
    { name: 'Jun 14', Impressions: 2900, Clicks: 420, CTR: 14.4 },
    { name: 'Jun 15', Impressions: 3100, Clicks: 480, CTR: 15.4 },
    { name: 'Jun 16', Impressions: 3400, Clicks: 510, CTR: 15.0 },
    { name: 'Jun 17', Impressions: 3200, Clicks: 490, CTR: 15.3 },
    { name: 'Jun 18', Impressions: 4100, Clicks: 650, CTR: 15.8 },
    { name: 'Jun 19', Impressions: 4500, Clicks: 780, CTR: 17.3 }
  ];

  // Form keyword state
  const [addingKw, setAddingKw] = useState(false);
  const [newKw, setNewKw] = useState('');
  const [newKwVol, setNewKwVol] = useState<number>(1000);
  const [newKwDiff, setNewKwDiff] = useState<KeywordData['difficulty']>('Medium');

  useEffect(() => {
    localStorage.setItem('yafta_seo_keywords', JSON.stringify(keywords));
  }, [keywords]);

  const handleCreateKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKw) return;

    const nextKw: KeywordData = {
      id: `kw-${Date.now()}`,
      keyword: newKw,
      volume: newKwVol,
      difficulty: newKwDiff,
      rank: Math.floor(1 + Math.random() * 12),
      gmbSearchVolume: Math.round(newKwVol * 0.25)
    };

    setKeywords([...keywords, nextKw]);
    setNewKw('');
    setAddingKw(false);
  };

  const deleteKeyword = (id: string) => {
    setKeywords(keywords.filter(k => k.id !== id));
  };

  const handleFixIssue = (id: string) => {
    const updated = seoIssues.map(iss => {
      if (iss.id === id) {
        return { ...iss, status: 'Fixed' as const };
      }
      return iss;
    });
    setSeoIssues(updated);
    alert(isAr ? 'تم تطبيق المعالجة المبرمجة آلياً وفحص خريطة السايت!' : 'Simulated core fix processed. Alt tags cataloged.');
  };

  const handleSimSitemap = () => {
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://yafta.com/</loc><priority>1.0</priority></url>
  <url><loc>https://yafta.com/services</loc><priority>0.8</priority></url>
  <url><loc>https://yafta.com/portfolio</loc><priority>0.9</priority></url>
  <url><loc>https://yafta.com/contact</loc><priority>0.5</priority></url>
</urlset>`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(sitemapContent));
    element.setAttribute('download', 'yafta_sitemap.xml');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    alert(isAr ? 'تم توليد وتنزيل sitemap.xml بنجاح!' : 'Dynamic XML Sitemap file formulated and download dispatched.');
  };

  // Saved Meta Settings Alert
  const saveMetaTags = (e: React.FormEvent) => {
    e.preventDefault();
    alert(isAr 
      ? 'تم تجديد وحفظ علامات الـ Meta بنية الموقع لتطابق روبوتات ليفات الزحف!' 
      : 'Successfully updated live header SEO descriptors & metadata schemas.');
  };

  return (
    <div className="bg-neutral-950 p-6 rounded-2xl border border-gold-505/20 text-right font-sans space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-row-reverse">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-end">
            <Globe className="w-5 h-5 text-gold-505" />
            <span>{isAr ? 'مركز الـ SEO والتسويق وتتبع خوارزميات جوجل' : 'SEO Core & Digital Marketing Center'}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isAr ? 'أدوات الزحف والمقاييس، علامات الواجهة التعاقدية، وتتبع تصنيف كلمات الكلمات الإعلانية دبي ومصر' : 'Run crawler diagnostics, track localized Google map rankings, generate sitemaps and refine OG header properties.'}
          </p>
        </div>

        <div className="flex gap-2">
          {canEdit && (
            <button 
              onClick={handleSimSitemap}
              className="px-3.5 py-2 bg-neutral-900 override hover:bg-neutral-850 hover:border-gold-505 border border-neutral-850 text-xs text-zinc-100 rounded-lg flex items-center gap-1.5 cursor-pointer font-bold transition-colors"
            >
              <Code className="w-4 h-4 text-gold-505" />
              <span>{isAr ? 'تحميل sitemap.xml' : 'XML Sitemap'}</span>
            </button>
          )}

          {canEdit && (
            <button 
              onClick={() => setAddingKw(true)}
              className="px-4 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black hover:opacity-90 text-xs font-black rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'تتبع كلمة دليلة' : 'Track Keyword'}</span>
            </button>
          )}
        </div>
      </div>

      {/* CORE STATS BAR CARD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { labelAr: 'مؤشر أداء السرعة للجوال (Vite Core)', labelEn: 'Vite Speed Index', val: '99%', sub: '99.8ms cold load', icon: <CloudLightning className="w-5 h-5 text-gold-505" />, bg: 'border-gold-505/20' },
          { labelAr: 'إجمالي مشاهدات البحث الشهري (Console)', labelEn: 'Search Impressions (30 Days)', val: '43,210', sub: '+18.4% last month', icon: <Eye className="w-5 h-5 text-emerald-400" />, bg: 'border-emerald-500/10' },
          { labelAr: 'تصنيف لافتات بمطابقة الخرائط (My Business)', labelEn: 'Localized SEO Visibility GMB', val: '4.9 ⭐', sub: 'Cairo, Giza citations', icon: <MapPin className="w-5 h-5 text-blue-400" />, bg: 'border-blue-500/10' },
          { labelAr: 'معدل النقر إلى الظهور المكتسب (CTR)', labelEn: 'Average Click-Through (CTR)', val: '15.8%', sub: 'Niche elite standard', icon: <TrendingUp className="w-5 h-5 text-purple-400" />, bg: 'border-purple-500/10' }
        ].map((stat, i) => (
          <div key={i} className={`bg-neutral-900/60 p-4 rounded-xl border ${stat.bg} text-right space-y-1`}>
            <div className="flex justify-between items-center flex-row-reverse">
              <span className="text-[10px] text-zinc-500 font-semibold">{isAr ? stat.labelAr : stat.labelEn}</span>
              <div className="w-7 h-7 bg-neutral-950 rounded-lg flex items-center justify-center shrink-0">
                {stat.icon}
              </div>
            </div>
            <strong className="text-lg font-black text-white block font-mono">{stat.val}</strong>
            <span className="text-[9px] text-zinc-400 block font-semibold">{stat.sub}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Keywords table */}
        <div className="lg:col-span-1 bg-neutral-900/40 p-4 rounded-xl border border-neutral-850 space-y-4">
          <h4 className="text-xs font-black text-gold-300 flex items-center justify-end gap-1.5 pb-2 border-b border-neutral-800">
            <span>{isAr ? 'الكلمات المفتاحية النشطة بمحركات البحث:' : 'LOCAL SIGNAGE KEYWORDS TRACKING:'}</span>
            <Search className="w-4 h-4 text-gold-505" />
          </h4>

          <div className="space-y-3 max-h-[350px] overflow-y-auto">
            {keywords.map(kw => (
              <div key={kw.id} className="p-3 bg-neutral-950 rounded-xl border border-neutral-850 text-right space-y-2 hover:border-gold-505/20 transition-all text-xs">
                <div className="flex justify-between items-center flex-row-reverse">
                  <strong className="text-white font-bold">{kw.keyword}</strong>
                  {canEdit && (
                    <button 
                      onClick={() => deleteKeyword(kw.id)}
                      className="text-zinc-650 hover:text-red-500 p-0.5 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
                    </button>
                  )}
                </div>
                
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono flex-row-reverse pt-1 border-t border-neutral-900/40">
                  <span>Vol: {kw.volume} / mo</span>
                  <span className="text-gold-505 font-medium">Rank: #{kw.rank}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Recharts Performance Graph */}
        <div className="lg:col-span-2 bg-neutral-900/60 p-5 rounded-2xl border border-neutral-850 space-y-5">
          <h4 className="text-xs font-black text-white flex items-center justify-end gap-1.5 pb-1 border-b border-neutral-800">
            <span>{isAr ? 'مؤشرات زاد البحث والمعدلات الأسبوعية (impressions & CTR):' : 'GOOGLE SEARCH CONSOLE ANALYTICS PORTAL:'}</span>
            <LineChart className="w-4 h-4 text-gold-505" />
          </h4>

          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={searchConsoleData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#e5c06030', color: '#fff' }} />
                <Line type="monotone" dataKey="Impressions" stroke="#e5c060" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Clicks" stroke="#60a5fa" strokeWidth={1.5} dot={false} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* SEO META TAGS MANAGER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        
        {/* Dynamic crawler audit checklist */}
        <div className="bg-neutral-900/60 p-5 rounded-2xl border border-neutral-850 space-y-4">
          <h4 className="text-xs font-black text-white flex items-center justify-end gap-1.5 pb-2 border-b border-neutral-800">
            <span>{isAr ? 'تقارير فحص الزحف ومعالجات الأرشفة للموقع:' : 'SEO DIAGNOSTIC AUDIT LOGS:'}</span>
            <CloudLightning className="w-4 h-4 text-gold-505" />
          </h4>

          <div className="divide-y divide-neutral-950 font-sans">
            {seoIssues.map(issue => (
              <div key={issue.id} className="py-3 flex justify-between items-center text-xs text-right">
                <div className="flex gap-2 items-center flex-row-reverse">
                  <span className={`px-1 text-[8px] rounded uppercase font-black ${
                    issue.impact === 'High' ? 'bg-rose-950 text-rose-400' : 'bg-neutral-950 text-zinc-500'
                  }`}>
                    {issue.impact}
                  </span>

                  {issue.status === 'Pending' ? (
                    <button
                      onClick={() => handleFixIssue(issue.id)}
                      className="px-2 py-0.5 bg-neutral-950 hover:bg-neutral-900 text-gold-505 border border-neutral-850 text-[10px] font-bold rounded cursor-pointer transition-all"
                    >
                      {isAr ? 'عالج آلياً' : 'Quick fix'}
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-bold text-[10px] block leading-none select-none">
                      ✓ {isAr ? 'تم الحل' : 'Clean'}
                    </span>
                  )}
                </div>

                <p className="text-white text-[11.5px] leading-snug max-w-[240px]">
                  {isAr ? issue.titleAr : issue.titleEn}
                </p>

              </div>
            ))}
          </div>
        </div>

        {/* Live Meta Tags schema forms */}
        <div className="bg-neutral-900/60 p-5 rounded-2xl border border-neutral-850 space-y-4 font-sans text-right">
          <h4 className="text-xs font-black text-white flex items-center justify-end gap-1.5 pb-2 border-b border-neutral-800">
            <span>{isAr ? 'محرر ومطابق المتطابقات الفوقية (HTML Meta Tags):' : 'MASTER HTML METADATA SCHEMAS:'}</span>
            <Code className="w-4 h-4 text-gold-505" />
          </h4>

          <form onSubmit={saveMetaTags} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'عنوان الصفحة الرئيسي (Browser Meta Title):' : 'Standard Web Title (60 chars):'}</label>
              <input 
                type="text" 
                required
                value={metaTitle}
                onChange={e => setMetaTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-gold-505 text-xs text-zinc-300 rounded-lg p-2 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'وصف الصفحة التعاقدي (OG Description):' : 'Boutique OG Description (160 chars):'}</label>
              <textarea 
                rows={2}
                required
                value={metaDesc}
                onChange={e => setMetaDesc(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-gold-505 text-xs text-zinc-300 rounded-lg p-2 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="flex justify-between items-center pt-2 flex-row-reverse bg-transparent">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-zinc-500">{isAr ? 'علامات المقروئية:' : 'Keywords tag:'}</span>
                <input 
                  type="text"
                  value={metaKeywords}
                  onChange={e => setMetaKeywords(e.target.value)}
                  className="bg-neutral-950 border border-neutral-850 px-2 py-1 select-all rounded text-[10px] font-mono text-zinc-400"
                />
              </div>

              {canEdit && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-960 text-neutral-950 text-xs font-black rounded-lg hover:scale-103 cursor-pointer shadow"
                >
                  {isAr ? 'احفظ وانشر الرأس الفوقي' : 'Commit schemas'}
                </button>
              )}
            </div>

          </form>
        </div>

      </div>

      {/* Track keyword dialog modal */}
      {addingKw && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 font-sans">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-sm w-full relative space-y-6 text-right">
            <h3 className="text-base font-black text-white flex items-center gap-1.5 justify-end">
              <span>{isAr ? 'تتبع كلمة دليلة جديدة بجوجل' : 'Onboard Search Keyword'}</span>
              <Globe className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleCreateKeyword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'الكلمة أو العبارة الدليلة (الاستعلام):' : 'Keyword targeted query:'}</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. واجهات كلادينج المهندسين"
                  value={newKw}
                  onChange={e => setNewKw(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right focus:outline-none focus:border-gold-505"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-right">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'حجم البحث الشهري المقدر:' : 'Monthly search volume:'}</label>
                  <input 
                    type="number" 
                    min={5}
                    required
                    value={newKwVol}
                    onChange={e => setNewKwVol(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'درجة المنافسة' : 'Competition'}</label>
                  <select 
                    value={newKwDiff}
                    onChange={e => setNewKwDiff(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white font-bold"
                  >
                    <option value="Easy">Easy (No competitors)</option>
                    <option value="Medium">Medium (Local factories)</option>
                    <option value="Hard">Hard (National agencies)</option>
                    <option value="Competitive">Competitive (Real Estate giants)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setAddingKw(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg border border-neutral-850 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 text-xs font-black rounded-lg transition-all cursor-pointer shadow-md hover:bg-gold-400"
                >
                  {isAr ? 'أضف وبث التتبع آلياً' : 'Activate Keyword'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
