import { useState, useEffect } from 'react';
import { 
  X, Laptop, Tablet, Smartphone, Download, Upload, Copy, Check, 
  Trash2, Plus, Sparkles, Sliders, Volume2, Maximize2, Minimize2,
  RefreshCw, Settings, Play, ShieldAlert, Cpu, Heart, AlertTriangle, Zap,
  Layers, Paintbrush, Video, Film, Eye, Type, Sparkle, ShoppingBag, Grid, 
  Smile, Wind, ZapOff, BookOpen, ExternalLink, Image as ImageIcon
} from 'lucide-react';

interface ExperienceStudioProps {
  isAr: boolean;
  isOpen: boolean;
  onClose: () => void;
  config: any;
  onChange: (newConfig: any) => void;
  triggerToast: (msg: string) => void;
  addActivity: (text: string) => void;
  activePage: string;
  setActivePage: (page: any) => void;
}

export default function ExperienceStudio({
  isAr,
  isOpen,
  onClose,
  config,
  onChange,
  triggerToast,
  addActivity,
  activePage,
  setActivePage
}: ExperienceStudioProps) {
  // Navigation inside Studio tabs
  const [activeTab, setActiveTab] = useState<'themes' | 'backgrounds' | 'animations' | 'typography' | 'components' | 'effects' | 'marketplace' | 'io' | 'perf'>('themes');
  
  // Preview configuration
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [customGoogleFont, setCustomGoogleFont] = useState('');
  const [copiedProfile, setCopiedProfile] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  // Local state for temporary additions
  const [themeNameInput, setThemeNameInput] = useState('');

  // Performance simulation triggers
  const [simulatedDevice, setSimulatedDevice] = useState<string>('desktop_high');
  const [fpsCounter, setFpsCounter] = useState(60);

  // Auto FPS simulator effect for aesthetic realism
  useEffect(() => {
    const interval = setInterval(() => {
      let baseFps = 60;
      if (simulatedDevice === 'mobile_slow') {
        baseFps = Math.floor(Math.random() * 8) + 24; // 24-32 FPS
      } else if (simulatedDevice === 'laptop_medium') {
        baseFps = Math.floor(Math.random() * 4) + 52; // 52-56 FPS
      } else {
        baseFps = Math.floor(Math.random() * 3) + 58; // 58-60 FPS
      }
      setFpsCounter(baseFps);
    }, 2000);
    return () => clearInterval(interval);
  }, [simulatedDevice]);

  if (!isOpen) return null;

  // Helper to adjust nested properties in config
  const updateConfig = (sectionKey: string, key: string, value: any) => {
    const updated = {
      ...config,
      [sectionKey]: {
        ...config[sectionKey],
        [key]: value
      }
    };
    onChange(updated);
  };

  // Helper to set direct deep objects
  const updateMultiProps = (updates: Array<{ section: string; key: string; value: any }>) => {
    let copy = JSON.parse(JSON.stringify(config));
    updates.forEach(up => {
      if (!copy[up.section]) copy[up.section] = {};
      copy[up.section][up.key] = up.value;
    });
    onChange(copy);
  };

  // Pre-made premium themes
  const THEME_PRESETS = [
    {
      id: 'luxury-gold',
      nameAr: 'العصر الملكي الذهبي ⚜️',
      nameEn: 'Royal Gold Legacy ⚜️',
      theme: {
        primary: '#050505',
        secondary: '#121212',
        accent: '#e5c060', // vibrant champagne
        text: '#d8d8d8',
        heading: '#ffffff',
        btnBg: '#e5c060',
        btnHover: '#fcf6ba',
        btnText: '#000000',
        cardBg: '#0e0d0a',
        cardBorder: 'rgba(229,192,96,0.18)',
        cardHover: '#16140e',
        border: 'rgba(229,192,96,0.22)',
        shadow: 'rgba(229,192,96,0.35)',
        mode: 'dark'
      },
      background: {
        type: 'luxury-gold',
        solidColor: '#050505',
        gradientStart: '#11100c',
        gradientEnd: '#000000',
        imageUrl: '',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-gold-particle-glitter-background-42171-large.mp4'
      },
      typography: {
        alignment: 'right',
        rounding: 'round',
        arabicFont: 'Cairo',
        englishFont: 'Outfit',
        weight: '600',
        letterSpacing: 'wider'
      },
      effects: {
        glow: true,
        neon: false,
        goldGlow: true,
        glass: true,
        float: true,
        parallax: true,
        magnetism: true,
        particles: true
      }
    },
    {
      id: 'cyber-neon',
      nameAr: 'السايبر وبانك القاهري الجديد ⚡',
      nameEn: 'Neo-Cairo Cyberpunk ⚡',
      theme: {
        primary: '#030208',
        secondary: '#0a0815',
        accent: '#ff0055', // cyber pink
        text: '#cccccc',
        heading: '#00f0ff', // neon cyan
        btnBg: '#ff0055',
        btnHover: '#00f0ff',
        btnText: '#000000',
        cardBg: '#06040d',
        cardBorder: 'rgba(255,0,85,0.25)',
        cardHover: '#100b21',
        border: 'rgba(0,240,255,0.25)',
        shadow: 'rgba(255,0,85,0.5)',
        mode: 'dark'
      },
      background: {
        type: 'animated-gradient',
        solidColor: '#030208',
        gradientStart: '#060312',
        gradientEnd: '#1b0015',
        imageUrl: '',
        videoUrl: ''
      },
      typography: {
        alignment: 'right',
        rounding: 'square',
        arabicFont: 'Cairo',
        englishFont: 'Space Grotesk',
        weight: '800',
        letterSpacing: 'widest'
      },
      effects: {
        glow: true,
        neon: true,
        goldGlow: false,
        glass: true,
        float: true,
        parallax: false,
        magnetism: true,
        particles: true
      }
    },
    {
      id: 'emerald-boutique',
      nameAr: 'الزمرد والحرير الراقي 🌿',
      nameEn: 'Emerald Silk Boutique 🌿',
      theme: {
        primary: '#01150c',
        secondary: '#032314',
        accent: '#2ecc71',
        text: '#e6f4ea',
        heading: '#dcfce7',
        btnBg: '#10b981',
        btnHover: '#34d399',
        btnText: '#ffffff',
        cardBg: '#011c10',
        cardBorder: 'rgba(46,204,113,0.18)',
        cardHover: '#032a18',
        border: 'rgba(46,204,113,0.15)',
        shadow: 'rgba(46,204,113,0.25)',
        mode: 'dark'
      },
      background: {
        type: 'gradient',
        solidColor: '#01150c',
        gradientStart: '#011f12',
        gradientEnd: '#000804',
        imageUrl: '',
        videoUrl: ''
      },
      typography: {
        alignment: 'right',
        rounding: 'round',
        arabicFont: 'Tajawal',
        englishFont: 'Playfair Display',
        weight: '500',
        letterSpacing: 'normal'
      },
      effects: {
        glow: true,
        neon: false,
        goldGlow: true,
        glass: true,
        float: true,
        parallax: true,
        magnetism: false,
        particles: false
      }
    },
    {
      id: 'swiss-minimal',
      nameAr: 'البلاتينيوم السويسري الهادئ 🔲',
      nameEn: 'Swiss Platinum Minimal 🔲',
      theme: {
        primary: '#fafafa',
        secondary: '#f4f4f5',
        accent: '#18181b', // solid charcoal
        text: '#27272a',
        heading: '#09090b',
        btnBg: '#18181b',
        btnHover: '#27272a',
        btnText: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: 'rgba(24,24,27,0.08)',
        cardHover: '#f4f4f5',
        border: 'rgba(24,24,27,0.1)',
        shadow: 'rgba(0,0,0,0.05)',
        mode: 'light'
      },
      background: {
        type: 'minimal',
        solidColor: '#fafafa',
        gradientStart: '#fafafa',
        gradientEnd: '#f4f4f5',
        imageUrl: '',
        videoUrl: ''
      },
      typography: {
        alignment: 'left',
        rounding: 'square',
        arabicFont: 'Cairo',
        englishFont: 'Inter',
        weight: '400',
        letterSpacing: 'normal'
      },
      effects: {
        glow: false,
        neon: false,
        goldGlow: false,
        glass: false,
        float: false,
        parallax: false,
        magnetism: false,
        particles: false
      }
    }
  ];

  // Simulated Marketplace packs
  const MARKETPLACE_PACKS = [
    {
      id: 'pack_pharaoh',
      name: isAr ? 'حزمة الغروب الفرعوني 🌅' : 'Pharaonic Sunset Premium Pack 🌅',
      desc: isAr ? 'درجات ذهبية دافئة مشبعة بتدرج ألوان الغروب والأحجار الهيروغليفية العتيقة.' : 'Rich golden shades paired with terracotta sunsets and deep ancient copper hues.',
      category: 'Theme Pack',
      price: '$19.00 (Mock Free Installation)',
      installed: false,
      config: {
        theme: {
          primary: '#0c0500',
          secondary: '#180a00',
          accent: '#e28743',
          text: '#eddcd2',
          heading: '#fcd5ce',
          btnBg: '#e28743',
          btnHover: '#eab676',
          btnText: '#000000',
          cardBg: '#100600',
          cardBorder: 'rgba(226,135,67,0.2)',
          cardHover: '#180a00',
          border: 'rgba(226,135,67,0.25)',
          shadow: 'rgba(226,135,67,0.3)',
          mode: 'dark'
        },
        background: {
          type: 'gradient',
          gradientStart: '#100600',
          gradientEnd: '#000000'
        }
      }
    },
    {
      id: 'pack_matrix',
      name: isAr ? 'حزمة النيون السداسي الرقمي 👽' : 'Matrix Digital Canvas Pack 👽',
      desc: isAr ? 'خطوط تدوير نيون خضراء مفعمة بالإشراق الرقمي المناسب للافتات الشاشات التفاعلية.' : 'Streaming cascade green fonts with pixel hex matrix widgets, perfect for tech signage.',
      category: 'UI Pack',
      price: '$12.00 (Mock Free Installation)',
      installed: false,
      config: {
        theme: {
          primary: '#010802',
          secondary: '#031405',
          accent: '#00ff66',
          text: '#c2fcd5',
          heading: '#00ff33',
          btnBg: '#053d10',
          btnHover: '#00ff66',
          btnText: '#ffffff',
          cardBg: '#010b03',
          cardBorder: 'rgba(0,255,102,0.18)',
          cardHover: '#031807',
          border: 'rgba(0,255,102,0.15)',
          shadow: 'rgba(0,255,102,0.4)',
          mode: 'dark'
        },
        background: {
          type: 'particle',
          solidColor: '#010802'
        }
      }
    },
    {
      id: 'pack_alex',
      name: isAr ? 'شواطئ الإسكندرية الملوكية 🌊' : 'Alexandria Royal Riviera Wave 🌊',
      desc: isAr ? 'ظلال البحر المتوسط الفاتنة والزجاج المبرد الفاخر لشركات التأجير واليخوت السياحية.' : 'Indulgent deep Mediterranean teals and sea mist glass-panels for prestige hotels.',
      category: 'Animation Pack',
      price: '$24.00 (Mock Free Installation)',
      installed: false,
      config: {
        theme: {
          primary: '#01111a',
          secondary: '#022133',
          accent: '#0492c2',
          text: '#cfe2f3',
          heading: '#ffffff',
          btnBg: '#0492c2',
          btnHover: '#63c5da',
          btnText: '#ffffff',
          cardBg: '#022133',
          cardBorder: 'rgba(4,146,194,0.2)',
          cardHover: '#03324c',
          border: 'rgba(4,146,194,0.18)',
          shadow: 'rgba(4,146,194,0.3)',
          mode: 'dark'
        }
      }
    }
  ];

  // Apply a preset
  const handleApplyPreset = (preset: any) => {
    // Create new backup list or merge
    const activeThemes = JSON.parse(localStorage.getItem('yafta_custom_themes_vault') || '[]');
    onChange({
      ...config,
      theme: { ...config.theme, ...preset.theme },
      background: { ...config.background, ...preset.background },
      typography: { ...config.typography, ...preset.typography },
      effects: { ...config.effects, ...preset.effects }
    });
    triggerToast(isAr ? `تم تفعيل قالب المظهر: ${preset.nameAr} فورا!` : `Design suite applied: ${preset.nameEn}`);
    addActivity(`استوديو المظهر والخامات: تفعيل قالب خارجي شامل ${preset.nameEn}`);
  };

  // Add Custom Theme current settings to vault
  const handleSaveToVault = () => {
    if (!themeNameInput.trim()) {
      alert(isAr ? 'برجاء كتابة اسم لحفظ القالب الجديد!' : 'Please enter a name for your custom theme!');
      return;
    }
    const currentVault = JSON.parse(localStorage.getItem('yafta_custom_themes_vault') || '[]');
    const newTheme = {
      id: 'custom_' + Date.now(),
      nameAr: `${themeNameInput} ✨`,
      nameEn: `${themeNameInput} ✨`,
      theme: { ...config.theme },
      background: { ...config.background },
      typography: { ...config.typography },
      effects: { ...config.effects }
    };
    const updatedVault = [...currentVault, newTheme];
    localStorage.setItem('yafta_custom_themes_vault', JSON.stringify(updatedVault));
    setThemeNameInput('');
    triggerToast(isAr ? `تم حفظ قالبك الخاص "${themeNameInput}" في الذاكرة السحابية للمشرف!` : `Theme "${themeNameInput}" successfully saved to console vault!`);
    addActivity(`استوديو المظهر والخامات: حفظ وتخزين قالب جديد باسم ${themeNameInput}`);
  };

  // Duplicate current theme
  const handleDuplicateTheme = () => {
    const backupName = isAr ? 'نسخة مكررة - ' + (config.theme.accent === '#e5c060' ? 'ذهبي ملكي' : 'مطور') : 'Duplicate Theme ' + Date.now();
    const currentVault = JSON.parse(localStorage.getItem('yafta_custom_themes_vault') || '[]');
    const duplicated = {
      id: 'dup_' + Date.now(),
      nameAr: backupName,
      nameEn: backupName,
      theme: { ...config.theme },
      background: { ...config.background },
      typography: { ...config.typography },
      effects: { ...config.effects }
    };
    localStorage.setItem('yafta_custom_themes_vault', JSON.stringify([...currentVault, duplicated]));
    triggerToast(isAr ? 'تم استنساخ وتكرار قالب المظهر الحالي!' : 'Theme duplicated and preserved in vault.');
  };

  // Load imported json
  const handleImportJson = () => {
    try {
      if (!jsonInput.trim()) return;
      const parsed = JSON.parse(jsonInput);
      if (parsed.theme && parsed.background && parsed.typography && parsed.effects) {
        onChange(parsed);
        triggerToast(isAr ? 'تم بنجاح تفريغ واستيراد أبعاد وهوية ملف التصميم الخارجي!' : 'Design system profile imported successfully!');
        addActivity('استوديو المظهر والخامات: استيراد ملف خارجي JSON للمظهر');
      } else {
        alert(isAr ? 'صيغة الملف غير مطابقة لأبعاد النظام الإنشائي والتصميمي ليافطة.' : 'Invalid profile configuration schema.');
      }
    } catch (e) {
      alert(isAr ? 'فشل قراءة الملف. تأكد من صحة بناء ملف JSON' : 'Failed to parse JSON schema.');
    }
  };

  // Install custom google font dynamically
  const handleAddCustomGoogleFont = () => {
    if (!customGoogleFont.trim()) return;
    const fontId = 'dynamic-google-font-' + customGoogleFont.replace(/\s+/g, '-').toLowerCase();
    let linkTag = document.getElementById(fontId);
    if (!linkTag) {
      linkTag = document.createElement('link');
      linkTag.id = fontId;
      linkTag.setAttribute('rel', 'stylesheet');
      linkTag.setAttribute('href', `https://fonts.googleapis.com/css2?family=${customGoogleFont.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&display=swap`);
      document.head.appendChild(linkTag);
    }
    updateConfig('typography', 'englishFont', customGoogleFont);
    triggerToast(isAr ? `تم تنزيل وتفعيل خط جوجل الجديد: ${customGoogleFont}!` : `Loaded and bound Google Font: ${customGoogleFont}!`);
    addActivity(`الخط الرقمي: تم مواءمة وطلب خط خارجي ${customGoogleFont}`);
  };

  const getSavedVault = () => {
    return JSON.parse(localStorage.getItem('yafta_custom_themes_vault') || '[]');
  };

  const handleClearVault = () => {
    if (confirm(isAr ? 'هل تود مسح القوالب المحفوظة يدوياً؟' : 'Clear all custom saved profiles?')) {
      localStorage.removeItem('yafta_custom_themes_vault');
      triggerToast(isAr ? 'تم تصفير مخزن القوالب الفرعية.' : 'Vault cleared.');
    }
  };

  return (
    <div className="fixed inset-0 z-55 bg-neutral-950/95 backdrop-blur-md flex flex-col md:grid md:grid-cols-12 overflow-hidden text-right font-sans" dir={isAr ? "rtl" : "ltr"}>
      
      {/* LEFT COLUMN: VISUAL CONTROLS PANEL (7 cols) */}
      <div className="col-span-7 flex flex-col h-full border-l border-gold-505/20 overflow-y-auto">
        
        {/* Studio Title and Exit Header */}
        <div className="p-4 md:p-6 bg-gradient-to-r from-neutral-900 to-neutral-950 border-b border-gold-505/20 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gold-950 border border-gold-505/30">
              <Paintbrush className="w-6 h-6 text-gold-505 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] bg-red-950 border border-red-500/20 text-red-400 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-widest font-black leading-none animate-pulse">
                  {isAr ? 'حقوق ملكية ومطور مالك حصرية' : 'SUPER ADMIN EXCLUSIVE CONSOLE'}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white mt-1">
                {isAr ? 'استوديو التجربة والمظهر الخارجي المتكامل' : 'Design System & Experience Studio'}
              </h1>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-3 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
            title={isAr ? 'الخروج والتثبيت' : 'Exit Studio & Apply'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Row (Horizontal Scroll) */}
        <div className="sticky top-0 z-20 px-4 md:px-6 py-3 bg-neutral-900 border-b border-gold-500/10 overflow-x-auto flex gap-2 scrollbar-none shrink-0" dir={isAr ? "rtl" : "ltr"}>
          {[
            { id: 'themes', label: isAr ? '🎨 القوالب والألوان' : 'Visual Themes', icon: Sliders },
            { id: 'backgrounds', label: isAr ? '🖼️ الخلفيات والمحيط' : 'Backgrounds', icon: ImageIcon },
            { id: 'animations', label: isAr ? '⚡ محرك الأنيميشنز' : 'Animations', icon: Zap },
            { id: 'typography', label: isAr ? 'Type 🔠 الخطوط والهوية' : 'Typography', icon: Type },
            { id: 'components', label: isAr ? '🧩 هيكلة الأجزاء' : 'Components', icon: Grid },
            { id: 'effects', label: isAr ? '✨ المؤثرات البصرية' : 'SFX Manager', icon: Sparkles },
            { id: 'marketplace', label: isAr ? '🛒 متجر الإضافات' : 'UI Marketplace', icon: ShoppingBag },
            { id: 'perf', label: isAr ? '🔋 واقي الأداء' : 'Performance Optimizer', icon: Cpu },
            { id: 'io', label: isAr ? '⚙️ استيراد / تصدير' : 'Import & Export', icon: Download }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-300 to-gold-505 text-black shadow-lg hover:brightness-110 active:scale-95 duration-100'
                    : 'text-neutral-400 hover:text-white bg-neutral-950/70 hover:bg-neutral-850 border border-neutral-850'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Workspace Space */}
        <div className="p-4 md:p-6 space-y-6 flex-grow">

          {/* TAB A: THEME MANAGEMENT */}
          {activeTab === 'themes' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gold-950/15 border border-gold-505/20 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="text-right">
                  <h3 className="text-sm font-black text-gold-300">{isAr ? 'محور تحريك وإدارة درجات اللون للموقع' : 'Dynamic Theme Vault System'}</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{isAr ? 'اختر قالب جاهز، أو قم ببناء قالبك الملوكي الخاص وتخزينه في مسارات التكرار والابتكار التفاعلية.' : 'Select premium pre-made presets or create distinct custom palettes.'}</p>
                </div>
                <button
                  onClick={handleDuplicateTheme}
                  className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[10px] text-neutral-300 border border-gold-505/25 font-bold cursor-pointer transition-all"
                >
                  {isAr ? '🔄 استنساخ وتكرار المظهر الحالي' : 'Duplicate Current Theme'}
                </button>
              </div>

              {/* Pre-made lists */}
              <div className="space-y-2.5">
                <label className="text-xs font-black text-white block">{isAr ? 'القوالب السحابية المدمجة والجاهزة للنشر:' : 'Pre-integrated Platform Themes:'}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {THEME_PRESETS.map((preset) => (
                    <div 
                      key={preset.id}
                      className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 bg-neutral-900/60 ${
                        config.id === preset.id || (config.background.type === preset.background.type && config.theme.accent === preset.theme.accent)
                          ? 'border-gold-505 bg-gold-950/20'
                          : 'border-neutral-850 hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-black text-white">{isAr ? preset.nameAr : preset.nameEn}</h4>
                        <div className="flex gap-1.5 mt-2">
                          <span className="w-4 h-4 rounded-full border border-neutral-700" style={{ backgroundColor: preset.theme.primary }} />
                          <span className="w-4 h-4 rounded-full border border-neutral-700" style={{ backgroundColor: preset.theme.secondary }} />
                          <span className="w-4 h-4 rounded-full border border-neutral-700" style={{ backgroundColor: preset.theme.accent }} />
                          <span className="w-4 h-4 rounded-full border border-neutral-700" style={{ backgroundColor: preset.theme.cardBg }} />
                        </div>
                      </div>
                      <button
                        onClick={() => handleApplyPreset(preset)}
                        className="py-1.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-[10px] font-bold text-gold-300 border border-gold-505/20 cursor-pointer self-end w-full sm:w-auto"
                      >
                        {isAr ? 'تطبيق القالب فورا ⚡' : 'Initialize Palette ⚡'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* User saved vault */}
              {getSavedVault().length > 0 && (
                <div className="space-y-2.5 pt-3 border-t border-neutral-900">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-white block">{isAr ? 'قوالبك الخاصة المحفوظة بالذاكرة:' : 'Your Saved Vault Items:'}</label>
                    <button onClick={handleClearVault} className="text-[10px] text-red-400 hover:underline">{isAr ? 'مسح القوالب' : 'Clear Saved'}</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getSavedVault().map((sv: any) => (
                      <div key={sv.id} className="p-3 rounded-xl border border-gold-505/25 bg-neutral-950 flex justify-between items-center">
                        <span className="text-xs font-bold text-neutral-300">{sv.nameAr}</span>
                        <button
                          onClick={() => {
                            onChange(sv);
                            triggerToast(isAr ? 'تم تطبيق القالب بنجاح!' : 'Theme active');
                          }}
                          className="px-2.5 py-1 rounded bg-gold-950 text-[9px] text-gold-400 border border-gold-505/30 hover:bg-gold-505 hover:text-black font-bold"
                        >
                          {isAr ? 'تشغيل' : 'Load'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Create/Save New Layout */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-3">
                <label className="text-xs font-black text-white block">{isAr ? 'حفظ المظهر الحالي الحالي كقالب مخصص:' : 'Preserve Current Tweaks as Custom Template:'}</label>
                <div className="flex gap-2.5">
                  <input
                    type="text"
                    placeholder={isAr ? 'اكتب اسم المخطط اللوني مثلاً: واجهات كافيهات..' : 'Theme name, e.g. Corporate Platinum 2026...'}
                    value={themeNameInput}
                    onChange={(e) => setThemeNameInput(e.target.value)}
                    className="flex-grow bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white text-right font-bold focus:outline-none"
                  />
                  <button
                    onClick={handleSaveToVault}
                    className="px-4 py-2 bg-gradient-to-r from-gold-300 to-gold-500 rounded-xl text-xs text-neutral-950 font-black cursor-pointer shadow hover:brightness-110 shrink-0"
                  >
                    <span>{isAr ? 'حفظ وتخزين 💾' : 'Save To Vault 💾'}</span>
                  </button>
                </div>
              </div>

              {/* Mode Settings and Specific color customizers */}
              <div className="space-y-4 pt-3 border-t border-neutral-900">
                <h3 className="text-xs font-black text-gold-300">{isAr ? 'المستوى الثنائي المتقدم (الألوان التفصيلية):' : 'Exacting Aesthetic Color Controllers:'}</h3>
                
                {/* Theme Mode */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 block">{isAr ? 'النمط العام للموقع (Theme Mode):' : 'Main Theme Color Mode:'}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['dark', 'light', 'auto'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          updateConfig('theme', 'mode', mode);
                          triggerToast(isAr ? `تغيير نمط العرض إلى: ${mode === 'dark' ? 'الداكن 🌙' : mode === 'light' ? 'المضيء ☀️' : 'التلقائي 💻'}` : `Theme mode switched to ${mode}`);
                        }}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize text-center ${
                          config.theme.mode === mode
                            ? 'border-gold-505 bg-gold-950/60 text-white'
                            : 'border-neutral-850 bg-neutral-950 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {mode === 'dark' ? (isAr ? 'الداكن 🌙' : 'Dark Mode 🌙') : mode === 'light' ? (isAr ? 'المضيء ☀️' : 'Light Mode ☀️') : (isAr ? 'تلقائي 💻' : 'Auto 💻')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Primary & Secondary */}
                  <div className="space-y-2 bg-neutral-900/40 p-3 rounded-xl border border-neutral-850">
                    <label className="text-[11px] font-bold text-neutral-300 block">{isAr ? 'خلفية الصفحة الأساسية (Primary Background):' : 'Primary Background Color:'}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.theme.primary} onChange={(e) => updateConfig('theme', 'primary', e.target.value)} className="w-10 h-8 rounded border-0 cursor-pointer" />
                      <input type="text" value={config.theme.primary} onChange={(e) => updateConfig('theme', 'primary', e.target.value)} className="bg-neutral-950 text-xs px-2.5 py-1.5 rounded border border-neutral-800 text-white font-mono w-24 text-center" />
                    </div>
                  </div>

                  <div className="space-y-2 bg-neutral-900/40 p-3 rounded-xl border border-neutral-850">
                    <label className="text-[11px] font-bold text-neutral-300 block">{isAr ? 'لون اللوحات وأجسام الحاويات (Secondary BG):' : 'Secondary Background Color:'}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.theme.secondary} onChange={(e) => updateConfig('theme', 'secondary', e.target.value)} className="w-10 h-8 rounded border-0 cursor-pointer" />
                      <input type="text" value={config.theme.secondary} onChange={(e) => updateConfig('theme', 'secondary', e.target.value)} className="bg-neutral-950 text-xs px-2.5 py-1.5 rounded border border-neutral-800 text-white font-mono w-24 text-center" />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div className="space-y-2 bg-neutral-900/40 p-3 rounded-xl border border-neutral-850">
                    <label className="text-[11px] font-bold text-neutral-300 block">{isAr ? 'اللون التفاعلي العام والذهبي (Accent Color):' : 'Prestige Brand Highlight (Accent):'}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.theme.accent} onChange={(e) => updateConfig('theme', 'accent', e.target.value)} className="w-10 h-8 rounded border-0 cursor-pointer" />
                      <input type="text" value={config.theme.accent} onChange={(e) => updateConfig('theme', 'accent', e.target.value)} className="bg-neutral-950 text-xs px-2.5 py-1.5 rounded border border-neutral-800 text-white font-mono w-24 text-center" />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="space-y-2 bg-neutral-900/40 p-3 rounded-xl border border-neutral-850">
                    <label className="text-[11px] font-bold text-neutral-300 block">{isAr ? 'لون الخط الجسدي للفقرات (Text Color):' : 'Body Paragraph Text Color:'}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.theme.text} onChange={(e) => updateConfig('theme', 'text', e.target.value)} className="w-10 h-8 rounded border-0 cursor-pointer" />
                      <input type="text" value={config.theme.text} onChange={(e) => updateConfig('theme', 'text', e.target.value)} className="bg-neutral-950 text-xs px-2.5 py-1.5 rounded border border-neutral-800 text-white font-mono w-24 text-center" />
                    </div>
                  </div>

                  {/* Header Color */}
                  <div className="space-y-2 bg-neutral-900/40 p-3 rounded-xl border border-neutral-850">
                    <label className="text-[11px] font-bold text-neutral-300 block">{isAr ? 'لون خط العناوين الكبرى (Heading Color):' : 'Display Heading Text Color:'}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.theme.heading} onChange={(e) => updateConfig('theme', 'heading', e.target.value)} className="w-10 h-8 rounded border-0 cursor-pointer" />
                      <input type="text" value={config.theme.heading} onChange={(e) => updateConfig('theme', 'heading', e.target.value)} className="bg-neutral-950 text-xs px-2.5 py-1.5 rounded border border-neutral-800 text-white font-mono w-24 text-center" />
                    </div>
                  </div>

                  {/* Card BG and Card Border */}
                  <div className="space-y-2 bg-neutral-900/40 p-3 rounded-xl border border-neutral-850">
                    <label className="text-[11px] font-bold text-neutral-300 block">{isAr ? 'لون خلفيات الكروت (Card Background):' : 'Card Surface Background:'}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.theme.cardBg} onChange={(e) => updateConfig('theme', 'cardBg', e.target.value)} className="w-10 h-8 rounded border-0 cursor-pointer" />
                      <input type="text" value={config.theme.cardBg} onChange={(e) => updateConfig('theme', 'cardBg', e.target.value)} className="bg-neutral-950 text-xs px-2.5 py-1.5 rounded border border-neutral-800 text-white font-mono w-24 text-center" />
                    </div>
                  </div>

                  {/* Buttons controls */}
                  <div className="space-y-2 bg-neutral-900/40 p-3 rounded-xl border border-neutral-850">
                    <label className="text-[11px] font-bold text-neutral-300 block">{isAr ? 'لون خلفية زر الشراء والحدث الرئيسي:' : 'Primary Action Button BG:'}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.theme.btnBg} onChange={(e) => updateConfig('theme', 'btnBg', e.target.value)} className="w-10 h-8 rounded border-0 cursor-pointer" />
                      <input type="text" value={config.theme.btnBg} onChange={(e) => updateConfig('theme', 'btnBg', e.target.value)} className="bg-neutral-950 text-xs px-2.5 py-1.5 rounded border border-neutral-800 text-white font-mono w-24 text-center" />
                    </div>
                  </div>

                  <div className="space-y-2 bg-neutral-900/40 p-3 rounded-xl border border-neutral-850">
                    <label className="text-[11px] font-bold text-neutral-300 block">{isAr ? 'لون حدود الكروت والشبكة الإطارية:' : 'Universal Wireframe/Border Color:'}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.theme.border} onChange={(e) => updateConfig('theme', 'border', e.target.value)} className="w-10 h-8 rounded border-0 cursor-pointer" />
                      <input type="text" value={config.theme.border} onChange={(e) => updateConfig('theme', 'border', e.target.value)} className="bg-neutral-950 text-xs px-2.5 py-1.5 rounded border border-neutral-800 text-white font-mono w-24 text-center" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB B: BACKGROUND MANAGER */}
          {activeTab === 'backgrounds' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-right">
                <h3 className="text-sm font-black text-gold-300">{isAr ? 'مدير المحيط البيئي والخلفيات الفنية' : 'Ambient Space & Canvas Backgrounds'}</h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">{isAr ? 'تحكم بالكامل في العرض البصري للخلفيات: ألوان مصمتة، تدرجات مضيئة حية، أو استعن بمقاطع تفاعلية لإغراق واجهتك بالملوكية.' : 'Customize the depth of your canvas environment.'}</p>
              </div>

              {/* Background Type */}
              <div className="space-y-2">
                <label className="text-xs font-black text-white block">{isAr ? 'نمط وهندسة الخلفية المسؤولة:' : 'Environment Background Physics:'}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'solid', nameAr: 'لون مصمت 🎨', nameEn: 'Solid Matte' },
                    { id: 'gradient', nameAr: 'تدرج فني 🌇', nameEn: 'Static Gradient' },
                    { id: 'animated-gradient', nameAr: 'تدرج حي متحرك 🌌', nameEn: 'Animated Liquid' },
                    { id: 'video', nameAr: 'فيديو ملوكي 🎥', nameEn: 'Cinematic Video' },
                    { id: 'image', nameAr: 'صورة خامات 🖼️', nameEn: 'Textured Surface/Image' },
                    { id: 'particle', nameAr: 'جزيئات متطايرة ✨', nameEn: 'Interactive Particles' },
                    { id: 'glassmorphism', nameAr: 'زجاج مضبب 🔮', nameEn: 'Heavy Frosted Glass' },
                    { id: 'luxury-gold', nameAr: 'ذهبي معتم هادئ 🏆', nameEn: 'Prestige Dark Gold' },
                    { id: 'corporate', nameAr: 'نمط الشركات المحايد 🏢', nameEn: 'Executive Slate' },
                    { id: 'minimal', nameAr: 'بساطة هادئة ⬜', nameEn: 'Zen Minimalist' }
                  ].map((bgType) => (
                    <button
                      key={bgType.id}
                      onClick={() => {
                        updateConfig('background', 'type', bgType.id);
                        triggerToast(isAr ? `تطبيق الخلفية: ${bgType.nameAr}` : `Background changed to: ${bgType.nameEn}`);
                        addActivity(`استوديو الخلفية: تم تبديل البيئة إلى: ${bgType.nameEn}`);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-center items-center gap-1 bg-neutral-900/50 ${
                        config.background.type === bgType.id
                          ? 'border-gold-505 bg-gold-950/40 text-white font-extrabold'
                          : 'border-neutral-850 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="text-[11px] font-bold">{isAr ? bgType.nameAr : bgType.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scope Area */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-2">
                <label className="text-xs font-black text-white block">{isAr ? 'نظام تطبيق ودراسة الخلفية:' : 'Background Application Rules Scope:'}</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-neutral-300 font-bold cursor-pointer">
                    <input type="radio" name="bgscope" value="global" checked={config.background.scope !== 'per-page'} onChange={() => updateConfig('background', 'scope', 'global')} className="accent-gold-505" />
                    <span>{isAr ? 'تطبيق شامل في كامل طبقات الموقع (Global)' : 'Apply Globally across all pages'}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-neutral-300 font-bold cursor-pointer">
                    <input type="radio" name="bgscope" value="per-page" checked={config.background.scope === 'per-page'} onChange={() => updateConfig('background', 'scope', 'per-page')} className="accent-gold-505" />
                    <span>{isAr ? 'منفصل لكل صفحة (Custom Per Page)' : 'Enable Custom Per Page background override'}</span>
                  </label>
                </div>
              </div>

              {/* Conditional parameters */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-4">
                <h4 className="text-xs font-extrabold text-gold-300">{isAr ? 'معايير الإضاءة والعمق لبيئتك المباشرة:' : 'Environmental Tuning Knobs:'}</h4>
                
                {config.background.type === 'solid' && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-neutral-400 block">{isAr ? 'اختر لون الخلفية الأساسية:' : 'Solid Color HEX Palette:'}</label>
                    <input 
                      type="color" 
                      value={config.background.solidColor || '#050505'} 
                      onChange={(e) => updateConfig('background', 'solidColor', e.target.value)} 
                      className="w-full h-10 rounded-xl cursor-pointer"
                    />
                  </div>
                )}

                {(config.background.type === 'gradient' || config.background.type === 'animated-gradient') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-400 block">{isAr ? 'لون تيار البداية (Start Color):' : 'Gradient Start Point Color:'}</label>
                      <input type="color" value={config.background.gradientStart || '#0c0b05'} onChange={(e) => updateConfig('background', 'gradientStart', e.target.value)} className="w-full h-10 rounded-xl cursor-pointer" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-400 block">{isAr ? 'لون تيار النهاية (End Color):' : 'Gradient End Point Color:'}</label>
                      <input type="color" value={config.background.gradientEnd || '#000000'} onChange={(e) => updateConfig('background', 'gradientEnd', e.target.value)} className="w-full h-10 rounded-xl cursor-pointer" />
                    </div>
                  </div>
                )}

                {config.background.type === 'video' && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-neutral-400 block">{isAr ? 'رابط مقطع لقطات الملوكية والليدات (Video URL):' : 'HD/Loop Fluid Video Link:'}</label>
                    <input 
                      type="text" 
                      placeholder="Enter mp4 loop link..."
                      value={config.background.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-luxury-gold-particle-glitter-background-42171-large.mp4'} 
                      onChange={(e) => updateConfig('background', 'videoUrl', e.target.value)} 
                      className="w-full bg-neutral-950 text-neutral-300 border border-neutral-800 text-xs px-3 py-2 rounded-xl text-left font-mono"
                    />
                    <span className="text-[9px] text-neutral-500 block">{isAr ? '* تلميح: يدعم روابط MP4 المباشرة الهادئة.' : 'Looping 1080p, fire-safe web-optimized files recommended.'}</span>
                  </div>
                )}

                {config.background.type === 'image' && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-neutral-400 block">{isAr ? 'رابط خامة الصورة الفاخرة (Image URL):' : 'Industrial / High Definition Texture Link:'}</label>
                    <input 
                      type="text" 
                      placeholder="Enter texture or image link..."
                      value={config.background.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200'} 
                      onChange={(e) => updateConfig('background', 'imageUrl', e.target.value)} 
                      className="w-full bg-neutral-950 text-neutral-300 border border-neutral-800 text-xs px-3 py-2 rounded-xl text-left font-mono"
                    />
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      {[
                        { name: isAr ? 'كلادينج أسود' : 'Black Metal Cladding', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800' },
                        { name: isAr ? 'حرير تيتانيوم' : 'Brushed Titanium', url: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=800' },
                        { name: isAr ? 'رخام معرق' : 'Royal Marble Slab', url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800' }
                      ].map((mockImg, mIdx) => (
                        <button
                          key={mIdx}
                          onClick={() => {
                            updateConfig('background', 'imageUrl', mockImg.url);
                            triggerToast(isAr ? 'تم تطبيق الخامة الفاخرة!' : 'Luxury texture loaded');
                          }}
                          className="p-1 px-2 rounded bg-neutral-950 text-[9px] text-neutral-400 border border-neutral-850 hover:text-white truncate"
                        >
                          {mockImg.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {config.background.type === 'particle' && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-neutral-400 block">{isAr ? 'كثافة وسرعة الجزيئات المتطيرة:' : 'Particle Flow Vectors:'}</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1">{isAr ? 'العدد الأقصى: 80' : 'Density Count:'}</span>
                        <input type="range" min={10} max={100} defaultValue={50} className="w-full accent-gold-505 bg-neutral-950" />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1">{isAr ? 'سرعة الانتقال: 1.5' : 'Vector Velocity:'}</span>
                        <input type="range" min={1} max={10} defaultValue={4} className="w-full accent-gold-505 bg-neutral-950" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB C: ANIMATION ENGINE */}
          {activeTab === 'animations' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-right">
                <h3 className="text-sm font-black text-gold-300">{isAr ? 'محرك تسارع وتدفق الحركة الكهرومغناطيسية' : 'Dynamic Animation Engine Mechanics'}</h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">{isAr ? 'تحكم في المخطط الزمني وسرعة التحضير للحركات، الانتقالات بين الصفحات، وتأثيرات المرور الشاهقة.' : 'Control the kinetic rhythm of buttons, card reveal states and entrance transitions.'}</p>
              </div>

              {/* Kinetic Presets */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-3">
                <label className="text-xs font-black text-white block">{isAr ? 'تبديل مخطط الحركات الإجمالي للموقع (Global Kinetic Preset):' : 'System Wide Animation Profile Preset:'}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'none', label: isAr ? 'لا حركات ⛔' : 'None ⛔' },
                    { id: 'minimal', label: isAr ? 'افتراضي هادئ 🍃' : 'Minimal 🍃' },
                    { id: 'professional', label: isAr ? 'احترافي مالي 🏢' : 'Professional 🏢' },
                    { id: 'premium', label: isAr ? 'بريميوم متدفق ✨' : 'Premium Flow ✨' },
                    { id: 'luxury', label: isAr ? 'ملوكي متموج 👑' : 'Luxury Wave 👑' },
                    { id: 'cinematic', label: isAr ? 'سينمائي غامر 🎬' : 'Cinematic Slate 🎬' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        updateMultiProps([
                          { section: 'animations', key: 'preset', value: preset.id },
                          { section: 'animations', key: 'duration', value: preset.id === 'luxury' || preset.id === 'cinematic' ? 0.8 : preset.id === 'professional' ? 0.4 : 0.2 }
                        ]);
                        triggerToast(isAr ? `تطبيق مخطط الحركة: ${preset.label}` : `Kinetic profile active: ${preset.id}`);
                        addActivity(`المحرك الميكانيكي: تبديل حزمة الأنيميشن إلى الكود: ${preset.id}`);
                      }}
                      className={`py-3 px-1 rounded-xl border text-[11px] font-black text-center ${
                        config.animations.preset === preset.id
                          ? 'border-gold-505 bg-gold-950/60 text-white'
                          : 'border-neutral-850 bg-neutral-950 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed animation controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-900/40 p-4 rounded-2xl border border-neutral-850">
                
                {/* Duration Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-neutral-300">
                    <span>{isAr ? 'مدة الانتقال بين الصفحات:' : 'Page Flip Duration Key:'}</span>
                    <span className="font-mono text-gold-505">{config.animations.duration || 0.4}s</span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={20} 
                    step={1}
                    value={(config.animations.duration || 0.4) * 10} 
                    onChange={(e) => updateConfig('animations', 'duration', Number(e.target.value) / 10)}
                    className="w-full accent-gold-505 h-2 rounded bg-neutral-950 cursor-pointer" 
                  />
                </div>

                {/* Card hover effect type */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400 block">{isAr ? 'نمط استجابة الكروت للمرور (Hover):' : 'Interactive Hover Physics:'}</label>
                  <select 
                    value={config.animations.hoverStyle || 'glow-breath'}
                    onChange={(e) => updateConfig('animations', 'hoverStyle', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs px-2.5 py-2 rounded-xl text-right text-gray-300 focus:outline-none focus:border-gold-505"
                  >
                    <option value="glow-breath">{isAr ? 'نبض مضيء عالي العمق 🌟' : 'Deep Breathing Glow 🌟'}</option>
                    <option value="scale-heavy">{isAr ? 'تمدد بريميوم كامل 🚀' : 'Kinetic Scale Up 🚀'}</option>
                    <option value="tilt-3d">{isAr ? 'ميلان ثلاثي الأبعاد تفاعلي 📐' : 'Responsive Slate Tilt 📐'}</option>
                    <option value="none">{isAr ? 'خالي من التأثيرات' : 'Rigid static'}</option>
                  </select>
                </div>

                {/* Section Reveal effects */}
                <div className="space-y-1 pt-1.5 border-t border-neutral-850 sm:border-0 sm:pt-0">
                  <label className="text-[11px] font-bold text-neutral-400 block">{isAr ? 'ظهور محتوى المنشآت عند السكرول:' : 'Scroll Reveal Trigger Finish:'}</label>
                  <select 
                    value={config.animations.scrollReveal || 'slide-up'}
                    onChange={(e) => updateConfig('animations', 'scrollReveal', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs px-2.5 py-2 rounded-xl text-right text-gray-300 focus:outline-none"
                  >
                    <option value="slide-up">{isAr ? 'انزلاق لأعلى تدريجي ⬆️' : 'Fluid Slide Upwards ⬆️'}</option>
                    <option value="blur-in">{isAr ? 'تلاشي سينمائي ضبابي 🌫️' : 'Focus Cinematic Blur 🌫️'}</option>
                    <option value="scale-up">{isAr ? 'انبثاق ملوكي هادئ 🎆' : 'Soft Radial Bloom 🎆'}</option>
                    <option value="none">{isAr ? 'بدون تأثير السكرول' : 'Instant'}</option>
                  </select>
                </div>

                {/* Text Animation Stagger */}
                <div className="space-y-1 pt-1.5 border-t border-neutral-850 sm:border-0 sm:pt-0">
                  <label className="text-[11px] font-bold text-neutral-400 block">{isAr ? 'انتقال حركي للأزرار والأيقونات:' : 'Action Buttons click feedback:'}</label>
                  <select 
                    value={config.animations.btnFeedback || 'ripple'}
                    onChange={(e) => updateConfig('animations', 'btnFeedback', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs px-2.5 py-2 rounded-xl text-right text-gray-300 focus:outline-none"
                  >
                    <option value="ripple">{isAr ? 'موجة ميكانيكية (Magnetic Ripple)' : 'Electromagnet Ripple'}</option>
                    <option value="gold-shine">{isAr ? 'وميض ذهبي بريميوم (Shine overlay)' : 'Prestige Shimmer Flash'}</option>
                    <option value="rigid">{isAr ? 'صلب بدون حركة' : 'Fixed Flat click'}</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* TAB D: TYPOGRAPHY STUDIO */}
          {activeTab === 'typography' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-right">
                <h3 className="text-sm font-black text-gold-300">{isAr ? 'إستوديو الطباعة والخطوط الهندسية العريضة' : 'Aesthetic Typography Studio Pairs'}</h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">{isAr ? 'اندمج في صياغة السحر البصري للموقع عن طريق مزامنة خطوط العناوين والفقرات اللاتينية والعربية بالتوازن الأكثر رفاهية.' : 'Pair luxury display headings with highly legible Swiss sans.'}</p>
              </div>

              {/* Font Pairing preset options */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-3">
                <label className="text-xs font-black text-white block">{isAr ? 'اختر خطاطة أو توليفة خطوط معدة مسبقاً (Font Pairs Preset):' : 'Pre-paired Global Type Profiles:'}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'cairo-outfit', labelAr: 'التقني الحديث (Cairo + Outfit) 🦾', labelEn: 'Modern Architect', arFont: 'Cairo', enFont: 'Outfit' },
                    { id: 'amiri-playfair', labelAr: 'الأدبي التاريخي الملوكي (Amiri + Playfair) 📜', labelEn: 'Imperial Sovereign Heritage', arFont: 'Amiri', enFont: 'Playfair Display' },
                    { id: 'almarai-inter', labelAr: 'المؤسسات والشركات الرشيق (Almarai + Inter) 💼', labelEn: 'Executive Minimalist', arFont: 'Almarai', enFont: 'Inter' },
                    { id: 'tajawal-montserrat', labelAr: 'الإعلاني المشع الحاد (Tajawal + Montserrat) ⚡', labelEn: 'Prestige Retail Banner', arFont: 'Tajawal', enFont: 'Montserrat' }
                  ].map((pair) => (
                    <button
                      key={pair.id}
                      onClick={() => {
                        updateMultiProps([
                          { section: 'typography', key: 'arabicFont', value: pair.arFont },
                          { section: 'typography', key: 'englishFont', value: pair.enFont }
                        ]);
                        triggerToast(isAr ? `تطبيق الخطوط: ${pair.labelAr}` : `Type bundle active: ${pair.labelEn}`);
                        addActivity(`الخطوط الهندسية: تفعيل توليفة خطاطة هجينة ${pair.labelEn}`);
                      }}
                      className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col gap-1 bg-neutral-950 ${
                        config.typography.arabicFont === pair.arFont && config.typography.englishFont === pair.enFont
                          ? 'border-gold-505 bg-gold-950/40 text-white font-extrabold'
                          : 'border-neutral-850 hover:border-neutral-700 text-neutral-400'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-white">{pair.labelAr}</span>
                      <span className="text-[8px] font-mono text-gold-300">English: {pair.enFont} • العربية: {pair.arFont}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Individual font customizer & Google Font Loader */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-4">
                <h4 className="text-xs font-extrabold text-gold-300">{isAr ? 'مستقبل وخادم الخطوط المتقدم (Google Web Fonts Linker):' : 'Remote Font Integrator Queue:'}</h4>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-400 block">{isAr ? 'تحميل خط مباشر من مستودع جوجل (صنف إنجليزي أو عربي):' : 'Instantly fetch a Google Font by name:'}</label>
                  <div className="flex gap-2.5">
                    <input 
                      type="text" 
                      placeholder="e.g. Space Grotesk, Amiri, Tajawal, Cairo Play..."
                      value={customGoogleFont}
                      onChange={(e) => setCustomGoogleFont(e.target.value)}
                      className="flex-grow bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white text-left font-bold focus:outline-none"
                    />
                    <button 
                      onClick={handleAddCustomGoogleFont}
                      className="px-4 py-2 bg-neutral-950 hover:bg-neutral-900 text-xs text-gold-505 font-bold border border-gold-505/30 rounded-xl cursor-pointer"
                    >
                      {isAr ? 'جلبه ومواءمته' : 'Integrate'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-400 block">{isAr ? 'الخط العربي الافتراضي:' : 'Current Arabic Font:'}</label>
                    <select 
                      value={config.typography.arabicFont || 'Cairo'} 
                      onChange={(e) => updateConfig('typography', 'arabicFont', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs px-2.5 py-2 rounded-xl text-right text-gray-300"
                    >
                      <option value="Cairo">Cairo (كايرو افتراضي)</option>
                      <option value="Almarai">Almarai (المراعي هادئ)</option>
                      <option value="Tajawal">Tajawal (تجول مميز)</option>
                      <option value="Amiri">Amiri (أميري هيروغليفي)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-400 block">{isAr ? 'الخط الإنجليزي واللاتيني:' : 'Current Latin/English Font:'}</label>
                    <select 
                      value={config.typography.englishFont || 'Outfit'} 
                      onChange={(e) => updateConfig('typography', 'englishFont', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs px-2.5 py-2 rounded-xl text-right text-gray-300"
                    >
                      <option value="Outfit">Outfit (أوتفت ملكي)</option>
                      <option value="Inter">Inter (إنتر سويسري)</option>
                      <option value="Montserrat">Montserrat (مونتسرات عريض)</option>
                      <option value="Playfair Display">Playfair Display (بلاي فير سيرف)</option>
                      <option value="Space Grotesk">Space Grotesk (سبيس غرواتسك)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Slide parameters */}
              <div className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-neutral-400 block">{isAr ? 'ثقل الخط للعناوين (Font Weight):' : 'Display Heading Weight:'}</span>
                  <select 
                    value={config.typography.weight || '700'} 
                    onChange={(e) => updateConfig('typography', 'weight', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs px-2.5 py-2 rounded-xl text-right text-gray-300"
                  >
                    <option value="400">{isAr ? 'نحيف / عادي (Regular)' : 'Regular'}</option>
                    <option value="500">{isAr ? 'متوسط السحب (Medium)' : 'Medium'}</option>
                    <option value="600">{isAr ? 'عريض بريميوم (SemiBold)' : 'SemiBold'}</option>
                    <option value="700">{isAr ? 'عريض شاهق (Bold)' : 'Bold'}</option>
                    <option value="900">{isAr ? 'صخري ثقيل (Black)' : 'Sovereign Black'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-neutral-400 block">{isAr ? 'تقوس حدود الأزرار والكروت (Borders):' : 'Curvature Roundness Ratio:'}</span>
                  <select 
                    value={config.typography.rounding || 'round'} 
                    onChange={(e) => updateConfig('typography', 'rounding', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs px-2.5 py-2 rounded-xl text-right text-gray-300"
                  >
                    <option value="square">{isAr ? 'حواف حادة هندسية (Square)' : 'Mechanical Sharp Square'}</option>
                    <option value="subtle">{isAr ? 'تقوس خفيف (Subtle Corner)' : 'Soft Rounded Core'}</option>
                    <option value="round">{isAr ? 'زوايا دائرية ملوكية (Premium Round)' : 'Double Shield Rounded'}</option>
                    <option value="pill">{isAr ? 'حبيبات بيضاوية كاملة (Pill Capsule)' : 'Sleek Smooth Capsule'}</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* TAB E: UI COMPONENT STUDIO */}
          {activeTab === 'components' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-right">
                <h3 className="text-sm font-black text-gold-300">{isAr ? 'استوديو صياغة وهيكلة عناصر واجهات الاستخدام' : 'Prestige UI Component Block Styles'}</h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">{isAr ? 'مواءمة التفاصيل والأنماط المسبقة لأجسام التصفح والملأ، الهيدر الملوكي، والكروت التفاعلية والعدادات الحوسبية.' : 'Visual customizer presets tailored per structural UI elements block.'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Navbar Preset */}
                <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-black text-white block">🌐 {isAr ? 'هيكل شريط التصفح (Header/Navbar):' : 'Main Primary Navbar Style:'}</span>
                  <select 
                    value={config.components.navbarStyle || 'floating-border'}
                    onChange={(e) => updateConfig('components', 'navbarStyle', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 text-xs px-2.5 py-2 rounded-xl text-right text-neutral-300"
                  >
                    <option value="floating-border">{isAr ? 'معلق بإطار مذهب (Luxury Float) ⭐' : 'Floating Amber Border ⭐'}</option>
                    <option value="glass">{isAr ? 'ترشيح مائي ضبابي (Translucent Glass)' : 'Translucent Matte Glass'}</option>
                    <option value="solid">{isAr ? 'مصمت ثقيل أسود (Solid Onyx)' : 'Solid Onyx Black'}</option>
                  </select>
                </div>

                {/* Card Preset */}
                <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-black text-white block">📦 {isAr ? 'هيكل الكروت واللوحات الإرشادية:' : 'Grid Cards Structural Finishes:'}</span>
                  <select 
                    value={config.components.cardStyle || 'glow-hover'}
                    onChange={(e) => updateConfig('components', 'cardStyle', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 text-xs px-2.5 py-2 rounded-xl text-right text-neutral-300"
                  >
                    <option value="glow-hover">{isAr ? 'كروت بوهج إشعاعي (Glow Hover)' : 'Aura Glow Backlit'}</option>
                    <option value="bento">{isAr ? 'لوحة بانتو كلاسيكية (Bento Frame)' : 'Polished Bento Grid'}</option>
                    <option value="minimal-transparent">{isAr ? 'شفاف بسيط جداً (Transparent Matte)' : 'Liquid Minimal Transparent'}</option>
                  </select>
                </div>

                {/* Buttons Preset */}
                <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-black text-white block">🔘 {isAr ? 'صياغة أزرار الفعل والاتصال بالاستانلس:' : 'Interactive Action Buttons:'}</span>
                  <select 
                    value={config.components.btnStyle || 'gold-gradient-glow'}
                    onChange={(e) => updateConfig('components', 'btnStyle', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 text-xs px-2.5 py-2 rounded-xl text-right text-neutral-300"
                  >
                    <option value="gold-gradient-glow">{isAr ? 'تدرج ذهبي برتغالي مشع (Luxury Glow)' : 'Liquid Shimmer Gold'}</option>
                    <option value="pill">{isAr ? 'كبسولة عريضة ممتدة (Pill Minimal)' : 'Sleek Oval Capsule'}</option>
                    <option value="border-only">{isAr ? 'أطر برواز معدني صلد (Solid Stainless Outline)' : 'Stainless Laser-Cut Border'}</option>
                  </select>
                </div>

                {/* Footer style */}
                <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-black text-white block">⛩️ {isAr ? 'ذيل الصفحة وأجسام التذييل (Footer):' : 'Prestige Footers Preset:'}</span>
                  <select 
                    value={config.components.footerStyle || 'corporate-grid'}
                    onChange={(e) => updateConfig('components', 'footerStyle', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 text-xs px-2.5 py-2 rounded-xl text-right text-neutral-300"
                  >
                    <option value="corporate-grid">{isAr ? 'شبكة تفصيلية ملوكية (Detailed Columns)' : 'Exacting Deep Columns'}</option>
                    <option value="minimal-centered">{isAr ? 'ممركز نظيف بسيط (Zen Minimal)' : 'Zen Center aligned'}</option>
                  </select>
                </div>

                {/* AI & Calculator style */}
                <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-2 col-span-1 sm:col-span-2">
                  <span className="text-xs font-black text-white block">🧮 {isAr ? 'نمط حاسبة تسعير لافتات اليافطة والـ LED:' : 'Dynamic Multi-Unit Calculator Skin:'}</span>
                  <select 
                    value={config.components.calcStyle || 'dark-metallic'}
                    onChange={(e) => updateConfig('components', 'calcStyle', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 text-xs px-3 py-2 rounded-xl text-right text-neutral-300"
                  >
                    <option value="dark-metallic">{isAr ? 'معدني معتم غامق كربوني (Carbon Black Titanium)' : 'Matte Carbon Dark Metallic'}</option>
                    <option value="neon-glow">{isAr ? 'إشعاع نيون نيون فولد مضيء (Glow Backlit Flex)' : 'Fluorescent Neon-Glow Flex'}</option>
                    <option value="clean-white">{isAr ? 'طبي عيادي ناصع للبوتيكات (Clean Ivory Boutique)' : 'Clean Minimal Boutique Ivory'}</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* TAB F: EFFECTS MANAGER */}
          {activeTab === 'effects' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-right">
                <h3 className="text-sm font-black text-gold-300">{isAr ? 'لوحة تحكم المؤثرات البصرية وتشويه الأبعاد' : 'Advanced Atmospheric Effects Panel'}</h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">{isAr ? 'تفعيل وهندسة التمويهات، الظلال المشعة، تأثير تتبع الماوس بالتحسس المغناطيسي، وزجاج الجزيئات.' : 'Dribble custom shadow glows, neon accent wires, 3D card tilt and luxury particle clouds.'}</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-4">
                <h4 className="text-xs font-extrabold text-gold-300">{isAr ? 'مفاتيح المؤثرات السحابية النشطة بالموقع:' : 'Fluid Effect Ignition Switches:'}</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'glow', labelAr: 'تأثير التوهج العام (Glow Shadows)', labelEn: 'Global Shadow Glows' },
                    { id: 'neon', labelAr: 'مخططات السايبر نيون (Neon Accent Outlines)', labelEn: 'Cyber Neon Outlines' },
                    { id: 'goldGlow', labelAr: 'وميض الانعكاس الذهبي (Gold Reflections Overlay)', labelEn: 'Prestige Gold Shimmer' },
                    { id: 'glass', labelAr: 'تنقية الزجاج المغشى (Frosted Panels)', labelEn: 'Heavy Frosted Panels' },
                    { id: 'float', labelAr: 'العوم العشوائي للأجسام (Ambient Floating Blobs)', labelEn: 'Ambient Floating Spheres' },
                    { id: 'parallax', labelAr: 'تأثير الإزاحة بالتدحرج (Parallax Scrolling)', labelEn: 'Parallax Coordinate Matrix' },
                    { id: 'magnetism', labelAr: 'الانجذاب المغناطيسي للماوس (Magnetic Cursor Hover)', labelEn: 'Electromagnet Cursor Pull' },
                    { id: 'particles', labelAr: 'سماء الخامات المتساقطة (Particle Canvas Overlay)', labelEn: 'Particle Canvas Sky' }
                  ].map((eff) => (
                    <label 
                      key={eff.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-850 cursor-pointer hover:border-gold-505/30 transition-all"
                    >
                      <div className="text-right">
                        <span className="text-xs font-black text-white block">{isAr ? eff.labelAr : eff.labelEn}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={config.effects[eff.id] || false}
                        onChange={(e) => {
                          updateConfig('effects', eff.id, e.target.checked);
                          triggerToast(isAr ? 'تم حفظ وتبديل حالة مصفوفة المؤثرات الخلوية!' : 'Atmospheric switch toggled');
                        }}
                        className="accent-gold-505 w-4 h-4"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Slider for glow intensity */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-neutral-300">
                  <span>{isAr ? 'شدة سطوع ليدات الهالات (LED Luminous Glow):' : 'Active LED Luminous Glow Intensity:'}</span>
                  <span className="font-mono text-gold-505 animate-pulse">{(config.effects.glowIntensity || 60)}%</span>
                </div>
                <input 
                  type="range" 
                  min={10} 
                  max={100} 
                  value={config.effects.glowIntensity || 60} 
                  onChange={(e) => updateConfig('effects', 'glowIntensity', Number(e.target.value))}
                  className="w-full accent-gold-505 bg-neutral-950 h-2 rounded cursor-pointer" 
                />
              </div>
            </div>
          )}

          {/* TAB G: THEME MARKETPLACE */}
          {activeTab === 'marketplace' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-right">
                <h3 className="text-sm font-black text-gold-300">{isAr ? 'متجر يافطة الرقمي لعناصر وإضافات التصميم' : 'YAFTA Digital Customizer Marketplace'}</h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">{isAr ? 'تنزيل حزم كاملة للأشكال الإنشائية، مؤثرات النيون والـ ليد، وقوالب تناسب الأسواق المختلفة بنقرة مطور واحدة.' : 'Acquire professional themes tailored to specific architectural sectors.'}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {MARKETPLACE_PACKS.map((pack) => (
                  <div key={pack.id} className="p-4 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-gold-505/25 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="absolute top-0 right-0 py-0.5 px-3 bg-gold-950 text-gold-300 border-l border-b border-gold-505/20 text-[8px] font-mono tracking-widest uppercase">
                      {pack.category}
                    </div>
                    <div className="text-right space-y-1 max-w-xl">
                      <h4 className="text-xs font-black text-white pt-2 sm:pt-0">{pack.name}</h4>
                      <p className="text-[10px] text-neutral-400 leading-relaxed">{pack.desc}</p>
                      <span className="text-[9px] font-mono text-emerald-400 mt-1 inline-block">{pack.price}</span>
                    </div>

                    <button
                      onClick={() => {
                        // Apply simulated pack
                        const dup = JSON.parse(JSON.stringify(config));
                        if (pack.config.theme) dup.theme = { ...dup.theme, ...pack.config.theme };
                        if (pack.config.background) dup.background = { ...dup.background, ...pack.config.background };
                        onChange(dup);
                        triggerToast(isAr ? `تهانينا! تم تحميل حزمة المتجر: ${pack.name}` : `Excellent choice! Pack installed successfully.`);
                        addActivity(`المتجر السحابي: تنزيل وتطبيق الحزمة الهندسية ${pack.name}`);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gold-305 text-black hover:bg-gold-200 text-xs font-black transition-all cursor-pointer shadow-lg w-full sm:w-auto"
                    >
                      {isAr ? 'تنزيل وتثبيت مجاني 📥' : 'Instant One-Click Setup 📥'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB H: PERFORMANCE ENGINE */}
          {activeTab === 'perf' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-right">
                <h3 className="text-sm font-black text-gold-300">{isAr ? 'نظام الحماية الوقائي والتحكم بالأداء العتادي' : 'Core Performance Protection Engine'}</h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">{isAr ? 'قم بحماية تجربة عملائك ذوي الهواتف الضعيفة والاتصالات البطيئة عن طريق السماح للنظام بتخفيف المؤثرات الثقيلة بصورة تكيفية.' : 'Scale down resource usage automatically under heavy simulated loads.'}</p>
              </div>

              {/* Performance simulation block */}
              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center bg-neutral-950 p-3.5 rounded-xl border border-neutral-850">
                  <div className="text-right">
                    <span className="text-[9px] text-neutral-500 uppercase tracking-wider block font-mono">Simulated Frame Rate Meter</span>
                    <strong className="text-2xl font-mono text-emerald-400">{fpsCounter} FPS</strong>
                  </div>
                  <Cpu className="w-8 h-8 text-gold-505 animate-spin-slow" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-black text-white block">{isAr ? 'محاكاة أجهزة الزوار لتجربة الحماية الخلوية:' : 'Simulate Visitor Hardware Profile:'}</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'desktop_high', label: isAr ? 'حاسوب فائق السرعة' : 'High-End PC' },
                      { id: 'laptop_medium', label: isAr ? 'هاتف ذكي معتدل' : 'Mid Smartphone' },
                      { id: 'mobile_slow', label: isAr ? 'هاتف بطيء ومتهالك' : 'Legacy / Slow Dial' }
                    ].map((hw) => (
                      <button
                        key={hw.id}
                        onClick={() => {
                          setSimulatedDevice(hw.id);
                          if (hw.id === 'mobile_slow' && config.perf.autoOptimize) {
                            // Turn down intensive effects
                            updateMultiProps([
                              { section: 'effects', key: 'particles', value: false },
                              { section: 'effects', key: 'float', value: false },
                              { section: 'background', key: 'type', value: 'solid' }
                            ]);
                            triggerToast(isAr ? '⚠️ تم الحماية التلقائية! إلغاء المؤثرات لتوفير الوقود.' : '⚠️ Auto-Optimizer triggered! Scaled down blurs and particles.');
                          } else {
                            triggerToast(isAr ? `تغيير محاكاة عتاد الزائر إلى: ${hw.label}` : `Visitor profile shifted.`);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-[11px] font-bold text-center ${
                          simulatedDevice === hw.id
                            ? 'border-gold-505 bg-gold-950/60 text-white font-black'
                            : 'border-neutral-850 bg-neutral-950 text-neutral-400'
                        }`}
                      >
                        {hw.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Settings Toggle */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex items-center justify-between">
                <div className="text-right max-w-sm">
                  <span className="text-xs font-black text-white block">🦾 {isAr ? 'التخفيف الوقائي التلقائي للأداء (Auto-Optimization):' : 'Enable Automated Performance Guard:'}</span>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{isAr ? 'عند التفعيل، سيقوم الكونسول بإيقاف الجزيئات المتطايرة والرسوم المتموجة والخلفيات الثقيلة على الشاشات ومستعرضات الموبايل البطيئة تلقائياً.' : 'Scales back resource-hungry effects when legacy screens are registered.'}</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={config.perf.autoOptimize}
                  onChange={(e) => {
                    updateConfig('perf', 'autoOptimize', e.target.checked);
                    triggerToast(isAr ? 'تم تعديل مصفوفة واقي الأداء!' : 'Adaptive optimizations updated');
                  }}
                  className="accent-gold-505 w-5 h-5 shrink-0 ml-4"
                />
              </div>
            </div>
          )}

          {/* TAB I: EXPORT / IMPORT */}
          {activeTab === 'io' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-right">
                <h3 className="text-sm font-black text-gold-300">{isAr ? 'مستودع المزامنة ونقل خطاط المظهر الخارجي' : 'Profile Export & Import Hub'}</h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">{isAr ? 'عن طريق نسخ ملف الترميز الكربوني البسيط، تستطيع نقل كامل النظام الإنشائي وتطبيقه على عروض أسواق ومواقع أخرى بلمحة عين.' : 'Export layout files as plain serialized JSON metadata blocks.'}</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-3">
                <span className="text-xs font-black text-white block">{isAr ? 'الملف البنيوي النشط للمظهر الحالي (JSON Output):' : 'Active Profile Schema Output (JSON):'}</span>
                <textarea
                  readOnly
                  rows={6}
                  value={JSON.stringify(config, null, 2)}
                  className="w-full bg-neutral-950 text-neutral-300 p-3 rounded-xl text-left font-mono text-[10px] border border-neutral-850 cursor-text focus:outline-none focus:border-gold-505"
                />
                
                <div className="flex gap-2.5 justify-end">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                      setCopiedProfile(true);
                      setTimeout(() => setCopiedProfile(false), 2000);
                      triggerToast(isAr ? 'تم نسخ التكوين البرميلي بملف الحافظة! 📋' : 'Theme schema copied to clipboard! 📋');
                    }}
                    className="px-4 py-2 bg-neutral-950 hover:bg-neutral-900 border border-gold-505/25 text-gold-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedProfile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedProfile ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الكود' : 'Copy Profile')}</span>
                  </button>

                  <button
                    onClick={() => {
                      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
                      const a = document.createElement('a');
                      a.setAttribute('href', dataStr);
                      a.setAttribute('download', `yafta_prestige_theme_${Date.now()}.json`);
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      triggerToast(isAr ? 'تم تنزيل تكوين التصميم كملف خارجي! 💾' : 'Theme profile downloaded.');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-gold-300 to-gold-500 text-neutral-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تنزيل ملف .json' : 'Download JSON'}</span>
                  </button>
                </div>
              </div>

              {/* Import box */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-3">
                <span className="text-xs font-black text-white block">{isAr ? 'استيراد وتغذية مخطط مظهر خارجي جديد:' : 'Inject/Import New Design Profile Schema:'}</span>
                <textarea
                  rows={4}
                  placeholder='Paste JSON schema template block here...'
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full bg-neutral-950 text-neutral-450 p-3 rounded-xl text-left font-mono text-[10px] border border-neutral-850 focus:outline-none focus:border-gold-505"
                />
                
                <button
                  onClick={handleImportJson}
                  className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-900 text-xs text-white font-bold border border-neutral-800 rounded-xl cursor-pointer"
                >
                  📥 {isAr ? 'استرداد وتغذية التعديلات فورا' : 'Import & Apply Dynamic Theme Profile'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* RIGHT COLUMN: HIGH FIDELITY LIVE PREVIEW FRAME (5 cols) */}
      <div className="col-span-5 bg-neutral-950/80 p-4 md:p-6 flex flex-col h-full border-t border-gold-505/10 md:border-t-0 justify-between overflow-hidden">
        
        {/* Device Selection Frame toolbar */}
        <div className="flex justify-between items-center shrink-0 border-b border-neutral-900 pb-4">
          <div className="text-right">
            <span className="text-[10px] text-gold-505 font-mono uppercase tracking-widest leading-none block">G. LIVE PREVIEW VIEWPORT</span>
            <h2 className="text-sm font-black text-white mt-1">{isAr ? 'محاكي واجهة العرض الحظية' : 'Real-Time Kinetic Frame'}</h2>
          </div>

          <div className="flex gap-1.5 p-1 rounded-xl bg-neutral-900/80 border border-neutral-850">
            {[
              { id: 'desktop', title: isAr ? 'شاشة بروميوم' : 'Desktop 100%', icon: Laptop },
              { id: 'tablet', title: isAr ? 'مستعرض تابلت' : 'Tablet 768px', icon: Tablet },
              { id: 'mobile', title: isAr ? 'مستعرض جيب' : 'Mobile 375px', icon: Smartphone }
            ].map((dev) => {
              const DevIcon = dev.icon;
              return (
                <button
                  key={dev.id}
                  onClick={() => setPreviewDevice(dev.id as any)}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    previewDevice === dev.id
                      ? 'bg-gold-505 text-black font-extrabold'
                      : 'text-neutral-500 hover:text-white'
                  }`}
                  title={dev.title}
                >
                  <DevIcon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Page Navigator within Preview */}
        <div className="py-2 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none" dir={isAr ? "rtl" : "ltr"}>
          {[
            { id: 'home', label: isAr ? 'الرئيسية' : 'Home' },
            { id: 'services', label: isAr ? 'الخدمات' : 'Services' },
            { id: 'portfolio', label: isAr ? 'المشاريع' : 'Portfolio' },
            { id: 'cladding', label: isAr ? 'كلادينج' : 'Cladding' },
            { id: 'portal', label: isAr ? 'البوابة' : 'Portal' },
            { id: 'contact', label: isAr ? 'اتصل بنا' : 'Contact' }
          ].map((pg) => (
            <button
              key={pg.id}
              onClick={() => {
                setActivePage(pg.id);
                triggerToast(isAr ? `تغيير صفحة المعاينة إلى: ${pg.label}` : `Preview page swapped to ${pg.label}`);
              }}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg shrink-0 transition-all cursor-pointer ${
                activePage === pg.id
                  ? 'bg-neutral-900 text-gold-305 border border-gold-505/30'
                  : 'bg-neutral-950 border border-neutral-900 text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {pg.label}
            </button>
          ))}
        </div>

        {/* High Fidelity Simulated Device Frame */}
        <div className="flex-1 flex items-center justify-center py-4 bg-neutral-950/40 rounded-2xl border border-neutral-900 relative overflow-hidden group">
          
          <div className="absolute inset-0 bg-neutral-950/25 pointer-events-none z-10"></div>
          
          {/* Real responsive component block container styled according to active preview device dimensions */}
          <div 
            className={`h-full bg-neutral-950/90 border border-gold-505/20 rounded-2xl shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden ${
              previewDevice === 'desktop'
                ? 'w-full max-w-4xl h-[95%]'
                : previewDevice === 'tablet'
                ? 'w-[400px] h-[90%]'
                : 'w-[280px] h-[85%]'
            }`}
          >
            {/* Header phone notches or window frame dots */}
            <div className="h-6 bg-neutral-900 border-b border-neutral-850 px-3 flex items-center justify-between shrink-0">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500/50 block" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/50 block" />
                <span className="w-2 h-2 rounded-full bg-green-500/50 block" />
              </div>
              <span className="text-[8px] font-mono text-neutral-500 tracking-wider">
                {previewDevice === 'desktop' ? '1920x1080 - Local Development host' : previewDevice === 'tablet' ? 'iPad Pro Simulation' : 'iPhone 15 Air Glass'}
              </span>
              <span className="text-[8px] font-mono text-gold-505/80 animate-pulse">● LIVE REACTIVE</span>
            </div>

            {/* Iframe simulated scrollable preview dashboard */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-none" style={{
              fontFamily: config.typography.englishFont ? `"${config.typography.englishFont}", sans-serif` : 'inherit'
            }}>
              {/* Dynamic Theme Banner Sandbox */}
              <div className="p-4 rounded-xl border relative overflow-hidden transition-all text-right" style={{
                backgroundColor: config.theme.cardBg,
                borderColor: config.theme.cardBorder,
                borderRadius: config.typography.rounding === 'square' ? '0px' : config.typography.rounding === 'pill' ? '99px' : '16px'
              }}>
                <span className="text-[8px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-2">
                  {isAr ? 'مجسم تجريبي ديناميكي' : 'SANDBOX SIMULATOR EMBED'}
                </span>
                
                <h3 className="text-sm font-black" style={{ color: config.theme.heading, fontWeight: config.typography.weight }}>
                  {isAr ? 'يافطة الفاخرة للافتات الإعلانية المضيئة' : 'YAFTA Architectural Cladding & Signboards'}
                </h3>
                <p className="text-[10px] mt-1 leading-relaxed" style={{ color: config.theme.text }}>
                  {isAr ? 'نقوم بتصنيع كبرى الواجهات التجارية المقاومة للحرائق والرياح بضمان حقيقي مائة شهر.' : 'We construct standard-safe, high-lux titanium neon store displays.'}
                </p>

                {/* Simulated customizable button styled in real-time */}
                <button 
                  className="mt-3.5 px-4 py-2 text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer"
                  style={{
                    backgroundColor: config.theme.btnBg,
                    color: config.theme.btnText,
                    borderRadius: config.typography.rounding === 'square' ? '0px' : config.typography.rounding === 'pill' ? '99px' : '12px'
                  }}
                >
                  <Zap className="w-3 h-3 fill-current text-black" />
                  <span>{isAr ? 'عقد استشارة مجانية مع المهندس الفني 💬' : 'Consult our Design chief 💬'}</span>
                </button>
              </div>

              {/* Grid Bento Blocks styling demo */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-850 space-y-1 text-right">
                  <span className="text-[8px] text-neutral-500 block">Accent shading</span>
                  <strong className="text-xs text-gold-305 font-mono block">#A37A1A</strong>
                  <div className="h-1 w-2/3 bg-gold-505 rounded mt-1"></div>
                </div>
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-850 space-y-1 text-right">
                  <span className="text-[8px] text-neutral-500 block">rounding Ratio</span>
                  <strong className="text-xs text-white block capitalize">{config.typography.rounding} px</strong>
                  <div className="h-1 w-1/3 bg-white rounded mt-1"></div>
                </div>
              </div>

              {/* Aesthetic indicator */}
              <div className="p-2.5 rounded-lg border border-neutral-900 text-center text-[9px] text-neutral-500 font-mono">
                {isAr ? 'تحديث تلقائي لحظي بدون إعادة تحميل الصفحة.' : 'Instantly synchronized with all live pages below.'}
              </div>

            </div>
          </div>
        </div>

        {/* Footer actions of Preview Frame */}
        <div className="pt-2 text-center text-[10px] text-neutral-500 font-mono shrink-0">
          Super Admin Design Studio • YAFTA Egypt 2026
        </div>

      </div>
    </div>
  );
}
