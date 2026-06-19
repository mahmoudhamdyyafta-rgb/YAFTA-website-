/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CompanyInfo, Project, BeforeAfterItem, Testimonial, ServiceDetail, FaqItem } from './types';

export const COMPANY_DETAILS: CompanyInfo = {
  nameAr: 'يافطة للدعاية والإعلان',
  nameEn: 'YAFTA Advertising Agency',
  addressAr: '36 شارع عبد العزيز عبد الدايم، أحمد عصمت، عين شمس، القاهرة، مصر',
  addressEn: '36 Abdel Aziz Abdel Dayem Street, Ahmed Essmat, Ain Shams, Cairo, Egypt',
  phone: '0224931945',
  whatsapp: '01116210464',
  emails: ['yaftagroupadv@gmail.com', 'info@yafta-adv.com'],
  website: 'www.yafta-adv.com'
};

export const STATISTICS_COUNTERS = [
  {
    id: 'projects',
    value: 500,
    suffix: '+',
    labelAr: 'مشروع متكامل',
    labelEn: 'Completed Projects',
    descAr: 'تم تسليمها وفقاً لأعلى معايير الدقة',
    descEn: 'Delivered with the highest precision'
  },
  {
    id: 'clients',
    value: 300,
    suffix: '+',
    labelAr: 'عميل سعيد',
    labelEn: 'Satisfied Clients',
    descAr: 'من كبرى الشركات والمؤسسات الرياضية والتجارية',
    descEn: 'From leading enterprises & local brands'
  },
  {
    id: 'awards',
    value: 50,
    suffix: '+',
    labelAr: 'جائزة وشهادة تقدير',
    labelEn: 'Awards & Certifications',
    descAr: 'تقديراً لإبداعنا وجودة الهندسة والتركيب',
    descEn: 'Honoring creativity & engineering excellence'
  },
  {
    id: 'experience',
    value: 10,
    suffix: '+',
    labelAr: 'سنوات من الخبرة',
    labelEn: 'Years of Experience',
    descAr: 'عقد كامل من الابتكار والريادة في السوق المصري',
    descEn: 'A decade of pioneering leadership in Egypt'
  }
];

