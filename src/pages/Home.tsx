/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { PageId, Project, Testimonial } from '../types';
import { STATISTICS_COUNTERS, PROJECTS_DATA, TRUST_VALUES, TESTIMONIALS_DATA } from '../data';
import { 
  Sparkles, ArrowRight, ArrowLeft, Star, Phone, MessageSquare, ShieldCheck, 
  Play, Award, Layers, ChevronRight, ChevronLeft, Calendar, User, ArrowUpRight, 
  Check, Zap, Cpu, RefreshCw, BarChart3, HelpCircle, Eye, EyeOff, Info, 
  BookOpen, Heart, Laptop, Smartphone, HelpCircle as HelpIcon, Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AISpecGenerator from '../components/AISpecGenerator';
import ContrastSimulator from '../components/ContrastSimulator';
import LoadCalculator from '../components/LoadCalculator';

interface Props {
  setActivePage: (page: PageId) => void;
  isAr: boolean;
  onSelectProject: (proj: Project) => void;
  featuredTestimonial: Testimonial;
  projectsList?: Project[];
  statisticsCounters?: any[];
  customContent?: {
    heroTitleAr?: string;
    heroTitleEn?: string;
    heroDescAr?: string;
    heroDescEn?: string;
  };
  blogArticles?: any[];
  testimonialsList?: Testimonial[];
}

export const SECTORS_LIST = [
  { id: 'fashion_boutique', nameAr: 'بوتيك ملابس وأزياء راقية 👗', nameEn: 'Luxury Fashion Boutique 👗', backing: 'antique_dark', letters: 'titanium_gold', lighting: 'halo_warm', safety: 'std_cairo', basePrice: 22000, maxPrice: 38000, visibility: 96 },
  { id: 'cafe_bistro', nameAr: 'مقهى ومخبوزات فرنسية 🥐', nameEn: 'Cafe & French Bakery 🥐', backing: 'timber_slats', letters: 'neon_kufi', lighting: 'neon_ambient', safety: 'std_cairo', basePrice: 18000, maxPrice: 32000, visibility: 94 },
  { id: 'fine_dining', nameAr: 'مطعم مأكولات وغداء فاخر 🥩', nameEn: 'Fine Dining Restaurant 🥩', backing: 'charcoal_matte', letters: 'stainless_304', lighting: 'dual_emission', safety: 'std_cairo_heavy', basePrice: 38000, maxPrice: 65000, visibility: 98 },
  { id: 'fitness_gym', nameAr: 'نادي رياضي وصالة لياقة بدنية 🏋️', nameEn: 'Fitness Gym & Club 🏋️', backing: 'steel_mesh', letters: 'glossy_red_acrylic', lighting: 'rgb_pulse', safety: 'steel_reinforced', basePrice: 45000, maxPrice: 80000, visibility: 95 },
  { id: 'corporate_hq', nameAr: 'مكاتب شركات ومقرات إدارية 🏢', nameEn: 'Corporate Headquarters 🏢', backing: 'prestige_white', letters: 'matte_brushed_steel', lighting: 'backlit_white', safety: 'structural_certified', basePrice: 60000, maxPrice: 110000, visibility: 90 },
  { id: 'dental_clinic', nameAr: 'عيادات طب وتجميل الأسنان 🦷', nameEn: 'Elite Dental Clinic 🦷', backing: 'frost_glass_look', letters: 'backlit_acrylic_blue', lighting: 'pure_cool_white', safety: 'std_cairo', basePrice: 16000, maxPrice: 28050, visibility: 92 },
  { id: 'high_tech_store', nameAr: 'متاجر إلكترونيات وتطبيقات 💻', nameEn: 'High-Tech Reseller 💻', backing: 'matrix_black', letters: 'edge_lit_acrylic', lighting: 'neon_sapphire', safety: 'std_cairo', basePrice: 28000, maxPrice: 52000, visibility: 97 },
  { id: 'legal_firm', nameAr: 'مكتب محاماة ومستشارون قانونيون ⚖️', nameEn: 'Legal & Law Chambers ⚖️', backing: 'imperial_green', letters: 'pvd_brass_shined', lighting: 'subtle_backlit', safety: 'std_cairo', basePrice: 24000, maxPrice: 42000, visibility: 91 },
  { id: 'beauty_salon', nameAr: 'صالون تجميل وعناية بالمرأة 💅', nameEn: 'Premium Beauty Salon 💅', backing: 'pink_velvet_wood', letters: 'rose_gold_titanium', lighting: 'halo_warm_rose', safety: 'std_cairo', basePrice: 20000, maxPrice: 36000, visibility: 94 },
  { id: 'spa_center', nameAr: 'مركز استجمام وسبا فاخر 🌿', nameEn: 'Luxury Wellness Spa 🌿', backing: 'natural_bamboo', letters: 'led_embedded_wood', lighting: 'emerald_warm', safety: 'std_cairo', basePrice: 25000, maxPrice: 45000, visibility: 93 },
  { id: 'real_estate', nameAr: 'شركة تسويق وتطوير عقاري 🏠', nameEn: 'Real Estate Agency 🏠', backing: 'navy_royal_matte', letters: 'extrabold_mirror_gold', lighting: 'frontlit_halo_dual', safety: 'heavy_wind_shield', basePrice: 35000, maxPrice: 60000, visibility: 95 },
  { id: 'lifestyle_hotel', nameAr: 'فندق نزل ومنتجع سياحي 🏨', nameEn: 'Bespoke Lifestyle Hotel 🏨', backing: 'limestone_marble', letters: 'monolithic_bronze', lighting: 'dali_dimmable_gold', safety: 'extreme_seismic_load', basePrice: 85000, maxPrice: 160000, visibility: 93 },
  { id: 'gourmet_market', nameAr: 'سوبرماركت وأغذية ذواقة 🍎', nameEn: 'Gourmet Food Market 🍎', backing: 'charcoal_wood_slats', letters: 'frontlit_channel_green', lighting: 'warm_yellow_halo', safety: 'std_cairo', basePrice: 30000, maxPrice: 55000, visibility: 96 },
  { id: 'pharmacy_biotech', nameAr: 'صيدلية ومجمع طبي معتمد 🧪', nameEn: 'Pharmacy & Medical Hub 🧪', backing: 'pure_translucent_white', letters: 'cast_green_acrylic', lighting: 'daylight_6000k', safety: 'std_cairo', basePrice: 19000, maxPrice: 34000, visibility: 95 },
  { id: 'car_showroom', nameAr: 'معرض وصالة عرض سيارات الفئة الأولى 🚗', nameEn: 'Premium Car Showroom 🚗', backing: 'textured_carbon_acp', letters: 'oversized_brushed_chrome', lighting: 'intense_pure_neon', safety: 'civil_defense_approved', basePrice: 90000, maxPrice: 220000, visibility: 98 },
  { id: 'jewelry_atelier', nameAr: 'مجوهرات وصاغة ذهب راقية 💎', nameEn: 'Luxury Jewelry Atelier 💎', backing: 'ebony_mirror_gloss', letters: 'pvd_solid_gold_titanium', lighting: 'ultra_high_cri_sparkle', safety: 'reinforced_burglar_proof', basePrice: 40000, maxPrice: 75000, visibility: 99 },
  { id: 'art_gallery', nameAr: 'صالة ومعرض فنون تشكيلية 🎨', nameEn: 'Fine Art Gallery 🎨', backing: 'concrete_raw_look', letters: 'minimalist_black_steel', lighting: 'halo_amber_sunset', safety: 'std_cairo', basePrice: 22000, maxPrice: 39000, visibility: 91 },
  { id: 'coworking_hub', nameAr: 'مساحة عمل مشتركة وحاضنة أعمال 💻', nameEn: 'Innovation Co-working Hub 💻', backing: 'yellow_industrial_mesh', letters: 'laser_cut_acrylic', lighting: 'rgb_smart_sync', safety: 'std_cairo', basePrice: 32000, maxPrice: 58000, visibility: 95 },
  { id: 'architectural_office', nameAr: 'مكتب هندسة معمارية وديكور 📐', nameEn: 'Architectural Design Studio 📐', backing: 'rusty_corten_steel', letters: 'hollow_backlit_bronze', lighting: 'linear_recessed_glow', safety: 'structural_certified', basePrice: 26000, maxPrice: 48000, visibility: 92 },
  { id: 'medical_center', nameAr: 'مستشفى ومستوصف رعاية طبية 🏥', nameEn: 'Integrated Medical Center 🏥', backing: 'hygienic_silver_shield', letters: 'embossed_blue_led', lighting: 'cool_daylight', safety: 'heavy_hazard_shield', basePrice: 55000, maxPrice: 95000, visibility: 94 },
  { id: 'coffee_roastery', nameAr: 'محمصة ومتجر بن قهوة مختصة ☕', nameEn: 'Specialty Coffee Roastery ☕', backing: 'burnt_cedar_timber', letters: 'copper_finish_alloy', lighting: 'halo_roasted_amber', safety: 'std_cairo', basePrice: 21000, maxPrice: 38000, visibility: 94 },
  { id: 'kids_academy', nameAr: 'مدرسة وأكاديمية تدريب أطفال ✏️', nameEn: 'Elite Kids Academy ✏️', backing: 'multi_primary_colors', letters: 'giant_soft_rounded_acrylic', lighting: 'playful_pulsing_glow', safety: 'rounded_edges_safe', basePrice: 28000, maxPrice: 50000, visibility: 95 },
  { id: 'financial_bank', nameAr: 'مصرف ومؤسسة مالية تمويلية 🏛️', nameEn: 'Financial Bank Vault 🏛️', backing: 'granite_stone_composite', letters: 'heavy_gilded_gold', lighting: 'emitted_white_halo', safety: 'bulletproof_heavy_anchors', basePrice: 120000, maxPrice: 280000, visibility: 97 },
  { id: 'perfume_boutique', nameAr: 'عطور ومستحضرات تجميل ملوكية 🧪', nameEn: 'Royal Perfume Atelier 🧪', backing: 'amber_glass_back', letters: 'gilded_laser_brass', lighting: 'warm_golden_halo', safety: 'std_cairo', basePrice: 27000, maxPrice: 47000, visibility: 96 },
  { id: 'bookstore_pub', nameAr: 'مكتبة ودار نشر ومقهى كتب 📚', nameEn: 'Bookstore Café 📚', backing: 'walnut_wood_veneer', letters: 'classic_serif_metal', lighting: 'warm_incandescent_halo', safety: 'std_cairo', basePrice: 18000, maxPrice: 31000, visibility: 93 },
  { id: 'pet_care', nameAr: 'عيادة بيطرية ورعاية حيوانات أليفة 🐾', nameEn: 'Vet & Pet Care Center 🐾', backing: 'pastel_blue_smooth', letters: 'acrylic_pop_animals', lighting: 'soft_ambient_yellow', safety: 'std_cairo', basePrice: 17000, maxPrice: 30000, visibility: 92 },
  { id: 'interior_furniture', nameAr: 'معرض موبيليا وأثاث منزلي فخم 🛋️', nameEn: 'Prestige Furniture Gallery 🛋️', backing: 'ebony_slatted_wood', letters: 'brushed_brass_monolithic', lighting: 'warm_diffused_ambient', safety: 'std_cairo_heavy', basePrice: 42000, maxPrice: 75000, visibility: 94 },
  { id: 'toy_emporium', nameAr: 'مدينة ألعاب ومجسمات ترفيهية 🧸', nameEn: 'Toy & Kids Play City 🧸', backing: 'neon_pink_glossy', letters: 'bubble_blown_acrylic', lighting: 'rainbow_rgb_programmable', safety: 'extreme_sidewalk_bracket', basePrice: 35000, maxPrice: 65000, visibility: 97 },
  { id: 'travel_agency', nameAr: 'وكالة سياحة وحجز رحلات طيران ✈️', nameEn: 'Apex Travel Hub ✈️', backing: 'clouds_blue_vinyl', letters: 'glowing_globe_letters', lighting: 'pure_sky_white', safety: 'std_cairo', basePrice: 19000, maxPrice: 32000, visibility: 93 },
  { id: 'software_startup', nameAr: 'مقر شركة تنمية وتطوير برمجيات 💻', nameEn: 'Apex Software Labs 💻', backing: 'matte_cyberpunk_neon', letters: 'holographic_acrylic', lighting: 'neon_cyber_purple', safety: 'std_cairo', basePrice: 28000, maxPrice: 49000, visibility: 96 },
  { id: 'sweets_bakery', nameAr: 'حلواني ومخبز شرقي وغربي 🧁', nameEn: 'Gourmet Sweets & Bakery 🧁', backing: 'marble_veined_look', letters: 'golden_handwritten_script', lighting: 'soft_warm_halo', safety: 'std_cairo', basePrice: 22000, maxPrice: 38000, visibility: 95 },
  { id: 'modern_barber', nameAr: 'صالون حلاقة وتصفيف رجالي فخم 💈', nameEn: 'Luxury Men’s Grooming 💈', backing: 'monochrome_textured_plate', letters: 'steel_razor_font', lighting: 'retro_pure_white_neon', safety: 'std_cairo', basePrice: 16500, maxPrice: 29000, visibility: 94 },
  { id: 'flower_workshop', nameAr: 'منسق ومحل زهور وهدايا طبيعية 🌹', nameEn: 'Prestige Flower Workshop 🌹', backing: 'vertical_grass_wall', letters: 'backlit_rose_gold', lighting: 'soft_warm_incandescent', safety: 'anti_humidity_shield', basePrice: 20000, maxPrice: 34000, visibility: 95 },
  { id: 'coworking_study_cafe', nameAr: 'مساحة دراسة وبحث ومقهى طلاب 📖', nameEn: 'Student Study Lounge 📖', backing: 'warm_oak_wooden_slats', letters: 'fira_mono_metal', lighting: 'reading_comfort_led', safety: 'std_cairo', basePrice: 17500, maxPrice: 31500, visibility: 93 },
  { id: 'solar_energy', nameAr: 'مقر حلول الطاقة الشمسية ونظيفة ☀️', nameEn: 'Eco Solar Solutions ☀️', backing: 'green_leaf_mesh', letters: 'sun_glowing_frontlit', lighting: 'eco_pure_daylight', safety: 'high_typhoon_factor', basePrice: 34000, maxPrice: 59000, visibility: 94 },
  { id: 'logistics_agency', nameAr: 'مكتب شحن سريع وتوصيل طرود 📦', nameEn: 'Apex Express Logistics 📦', backing: 'industrial_grey_iron', letters: 'heavy_stencil_acrylic', lighting: 'safety_flash_led', safety: 'heavy_roadside_anchoring', basePrice: 25000, maxPrice: 44000, visibility: 95 }
];

export default function Home({ 
  setActivePage, 
  isAr, 
  onSelectProject, 
  projectsList = PROJECTS_DATA,
  statisticsCounters = STATISTICS_COUNTERS,
  customContent,
  blogArticles = [
    { id: '1', titleAr: 'أهمية حساب مقاومة الرياح عند تركيب واجهات الكلادينج العالية', titleEn: 'Evaluating Wind Loads on Skyscraper Cladding', category: 'هندسة ودراسات', categoryEn: 'Engineering', date: '19/06/2026', tagsAr: ['كلادينج', 'سلامة'], tagsEn: ['Cladding', 'Safety'] },
    { id: '2', titleAr: 'مقارنة الاستانلس ستيل عيار 304 والعيارات المقلدة في لافتات الشوارع', titleEn: 'Stainless Steel 304 vs Fake Alloys in Signboards', category: 'خامات ومواد', categoryEn: 'Materials', date: '15/06/2026', tagsAr: ['ستانلس', 'جودة'], tagsEn: ['Stainless', 'Quality'] },
    { id: '3', titleAr: 'تأثير الإضاءة الخلفية الهالة (Halo Backlit) على جذب المارة للمتاجر الفاخرة', titleEn: 'Psychology of Halo Lighting in Premium Reseller Stores', category: 'تصاميم إبداعية', categoryEn: 'Creative Design', date: '10/06/2026', tagsAr: ['إضاءة', 'دعاية'], tagsEn: ['Lighting', 'Marketing'] }
  ],
  testimonialsList = TESTIMONIALS_DATA
}: Props) {
  
  // Navigation triggering
  const handleNav = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finalHeroTitleAr = customContent?.heroTitleAr || 'أعمالنا تتحدث عن جودة ما نقدمه';
  const finalHeroTitleEn = customContent?.heroTitleEn || 'Our Actions Speak for Precision Quality';
  const finalHeroDescAr = customContent?.heroDescAr || 'مجموعة مختارة من المشاريع الهندسية والإنشائية التي نفذتها يافطة باحترافية كاملة في مجالات الهوية البصرية، اللافتات ثلاثية الأبعاد، واجهات الكلادينج، المطبوعات والحلول الرقمية الرائدة.';
  const finalHeroDescEn = customContent?.heroDescEn || 'A curated catalog of premium architectural facades, high-end 3D LED storefronts, precision packaging, and futuristic digital systems completed for Egypt’s finest brands.';

  // Scroll Refs for Horizontal Carousels
  const appsScrollRef = useRef<HTMLDivElement>(null);
  const servicesScrollRef = useRef<HTMLDivElement>(null);
  const portfolioScrollRef = useRef<HTMLDivElement>(null);
  const newsScrollRef = useRef<HTMLDivElement>(null);
  const testimonialsScrollRef = useRef<HTMLDivElement>(null);

  // Smooth Carousel scroll helper (RTL friendly)
  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const cardWidth = 320;
      const multiplier = isAr ? (direction === 'left' ? 1 : -1) : (direction === 'left' ? -1 : 1);
      ref.current.scrollBy({
        left: cardWidth * multiplier,
        behavior: 'smooth'
      });
    }
  };

  // --- Interactive AI Tools State ---
  // 1. AI Spec Generator
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('fashion_boutique');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLoaderStep, setCurrentLoaderStep] = useState(0);
  const [generatedSpec, setGeneratedSpec] = useState<any | null>(null);

  // 2. Upgraded RGB Neon Ambient Visibility Simulator
  const neonPalette = [
    { id: 'gold', nameAr: 'ذهبي مرآة', nameEn: 'Imperial Gold', hex: '#E5C060', ambientAr: 'دالي 3000K دافئ فاخر', ambientEn: 'Calm 3000K Deluxe warm' },
    { id: 'emerald', nameAr: 'أخضر ملكي', nameEn: 'Royal Emerald', hex: '#10B981', ambientAr: 'أخضر ليد مشرق', ambientEn: 'Energetic Emerald' },
    { id: 'sapphire', nameAr: 'أزرق زاهي', nameEn: 'Electric Blue', hex: '#3B82F6', ambientAr: 'أزرق يافطة نيون', ambientEn: 'Deep Sea Blue Neon' },
    { id: 'ruby', nameAr: 'أحمر ناري', nameEn: 'Ruby Fire', hex: '#EF4444', ambientAr: 'أحمر مشع جذاب', ambientEn: 'Blazing Ruby LED' },
    { id: 'rose', nameAr: 'وردي نيون', nameEn: 'Neon Rose', hex: '#EC4899', ambientAr: 'وردي رومنسي دافئ', ambientEn: 'Seductive Velvet Rose' },
    { id: 'pearl', nameAr: 'أبيض ثلجي', nameEn: 'Cool Pearl', hex: '#F3F4F6', ambientAr: 'أبيض ناصع 6000K', ambientEn: 'Pure Arctic White 6000K' }
  ];
  const [selectedNeon, setSelectedNeon] = useState(neonPalette[0]);
  const [isDaytime, setIsDaytime] = useState(false);

  // Additional design parameters
  const [neonText, setNeonText] = useState('YAFTA');
  const [neonFont, setNeonFont] = useState('sans');
  const [neonLightingType, setNeonLightingType] = useState('halo');
  const [neonBacking, setNeonBacking] = useState('black_composite');
  const [neonBrightness, setNeonBrightness] = useState(4);
  const [neonWidthM, setNeonWidthM] = useState(2.8);
  const [neonHeightM, setNeonHeightM] = useState(0.9);

  // 3. LED Pixel pitch and power calculator
  const [storeWidth, setStoreWidth] = useState(10); // in meters

  const steps = [
    isAr ? 'جاري قراءة أبعاد الاسم وتحليل المنحنيات الهندسية...' : 'Parsing typography typography curves...',
    isAr ? 'جاري موازنة تمديدات الأسلاك وحساب مسافات التراص...' : 'Balancing wire loops and LED counts...',
    isAr ? 'حساب مقاومة أحمال الرياح لارتفاع متوقع 6 أمتار...' : 'Calculating wind shear loads for 6-meter facade safety...',
    isAr ? 'صياغة المزيج الطباعي واختيار عيار الاستانلس ستيل...' : 'Finalizing steel alloy grade and PVDF ACP finishes...'
  ];

  // Run mock AI design generation sequence
  const handleGenerateSpec = () => {
    if (!brandName.trim()) {
      alert(isAr ? 'برجاء كتابة اسم علامتكم التجارية أولاً!' : 'Please enter your brand name first!');
      return;
    }
    setIsGenerating(true);
    setGeneratedSpec(null);
    setCurrentLoaderStep(0);

    const interval = setInterval(() => {
      setCurrentLoaderStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Set final results based on industry
          setTimeout(() => {
            setIsGenerating(false);
            setGeneratedSpec(generateSpecReport(brandName, industry));
          }, 400);
          return prev;
        }
      });
    }, 850);
  };

  const generateSpecReport = (name: string, indId: string) => {
    const sec = SECTORS_LIST.find(s => s.id === indId) || SECTORS_LIST[0];
    
    const backTranslation: Record<string, { ar: string; en: string }> = {
      antique_dark: { ar: 'كلادينج ألومنيوم أسود ملكي فئة أولى PVDF بسماكة 4 مم ومقاوم تماماً للعواصف والحرارة.', en: 'Royal Matte Black 4mm ACP cladding coated with premium PVDF, extreme structural coefficient.' },
      timber_slats: { ar: 'واجهة أعواد خشب ساج طبيعي معالج بلون فحمي مطفي فخم مقاوم لانتشار الحريق والرطوبة.', en: 'Deep Charcoal Timber Slat wood cladding with fireproof composite matrix cores.' },
      charcoal_matte: { ar: 'تكسية كلادينج ألومنيوم معزول بلون رمادي فحمي مطفي فخم يعكس الفخامة المطلقة.', en: 'Ultra Matte Charcoal composite backing structurally braced with iron supports.' },
      steel_mesh: { ar: 'شبكة حديد معالجة حرارياً CNC بلون فحمي وطلاء حراري مقاوم للماء والصدمات والصدأ.', en: '3D CNC cut heavy steel mesh backing, powder-coated against corrosion and rain.' },
      prestige_white: { ar: 'تكسية ألواح كلادينج أبيض ثلجي كريستال ناصع اللمعان فئة مقاومة النيران B1.', en: 'Prestige white high-gloss fire-retardant B1 composite cladding backing.' },
      frost_glass_look: { ar: 'ألواح أكريليك كواجهة حليبية مثلجة تفرز بريقاً متوازناً لتجميل الإضاءة والعمق.', en: 'Frosted monolithic glass-look backing creating a stunning neon diffusion barrier.' },
      matrix_black: { ar: 'خلفية كلادينج ألياف كربونية سوداء بلمعة خفيفة تعطي طابعاً تكنولوجياً فخماً.', en: 'Carbon-fiber textured hybrid composite backing sheet, strictly high-contrast.' },
      imperial_green: { ar: 'كلادينج ملكي باللون الأخضر الداكن النبيل مع زخارف ميكانيكية مطلية بالأخضر الذهبي.', en: 'Imperial Green PVDF composite panels with shined geometric gold metal margins.' },
      pink_velvet_wood: { ar: 'ألوح خشبية معالجة بلون خوخي/وردي ناعم مع تشطيبات ميتاليك لا تتأثر بالماء وعصف الرياح.', en: 'Soft Peach/Rose wood composite panels, fully weatherproofed with silk layers.' },
      natural_bamboo: { ar: 'عوارض خيزران وبامبو طبيعي معالج ومقاوم للفطريات والشمس المباشرة بمصر.', en: 'Infused Natural Bamboo cladding slats, high-UV resistant & bio-shield coated.' },
      navy_royal_matte: { ar: 'كلادينج أزرق ملكي كحلي غير لامع يبرز عيار استانلس الهويات ببراعة متزنة.', en: 'Monarch Royal Navy Blue high-contrast composite facade casing.' },
      limestone_marble: { ar: 'تكسية بديل رخام وحجر ميكانيكي عسلي فاخر مضاد تماماً للأملاح والماء وعوامل التعرية.', en: 'Luxury veined Limestone composite slab, completely waterproofed & bolt anchored.' },
      charcoal_wood_slats: { ar: 'واجهة أعواد خشبية فحمية غائرة متباعدة بشكل رأسي يعطي ديناميكية بصرية للمارة.', en: 'Deep Charcoal vertical timber slats framing a rigid steel grid structure.' },
      pure_translucent_white: { ar: 'أقراص ناصعة البياض تسمح بنفاذية الضوء الكلي المريح دون اصفرار للواجهات.', en: 'Super-white high-diffusion sheet creating zero shadowing behind sign layers.' },
      textured_carbon_acp: { ar: 'كلادينج ألياف كربونية ذي ملمس بارز رياضي لمقاومة الرطوبة المرتفعة والغبار كلياً.', en: 'Sports Carbon composite panels, high-density PVDF scratchproof coated.' },
      ebony_mirror_gloss: { ar: 'زجاج سيكوريت أسود عاكس بلمعان زجاجي ملوكي يبرز بريق حروف التيتانيوم.', en: 'Ebony black glass composite high-glass mirror-wall system.' },
      concrete_raw_look: { ar: 'ألواح إسمنتية مطعمة بأملاح معدنية تفرز طابعاً فنيّاً معاصراً وبارزاً.', en: 'Raw Architectural Concrete composite slab, industrial-chic & high impact resistance.' },
      yellow_industrial_mesh: { ar: 'واجهة فولاذية صفراء مفرغة للمظهر المعاصر تعبر عن السرعة والحركة الصناعية.', en: 'Yellow industrial micro-mesh grid steel panels, highly high-contrast.' },
      rusty_corten_steel: { ar: 'حديد كورتن معالج بالصدأ الأنيق يعكس جودة فنية كلاسيكية معاصرة ومحمية مجاناً.', en: 'Corten Steel weathered decorative rust coat, certified 15-year patina layer.' },
      hygienic_silver_shield: { ar: 'تكسية كلادينج فضي مطهر معزول يعيق التصاق الغبار والأنوية الحرة طبيعياً.', en: 'Hygienic Silver ACP cladding panels, anti-static dust repelling layer.' },
      burnt_cedar_timber: { ar: 'خشب أرز محروق بالطريقة اليابانية يزيد الفخامات العضوية المانعة للاحتراق والماء.', en: 'Shou Sugi Ban burnt cedar cladding panels, organic premium fire protection.' },
      multi_primary_colors: { ar: 'باقات كلادينج مبهجة بألوان الطيف المتوازنة مبهجة ومحببة للأعين الفتية.', en: 'Multi-hued high-contrast primary color composite tiles, friendly texture.' },
      granite_stone_composite: { ar: 'كسوة حجرية بمركبات الجرانيت الصلد ومثبتات الفولاذ المقاوم التام للصدأ.', en: 'Monolithic Heavy Granite composite stone siding, certified wind load safe.' },
      amber_glass_back: { ar: 'خلفية زجاج كهرماني روز عاكس يدمج طيف غروب الشمس ويزيد رقي المكان.', en: 'Cosmic Amber shined glass backing with warm reflective edge-beveling.' },
      walnut_wood_veneer: { ar: 'ألواح قشرة خشب الجوز المعالجة بطبقات اليوريثان المانعة لتسريب المياه.', en: 'Weatherproof Walnut shined wood veneer with dual backing support rails.' },
      pastel_blue_smooth: { ar: 'تكسية بلون أزرق فاتر يعطي راحة بصرية ويبعد وهج أشعة الشمس.', en: 'Cool pastel slate blue backing panel, anti-reflection coated.' },
      ebony_slatted_wood: { ar: 'أعواد خشب الأبنوس الفخم الأسود والداكن تعبر عن الأناقة المطلقة في التصاميم.', en: 'Ebony precious dark timber slatted backing panels.' },
      neon_pink_glossy: { ar: 'لوحات أكريليك زهرية براقة تشع ببريق لافت للجمهور والمارة بمحيط السوق.', en: 'Electric Hot Pink high-gloss acrylic composite backing sheets.' },
      clouds_blue_vinyl: { ar: 'فينيل خارجي عالي الكثافة بألوان السماء يحمل ضمان 5 سنوات ضد التشقق.', en: 'Weather-sealed Cloud Blue custom vinyl stretch membrane composite.' },
      matte_cyberpunk_neon: { ar: 'أجزاء معدنية غير لامعة باللون الفحمي مع حواف إلكترودية مضيئة متغيرة الألوان.', en: 'Futuristic Matte Graphite steel frames with built-in LED trace-lines.' },
      marble_veined_look: { ar: 'تكسية رخامية بمركبات بديل الرخام الإيطالي الفاخر ذي العروق المترابطة بالتمام.', en: 'Italian Statuario Marble alternative slab backing with shined veins.' },
      monochrome_textured_plate: { ar: 'تكسية فولاذية رمادية داكنة من ألواح الألمنيوم منقوشة لمظهر صناعي فخم.', en: 'Monolithic slate dark diamond-plate steel textured backing panels.' },
      vertical_grass_wall: { ar: 'لوحات عشب جداري طبيعي صناعي فاخر عازل للصوت والأتربة مقاوم للشمس.', en: 'Heavy-density artificial grass wall backing with built-in drip mesh.' },
      warm_oak_wooden_slats: { ar: 'أعواد خشب البلوط الدافئة توفر طابعاً دافئاً ومريحاً ومقاوماً للرطوبة تماماً.', en: 'Warm European Oak wood composite slatted backdrop rails.' },
      green_leaf_mesh: { ar: 'لوحة خضراء من ألياف البوليستر واللدائن الصديقة للبيئة والمانعة للغبار.', en: 'Eco-felt Ivy leaf architectural mesh backing with dual sound shielding.' },
      industrial_grey_iron: { ar: 'لوحات حديدية بلون رمادي مسبوكة ومحمية بطبقة مزدوجة مانعة للتآكل بالملح.', en: 'Industrial-grade slate grey steel backing plates with double zinc priming.' }
    };

    const lettersTranslation: Record<string, { ar: string; en: string }> = {
      titanium_gold: { ar: 'حروف معدنية بارزة من عيار استانلس ستيل 304 ذهبي مرآت فاخر (يلحم خفياً بـ 1.2 مم).', en: 'Oversized 1.2mm PVD Titanium Mirror Gold Stainless Steel (304-grade) letters with argon welds.' },
      neon_kufi: { ar: 'أحرف نيون سيليكون مرن فئة ممتازة مشكلة بخط عربي كوفي ملوّن وبارز على شاسيه أكريليك شفاف.', en: 'Fluid neon-flex silicone tubes shaped over laser-cut clear acrylic supporting chassis.' },
      stainless_304: { ar: 'حروف استانلس الفضي اللامع عيار 304 فائق المتانة والمقاوم كلياً لأملاح السواحل وعوامل الطقس.', en: 'Mirror Silver Stainless Steel 304 heavy-gauge deep-profile characters.' },
      glossy_red_acrylic: { ar: 'حروف ليد من الأكريليك الأحمر اللامع المصبوب تايواني 12 مم مع واجهة ناصعة البثق الضوئي.', en: 'Cast Red high-gloss Acrylic 3D letters, thermoformed over solid light guides.' },
      matte_brushed_steel: { ar: 'حروف مسطحة وبارزة من الحديد المطفي المطلي حرارياً بلون رمادي ميتاليك وقص ليزر وبراغي تثبيت مخفية.', en: 'Industrial-gauge Sandblasted Grey Anodized Matte Steel characters with hidden bolts.' },
      backlit_acrylic_blue: { ar: 'حروف أكريليك زرقاء بالهوية الطبية الفاخرة مصبوبة ومحقونة بغلاف مانع للبقع المطرية.', en: 'Injected Blue Translucent Acrylic letters structured for absolute glow uniformity.' },
      edge_lit_acrylic: { ar: 'أحرف أكريليك مضيئة الحواف تفرز بريقاً بلورياً براقاً يزيد رونق التفاصيل الصغيرة والخطوط الرفيعة.', en: 'Crystal Edge-lit frosted 12mm Acrylic letters producing an incredibly premium glow outline.' },
      pvd_brass_shined: { ar: 'حروف بارزة من النحاس المطلي بالذهب اللامع بطبقة PVD المقاومة للأكسدة وتغير الألوان.', en: 'Premium PVD Gilded Polished Brass heavy-cast geometric characters.' },
      rose_gold_titanium: { ar: 'حروف استانلس ستيل بلون روز جولد روزي ساحر يعكس أضواء الشارع برقي لافت.', en: 'Rose-Gold shined Titanium Stainless Steel letter casings, flawlessly bent.' },
      led_embedded_wood: { ar: 'حروف بارزة من كتل الخشب الطبيعي المحفورة بالكمبيوتر مع ليد داخلي مخفي يضيء الأطراف.', en: 'Wood-block embedded warm LED lettering, CNC routed from solid mahogany planks.' },
      extrabold_mirror_gold: { ar: 'حروف استانلس مرآة ذهبية عريضة للغاية فئة استثنائية تعزز حضور العلامات العقارية الكبرى.', en: 'Extrabold Mirror Gold heavy Titanium steel characters with 10cm outer return depth.' },
      monolithic_bronze: { ar: 'حروف برونزية مسبوكة بقطعة واحدة معالجة بالبللورات الحمضية لبريق عتيق متوازن وجذاب.', en: 'Monolithic Heavy Bronze cast characters, acid-etched for oil-rubbed dark finish.' },
      frontlit_channel_green: { ar: 'حروف بارزة مضيئة من الألومنيوم الخفيف بطلاء الكتروستاتيك أخضر وجبهة أكريليك معزولة.', en: 'Electrostatic green coated aluminum channel letters with white acrylic front face.' },
      cast_green_acrylic: { ar: 'حروف خضراء ناصعة مصبوبة من الأكريليك النقي المقاوم لرطوبة مستشفيات القاهرة.', en: 'High-lux Cast Green Acrylic letters, double-sealed with neon backing channels.' },
      oversized_brushed_chrome: { ar: 'حروف ضخمة للغاية بارتفاع 120 سم من معدن الألومنيوم المصقول المقاوم للأملاح.', en: 'Oversized 120cm Brushed Chrome Aluminum letters with extreme steel framework support.' },
      pvd_solid_gold_titanium: { ar: 'حروف صلبة مذهبة بطبقة تيتانيوم ثقيلة من الصنف الأول عيون كريستال مشعة لافتة.', en: 'Solid core shined Titanium Gold characters inlaid with high-index diamond cut facets.' },
      minimalist_black_steel: { ar: 'حروف مسطحة عيار 3 مم من الفولاذ الأسود المطفي قصت بالليزر لتصميم هندسي صارم.', en: 'Laser-cut 3mm Minimalist Black Steel flat characters stood-off 3cm from backing.' },
      laser_cut_acrylic: { ar: 'حروف أكريليك مقطوعة بالكمبيوتر بدقة ميكرومترية وحواف لامعة كأحجار الكريستال.', en: 'Laser-flame polished clear acrylic lettering with internal neon trace fibers.' },
      hollow_backlit_bronze: { ar: 'حروف برونزية مجوفة من الداخل تفرز ضوءاً هادئاً متدفقاً بانتظام على خلفية المبنى.', en: 'Hollow Architectural Bronze shined letters projecting a soft rear halo emission.' },
      embossed_blue_led: { ar: 'شعار وحروف زرقاء بارزة ليد سامسونج عالي السطوع بالهويات الطبية والإنقاذ.', en: 'Embossed medical blue LED characters with high-lux daylight modules.' },
      copper_finish_alloy: { ar: 'حروف معدنية من سبيكة النحاس الأحمر الفاخر ببريق دافئ وتأثيرات الصدأ الرومانية العريقة.', en: 'Warm Copper metal letters finished with hand-brushed antique patina coating.' },
      giant_soft_rounded_acrylic: { ar: 'حروف أكريليك ضخمة وحواف مستديرة آمنة تماماً وخفيفة البثق المبهج.', en: 'Giant thermoformed rounded acrylic characters, soft pastel internally illuminated.' },
      heavy_gilded_gold: { ar: 'حروف مصمتة مطلية بذهب عيار 24 بلمعان ملوكي مبهر للواجهات المصرفية الراقية بمصر.', en: 'Heavy sand-cast metal letters clad in custom 24k gold leaf foil coatings.' },
      gilded_laser_brass: { ar: 'حروف نحاسية ذهبية غائرة تمت معالجتها بالليزر لدرجة دقة مذهلة للأعين الفاحصة.', en: 'Laser-engraved polished brass letters with black lacquer filled returns.' },
      classic_serif_metal: { ar: 'حروف معدنية بخط سيريف الكلاسيكي ذي الحواف الطولية الراقية التي ترمز للتاريخ والتوثيق.', en: 'Elegant Roman Serif metal letters with hand-welded sharp corner spikes.' },
      acrylic_pop_animals: { ar: 'حروف أكريليك ملونة ثلاثية الأبعاد جذابة ومبهجة ومخصصة لبروفايلات هويات الأطفال والحيوانات.', en: 'Thermoformed friendly organic acrylic character shapes with high contrast.' },
      brushed_brass_monolithic: { ar: 'كتلة نحاسية مصقولة مصمتة من قطعة واحدة ثقيلة تعبر عن الأصالة الفائقة والصلابة.', en: 'Monolithic shined Brushed Brass characters standing off from wood backings.' },
      bubble_blown_acrylic: { ar: 'حروف أكريليك منفوخة حرارياً كالبالونات ومحشوة بليد ذكي متدرج الألوان بشكل آسر.', en: 'Bespoke blown dome acrylic letter pods filled with smart RGB LED chips.' },
      glowing_globe_letters: { ar: 'شعار وحروف كروية مضيئة تدور بآليات ميكانيكية مصنعة في كبرى ورش يافطة.', en: 'Motorized rotating spherical illuminated letters with internal heavy armature.' },
      holographic_acrylic: { ar: 'حروف أكريليك هولوجرامية تعكس ألوان الطيف الضوئي والوردي والأزرق بشكل متدفق مع حركة العميل.', en: 'Holographic metallic acrylic letters reflecting variable color shifts on motion.' },
      golden_handwritten_script: { ar: 'تحفة خطية مصنعة يدوياً من سبيكة الاستانلس الذهبي بانحناءات رشيقة تحاكي الكتابة الفنية.', en: 'Custom calligraphic script letters hand-formed from gold stainless tubes.' },
      steel_razor_font: { ar: 'لافتات حروف حادة الزوايا من الفولاذ المقاوم للصدأ ومصقولة بدقة حد السكين لتصميم ذكوري جذاب.', en: 'Laser-slashed razor steel font style characters with high reflection.' },
      backlit_rose_gold: { ar: 'حروف بلون ذهبي وردي ساحر يفرز إضاءة هالة خلفية دافئة مريحة وساحرة بالليل.', en: 'Bespoke shined Rose Gold with 2700K warm-amber halo backlight.' },
      fira_mono_metal: { ar: 'حروف معدنية بخط مونو تكنولوجي متوازن وأبعاد صارمة لإظهار الدقة الهندسية والذكاء.', en: 'CNC-milled tech mono metal letters with visible structural bolts.' },
      sun_glowing_frontlit: { ar: 'حروف أكريليك شمسية براقة ناصعة الانبعاث الضوئي حتى تحت أشعة شمس القاهرة المشرقة.', en: 'Solar High-Lux frontlit characters engineered to cut through desert morning sun haze.' },
      heavy_stencil_acrylic: { ar: 'حروف استنسل عميقة من الأكريليك المقوى ومثبتة بمسامير ميكانيكية ثقيلة مقاومة لعموم الصدمات.', en: 'Deep stencil acrylic characters mounted with safety industrial rivets.' }
    };

    const ledTranslation: Record<string, { ar: string; en: string }> = {
      halo_warm: { ar: 'ليدات سامسونج كورية هالة خلفية دافئة 3000 كلفن IP67، سطوع فخم بمحولات تايوانية معزولة.', en: 'Samsung Korean 3000K warm-white Halo Backlit modules IP67, powered by MeanWell waterproof drivers.' },
      neon_ambient: { ar: 'نيون سيليكون مروّن بألوان عسلية وتدفق مستمر متناسق تماماً مريح للرؤية القريبة.', en: 'Premium constant-voltage flexible neon-flex LEDs with high diffusion layers.' },
      dual_emission: { ar: 'نظام ليد مزدوج الانبعاث (أمامي وخلفي في آن واحد) تفرز 5500 لومين سطوع ناصع يخطف الأبصار.', en: 'Vivid dual-emission LED core (6000K front / 3000K halo) generating maximum visibility.' },
      rgb_pulse: { ar: 'إنارة ليد ذكية RGB تفاعلية ملوّنة مبرمجة لترددات النبضات الرياضية ومتحكم بها بالموبايل.', en: 'Dynamic Bluetooth-controlled pulse RGB LEDs generating high-frequency visual energy.' },
      backlit_white: { ar: 'إضاءة خلفية ناصعة البياض 5000 كلفن رسمية ومريحة للأعين تعبر عن هيبة ومصداقية الكيانات الكبرى.', en: 'Daylight 5000K crisp white backlight, standard-intensity for highly formal buildings.' },
      pure_cool_white: { ar: 'إضاءة بيضاء ثلجية 4000 كلفن معقمة ومريحة للأعين تناسب عيادات تجميل الأسنان.', en: 'Crisp Arctic White 4000K internal LEDs for medical & dental corporate environments.' },
      neon_sapphire: { ar: 'حزم نيون زجاجية كلاسيكية معزولة بلون أزرق زاهي يعطي بعداً سبرانياً للموقع.', en: 'Classic high-voltage Neon glass tube assembly in deep sapphire blue tone.' },
      subtle_backlit: { ar: 'إنارة خلفية هادئة خافتة 2700 كلفن تفرز ضوءاً خفيفاً ملوكياً يوحي بالثقة والهدوء المطلق.', en: 'Subtle warm gold 2700K low-lux backlight, mimicking candlelight confidence.' },
      halo_warm_rose: { ar: 'إضاءة هالة وردية ناعمة ودافئة تنسجم مع بريق الروز جولد وتفرز أجواء تسوق مذهلة.', en: 'Seductive Rose-tinted warm 3000K halo LEDs for premium cosmetics shops.' },
      emerald_warm: { ar: 'موجات ليد باللون الأخضر الزمردي الهادئ تفرز طاقة استرخاء عضوية وراحة بصرية فائقة.', en: 'Emanating organic emerald green sub-surface LEDs coupled with accent spots.' },
      frontlit_halo_dual: { ar: 'إنارة مزدوجة تجمع سطوعاً هائلاً في جبهة الحرف وهالة بياض عسلي رصين من الخلف.', en: 'High-lux dual-zone frontlit and back-halo white LED illumination.' },
      dali_dimmable_gold: { ar: 'نظام ليد فاخر متصل شبكياً بنظام تحكم DALI لخفض السطوع ورفعه طبقاً لمستويات ضوء الشمس بمصر.', en: 'Networked dimmable gold LEDs integrated with smart light meters for self-dimming.' },
      warm_yellow_halo: { ar: 'إضاءة هالة خلفية بلون أصفر نقي عيار 3500 كلفن تفرز طاقة بصرية دافئة وفخمة للعلامات الفندقية.', en: 'Golden warm yellow 3500K halo back LEDs generating premium street aesthetic.' },
      daylight_6000k: { ar: 'إضاءة نهارية ناصعة 6000 كلفن ذات الكفاءة الأعلى لتخترق عصف الضباب والأتربة والوهج الصباحي.', en: 'High-lux 6000K daylight-white internal LEDs maximizing highway distance identification.' },
      intense_pure_neon: { ar: 'أنابيب نيون غازية أرجون حمراء وزرقاء أصلية بقرص جهد عالي وحزمة لمعان جارف تسعى للمنافسة.', en: 'Argon gas hand-blown neon tubings, high-voltage transformer driven for raw power.' },
      ultra_high_cri_sparkle: { ar: 'ديودات فائقة النقاوة اللمسية تماثل نقاوة المجوهرات والألواح والبروفيلات الذهبية لتفرز لمعاناً براقاً.', en: 'Ultra-high CRI (98+) sparkle spot LEDs highlighting physical gold facets with zero glare.' },
      halo_amber_sunset: { ar: 'إضاءة كهرمانية بلون الشفق الدافئ تفرز طيفاً شاعرياً وهادئاً يناسب جدران المعارض الفنية.', en: 'Poetic Amber-Sunset 2200K halo backlit LEDs creating a serene shadow silhouette.' },
      rgb_smart_sync: { ar: 'نظام ليد بكسل ذكي تفاعلي رقمي يتمت برمجته لإبراز تدرجات تموجات في مساحات الهوية التجارية.', en: 'Individually addressable pixel RGB LEDs programmed with custom brand color cycles.' },
      linear_recessed_glow: { ar: 'أقراص ليد طولية مخفية في ثنايا الجدران لإنارة محيطية هندسية هادئة توضح زوايا البروفيل.', en: 'Recessed high-output linear LED tracks casting unified horizontal wash down.' },
      cool_daylight: { ar: 'إضاءة نهارية باردة عالية الكفاءة ومنتظمة الانتشار في لافتات المشروعات الطبية الكبرى.', en: 'Hygienic Cool Daylight LEDs certified against rapid lumen degradation.' },
      halo_roasted_amber: { ar: 'إضاءة باللون البرتقالي الدافئ وبدرجة حرارة 2500 كلفن تفرز رائحة الدفء والقهوة في محيط المقهى.', en: 'Warm roasted amber LED backlight, optimized for coffee house environments.' },
      playful_pulsing_glow: { ar: 'ألوان ليد متغيرة ناعمة تتنفس بانتظام لإسعاد الأطفال ومنع تشتت الأعين بالأكاديمية.', en: 'Low-frequency breath-pulsing smart LEDs with safe internal low-voltage.' },
      emitted_white_halo: { ar: 'هالة بيضاء ناصعة 5000 كلفن من لدات سامسونج كهرومغناطيسية مقاومة لعصف العواصف بمصر.', en: 'Crisp white 5050 heavy-density Samsung LEDs for maximum institutional trust.' },
      warm_golden_halo: { ar: 'إضاءة ذهبية غنية ومترفة تفرز طاقة عطور فواحة ودفء ملوكي يبرز بريق الذهب الزهري.', en: 'Imperial 2400K warm gold halo emitters casting elegant backlight shadows.' },
      warm_incandescent_halo: { ar: 'إضاءة هالة صفراء عتيقة تحاكي المصابيح التنجستن للتأثيرات المعمارية الكلاسيكية المريحة للأعين.', en: 'Retro Edison filament-colored warm halo LEDs for vintage libraries.' },
      soft_ambient_yellow: { ar: 'إضاءة صفراء دافئة وناعمة تبعث الطمأنينة في نفوس الكائنات والأفراد.', en: 'Calming low-lux soft yellow LED backing grid, shadow-reducing.' },
      warm_diffused_ambient: { ar: 'إضاءة عسلية دافئة مدمجة داخل أعواد الخشب تعكس لمعاناً دافئاً وجذاباً للواجهة المعمارية.', en: 'Diffused amber LED strips built inside the timber gaps for cozy warmth.' },
      rainbow_rgb_programmable: { ar: 'ألوان الطيف الكاملة المبرمجة ديناميكياً لتتحرك بسرعة أو تموجات متناسقة تجذب الأطفال.', en: 'Fully programmable pixel RGB chasing loops, with over 160 dynamic animation modes.' },
      pure_sky_white: { ar: 'إضاءة زرقاء سماوية خفيفة ممزوجة بالبياض تعطي شعور التحليق والسفر الممتد.', en: 'Emanating sky-blue sub-surface backlight, optimizing long-range visibility.' },
      neon_cyber_purple: { ar: 'لدات زهرية وبنفسجية صارخة مستوحاة من طابع ألعاب السايبربانك والتكنولوجيا المستقبلية اللامعة.', en: 'Cyberpunk Purple and Cyan fluid neon-flex bars reflecting futuristic layout.' },
      soft_warm_halo: { ar: 'إضاءة هالة لطيفة عسلية تفرز شهية بصرية ومظهراً دافئاً يجذب عشاق المخبوزات الساخنة.', en: 'Warm-peach 2700K backlight halo LEDs, generating cozy bakery vibes.' },
      retro_pure_white_neon: { ar: 'نيون ليد بلون أبيض ناصع بارد وجريء لتصميم صالونات الحلاقة بمظهر النيون الإيطالي الكلاسيكي.', en: 'Razor crisp pure white 6500K flex-neon outlines with high visibility.' },
      soft_warm_incandescent: { ar: 'إضاءة صفراء دافئة هادئة تعزز خضرة عشب جداري طبيعي وجمال الطبيعة الهادئ.', en: 'Incandescent-warm 2400K highlight spots casting beautiful shadow-leaf play.' },
      reading_comfort_led: { ar: 'إضاءة نهارية صفراء عسلي مريحة ومنتظمة لتركيز الطلاب وإراحة الأعين من وهج الشاشات.', en: 'Low-flicker 4000K natural neutral LEDs certified for reading comfort.' },
      eco_pure_daylight: { ar: 'لدات شمسية فائقة التوفير الصديقة للبيئة وتعمل مباشرة بالطاقة البديلة والصمام الموفر للكهرباء.', en: 'Eco-certified green efficiency LEDs, engineered for minimum power draw.' },
      safety_flash_led: { ar: 'إضاءة ليد ناصعة بياض لافتة بأطراف وميض ناعمة تفيد السرعة وضمان دقة مواعيد الشحن السريع.', en: 'High-visibility safety strobe elements coupled with pure orange outline glow.' }
    };

    const backObj = backTranslation[sec.backing] || backTranslation.antique_dark;
    const lettObj = lettersTranslation[sec.letters] || lettersTranslation.titanium_gold;
    const ledObj = ledTranslation[sec.lighting] || ledTranslation.halo_warm;

    const safetyScore = sec.safety === 'std_cairo_heavy' || sec.safety === 'structural_certified' || sec.safety === 'heavy_wind_shield' || sec.safety === 'heavy_hazard_shield' || sec.safety === 'bulletproof_heavy_anchors'
      ? (isAr ? 'عالي القوة والتصفيح الإنشائي، صامد أمام عصف رياح 140 كم/ساعة بمصر وضمان ميكانيكي لعقد كامل.' : 'Heavy industrial grade: braced with back iron studs to resist drag force & typhoons up to 140 km/h.')
      : (isAr ? 'تصنيف ممتاز، صامد أمام رياح سرعة 120 كم/ساعة ومعزول ترانسات مقاوم للرطوبة بعامين ضمان كامل.' : 'Certified safety: fully engineered against Cairo wind shear loads up to 120 km/h with dry-core transformers.');

    return {
      cladding: isAr ? backObj.ar : backObj.en,
      letters: isAr ? lettObj.ar : lettObj.en,
      lighting: isAr ? ledObj.ar : ledObj.en,
      safety: safetyScore,
      estimate: isAr ? `${sec.basePrice.toLocaleString()} - ${sec.maxPrice.toLocaleString()} ج.م` : `${sec.basePrice.toLocaleString()} - ${sec.maxPrice.toLocaleString()} EGP`,
      timeframe: isAr ? 'من 6 إلى 9 أيام عمل للتسليم والتركيب والتشطيب المعزز' : '6 to 9 business days complete custom fabrication',
      visibilityScore: sec.visibility,
      sectorLabel: isAr ? sec.nameAr : sec.nameEn
    };
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Dynamic Floating Particles Effect for Immersive Premium Feeling */}
      <style>{`
        @keyframes drift {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-100px) translateX(25px) rotate(180deg); opacity: 0.6; }
          100% { transform: translateY(-200px) translateX(0px) rotate(360deg); opacity: 0.1; }
        }
        .particle {
          position: absolute;
          background: radial-gradient(circle, rgba(229,192,96,0.15) 0%, transparent 80%);
          border-radius: 50%;
          pointer-events: none;
          animation: drift 15s infinite linear;
        }
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          display: flex;
        }
        .marquee-content {
          display: inline-block;
          animation: marquee 25s infinite linear;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        [dir="rtl"] .marquee-content {
          animation: marquee-rtl 25s infinite linear;
        }
        @keyframes marquee-rtl {
          0% { transform: translateX(0%); }
          100% { transform: translateX(50%); }
        }
        .glass-premium {
          background: rgba(10, 10, 10, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(229, 192, 96, 0.15);
        }
        .gold-glow-hover:hover {
          border-color: rgba(229, 192, 96, 0.45);
          box-shadow: 0 10px 30px -10px rgba(229, 192, 96, 0.15);
        }
      `}</style>

      {/* BACKGROUND FLOATING PARTICLES - Android-First Fluid Canvas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="particle w-24 h-24 top-[15%] left-[5%] animate-[drift_16s_infinite_linear]" style={{ animationDelay: '0s' }}></div>
        <div className="particle w-32 h-32 top-[45%] right-[8%] animate-[drift_20s_infinite_linear]" style={{ animationDelay: '2s' }}></div>
        <div className="particle w-20 h-20 top-[75%] left-[12%] animate-[drift_14s_infinite_linear]" style={{ animationDelay: '4s' }}></div>
        <div className="particle w-40 h-40 top-[85%] right-[15%] animate-[drift_24s_infinite_linear]" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* YAFTA SIGNATURE HEADER LOGO */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-2 flex flex-col items-center justify-center text-center relative z-20 animate-fade-in select-none">
        <div className="p-2.5 bg-neutral-950/50 border border-gold-550/20 rounded-full flex items-center justify-center gap-3 shadow-xl">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neutral-900 to-gold-950 border border-gold-505 flex items-center justify-center shadow-inner">
            <span className="text-sm font-black font-sans text-gold-505">Y</span>
          </div>
          <div className="flex flex-col text-right pr-1">
            <span className="text-lg font-black tracking-widest font-sans uppercase text-gold-505 leading-none">YAFTA</span>
            <span className="text-[7.5px] font-bold uppercase tracking-[0.2em] text-neutral-400 mt-1">
              {isAr ? 'وكالة يافطة للدعاية والإعلان' : 'ADVERTISING AGENCY'}
            </span>
          </div>
        </div>
      </div>

      {/* 1. CINEMATIC LUXURY HERO BANNER - Split Grid Layout */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-black text-white px-4 py-8 border-b border-gold-500/20 z-10">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gold-600/5 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold-950/10 rounded-full blur-[130px] pointer-events-none animate-pulse-slow"></div>

        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-transparent to-black/95 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=1600" 
            alt="YAFTA Storefront LED"
            className="w-full h-full object-cover filter brightness-50 contrast-125"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left/Right Text depending on LTR or RTL */}
            <div className={`lg:col-span-7 space-y-6 flex flex-col justify-center ${isAr ? 'text-right lg:order-2' : 'text-left lg:order-1'}`}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-950/90 border border-gold-505/30 backdrop-blur shadow-lg animate-fade-in font-sans self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-505 animate-ping"></span>
                <span className="text-[9px] md:text-xs font-black tracking-[0.25em] text-gold-300 uppercase">
                  {isAr ? 'يافطة للدعاية والإعلان - هندسة اللافتات الفاخرة' : 'YAFTA ADV - PREMIUM FABRICATORS'}
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white font-sans">
                  {isAr ? (
                    <>
                      أعمالنا تتحدث عن <span className="gold-gradient-text drop-shadow-[0_2px_15px_rgba(229,192,96,0.35)] font-sans">جودة</span> ما نقدمه
                    </>
                  ) : (
                    <>
                      Our Actions Speak for <span className="gold-gradient-text drop-shadow-[0_2px_15px_rgba(229,192,96,0.35)] font-sans">Precision Quality</span>
                    </>
                  )}
                </h1>
                
                <p className="text-xs sm:text-base md:text-lg text-neutral-300 leading-relaxed font-sans">
                  {isAr ? finalHeroDescAr : finalHeroDescEn}
                </p>
              </div>

              <div className={`flex flex-col sm:flex-row items-center gap-4 pt-2 w-full max-w-lg ${isAr ? 'sm:justify-start' : 'sm:justify-end'}`}>
                <button 
                  onClick={() => handleNav('contact')} 
                  className="w-full sm:w-auto px-6 py-3.5 text-xs font-extrabold bg-gradient-to-r from-gold-300 via-gold-550 to-gold-500 hover:from-gold-200 hover:to-gold-300 text-black rounded-xl transition-all duration-300 shadow-xl shadow-gold-500/10 cursor-pointer active:scale-95 text-center tracking-wider uppercase flex items-center justify-center gap-2 font-sans"
                >
                  <Zap className="w-4 h-4 fill-current text-black" />
                  <span>{isAr ? 'اطلب عرض سعر وتقييم مجاني 💰' : 'Get Complimentary Quote 💰'}</span>
                </button>

                <button 
                  onClick={() => handleNav('portfolio')} 
                  className="w-full sm:w-auto px-6 py-3.5 text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-gold-533/20 hover:border-gold-505/60 rounded-xl transition-all duration-300 cursor-pointer active:scale-95 text-center flex items-center justify-center gap-1.5 font-sans"
                >
                  <span>{isAr ? 'استعراض المعرض 🖼️' : 'Check Portfolio 🖼️'}</span>
                </button>
              </div>
            </div>

            {/* Featured Visual Mockup Card */}
            <div className={`lg:col-span-5 relative w-full ${isAr ? 'lg:order-1' : 'lg:order-2'}`}>
              <div className="relative rounded-3xl overflow-hidden border border-gold-505/20 shadow-2xl bg-neutral-900 p-6 flex flex-col justify-between h-96 group hover:border-gold-300/40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-neutral-950/70 to-transparent z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=800" 
                  alt="Featured Facade Mockup" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-50"
                  referrerPolicy="no-referrer"
                />
                
                <div className="relative z-20 flex flex-col justify-between h-full">
                  <div className="self-start">
                    <span className="text-[9px] bg-gold-950/90 text-gold-300 border border-gold-505/30 px-3 py-1 rounded-full font-mono uppercase tracking-wider">
                      {isAr ? 'مجسم ثلاثي الأبعاد مضيء' : '3D LED GLOW MOCKUP'}
                    </span>
                  </div>

                  <div className="space-y-2 text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="text-[9px] text-emerald-400 font-mono">140 KM/H STRUCTURAL SAFE</span>
                    </div>
                    <h4 className="text-xl font-black text-white tracking-wide font-sans">
                      MADO CAIRO <span className="text-gold-505">★</span>
                    </h4>
                    <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                      {isAr 
                        ? 'واجهة كلادينج ألومنيوم معزول مجهز بحروف تيتانيوم مذهبة مخصصة ونظام إنارة ليد سامسونج كوري أصلي كلياً.' 
                        : 'Royal cladding fitted with mirror PVD titanium gold faces over high-lux warm backlight.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS SECTION - Vertical Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="glass-premium rounded-3xl p-6 md:p-8 border border-gold-500/20 relative overflow-hidden bg-neutral-950/70 shadow-2xl">
          <div className="absolute right-0 top-0 w-48 h-48 bg-gold-500/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y-0 divide-x-0 divide-gold-500/10">
            {statisticsCounters.map((stat) => (
              <div 
                key={stat.id} 
                className="flex flex-col justify-center items-center text-center p-3 hover:scale-105 transition-transform duration-300"
              >
                <div className="text-3xl md:text-5xl font-black text-gold-505 mb-1 font-mono flex items-center justify-center gap-0.5 drop-shadow-[0_2px_10px_rgba(229,192,96,0.3)]">
                  <span>{stat.value}</span>
                  <span className="text-gold-200">{stat.suffix}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{isAr ? stat.labelAr : stat.labelEn}</h4>
                <p className="text-[10px] text-neutral-400 leading-normal max-w-[160px] mx-auto">{isAr ? stat.descAr : stat.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED APPS - Horizontal Swipeable Carousel (NEW!) */}
      <section id="featured-apps" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10 scroll-mt-24">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-950/40 border border-gold-550/20 text-gold-300 text-[10px] uppercase font-black tracking-wider">
              <Cpu className="w-3" />
              <span>{isAr ? 'قيمة مضافة رقمية' : 'YAFTA DIGITAL SUITE'}</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              {isAr ? 'تطبيقات وأنظمة يافطة المخصصة' : 'Proprietary Client Web Apps'}
            </h2>
          </div>

          {/* Swipe Buttons - Desktop View */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => handleScroll(appsScrollRef, 'left')}
              className="p-2.5 rounded-full bg-neutral-900 border border-gold-505/20 hover:border-gold-300 transition-all cursor-pointer hover:bg-neutral-800 text-gold-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleScroll(appsScrollRef, 'right')}
              className="p-2.5 rounded-full bg-neutral-900 border border-gold-505/20 hover:border-gold-300 transition-all cursor-pointer hover:bg-neutral-800 text-gold-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal scroll snap container */}
        <div 
          ref={appsScrollRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth scrollbar-none px-1 -mx-4 md:mx-0 pr-4 pl-4 md:px-0"
        >
          {/* App Card 1: Cost Estimator */}
          <div className="snap-center shrink-0 w-[84vw] sm:w-[350px] relative rounded-2xl glass-premium p-5 border border-gold-505/20 flex flex-col justify-between shadow-xl bg-neutral-950/80 hover:border-gold-400 transition-colors duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gold-950/80 border border-gold-505/30 flex items-center justify-center text-gold-300 shadow-md">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-[9px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-black uppercase">
                  {isAr ? 'حاسبة فورية' : 'Live Tool'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {isAr ? 'حاسبة يافطة التقديرية الذكية 📊' : 'Intelligent Quote Estimator App 📊'}
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed min-h-[50px]">
                {isAr 
                  ? 'برنامج داخلي رائد تم برمجته لتقدير تكاليف الحروف المضيئة والكلادينج فورياً بمدخلات مقاسات الحائط والارتفاع بضغطة زر.' 
                  : 'Bespoke web architecture allowing clients to input building dimensions and steel choices to instantly generate price structures.'}
              </p>

              {/* Dynamic Interface Design Wireframe */}
              <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-3 text-right space-y-1.5 font-mono text-[9px] text-neutral-400">
                <div className="flex justify-between border-b border-neutral-800/60 pb-1">
                  <span className="text-gold-300">#E5C060 Gold Mirror</span>
                  <span>{isAr ? 'خامة الاستانلس:' : 'Stainless Alloy:'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">100% Calculated</span>
                  <span>{isAr ? 'مقاومة الرياح:' : 'Wind resistance:'}</span>
                </div>
                <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden mt-2 relative">
                  <div className="absolute top-0 left-0 bg-gold-300 h-full w-[80%]"></div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handleNav('contact')}
              className="mt-4 w-full py-2.5 bg-gold-950/40 hover:bg-gold-505 hover:text-black border border-gold-505/30 text-gold-300 text-xs font-bold rounded-xl transition-all duration-300 text-center flex items-center justify-center gap-1"
            >
              <span>{isAr ? 'جرب حاسبة الأسعار' : 'Try Calculator App'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* App Card 2: Client Portal */}
          <div className="snap-center shrink-0 w-[84vw] sm:w-[350px] relative rounded-2xl glass-premium p-5 border border-gold-505/20 flex flex-col justify-between shadow-xl bg-neutral-950/80 hover:border-gold-400 transition-colors duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gold-950/80 border border-gold-505/30 flex items-center justify-center text-gold-300 shadow-md">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[9px] bg-gold-950/80 text-gold-300 border border-gold-505/20 px-2.5 py-1 rounded-full font-black uppercase">
                  {isAr ? 'نظام إداري' : 'Workflow'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {isAr ? 'بوابة المتابعة الفورية والعملاء 🔐' : 'Secure Client Milestone Portal 🔐'}
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed min-h-[50px]">
                {isAr 
                  ? 'برنامج سحابي يربط عملاء يافطة بورش التصنيع والمخازن لمتابعة عمليات القطع بالليزر وثني الحديد ومواعيد التركيب الحية.' 
                  : 'Real-time database tracking every step of signage cutting, thermo-bending, scaffolding schedules and civil defense papers.'}
              </p>

              {/* Dynamic Interface Design Wireframe */}
              <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-3 text-[9px] font-mono space-y-1.5">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-emerald-400">Completed</span>
                  <span className="flex items-center gap-1">
                    <Check className="w-2.5 text-emerald-400" />
                    {isAr ? 'القطع بليزر الفايبر' : 'Fiber Laser cutting'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-200">
                  <span className="text-gold-300 animate-pulse">{isAr ? 'جاري التنفيذ' : 'Active'}</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-300 animate-pulse"></span>
                    {isAr ? 'لحام الأرجون والتركيب' : 'Argon Micro-Welding'}
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handleNav('portal')}
              className="mt-4 w-full py-2.5 bg-gold-950/40 hover:bg-gold-505 hover:text-black border border-gold-505/30 text-gold-300 text-xs font-bold rounded-xl transition-all duration-300 text-center flex items-center justify-center gap-1"
            >
              <span>{isAr ? 'دخول بوابة العملاء' : 'Login Secure Client Portal'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* App Card 3: Hologram AR Visualizer */}
          <div className="snap-center shrink-0 w-[84vw] sm:w-[350px] relative rounded-2xl glass-premium p-5 border border-gold-505/20 flex flex-col justify-between shadow-xl bg-neutral-950/80 hover:border-gold-400 transition-colors duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gold-950/80 border border-gold-505/30 flex items-center justify-center text-gold-300 shadow-md">
                  <Laptop className="w-5 h-5" />
                </div>
                <span className="text-[9px] bg-gold-950/80 text-gold-300 border border-gold-505/20 px-2.5 py-1 rounded-full font-black uppercase">
                  {isAr ? 'كاميرا ذكية' : 'Spatial'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {isAr ? 'معاينة الواجهة بالواقع المحاكي 📱' : 'AR Facade Spatial Simulator 📱'}
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed min-h-[50px]">
                {isAr 
                  ? 'برنامج تفاعلي يتيح لك رفع صورة لمتجرك ومحاكاة تركيب لافتات الاستانلس الليد ومحاكاة تشتت الضوء في الليل واقعياً.' 
                  : 'Innovative digital service which loads client photos and overlays 3D photorealistic shadow-casting brass letters.'}
              </p>

              {/* Dynamic Interface Design Wireframe */}
              <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-3 flex justify-between items-center text-[9px] font-mono">
                <div className="flex flex-col gap-0.5">
                  <span className="text-neutral-500">{isAr ? 'الزاوية البصرية:' : 'Visual Arc:'}</span>
                  <span className="text-neutral-200">120° Angle Logged</span>
                </div>
                <div className="border border-gold-505/30 text-gold-300 rounded px-1.5 py-0.5 text-[8px] animate-pulse">
                  {isAr ? 'محاكاة ليلية' : 'NOCTURNAL ACTIVE'}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handleNav('contact')}
              className="mt-4 w-full py-2.5 bg-gold-950/40 hover:bg-gold-505 hover:text-black border border-gold-505/30 text-gold-300 text-xs font-bold rounded-xl transition-all duration-300 text-center flex items-center justify-center gap-1"
            >
              <span>{isAr ? 'طلب معاينة معمارية ثلاثية الأبعاد' : 'Request 3D Rendering mockup'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Swipe Indicators */}
        <div className="flex md:hidden items-center justify-center gap-1.5 pt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-505"></span>
          <span className="w-1 h-1 rounded-full bg-neutral-800"></span>
          <span className="w-1 h-1 rounded-full bg-neutral-800"></span>
        </div>
      </section>

      {/* 4. SERVICES - Horizontal Swipeable Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-[0.3em] text-gold-505 uppercase">
              {isAr ? 'منظومة خدمات الإنتاج الإعلاني لدى يافطة' : 'MANUFACTURING SERVICES'}
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              {isAr ? 'مجالات التميز الهندسي والدعائي لدينا' : 'Unifying Steel, Technology & Art'}
            </h2>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => handleScroll(servicesScrollRef, 'left')}
              className="p-2.5 rounded-full bg-neutral-900 border border-gold-505/20 hover:border-gold-300 transition-all cursor-pointer hover:bg-neutral-800 text-gold-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleScroll(servicesScrollRef, 'right')}
              className="p-2.5 rounded-full bg-neutral-900 border border-gold-505/20 hover:border-gold-300 transition-all cursor-pointer hover:bg-neutral-800 text-gold-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal scroll container with scroll snap */}
        <div 
          ref={servicesScrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth scrollbar-none pr-4 pl-4 md:px-0 -mx-4 md:mx-0"
        >
          {[
            {
              id: 'signage',
              titleAr: 'اللافتات والحروف ثلاثية الأبعاد 💡',
              titleEn: '3D Letters & Ambient Signage 💡',
              descAr: 'تصميم لافتات LED الفاخرة، تشكيل الاستانلس ستيل روز جولد والذهبي، وحروف الأكريليك المفرغ.',
              descEn: 'PVD plated stainless steel letters, Cast Acrylic, and heavy-duty Samsung LED components.',
              bg: 'https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=800',
              tagAr: 'استانلس + أكريليك', tagEn: 'Stainless + Acrylic'
            },
            {
              id: 'cladding',
              titleAr: 'الكلادينج والواجهات التجارية 🏢',
              titleEn: 'ACP Architectural Facades 🏢',
              descAr: 'تغطية متكاملة لبروفايل المباني بألواح ألومنيوم معزولة مقاومة للحريق تماماً والرياح الصيفية.',
              descEn: 'Certified fireproof ACP cladding calculated precisely for harsh wind loads and safety factors.',
              bg: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800',
              tagAr: 'مقاوم للحريق B1', tagEn: 'Fire-Resistant B1'
            },
            {
              id: 'printing',
              titleAr: 'العلب المبتكرة والطباعة الفاخرة 📦',
              titleEn: 'Bespoke Packaging & Printing 📦',
              descAr: 'طباعة الكتالوجات والعلب الكرتونية بلمسة البصمة الذهبية البارزة Spot UV واللحام الآلي.',
              descEn: 'Bespoke product packaging, rigid boxes, foil embossing, and gold stamping of corporate catalogs.',
              bg: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800',
              tagAr: 'بصمة ذهبية بارزة', tagEn: 'Embossing & Foil'
            },
            {
              id: 'digital',
              titleAr: 'المواقع والحلول الرقمية الذكية 💻',
              titleEn: 'Web & Digital Platforms 💻',
              descAr: 'برمجة المتاجر الإلكترونية، بوابات الدفع الوطنية، وتطبيقات الموبايل بأعلى سرعة وتحسين محركات السيو.',
              descEn: 'Stellar fast corporate web solutions, 국내/해외 credit processors, and Native-feel iOS/Android tools.',
              bg: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800',
              tagAr: 'تطوير برمجيات ومتاجر', tagEn: 'Websites & Apps'
            },
            {
              id: 'media',
              titleAr: 'الإنتاج الفني وصناعة المحتوى 🎥',
              titleEn: 'Corporate Media Production 🎥',
              descAr: 'جلسات تصوير المنتجات، إنتاج الفيديوهات بروفايل الشركات والمصانع ومقاطع الريلز والميديا المبتكرة.',
              descEn: 'High-end studio gastronomy/lifestyle styling, licensed drone aerial recording, and viral social media visual assets.',
              bg: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800',
              tagAr: 'تصوير احترافي ودرون', tagEn: 'Studio & Drone'
            }
          ].map((div) => (
            <div 
              key={div.id}
              onClick={() => handleNav(div.id as PageId)}
              className="group snap-center shrink-0 w-[84vw] sm:w-[360px] relative h-96 rounded-2xl overflow-hidden border border-gold-500/10 hover:border-gold-505/45 hover:shadow-2xl hover:shadow-gold-505/5 transition-all duration-300 cursor-pointer shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent z-10 transition-opacity group-hover:opacity-90"></div>
              <img 
                src={div.bg} 
                alt={div.titleEn}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-50"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-5 bottom-6 z-20 space-y-2 text-right">
                <span className="text-[9px] font-bold text-gold-300 bg-gold-950/80 px-2.5 py-1 rounded border border-gold-500/30 uppercase tracking-widest inline-block">
                  {isAr ? div.tagAr : div.tagEn}
                </span>
                <h3 className="text-lg md:text-xl font-black text-white group-hover:text-gold-305 transition-colors">
                  {isAr ? div.titleAr : div.titleEn}
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans line-clamp-3">
                  {isAr ? div.descAr : div.descEn}
                </p>
                <div className="pt-2 flex items-center justify-end gap-1.5 text-xs text-gold-505 font-bold group-hover:underline">
                  <span>{isAr ? 'استعرض تفاصيل القطاع' : 'Explore Capabilities'}</span>
                  {isAr ? <ArrowLeft className="w-4 h-4 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PORTFOLIO / PROJECTS - Horizontal Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-[0.3em] text-gold-505 uppercase">
              {isAr ? 'سابقة أعمال يافطة الذهبية' : 'YAFTA COMPLETED PORTFOLIO'}
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              {isAr ? 'مستويات الدقة والجمال تتكلم في الشارع' : 'Transforming Facades Across Egypt'}
            </h2>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            <button 
              onClick={() => handleNav('portfolio')}
              className="flex items-center gap-1 text-xs font-bold text-gold-505 hover:underline bg-gold-950/40 px-4 py-2 rounded-xl border border-gold-505/15 hover:border-gold-505/40 transition-all"
            >
              <span>{isAr ? 'عرض كافة المشاريع 🖼️' : 'View All Projects'}</span>
            </button>

            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => handleScroll(portfolioScrollRef, 'left')}
                className="p-2.5 rounded-full bg-neutral-900 border border-gold-505/20 hover:border-gold-300 transition-all cursor-pointer hover:bg-neutral-800 text-gold-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleScroll(portfolioScrollRef, 'right')}
                className="p-2.5 rounded-full bg-neutral-900 border border-gold-505/20 hover:border-gold-300 transition-all cursor-pointer hover:bg-neutral-800 text-gold-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal snapping portfolio carousel */}
        <div 
          ref={portfolioScrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth scrollbar-none pr-4 pl-4 md:px-0 -mx-4 md:mx-0"
        >
          {projectsList.map((item) => (
            <motion.div 
              key={item.id}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.4}
              dragTransition={{ bounceStiffness: 500, bounceDamping: 18 }}
              whileDrag={{ scale: 1.03, zIndex: 10, cursor: "grabbing" }}
              whileHover={{ 
                y: -8,
                scale: 1.015,
                borderColor: "rgba(229, 192, 96, 0.45)",
                boxShadow: "0 22px 35px -10px rgba(0, 0, 0, 0.8), 0 0 20px 2px rgba(229, 192, 96, 0.08)",
                transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] }
              }}
              className="snap-center shrink-0 w-[84vw] sm:w-[350px] bg-neutral-950/90 rounded-2xl overflow-hidden border border-gold-500/10 flex flex-col shadow-lg cursor-grab active:cursor-grabbing"
            >
              <div 
                className="relative h-48 cursor-pointer overflow-hidden group"
                onClick={() => onSelectProject(item)}
              >
                <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-neutral-950/10 transition-colors z-10"></div>
                <img 
                  src={item.coverImage} 
                  alt={item.titleEn}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute left-3 top-3 z-20 bg-neutral-950/90 hover:bg-black text-[9px] text-gold-300 px-2.5 py-1.5 rounded font-extrabold uppercase tracking-wider border border-gold-505/20">
                  {isAr ? item.category : item.category.toUpperCase()}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between text-right space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold">
                    <span>{isAr ? item.clientAr : item.clientEn}</span>
                    <span className="font-mono">{item.completionDate}</span>
                  </div>
                  
                  <h3 
                    onClick={() => onSelectProject(item)}
                    className="text-base font-bold text-white hover:text-gold-550 transition-colors cursor-pointer line-clamp-1"
                  >
                    {isAr ? item.titleAr : item.titleEn}
                  </h3>

                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {isAr ? item.overviewAr : item.overviewEn}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-gold-500/10 flex items-center justify-between gap-1">
                  <div className="text-[10px] text-gold-300">
                    <span className="font-bold">{isAr ? 'النوع: ' : 'Type: '}</span>
                    <span>{isAr ? item.serviceTypeAr : item.serviceTypeEn}</span>
                  </div>

                  <button 
                    onClick={() => onSelectProject(item)}
                    className="text-xs font-bold text-gold-505 hover:underline flex items-center gap-1"
                  >
                    <span>{isAr ? 'دراسة حالة' : 'Case Case'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. AI WORKSPACE & TOOLS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-950/40 border border-gold-505/30 text-gold-300 text-[10px] uppercase font-mono tracking-widest leading-none">
            <Cpu className="w-3.5 animate-spin-slow" />
            <span>{isAr ? 'يافطة الذكية للألواح والبروفايلات' : 'YAFTA ARTIFICIAL ESTIMATION ENGINE'}</span>
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-white tracking-tight">
            {isAr ? 'منظومة الذكاء الاصطناعي لتقدير وتصميم الواجهات' : 'YAFTA Intelligent AI Tools Workspace'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
            {isAr 
              ? 'أدوات رقمية مبتكرة وتفاعلية تم تطويرها من قبل مهندسي يافطة لمساعدتكم على اختيار الألوان واحتساب اللدات الكورية وتقدير الأسعار قبل التنفيذ.' 
              : 'Interactive micro-tools developed by YAFTA to validate wind load ratings, estimate LED counts & preview neon layouts.'}
          </p>
        </div>

        {/* Bento Workspace grid with modular components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AISpecGenerator isAr={isAr} brandName={brandName} setBrandName={setBrandName} />
          <ContrastSimulator isAr={isAr} brandName={brandName} />
          <LoadCalculator isAr={isAr} />
        </div>
      </section>

      {/* 7. NEWS & ARTICLES - Horizontal Swipeable Carousel */}
      <section id="news-and-articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10 scroll-mt-24">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-[0.3em] text-gold-505 uppercase">
              {isAr ? 'دراسات هندسية ومدونات يافطة' : 'YAFTA TECHNICAL INSIGHTS'}
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              {isAr ? 'أحدث المقالات لمساعدتكم في اختيار لافتتكم' : 'Articles & Safety Research reports'}
            </h2>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => handleScroll(newsScrollRef, 'left')}
              className="p-2.5 rounded-full bg-neutral-900 border border-gold-505/20 hover:border-gold-300 transition-all cursor-pointer hover:bg-neutral-800 text-gold-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleScroll(newsScrollRef, 'right')}
              className="p-2.5 rounded-full bg-neutral-900 border border-gold-505/20 hover:border-gold-300 transition-all cursor-pointer hover:bg-neutral-800 text-gold-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal scroll articles bar */}
        <div 
          ref={newsScrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth scrollbar-none pr-4 pl-4 md:px-0 -mx-4 md:mx-0"
        >
          {blogArticles.map((article) => (
            <div 
              key={article.id}
              className="snap-center shrink-0 w-[84vw] sm:w-[340px] bg-neutral-950/90 rounded-2xl p-5 border border-gold-500/10 hover:border-gold-505/40 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 shadow-lg text-right"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold border-b border-gold-500/10 pb-2">
                  <span className="font-mono bg-gold-950 text-gold-300 border border-gold-505/20 px-2 py-0.5 rounded">
                    {isAr ? article.category : article.categoryEn}
                  </span>
                  <span>📅 {article.date}</span>
                </div>

                <h3 className="text-sm md:text-base font-bold text-white line-clamp-2 leading-relaxed hover:text-gold-305 transition-colors">
                  {isAr ? article.titleAr : article.titleEn}
                </h3>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {((isAr ? (article.tagsAr || article.tags) : (article.tagsEn || article.tags)) || []).map((tag: string, i: number) => (
                    <span key={i} className="text-[8px] bg-neutral-900 text-neutral-400 px-2 py-0.5 rounded border border-neutral-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-900 mt-4 flex items-center justify-between text-xs font-bold text-gold-505 shrink-0">
                <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
                  <User className="w-3.5 h-3.5 text-gold-505" />
                  <span>{isAr ? 'مستشار يافطة الفني' : 'YAFTA Technical Board'}</span>
                </div>
                <button 
                  onClick={() => handleNav('contact')} 
                  className="hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{isAr ? 'قراءة الكتيب 📖' : 'Read Article 📖'}</span>
                  <ArrowUpRight className="w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. TESTIMONIALS - Horizontal Swipeable Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-[0.3em] text-gold-505 uppercase">
              {isAr ? 'شركاء النجاح الأوفياء' : 'VERIFIED CLIENT REVIEWS'}
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              {isAr ? 'أصداء رضا وسعادة عملائنا بمصر' : 'Delivering Real Visual Triumphs'}
            </h2>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => handleScroll(testimonialsScrollRef, 'left')}
              className="p-2.5 rounded-full bg-neutral-900 border border-gold-505/20 hover:border-gold-300 transition-all cursor-pointer hover:bg-neutral-800 text-gold-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleScroll(testimonialsScrollRef, 'right')}
              className="p-2.5 rounded-full bg-neutral-900 border border-gold-505/20 hover:border-gold-300 transition-all cursor-pointer hover:bg-neutral-800 text-gold-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal scrolling snap testimonials bar */}
        <div 
          ref={testimonialsScrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth scrollbar-none pr-4 pl-4 md:px-0 -mx-4 md:mx-0"
        >
          {testimonialsList.map((test) => (
            <div 
              key={test.id}
              className="snap-center shrink-0 w-[84vw] sm:w-[350px] bg-neutral-950/90 rounded-2xl p-5 border border-gold-505/15 flex flex-col justify-between shadow-xl text-right relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-full blur-xl pointer-events-none"></div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-gold-505">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[9px] bg-gold-950/80 text-gold-300 border border-gold-505/30 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                    {isAr ? 'عميل معتمد' : 'Verified'}
                  </span>
                </div>

                <blockquote className="text-xs text-neutral-300 italic leading-relaxed font-sans block">
                  "{isAr ? test.reviewAr : test.reviewEn}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-gold-500/10 mt-4 flex items-center justify-end gap-3 shrink-0">
                <div className="text-right">
                  <cite className="not-italic text-xs font-black text-white block">
                    {isAr ? test.clientNameAr : test.clientNameEn}
                  </cite>
                  <span className="text-[10px] text-gold-300 font-bold block mt-0.5">
                    {isAr ? test.companyAr : test.companyEn}
                  </span>
                  <span className="text-[9px] text-neutral-400 block font-semibold">
                    {isAr ? test.projectTypeAr : test.projectTypeEn}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-full border border-gold-505 p-0.5 relative shrink-0">
                  <img 
                    src={test.avatar} 
                    alt={test.clientNameEn}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. PARTNERS / TRUST AUTO-SLIDING MARQUEE BAND (NEW!) */}
      <section className="bg-neutral-950/60 border-y border-gold-505/15 py-6 overflow-hidden z-10 relative">
        <div className="marquee-container w-full">
          <div className="marquee-content inline-flex items-center gap-12 font-mono font-black text-sm text-[#e5c060]/30 tracking-[0.25em] uppercase select-none">
            {/* Set 1 */}
            <span>⭐ MADO CAIRO</span>
            <span>⭐ ELITE FITNESS HQ</span>
            <span>⭐ NATURA ORGANICS</span>
            <span>⭐ SIGNATURE LOUNGE</span>
            <span>⭐ BUILDPRO EAGLE</span>
            <span>⭐ TECHSTORE SMART</span>
            <span>⭐ SAMSUNG SUPPLIER</span>
            <span>⭐ AL AHLY SPORT CLUB</span>
            <span>⭐ HYATT FACADE</span>
            {/* Set 2 - duplicate for infinite loop */}
            <span>⭐ MADO CAIRO</span>
            <span>⭐ ELITE FITNESS HQ</span>
            <span>⭐ NATURA ORGANICS</span>
            <span>⭐ SIGNATURE LOUNGE</span>
            <span>⭐ BUILDPRO EAGLE</span>
            <span>⭐ TECHSTORE SMART</span>
            <span>⭐ SAMSUNG SUPPLIER</span>
            <span>⭐ AL AHLY SPORT CLUB</span>
            <span>⭐ HYATT FACADE</span>
          </div>
        </div>
      </section>

      {/* 10. PREMIUM IMMERSIVE CALL TO ACTION (Vertical) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="absolute left-1/2 -translate-x-1/2 -top-1/4 w-3/4 h-64 bg-gold-505/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="bg-neutral-950 border-2 border-gold-505/30 py-12 px-6 sm:px-12 rounded-3xl text-center space-y-8 shadow-2xl relative overflow-hidden">
          {/* Subtle soft gold corner glows */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-400/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold-400/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-950/50 border border-gold-505/30 text-gold-300 text-[10px] uppercase font-mono tracking-widest leading-none z-10 relative">
            <Zap className="w-3 h-3 text-gold-400 animate-pulse" />
            <span>{isAr ? 'عقد كامل من الضمان الهندسي والإنشائي' : '10-YEAR GUARANTEE STRUCTURAL SIGNS'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight relative z-10 max-w-4xl mx-auto leading-tight">
            {isAr ? 'هل ترغب في تحويل هوية منشأتك إلى تحفة إعلانية ملوكية؟' : 'Ready to Elevate Your Brand to Absolute Street Royalty?'}
          </h2>
          
          <p className="text-xs sm:text-base text-neutral-300 max-w-2xl mx-auto font-sans relative z-10 leading-relaxed">
            {isAr 
              ? 'تلتزم يافطة بتسليم الخامات الأصلية المعزولة تماماً والمقاومة لعواصف القاهرة الصيفية والحرارة العالية مع تصميم ميكانيكي وحسابات هندسية دقيقة للأحمال.' 
              : 'Partner with Egypt’s premium sign crafter. We deliver high-lux, wind-calculated architectural facades & pristine 3D led storefronts.'}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 relative z-10 max-w-2xl mx-auto">
            <button 
              onClick={() => handleNav('contact')} 
              className="w-full sm:w-auto px-8 py-4 text-xs font-bold text-black bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 hover:from-gold-200 hover:to-gold-300 rounded-xl transition-all shadow-xl shadow-gold-500/10 text-center cursor-pointer flex items-center justify-center gap-2 transform active:scale-95 duration-150"
            >
              <Calculator className="w-4 h-4 text-black" />
              <span>{isAr ? 'احسب تكلفة مشروعك الآن 💰' : 'Calculate Your Project Cost 💰'}</span>
            </button>
            
            <a 
              href="https://wa.me/201116210464" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 text-xs font-bold bg-neutral-900/90 border border-gold-505/30 hover:border-gold-300 hover:bg-neutral-800 text-white rounded-xl transition-all flex items-center justify-center gap-2.5 transform active:scale-95 duration-150"
            >
              <MessageSquare className="w-4 h-4 text-emerald-500 fill-current" />
              <span>{isAr ? 'محادثة هندسية سريعة (واتساب) 💬' : 'Consult our Design chief on WhatsApp 💬'}</span>
            </a>
          </div>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[10px] text-neutral-400 font-mono border-t border-gold-500/5 max-w-lg mx-auto">
            <span>🛡️ {isAr ? 'خامات PVDF فئة أولى B1' : 'Grade B1 Fire-Safe Cores'}</span>
            <span className="hidden sm:inline-block text-neutral-800">•</span>
            <span>💨 {isAr ? 'مقاومة عصف الرياح 140 كم/س' : '140 km/h Wind Safety'}</span>
            <span className="hidden sm:inline-block text-neutral-800">•</span>
            <span>✨ {isAr ? 'صدأ الصفر وضمان 120 شهراً' : '10-Year Anti-Corrosion'}</span>
          </div>
        </div>
      </section>

    </div>
  );
}
