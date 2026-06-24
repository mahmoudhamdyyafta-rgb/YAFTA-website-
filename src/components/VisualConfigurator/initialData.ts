import { Material, PricingRule, DimensionRule, ProductTemplate, ConfigSettings } from '../../types/configurator';

export const INITIAL_MATERIALS: Material[] = [
  {
    id: 'acrylic',
    nameAr: 'أكريليك مضيء (LED Samsung)',
    nameEn: 'Acrylic Illuminated Letters',
    descriptionAr: 'حروف أكريليك فاخرة مضاءة داخلياً بليدات سامسونج كورية، مناسبة للواجهات الخارجية والداخلية الراقية.',
    descriptionEn: 'Premium acrylic letterheads internally illuminated with authentic Korean Samsung LEDs. Ideal for exterior/interior storefronts.',
    image: 'https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=300',
    thicknessOptions: [3, 5, 10],
    thicknessPrices: { 3: 0, 5: 350, 10: 900 },
    durabilityAr: 'عالية جداً (بضمان 5 سنوات ضد تلاشي الألوان)',
    durabilityEn: 'Highly Durable (5-Year Anti-Fading Warranty)',
    indicator: 'both',
    pricePerSqm: 4800,
    badge: 'popular',
    advantagesAr: ['إضاءة متجانسة وخالية من البقع المظلمة', 'مقاوم للأشعة فوق البنفسجية والحرارة الرطبة', 'سهل الصيانة والتنظيف'],
    advantagesEn: ['Perfect homogenous illumination without hotspots', 'Highly UV & weathering resistant', 'Extremely easy to clean & maintain'],
    disadvantagesAr: ['أكثر عرضة للخدوش البسيطة في حال التركيب المنخفض', 'يتطلب مصدر طاقة مستمر محمي ضد المطر'],
    disadvantagesEn: ['Prone to fine scratches if mounted at eye-level', 'Requires weather-shielded power supply converter'],
    textureUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=400',
    colorOptions: ['#FFFFFF', '#FF0000', '#0000FF', '#FFCC00', '#00CC44']
  },
  {
    id: 'stainless',
    nameAr: 'ستانلس ستيل تيتانيوم فاخر',
    nameEn: 'Titanium Stainless Steel',
    descriptionAr: 'حروف ستانلس ستيل عيار 304 معالجة بالتيتانيوم PVD لإعطاء لون ذهبي ميرور أو روز جولد ببريق دائم.',
    descriptionEn: 'Grade 304 stainless steel coated with PVD Titanium for mirror gold, bronze or rose gold finish with long-lasting luster.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=300',
    thicknessOptions: [1.2, 1.5, 2],
    thicknessPrices: { 1.2: 0, 1.5: 500, 2: 1200 },
    durabilityAr: 'فائقة (مقاومة تامة للملوحة والصدأ والرطوبة الشديدة)',
    durabilityEn: 'Ultimate (Completely rustproof, salt-resistant for coastal zones)',
    indicator: 'both',
    pricePerSqm: 6200,
    badge: 'premium',
    advantagesAr: ['مظهر فاخر يعكس الفخامة المطلقة للعلامة التجارية', 'مقاومة تامة للتآكل والصدأ وعوامل الجو القاسية', 'قوة هيكلية ممتازة مع لحام أرجون ناعم'],
    advantagesEn: ['Prestige mirror layout highlighting luxury brand index', 'Absolute corrosion & rust immunity under acid rain', 'Strong structural framework with clean argon joints'],
    disadvantagesAr: ['إضاءة خلفية فقط (هالة) وليست أمامية مباشرة', 'الوزن ثقيل نسبياً ويتطلب شاسيه حديدي قوي'],
    disadvantagesEn: ['Supports halo backlit illumination only (no front-lit)', 'Heavy setup requiring secure anchor steel sub-frame'],
    textureUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400',
    colorOptions: ['#FFD700', '#C0C0C0', '#B76E79', '#1A1A1A']
  },
  {
    id: 'pvc',
    nameAr: 'ألواح رغوية عازلة بي في سي',
    nameEn: 'Rigid PVC Foam Sheets',
    descriptionAr: 'ألواح خفيفة الوزن وسهلة التشكيل ومقاومة للرطوبة، تستخدم بشكل واسع للديكورات والمجسمات الاقتصادية.',
    descriptionEn: 'Lightweight, easy to shape, and moisture-resistant rigid foam sheets. Used extensively for cost-efficient signs & indoor accents.',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=300',
    thicknessOptions: [10, 15, 20],
    thicknessPrices: { 10: 0, 15: 250, 20: 550 },
    durabilityAr: 'متوسطة (تفضل للاستخدام الداخلي أو في الأماكن المظللة)',
    durabilityEn: 'Moderate (Best for indoor or fully shaded outdoor setups)',
    indicator: 'indoor',
    pricePerSqm: 2500,
    badge: 'none',
    advantagesAr: ['تكلفة اقتصادية للغاية وسهلة التلوين والرش بالدوكو', 'وزن خفيف جداً يسهل التثبيت على الحوائط الضعيفة', 'مقاومة جيدة للرطوبة والمياه'],
    advantagesEn: ['Highly cost-effective, easy to paint with polyurethane lacquers', 'Extremely lightweight, mounts safely on drywall/gypsum', 'Good water and humidity shielding properties'],
    disadvantagesAr: ['قابلية التمدد والالتواء تحت أشعة الشمس المباشرة الطويلة', 'قوة تحمل ميكانيكية ضعيفة للارتطامات والضغط'],
    disadvantagesEn: ['Susceptible to warping and twisting under long direct solar heat', 'Lower physical impact resistance compared to metals/acrylic'],
    textureUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400',
    colorOptions: ['#FFFFFF', '#111111', '#FF0000', '#0000FF']
  },
  {
    id: 'composite',
    nameAr: 'واجهات ألواح كلادينج ألومنيوم',
    nameEn: 'Aluminum Cladding Panels',
    descriptionAr: 'ألواح ألومنيوم ثلاثية الطبقات مع حشو بولي إيثيلين مقاوم للحريق ومطلي بالدهانات الكورية PVDF عالية التحمل.',
    descriptionEn: 'Three-layer composite sheets with fire-retardant polyethylene core and PVDF coating. Standard for heavy exterior facade work.',
    image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=300',
    thicknessOptions: [4, 5],
    thicknessPrices: { 4: 0, 5: 400 },
    durabilityAr: 'فائقة جداً (بضمان 10 سنوات ضد التقشير والبهتان وعوامل التعرية)',
    durabilityEn: 'Ultimate (10-Year Fade and Peel Warranty under severe heat)',
    indicator: 'outdoor',
    pricePerSqm: 3200,
    badge: 'recommended',
    advantagesAr: ['تسوية ممتازة للجدران وإخفاء كامل لعيوب البناء والخرسانة', 'عزل حراري وصوتي متميز ومقاومة عالية للحريق', 'مجموعة واسعة من الألوان اللامعة والمط والخشبي والرخامي'],
    advantagesEn: ['Flawless wall leveling, masks building masonry defects completely', 'Superb thermal insulation, sound dampening & fire retardancy', 'Huge spectrum of glossy, matte, wooden, and marble skins'],
    disadvantagesAr: ['يتطلب تركيب فني محترف لضمان تداخل الفواصل والسيليكون', 'صعوبة التعديل والقص بعد تثبيت الهيكل الحديدي الداعم'],
    disadvantagesEn: ['Requires expert alignment & structural silicon jointing to prevent water leaks', 'Difficult to alter or cut once backing steel framework is welded'],
    textureUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400',
    colorOptions: ['#2A2A2A', '#D4AF37', '#CCCCCC', '#8B0000', '#004080']
  },
  {
    id: 'neon',
    nameAr: 'نيون فليكس ذكي مرن',
    nameEn: 'Flexible Neon Flex LED',
    descriptionAr: 'نيون فليكس سيليكون ناعم بتقنية LED يعطي تيار إضاءة مستمر خالي من النقاط محاكي لزجاج النيون التقليدي وآمن للتشغيل.',
    descriptionEn: 'Premium grade silicone Neon Flex embedding micro-LEDs. Mimics retro glass neon glow with energy safety & impact resistance.',
    image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=300',
    thicknessOptions: [8, 12],
    thicknessPrices: { 8: 0, 12: 300 },
    durabilityAr: 'عالية (مقاوم للصدمات ولا يحتوي على زجاج قابل للكسر)',
    durabilityEn: 'High (Completely shatterproof, operates on safe 12V supply)',
    indicator: 'both',
    pricePerSqm: 3500,
    badge: 'popular',
    advantagesAr: ['استهلاك كهرباء منخفض جداً ومولد حرارة شبه منعدم', 'ألوان براقة ومبهجة تجذب الأنظار بلمسة معاصرة شبابية', 'مرونة تامة لعمل أشكال وشعارات معقدة بخطوط رشيقة'],
    advantagesEn: ['Ultra-low power draw and zero heat radiation', 'Vibrant cheerful colors delivering retro-futuristic storefront vibes', 'Total flexibility to form complex curved Arabic scripts'],
    disadvantagesAr: ['عمر افتراضي أقل من ليدات سامسونج الصلبة (حوالي 30,000 ساعة)', 'لا يفضل استخدامه في المناطق المشمسة جداً المعرضة للأشعة المباشرة لشهور'],
    disadvantagesEn: ['Slightly lower lifespan than rigid modules (~30k hrs)', 'Silicone casing can gradually yellow if blasted with severe sun rays'],
    textureUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7edd96c?q=80&w=400',
    colorOptions: ['#FF007F', '#00FFFF', '#FF9900', '#00FF00', '#7F00FF', '#FFFFFF']
  }
];