export const SERVICE_CATEGORIES = [
  { id: 'all', titleAr: 'الكل', titleEn: 'All Projects' },
  { id: 'identity', titleAr: 'الهوية البصرية واللوجو', titleEn: 'Brand Identity & Logo' },
  { id: 'signage', titleAr: 'اللافتات والحروف ثلاثية الأبعاد', titleEn: 'LED Signs & 3D Letters' },
  { id: 'cladding', titleAr: 'الكلادينج والواجهات التجارية', titleEn: 'Cladding & Facades' },
  { id: 'printing', titleAr: 'المطبوعات الاحترافية والعلب', titleEn: 'Printing & Packaging' },
  { id: 'digital', titleAr: 'المواقع والتطبيقات الذكية', titleEn: 'Websites & Mobile Apps' },
  { id: 'media', titleAr: 'الإنتاج المرئي والتصوير والمقاطع', titleEn: 'Media & Photography' },
  { id: 'other', titleAr: 'تجهيز المعارض والهدايا ومواقع التواصل', titleEn: 'Exhibitions & Promotional' }
];

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    id: 'signage',
    titleAr: 'اللافتات المضيئة والحروف البارزة',
    titleEn: 'Illuminated Signage & 3D Letters',
    descriptionAr: 'تصميم وتصنيع لافتات LED، الأكريليك، وتشكيل الاستانلس ستيل الفاخر والزنكور بأحدث الأجهزة.',
    descriptionEn: 'Design and custom production of premium LED, acrylic, back-lit, front-lit, and stainless steel lettering with fine architectural finishes.',
    iconName: 'Sparkles',
    featuresAr: [
      'حروف أكريليك مضيئة بنظام LED موفر للطاقة ومقاوم للأحوال الجوية',
      'حروف استانلس ستيل لامع ومطفي فخم مقاوم للصدأ تماماً',
      'لافتات فليكس مضيئة (Frontlit & Backlit) بجودة ألوان فائقة',
      'لافتات المولات والمؤسسات الكبيرة وأنظمة التوجيه والإرشاد الشاملة'
    ],
    featuresEn: [
      'Acrylic letters illuminated with premium energy-saving & weather-proof LED',
      'Polished & brushed stainless steel letters with ultimate corrosion protection',
      'Vivid High-Format flex-face backlit signage for highway & store displays',
      'Corporate wayfinding, mall pylons, double-sided signposts & safety systems'
    ],
    image: 'https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=800'
  },
  {
    id: 'cladding',
    titleAr: 'واجهات الكلادينج والتشطيب المعماري',
    titleEn: 'ACP Cladding & Commercial Facades',
    descriptionAr: 'تغطية واجهات المباني واللوحات بألواح الكلادينج المعتمدة المقاومة للحرارة والحريق بتصميمات عصرية.',
    descriptionEn: 'High-end Aluminum Composite Panels (ACP) cladding for multi-story buildings, retail stores, and headquarters with ultimate thermal resistance.',
    iconName: 'Building2',
    featuresAr: [
      'ألواح كلادينج معتمدة مقاومة للحرارة العالية والحرائق والرطوبة',
      'هياكل حديدية مدعمة هندسياً لحساب مقاومة الرياح والعوامل الطبيعية',
      'دمج فخم للإضاءة المخفية وأنظمة الأنبوب والخطوط المضيئة',
      'تصميمات ثلاثية الأبعاد تفاعلية للواجهة قبل التنفيذ الفعلي'
    ],
    featuresEn: [
      'Premium certified fireproof & heat-resistant ACP sheets with 10-year warranty',
      'Heavy structural steel framework computed for ultimate wind load parameters',
      'Strategic integration of architectural linear LEDs & embedded profiles',
      'Photorealistic 3D external visualization of your storefront before fabrication'
    ],
    image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800'
  },
  {
    id: 'printing',
    titleAr: 'المطبوعات الاحترافية وحلول التعبئة والتغليف',
    titleEn: 'Premium Printing & Packaging Solutions',
    descriptionAr: 'طباعة كروت الأعمال الفاخرة، والكتالوجات، والبروشورات، والعلب المصممة خصيصاً لحماية منتجك وإبرازه.',
    descriptionEn: 'High-definition large and small format printing, corporate stationery, luxury cataloging, commercial packaging, and boutique product gift boxes.',
    iconName: 'Files',
    featuresAr: [
      'طباعة أوفست وديجيتال بأعلى مستويات الدقة والتباين اللوني الكوني',
      'تجهيز علب كرتونية فاخرة بملمس مخملي وسلوفان مطفي وسلوفان لامع',
      'تأثيرات البصمة الذهبية والفضية البارزة (Hot Foil & Embossing) والورنيش الموضعي Spot UV',
      'حوامل رول أب (Roll-Up) وبنرات المعارض الضخمة بدقة ألوان مضمونة'
    ],
    featuresEn: [
      'Stellar offset and digital outputs with precision CMYK alignment & rich dark blacks',
      'Rigid premium product boxes and master shipping packaging with custom velvet inlay',
      'Luxury finishing, metallic hot-stamping (gold/silver), custom embossing, and spot UV coating',
      'Banner stands, flags, step-and-repeat backdrops for corporate conferences'
    ],
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800'
  },
  {
    id: 'digital',
    titleAr: 'المواقع الإلكترونية والحلول الرقمية المتكاملة',
    titleEn: 'Web Development & Digital Platforms',
    descriptionAr: 'برمجة مواقع الشركات التعريفية، المتاجر الإلكترونية، وتطبيقات الموبايل لدعم تجربة عميل مثالية وسلسة.',
    descriptionEn: 'Bespoke corporate websites, high-conversion e-commerce stores, CRM/ERP administrative backends, and beautiful intuitive mobile applications.',
    iconName: 'Layout',
    featuresAr: [
      'مواقع إلكترونية سريعة ومحسنة تماماً لمحركات البحث وجوجل SEO',
      'متاجر إلكترونية غنية ببوابات الدفع المصرية والإنترناشيونال وسلال الشراء',
      'أنظمة إدارية مخصصة (ERP/CRM) لتنظيم المبيعات والمخزون وحسابات العملاء',
      'تطبيقات موبايل تدعم أندرويد وآي أو إس بواجهات مريحة وسلسة للغاية'
    ],
    featuresEn: [
      'Blazing fast websites fully integrated with modern SEO practices and analytics',
      'Feature-rich e-commerce shops supporting domestic payment channels & order tracking',
      'Bespoke visual dashboards, CRM systems, and resource controllers tailored to Egyptian SMEs',
      'Native-feel Android & iOS applications using clean robust responsive interfaces'
    ],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'
  },
  {
    id: 'media',
    titleAr: 'الإنتاج الفني والتصوير وصناعة المحتوى',
    titleEn: 'Media Production & Visual Assets',
    descriptionAr: 'جلسات تصوير المنتجات، إنتاج الفيديوهات الإعلانية للشركات، والمحتوى التواصلي الاجتماعي الفخم.',
    descriptionEn: 'High-end corporate videography, product photography, drone coverage of mega projects, social media reels, and high-impact motion charts.',
    iconName: 'Camera',
    featuresAr: [
      'تصوير فوتوغرافي تجاري مخصص للمنتجات والمطاعم والأثاث',
      'إنتاج وإخراج فيديوهات بروفايل الشركات والمصانع لعرض القدرات',
      'تغطية جوية احترافية للمشاريع الكبيرة باستخدام الطائرات الدرون المعتمدة',
      'صناعة وتعديل ريلز وفيديوهات تيك توك وسوشيال ميديا جذابة وخالدة'
    ],
    featuresEn: [
      'Elite product, gastronomy, and lifestyle studio imagery for ads and catalogs',
      'Premium corporate profile videography with narrative voiceovers & sound design',
      'Licensed aerial drone coverage to showcase plant operations, facades, & real estate',
      'Engaging high-converting social media loops, Reels, and YouTube visual essays'
    ],
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800'
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'mado-cladding',
    titleAr: 'واجهة كلادينج وحروف بارزة مادو',
    titleEn: 'MADO Restaurant Premium Exterior',
    clientAr: 'سلسلة مطاعم مادو',
    clientEn: 'MADO Restaurants Chain',
    category: 'cladding',
    industryAr: 'أغذية ومشروبات / ضيافة',
    industryEn: 'F&B & Hospitality',
    serviceTypeAr: 'واجهات ACP + حروف بارزة ليد كاملة',
    serviceTypeEn: 'Premium ACP Facade + Integrated LED Signs',
    completionDate: '2025-11-20',
    coverImage: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=800',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800'
    ],
    overviewAr: 'تنفيذ شامل للواجهة الفاخرة لمقر مادو الجديد، باستخدام أفضل ألواح كلادينج ألومنيوم مقاوم للحريق باللون الأسود الملكي المطلي بفلوريد متعدد الفاينيليدين (PVDF) لتوفير متانة فائقة وحماية من العوامل الشمسية القاسية، بالتكامل مع حروف مضيئة خلفية مصنوعة من الاستانلس الذهبي والأكريليك المعالج.',
    overviewEn: 'A luxury full-scale facade renovation for MADO flagship premium venue. We integrated thick fireproof matte black Aluminum Composite Panels (PVDF treated for harsh sun-exposure) with golden mirror stainless steel backlit 3D letters, creating a stunning visual signature.',
    resultsAr: 'زيادة الإقبال المباشر بنسبة تقدر بـ 45% بفضل وضوح وجاذبية العلامة في الشارع، واجتذاب عشاق التصوير الكلاسيكي الفخم.',
    resultsEn: 'Boosted on-foot guest conversions by 45% within three months, delivering an architectural landmark along Ayn Shams area with superb night visibility.',
    challengeAr: 'كانت الواجهة القديمة للمبنى متهالكة وتحتوي على تمديدات سلكية عشوائية وتآكل ميكانيكي بالخرسانة، مما يتطلب هيكلاً معدنياً صلباً قادراً على تحمل وزن الكلادينج والحروف مع معالجة العيوب الإنشائية.',
    challengeEn: 'The original concrete structure had severe uneven levels, visible external wiring, and decay, demanding a complex structural iron skeletal grid to support over 180 sqm of high quality cladding safe from high wind pressure.',
    researchAr: 'تم تصوير الموقع بكاميرات رصد ليلية ونهارية لتحديد الزوايا البصرية الأكثر ملاءمة للمارة وقائدي السيارات القادمين من الشوارع الفرعية وتقييم تأثير سطوع الإضاءة الليلية.',
    researchEn: 'Visual angle logging using long-exposure cameras helped evaluate street layout and traffic direction to optimize luminance and make sure the signs did not blind approaching drivers.',
    conceptAr: 'ابتكار دمج دافئ بين الخط الكلاسيكي والأسلوب المودرن الفخم: واجهة مسطحة سوداء معتمة تبرز عليها تفاصيل ذهبية مرآتية مضيئة خافتة.',
    conceptEn: 'A warm classic-meets-modern design: dark monolithic facade backdrop with mirror-finish high floating titles casting a soft atmospheric shadow glow.',
    designAr: 'تم رسم وتصميم الهياكل والأحمال بواسطة برامج الهندسة المتطورة، تلتها عملية نمذجة ثلاثية الأبعاد كاملة لتصميم الحروف وتحديد مسافات الليزر بدقة مليمترية.',
    designEn: 'Autodesked for strict engineering calculations, following up with full photorealistic renderings simulating night and daylight shadow casting.',
    productionAr: 'تصنيع الحروف بدقة متناهية بلحم الأرجون اللاسلكي الفاخر وتثبيت صمامات ثنائية باعثة للضوء (LED) يابانية الصنع مع ترانسات مقاوم للرطوبة مطابقة للمواصفات القياسية.',
    productionEn: 'Crafted letters using advanced fiber laser cutting, high precision argon welding, custom molded premium acrylic cores, and weather-defying heavy IP67 Samsung LED modules.',
    stagesAr: [
      'رفع المقاييس والمعاينة الإنشائية واختبار الخرسانة',
      'تركيب الهيكل الحديدي المانع للصدأ وتثبيته في الهيكل الإنشائي',
      'تغطية الهيكل بألواح الكلادينج وعزل أماكن الفواصل بالسيليكون الإنشائي الفاخر',
      'تصنيع الحروف البارزة وتمديد الأسلاك بشكل مخفي 100%',
      'تثبيت الحروف والاختبار التشغيلي والمطابقة للمواصفات النهائية'
    ],
    stagesEn: [
      'Site evaluation, structural load assessment, and concrete integrity tests',
      'Anti-corrosive structural heavy-gauge steel skeletal mounting',
      'ACP panel fixing with full structural weatherproofing and joint sealing',
      'Bespoke laser-crafting of 3D logos and zero-wire exposure routing',
      'Final mechanical mounting, electrical testing under extreme load, and delivery'
    ],
    feedbackAr: 'تنفيذ مذهل فاق كل توقعاتنا. الاحترافية الهندسية والدقة في تصنيع التفاصيل والالتزام التام بالموعد المحدد جعل من يافطة شريك نجاح دائم لمجموعتنا.',
    feedbackEn: 'Absolute masterpiece. The engineering exactness and attention to concealed details blew our brand team away. YAFTA is now our official contractor across Egypt.',
    rating: 5,
    specificationsAr: [
      'وزن الكلادينج الكلي: 180 متر مربع من الألواح المقاومة للحريق بسماكة 4 مم',
      'أحرف مضيئة: فولاذ مقاوم للصدأ (Stainless Steel 304) عيار 1.2 مم مدهب مرآة',
      'إضاءة LED: سامسونج ليد كوري أصلي بضمان 3 سنوات',
      'عزل الرطوبة: معزول بالكامل ضد مياه الأمطار والحرارة الشديدة للجو المصري'
    ],
    specificationsEn: [
      'ACP surface area: 180 sqm of 4mm specialized class B1 fireproof sheets',
      'Metal specification: 304 Grade Gold Mirror Stainless Steel with 1.2mm density',
      'LED system: Original Korean manufactured modules with smart power drivers',
      'Waterproofing: Certified IP67 fully sealed against torrential rains and Cairo summer'
    ]
  },
  {
    id: 'signature-letters',
    titleAr: 'حروف بارزة أكريليك لصالون التجميل سيجنتشر',
    titleEn: 'Signature Beauty Lounge Acrylic 3D Letters',
    clientAr: 'صالون سيجنتشر راقي',
    clientEn: 'Signature Luxury Lounge',
    category: 'signage',
    industryAr: 'تجميل وصحة / ترفيه',
    industryEn: 'Beauty & Lifestyle',
    serviceTypeAr: 'حروف ثلاثية الأبعاد أكريليك مضيئة بالكامل واستانلس',
    serviceTypeEn: '3D Front-lit Acrylic & Stainless Steel Hybrid',
    completionDate: '2025-05-15',
    coverImage: 'https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800'
    ],
    overviewAr: 'تصنيع حروف مضيئة من الأكريليك المعالج كيميائياً والمقاوم للاصفرار لصالون سيجنتشر بلمسات فاخرة من الكروم والستانلس روز جولد تتماشى مع الطابع الرقيق والأنيق للمكان، مستهدفة فئة النخبة.',
    overviewEn: 'Superbly formed high-gloss white and rose gold acrylic front-lit signage. We custom framed the design with vacuum-electroplated rose gold stainless borders to convey ultimate class, tenderness, and upscale aesthetic.',
    resultsAr: 'تحقيق لمسة ترحيبية أنثوية هادئة جذبت مئات الزوار الجدد في الأسبوع الأول من الافتتاح وزادت من رغبتهم في التقاط صور سيلفي.',
    resultsEn: 'Created an Instagrammable focal point that elevated active organic check-ins and tag counts on social media channels by 60% during launch weeks.',
    challengeAr: 'العلامة التجارية مكتوبة بخط رفيع للغاية ومتصل يحاكي الكتابة اليدوية، مما شكل تحدياً تقنياً كبيراً في الثني اليدوي والتوصيل الكهربائي للحروف بالغة الدقة.',
    challengeEn: 'The brand logo features custom cursive typography with razor-sharp loops, making precise mechanical bending and internal wire placement very difficult.',
    researchAr: 'قمنا بدراسة تشتت الضوء بالأكريليك ذو سماكات مختلفة لضمان عدم ظهور أي بقع إضاءة داكنة (Hotspots) والحصول على لمعان ناعم متناسق كلياً.',
    researchEn: 'Conducted light refraction analysis on different matte levels of plexiglass to find the exact acrylic density that prevents light hotspots, ensuring a smooth glow.',
    conceptAr: 'خطوط رشيقة دافئة تعكس الرقي والأنوثة والإبداع المعماري الدقيق.',
    conceptEn: 'Graceful feminine calligraphy that feels light as air yet solid and permanent.',
    designAr: 'تم تكبير المتجهات بدقة وعزل الحروف المتشابكة مع الحفاظ على الفراغات الجمالية المحددة للكتلة والتجانس الخارجي.',
    designEn: 'Vector scaling with dynamic geometric support lines to ensure structurally sound connections while preserving the elegant calligraphic identity.',
    productionAr: 'ثني الحروف الحراري بالليزر والتشكيل الدقيق للمقاطع الطولية بالاستانلس عيار روز جولد مع لحامات مخفية بالتمام كلياً.',
    productionEn: 'Thermo-bent on precision custom heat tables, framed with non-fading alloy elements to guarantee absolute structural integrity and color durability.',
    stagesAr: [
      'تحليل ملف التصميم وتصديره للهندسة التفصيلية',
      'تشكيل جوانب الاستانلس الروز جولد في ورشنا المتطورة',
      'صب وصهر الأكريليك الشفاف لتوزيع الضوء بانتظام',
      'زرع خلايا الـ LED البيضاء الثلجية فائقة النقاء بالخلفية للإنارة الساطعة',
      'التركيب المعلق بنظام التعليق المخفي تماماً عن العين'
    ],
    stagesEn: [
      'Vector file optimization and stress modeling',
      'Custom sheet bending using specialized forming jaws',
      'Forming high-diffusion premium milky acrylic lenses',
      'Laying micro-LED arrays for absolute shadowless face glow',
      'Invisible wall-stud floating installation'
    ],
    feedbackAr: 'الحروف المضيئة لوحة فنية بمعنى الكلمة، الضوء الموزع بانسيابية لافت للنظر، والتشطيب النهائي الاستانلس الروز جولد قمة في الأناقة ونال إشادة عملائنا.',
    feedbackEn: 'The rose gold side finish is breathtaking and has a mirror-like shine. The illumination is smooth and premium. It really reflects who we are!',
    rating: 5,
    specificationsAr: [
      'سماكة الأكريليك: 5 مم أكريليك تايواني نقي 100% معالج ضد الاصفرار والشمس',
      'جوانب الحروف: ستانلس ستيل عيار 0.8 مم روز جولد مطلي بالتفريغ الحراري الكهربائي PVD',
      'نوع الإنارة: ديودات ليد سامسونج ساطعة بلون أبيض دافئ 4000K'
    ],
    specificationsEn: [
      'Plexiglass thickness: 5mm premium grade sun-resistant non-yellowing acrylic',
      'Metal profile: 0.8mm Thickness PVD Vacuum Gold electroplated stainless framework',
      'Light temperature: High-glow eye-safe warm white 4000K LEDs'
    ]
  },
  {
    id: 'elite-gym-facade',
    titleAr: 'تجهيز واجهات نادي النخبة الرياضي بالكامل',
    titleEn: 'Elite Fitness Club Modern Facade & Branding',
    clientAr: 'نادي النخبة الرياضي',
    clientEn: 'Elite Fitness Club',
    category: 'cladding',
    industryAr: 'رياضة وصحة / ترفيه',
    industryEn: 'Sports & Entertainment',
    serviceTypeAr: 'واجهات لوحات كلادينج حديدية + شعارات عملاقة مزدوجة',
    serviceTypeEn: 'Dynamic Metal Facade & Large Outdoor Icons',
    completionDate: '2025-02-10',
    coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800'
    ],
    overviewAr: 'مشروع مذهل لتغطية واجهتين متقاطعتين بطول 40 متراً بارتفاع 8 أمتار لنادي إيليت الرياضي، باستخدام ألواح كلادينج معدني أحمر ناري وأسود كاربوني، متداخلة مع ألواح إضاءة RGB مبرمجة لتعكس طاقة وحيوية النشاط الرياضي.',
    overviewEn: 'A landmark 40-meter wide facade with dynamic fire-red and charcoal carbon steel cladding panels. Integrated with intelligent digital DMX RGB LED line animation triggered at twilight to broadcast energetic physical training themes.',
    resultsAr: 'أصبح النادي أشهر معالم المنطقة الرياضية مع زيادة قياسية في الاشتراكات السنوية وجعل الواجهة مادة للتسويق الرقمي.',
    resultsEn: 'Turned the building into a massive local landmark. Resulted in record-shattering subscription sign-ups and continuous viral traction on youth-centric media.',
    rating: 5,
    challengeAr: 'موقع الواجهة في تقاطع شارعين رئيسيين سريع والرياح فيه شديدة، مما يستلزم مقاومة ميكانيكية استثنائية.',
    challengeEn: 'High-speed coastal wind loads at the prominent intersection demanded specialized stress-calculated chassis and heavy bracing.',
    conceptAr: 'حركة وطاقة كامنة تم التعبير عنها بكتل مائلة معبرة عن القوة.',
    conceptEn: 'Visual kinetic thrust: angled asymmetric red-and-black massive panels signifying strength and forward progress.',
    designAr: 'تمت المحاكاة الهوائية للرياح تحت ظروف العواصف للتأكد من حماية الكبسولات المعدنية كلياً.',
    designEn: 'Conducted rigorous wind-tunnel simulations on CAD to eliminate any draft vibration and panel rattle.',
    productionAr: 'قطع الألواح بنظام سي إن سي عالي الكفاءة، ودمج مجاري الألومنيوم غير الظاهرة مع لحامات متينة مدعمة بالأرجون.',
    productionEn: 'Bespoke precision CNC shearing, custom profile bending, and integration of recessed waterproof dynamic RGB strip lighting.'
  },
  {
    id: 'natura-packaging',
    titleAr: 'تغليف وعلب منتجات ناتشورا للتجميل الطبيعي',
    titleEn: 'Natura Premium Cosmetic Packaging & Cataloging',
    clientAr: 'شركة ناتشورا للمستحضرات الطبيعية',
    clientEn: 'Natura Organic Cosmetics',
    category: 'printing',
    industryAr: 'منتجات طبية وتجميلية',
    industryEn: 'Cosmetics & Pharmacy',
    serviceTypeAr: 'تصميم وطباعة علب كرتون معالجة بلمسات ذهبية بارزة',
    serviceTypeEn: 'Bespoke Structured Boxes & Golden Foil Print',
    completionDate: '2025-08-05',
    coverImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800'
    ],
    overviewAr: 'إنتاج متكامل لخط التعبئة والتغليف بأوراق معالجة كيميائياً ضد الرطوبة ومصقولة الملمس لبراند ناتشورا الفخم، يشمل كروت الهوية، كتالوج المنتجات التوضيحي، وعلب توزيع مع ورنيش موضعي بارز وبصمة نحاسية مذهبة تظهر فخامة المكونات.',
    overviewEn: 'Total production of Natura flagship cosmetics boxes. Using eco-friendly textured stock featuring greaseproofing, high-build Spot UV, and gold-leaf micro-stamping to represent high-end botanical ingredients.',
    resultsAr: 'حفظ سلامة العلب الفاخرة أثناء النقل والشحن، وجذب الموزعين المعتمدين بفضل الهيئة الفخمة للمنتج على الأرفف.',
    resultsEn: 'Strengthened premium consumer shelf appeal, giving Natura immediate credibility in pharmacy chains and organic upscale boutiques.',
    rating: 5,
    challengeAr: 'العبوات تحتوي على مستخلصات زيتية طبيعية قد تتسرب وتفسد الشكل الخارجي للعلبة الكرتونية.',
    challengeEn: 'Natural volatile oil formulas required special inward facing barrier laminations to avoid packaging grease bleed.',
    conceptAr: 'طبيعة فخمة: أوراق ذات قوام غني بألوان أرضية داكنة مع بريق ذهبي ناعم وخطوط كلاسيكية دقيقة.',
    conceptEn: 'Luxury botanical touch: textured forest floor sheets highlighted with delicate golden outlines.',
    designAr: 'تم تضبيط قوالب السكاكين (Die-Cut templates) وتجربتها يدوياً لضمان إغلاق محكم وسلس للغاية.',
    designEn: 'Engineered custom die cuts and physical print tests to formulate zero-glue self-locking product boxes.'
  },
  {
    id: 'buildpro-web',
    titleAr: 'الموقع الرسمي لشركة بيلدبرو للمقاولات والتطوير',
    titleEn: 'BuildPro Enterprise Corporate Platform',
    clientAr: 'شركة بيلدبرو للمقاولات',
    clientEn: 'BuildPro Real Estate & Construction',
    category: 'digital',
    industryAr: 'عقارات وتشييد',
    industryEn: 'Real Estate & Construction',
    serviceTypeAr: 'موقع ويب تعريفي فخم متجاوب بالكامل + نظام إدارة مشروعات',
    serviceTypeEn: 'Luxury Responsive Corporate Website + CRM Integration',
    completionDate: '2025-09-30',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800'
    ],
    overviewAr: 'برمجة موقع الشركات التعريفي لشركة بيلد برو الرائدة في التطوير العقاري. يدعم عرض تفاعلي لمشاريعهم السابقة من خلال معرض أعمال مصنف، جولات افتراضية للمباني، نموذج تقديم وحساب تكاليف للمقاولات، ومتجاوب بالكامل مع كافة الأجهزة مع لوحة تحكم مخصصة لإدارة المحتوى بأحدث الأطر البرمجية.',
    overviewEn: 'Bespoke corporate portal for BuildPro construction giant. Features a beautiful dark/gold architecture gallery, dynamic building specifications viewer, and customized construction quote calculator with lightning-fast load times.',
    resultsAr: 'تلقي أكثر من 120 طلب مقاولة جاد خلال الشهر الأول بفضل واجهة المستخدم المدروسة وسهولة تصفح سجل الإنجازات.',
    resultsEn: 'Generated over 120 verified enterprise renovation inquiries in 30 days via streamlined interactive quote selectors.',
    rating: 5,
    challengeAr: 'رغبة العميل في عرض كتالوج ضخم من الصور والمخططات الهندسية عالية الجودة دون التضحية بسرعة استجابة الموقع وسرعة تحميل الصفحات.',
    challengeEn: 'Managing extremely heavy structural architectural photos and layouts without damaging overall page load scores.',
    conceptAr: 'مكعبات هيكلية صلبة تعبر عن البناء والرفاهية والنمو الهندسي.',
    conceptEn: 'Solid structural columns, clean dark grids, and elegant transitions mirroring physical architectural spaces.',
    designAr: 'تصميم تجربة مستخدم UX تضمن وصول الزائر لسجل المشروعات بضغطة زر واحدة من أي مكان بالمنصة.',
    designEn: 'Designed strict user paths based on heatmaps, prioritizing visual completion and interactive blueprints.',
    productionAr: 'بناء المنصة بلغة ثنائية داعمة للغة العربية والإنجليزية، بالاعتماد على ميزات ضغط الصور الفوري وتحميل الموارد الكسول.',
    productionEn: 'Built with bilingual custom code generators with automatic assets compression and CDN routing.'
  },
  {
    id: 'techstore-media',
    titleAr: 'الحملة الإعلانية والتصوير التجاري لمنتجات تك ستور',
    titleEn: 'TechStore Premium Launch Video & Campaign',
    clientAr: 'متاجر تك ستور للتكنولوجيا الحديثة',
    clientEn: 'TechStore Retail Chain',
    category: 'media',
    industryAr: 'أجهزة إلكترونية تجارية',
    industryEn: 'Consumer Electronics',
    serviceTypeAr: 'تصوير فوتوغرافي تجاري + إعلانات ريلز لوسائل التواصل',
    serviceTypeEn: 'Commercial Product Photography & Campaign Videography',
    completionDate: '2025-07-20',
    coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800'
    ],
    overviewAr: 'إطلاق هوية بصرية دعائية واعدة تشمل جلسات تصوير استوديو للمنتجات الذكية بوجود عارضين محترفين وإنشاء مقاطع إعلانية سريعة ملهمة للنشر عبر السوشيال ميديا لجذب جيل الشباب، بدقة مذهلة وإبداع متفرد.',
    overviewEn: 'Full production of TechStore national brand identity drive. Comprising of high-end studio macro product setups, model shoots, dark atmospheric lighting environments, and clean action-oriented cinematic reels.',
    resultsAr: 'تخطي عدد المشاهدات لحملة الإطلاق 1.5 مليون مشاهدة في مصر خلال الأسبوع الأول من بدء الإعلانات الممولة.',
    resultsEn: 'Achieved over 1.5 million regional video views with high engagement scores and immediate online shop conversions.',
    rating: 5,
    challengeAr: 'الأجهزة الإلكترونية ذات لمعان وخطوط ومرايا عاكسة، مما يسبب انعكاسات ضوئية ورعشة بالكاميرا يجب معالجتها بمهارة.',
    challengeEn: 'High reflectivity of luxury gadget glass and metallic surfaces cause blinding glare and camera sensor interference.',
    conceptAr: 'غموض تكنولوجي جذاب: إضاءة نيون ملونة من الخلف متداخلة مع تباينات ظل عميقة تظهر التفاصيل الصلبة.',
    conceptEn: 'Cyberpunk luxury mystery: dark carbon tones with contrasting blue, pink and golden neon rim lights.',
    designAr: 'تم تضبيط المشاهد ثانية بثانية وتحديد الـ Storyboard لمزامنة زوايا التصوير مع الموسيقى التصويرية المدمجة.',
    designEn: 'Frame-by-frame pre-visualization with comprehensive storyboarding to optimize fast energetic cuts.',
    productionAr: 'استعمال كاميرات سينمائية متطورة لتسجيل التفاصيل بالغة الدقة وتعديل الألوان السينمائي الدافئ (Color Grading).',
    productionEn: 'Shot on high-dynamic-range cinema cameras with meticulous color-grading to suit luxury branding criteria.'
  }
];

