/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ExperienceStudio from './components/ExperienceStudio';
import IntroAnimation from './components/IntroAnimation';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Signage from './pages/Signage';
import Cladding from './pages/Cladding';
import Printing from './pages/Printing';
import Digital from './pages/Digital';
import ClientPortal from './pages/ClientPortal';
import About from './pages/About';
import Contact from './pages/Contact';

// Central Data & Types
import { 
  COMPANY_DETAILS, 
  PROJECTS_DATA, 
  TESTIMONIALS_DATA, 
  SERVICE_DETAILS, 
  STATISTICS_COUNTERS, 
  BEFORE_AFTER_DATA 
} from './data';
import { PageId, Project, CompanyInfo, ServiceDetail, BeforeAfterItem, Testimonial, LogoConfig, UserAccount } from './types';
import LogoRenderer from './components/LogoRenderer';

// Icons
import { 
  Settings, LayoutDashboard, FileEdit, Image, Users2, Briefcase, PhoneCall, 
  Layers, Search, Bot, Database, Sliders, ShieldAlert, Wrench, X, ChevronRight, 
  ChevronLeft, Plus, Trash2, Edit, Save, Download, RefreshCw, Play, CheckCircle, 
  CheckCircle2, ListTodo, Globe, Activity, HardDriveDownload, UserCheck, Inbox, 
  Eye, ShieldCheck, Mail, Phone, MapPin, Calculator, PlusCircle, Check, HelpCircle,
  ExternalLink, Lock, Shield, Server, FileText, Share2, Compass, Cpu, AlertCircle, Heart,
  Sparkles, Home as HomeIcon
} from 'lucide-react';

