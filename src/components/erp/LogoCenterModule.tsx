import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Palette, Image, Upload, Check, AlertCircle, RefreshCw, 
  Eye, FileCode, Monitor, Sparkles, Sliders 
} from 'lucide-react';
import { db, isFirebaseConfigured } from '../../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface Props {
  isAr: boolean;
}

interface LogoConfig {
  darkLogo: string;
  lightLogo: string;
  svgLogo: string;
  mobileLogo: string;
  footerLogo: string;
  splashLogo: string;
  favicon: string;
  logoGlowIntensity: number; // 0 to 10
  logoHeaderSize: number; // 100 to 150 %
}

const DEFAULT_LOGOS: LogoConfig = {
  darkLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80', // High-end gold marble shape representation
  lightLogo: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?auto=format&fit=crop&w=200&q=80', // Clean branding shape representation
  svgLogo: `<svg viewBox="0 0 100 100" className="w-12 h-12"><polygon points="50,15 90,85 10,85" fill="none" stroke="#e5c060" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/></svg>`,
  mobileLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
  footerLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=180&q=80',
  splashLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
  favicon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=32&q=80',
  logoGlowIntensity: 6,
  logoHeaderSize: 135
};

export default function LogoCenterModule({ isAr }: Props) {
  const [logoConfig, setLogoConfig] = useState<LogoConfig>(DEFAULT_LOGOS);
  const [activePreview, setActivePreview] = useState<'dark' | 'light'>('dark');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Read from Firestore if configured, otherwise fallback to LocalStorage
    const saved = localStorage.getItem('yafta_logo_config');
    if (saved) {
      setLogoConfig(JSON.parse(saved));
    }

    const loadRemoteConfig = async () => {
      if (isFirebaseConfigured && db) {
        try {
          const docRef = doc(db, 'settings', 'logoConfig');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as LogoConfig;
            setLogoConfig(data);
            localStorage.setItem('yafta_logo_config', JSON.stringify(data));
          }
        } catch (err) {
          console.error("Firestore read error on logoConfig:", err);
        }
      }
    };

    loadRemoteConfig();
  }, []);

  const handleLogoUpdate = (key: keyof LogoConfig, value: any) => {
    const updated = { ...logoConfig, [key]: value };
    setLogoConfig(updated);
    localStorage.setItem('yafta_logo_config', JSON.stringify(updated));
  };

  const handleSaveToCloud = async () => {
    setSaving(true);
    localStorage.setItem('yafta_logo_config', JSON.stringify(logoConfig));

    // Dispatch custom event to let Navbar and app immediately fetch the new configurations in real time!
    window.dispatchEvent(new Event('logoConfigUpdated'));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'settings', 'logoConfig'), logoConfig);
      } catch (err) {
        console.error("Firestore write failed:", err);
      }
    }

    setTimeout(() => {
      setSaving(false);
      alert(isAr ? 'تم تفعيل وتحديث الهوية البصرية للشعارات بنجاح!' : 'Branding guidelines and logos globally deployed!');
    }, 800);
  };

  const resetToDefault = () => {
    if (!confirm(isAr ? 'هل أنت متأكد من رغبتك بإعادة ضبط الشعارات الأصلية؟' : 'Reset brand logos back to original default presets?')) return;
    setLogoConfig(DEFAULT_LOGOS);
    localStorage.setItem('yafta_logo_config', JSON.stringify(DEFAULT_LOGOS));
    window.dispatchEvent(new Event('logoConfigUpdated'));
  };

  return (
    <div className="space-y-8 font-sans text-right" dir="rtl">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LOGO TYPE CHANGER CONTROLS (8/12 width) */}
        <div className="lg:col-span-8 bg-neutral-950 border border-gold-500/10 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-900 flex-row-reverse text-right">
            <div>
              <h3 className="text-base font-black text-white">{isAr ? 'مركز إدارة الهوية والشعارات المتقدم' : 'Advanced Logo Management & Guidelines'}</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">{isAr ? 'قم بإعداد ملفات الشعار للأنماط المظلمة والمضيئة والمتحركة' : 'Calibrate high-resolution brand visuals'}</p>
            </div>
            <Palette className="w-5 h-5 text-gold-505" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-right">
            
            {/* Dark Logo (For Dark Theme Headers) */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-bold flex items-center justify-end gap-1.5">
                <span>{isAr ? 'شعار القالب المظلم (رابط الصورة)' : 'Dark Header Logo Link'}</span>
                <Image className="w-3.5 h-3.5 text-gold-505" />
              </label>
              <input 
                type="text" 
                value={logoConfig.darkLogo}
                onChange={(e) => handleLogoUpdate('darkLogo', e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
              />
            </div>

            {/* Light Logo (For Light Theme Headers) */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-bold flex items-center justify-end gap-1.5">
                <span>{isAr ? 'شعار القالب المضيء (رابط الصورة)' : 'Light Header Logo Link'}</span>
                <Image className="w-3.5 h-3.5 text-gold-505" />
              </label>
              <input 
                type="text" 
                value={logoConfig.lightLogo}
                onChange={(e) => handleLogoUpdate('lightLogo', e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
              />
            </div>

            {/* SVG Logo Definition Code */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-400 font-bold flex items-center justify-end gap-1.5">
                <span>{isAr ? 'كود ناقل SVG الفيكتور المباشر للشعار' : 'SVG Vector Code Inline'}</span>
                <FileCode className="w-3.5 h-3.5 text-gold-505" />
              </label>
              <textarea 
                value={logoConfig.svgLogo}
                onChange={(e) => handleLogoUpdate('svgLogo', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono text-left"
                dir="ltr"
              />
            </div>

            {/* Mobile View Logo */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-bold">{isAr ? 'شعار الهواتف والجوائز' : 'Mobile Logo Link'}</label>
              <input 
                type="text" 
                value={logoConfig.mobileLogo}
                onChange={(e) => handleLogoUpdate('mobileLogo', e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
              />
            </div>

            {/* Footer Logo */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-bold">{isAr ? 'شعار الفوتر وتوقيع الموقع' : 'Footer Sign Logo Link'}</label>
              <input 
                type="text" 
                value={logoConfig.footerLogo}
                onChange={(e) => handleLogoUpdate('footerLogo', e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
              />
            </div>

            {/* Splash Screen / Loading intro Logo */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-bold">{isAr ? 'شعار واجهة الانفجار والمقدمة' : 'Splash / Loading Intro Logo'}</label>
              <input 
                type="text" 
                value={logoConfig.splashLogo}
                onChange={(e) => handleLogoUpdate('splashLogo', e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
              />
            </div>

            {/* Favicon */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-bold">{isAr ? 'رابط أيقونة المتصفح Favicon' : 'Favicon Icon Link'}</label>
              <input 
                type="text" 
                value={logoConfig.favicon}
                onChange={(e) => handleLogoUpdate('favicon', e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
              />
            </div>

          </div>

          {/* ADVANCED HEADERS AND GLOW INTENSITIES */}
          <div className="pt-4 border-t border-neutral-900 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Header Size multiplier */}
            <div className="space-y-2 text-right text-xs">
              <div className="flex justify-between items-center flex-row-reverse text-right">
                <span className="text-zinc-400 font-bold">{isAr ? 'زيادة حجم الشعار في شريط التنقل' : 'Header Logo Display Size'}</span>
                <span className="text-gold-300 font-mono font-bold">{logoConfig.logoHeaderSize}%</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="180"
                step="5"
                value={logoConfig.logoHeaderSize}
                onChange={(e) => handleLogoUpdate('logoHeaderSize', parseInt(e.target.value))}
                className="w-full accent-gold-505 animate-pulse"
              />
            </div>

            {/* Glow Intensity slider */}
            <div className="space-y-2 text-right text-xs">
              <div className="flex justify-between items-center flex-row-reverse text-right">
                <span className="text-zinc-400 font-bold">{isAr ? 'شدة توهج وهالة الشعار الذهبي' : 'Neon Halo Logo Glow'}</span>
                <span className="text-gold-300 font-mono font-bold">{logoConfig.logoGlowIntensity}/10</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="10"
                step="1"
                value={logoConfig.logoGlowIntensity}
                onChange={(e) => handleLogoUpdate('logoGlowIntensity', parseInt(e.target.value))}
                className="w-full accent-gold-505"
              />
            </div>

          </div>

          <div className="pt-4 flex justify-between items-center gap-3">
            <button
              onClick={resetToDefault}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-zinc-500 hover:text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              {isAr ? 'إعادة تعيين الافتراضي' : 'Reset Preset Defaults'}
            </button>
            <button
              onClick={handleSaveToCloud}
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-gold-300 via-gold-505 to-gold-400 hover:from-gold-200 hover:to-gold-300 text-black font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? (isAr ? 'جاري التحديث...' : 'Saving GUID...') : (isAr ? 'اعتماد ونشر الهوية ⚡' : 'Publish Guidelines ⚡')}</span>
            </button>
          </div>

        </div>

        {/* LOGO VISUAL SHOWROOM MOCK (4/12 width) */}
        <div className="lg:col-span-4 bg-neutral-950 border border-gold-500/10 p-6 rounded-2xl text-right space-y-6">
          <h4 className="text-xs font-black text-white flex items-center gap-2 justify-end">
            <span>{isAr ? 'لوحة عرض ومعاينة الشعارات الحية' : 'Live Showroom Previews'}</span>
            <Eye className="w-4 h-4 text-gold-505" />
          </h4>

          {/* Context Selector */}
          <div className="grid grid-cols-2 gap-2 bg-neutral-900/60 p-1 rounded-xl border border-neutral-900 text-xs">
            <button
              onClick={() => setActivePreview('dark')}
              className={`py-1.5 rounded-lg font-bold text-center transition-all ${
                activePreview === 'dark' ? 'bg-neutral-950 text-gold-505 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {isAr ? 'معاينة قالب غامق' : 'Dark Theme'}
            </button>
            <button
              onClick={() => setActivePreview('light')}
              className={`py-1.5 rounded-lg font-bold text-center transition-all ${
                activePreview === 'light' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-400'
              }`}
            >
              {isAr ? 'معاينة قالب فاتح' : 'Light Theme'}
            </button>
          </div>

          {/* Render Actual Previews */}
          <div className={`p-8 rounded-2xl border transition-all flex flex-col items-center justify-center min-h-[160px] ${
            activePreview === 'dark' ? 'bg-black border-neutral-900' : 'bg-zinc-100 border-zinc-200 text-black'
          }`}>
            <div 
              className="relative transition-all duration-300 flex items-center justify-center"
              style={{
                width: `${logoConfig.logoHeaderSize}%`,
                filter: `drop-shadow(0 0 ${logoConfig.logoGlowIntensity * 2.5}px rgba(229,192,96,0.55))`
              }}
            >
              <img 
                src={activePreview === 'dark' ? logoConfig.darkLogo : logoConfig.lightLogo} 
                alt="Header branding preview" 
                referrerPolicy="no-referrer"
                className="max-h-16 object-contain rounded-md"
              />
            </div>
            <span className="text-[9px] text-zinc-500 uppercase mt-4 tracking-widest block font-bold">Header Presentation Mock</span>
          </div>

          {/* SVG Render Preview */}
          <div className="p-4 bg-neutral-900/40 border border-neutral-900 rounded-xl space-y-3">
            <span className="text-[10px] text-zinc-500 block font-bold">{isAr ? 'معاينة كود الفيكتور المباشر:' : 'Inline Vector Preview:'}</span>
            <div className="flex justify-center" dangerouslySetInnerHTML={{ __html: logoConfig.svgLogo }} />
          </div>

          {/* Favicon preview */}
          <div className="p-3 bg-neutral-900/20 border border-neutral-900 rounded-xl flex items-center justify-between text-right flex-row-reverse">
            <span className="text-[10px] text-zinc-500 font-bold">{isAr ? 'أيقونة متصفح العميل' : 'Favicon preview'}</span>
            <img 
              src={logoConfig.favicon} 
              alt="Favicon preview" 
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded bg-black object-contain border border-neutral-800"
            />
          </div>

        </div>

      </div>

    </div>
  );
}