export const BEFORE_AFTER_DATA: BeforeAfterItem[] = [
  {
    id: 'ba-facade-mado',
    categoryAr: 'واجهات المحلات',
    categoryEn: 'Storefront Facades',
    titleAr: 'تجديد واجهة مادو بمصر الجديدة',
    titleEn: 'MADO Restaurant Heliopolis Facade',
    beforeImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800', // simple background
    afterImage: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800', // high end illuminated
    specsAr: ['تغطية بـ كلادينج أسود 4 مم مقاوم للحريق', 'حروف بارزة استانلس مذهب مضيئ خلفي', 'إضاء ليد مخفية بالكامل'],
    specsEn: ['Covered with 4mm black fireproof ACP cladding', 'Backlit golden mirror stainless steel letters', '100% concealed atmospheric LED modules']
  },
  {
    id: 'ba-sign-life',
    categoryAr: 'اللافتات المضيئة',
    categoryEn: 'LED Signs',
    titleAr: 'شعار عيادات لايف كلينيكس الطبي',
    titleEn: 'Life Clinics Medical Outdoor Logo',
    beforeImage: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800',
    afterImage: 'https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=800',
    specsAr: ['أكريليك تايواني مفرغ عالي الإضاءة', 'هيكل حماية خارجي عازل للرطوبة والمياه', 'إنارة ليد ثلجية فائقة التباين'],
    specsEn: ['High-glow vacuum acrylic forming', 'Heavy protective humidity-blocking enclosure', 'Extreme-contrast cooling white LED layout']
  },
  {
    id: 'ba-office-branding',
    categoryAr: 'الهويات البصرية والمكاتب',
    categoryEn: 'Office Branding',
    titleAr: 'الاستقبال الرئيسي لشركة المقاولات الوطنية',
    titleEn: 'National Contracting Main Reception',
    beforeImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800',
    afterImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800',
    specsAr: ['خلفية حوائط لوفرز خشبية مع فيبر أسود فرنسي وشريط ذهبي نحاسي', 'جسم الشعار استانلس مع حفر ليزر دقيق للكتلة الإعلانية'],
    specsEn: ['Charcoal wood paneling with mirror gold alloy inserts', '3D Brushed gold letters with glow shadow halo']
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'test-1',
    clientNameAr: 'أحمد محمود',
    clientNameEn: 'Ahmed Mahmoud',
    companyAr: 'المدير التشغيلي لسلسلة مادو مصر',
    companyEn: 'Operations Director at MADO Egypt',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
    rating: 5,
    reviewAr: 'بداية من دراسة الأحمال الهندسية لواجهتنا، وصولاً للالتزام التام بتسليم الكلادينج والحروف المضيئة في الموعد الموعود قبل افتتاح الموسم السياحي، لمسنا قمة الاحترافية والتنفيذ الخالي من العيوب تماماً. يافطة هي اختيارنا الأوحد للدعاية منذ سنوات.',
    reviewEn: 'From initial wind load computations to the final flawless mounting of our 180 sqm facade right before the tourism season peak, YAFTA showed unmatched engineering discipline. Outstanding support and premium warranty.',
    projectTypeAr: 'واجهة كلادينج وحروف بارزة متكاملة',
    projectTypeEn: 'Full ACP Facade & 3D Letters Setup'
  },
  {
    id: 'test-2',
    clientNameAr: 'سارة خالد',
    clientNameEn: 'Sarah Khaled',
    companyAr: 'مديرة التسويق بشركة ناتشورا للمستحضرات الطبيعية',
    companyEn: 'Marketing Lead at Natura Organic',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
    rating: 5,
    reviewAr: 'مستحضرات التجميل الراقية تتطلب لمسات خاصة مثل الورنيش الموضعي والبصمة الذهبية الدقيقة. يافطة استطاعت تحقيق ذلك على خطوط إنتاج العلب الفاخرة بطباعة وتغليف ينافس الجودة الأوروبية. المبيعات ارتفعت بشكل كبير بفضل تميز المنتج على الأرفف.',
    reviewEn: 'Our luxury cosmetics brand requires fine details like gold-leaf micro stamping and soft-touch lamination. YAFTA team delivered print runs of boxes and catalogs that rival European standards. Absolute visual triumph.',
    projectTypeAr: 'طباعة علب وكتلوجات فاخرة وتغليف',
    projectTypeEn: 'Bespoke Retail Box Packaging & Print'
  },
  {
    id: 'test-3',
    clientNameAr: 'محمد علي',
    clientNameEn: 'Mohamed Ali',
    companyAr: 'المدير العام لنادي إيليت الرياضي',
    companyEn: 'General Manager at Elite Fitness Club',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
    rating: 5,
    reviewAr: 'فريق عمل متكامل من المصممين والمهندسين. صمموا لنا واجهة الكلادينج الديناميكية مع إضاءة آر جي بي المبرمجة فظهر النادي بقوة في الشارع ليلاً وجعل الواجهة مادة إعلانية استثنائية على وسائل التواصل. نوصي بهم بقوة كبرى.',
    reviewEn: 'A stellar multidisciplinary team of designers and fabricators. They built our dynamic metal facade with programmed RGB lights which literally dominates the street view at night. Huge upgrade to our fitness brand.',
    projectTypeAr: 'واجهة خارجية حديدية وإضاءة تجميلية',
    projectTypeEn: 'Dynamic Metal Facade & LED Signs'
  }
];