export const INITIAL_PRICING_RULES: PricingRule[] = [
  {
    id: 'rule_bulk_10',
    nameAr: 'خصم المشاريع المتوسطة (أكثر من 5 متر أو 15 حرف)',
    nameEn: 'Medium Projects Discount (Qty > 15 / Size > 5m)',
    type: 'bulk',
    discountPercent: 10,
    minQty: 15,
    active: true
  },
  {
    id: 'rule_bulk_20',
    nameAr: 'خصم الكميات الضخمة والمقاولين (أكثر من 30 قطعة)',
    nameEn: 'Corporate Volume Discount (Qty > 30)',
    type: 'quantity',
    discountPercent: 18,
    minQty: 30,
    active: true
  },
  {
    id: 'rule_promo_gold',
    nameAr: 'خصم اليوبيل الذهبي ليافطة (عرض محدود لفترة وجيزة)',
    nameEn: 'Yafta Golden Jubilee Promo Discount',
    type: 'promo',
    discountPercent: 5,
    minQty: 1,
    active: true
  }
];

export const INITIAL_DIMENSION_RULES: DimensionRule[] = [
  {
    id: 'dim_signage',
    nameAr: 'محددات مقاس لافتات الواجهات الكبرى',
    nameEn: 'Storefront heavy signage limits',
    unit: 'm',
    minWidth: 0.5,
    maxWidth: 35.0,
    minHeight: 0.3,
    maxHeight: 4.5,
    presetSizes: [
      { labelAr: 'متر في نصف متر (يافطة داخلية)', labelEn: '1.0m x 0.5m (Small Indoor)', w: 1.0, h: 0.5 },
      { labelAr: 'ثلاثة أمتار في متر (يافطة واجهة فرع قياسية)', labelEn: '3.0m x 1.0m (Standard Branch)', w: 3.0, h: 1.0 },
      { labelAr: 'خمسة أمتار في متر ونصف (يافطة رئيسية فخمة)', labelEn: '5.0m x 1.5m (Grand Showroom)', w: 5.0, h: 1.5 },
      { labelAr: 'عشرة أمتار في مترين (واجهات المراكز التجارية الكبرى)', labelEn: '10.0m x 2.0m (Mega Shopping Mall)', w: 10.0, h: 2.0 }
    ]
  },
  {
    id: 'dim_printing',
    nameAr: 'محددات مطبوعات البنرات واللوحات الإرشادية',
    nameEn: 'Banner Print & Rollup sizing standards',
    unit: 'm',
    minWidth: 0.2,
    maxWidth: 15.0,
    minHeight: 0.2,
    maxHeight: 10.0,
    presetSizes: [
      { labelAr: 'رول آب قياسي لملتقيات التوظيف والمعارض', labelEn: '0.85m x 2.0m (Standard Rollup)', w: 0.85, h: 2.0 },
      { labelAr: 'بنر واجهة إعلانية صغير عالي الجودة', labelEn: '2.0m x 1.2m (Small Banner Promo)', w: 2.0, h: 1.2 },
      { labelAr: 'لوحة بنر جدارية متوسطة مشدودة على شاسيه', labelEn: '4.0m x 2.5m (Medium Wall Banner)', w: 4.0, h: 2.5 }
    ]
  }
];