export default function App() {
  // Bilingual state - defaults to Arabic (yafta) but supports luxury English mode
  const [isAr, setIsAr] = useState<boolean>(true);

  // Premium intro animation on first visit state
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return !localStorage.getItem('yafta_intro_viewed');
  });

  // User Security identity & lock session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('yafta_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  
  // Navigation State
  const [activePage, setActivePage] = useState<PageId>('home');

  // Shared selected project state for viewing case studies overlay modal globally
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // ════════════════════════════════════════════════════
  // ADMIN PANEL CONTROLLER & STATES (REAL-TIME NO-CODE ENGINE)
  // ════════════════════════════════════════════════════
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [activeAdminTab, setActiveAdminTab] = useState<string>('dashboard');
  const [adminSearchQuery, setAdminSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Company Information Settings
  const [companyDetails, setCompanyDetails] = useState<CompanyInfo>(() => {
    const saved = localStorage.getItem('yafta_company_details');
    return saved ? JSON.parse(saved) : COMPANY_DETAILS;
  });

  // 2. Portfolio Items
  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    const saved = localStorage.getItem('yafta_projects_list');
    return saved ? JSON.parse(saved) : PROJECTS_DATA;
  });

  // 3. Services List
  const [servicesList, setServicesList] = useState<ServiceDetail[]>(() => {
    const saved = localStorage.getItem('yafta_services_list');
    return saved ? JSON.parse(saved) : SERVICE_DETAILS;
  });

  // 4. Statistics Counters
  const [statisticsCounters, setStatisticsCounters] = useState<any[]>(() => {
    const saved = localStorage.getItem('yafta_statistics_counters');
    return saved ? JSON.parse(saved) : STATISTICS_COUNTERS;
  });

  // 5. Before & After Slides
  const [beforeAfterItems, setBeforeAfterItems] = useState<BeforeAfterItem[]>(() => {
    const saved = localStorage.getItem('yafta_before_after_items');
    return saved ? JSON.parse(saved) : BEFORE_AFTER_DATA;
  });

  // 6. Custom Content Titles (Hero, About, etc.)
  const [customContent, setCustomContent] = useState<any>(() => {
    const saved = localStorage.getItem('yafta_custom_content');
    return saved ? JSON.parse(saved) : {
      heroTitleAr: 'أعمالنا تتحدث عن جودة ما نقدمه',
      heroTitleEn: 'Our Actions Speak for Precision Quality',
      heroDescAr: 'مجموعة مختارة من المشاريع الهندسية والإنشائية التي نفذتها يافطة باحترافية كاملة في مجالات الهوية البصرية، اللافتات ثلاثية الأبعاد، واجهات الكلادينج، المطبوعات والحلول الرقمية الرائدة.',
      heroDescEn: 'A curated catalog of premium architectural facades, high-end 3D LED storefronts, precision packaging, and futuristic digital systems completed for Egypt’s finest brands.',
      aboutSummaryAr: 'يافطة هي الشريك الحصري الموثوق لتصميم وتصنيع كبرى اللافتات ثلاثية الأبعاد وواجهات الكلادينج المبتكرة وفقاً لأقصى المعايير الهندسية والأمان بضمان حقيقي يدوم طويلاً.',
      aboutSummaryEn: 'YAFTA serves as the premier engineering partner for heavy structural signage, and ultra-durable cladding systems built under wind-calculated structural guidelines.'
    };
  });

  // 7. Testimonials List
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('yafta_testimonials_list');
    return saved ? JSON.parse(saved) : TESTIMONIALS_DATA;
  });

  // 8. Form Inquiries submissions log
  const [submittedInquiries, setSubmittedInquiries] = useState<any[]>(() => {
    const saved = localStorage.getItem('yafta_submitted_inquiries');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        name: 'إكرامي الهواري',
        phone: '01112210464',
        email: 'ekramy@mado-egypt.com',
        company: 'سلسلة حلويات مادو مصر',
        message: 'نريد تصميم وتركيب واجهة كلادينج إضافية مع لافتة أكريليك مفرغ مضيء لفرع التجمع الجديد بمساحة 80 متر مربع.',
        category: 'Contact Form Message',
        estimate: 144000,
        date: '18/06/2026, 02:44 PM',
        status: 'معلق'
      },
      {
        id: 2,
        name: 'مشتريات شركة إعمار مصر',
        phone: '01019082716',
        email: 'contracts@emaar.ae',
        company: 'إعمار مصر العقارية',
        message: 'طلب عرض سعر متكامل لتصنيع اللوحات الإرشادية لـ 15 فيلا ومبنى إداري بمشروع القاهرة الجديدة.',
        category: 'لافتات وحروف',
        estimate: 880000,
        date: '17/06/2026, 11:15 AM',
        status: 'تم الرد'
      }
    ];
  });

  // 9. Media Assets list
  const [mediaFiles, setMediaFiles] = useState<any[]>(() => {
    const saved = localStorage.getItem('yafta_media_files');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'facade_mado_assembly.webp', size: '1.2 MB', dimensions: '1920x1080', format: 'WebP', url: 'https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=800' },
      { id: '2', name: '3d_letters_neon_flex.webp', size: '840 KB', dimensions: '1200x1200', format: 'WebP', url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800' },
      { id: '3', name: 'rigid_boxes_packaging.webp', size: '1.4 MB', dimensions: '1600x1200', format: 'WebP', url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800' },
      { id: '4', name: 'company_profile_2026.pdf', size: '14.2 MB', dimensions: 'N/A', format: 'PDF Document', url: '#' },
      { id: '5', name: 'laser_cutting_line_vlog.mp4', size: '38.4 MB', dimensions: '1080p', format: 'MP4 Video', url: '#' }
    ];
  });

  // 10. Team list
  const [teamMembers, setTeamMembers] = useState<any[]>(() => {
    const saved = localStorage.getItem('yafta_team_members');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', nameAr: 'المصمم إسلام حمدي', nameEn: 'Islam Hamdy', positionAr: 'المدير الإبداعي ومصمم المحاكاة ثلاثية الأبعاد', positionEn: 'Creative Director & 3D Visualizer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150', notes: 'خبير في تنسيق الضوء والظلال ومحاكاة النهار والليل للافتات' },
      { id: '2', nameAr: 'الأستاذ إبراهيم فاروق', nameEn: 'Ibrahim Farouk', positionAr: 'رئيس ورشة التصنيع الميكانيكي ومبرمج CNC', positionEn: 'Head of Mechanical Workshop & CNC Programmer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', notes: 'يضمن تقفيل الاستانلس ولحام الأرجون بدون أي عيوب أو حواف حادة' },
      { id: '3', nameAr: 'المهندس شريف عبد الوهاب', nameEn: 'Sherif Abdel Wahab', positionAr: 'كبير مهندسي التركيبات الشاهقة وسلامة المواقع', positionEn: 'Lead Rigger & Safety Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150', notes: 'يشرف على الأوناش وتوزيع الأحمال لتفادي اهتزاز اللافتات مع الرياح' }
    ];
  });

  // 11. Custom Luxury Theme options
  const [selectedGoldTheme, setSelectedGoldTheme] = useState<string>(() => {
    return localStorage.getItem('yafta_gold_theme') || 'champagne';
  });

  // 11.5 Complete Experience Studio Config
  const DEFAULT_EXPERIENCE_CONFIG = {
    theme: {
      primary: '#050505',
      secondary: '#121212',
      accent: '#e5c060',
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
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-gold-particle-glitter-background-42171-large.mp4',
      scope: 'global'
    },
    animations: {
      preset: 'premium',
      duration: 0.5,
      hoverStyle: 'glow-breath',
      scrollReveal: 'slide-up',
      btnFeedback: 'ripple'
    },
    typography: {
      arabicFont: 'Cairo',
      englishFont: 'Outfit',
      weight: '600',
      rounding: 'round'
    },
    components: {
      navbarStyle: 'floating-border',
      cardStyle: 'glow-hover',
      btnStyle: 'gold-gradient-glow',
      footerStyle: 'corporate-grid',
      calcStyle: 'dark-metallic'
    },
    effects: {
      glow: true,
      neon: false,
      goldGlow: true,
      glass: true,
      float: true,
      parallax: true,
      magnetism: true,
      particles: true,
      glowIntensity: 60
    },
    perf: {
      autoOptimize: true
    }
  };

  const [experienceConfig, setExperienceConfig] = useState<any>(() => {
    const saved = localStorage.getItem('yafta_experience_config');
    return saved ? JSON.parse(saved) : DEFAULT_EXPERIENCE_CONFIG;
  });

  const [isExperienceStudioOpen, setIsExperienceStudioOpen] = useState<boolean>(false);

  // 12. SEO Configuration
  const [seoMeta, setSeoMeta] = useState<any>(() => {
    const saved = localStorage.getItem('yafta_seo_meta');
    return saved ? JSON.parse(saved) : {
      title: 'يافطة للدعاية والإعلان | لافتات LED وكلادينج بالشرق الأوسط',
      description: 'الشركة الرائدة في تصنيع كبرى اللافتات ثلاثية الأبعاد والواجهات التجارية وألواح الكلادينج المقاومة للحريق في جمهورية مصر العربية بضمان 10 سنوات.',
      keywords: 'يافطة, دعاية وإعلان, كلادينج بمصر, حروف بارزة, لافتات مضيئة, ليد سامسونج كوري, واجهات تجارية, مطبوعات علب',
      robots: 'index, follow',
      sitemapUrl: 'https://www.yafta-adv.com/sitemap.xml'
    };
  });

  // 13. Blog Articles
  const [blogArticles, setBlogArticles] = useState<any[]>(() => {
    const saved = localStorage.getItem('yafta_blog_articles');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', titleAr: 'أهمية حساب مقاومة الرياح عند تركيب واجهات الكلادينج العالية', titleEn: 'Evaluating Wind Loads on Skyscraper Cladding', category: 'هندسة ودراسات', date: '19/06/2026', tags: ['كلادينج', 'سلامة'] },
      { id: '2', titleAr: 'مقارنة الاستانلس ستيل عيار 304 والعيارات المقلدة في لافتات الشوارع', titleEn: 'Stainless Steel 304 vs Fake Alloys in Signboards', category: 'خامات ومواد', date: '15/06/2026', tags: ['ستانلس', 'جودة'] },
      { id: '3', titleAr: 'تأثير الإضاءة الخلفية الهالة (Halo Backlit) على جذب المارة للمتاجر الفاخرة', titleEn: 'Psychology of Halo Lighting in Premium Reseller Stores', category: 'تصاميم إبداعية', date: '10/06/2026', tags: ['إضاءة', 'دعاية'] }
    ];
  });

  // 14. Activity Logs Trace Queue
  const [activityLogs, setActivityLogs] = useState<any[]>(() => {
    const saved = localStorage.getItem('yafta_activity_logs');
    if (saved) return JSON.parse(saved);
    return [
      { time: '09:41:10 AM', text: 'تم بدء جلسة التحكم الآمنة بصلاحيات مالك الموقع' },
      { time: '09:12:05 AM', text: 'فحص الحماية الأمنية لجدران الحماية: سليم (100%)' },
      { time: '08:00:00 AM', text: 'توليد تلقائي لخرائط الأرشفة sitemap.xml بنجاح' }
    ];
  });

  // 15. Admin User Credentials
  const [adminUsers, setAdminUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('yafta_admin_users');
    if (saved) return JSON.parse(saved);
    return [
      { username: 'admin', role: 'المالك المشرف (Superadmin)', email: 'islamhamdypro@gmail.com', lastLogin: 'اليوم، 09:30 AM' },
      { username: 'editor1', role: 'محرر ميديا متميز (Senior Editor)', email: 'yaftagroupadv@gmail.com', lastLogin: 'أمس، 05:40 PM' }
    ];
  });

  // Logo Configuration dynamic state with Undo / Redo engine
  const DEFAULT_LOGO_CONFIG: LogoConfig = {
    logoType: 'icon',
    imageSrcLight: '',
    imageSrcDark: '',
    svgCodeLight: '',
    svgCodeDark: '',
    brandTextAr: 'يافطة',
    brandTextEn: 'YAFTA',
    brandSubtitleAr: 'وكالة يافطة للدعاية والإعلان',
    brandSubtitleEn: 'ADVERTISING AGENCY',
    sizeMobile: 48,
    sizeTablet: 48,
    sizeDesktop: 48,
    colorAccent: '#e5c060',
    opacity: 1,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
    position: 'left',
    customX: 0,
    customY: 0,
    visibleInHeader: true,
    visibleInHero: true,
    visibleInFooter: true,
    visibleInMenu: true,
    animation: 'none',
    hoverEffect: 'scale',
    scrollEffect: 'none',
  };

  const [logoConfig, setLogoConfig] = useState<LogoConfig>(() => {
    const saved = localStorage.getItem('yafta_logo_config');
    return saved ? JSON.parse(saved) : DEFAULT_LOGO_CONFIG;
  });

  const [logoHistory, setLogoHistory] = useState<{ undo: LogoConfig[], redo: LogoConfig[] }>({
    undo: [],
    redo: [],
  });

  // Safe activity log entry maker with functional state updater (prevents stale closure & infinite loops)
  const addActivity = (text: string) => {
    const timeStr = new Date().toLocaleTimeString();
    setActivityLogs((prev) => {
      const newLogs = [{ time: timeStr, text }, ...prev.slice(0, 50)];
      localStorage.setItem('yafta_activity_logs', JSON.stringify(newLogs));
      return newLogs;
    });
  };

  // Track live synchronization status with LocalStorage for visual feedback dot
  const [isSynced, setIsSynced] = useState<boolean>(true);
  const isSyncingInit = useRef(true);

  useEffect(() => {
    if (isSyncingInit.current) {
      isSyncingInit.current = false;
      return;
    }
    setIsSynced(false);
    const handler = setTimeout(() => {
      setIsSynced(true);
      const timestamp = new Date().toLocaleTimeString();
      addActivity(isAr 
        ? `[${timestamp}] تم بنجاح حوسبة ومزامنة البيانات في الذاكرة المحلية الآمنة` 
        : `[${timestamp}] State fully synchronized and saved to localStorage audit trace.`
      );
    }, 600);
    return () => clearTimeout(handler);
  }, [
    companyDetails,
    projectsList,
    servicesList,
    statisticsCounters,
    beforeAfterItems,
    customContent,
    testimonialsList,
    submittedInquiries,
    mediaFiles,
    teamMembers,
    blogArticles,
    adminUsers,
    isAr,
    logoConfig,
    experienceConfig,
    seoMeta,
    selectedGoldTheme
  ]);

  const updateLogoConfig = (newConfig: LogoConfig, recordHistory = true) => {
    if (recordHistory) {
      setLogoHistory(prev => ({
        undo: [...prev.undo.slice(-19), logoConfig], // max 20 levels
        redo: []
      }));
    }
    setLogoConfig(newConfig);
    localStorage.setItem('yafta_logo_config', JSON.stringify(newConfig));
  };

  const handleLogoUndo = () => {
    if (logoHistory.undo.length === 0) return;
    const previous = logoHistory.undo[logoHistory.undo.length - 1];
    const newUndo = logoHistory.undo.slice(0, -1);
    
    setLogoHistory({
      undo: newUndo,
      redo: [...logoHistory.redo, logoConfig]
    });
    setLogoConfig(previous);
    localStorage.setItem('yafta_logo_config', JSON.stringify(previous));
    triggerToast(isAr ? 'تم التراجع عن آخر تعديل للشعار ↩️' : 'Logo action undone ↩️');
  };

  const handleLogoRedo = () => {
    if (logoHistory.redo.length === 0) return;
    const next = logoHistory.redo[logoHistory.redo.length - 1];
    const newRedo = logoHistory.redo.slice(0, -1);
    
    setLogoHistory({
      undo: [...logoHistory.undo, logoConfig],
      redo: newRedo
    });
    setLogoConfig(next);
    localStorage.setItem('yafta_logo_config', JSON.stringify(next));
    triggerToast(isAr ? 'تم إعادة تطبيق التعديل المتراجع عنه 🔄' : 'Logo action redone 🔄');
  };

  // Simple toast trigger
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // addActivity is hoisted above the synchronization tracking useEffect to prevent execution order conflicts

  // Safe save configurations
  const saveCompanyDetails = (details: CompanyInfo) => {
    setCompanyDetails(details);
    localStorage.setItem('yafta_company_details', JSON.stringify(details));
    triggerToast('تم فورا حفظ وتحديث بيانات الاتصال والشركة في كامل طبقات الموقع! 💾');
    addActivity(`تعديل وحفظ بيانات الشركة والاتصال: ${details.nameEn}`);
  };

  const handleAddInquiry = (inquiry: any) => {
    const newInq = {
      ...inquiry,
      id: Date.now(),
      status: 'معلق'
    };
    const updated = [newInq, ...submittedInquiries];
    setSubmittedInquiries(updated);
    localStorage.setItem('yafta_submitted_inquiries', JSON.stringify(updated));
    triggerToast(isAr ? 'تم تسجيل اهتمامك بنظام الحوسبة الفورية بنجاح! 💰' : 'Calculator estimate logged in CRM!');
    addActivity(`طلب حوسبة مبيعات من: ${inquiry.name} • تقدير: ${inquiry.estimate?.toLocaleString() || 'اتصال مباشر'} ج.م`);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('yafta_current_user', JSON.stringify(user));
    addActivity(`سجل دخول آمن للمستخدم: ${user.name} بنجاح • رتبة: ${user.role}`);
    setActivePage('portal');
  };

  const handleLogout = () => {
    if (currentUser) {
      addActivity(`سجل خروج آمن للمستخدم: ${currentUser.name}`);
    }
    setCurrentUser(null);
    localStorage.removeItem('yafta_current_user');
    setActivePage('home');
    triggerToast(isAr ? 'تم تسجيل الخروج بنجاح تام!' : 'Logged out securely.');
  };

  const handleBottomNavClick = (target: string) => {
    if (target === 'home') {
      setActivePage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'apps') {
      setActivePage('home');
      setTimeout(() => {
        const el = document.getElementById('featured-apps');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    } else if (target === 'services') {
      setActivePage('services');
    } else if (target === 'news') {
      setActivePage('home');
      setTimeout(() => {
        const el = document.getElementById('news-and-articles');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    } else if (target === 'contact') {
      setActivePage('contact');
    }
  };

  const saveCustomContent = (newContent: any) => {
    setCustomContent(newContent);
    localStorage.setItem('yafta_custom_content', JSON.stringify(newContent));
    triggerToast('تم فورا تطبيق وحفظ النصوص والمنشتات الإعلانية بنجاح! 🗣️');
    addActivity('تعديل وحفظ خطاطب ونصوص الصفحة الرئيسية والمنشتات');
  };

  // Apply visual theme presets dynamically via custom experience studio variables
  useEffect(() => {
    localStorage.setItem('yafta_gold_theme', selectedGoldTheme);
    localStorage.setItem('yafta_experience_config', JSON.stringify(experienceConfig));
    const styleId = 'yafta-custom-theme-style';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    
    // Inject custom Google Fonts link dynamically to support Typography Studio
    const fontId = 'yafta-dynamic-fonts-injector';
    let fontLink = document.getElementById(fontId) as HTMLLinkElement;
    if (!fontLink) {
      fontLink = document.createElement('link');
      fontLink.id = fontId;
      fontLink.setAttribute('rel', 'stylesheet');
      document.head.appendChild(fontLink);
    }
    
    const arF = experienceConfig.typography.arabicFont || 'Cairo';
    const enF = experienceConfig.typography.englishFont || 'Outfit';
    fontLink.setAttribute('href', `https://fonts.googleapis.com/css2?family=${arF.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&family=${enF.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&display=swap`);

    const roundingPx = 
      experienceConfig.typography.rounding === 'square' ? '0px' : 
      experienceConfig.typography.rounding === 'subtle' ? '8px' : 
      experienceConfig.typography.rounding === 'round' ? '18px' : '99px';

    const colorStyles = `
      :root {
        --color-primary: ${experienceConfig.theme.primary} !important;
        --color-secondary: ${experienceConfig.theme.secondary} !important;
        --color-accent: ${experienceConfig.theme.accent} !important;
        --color-text: ${experienceConfig.theme.text} !important;
        --color-heading: ${experienceConfig.theme.heading} !important;
        
        --color-gold-505: ${experienceConfig.theme.accent} !important;
        --color-gold-500: ${experienceConfig.theme.accent}dd !important;
        --color-gold-300: ${experienceConfig.theme.accent}aa !important;
        --color-gold-200: ${experienceConfig.theme.accent}55 !important;
        --color-gold-950: ${experienceConfig.theme.primary} !important;
        
        --font-sans: "${experienceConfig.typography.englishFont}", "${experienceConfig.typography.arabicFont}", Cairo, Outfit, system-ui, -apple-system, sans-serif !important;
        --border-radius-base: ${roundingPx} !important;
      }
      
      body {
        background-color: ${experienceConfig.theme.primary} !important;
        color: ${experienceConfig.theme.text} !important;
        font-family: "${experienceConfig.typography.englishFont}", "${experienceConfig.typography.arabicFont}", Cairo, Outfit, sans-serif !important;
        transition: background-color ${experienceConfig.animations.duration || 0.4}s ease, color ${experienceConfig.animations.duration || 0.4}s ease;
      }
      
      /* Global elements adjustments */
      .rounded-xl, .rounded-2xl, .rounded-3xl, .rounded-lg, .rounded-md {
        border-radius: var(--border-radius-base) !important;
      }
      
      /* Apply custom button styles globally if gold-gradient-glow is enabled */
      ${experienceConfig.components.btnStyle === 'gold-gradient-glow' ? `
      .bg-gradient-to-r.from-gold-300 {
        background: linear-gradient(135deg, ${experienceConfig.theme.btnBg} 0%, ${experienceConfig.theme.btnHover} 100%) !important;
        color: ${experienceConfig.theme.btnText} !important;
        box-shadow: 0 4px 15px ${experienceConfig.theme.shadow || 'rgba(0,0,0,0.3)'} !important;
      }
      ` : ''}

      /* Apply card border & background customized override */
      .glass-panel, .bg-neutral-900, .bg-neutral-950\\/80, .bg-neutral-900\\/90 {
        background-color: ${experienceConfig.theme.cardBg} !important;
        border-color: ${experienceConfig.theme.cardBorder} !important;
        box-shadow: ${experienceConfig.effects.glow ? `0 10px 30px ${experienceConfig.theme.shadow || 'rgba(229,192,96,0.05)'}` : 'none'} !important;
      }

      /* Neon borders style matching SFX */
      ${experienceConfig.effects.neon ? `
      .glass-panel, .bg-neutral-900, .bg-neutral-950\\/80, .bg-neutral-900\\/90 {
        border-color: ${experienceConfig.theme.accent} !important;
        box-shadow: 0 0 12px ${experienceConfig.theme.accent}33, inset 0 0 4px ${experienceConfig.theme.accent}22 !important;
      }
      ` : ''}
    `;
    styleTag.innerHTML = colorStyles;
  }, [experienceConfig, selectedGoldTheme]);

  // Clean backup exports
  const downloadBackup = () => {
    const backupObj = {
      companyDetails,
      projectsList,
      servicesList,
      statisticsCounters,
      beforeAfterItems,
      customContent,
      testimonialsList,
      submittedInquiries,
      mediaFiles,
      teamMembers,
      selectedGoldTheme,
      seoMeta,
      blogArticles,
      adminUsers,
      backupVersion: '2.5.0-gold-edition',
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `yafta_cm_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
    triggerToast('تم تصدير وتحميل النسخة الاحتياطية للموقع بنجاح كملف JSON! 📥');
    addActivity('تصدير وتحميل ملف النسخة الاحتياطية الكامل لنظام الإدارة');
  };

  const resetToFactoryDefaults = () => {
    if (confirm(isAr ? 'هل أنت متأكد من مسح جميع التعديلات والعودة للإعدادات الافتراضية؟' : 'Reset all content to factory code defaults?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Auto scroll to top on page switches
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [activePage]);

  // Sync page direction RTL/LTR
  useEffect(() => {
    if (isAr) {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.classList.remove('rtl');
    }
  }, [isAr]);

  // Page routing switchboard
  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return (
          <Home 
            isAr={isAr} 
            setActivePage={setActivePage} 
            onSelectProject={setSelectedProject} 
            featuredTestimonial={testimonialsList[0]}
            projectsList={projectsList}
            statisticsCounters={statisticsCounters}
            customContent={customContent}
            blogArticles={blogArticles}
            testimonialsList={testimonialsList}
          />
        );
      case 'services':
        return (
          <Services 
            isAr={isAr} 
            setActivePage={setActivePage} 
            servicesList={servicesList}
          />
        );
      case 'portfolio':
        return (
          <Portfolio 
            isAr={isAr} 
            setActivePage={setActivePage} 
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            projectsList={projectsList}
            setProjectsList={setProjectsList}
            beforeAfterItems={beforeAfterItems}
            currentUser={currentUser}
          />
        );
      case 'signage':
        return (
          <Signage 
            setActivePage={setActivePage} 
            isAr={isAr} 
          />
        );
      case 'cladding':
        return (
          <Cladding 
            setActivePage={setActivePage} 
            isAr={isAr} 
          />
        );
      case 'printing':
        return (
          <Printing 
            setActivePage={setActivePage} 
            isAr={isAr} 
          />
        );
      case 'digital':
        return (
          <Digital 
            setActivePage={setActivePage} 
            isAr={isAr} 
          />
        );
      case 'portal':
        return (
          <ClientPortal 
            isAr={isAr} 
            companyInfo={companyDetails} 
            setActivePage={setActivePage} 
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        );
      case 'about':
        return (
          <About 
            setActivePage={setActivePage} 
            isAr={isAr} 
          />
        );
      case 'contact':
        return (
          <Contact 
            isAr={isAr} 
            companyInfo={companyDetails} 
            setActivePage={setActivePage} 
            onAddInquiry={handleAddInquiry}
          />
        );
      default:
        return (
          <Home 
            isAr={isAr} 
            setActivePage={setActivePage} 
            onSelectProject={setSelectedProject} 
            featuredTestimonial={testimonialsList[0]}
            projectsList={projectsList}
            statisticsCounters={statisticsCounters}
            customContent={customContent}
            blogArticles={blogArticles}
            testimonialsList={testimonialsList}
          />
        );
    }
  };

  // Dynamic background selector & renderer
  const renderExperienceBackground = () => {
    const bgType = experienceConfig.background?.type || 'luxury-gold';
    
    if (bgType === 'video') {
      return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30 mix-blend-screen bg-black">
          <video 
            key={experienceConfig.background?.videoUrl}
            src={experienceConfig.background?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-luxury-gold-particle-glitter-background-42171-large.mp4'}
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    
    if (bgType === 'animated-gradient') {
      return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-950" style={{ animation: 'pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
      );
    }

    if (bgType === 'image' && experienceConfig.background?.imageUrl) {
      return (
        <div 
          className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center opacity-30 bg-no-repeat"
          style={{ backgroundImage: `url(${experienceConfig.background.imageUrl})` }}
        />
      );
    }

    if (bgType === 'solid') {
      return (
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundColor: experienceConfig.theme?.primary || '#050505' }} />
      );
    }

    if (bgType === 'gradient') {
      return (
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: `linear-gradient(135deg, ${experienceConfig.background?.gradientStart || '#11100c'}, ${experienceConfig.background?.gradientEnd || '#000000'})` }} />
      );
    }

    // Floating background blobs/spheres if floating effects are enabled:
    if (experienceConfig.effects?.float) {
      return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-yellow-500/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-yellow-500/5 blur-[100px]" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-gold-505 selection:text-neutral-950 font-sans relative overflow-x-hidden">
      
      {/* Premium cinematic intro shown on first visit */}
      <AnimatePresence>
        {showIntro && (
          <IntroAnimation
            isAr={isAr}
            onComplete={() => {
              setShowIntro(false);
              localStorage.setItem('yafta_intro_viewed', 'true');
            }}
          />
        )}
      </AnimatePresence>

      {/* Visual Experience dynamic backgrounds */}
      {renderExperienceBackground()}
      
      {/* Toast Alert overlay */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-neutral-900 border-2 border-gold-505/85 px-6 py-3.5 rounded-2xl text-xs font-bold text-white shadow-2xl z-55 flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5 text-gold-505 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Dynamic luxury background patterns */}
      <div className="absolute inset-x-0 top-0 h-[1000px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-950/20 via-black to-transparent pointer-events-none z-0"></div>
      
      {/* Luxury Navigation Bar (reads company details from live edit state) */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isAr={isAr} 
        setIsAr={setIsAr} 
        companyInfo={companyDetails} 
        logoConfig={logoConfig}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main active page content */}
      <main className="relative z-10 flex-grow pt-4 pb-16 md:pb-4">
        {renderActivePage()}
      </main>

      {/* Luxury Footer (reads company details from live edit state) */}
      <Footer 
        setActivePage={setActivePage} 
        isAr={isAr} 
        companyInfo={companyDetails} 
        logoConfig={logoConfig}
      />

      {/* 📱 MODERN ANDROID-FIRST MOBILE STICKY BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/80 backdrop-blur-xl border-t border-gold-505/20 md:hidden flex justify-around items-center px-2 py-2.5 pb-safe shadow-[0_-10px_35px_rgb(0,0,0,0.9)] animate-fade-in">
        {[
          { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home', icon: HomeIcon, action: () => handleBottomNavClick('home') },
          { id: 'apps', labelAr: 'التطبيقات', labelEn: 'Apps', icon: Calculator, action: () => handleBottomNavClick('apps') },
          { id: 'services', labelAr: 'الخدمات', labelEn: 'Services', icon: Layers, action: () => handleBottomNavClick('services') },
          { id: 'news', labelAr: 'الأخبار', labelEn: 'News', icon: FileText, action: () => handleBottomNavClick('news') },
          { id: 'contact', labelAr: 'اتصل بنا', labelEn: 'Contact', icon: Phone, action: () => handleBottomNavClick('contact') }
        ].map((btn) => {
          let isActive = false;
          if (btn.id === 'home' && activePage === 'home') {
            isActive = true;
          } else if (btn.id === 'services' && activePage === 'services') {
            isActive = true;
          } else if (btn.id === 'contact' && activePage === 'contact') {
            isActive = true;
          }
          
          const IconComponent = btn.icon;
          return (
            <button
              key={btn.id}
              onClick={btn.action}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-300 relative cursor-pointer ${
                isActive 
                  ? 'text-gold-305 bg-gold-950/40 border border-gold-505/10 scale-105 font-bold' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <IconComponent className={`w-5 h-5 ${isActive ? 'text-gold-305 drop-shadow-[0_0_5px_rgba(229,192,96,0.5)]' : 'text-neutral-400'}`} />
              <span className="text-[9px] font-bold tracking-tight">{isAr ? btn.labelAr : btn.labelEn}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-gold-505 shadow-[0_0_5px_#e5c060] animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* ⚙️ CONSTANT FLOATING ADMIN PORTAL TOGGLE - Restricted to Admin Role */}
      {currentUser?.role === 'Admin' && (
        <button 
          onClick={() => {
            setIsAdminOpen(!isAdminOpen);
            addActivity(isAdminOpen ? 'إغلاق لوحة تحكم الإدارة' : 'فتح لوحة تحكم الإدارة الشاملة');
          }}
          className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-full bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-gold-300 font-extrabold text-xs shadow-2xl border-2 transition-all duration-300 flex items-center gap-2.5 cursor-pointer box-glow font-mono uppercase tracking-widest ${
            isSynced ? 'border-gold-505/60 hover:border-gold-300 hover:scale-105 active:scale-95' : 'border-amber-500/70 shadow-lg shadow-amber-500/20 scale-102 animate-pulse'
          }`}
          id="admin-sidebar-toggle-button"
        >
          {/* Live connectivity status dot */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSynced ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isSynced ? 'bg-emerald-500' : 'bg-amber-500'}`} title={isSynced ? 'State Synced' : 'Syncing...'}></span>
          </span>
          <Settings className="w-4 h-4 animate-spin-slow text-gold-505" />
          <span className="text-white text-[11px] font-sans font-extrabold">{isAr ? 'لوحة تحكم يافطة 🛠️' : 'Yafta Console 🛠️'}</span>
        </button>
      )}

      {/* ════════════════════════════════════════════════════
          COLLAPSIBLE MASTER ADMIN SIDEBAR PANEL (BLACK & GOLD)
          ═════════════════════════════════ </App.tsx> ═════════ */}
      {currentUser?.role === 'Admin' && isAdminOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] md:w-[600px] lg:w-[680px] xl:w-[740px] bg-neutral-950 border-l-2 border-gold-505/40 flex flex-col justify-between shadow-2xl shadow-gold-505/10 animate-slide-in text-right font-sans">
          
          {/* Header Panel */}
          <div className="p-5 md:p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 border-b border-gold-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsAdminOpen(false)}
                className="p-2 rounded-full border border-neutral-800 hover:border-gold-505 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all cursor-pointer mr-2"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div>
                <span className="text-[9px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded border border-gold-500/30 uppercase tracking-widest font-black leading-none inline-block">
                  {isAr ? 'منصة إدارة وتخصيص يافطة • مالك ومطور' : 'YAFTA ADVERTISING CMS v2.6'}
                </span>
                <h2 className="text-xl font-black text-white flex items-center gap-1.5 mt-1">
                  <Sliders className="w-5 h-5 text-gold-505" />
                  <span>{isAr ? 'لوحة إدارة الموقع الشاملة' : 'Control Panel Console'}</span>
                </h2>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button 
                onClick={downloadBackup}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-gold-500/10 hover:border-gold-505 text-xs text-neutral-300 font-bold opacity-80 hover:opacity-100 flex items-center gap-1.5 transition-all cursor-pointer"
                title={isAr ? 'تنزيل نسخة احتياطية' : 'Export JSON Backup'}
              >
                <Download className="w-3.5 h-3.5 text-gold-505" />
                <span className="text-[10px] font-sans font-bold">Backup</span>
              </button>
            </div>
          </div>

          {/* Search Bar Block */}
          <div className="px-5 md:px-6 py-3 bg-neutral-900/60 border-b border-gold-500/5 flex items-center justify-between gap-3">
            <div className="relative flex-grow">
              <input 
                type="text"
                placeholder={isAr ? 'البحث السريع في إعدادات وعناصر لوحة التحكم...' : 'Search configs, services, submissions, logs...'}
                value={adminSearchQuery}
                onChange={(e) => setAdminSearchQuery(e.target.value)}
                className="w-full bg-neutral-950/80 border border-gold-500/15 rounded-xl py-2 px-3 pl-10 text-xs text-neutral-200 focus:outline-none focus:border-gold-505 pr-8 field-text text-right font-sans font-bold"
              />
              <Search className="w-4 h-4 text-gold-505 absolute left-3 top-2.5" />
            </div>

            <button 
              onClick={() => {
                setAdminSearchQuery('');
                triggerToast(isAr ? 'تم تصفير فلتر البحث' : 'Search query reset');
              }}
              className="text-[10px] text-neutral-500 hover:text-white"
            >
              {isAr ? 'إلغاء الفلتر' : 'Reset'}
            </button>
          </div>

          {/* Tab Selection Area - Scrollable horizontally */}
          <div className="px-5 md:px-6 py-2.5 bg-neutral-950 border-b border-gold-500/10 overflow-x-auto flex gap-1.5 scrollbar-none shrink-0" dir={isAr ? "rtl" : "ltr"}>
            {[
              { id: 'dashboard', label: isAr ? '📊 نظرة سريعة' : 'Dashboard', icon: LayoutDashboard },
              { id: 'logo', label: isAr ? '🏆 مدير الشعارات' : 'Logo Manager', icon: Sparkles },
              { id: 'content', label: isAr ? '✍️ النصوص' : 'Content', icon: FileEdit },
              { id: 'contact', label: isAr ? '📞 الاتصالات' : 'Contacts', icon: PhoneCall },
              { id: 'services', label: isAr ? '🛠️ الخدمات' : 'Services', icon: Wrench },
              { id: 'portfolio', label: isAr ? '🖼️ المشاريع' : 'Portfolio', icon: Image },
              { id: 'media', label: isAr ? '📁 الميديا' : 'Media', icon: Server },
              { id: 'clients', label: isAr ? '👥 العملاء' : 'Clients', icon: Users2 },
              { id: 'team', label: isAr ? '👨‍✈️ الفريق' : 'Team Staff', icon: UserCheck },
              { id: 'design', label: isAr ? '🎨 المظهر والذهبي' : 'Design Accents', icon: Sliders },
              { id: 'seo', label: isAr ? '🌐 تهيئة محركات الآرشفة' : 'SEO', icon: Globe },
              { id: 'blog', label: isAr ? '📕 المدونة' : 'Blog', icon: FileText },
              { id: 'forms', label: isAr ? '📩 طلبات وعروض الأسعار' : 'Inbound Inquiries', icon: Inbox },
              { id: 'users', label: isAr ? '🔐 الحسابات والمطورين' : 'Operators', icon: Lock },
              { id: 'backup', label: isAr ? '💾 النسخ والإنقاذ' : 'Backup Engine', icon: Database },
              { id: 'security', label: isAr ? '🛡️ الحماية وسجلات الحظر' : 'Security Log', icon: Shield }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    activeAdminTab === tab.id
                      ? 'bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 font-black shadow-lg scale-102 font-bold'
                      : 'text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-850'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Master Workspace Content (Scrollable content area) */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 scrollbar-thin max-h-[calc(100vh-220px)] text-right">
            
            {/* ════════════════════════════
                1. DASHBOARD OVERVIEW TAB
                ════════════════════════════ */}
            {activeAdminTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in font-sans">
                {/* Stats Blocks */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-neutral-900 border border-gold-500/10 p-4 rounded-2xl">
                    <span className="text-[10px] text-neutral-400 block font-bold">{isAr ? 'عدد المشاريع' : 'Projects'}</span>
                    <strong className="text-2xl text-gold-505 font-mono block mt-1">{projectsList.length}</strong>
                    <span className="text-[9px] text-neutral-500">{isAr ? 'منجزة بالكامل' : 'Live catalog'}</span>
                  </div>
                  <div className="bg-neutral-900 border border-gold-500/10 p-4 rounded-2xl">
                    <span className="text-[10px] text-neutral-400 block font-bold">{isAr ? 'الوارد والتقديرات' : 'Inquiries'}</span>
                    <strong className="text-2xl text-gold-505 font-mono block mt-1">{submittedInquiries.length}</strong>
                    <span className="text-[9px] text-neutral-500">{isAr ? 'نماذج استفسار وحاسبات' : 'Contact + CRM'}</span>
                  </div>
                  <div className="bg-neutral-900 border border-gold-500/10 p-4 rounded-2xl">
                    <span className="text-[10px] text-neutral-400 block font-bold">{isAr ? 'الزوار التقديري' : 'Simulated Hits'}</span>
                    <strong className="text-2xl text-emerald-500 font-mono block mt-1">481</strong>
                    <span className="text-[9px] text-emerald-600">● {isAr ? 'متصل الآن' : 'Active users'}</span>
                  </div>
                  <div className="bg-neutral-900 border border-gold-500/10 p-4 rounded-2xl">
                    <span className="text-[10px] text-neutral-400 block font-bold">{isAr ? 'حالة الحماية' : 'Security Shield'}</span>
                    <strong className="text-2xl text-gold-505 font-mono block mt-1">99.8%</strong>
                    <span className="text-[9px] text-gold-500">{isAr ? 'جدران الحماية فاعلة' : 'WAF Protected'}</span>
                  </div>
                </div>

                {/* Quick informational note */}
                <div className="bg-gold-950/40 border border-gold-550/25 p-4 rounded-2xl space-y-2 text-right">
                  <h4 className="text-xs font-black text-gold-300 flex items-center gap-1 justify-end">
                    <span>{isAr ? 'مرحبا بك في معقل يافطة الإعلاني الذكي' : 'Welcome to YAFTA Mechanical Console'}</span>
                    <Sparkles className="w-4 h-4 text-gold-505 animate-pulse" />
                  </h4>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    {isAr 
                      ? 'يمكنك تعديل أي بند تراه بالموقع وسينعكس فوراً بالواجهة الأمامية للمستخدم دون الحاجة للمساس بالأكواد الأساسية. التعديلات تحفظ تلقائياً في ذاكرة المتصفح المحلية لتجربة إدارة تفاعلية متكاملة.'
                      : 'Modify any string, coordinate, service configuration, or team details dynamically. Real-time updates utilize deep state-propagation.'}
                  </p>
                </div>

                {/* Submissions snippets */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5 justify-end">
                    <span>{isAr ? 'أحدث استمارات وعروض الأسعار الواردة' : 'Recent Inbounds Logs'}</span>
                    <Inbox className="w-4.5 h-4.5 text-gold-505" />
                  </h3>

                  <div className="space-y-2.5">
                    {submittedInquiries.slice(0, 2).map((inq: any) => (
                      <div key={inq.id} className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-xl text-right space-y-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="bg-gold-950 text-gold-300 px-2.5 py-0.5 rounded border border-gold-500/10 font-bold">{inq.category}</span>
                          <span className="text-neutral-500 font-mono">{inq.date}</span>
                        </div>
                        <h4 className="text-xs font-extrabold text-white">{inq.name} ({inq.company})</h4>
                        <p className="text-[11px] text-neutral-400 line-clamp-2">{inq.message}</p>
                        {inq.estimate && (
                          <div className="text-[10px] text-gold-300 pt-1 border-t border-neutral-800 mt-1 flex justify-between">
                            <span>{isAr ? 'القيمة التقريبية المطلوبة:' : 'Calculated Value:'}</span>
                            <strong className="font-mono text-emerald-400 font-extrabold">{inq.estimate.toLocaleString()} ج.م</strong>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activities Queue */}
                <div className="space-y-2.5 pt-2">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5 justify-end">
                    <span>{isAr ? 'سجل العمليات والتدقيق التلقائي المنفذ' : 'System Operation Trace logs'}</span>
                    <Activity className="w-4.5 h-4.5 text-gold-505" />
                  </h3>

                  <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-xl divide-y divide-neutral-800/60 text-right space-y-2 max-h-[160px] overflow-y-auto scrollbar-thin">
                    {activityLogs.map((log: any, idx: number) => (
                      <div key={idx} className="text-[10px] pt-1.5 first:pt-0 flex justify-between font-mono">
                        <span className="text-neutral-300">{log.text}</span>
                        <span className="text-gold-505 shrink-0 ml-4 font-bold">[{log.time}]</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════
                1.5. LOGO MANAGER TAB
                ════════════════════════════ */}
            {activeAdminTab === 'logo' && (
              <div className="space-y-6 animate-fade-in text-right font-sans">
                {/* Administrative Notification and Undo / Redo Bar */}
                <div className="bg-neutral-900 border border-gold-500/10 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-[10px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded tracking-wider uppercase font-mono font-bold">
                      {isAr ? 'مدير الهوية البصرية والشعارات' : 'BRAND IDENTITY & LOGO ENGINE'}
                    </span>
                    <h3 className="text-base font-black text-white mt-1">
                      {isAr ? 'التحكم الديناميكي فائق الدقة بالشعارات الموحدة' : 'Unified Brand Logo Controller'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Undo Action */}
                    <button
                      onClick={handleLogoUndo}
                      disabled={logoHistory.undo.length === 0}
                      className={`p-2 rounded-lg border font-bold text-xs flex items-center gap-1.5 transition-all ${
                        logoHistory.undo.length > 0
                          ? 'border-gold-505 bg-neutral-950 text-gold-300 hover:bg-gold-500/10 cursor-pointer'
                          : 'border-neutral-800 text-neutral-600 cursor-not-allowed opacity-40'
                      }`}
                      title={isAr ? 'تراجع (Ctrl+Z)' : 'Undo last edit'}
                    >
                      <RefreshCw className="w-3.5 h-3.5 rotate-180" />
                      <span>{isAr ? 'تراجع' : 'Undo'}</span>
                    </button>

                    {/* Redo Action */}
                    <button
                      onClick={handleLogoRedo}
                      disabled={logoHistory.redo.length === 0}
                      className={`p-2 rounded-lg border font-bold text-xs flex items-center gap-1.5 transition-all ${
                        logoHistory.redo.length > 0
                          ? 'border-gold-505 bg-neutral-950 text-gold-300 hover:bg-gold-500/10 cursor-pointer'
                          : 'border-neutral-800 text-neutral-600 cursor-not-allowed opacity-40'
                      }`}
                      title={isAr ? 'إعادة تطبيق (Ctrl+Y)' : 'Redo edit'}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إعادة' : 'Redo'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(isAr ? 'هل تود بالتأكيد استعادة الشعار الأصلي وتصفير جميع التخصيصات؟' : 'Are you sure you want to restore the legacy brand assets?')) {
                          updateLogoConfig(DEFAULT_LOGO_CONFIG);
                          addActivity('استرجاع الهوية والشعار الافتراضي للموقع');
                          triggerToast(isAr ? 'تم استرجاع شعار يافطة الفخم بنجاح' : 'Default luxury brand logo restored!');
                        }
                      }}
                      className="p-2 border border-rose-500/20 bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      {isAr ? '🔄 شعار المصنع' : 'Restore Legacy'}
                    </button>
                  </div>
                </div>

                {/* Live Section Mock-up Previews */}
                <div className="bg-neutral-900 border border-gold-500/15 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-bold text-gold-300 uppercase tracking-widest flex items-center gap-1.5 justify-end">
                    <span>{isAr ? 'معاينة النماذج الحية (تحديثات فورية)' : 'Interactive Placement & Styles Mockup'}</span>
                    <Eye className="w-4 h-4 text-gold-550 text-gold-505" />
                  </h4>
                  <p className="text-[11px] text-zinc-400 -mt-2 leading-relaxed">
                    {isAr 
                      ? 'اختر وضع العرض لمشاهدة كيف سيتصرف الشعار على أحجام مختلفة وأنماط إضاءة منفصلة.' 
                      : 'Simulate how your customized setup renders dynamically inside header navigation blocks vs. editorial dark canvases.'}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Simulated Dark Canvas Render */}
                    <div className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 space-y-3 relative overflow-hidden">
                      <div className="absolute top-2 left-2 text-[8px] uppercase tracking-widest bg-zinc-900 text-gold-505 px-1.5 rounded border border-gold-500/10 font-mono">
                        {isAr ? 'خلفية داكنة (شريط رئيسي)' : 'Dark Canvas Preview'}
                      </div>
                      
                      <div className="pt-2 flex justify-center min-h-[90px] items-center border border-dashed border-neutral-800 rounded-lg p-2 bg-[#050505]">
                        <LogoRenderer config={logoConfig} isAr={isAr} mode="dark" />
                      </div>
                      <p className="text-[10px] text-zinc-500 text-center font-mono">
                        {isAr ? 'نمط الليل / الرأس العائم' : 'Used on Header, Menu drawer and Footer dark grids'}
                      </p>
                    </div>

                    {/* Simulated Light Canvas Render */}
                    <div className="bg-white text-neutral-950 border border-neutral-200 rounded-xl p-4 space-y-3 relative overflow-hidden">
                      <div className="absolute top-2 left-2 text-[8px] uppercase tracking-widest bg-neutral-100 text-neutral-800 px-1.5 rounded border border-neutral-200 font-mono">
                        {isAr ? 'خلفية مضيئة (محاكاة العرض والطباعة)' : 'Light Mode Canvas'}
                      </div>
                      
                      <div className="pt-2 flex justify-center min-h-[90px] items-center border border-dashed border-neutral-200 rounded-lg p-2 bg-neutral-50">
                        <LogoRenderer config={logoConfig} isAr={isAr} mode="light" />
                      </div>
                      <p className="text-[10px] text-zinc-400 text-center font-mono">
                        {isAr ? 'نمط المطبوعات والتصاميم الفاخرة المقارنة' : 'Separate assets load for dual contrast visibility'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dual Column: Controls vs Properties settings */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column Controls (8 cols) */}
                  <div className="lg:col-span-12 space-y-6">
                    {/* Panel 1: Source & Format Type */}
                    <div className="bg-neutral-900 border border-gold-500/10 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black text-gold-300 border-b border-gold-500/10 pb-2">
                        {isAr ? '١. نوع ملف ومصدر الشعار:' : '1. Logo Core Type & Asset Source:'}
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          { id: 'icon', labelAr: 'الرمز اللامع الافتراضي', labelEn: 'Legacy Icon Emblem' },
                          { id: 'text', labelAr: 'أحرف النص الحرة', labelEn: 'Plain Typography Only' },
                          { id: 'image', labelAr: 'صورة مخصصة (JPG, PNG, WEBP)', labelEn: 'Custom Image Upload' },
                          { id: 'svg', labelAr: 'كود فيكتور (SVG Raw Code)', labelEn: 'Raw SVG Vector code' }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              updateLogoConfig({ ...logoConfig, logoType: opt.id as any });
                              addActivity(`تغيير نوع الشعار النشط إلى: ${opt.labelEn}`);
                            }}
                            className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                              logoConfig.logoType === opt.id
                                ? 'border-gold-505 bg-gold-950/40 text-gold-300'
                                : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700'
                            }`}
                          >
                            <span className="text-[11px] block font-extrabold">{isAr ? opt.labelAr : opt.labelEn}</span>
                          </button>
                        ))}
                      </div>

                      {/* Display conditional content fields based on Logo Selection */}
                      {logoConfig.logoType === 'icon' && (
                        <div className="bg-neutral-950 border border-gold-500/5 p-4 rounded-xl space-y-3">
                          <p className="text-[11px] text-gold-300 leading-relaxed">
                            {isAr 
                              ? '💡 يعتمد نمط "الرمز اللامع الافتراضي" على توليد كبسولة حروف ثلاثية الأبعاد بملء خلفية متوهجة. يمكنك تخصيص الألوان والنصوص الجانبية بالأسفل.' 
                              : '💡 The default glowing circular crest automatically frames design elements with high-contrast luxury vectors.'}
                          </p>
                        </div>
                      )}

                      {logoConfig.logoType === 'text' && (
                        <div className="bg-neutral-950 border border-gold-500/5 p-4 rounded-xl space-y-3">
                          <p className="text-[11px] text-zinc-400 leading-relaxed">
                            {isAr 
                              ? '💡 نمط النص الصافي يعرض الاسم المكتوب باللغتين بنصوص متقدمة عريضة مع إخفاء الرمز الجانبي لتصاميم "المينيست التجريدية".' 
                              : '💡 High-end clean typography hides visual symbols, prioritizing direct textual layouts.'}
                          </p>
                        </div>
                      )}

                      {logoConfig.logoType === 'image' && (
                        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Dark Mode Image Input */}
                            <div className="space-y-2">
                              <label className="text-xs text-gold-300 block font-bold">
                                {isAr ? 'شعار الخلفيات الداكنة (Dark Mode Logo):' : 'Logo on Dark Backgrounds:'}
                              </label>
                              <div className="flex flex-col gap-2">
                                <input
                                  type="text"
                                  placeholder="https://example.com/logo-dark-bg.png"
                                  value={logoConfig.imageSrcDark}
                                  onChange={(e) => updateLogoConfig({ ...logoConfig, imageSrcDark: e.target.value })}
                                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white text-left font-mono focus:outline-none"
                                />
                                <div className="border border-dashed border-neutral-800 rounded-lg p-3 bg-neutral-900/40 text-center relative hover:bg-neutral-900 transition-all">
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const r = new FileReader();
                                        r.onload = () => {
                                          updateLogoConfig({ ...logoConfig, imageSrcDark: r.result as string });
                                          addActivity(`تحميل ملف شعار داكن: ${file.name}`);
                                          triggerToast(isAr ? 'تم تحميل وقراءة ملف الشعار الداكن 📂' : 'Dark asset read successfully 📂');
                                        };
                                        r.readAsDataURL(file);
                                      }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                  <span className="text-[10px] text-neutral-400 block font-bold leading-none">
                                    {isAr ? '📁 اسحب وأفلت أو انقر للرفع المباشر' : '📁 Drag / Drop or Click to Upload'}
                                  </span>
                                  <span className="text-[8px] text-neutral-500 block mt-1">supports SVG, PNG, WEBP, JPG</span>
                                </div>
                              </div>
                            </div>

                            {/* Light Mode Image Input */}
                            <div className="space-y-2">
                              <label className="text-xs text-gold-300 block font-bold">
                                {isAr ? 'شعار الخلفيات المضيئة (Light Mode Logo):' : 'Logo on Light Backgrounds:'}
                              </label>
                              <div className="flex flex-col gap-2">
                                <input
                                  type="text"
                                  placeholder="https://example.com/logo-light-bg.png"
                                  value={logoConfig.imageSrcLight}
                                  onChange={(e) => updateLogoConfig({ ...logoConfig, imageSrcLight: e.target.value })}
                                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white text-left font-mono focus:outline-none"
                                />
                                <div className="border border-dashed border-neutral-800 rounded-lg p-3 bg-neutral-900/40 text-center relative hover:bg-neutral-900 transition-all">
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const r = new FileReader();
                                        r.onload = () => {
                                          updateLogoConfig({ ...logoConfig, imageSrcLight: r.result as string });
                                          addActivity(`تحميل ملف شعار مضيء: ${file.name}`);
                                          triggerToast(isAr ? 'تم تحميل وقراءة ملف الشعار المضيء 📂' : 'Light asset read successfully 📂');
                                        };
                                        r.readAsDataURL(file);
                                      }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                  <span className="text-[10px] text-neutral-400 block font-bold leading-none">
                                    {isAr ? '📁 اسحب وأفلت أو انقر للرفع المباشر' : '📁 Drag / Drop or Click to Upload'}
                                  </span>
                                  <span className="text-[8px] text-neutral-500 block mt-1">supports SVG, PNG, WEBP, JPG</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {(logoConfig.imageSrcDark || logoConfig.imageSrcLight) && (
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  updateLogoConfig({ ...logoConfig, imageSrcDark: '', imageSrcLight: '' });
                                  addActivity('تصفير وحذف صور الشعار المرفوعة');
                                  triggerToast(isAr ? 'تم حذف الصور المخصصة' : 'Custom imagery cleared');
                                }}
                                className="px-3 py-1 bg-rose-950/30 border border-rose-500/20 text-rose-450 hover:bg-rose-900/30 rounded-lg text-[10px] font-bold"
                              >
                                {isAr ? '🗑️ حذف الصور المرفوعة والعودة للتلقائي' : '🗑️ Delete Images & Clear'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {logoConfig.logoType === 'svg' && (
                        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-4">
                          <p className="text-[11px] text-yellow-500/90 leading-relaxed font-bold">
                            {isAr 
                              ? '⚠️ الرجاء لصق كود المتجه SVG مباشرة بدلاً من الروابط (على سبيل المثال: <svg ...><path ... /></svg>)' 
                              : '⚠️ Paste nested raw vectors with tags (<svg>...</svg>). Keep height/width set relative to viewport.'}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Dark Mode SVG Input */}
                            <div className="space-y-1">
                              <label className="text-xs text-gold-300 block font-bold">{isAr ? 'كود الفيكتور للوضع الداكن:' : 'Dark Mode SVG String:'}</label>
                              <textarea
                                rows={4}
                                placeholder="<svg viewBox='0 0 100 100'><path d='...' fill='currentColor'/></svg>"
                                value={logoConfig.svgCodeDark}
                                onChange={(e) => updateLogoConfig({ ...logoConfig, svgCodeDark: e.target.value })}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-[10px] text-white text-left font-mono focus:outline-none focus:border-gold-505"
                              />
                            </div>

                            {/* Light Mode SVG Input */}
                            <div className="space-y-1">
                              <label className="text-xs text-gold-300 block font-bold">{isAr ? 'كود الفيكتور للوضع المضيء:' : 'Light Mode SVG String:'}</label>
                              <textarea
                                rows={4}
                                placeholder="<svg viewBox='0 0 100 100'><path d='...' fill='currentColor'/></svg>"
                                value={logoConfig.svgCodeLight}
                                onChange={(e) => updateLogoConfig({ ...logoConfig, svgCodeLight: e.target.value })}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-[10px] text-white text-left font-mono focus:outline-none focus:border-gold-505"
                              />
                            </div>
                          </div>

                          <div className="flex justify-between items-center bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                            <span className="text-[10px] text-neutral-400">
                              {isAr ? '💡 كود SVG المكتوب سيقوم بالوراثة التلقائية للألوان المعينة ونسبة التوهج للعلامة.' : 'Tip: Use fill="currentColor" or stroke="currentColor" inside paths to adapt color dials.'}
                            </span>
                            {(logoConfig.svgCodeDark || logoConfig.svgCodeLight) && (
                              <button
                                type="button"
                                onClick={() => {
                                  updateLogoConfig({ ...logoConfig, svgCodeDark: '', svgCodeLight: '' });
                                  addActivity('تصفير وتنظيف أكواد الـ SVG المخصصة');
                                }}
                                className="px-2.5 py-1 bg-neutral-950 text-[10px] text-rose-400 hover:text-rose-300 rounded border border-neutral-800 font-bold"
                              >
                                {isAr ? '🗑️ حذف ومسح الأكواد' : '🗑️ Clear SVGs'}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Panel 2: Brand Text Title & Translations */}
                    <div className="bg-neutral-900 border border-gold-500/10 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black text-gold-300 border-b border-gold-500/10 pb-2">
                        {isAr ? '٢. العناوين والنصوص الإعلانية المرفقة:' : '2. Typography Text & Multilingual Alignments:'}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-gold-300 block font-bold">{isAr ? 'الاسم التجاري بالعربية:' : 'Brand Name (Arabic):'}</label>
                          <input
                            type="text"
                            value={logoConfig.brandTextAr}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, brandTextAr: e.target.value })}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white font-bold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-gold-300 block font-bold">{isAr ? 'الاسم التجاري بالإنجليزية:' : 'Brand Name (English):'}</label>
                          <input
                            type="text"
                            value={logoConfig.brandTextEn}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, brandTextEn: e.target.value })}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white font-extrabold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-gold-300 block font-bold">{isAr ? 'الوصف الفرعي بالعربية:' : 'Subtitle Text (Arabic):'}</label>
                          <input
                            type="text"
                            value={logoConfig.brandSubtitleAr}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, brandSubtitleAr: e.target.value })}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-gold-300 block font-bold">{isAr ? 'الوصف الفرعي بالإنجليزية:' : 'Subtitle Text (English):'}</label>
                          <input
                            type="text"
                            value={logoConfig.brandSubtitleEn}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, brandSubtitleEn: e.target.value })}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Panel 3: Sizing for (Mobile, Tablet, Desktop) */}
                    <div className="bg-neutral-900 border border-gold-500/10 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black text-gold-300 border-b border-gold-500/10 pb-2">
                        {isAr ? '٣. أحجام الشعار المتجاوبة (بالبكسل):' : '3. Responsive Size Dimensions (in Pixels):'}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Mobile view */}
                        <div className="space-y-2 bg-neutral-950 p-4 rounded-xl border border-neutral-800/60">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-neutral-400 font-bold">{isAr ? 'الهاتف (Mobile)' : 'Mobile'}</span>
                            <span className="text-xs text-gold-505 font-mono font-bold">{logoConfig.sizeMobile}px</span>
                          </div>
                          <input
                            type="range"
                            min="20"
                            max="200"
                            step="2"
                            value={logoConfig.sizeMobile}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, sizeMobile: Number(e.target.value) })}
                            className="w-full filter accent-gold-505 cursor-pointer mt-1"
                          />
                          <p className="text-[9px] text-zinc-500">{isAr ? 'للواجهات والتحميل على الهواتف الذكية' : 'Applied under 640px widths'}</p>
                        </div>

                        {/* Tablet view */}
                        <div className="space-y-2 bg-neutral-950 p-4 rounded-xl border border-neutral-800/60">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-neutral-400 font-bold">{isAr ? 'الآيباد (Tablet)' : 'Tablet'}</span>
                            <span className="text-xs text-gold-505 font-mono font-bold">{logoConfig.sizeTablet}px</span>
                          </div>
                          <input
                            type="range"
                            min="20"
                            max="250"
                            step="2"
                            value={logoConfig.sizeTablet}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, sizeTablet: Number(e.target.value) })}
                            className="w-full filter accent-gold-505 cursor-pointer mt-1"
                          />
                          <p className="text-[9px] text-zinc-500">{isAr ? 'للأجهزة اللوحية والشاشات المتوسطة' : 'Applied between 640px and 1024px'}</p>
                        </div>

                        {/* Desktop view */}
                        <div className="space-y-2 bg-neutral-950 p-4 rounded-xl border border-neutral-800/60">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-neutral-400 font-bold">{isAr ? 'الحاسوب (Desktop)' : 'Desktop'}</span>
                            <span className="text-xs text-gold-505 font-mono font-bold">{logoConfig.sizeDesktop}px</span>
                          </div>
                          <input
                            type="range"
                            min="24"
                            max="400"
                            step="2"
                            value={logoConfig.sizeDesktop}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, sizeDesktop: Number(e.target.value) })}
                            className="w-full filter accent-gold-505 cursor-pointer mt-1"
                          />
                          <p className="text-[9px] text-zinc-500">{isAr ? 'لكافة شاشات الكمبيوتر والـ 4K العريضة' : 'Applied above 1024px grid standards'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Panel 4: Color, Swatches and Opacity controls */}
                    <div className="bg-neutral-900 border border-gold-500/10 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black text-gold-300 border-b border-gold-500/10 pb-2">
                        {isAr ? '٤. الألوان المتقدمة والتوهج الشفاف:' : '4. Colors Swatches & Opacities:'}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Opacity slider */}
                        <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800/60">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-300 font-bold">{isAr ? 'درجة الشفافية (Opacity):' : 'Channel Opacity:'}</span>
                            <span className="text-xs text-gold-300 font-mono font-bold">{Math.round(logoConfig.opacity * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value={logoConfig.opacity}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, opacity: Number(e.target.value) })}
                            className="w-full filter accent-gold-505 cursor-pointer"
                          />
                        </div>

                        {/* Color swatches */}
                        <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800/60">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-300 font-bold">{isAr ? 'لون كبسولة الشعار النشط:' : 'Brand Color Accent:'}</span>
                            <span className="text-xs text-gold-300 font-mono font-bold uppercase">{logoConfig.colorAccent}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 items-center">
                            {[
                              { hex: '#e5c060', label: 'Classic Gold' },
                              { hex: '#ffca28', label: 'Neon Yellow' },
                              { hex: '#ffffff', label: 'Hyper White' },
                              { hex: '#90a4ae', label: 'Deep Silver' },
                              { hex: '#00ffcc', label: 'Cyber Teal' },
                              { hex: '#ff5252', label: 'Hot Crimson' }
                            ].map((clr) => (
                              <button
                                key={clr.hex}
                                type="button"
                                onClick={() => updateLogoConfig({ ...logoConfig, colorAccent: clr.hex })}
                                className="w-8 h-8 rounded-full border-2 transition-all relative"
                                style={{ 
                                  backgroundColor: clr.hex, 
                                  borderColor: logoConfig.colorAccent === clr.hex ? '#ffffff' : 'transparent',
                                  boxShadow: logoConfig.colorAccent === clr.hex ? `0 0 10px ${clr.hex}` : 'none'
                                }}
                                title={clr.label}
                              />
                            ))}

                            {/* Hex Input */}
                            <div className="flex items-center gap-1.5 border border-neutral-800 rounded-lg p-1 px-2 bg-neutral-900 ml-auto w-fit">
                              <input
                                type="color"
                                value={logoConfig.colorAccent}
                                onChange={(e) => updateLogoConfig({ ...logoConfig, colorAccent: e.target.value })}
                                className="w-6 h-6 bg-transparent border-0 cursor-pointer"
                              />
                              <input
                                type="text"
                                maxLength={7}
                                value={logoConfig.colorAccent}
                                onChange={(e) => updateLogoConfig({ ...logoConfig, colorAccent: e.target.value })}
                                className="w-16 bg-transparent text-white text-[10px] font-mono border-0 focus:outline-none focus:ring-0 text-center font-bold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Panel 5: Position & Spacing & Drag coordinates joystick */}
                    <div className="bg-neutral-900 border border-gold-500/10 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black text-gold-300 border-b border-gold-500/10 pb-2">
                        {isAr ? '٥. التموضع الجغرافي والـ JoyStick ثنائي الأبعاد:' : '5. Spatial Coordinates & Alignment Systems:'}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Selector Alignment (Left, Center, Right, Custom) */}
                        <div className="md:col-span-5 space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                          <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'طريقة محاذاة الشعار الجانبي:' : 'Layout Alignment:'}</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'left', labelAr: 'يسار', labelEn: 'Static Left' },
                              { id: 'center', labelAr: 'توسيط', labelEn: 'Centered' },
                              { id: 'right', labelAr: 'يمين', labelEn: 'Static Right' },
                              { id: 'custom', labelAr: 'نواقل حرة (Joystick)', labelEn: 'Free Manual (Joystick)' }
                            ].map((posOpt) => (
                              <button
                                key={posOpt.id}
                                type="button"
                                onClick={() => updateLogoConfig({ ...logoConfig, position: posOpt.id as any })}
                                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center border cursor-pointer ${
                                  logoConfig.position === posOpt.id
                                    ? 'bg-gold-500/15 border-gold-505 text-gold-300'
                                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                                }`}
                              >
                                {isAr ? posOpt.labelAr : posOpt.labelEn}
                              </button>
                            ))}
                          </div>
                          
                          <p className="text-[10px] text-neutral-500 leading-relaxed font-sans pt-1">
                            {isAr 
                              ? '⚠️ يؤثر التموضع على طريقة الحساب التلقائي لأعمدة القوائم، يفضل اختيار وضع الفري "Free Manual" لضبط الإزاحة الذنبية الحرة.' 
                              : 'Manual coordinates allow free placement using the XY tactile board.'}
                          </p>
                        </div>

                        {/* Interactive XY Axis Grid "Drag and Drop Coordinator simulation" */}
                        <div className="md:col-span-7 bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3 relative">
                          <div className="flex justify-between items-center border-b border-neutral-800 pb-1.5">
                            <span className="text-xs text-neutral-300 font-bold">{isAr ? 'لوحة التوجيه والتموضع النشط (Joystick XY Grid):' : 'XY Relative Offset Panel:'}</span>
                            <div className="flex gap-2 text-[10px] font-mono text-gold-550 text-gold-300">
                              <span>X: <strong>{logoConfig.customX}px</strong></span>
                              <span>Y: <strong>{logoConfig.customY}px</strong></span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                            {/* Visual Touchpad Panel */}
                            <div className="relative w-full aspect-square max-w-[140px] bg-neutral-900 rounded-xl border border-neutral-800/80 mx-auto flex items-center justify-center overflow-hidden">
                              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:10px_10px] opacity-20 pointer-events-none"></div>
                              <div className="absolute h-full w-[1px] bg-neutral-800"></div>
                              <div className="absolute w-full h-[1px] bg-neutral-800"></div>
                              
                              {/* Direct Click Coordinates Mapper */}
                              <div 
                                className="absolute inset-0 cursor-crosshair"
                                onClick={(e) => {
                                  if (logoConfig.position !== 'custom') {
                                    updateLogoConfig({ ...logoConfig, position: 'custom' });
                                  }
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const clickX = e.clientX - rect.left;
                                  const clickY = e.clientY - rect.top;
                                  // Map 0-140 width to -80 to +80 offset
                                  const mapX = Math.round(((clickX / rect.width) * 160) - 80);
                                  const mapY = Math.round(((clickY / rect.height) * 160) - 80);
                                  updateLogoConfig({ ...logoConfig, customX: mapX, customY: mapY });
                                  addActivity(`تغيير ناقلات تموضع الشعار الحر إلى: X=${mapX} Y=${mapY}`);
                                }}
                              />

                              {/* Target Handle Dot */}
                              <div 
                                className="absolute w-4 h-4 bg-gradient-to-r from-gold-300 to-gold-505 rounded-full border border-white shadow-xl shadow-gold-500 animate-pulse pointer-events-none transition-all duration-75"
                                style={{
                                  // Map -80 to +80 to 0% to 100%
                                  left: `calc(${((logoConfig.customX + 80) / 160) * 100}% - 8px)`,
                                  top: `calc(${((logoConfig.customY + 80) / 160) * 100}% - 8px)`,
                                }}
                              />
                            </div>

                            {/* Direct Sliders */}
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <span className="text-[10px] text-neutral-400 font-bold block">{isAr ? 'الإزاحة الأفقية (X Vector):' : 'X Coordinate offset:'}</span>
                                <input
                                  type="range"
                                  min="-80"
                                  max="80"
                                  step="1"
                                  value={logoConfig.customX}
                                  onChange={(e) => {
                                    if (logoConfig.position !== 'custom') {
                                      updateLogoConfig({ ...logoConfig, position: 'custom' }, false);
                                    }
                                    updateLogoConfig({ ...logoConfig, customX: Number(e.target.value) });
                                  }}
                                  className="w-full accent-gold-505 shrink cursor-pointer"
                                />
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] text-neutral-400 font-bold block">{isAr ? 'الإزاحة الرأسية (Y Vector):' : 'Y Coordinate offset:'}</span>
                                <input
                                  type="range"
                                  min="-80"
                                  max="80"
                                  step="1"
                                  value={logoConfig.customY}
                                  onChange={(e) => {
                                    if (logoConfig.position !== 'custom') {
                                      updateLogoConfig({ ...logoConfig, position: 'custom' }, false);
                                    }
                                    updateLogoConfig({ ...logoConfig, customY: Number(e.target.value) });
                                  }}
                                  className="w-full accent-gold-505 shrink cursor-pointer"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  updateLogoConfig({ ...logoConfig, customX: 0, customY: 0 });
                                  triggerToast(isAr ? 'تم إعادة تصفير المتجهات' : 'Offsets centered to zero');
                                }}
                                className="w-full py-1.5 bg-neutral-900 hover:bg-neutral-850 rounded text-[10px] text-zinc-300 font-bold border border-neutral-800"
                              >
                                {isAr ? '🔄 تصفير الأهداف الصفرية' : 'Reset XY Values'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Panel 6: Animations, Hover Effects & Scroll */}
                    <div className="bg-neutral-900 border border-gold-500/10 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black text-gold-300 border-b border-gold-500/10 pb-2">
                        {isAr ? '٦. حركية الشعار والمؤثرات المتفاعلة:' : '6. Animation Dials & Micro Interactions:'}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Static Loop Animation Selection */}
                        <div className="space-y-2 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                          <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'حركية اللوب المستمر (Continuous Loop):' : 'Ambient Loop Animation:'}</label>
                          <select
                            value={logoConfig.animation}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, animation: e.target.value as any })}
                            className="w-full bg-neutral-900 text-neutral-300 text-xs p-2 rounded-lg border border-neutral-850 focus:outline-none focus:border-gold-505 font-bold"
                          >
                            <option value="none">{isAr ? 'بدون حركية مستمرة (ثابت)' : 'No continuous animation'}</option>
                            <option value="spin-slow">{isAr ? 'دوران ميكانيكي هادئ (Infinite Spin)' : 'Infinite slow rotation'}</option>
                            <option value="bounce-slow">{isAr ? 'اهتزاز رأسي مريح (Slow Bounce)' : 'Vertical slow bounce'}</option>
                            <option value="pulse-slow">{isAr ? 'نبض متوهج خافت (Pulse Breathing)' : 'Delicate scale pulsing'}</option>
                            <option value="glow-breath">{isAr ? 'توهج هالة منبعث (Neon Halo Glow)' : 'Luminous golden neon breath'}</option>
                          </select>
                        </div>

                        {/* Hover Interactive Animation Selector */}
                        <div className="space-y-2 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                          <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'مؤثر التفاعل عند مرور الماوس (Hover Effect):' : 'Interactive Hover Reaction:'}</label>
                          <select
                            value={logoConfig.hoverEffect}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, hoverEffect: e.target.value as any })}
                            className="w-full bg-neutral-900 text-neutral-300 text-xs p-2 rounded-lg border border-neutral-850 focus:outline-none focus:border-gold-505 font-bold"
                          >
                            <option value="none">{isAr ? 'لا يوجد استجابة' : 'No hover feedback'}</option>
                            <option value="scale">{isAr ? 'تمدد وتكبير مرن (+10% Scale up)' : 'Elastic scale zoom'}</option>
                            <option value="rotate">{isAr ? 'فتل إمالة خفيفة (Rotate 6 degrees)' : 'Skewed rotation offset'}</option>
                            <option value="brightness">{isAr ? 'وميض بياض ناصع (+25% Brightness)' : 'Gleam flash intensity'}</option>
                            <option value="gold-shine">{isAr ? 'توهج أشعة الشمس الذهبية (Gold Shine Laser)' : 'Intense radial laser glow'}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Panel 7: Specific Layout Area Visibility Rules */}
                    <div className="bg-neutral-900 border border-gold-500/10 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black text-gold-300 border-b border-gold-500/10 pb-2">
                        {isAr ? '٧. قواعد ظهور الشعار بأقسام الموقع:' : '7. Output Target Visibility:'}
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Header target */}
                        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 flex items-center justify-between">
                          <span className="text-xs text-neutral-300 font-bold">{isAr ? 'الهيدر الرأسي (Header)' : 'Main Header'}</span>
                          <input
                            type="checkbox"
                            checked={logoConfig.visibleInHeader}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, visibleInHeader: e.target.checked })}
                            className="w-4 h-4 rounded text-gold-505 bg-neutral-900 border-neutral-850 accent-gold-505 cursor-pointer"
                          />
                        </div>

                        {/* Menu drawer target */}
                        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 flex items-center justify-between">
                          <span className="text-xs text-neutral-300 font-bold">{isAr ? 'منيو الجوال (Menu)' : 'Mobile Drawer'}</span>
                          <input
                            type="checkbox"
                            checked={logoConfig.visibleInMenu}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, visibleInMenu: e.target.checked })}
                            className="w-4 h-4 rounded text-gold-505 bg-neutral-900 border-neutral-850 accent-gold-505 cursor-pointer"
                          />
                        </div>

                        {/* Footer target */}
                        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 flex items-center justify-between">
                          <span className="text-xs text-neutral-300 font-bold">{isAr ? 'الفوتر السفلي (Footer)' : 'Website Footer'}</span>
                          <input
                            type="checkbox"
                            checked={logoConfig.visibleInFooter}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, visibleInFooter: e.target.checked })}
                            className="w-4 h-4 rounded text-gold-505 bg-neutral-900 border-neutral-850 accent-gold-505 cursor-pointer"
                          />
                        </div>

                        {/* Hero target */}
                        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 flex items-center justify-between">
                          <span className="text-xs text-neutral-300 font-bold">{isAr ? 'أماكن البانرات (All Sections)' : 'All Areas'}</span>
                          <input
                            type="checkbox"
                            checked={logoConfig.visibleInHero}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, visibleInHero: e.target.checked })}
                            className="w-4 h-4 rounded text-gold-505 bg-neutral-900 border-neutral-850 accent-gold-505 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Panel 8: Margins & Spacing details */}
                    <div className="bg-neutral-900 border border-gold-500/10 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black text-gold-300 border-b border-gold-500/10 pb-2">
                        {isAr ? '٨. المسافات والهوامش المحيطية (Margins & Padding):' : '8. Margins & Compounding Padding:'}
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {/* Margin Top */}
                        <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-zinc-400 font-bold">{isAr ? 'هامش علوي' : 'Margin Top'}</span>
                            <span className="text-xs font-bold text-gold-505">{logoConfig.marginTop}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={logoConfig.marginTop}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, marginTop: Number(e.target.value) })}
                            className="w-full accent-gold-505 cursor-pointer"
                          />
                        </div>

                        {/* Margin Bottom */}
                        <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-zinc-400 font-bold">{isAr ? 'هامش سفلي' : 'Margin Bottom'}</span>
                            <span className="text-xs font-bold text-gold-505">{logoConfig.marginBottom}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={logoConfig.marginBottom}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, marginBottom: Number(e.target.value) })}
                            className="w-full accent-gold-505 cursor-pointer"
                          />
                        </div>

                        {/* Margin Left */}
                        <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-zinc-400 font-bold">{isAr ? 'هامش يسار' : 'Margin Left'}</span>
                            <span className="text-xs font-bold text-gold-505">{logoConfig.marginLeft}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={logoConfig.marginLeft}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, marginLeft: Number(e.target.value) })}
                            className="w-full accent-gold-505 cursor-pointer"
                          />
                        </div>

                        {/* Margin Right */}
                        <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-zinc-400 font-bold">{isAr ? 'هامش يمين' : 'Margin Right'}</span>
                            <span className="text-xs font-bold text-gold-505">{logoConfig.marginRight}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={logoConfig.marginRight}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, marginRight: Number(e.target.value) })}
                            className="w-full accent-gold-505 cursor-pointer"
                          />
                        </div>

                        {/* Internal Padding */}
                        <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 space-y-1 col-span-2 sm:col-span-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-zinc-400 font-bold">{isAr ? 'حشو داخلي' : 'Inner Padding'}</span>
                            <span className="text-xs font-bold text-gold-505">{logoConfig.padding}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="30"
                            value={logoConfig.padding}
                            onChange={(e) => updateLogoConfig({ ...logoConfig, padding: Number(e.target.value) })}
                            className="w-full accent-gold-505 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeAdminTab === 'content' && (
              <div className="space-y-4 animate-fade-in text-right">
                <span className="text-[11px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded tracking-wider uppercase font-mono block w-fit">
                  {isAr ? 'تحديث المنشتات الإعلانية' : 'HOMEPAGE HEADINGS CONTROL'}
                </span>

                <div className="space-y-4 bg-neutral-900 border border-gold-500/10 p-5 rounded-2xl">
                  {/* Hero Arabic */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gold-350 text-gold-505 block">{isAr ? 'عنوان البانر الرئيسي (العربية):' : 'Bespoke Hero Title (Arabic):'}</label>
                    <input 
                      type="text"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right font-extrabold"
                      value={customContent.heroTitleAr}
                      onChange={(e) => saveCustomContent({ ...customContent, heroTitleAr: e.target.value })}
                    />
                  </div>

                  {/* Hero English */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gold-505 block">{isAr ? 'عنوان البانر الرئيسي (الإنجليزية):' : 'Bespoke Hero Title (English):'}</label>
                    <input 
                      type="text"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-left font-sans font-bold"
                      value={customContent.heroTitleEn}
                      onChange={(e) => saveCustomContent({ ...customContent, heroTitleEn: e.target.value })}
                    />
                  </div>

                  {/* Desc Arabic */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gold-505 block">{isAr ? 'وصف البانر الفرعي (العربية):' : 'Bespoke Hero Description (Arabic):'}</label>
                    <textarea 
                      className="w-full h-20 bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right font-sans"
                      value={customContent.heroDescAr}
                      onChange={(e) => saveCustomContent({ ...customContent, heroDescAr: e.target.value })}
                    />
                  </div>

                  {/* Desc English */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gold-505 block">{isAr ? 'وصف البانر الفرعي (الإنجليزية):' : 'Bespoke Hero Description (English):'}</label>
                    <textarea 
                      className="w-full h-20 bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-left font-sans"
                      value={customContent.heroDescEn}
                      onChange={(e) => saveCustomContent({ ...customContent, heroDescEn: e.target.value })}
                    />
                  </div>

                  {/* About Summary Arabic */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gold-505 block">{isAr ? 'ملخص قصة وعقيدة يافطة (العربية):' : 'Company Mission Summary (Arabic):'}</label>
                    <textarea 
                      className="w-full h-20 bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right font-sans"
                      value={customContent.aboutSummaryAr}
                      onChange={(e) => saveCustomContent({ ...customContent, aboutSummaryAr: e.target.value })}
                    />
                  </div>

                  {/* About Summary English */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gold-505 block">{isAr ? 'ملخص قصة وعقيدة يافطة (الإنجليزية):' : 'Company Mission Summary (English):'}</label>
                    <textarea 
                      className="w-full h-20 bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-left font-sans"
                      value={customContent.aboutSummaryEn}
                      onChange={(e) => saveCustomContent({ ...customContent, aboutSummaryEn: e.target.value })}
                    />
                  </div>
                </div>

                <div className="text-[10px] text-neutral-500 text-center leading-relaxed">
                  {isAr 
                    ? '📝 سيتم حفظ وإجراء التحديثات تلقائياً عند تغيير أي حرف عبر آلية Instant Save ' 
                    : 'Changes autosaved on user edits'}
                </div>
              </div>
            )}

            {/* ════════════════════════════
                3. CONTACT INFORMATION TAB
                ════════════════════════════ */}
            {activeAdminTab === 'contact' && (
              <div className="space-y-4 animate-fade-in">
                <span className="text-[11px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded tracking-wider uppercase font-mono block w-fit">
                  {isAr ? 'بيانات الوصول وجدول الاتصالات' : 'ADDRESSES & HOTLINES LOG'}
                </span>

                <div className="bg-neutral-900 border border-gold-500/10 p-5 rounded-2xl space-y-4 text-right">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white block">{isAr ? 'رقم الهاتف الرئيسي:' : 'Primary Phone:'}</label>
                      <input 
                        type="text"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right font-mono"
                        value={companyDetails.phone}
                        onChange={(e) => saveCompanyDetails({ ...companyDetails, phone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white block">{isAr ? 'رقم الواتساب النشط للطلبات:' : 'WhatsApp Hotline:'}</label>
                      <input 
                        type="text"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right font-mono"
                        value={companyDetails.whatsapp}
                        onChange={(e) => saveCompanyDetails({ ...companyDetails, whatsapp: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white block">{isAr ? 'البريد الإلكتروني للتعاقدات:' : 'Primary Email Contact:'}</label>
                    <input 
                      type="email"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right font-mono"
                      value={companyDetails.emails[0] || ''}
                      onChange={(e) => {
                        const newEmails = [...companyDetails.emails];
                        newEmails[0] = e.target.value;
                        saveCompanyDetails({ ...companyDetails, emails: newEmails });
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white block">{isAr ? 'العنوان العربي (مقر التجمع وعين شمس):' : 'Bespoke Address (Arabic):'}</label>
                    <textarea 
                      className="w-full h-16 bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right font-sans"
                      value={companyDetails.addressAr}
                      onChange={(e) => saveCompanyDetails({ ...companyDetails, addressAr: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white block">{isAr ? 'العنوان الإنجليزي للمراسلات:' : 'Bespoke Address (English):'}</label>
                    <textarea 
                      className="w-full h-16 bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-left font-sans"
                      value={companyDetails.addressEn}
                      onChange={(e) => saveCompanyDetails({ ...companyDetails, addressEn: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════
                4. SERVICES MANAGEMENT TAB
                ════════════════════════════ */}
            {activeAdminTab === 'services' && (
              <div className="space-y-5 animate-fade-in text-right">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => {
                      const newId = `serv-${Date.now()}`;
                      const item: ServiceDetail = {
                        id: newId,
                        titleAr: 'طابعة الأبعاد والعلب الحريرية',
                        titleEn: 'Silk & Golden Foil Packaging Division',
                        descriptionAr: 'عنبر طباعة فاخر مجهز بأكثر من 4 خطوط فرز آلية للمطبوعات الفولاذية والورق والتحزيم.',
                        descriptionEn: 'Automated 5-axis hot-stamping screen lines utilizing rich food-grade coatings.',
                        featuresAr: ['طباعة Spot UV بارز', 'تصفيح بولي إيميد مضاد للخدش'],
                        featuresEn: ['Spot UV Gold Pressing', 'Anti-peeling coatings'],
                        iconName: 'Layers',
                        image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800'
                      };
                      const updated = [...servicesList, item];
                      setServicesList(updated);
                      localStorage.setItem('yafta_services_list', JSON.stringify(updated));
                      triggerToast('تمت إضافة الخدمة الإعلانية المتكاملة الجديدة بنجاح! 🛠️');
                      addActivity(`إضافة قطاع خدمة جديد: ${item.titleEn}`);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-gold-950 hover:bg-gold-900 border border-gold-505/30 text-gold-300 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{isAr ? 'إضافة قطاع خدمة جديد' : 'New Division Build'}</span>
                  </button>
                  <span className="text-[11px] bg-neutral-900 px-3 py-1.5 rounded text-neutral-400 font-bold">{isAr ? `إجمالي الخدمات: ${servicesList.length}` : `Total: ${servicesList.length}`}</span>
                </div>

                <div className="space-y-3">
                  {servicesList.map((serv: ServiceDetail) => (
                    <div key={serv.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <button 
                          onClick={() => {
                            if(confirm(isAr ? 'حذف هذه الخدمة نهائياً من الكتالوج؟' : 'Delete service?')){
                              const updated = servicesList.filter(s => s.id !== serv.id);
                              setServicesList(updated);
                              localStorage.setItem('yafta_services_list', JSON.stringify(updated));
                              triggerToast('تم مسح الخدمة بنجاح من الكتالوج الكوني');
                              addActivity(`حذف قطاع خدمة: ${serv.titleEn}`);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-950/60 rounded border border-neutral-800 hover:border-rose-500/30 transition-all cursor-pointer"
                          title="حذف الخدمة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <input 
                            type="text"
                            className="bg-neutral-950 border border-neutral-800 text-xs font-black text-white text-right p-1.5 rounded focus:border-gold-505 max-w-[200px]"
                            value={serv.titleAr}
                            onChange={(e) => {
                              const updated = servicesList.map(s => s.id === serv.id ? { ...s, titleAr: e.target.value } : s);
                              setServicesList(updated);
                              localStorage.setItem('yafta_services_list', JSON.stringify(updated));
                            }}
                          />
                          <span className="text-gold-505">({isAr ? 'عربي' : 'Ar'})</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input 
                            type="text"
                            className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white text-left p-1.5 rounded focus:border-gold-505"
                            value={serv.titleEn}
                            onChange={(e) => {
                              const updated = servicesList.map(s => s.id === serv.id ? { ...s, titleEn: e.target.value } : s);
                              setServicesList(updated);
                              localStorage.setItem('yafta_services_list', JSON.stringify(updated));
                            }}
                          />
                          <span className="text-gold-505 font-mono text-[10px]">({isAr ? 'إنجليزي' : 'En'})</span>
                        </div>

                        <textarea 
                          className="w-full h-14 bg-neutral-950 border border-neutral-800 rounded text-[11px] text-neutral-300 p-2 text-right font-sans"
                          value={serv.descriptionAr}
                          onChange={(e) => {
                            const updated = servicesList.map(s => s.id === serv.id ? { ...s, descriptionAr: e.target.value } : s);
                            setServicesList(updated);
                            localStorage.setItem('yafta_services_list', JSON.stringify(updated));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════════════════════════
                5. PORTFOLIO PROJECTS TAB
                ════════════════════════════ */}
            {activeAdminTab === 'portfolio' && (
              <div className="space-y-5 animate-fade-in text-right">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => {
                      const newProj: Project = {
                        id: `proj-${Date.now()}`,
                        titleAr: 'تجهيز لافتات وواجهات فرع نايكي مصر NIKE',
                        titleEn: 'Nike Egypt Flagship Store Double Sided LED Signs',
                        clientAr: 'شركة نايكي الرياضية بمصر',
                        clientEn: 'Nike Egypt Retail',
                        category: 'signage',
                        industryAr: 'الملابس والسلع الرياضية الفاخرة',
                        industryEn: 'Luxury Sporting Goods',
                        serviceTypeAr: 'أكريليك مضيء بالكامل واستانلس 304 روز جولد تيتانيوم',
                        serviceTypeEn: 'Double sided illuminated PVD titanium signage letters',
                        completionDate: '2026-05',
                        overviewAr: 'تم تزويد مقر متجر نايكي بأعلى حروف بارزة مصقولة ومفرزة آلياً مع كشافات ليد سامسونج بمكثفات كورية بمتوسط عمر 50 ألف ساعة.',
                        overviewEn: 'Crafting modular neon halo signage packages for international reseller stores.',
                        resultsAr: 'زيادة الرؤية الليلية للمقر بمعدل 42% وحلولا لتهوية الإضاءة.',
                        resultsEn: 'Unrivaled day-night contrasts with high output components.',
                        coverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
                        galleryImages: [
                          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800'
                        ],
                        specificationsAr: ['فولاذ مقاوم للصدأ عيار 304', 'سامسونج LED كوري'],
                        specificationsEn: ['304 Stainless steel', 'Korean Samsung LEDs']
                      };
                      const updated = [newProj, ...projectsList];
                      setProjectsList(updated);
                      localStorage.setItem('yafta_projects_list', JSON.stringify(updated));
                      triggerToast('تمت إضافة مشروع سابقة الأعمال الجديد بنجاح في المعرض! 📊');
                      addActivity(`إضافة مشروع جديد للمعرض: ${newProj.titleEn}`);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-gold-950 hover:bg-gold-900 border border-gold-505/30 text-gold-300 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{isAr ? 'إضافة مشروع جديد للمعرض' : 'New Project Draft'}</span>
                  </button>
                  <span className="text-[11px] bg-neutral-900 px-3 py-1.5 rounded text-neutral-400 font-bold">{isAr ? `المشروعات: ${projectsList.length}` : `Count: ${projectsList.length}`}</span>
                </div>

                <div className="space-y-3">
                  {projectsList.map((item: Project) => (
                    <div key={item.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-3 text-right">
                      <div className="flex justify-between items-center">
                        <button 
                          onClick={() => {
                            if(confirm(isAr ? 'هل تريد حذف هذا المشروع تماما من سابقة الأعمال؟' : 'Delete portfolio entry?')){
                              const updated = projectsList.filter(p => p.id !== item.id);
                              setProjectsList(updated);
                              localStorage.setItem('yafta_projects_list', JSON.stringify(updated));
                              triggerToast('تم حذف المشروع بنجاح من المعرض المسجل');
                              addActivity(`حذف مشروع من المعارض: ${item.titleEn}`);
                            }
                          }}
                          className="p-1 px-2 bg-rose-950/40 border border-rose-500/20 hover:border-rose-505 text-rose-400 hover:text-white rounded text-[10px] cursor-pointer"
                        >
                          {isAr ? 'حذف المشروع 🗑️' : 'Delete'}
                        </button>

                        <div className="flex items-center gap-2">
                          <input 
                            type="text"
                            className="bg-neutral-950 border border-neutral-800 text-xs font-black text-white text-right p-1 rounded focus:border-gold-505 max-w-[150px]"
                            value={item.completionDate}
                            onChange={(e) => {
                              const updated = projectsList.map(p => p.id === item.id ? { ...p, completionDate: e.target.value } : p);
                              setProjectsList(updated);
                              localStorage.setItem('yafta_projects_list', JSON.stringify(updated));
                            }}
                          />
                          <span className="text-gold-300 text-[10px]">{isAr ? 'التاريخ:' : 'Date:'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-400 block">{isAr ? 'اسم المشروع (عربي):' : 'Title (Arabic):'}</span>
                          <input 
                            type="text"
                            className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white text-right p-2 rounded"
                            value={item.titleAr}
                            onChange={(e) => {
                              const updated = projectsList.map(p => p.id === item.id ? { ...p, titleAr: e.target.value } : p);
                              setProjectsList(updated);
                              localStorage.setItem('yafta_projects_list', JSON.stringify(updated));
                            }}
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-400 block">{isAr ? 'اسم الشريك/العميل (عربي):' : 'Client (Arabic):'}</span>
                          <input 
                            type="text"
                            className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white text-right p-2 rounded"
                            value={item.clientAr}
                            onChange={(e) => {
                              const updated = projectsList.map(p => p.id === item.id ? { ...p, clientAr: e.target.value } : p);
                              setProjectsList(updated);
                              localStorage.setItem('yafta_projects_list', JSON.stringify(updated));
                            }}
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <span className="text-[10px] text-neutral-400 block">{isAr ? 'رابط شعار وصورة الغلاف للفولدر:' : 'Project Cover Photo URL:'}</span>
                          <input 
                            type="text"
                            className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white text-left p-2 rounded font-mono"
                            value={item.coverImage}
                            onChange={(e) => {
                              const updated = projectsList.map(p => p.id === item.id ? { ...p, coverImage: e.target.value } : p);
                              setProjectsList(updated);
                              localStorage.setItem('yafta_projects_list', JSON.stringify(updated));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════════════════════════
                6. MEDIA MANAGER TAB
                ════════════════════════════ */}
            {activeAdminTab === 'media' && (
              <div className="space-y-5 animate-fade-in text-right">
                <span className="text-[11px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded tracking-wider uppercase font-mono block w-fit">
                  {isAr ? 'معمل ضغط واستلام ملفات الوسائط ميكرومترية' : 'MEDIA LAB & DRAG DROP WORKSPACE'}
                </span>

                {/* Drag and Drop Region */}
                <div className="border-2 border-dashed border-gold-550/30 rounded-2xl p-6 bg-neutral-900/60 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gold-950/80 border border-gold-505/20 flex items-center justify-center text-gold-505 mx-auto animate-pulse">
                    <HardDriveDownload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-white">{isAr ? 'اسحب تصميم اللافتة أو المخطط الهندسي لرفعه الفوري' : 'Drop designs or CAD folders here'}</h4>
                    <p className="text-[10px] text-neutral-400 max-w-sm mx-auto">{isAr ? 'يقبل ملفات عالية الدقة CAD, PDF, WebP, PNG, JPG لمساحة تخزينية لا نهائية' : 'Supports raw heavy prints, CAD mechanical specs.'}</p>
                  </div>
                  <button 
                    onClick={() => {
                      triggerToast('محاكاة: جاري اختيار الملف وتحويله لصيغة فائقة الضغط WebP... ⚙️');
                      setTimeout(() => {
                        const newF = {
                          id: Date.now().toString(),
                          name: `client_cad_${Date.now().toString().slice(-4)}.webp`,
                          size: '422 KB',
                          dimensions: '1440x900',
                          format: 'WebP Image',
                          url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800'
                        };
                        const updated = [...mediaFiles, newF];
                        setMediaFiles(updated);
                        localStorage.setItem('yafta_media_files', JSON.stringify(updated));
                        triggerToast('تم رفع وضغط ملف التصميم بنسبة 64% بنجاح! 💾');
                        addActivity(`مستكشف ميديا: رفع وضغط ملف: ${newF.name}`);
                      }, 1500);
                    }}
                    className="px-4 py-2 text-[10px] font-bold tracking-wider text-black bg-gold-505 hover:bg-gold-300 rounded-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    {isAr ? 'اختيار ملف تفاعلي من جهازك' : 'Choose Local File'}
                  </button>
                </div>

                {/* Media list */}
                <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden divide-y divide-neutral-800">
                  {mediaFiles.map((file: any) => (
                    <div key={file.id} className="p-3 flex items-center justify-between text-right gap-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            triggerToast('جاري تشغيل خوارزميات الضغط الهندسية الذكية... 🔨');
                            setTimeout(() => {
                              const updated = mediaFiles.map(f => f.id === file.id ? { ...f, size: `${Math.round(parseFloat(f.size) * 0.5)} KB`, name: f.name.replace('.jpg', '_opt.webp').replace('.png', '_opt.webp') } : f);
                              setMediaFiles(updated);
                              localStorage.setItem('yafta_media_files', JSON.stringify(updated));
                              triggerToast('تم ضغط الملف وتقليص الحجم بمعدل 50%! 📉');
                              addActivity(`معالج الصور: تحسين وضغط ميكانيكي لـ: ${file.name}`);
                            }, 1000);
                          }}
                          className="px-2 py-1 bg-neutral-950 border border-gold-505/10 hover:border-gold-505 text-[9px] text-gold-300 rounded font-mono font-bold cursor-pointer"
                          title="تحسين وضغط الصورة"
                        >
                          Optimize 🧠
                        </button>
                        
                        <button 
                          onClick={() => {
                            const updated = mediaFiles.filter(f => f.id !== file.id);
                            setMediaFiles(updated);
                            localStorage.setItem('yafta_media_files', JSON.stringify(updated));
                            triggerToast('تم مسح الملف بنجاح');
                            addActivity(`حذف ملف ميديا: ${file.name}`);
                          }}
                          className="p-1 text-rose-400 hover:text-white cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <strong className="text-xs text-white block truncate max-w-[180px]">{file.name}</strong>
                        <span className="text-[10px] text-neutral-400 block font-mono">
                          {file.size} • {file.dimensions} • {file.format}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════════════════════════
                7. CUSTOMER MANAGEMENT TAB
                ════════════════════════════ */}
            {activeAdminTab === 'clients' && (
              <div className="space-y-4 animate-fade-in text-right animate-fade-in">
                <span className="text-[11px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded tracking-wider uppercase font-mono block w-fit">
                  {isAr ? 'سجل قاعدة العملاء وشركاء النجاح بمصر' : 'VIP B2B CORPORATE CLIENTS LOG'}
                </span>

                <div className="space-y-3 font-sans">
                  {teamMembers.map((cl: any) => (
                    <div key={cl.id} className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-xl flex items-center justify-between gap-3 text-right">
                      <button 
                        onClick={() => {
                          if (confirm(isAr ? 'حذف العميل من السجل؟' : 'Delete client profile?')) {
                            const updated = teamMembers.filter((t: any) => t.id !== cl.id);
                            setTeamMembers(updated);
                            localStorage.setItem('yafta_team_members', JSON.stringify(updated));
                            triggerToast('تم الحذف');
                          }
                        }}
                        className="text-rose-500 text-xs hover:underline cursor-pointer"
                      >
                        {cl.notes && cl.notes.includes('الطلبات') ? (isAr ? 'مسح حساب العميل' : 'Delete Client') : (isAr ? 'فصل الكادر الفني' : 'Dismiss Specialist')}
                      </button>

                      <div>
                        <strong className="text-xs text-white block">{isAr ? cl.nameAr : cl.nameEn}</strong>
                        <span className="text-[10px] text-gold-505 block">{isAr ? cl.positionAr : cl.positionEn}</span>
                        <p className="text-[10px] text-neutral-400 mt-1 max-w-[280px]">{cl.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════════════════════════
                8. TEAM MEMBERS TAB
                ════════════════════════════ */}
            {activeAdminTab === 'team' && (
              <div className="space-y-4 animate-fade-in text-right">
                <span className="text-[11px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded tracking-wider uppercase font-mono block w-fit">
                  {isAr ? 'عنبر الكوادر البشرية والمهندسين' : 'YAFTA PROFESSIONAL RIGGERS & ENGINEERS'}
                </span>

                <div className="space-y-3.5">
                  {teamMembers.map((team: any) => (
                    <div key={team.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] bg-neutral-950 text-gold-300 px-2.5 py-1 rounded-md border border-neutral-800 font-mono">STAFF-ID: {team.id}</span>
                        <strong className="text-xs text-white">{isAr ? team.nameAr : team.nameEn}</strong>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div className="space-y-1">
                          <label className="text-[9px] text-neutral-500 block">{isAr ? 'اسم المهندس/العامل:' : 'Name:'}</label>
                          <input 
                            type="text"
                            value={isAr ? team.nameAr : team.nameEn}
                            className="w-full bg-neutral-950 border border-neutral-800 p-1.5 rounded test-xs text-white text-right"
                            onChange={(e) => {
                              const updated = teamMembers.map(t => t.id === team.id ? (isAr ? { ...t, nameAr: e.target.value } : { ...t, nameEn: e.target.value }) : t);
                              setTeamMembers(updated);
                              localStorage.setItem('yafta_team_members', JSON.stringify(updated));
                            }}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-neutral-500 block">{isAr ? 'المنصب الفني التخصصي:' : 'Position:'}</label>
                          <input 
                            type="text"
                            value={isAr ? team.positionAr : team.positionEn}
                            className="w-full bg-neutral-950 border border-neutral-800 p-1.5 rounded test-xs text-white text-right"
                            onChange={(e) => {
                              const updated = teamMembers.map(t => t.id === team.id ? (isAr ? { ...t, positionAr: e.target.value } : { ...t, positionEn: e.target.value }) : t);
                              setTeamMembers(updated);
                              localStorage.setItem('yafta_team_members', JSON.stringify(updated));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════════════════════════
                9. DESIGN STUDIO TAB
                ════════════════════════════ */}
            {activeAdminTab === 'design' && (
              <div className="space-y-4 animate-fade-in text-right">
                <span className="text-[11px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded tracking-wider uppercase font-mono block w-fit">
                  {isAr ? 'ألوان وقوالب اللمسة الملوكية الذهبية' : 'GOLD SHADINGS DESIGN STUDIO'}
                </span>

                <div className="bg-neutral-900 border border-gold-500/10 p-5 rounded-2xl space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white block">{isAr ? 'اختر قالب درجة اللون الذهبي:' : 'Luxury Shading Presets:'}</label>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'champagne', nameAr: 'شامبين هادئ 🍾', nameEn: 'Champagne Luxury' },
                        { id: 'royal', nameAr: 'متروبوليتان فاقع 👑', nameEn: 'Royal Yellow' },
                        { id: 'cyber-neon', nameAr: 'أمبر سايبر نيون ⚡', nameEn: 'Cyber Neon' }
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => {
                            setSelectedGoldTheme(preset.id);
                            triggerToast(isAr ? `تطبيق درجات اللون الذهبي: ${preset.nameAr} في كامل الموقع!` : `Theme active: ${preset.nameEn}`);
                            addActivity(`المظهر الخارجي: تبديل التدرج الذهبي إلى: ${preset.nameEn}`);
                          }}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                            selectedGoldTheme === preset.id
                              ? 'border-gold-505 bg-gold-950/80 text-white font-extrabold'
                              : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <span className="text-xs font-bold">{isAr ? preset.nameAr : preset.nameEn}</span>
                          <span className="text-[8px] font-mono block opacity-60">Accent {preset.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                    <label className="text-xs font-extrabold text-white block">{isAr ? 'معايير تقوس وإشعاع الحواف (Border Radius):' : 'Border Rounding System:'}</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button 
                        onClick={() => triggerToast(isAr ? 'تم تطبيق الحواف الحادة الراقية!' : 'Square borders activated')} 
                        className="py-2.5 rounded bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 text-neutral-300 font-bold cursor-pointer"
                      >
                        {isAr ? 'حواف حادة ميكانيكية' : 'Mechanical Square'}
                      </button>
                      <button 
                        onClick={() => triggerToast(isAr ? 'تم مواءمة الحواف المستديرة السلسة!' : 'Liquid rounding activated')} 
                        className="py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 text-neutral-300 font-bold cursor-pointer"
                      >
                        {isAr ? 'حواف بريميوم مستديرة' : 'Premium Liquid'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-extrabold text-white block mb-2">{isAr ? 'مؤشر سطوع إضاءة الخلفية لليدز:' : 'Dynamic Background Lumens Grid:'}</label>
                    <input 
                      type="range" 
                      min={10} 
                      max={100} 
                      className="w-full accent-gold-505 bg-neutral-950 rounded-lg cursor-pointer h-2" 
                      defaultValue={60}
                      onChange={(e) => addActivity(`تعديل سطوع ليدات الخلفية للموقع إلى: ${e.target.value}%`)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════
                10. SEO MANAGER TAB
                ════════════════════════════ */}
            {activeAdminTab === 'seo' && (
              <div className="space-y-4 animate-fade-in text-right font-sans">
                <span className="text-[11px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded tracking-wider uppercase font-mono block w-fit">
                  {isAr ? 'تهيئة محركات الأبحاث والروبوتس والكلمات' : 'ORGANIC SEARCH META MANAGER'}
                </span>

                <div className="bg-neutral-900 border border-gold-500/10 p-5 rounded-2xl space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white block">{isAr ? 'عنوان الموقع في جوجل (Meta Title):' : 'Default Meta Title:'}</label>
                    <input 
                      type="text"
                      className="w-full bg-neutral-950 border border-neutral-850 p-2 text-xs text-white text-right rounded"
                      value={seoMeta.title}
                      onChange={(e) => {
                        const updated = { ...seoMeta, title: e.target.value };
                        setSeoMeta(updated);
                        localStorage.setItem('yafta_seo_meta', JSON.stringify(updated));
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white block">{isAr ? 'الكلمات المفتاحية للأرشفة (Keywords):' : 'Meta Keywords:'}</label>
                    <input 
                      type="text"
                      className="w-full bg-neutral-950 border border-neutral-850 p-2 text-xs text-white text-right rounded"
                      value={seoMeta.keywords}
                      onChange={(e) => {
                        const updated = { ...seoMeta, keywords: e.target.value };
                        setSeoMeta(updated);
                        localStorage.setItem('yafta_seo_meta', JSON.stringify(updated));
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white block">{isAr ? 'مخطط الروبوتس (Robots.txt Content):' : 'Robots.txt Content Template:'}</label>
                    <textarea 
                      className="w-full h-18 bg-neutral-950 border border-neutral-850 p-2 text-[10px] text-zinc-300 font-mono text-left rounded"
                      value={`User-agent: *\nAllow: /\nSitemap: ${seoMeta.sitemapUrl}`}
                      readOnly
                    />
                  </div>

                  <button 
                    onClick={() => {
                      triggerToast('تم إعادة ترتيب وتوليد ملف sitemap.xml والمسارات بنجاح جاري إرساله لجوجل! 🚀');
                      addActivity('روبوت الأرشفة: توليد تلقائي للوحات sitemap.xml والمسارات الفهرسية');
                    }}
                    className="w-full py-2 bg-neutral-950 hover:bg-neutral-900 border border-gold-505/25 text-[10px] text-gold-300 font-bold rounded cursor-pointer"
                  >
                    {isAr ? 'إعادة توليد خريطة الموقع Sitemap.xml وإرساله لجوجل' : 'Ping Google Webmasters Search Console'}
                  </button>
                </div>
              </div>
            )}

            {/* ════════════════════════════
                11. BLOG ARTICLES TAB
                ════════════════════════════ */}
            {activeAdminTab === 'blog' && (
              <div className="space-y-4 animate-fade-in text-right">
                <span className="text-[11px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded tracking-wider uppercase font-mono block w-fit">
                  {isAr ? 'عنبر مقالات ومواضيع يافطة الهندسية' : 'EDITORIAL BLOG ARCHIVE'}
                </span>

                <button 
                  onClick={() => {
                    const title = prompt(isAr ? 'ادخل عنوان المقال العربي الجديد:' : 'Enter article title:');
                    if (title) {
                      const newA = {
                        id: Date.now().toString(),
                        titleAr: title,
                        titleEn: 'Standard engineering reference guidelines',
                        category: 'دراسات هندسية',
                        date: new Date().toLocaleDateString(),
                        tags: ['يافطة', 'تكنولوجيا']
                      };
                      const updated = [newA, ...blogArticles];
                      setBlogArticles(updated);
                      localStorage.setItem('yafta_blog_articles', JSON.stringify(updated));
                      triggerToast('تمت صياغة وإضافة مسودة المقال للمدونة بنجاح! 📕');
                      addActivity(`التحرير وصياغة المقالات: إضافة مقال جديد: ${title}`);
                    }
                  }}
                  className="px-3 py-1 bg-gold-950 hover:bg-gold-900 border border-gold-505/20 text-[10px] text-gold-300 rounded font-bold cursor-pointer"
                >
                  + {isAr ? 'كتابة مقال مهني جديد' : 'Write New Article'}
                </button>

                <div className="space-y-3">
                  {blogArticles.map((art: any) => (
                    <div key={art.id} className="bg-neutral-900/80 border border-neutral-805 p-3.5 rounded-xl text-right space-y-1.5">
                      <div className="flex justify-between items-center text-[9px] text-neutral-400">
                        <span className="text-gold-505 font-mono">{art.date}</span>
                        <span className="bg-neutral-950 px-2 rounded-md font-bold">{art.category}</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-white">{art.titleAr}</h4>
                      <div className="flex gap-1 justify-end pt-1">
                        {art.tags.map((tg: string, i: number) => (
                          <span key={i} className="text-[9px] text-gold-400 border border-gold-500/10 px-1 rounded bg-neutral-950">#{tg}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════════════════════════
                12. FORMS MANAGEMENT TAB
                ════════════════════════════ */}
            {activeAdminTab === 'forms' && (
              <div className="space-y-4 animate-fade-in text-right">
                <span className="text-[11px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded tracking-wider uppercase font-mono block w-fit">
                  {isAr ? 'صندوق الوارد واستمارات العملاء (CRM)' : 'CRM COMMUNICATIONS DESK'}
                </span>

                <div className="space-y-3">
                  {submittedInquiries.map((inq: any) => (
                    <div key={inq.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-right space-y-3 relative">
                      {/* Top Status */}
                      <div className="flex justify-between items-center text-[10px]">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          inq.status === 'تم الرد' ? 'bg-emerald-950 text-emerald-400 border border-emerald-550/20' : 'bg-gold-950 text-gold-300 border border-gold-505/20'
                        }`}>{inq.status || 'معلق'}</span>
                        <span className="text-neutral-500 font-mono">{inq.date}</span>
                      </div>

                      {/* Header details */}
                      <div>
                        <h4 className="text-xs font-black text-white">{inq.name}</h4>
                        <span className="text-[10px] text-gold-300 font-bold block">{inq.company || 'مستفسر خاص'} • {inq.phone}</span>
                      </div>

                      {/* Content Msg */}
                      <p className="text-[11px] text-neutral-300 leading-relaxed font-sans bg-neutral-950 p-2.5 rounded-lg border border-neutral-850 whitespace-pre-line">
                        {inq.message}
                      </p>

                      {/* Estimation calculation index */}
                      {inq.estimate && (
                        <div className="text-[10px] flex justify-between items-center bg-gold-950/20 border border-gold-505/10 p-2 rounded-lg">
                          <span className="text-neutral-400">{isAr ? 'مؤشر الحاسبة التلقائية المقدرة:' : 'Calculator Value INDEX:'}</span>
                          <strong className="text-emerald-400 font-mono font-extrabold">{inq.estimate.toLocaleString()} ج.م</strong>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2 justify-end pt-2 border-t border-neutral-800/80">
                        {inq.status !== 'تم الرد' && (
                          <button 
                            onClick={() => {
                              const updated = submittedInquiries.map(i => i.id === inq.id ? { ...i, status: 'تم الرد' } : i);
                              setSubmittedInquiries(updated);
                              localStorage.setItem('yafta_submitted_inquiries', JSON.stringify(updated));
                              triggerToast('تم فورا تمييز الاستبيان كـ "تم التواصل بنجاح"! 📞');
                              addActivity(`CRM المبيعات: تم الرد والتواصل هاتفياً مع العميل: ${inq.name}`);
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold text-black bg-gold-505 hover:bg-gold-300 rounded cursor-pointer"
                          >
                            {isAr ? 'اتصال هاتفي نشط وتقفيل الطلب تم' : 'Mark as Contacted'}
                          </button>
                        )}

                        <button 
                          onClick={() => {
                            const updated = submittedInquiries.filter(i => i.id !== inq.id);
                            setSubmittedInquiries(updated);
                            localStorage.setItem('yafta_submitted_inquiries', JSON.stringify(updated));
                            triggerToast('تم الحذف بنجاح');
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold text-rose-400 hover:text-white bg-rose-950/20 hover:bg-rose-950 rounded cursor-pointer border border-rose-500/10"
                        >
                          {isAr ? 'أرشفة ومسح 🗑️' : 'Archive'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════════════════════════
                13. USER ACCOUNTS TAB
                ════════════════════════════ */}
            {activeAdminTab === 'users' && (
              <div className="space-y-4 animate-fade-in text-right">
                <span className="text-[11px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded tracking-wider uppercase font-mono block w-fit">
                  {isAr ? 'قائمة المشغلين النشطين وصلاحيات الحماية' : 'SECURITY OPERATORS DIRECTORY'}
                </span>

                <div className="space-y-3.5">
                  {adminUsers.map((usr: any, idx: number) => (
                    <div key={idx} className="bg-neutral-900 border border-neutral-805 p-4 rounded-xl text-right space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="bg-gold-950 text-gold-300 px-2 rounded-md font-bold">{usr.role}</span>
                        <span className="text-zinc-500 font-mono">آخر دخول: {usr.lastLogin}</span>
                      </div>
                      <strong className="text-xs text-white block mt-1">المستخدم: {usr.username} ({usr.email})</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════════════════════════
                14. BACKUP & RESTORE TAB
                ════════════════════════════ */}
            {activeAdminTab === 'backup' && (
              <div className="space-y-4 animate-fade-in text-right">
                <span className="text-[11px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded tracking-wider uppercase font-mono block w-fit">
                  {isAr ? 'منصة الطوارئ وصناعة النسخ الاحتياطية' : 'FACTORY RECOVERY & STANDALONE BACKUPS'}
                </span>

                <div className="bg-neutral-900 border border-gold-500/10 p-5 rounded-2xl space-y-5">
                  <div className="space-y-1 leading-relaxed">
                    <h4 className="text-xs font-black text-white">{isAr ? 'شرح آلية أمان وتصدير البيانات:' : 'Database export safety criteria:'}</h4>
                    <p className="text-[10px] text-neutral-400">
                      {isAr 
                        ? 'يمكنك تنزيل البيانات الحالية وقوائم المشاريع والخدمات المعدلة بالكامل كملف JSON مشفر، لتحرث خيار الأمان التام ونقل البيانات بين المتصفحات وتنزيل الباك أب لتفادي خسارة المجهود الإداري.'
                        : 'Secure full system snapshot configurations. Download and swap databases across platforms.'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-2">
                    <button 
                      onClick={downloadBackup}
                      className="w-full py-3 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
                    >
                      {isAr ? 'تصدير وتحميل النسخة الاحتياطية فورا (Export Backup)' : 'Download Snap JSON Backup'}
                    </button>

                    <button 
                      onClick={resetToFactoryDefaults}
                      className="w-full py-2.5 bg-rose-950/40 hover:bg-rose-950 border border-rose-500/20 text-rose-350 hover:text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      {isAr ? '⚠️ تصفير البيانات والعودة للنسخة الافتراضية للكود (Hard Reset)' : '⚠️ Hard Reset LocalStorage Cache'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════
                15. SECURITY CENTER TAB
                ════════════════════════════ */}
            {activeAdminTab === 'security' && (
              <div className="space-y-4 animate-fade-in text-right">
                <span className="text-[11px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded tracking-wider uppercase font-mono block w-fit">
                  {isAr ? 'تفاصيل السجلات وجدران الحماية الإشعاعية' : 'ACTIVE EXTREME SECURITY SHIELD'}
                </span>

                <div className="bg-neutral-900 border border-gold-500/10 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-xs">
                      <span className="text-emerald-500 font-extrabold">● {isAr ? 'نشط ومستقر' : 'Active stable'}</span>
                    </div>
                    <strong className="text-xs text-white">{isAr ? 'بروتوكولات الأمان الفدرالية:' : 'Firewall level indices:'}</strong>
                  </div>

                  <div className="text-[10px] space-y-1.5 text-neutral-400">
                    <div className="flex justify-between font-mono bg-neutral-950 p-2 rounded">
                      <span>99.8%</span>
                      <span>{isAr ? 'مؤشر أداء وسرعة الاستجابة:' : 'Security Index Speed:'}</span>
                    </div>
                    <div className="flex justify-between font-mono bg-neutral-950 p-2 rounded">
                      <span>Enabled</span>
                      <span>{isAr ? 'بروتوكول فك تشفير SSL 256-bit:' : 'SSL Encryption standard:'}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      triggerToast(isAr ? 'تم تدوير وحفظ مفاتيح التشفير بشكل آمن!' : 'Security cryptographic rotation executed');
                      addActivity('الأمن والحماية: تدوير وتحديث مفاتيح التفريد والتفويض الأمني للمجالات');
                    }}
                    className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 text-[10px] text-zinc-300 font-bold rounded cursor-pointer"
                  >
                    {isAr ? 'دوران تلقائي لمفاتيح التشفير (Rotate Security Keys)' : 'Rotate Security Cryptographic Keys'}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Panel */}
          <div className="p-4 md:p-5 bg-neutral-900 border-t border-gold-500/20 text-center flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[10px] text-neutral-400 font-sans leading-none font-bold">
              {isAr ? 'تصميم بنظام التحكم الذكي الفاخر • يافطة ٢٠٢٦ ©' : 'YAFTA AD CMS CONSOLE INTERACTIVE DESK • 2026'}
            </p>
            
            <button 
              onClick={() => setIsAdminOpen(false)}
              className="px-4 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 font-black text-[10px] hover:scale-102 transition-transform cursor-pointer rounded-lg shadow-lg font-bold"
            >
              {isAr ? 'إغلاق والعودة للموقع الرئيسي' : 'Exit Console Preview'}
            </button>
          </div>

        </div>
      )}

      {/* SECURE MODERN AUTHENTICATION AND ROLE SELECTION CONTROLLER */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        isAr={isAr} 
        onLoginSuccess={handleLoginSuccess}
        triggerToast={triggerToast}
      />

      {/* 🔮 SUPER ADMIN UNLIMITED VISUAL SYSTEM EXPERIENCE STUDIO MODAL */}
      <ExperienceStudio
        isAr={isAr}
        isOpen={isExperienceStudioOpen}
        onClose={() => setIsExperienceStudioOpen(false)}
        config={experienceConfig}
        onChange={(newConfig) => {
          setExperienceConfig(newConfig);
          triggerToast(isAr ? 'تم فوراً تطبيق عناصر المظهر وحفظ أريج الهوية البصرية! 💎' : 'Visual parameters successfully compiled & persistent.');
        }}
        triggerToast={triggerToast}
        addActivity={addActivity}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* GLOBAL CASE STUDY MODAL OVERLAY */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-55 overflow-y-auto">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-3xl max-w-4xl w-full my-8 relative overflow-hidden flex flex-col shadow-2xl animate-scale-up max-h-[90vh]">
            
            {/* Modal header */}
            <div className="p-5 md:p-6 bg-neutral-900/80 border-b border-gold-500/10 flex items-center justify-between z-10">
              <div className="text-right sm:text-right">
                <span className="text-[10px] bg-gold-950 text-gold-300 font-bold px-3 py-1 rounded border border-gold-505/20 uppercase tracking-widest">
                  {isAr ? 'عقد النجاح • دراسة حالة معتمدة' : 'VERIFIED PROJECT CASE STUDY'}
                </span>
                <h3 className="text-lg md:text-xl font-black text-white mt-1 leading-tight">
                  {isAr ? selectedProject.titleAr : selectedProject.titleEn}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="p-2 bg-neutral-900 border border-neutral-800 hover:border-gold-505 text-neutral-400 hover:text-white rounded-full transition-all shrink-0 ml-4 cursor-pointer"
                aria-label="Close case study"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable contents */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-8 font-sans text-right scrollbar-thin">
              
              {/* Photo Showcase Carousel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="h-64 sm:h-80 rounded-2xl overflow-hidden border border-gold-505/20 shadow-lg relative bg-neutral-900">
                  <img 
                    src={selectedProject.coverImage} 
                    alt={selectedProject.titleEn}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
                  <div className="absolute left-4 bottom-4 z-10 bg-black/75 px-3.5 py-1.5 rounded-lg border border-gold-505/25 text-[10px] text-gold-300 font-bold tracking-wider">
                    {isAr ? 'الصورة النهائية للواجهة' : 'FINAL OUTDOOR PRESENTATION'}
                  </div>
                </div>

                {/* Technical stats boxes */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-white pb-2 border-b border-gold-500/10 uppercase tracking-wider">
                    {isAr ? 'ملف المواصفات والعنبر الميكانيكي:' : 'Mechanical & Installation Log:'}
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-neutral-900/60 p-3 rounded-xl border border-gold-500/5 space-y-1 text-right">
                      <span className="text-neutral-500 font-bold block">{isAr ? 'اسم الشريك:' : 'Client Brand:'}</span>
                      <strong className="text-white block truncate">{isAr ? selectedProject.clientAr : selectedProject.clientEn}</strong>
                    </div>

                    <div className="bg-neutral-900/60 p-3 rounded-xl border border-gold-500/5 space-y-1 text-right">
                      <span className="text-neutral-500 font-bold block">{isAr ? 'تاريخ التسليم:' : 'Log Date:'}</span>
                      <strong className="text-white block truncate font-mono">{selectedProject.completionDate}</strong>
                    </div>

                    <div className="bg-neutral-900/60 p-3 rounded-xl border border-gold-500/5 space-y-1 col-span-2 text-right">
                      <span className="text-neutral-500 font-bold block">{isAr ? 'نوع التشغيل والمادة:' : 'Metal & Component Specs:'}</span>
                      <strong className="text-gold-300 block truncate">{isAr ? selectedProject.serviceTypeAr : selectedProject.serviceTypeEn}</strong>
                    </div>
                  </div>

                  {/* Bullet specs summary */}
                  <div className="space-y-1.5 pt-2 text-right">
                    <span className="text-[10px] font-bold text-gold-300 uppercase block tracking-wider">
                      {isAr ? 'الخامات الهندسية المعتمدة:' : 'Certified Materials Formula:'}
                    </span>
                    <ul className="space-y-1.5">
                      {selectedProject.specificationsAr && (isAr ? selectedProject.specificationsAr : selectedProject.specificationsEn || []).map((spec, sIdx) => (
                        <li key={sIdx} className="flex items-center gap-1.5 text-xs text-neutral-400 justify-end">
                          <span>{spec}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-505 shrink-0"></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Textual Description of case study */}
              <div className="space-y-4 pt-4 border-t border-gold-500/10">
                <div className="space-y-2">
                  <h4 className="text-base font-black text-white">{isAr ? 'قصة وخطوات التنفيذ للموقع:' : 'Full Structural Execution Pathway:'}</h4>
                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                    {isAr ? selectedProject.overviewAr : selectedProject.overviewEn}
                  </p>
                </div>
                
                {selectedProject.challengeAr && (
                  <div className="space-y-2">
                    <h4 className="text-base font-black text-rose-450 text-gold-302">{isAr ? 'التصدي للتحديات الهندسية بموقع المشروع:' : 'Resolving Structural Geometrical Hurdles:'}</h4>
                    <p className="text-xs md:text-sm text-neutral-350 text-neutral-400 leading-relaxed font-sans">
                      {isAr ? selectedProject.challengeAr : selectedProject.challengeEn}
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 md:p-6 bg-neutral-900 border-t border-gold-500/10 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-[11px] text-zinc-400 font-bold">{isAr ? 'يافطة تلتزم دوما بتقديم أقصى معايير الجودة والاستدامة' : 'YAFTAs high engineering standards speak louder'}</span>
              
              <button 
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2.5 bg-gradient-to-r from-gold-300 via-gold-505 to-gold-500 text-black text-xs font-black rounded-xl hover:scale-102 transition-transform cursor-pointer"
              >
                {isAr ? 'أغلق النافذة والعودة' : 'Close Narrative'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