export const TRUST_VALUES = [
  {
    id: 'quality',
    titleAr: 'جودة استثنائية متميزة',
    titleEn: 'Premium Quality Materials',
    descAr: 'نستخدم أفضل ألواح الكلادينج المعتمدة المقاومة للحريق والاستانلس عيار 304 المقاوم للصدأ والأتربة والأمطار.',
    descEn: 'We source certified class fireproof ACP sheets, original 304-grade stainless steel & premium acrylic components.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'engineering',
    titleAr: 'دقة هندسية في الحسابات',
    titleEn: 'Engineering Precision',
    descAr: 'نقوم بحساب مقاومة أحمال الرياح، وتوزيع الأحمال الهيكلية بدقة فائقة لمنع اهتزاز أو سقوط اللافتات والواجهات.',
    descEn: 'Strict structural calculations for wind loads, structural framing weight balancing, and professional structural drawings.',
    iconName: 'Compass'
  },
  {
    id: 'creative',
    titleAr: 'تصميمات إبداعية مبهرة',
    titleEn: 'Creative Excellence',
    descAr: 'فريقنا من المصممين المحترفين يقدم لك محاكاة ثلاثية الأبعاد مطابقة للواقع لتشاهد مشروعك بوضوح قبل التنفيذ الفعلي.',
    descEn: 'Our design house drafts high-end spatial renderings simulating actual light refractions before you pay a penny.',
    iconName: 'Lightbulb'
  },
  {
    id: 'tech',
    titleAr: 'تكنولوجيا تصنيع متميزة',
    titleEn: 'Advanced Technology',
    descAr: 'أحدث ماكينات قطع الألياف ليزر، ثني المعادن الهيدروليكي الآلي، الحفر بنظام سي إن سي بدقة مليمترية.',
    descEn: 'Equipped with heavy fiber laser cutting lines, automated steel bending systems, and high speed multi-axis CNC routers.',
    iconName: 'Cpu'
  },
  {
    id: 'installation',
    titleAr: 'تركيب احترافي آمن',
    titleEn: 'Industrial Installation',
    descAr: 'أوناش رافعة للمرتفعات الكبيرة وفريق فنيين مجهزين بأحدث أدوات السلامة والربط الكيميائي لثبات فائق الدوام.',
    descEn: 'Our certified installation crew operates heavy cranes, scaffolding and uses heavy-grade epoxy anchors for supreme security.',
    iconName: 'Wrench'
  },
  {
    id: 'support',
    titleAr: 'دعم فني وصيانة مستمرة',
    titleEn: 'Reliable After-Sales Support',
    descAr: 'تقديم خدمات الصيانة الدورية الفورية لشبكات الإضاءة والترانسات لضمان بقائها مشرقة طوال اليوم وبضمان حقيقي.',
    descEn: 'We provide active periodic inspection calls and full structural/illuminative warranty to ensure uninterrupted glow.',
    iconName: 'Headphones'
  }
];