export const INITIAL_PRODUCT_TEMPLATES: ProductTemplate[] = [
  {
    id: 'temp_shopfront_led',
    nameAr: 'لافتة واجهة مضيئة فاخرة متكاملة ثلاثية الأبعاد',
    nameEn: 'Elite Illuminated 3D Storefront Fascia',
    category: 'signage',
    baseMaterialId: 'acrylic',
    defaultWidth: 4.0,
    defaultHeight: 1.2,
    defaultQty: 12
  },
  {
    id: 'temp_cladding_gold',
    nameAr: 'واجهة كلادينج ألومنيوم مع أحرف ستانلس ذهبية هالة',
    nameEn: 'Mirrored Titanium Gold Cladding Facade Bundle',
    category: 'signage',
    baseMaterialId: 'stainless',
    defaultWidth: 6.0,
    defaultHeight: 1.8,
    defaultQty: 18
  },
  {
    id: 'temp_office_neon',
    nameAr: 'شعار نيون داخلي مخصص للمكاتب وقاعات الاستقبال',
    nameEn: 'Bespoke Executive Reception Silicone Neon Logo',
    category: 'signage',
    baseMaterialId: 'neon',
    defaultWidth: 1.5,
    defaultHeight: 0.8,
    defaultQty: 1
  }
];

