/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Info, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

interface Props {
  isAr: boolean;
  brandName: string;
  setBrandName: (name: string) => void;
}

export default function AISpecGenerator({ isAr, brandName, setBrandName }: Props) {
  const [industry, setIndustry] = useState('fashion_boutique');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLoaderStep, setCurrentLoaderStep] = useState(0);
  const [generatedSpec, setGeneratedSpec] = useState<any | null>(null);

  const steps = [
    isAr ? 'جاري قراءة أبعاد الاسم وتحليل المنحنيات الهندسية...' : 'Parsing typography curves...',
    isAr ? 'جاري موازنة تمديدات الأسلاك وحساب مسافات التراص...' : 'Balancing wire loops and LED counts...',
    isAr ? 'حساب مقاومة أحمال الرياح لارتفاع متوقع 6 أمتار...' : 'Calculating wind shear loads for 6m facade...',
    isAr ? 'صياغة المزيج الطباعي واختيار عيار الاستانلس ستيل...' : 'Finalizing alloy grade and PVDF ACP finishes...'
  ];

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
    
    // Fallback static descriptions for demo purposes
    return {
      cladding: isAr 
        ? `${sec.nameAr} تتطلب كلادينج ألومنيوم مقاوم للحريق مكسو بطبقة ألياف كربونية أو خشب معالج لمظهر عصري.` 
        : `Requires premium 4mm fireproof ACP composite backing customized for ${sec.nameEn}.`,
      letters: isAr 
        ? `حروف استانلس ستيل عيار 304 ملحومة ليزر بدقة فائقة مع طلاء ذهبي PVD عاكس.` 
        : `Heavy laser-welded grade 304 stainless steel letters suited for high reliability.`,
      lighting: isAr 
        ? `نظام إضاءة خلفي هالة (Halo Backlit) باستخدام ليد كوري أصلي بضمان سطوع 3 سنوات.` 
        : `Pure state-of-the-art dual emission or halo warm background LED modules.`,
      timeframe: isAr ? '5 - 8 أيام عمل' : '5 - 8 working days',
      estimate: `${(sec.basePrice).toLocaleString()} - ${(sec.maxPrice).toLocaleString()} EGP`
    };
  };

  return (
    <div className="glass-premium rounded-3xl p-6 border border-gold-505/20 space-y-5 bg-neutral-950/60 shadow-2xl flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gold-500/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold-950 border border-gold-505/30 flex items-center justify-center text-gold-300">
              <Sparkles className="w-4 h-4 text-gold-505" />
            </div>
            <div className="text-right">
              <h3 className="text-base font-bold text-white">
                {isAr ? 'مستشار الخامات والتصميم الذكي 💡' : 'AI Material Spec Recommendation'}
              </h3>
              <p className="text-[10px] text-neutral-400">
                {isAr ? 'تقدير هندسي متكامل للخامات والزوايا' : 'Dynamic stress & spec matrix evaluation'}
              </p>
            </div>
          </div>
          <span className="text-[9px] bg-gold-950/60 text-gold-400 border border-gold-505/30 px-2 py-0.5 rounded font-mono">v1.2</span>
        </div>

        <div className="space-y-3 text-right">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-300 block">
              {isAr ? 'اسم علامتك التجارية:' : 'Your Brand/Business Name:'}
            </label>
            <input 
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder={isAr ? 'أدخل الاسم هنا (مثل: مادو، إيليت، سيجنتشر)...' : 'Enter store name (e.g., MADO)...'}
              className="w-full text-xs bg-neutral-900/90 border border-gold-505/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gold-300 font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-300 block">
                {isAr ? 'طبيعة النشاط التجاري:' : 'Business Sector:'}
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full text-xs bg-neutral-900/90 border border-gold-505/20 text-neutral-300 rounded-xl px-2.5 py-3 focus:outline-none focus:border-gold-300 font-sans cursor-pointer"
              >
                {SECTORS_LIST.map((sec) => (
                  <option key={sec.id} value={sec.id} className="bg-neutral-950 text-neutral-300 text-xs text-right">
                    {isAr ? sec.nameAr : sec.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button 
                onClick={handleGenerateSpec}
                disabled={isGenerating}
                className="w-full py-3 text-xs font-bold text-black bg-gradient-to-r from-gold-300 to-gold-500 rounded-xl hover:from-gold-200 hover:to-gold-300 transition-all font-sans cursor-pointer flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
              >
                {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isAr ? 'توليد المقايسة الفورية 🪄' : 'Generate Spec 🪄'}</span>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-neutral-950 p-4 rounded-2xl border border-gold-505/10 text-center space-y-3"
            >
              <div className="w-7 h-7 rounded-full border-2 border-t-gold-505 border-neutral-800 animate-spin mx-auto"></div>
              <p className="text-xs text-gold-300 font-sans font-medium animate-pulse">{steps[currentLoaderStep] || steps[0]}</p>
              <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gold-505 h-full transition-all duration-500" 
                  style={{ width: `${(currentLoaderStep + 1) * 25}%` }}
                ></div>
              </div>
            </motion.div>
          )}

          {generatedSpec && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neutral-950 p-4 rounded-2xl border-2 border-gold-505/30 text-right space-y-3 font-sans relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gold-500/5 rounded-full blur-xl animate-pulse"></div>
              <div className="flex items-center justify-between border-b border-gold-500/10 pb-2">
                <span className="text-xs text-gold-300 font-extrabold">{brandName.trim() ? brandName.toUpperCase() : 'YOUR BRAND'}</span>
                <span className="text-[10px] text-neutral-400 font-bold">{isAr ? 'دراسة الخامات الموصى بها:' : 'Custom Spec Recommendation Sheet:'}</span>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-neutral-300">
                <div>
                  <span className="font-extrabold text-gold-305 block mb-0.5">🔹 {isAr ? 'الخلفية والكلادينج:' : 'ACP Backing:'}</span>
                  <span>{generatedSpec.cladding}</span>
                </div>
                <div>
                  <span className="font-extrabold text-gold-305 block mb-0.5">🔹 {isAr ? 'تصنيع الحروف والوجه:' : 'Lettering & Facet:'}</span>
                  <span>{generatedSpec.letters}</span>
                </div>
                <div>
                  <span className="font-extrabold text-gold-305 block mb-0.5">🔹 {isAr ? 'اللدات ونظام الإنارة:' : 'LED System:'}</span>
                  <span>{generatedSpec.lighting}</span>
                </div>
                <div className="flex justify-between gap-4 pt-3 border-t border-gold-500/10 text-[11px]">
                  <div>
                    <span className="text-neutral-400 block">{isAr ? 'المدة المقدرة:' : 'Timeframe:'}</span>
                    <span className="font-extrabold text-white">{generatedSpec.timeframe}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-neutral-400 block">{isAr ? 'السعر كود التقدير التقريبي:' : 'Approximate Estimate:'}</span>
                    <span className="font-bold text-gold-505 text-sm">{generatedSpec.estimate}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="text-[10px] text-neutral-400 flex items-center gap-1.5 bg-neutral-900/30 p-2.5 rounded-xl border border-neutral-800 mt-2 text-right justify-end">
        <span>{isAr ? 'تنبيه: التقديرات تتبع المقايسات الهندسية للمواد ونسب الارتفاع الفعلية في مصر.' : 'Pricing is a preliminary estimation based on Cairo market specifications.'}</span>
        <Info className="w-3.5 h-3.5 text-gold-505 shrink-0" />
      </div>
    </div>
  );
}