export const FAQS_CO_DATA: FaqItem[] = [
  {
    questionAr: 'ما هي المواد المستخدمة في تصنيع الحروف البارزة ثلاثية الأبعاد؟',
    questionEn: 'What materials do you use for manufacturing 3D architectural letters?',
    answerAr: 'نحن نستخدم الاستانلس ستيل (Stainless Steel 304) العيار الثقيل المقاوم للصدأ بالكامل والذي يأتي بلمسة فضية أو ذهبية أو روز جولد ومتاح بأسطح لامعة أو مصقولة مطفية (Hairline/Brushed)، بالإضافة إلى الأكريليك التايواني النقي المعالج بامتياز ضد الأشعة فوق البنفسجية لضمان عدم الاصفرار أو التصلب مع مرور الزمن والنظام الضوئي ليد كوري عالي الكفاءة.',
    answerEn: 'We utilize premium-grade 304 stainless steel in various refined finishes (Mirror polished, brushed, or hairline in golden, silver, or rose gold hue). We couple this with pure non-recycled cast acrylic sheet technology designed against severe Egyptian UV rays to avoid discoloration, illuminated via original energy-saving Samsung LED modules.'
  },
  {
    questionAr: 'هل ألواح الكلادينج التي تنفذها يافطة مقاومة للحريق؟',
    questionEn: 'Are the ACP cladding panels used by YAFTA certified fire-resistant?',
    answerAr: 'نعم، في يافطة نستخدم حصرياً ألواح كلادينج ألومنيوم ذات جودة فائقة معتمدة من معامل الدفاع المدني ومصنفة كمقاومة للحريق بدرجة (B1 / A2)، ومغلفة بدهان الـ PVDF المقاوم المميز للشمس والخدش من كبرى المصانع الوطنية والعالمية وبضمان حقيقي يمتد لـ 10 سنوات ضد تغير اللون أو التآكل.',
    answerEn: 'Absolutely. For commercial facades, we strictly install advanced Aluminum Composite Panels (ACP) evaluated under civil defense codes. These feature special non-combustible core layers (classified B1/A2 Fire-Resistant) laminated under PVDF coating technology offering a structural warranty of up to 10 years against peeling or chalking.'
  },
  {
    questionAr: 'كم يستغرق تصميم وتنفيذ لافتة أو واجهة جديدة بالمتوسط؟',
    questionEn: 'How long does it typically take to design & execute a new facade or sign?',
    answerAr: 'يستغرق التصميم والمحاكاة ثلاثية الأبعاد من يومين إلى 4 أيام عمل لموافقة العميل. أما التصنيع الفني داخل ورشتنا والتركيب في الموقع فإنه يتراوح بالمتوسط للوحات العادية والواجهات المتوسطة من 7 إلى 14 يوم عمل حسب حجم المقاسات وارتفاع المبنى وطريقة التثبيت.',
    answerEn: 'Bespoke CAD & 3D visualizations take 2 to 4 business days. Following client approval, specialized fabrication in our local mechanical plant and meticulous site installation on scaffolding ranges from 7 to 14 business days depending on spatial height and weather coefficients.'
  },
  {
    questionAr: 'هل يافطة تقدم خدماتها خارج القاهرة وضمن المحافظات المصرية؟',
    questionEn: 'Does YAFTA deliver and install sign projects outside Cairo in other governorates?',
    answerAr: 'بكل تأكيد! نحن فخورون بتوصيل وتركيب لافتات وواجهات كلادينج لعملائنا في جميع محافظات جمهورية مصر العربية (شمال وجنوب سيناء، الإسكندرية، الساحل الشمالي، الدلتا، وصعيد مصر بالكامل)، مدعومين بأسطول شاحنات مجهز وأوناش آلية مخصصة للتحميل الآمن والتركيب الهندسي الدقيق.',
    answerEn: 'Yes! We actively fabricate and transport high-end signage and cladding setups to clients across all Egyptian governorates (Alexandria, North Coast, Delta, Sinai, Upper Egypt, and the Red Sea). Our fully equipped trucks and portable crane systems ensure professional damage-free logistics and safe construction.'
  },
  {
    questionAr: 'كيف تضمنون سلامة التوصيل والتركيبات ضد السقوط؟',
    questionEn: 'How do you guarantee the structural safety of heavy facade signs?',
    answerAr: 'تخضع جميع مشروعاتنا الهيكلية واللوحات الضخمة لدراسة هندسية كاملة بواسطة مهندسينا، لتحديد نقاط التثبيت وعيار قطاعات الحديد ونوع المسامير الميكانيكية والكيميائية (Anchors) اللازمة لتتحمل ضغط الرياح العاصف والهزات لضمان أقصى مستويات الأمان العام للشارع والمشروع.',
    answerEn: 'Safety is our absolute paramount. All hanging projects undergo meticulous engineering wind load calculations under stormy conditions. We design dedicated chemical anchoring bolt structures and reinforced framework plates to verify zero movement or detachment, keeping bystanders and assets perfectly secure.'
  }
];