export const INITIAL_SETTINGS: ConfigSettings = {
  baseProcessingCost: 750, // basic laser cutting & workshop prep cost per order
  printingCostPerSqm: 350, // high-fidelity direct printing
  finishingOptions: [
    { id: 'none', nameAr: 'بدون تشطيب إضافي (ألوان الخامة الأساسية)', nameEn: 'Standard mill finish with raw layout colors', price: 0 },
    { id: 'mirror_pvd', nameAr: 'تلميع تيتانيوم ذهبي ميرور PVD (+20% من التكلفة)', nameEn: 'Glossy gold mirror titanium deposition plating (+20%)', price: 1.20 },
    { id: 'powder_coat', nameAr: 'دهان حراري إليكتروستاتيك مقاوم للصدأ وفرن خشبي', nameEn: 'Anti-scratch electrostatic powder coating & oven cure', price: 450 },
    { id: 'acrylic_trim', nameAr: 'إضافة شريط ترامب ألومنيوم جانبي للحروف', nameEn: 'Aluminum profile side trims with F-bracket wrapping', price: 250 }
  ],
  installationCostPerSqm: 350, // professional rigging & field mounting
  transportationCostPerKm: 15, // trucking cost per kilometer
  urgencyFactor: 1.25, // urgency cost markup multiplier
  profitMargin: 25 // standard mark-up percentage
};