// Price calculator settings
export const CALCULATOR_PRICE_RULES = {
  signageTypes: [
    { id: 'acrylic', nameAr: 'أكريليك مضيء بالكامل', nameEn: 'Fully Illuminated Acrylic 3D', pricePerCmA: 12, pricePerCmEn: '$1.2/cm height' },
    { id: 'stainless-backlit', nameAr: 'استانلس مضيء خلفي (هالو)', nameEn: 'Stainless Steel Backlit Halo', pricePerCmA: 15, pricePerCmEn: '$1.5/cm height' },
    { id: 'acrylic-stainless', nameAr: 'استانلس مفرغ أكريليك مضيء', nameEn: 'Stainless Acrylic Front-lit Hybrid', pricePerCmA: 18, pricePerCmEn: '$1.8/cm height' },
    { id: 'neon-flex', nameAr: 'نيون فليكس على أكريليك شفاف', nameEn: 'Neon Flex on Clear Acrylic', pricePerCmA: 9, pricePerCmEn: '$0.9/cm height' },
    { id: 'flat-sign', nameAr: 'يافطة فليكس بوكس مضيئة تقليدية', nameEn: 'Classic Illuminated Flexbox', pricePerCmA: 5, pricePerCmEn: '$0.5/cm height' }
  ],
  claddingBrands: [
    { id: 'premium-korean', nameAr: 'كلادينج كوري معتمد مقاوم للحريق B1', nameEn: 'Premium Korean Fireproof ACP B1', basePricePerSqm: 1800, descAr: 'الأفضل للمباني الضخمة والمولات الفاخرة بضمان 10 سنوات', descEn: 'Best for premium malls & large towers' },
    { id: 'national-brands', nameAr: 'كلادينج محلي ممتاز دهان PVDF', nameEn: 'National Premium PVDF Brand (Egypt)', basePricePerSqm: 1300, descAr: 'توازن رائع بين السعر والجودة الفائقة للمحلات التجارية', descEn: 'Superior price-quality ratio for retail stores' },
    { id: 'standard-shop', nameAr: 'كلادينج اقتصادي للاستخدامات المتوسطة', nameEn: 'Standard Shop Cladding (Budget)', basePricePerSqm: 950, descAr: 'مناسب للوحات الإعلانية البسيطة والواجهات الداخلية ملمس مرن', descEn: 'Suitable for basic advertising panels' }
  ],
  printingTypes: [
    { id: 'biz-cards', nameAr: 'كروت شخصية فاخرة (سلوفان مطفي + بصمة ذهبية)', nameEn: 'Luxury Business Cards (Foil + Soft touch)', basePrice: 250, unitAr: 'علبة (100 كارت)', unitEn: 'Box (100 cards)' },
    { id: 'flyers', nameAr: 'فلاير وبروشور ألوان وجهين ورق 150 جرام', nameEn: 'Color Flyers Double-Sided 150g', basePrice: 1200, unitAr: 'ألف فلاير عالي الجودة', unitEn: '1000 Premium flyers' },
    { id: 'catalogs', nameAr: 'كتالوج كتيب 16 صفحة غلاف سميك سلوفان', nameEn: 'Corporate Catalogs 16-pages thick cover', basePrice: 4500, unitAr: 'مية كتالوج فاخر', unitEn: '100 Deluxe Catalogs' },
    { id: 'boxes', nameAr: 'علب كرتونية مخصصة للمنتجات ديجيتال', nameEn: 'Premium Custom Product Packaging Boxes', basePrice: 3500, unitAr: 'مائتان علبة مطبوعة ومجهزة', unitEn: '200 printed & molded boxes' }
  ]
};
