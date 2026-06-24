import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, BadgePercent, Clock, ShieldCheck, Tag, Zap, ArrowRight, Check, Award } from 'lucide-react';
import { PageId } from '../types';

interface OfferPackage {
  id: string;
  nameAr: string;
  nameEn: string;
  badgeAr: string;
  badgeEn: string;
  oldPrice: number;
  newPrice: number;
  discount: string;
  descAr: string;
  descEn: string;
  featuresAr: string[];
  featuresEn: string[];
  isPopular?: boolean;
}

interface Props {
  setActivePage: (page: PageId) => void;
  isAr: boolean;
}

const PREMIUM_OFFERS: OfferPackage[] = [
  {
    id: 'off-bronze',
    nameAr: 'باقة المحلات الناشئة 🏪',
    nameEn: 'Emerging Shop Starter 🏪',
    badgeAr: 'العرض الأكثر مبيعاً للأنشطة الصغيرة',
    badgeEn: 'Best Seller for Small Retail',
    oldPrice: 12000,
    newPrice: 8500,
    discount: '30% خصم حقيقي',
    descAr: 'تصميم وتصنيع لافتة كاملة للمحلات التجارية والشركات بمواصفات متينة واقتصادية لمساعدة رياديي الأعمال.',
    descEn: 'Design and fabrication of standard commercial shop signs with weather-resistant finishes and high-efficiency lighting.',
    featuresAr: [
      'لافتة بطول ٣ متر أكريليك بارز أو فلكس مضيء',
      'إضاءة ليد كورية سامسونج موفرة للطاقة بالكامل',
      'شاسيه حديد معالج ضد الصدأ والرياح الشديدة',
      'معاينة فنية مجانية ورفع المقاسات بالليزر',
      'ضمان معتمد ضد عيوب التصنيع لمدة سنة'
    ],
    featuresEn: [
      '3-meter high-efficiency illuminated sign face',
      'Samsung LED Modules preinstalled with rainy wiring',
      'Rust-proof hollow steel framework core skeleton',
      'Free physical laser measurements on-site',
      'Full 1-Year manufacturing defect insurance warranty'
    ]
  },
  {
    id: 'off-silver',
    nameAr: 'باقة الواجهة الفخمة والكلادينج ✨',
    nameEn: 'Elite Showroom Facade ✨',
    badgeAr: 'عرض التميز البصري والواجهات الفخمة',
    badgeEn: 'Absolute Premium Cladding Facade',
    oldPrice: 48000,
    newPrice: 38000,
    discount: 'وفّر 10,000 ج.م فورا',
    descAr: 'تحويل كامل لواجهة معرضك أو شركتك بأفخر ألواح الكلادينج المقاوم للحريق مع تركيب حروف أكريليك تايواني ثلاثية الأبعاد بارزة.',
    descEn: 'Complete transformation of your showroom facade using fireproof aluminum cladding sheets integrated with 3D acrylic signage.',
    featuresAr: [
      'ألواح كلادينج ألومنيوم معزول سمك ٤ مم مقاوم للحريق',
      'حروف بارزة أكريليك ليزر مضيئة بطول واجهة المعرض',
      'أحرف ستانلس ستيل مصقول ليزر نقي مقاوم للصدأ ٣٠٤',
      'محولات كهرباء تايوانية مضادة للأمطار والغبار IP67',
      'تركيب فني احترافي عالي الارتفاع مع الالتزام بالسلامة',
      'ضمان ممتد معتمد بالكامل لمدة ٣ سنوات'
    ],
    featuresEn: [
      '4mm fireproof insulated aluminum cladding paneling',
      'Laser-cut 3D illuminated acrylic typography titles',
      'Polished grade 304 anti-acid stainless steel trims',
      'IP67 rainproof heavy-duty dual converters',
      'High-altitude custom bracket rigging installation',
      'Comprehensive 3-Year structured warranty support'
    ],
    isPopular: true
  },
  {
    id: 'off-gold',
    nameAr: 'الهوية المؤسسية الكبرى 💎',
    nameEn: 'Enterprise Corporate Identity 💎',
    badgeAr: 'للمستشفيات والشركات الكبرى والفنادق',
    badgeEn: 'Mega Signage & Cladding Suite',
    oldPrice: 120000,
    newPrice: 95000,
    discount: 'باقة التوفير المؤسسي',
    descAr: 'تطوير شامل وموحد لجميع اللافتات التعريفية، لافتات الطوارئ، لافتات الأقسام الداخلية واللافتات الضخمة الخارجية للشركات والمصانع.',
    descEn: 'Full-scale architectural branding overhaul including monumental pylon signs, dynamic exterior panels, and interior directories.',
    featuresAr: [
      'لافتة بيلورد أو بايلون عملاقة بارتفاع ٦ أمتار في المدخل الرئيسي',
      'تركيب وتصنيع حتى ٢٠ لافتة مكتبية وحائطية داخلية أكريليك فاخر',
      'أنظمة إضاءة ليد مدمجة ذكية قابلة للتحكم التلقائي مع الغروب',
      'إشراف هندسي متكامل من مهندسين معتمدين وحسابات أحمال الرياح',
      'مخططات هندسية وصور ثلاثية الأبعاد (3D Renders) للتصميم مجانا',
      'ضمان VIP ذهبي شامل صيانة مجانية دورية لمدة ٥ سنوات'
    ],
    featuresEn: [
      '6-meter monument entrance pylon or billboard sign',
      'Up to 20 luxury laser-etched interior office directories',
      'Smart photocell-triggered automated LED controllers',
      'Full engineering wind-load calculation & structural signoff',
      'Complimentary professional 3D CAD design renderings',
      '5-Year Golden VIP warranty including scheduled cleanings'
    ]
  }
];

export default function Offers({ setActivePage, isAr }: Props) {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);

  const handleApply = (offer: OfferPackage) => {
    // Navigate to contact and fill pricing
    setSelectedOffer(offer.id);
    alert(isAr 
      ? `لقد اخترت "${offer.nameAr}". جاري تحويلك إلى نافذة عروض الأسعار لتأكيد طلبك وتخصيصه!` 
      : `You selected "${offer.nameEn}". Redirecting you to checkout to confirm details!`);
    setActivePage('contact');
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-950/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-96 h-96 bg-gold-505/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* TOP INTRO */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-505/20 bg-gold-950/20 text-gold-505 text-xs font-black uppercase tracking-widest">
            <BadgePercent className="w-4 h-4 animate-bounce-slow" />
            <span>{isAr ? 'عروض حصرية وخصومات صيفية محدودة' : 'Exclusive Premium Seasonal Packages'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fffbf0] via-[#e5c060] to-[#aa7c11]">
            {isAr ? 'العروض الحصرية والهويات المتكاملة' : 'Branding Facades & Signage Offers'}
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {isAr
              ? 'اختر باقة التصنيع المثالية التي تناسب مشروعك بأسعار مخصصة وخصومات فورية تصل إلى ٣٠٪ لفترة محدودة. نلتزم بفخامة المواصفات وبضمان معتمد.'
              : 'Unlock corporate-grade structural branding at optimized pricing. Compare our starter and elite packages, designed to give your company maximum visual impact.'}
          </p>
        </div>

        {/* PROMO TIMER BANNER */}
        <div className="bg-gradient-to-r from-gold-950/80 via-neutral-950 to-gold-950/80 border border-gold-500/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-right relative overflow-hidden flex-row-reverse">
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-gold-505/5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
          
          <div className="flex gap-4 items-center flex-row-reverse">
            <div className="w-12 h-12 rounded-xl bg-gold-950/80 border border-gold-505/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-gold-505 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-gold-400 font-bold block uppercase tracking-wider">
                {isAr ? 'ينتهي العرض قريباً جداً' : 'Limited Time Offer Closing Soon'}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                {isAr ? 'الخصم الخاص بقطاعات التأسيس والكلادينج متاح حالياً' : 'Signage Overhauls Up To 30% Off'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-center">
            {[
              { labelAr: 'أيام', labelEn: 'Days', val: '04' },
              { labelAr: 'ساعات', labelEn: 'Hrs', val: '18' },
              { labelAr: 'دقائق', labelEn: 'Mins', val: '42' },
              { labelAr: 'ثواني', labelEn: 'Secs', val: '55' }
            ].map((time, idx) => (
              <div key={idx} className="bg-neutral-950 border border-gold-500/10 px-3.5 py-2.5 rounded-xl min-w-[60px] sm:min-w-[70px]">
                <strong className="text-xl sm:text-2xl font-black text-gold-505 font-mono block leading-none">{time.val}</strong>
                <span className="text-[9px] text-zinc-500 uppercase mt-1 block">{isAr ? time.labelAr : time.labelEn}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PACKAGE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PREMIUM_OFFERS.map((pkg) => (
            <motion.div
              key={pkg.id}
              whileHover={{ y: -8 }}
              className={`relative flex flex-col justify-between bg-neutral-950 border rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden ${
                pkg.isPopular 
                  ? 'border-gold-505 shadow-[0_15px_40px_-15px_rgba(229,192,96,0.15)] ring-1 ring-gold-505/30' 
                  : 'border-gold-500/10'
              }`}
            >
              {/* Popularity Badge */}
              {pkg.isPopular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-gold-505 to-gold-400 text-black font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-md">
                  {isAr ? 'الأكثر تميزاً وطبيعةً' : 'Highly Recommended'}
                </div>
              )}

              <div className="space-y-6">
                
                {/* Title & Badge */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-gold-400 uppercase tracking-widest block bg-gold-950/30 border border-gold-505/10 px-2.5 py-1 rounded w-fit">
                    {isAr ? pkg.badgeAr : pkg.badgeEn}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{isAr ? pkg.nameAr : pkg.nameEn}</h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{isAr ? pkg.descAr : pkg.descEn}</p>
                </div>

                {/* Price Matrix */}
                <div className="py-4 border-y border-neutral-900/60 flex items-center justify-between flex-row-reverse text-right">
                  <div>
                    <span className="text-[10px] text-zinc-500 line-through block leading-none mb-1">
                      {pkg.oldPrice.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                    </span>
                    <strong className="text-3xl font-black text-gold-305 text-gold-300 font-mono">
                      {pkg.newPrice.toLocaleString()}
                    </strong>
                    <span className="text-xs text-neutral-400 font-semibold mr-1">{isAr ? 'ج.م' : 'EGP'}</span>
                  </div>
                  <span className="bg-emerald-950 border border-emerald-500/20 text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-full">
                    {pkg.discount}
                  </span>
                </div>

                {/* Features Checklists */}
                <div className="space-y-3.5 text-right flex flex-col">
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
                    {isAr ? 'مشتملات ومواصفات الباقة المعتمدة:' : 'Features & Rigging Included:'}
                  </h4>
                  <ul className="space-y-2.5 text-xs">
                    {(isAr ? pkg.featuresAr : pkg.featuresEn).map((feat, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start flex-row-reverse text-right">
                        <div className="w-4 h-4 rounded-full bg-gold-505/10 border border-gold-505/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-gold-505 stroke-[3]" />
                        </div>
                        <span className="text-zinc-300 leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Action Apply Button */}
              <div className="pt-8">
                <button
                  onClick={() => handleApply(pkg)}
                  className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    pkg.isPopular
                      ? 'bg-gradient-to-r from-gold-300 via-gold-505 to-gold-400 text-black hover:from-gold-200 hover:to-gold-300'
                      : 'bg-neutral-900 hover:bg-neutral-850 text-gold-400 border border-gold-550/20 hover:text-white'
                  }`}
                >
                  <span>{isAr ? 'احجز الباقة الآن 📝' : 'Secure Offer Package 📝'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* COMPARISON AND TRUST SECTION */}
        <div className="p-8 bg-neutral-950 border border-gold-500/10 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden flex-row-reverse">
          <div className="space-y-4 max-w-xl text-right">
            <h3 className="text-lg font-black text-white flex items-center gap-2 justify-end">
              <span>{isAr ? 'لماذا تختار باقات التصنيع من يافطة؟' : 'The YAFTA Professional Standard'}</span>
              <Award className="w-5 h-5 text-gold-505" />
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isAr
                ? 'لا نستخدم خامات تجارية رخيصة. نعتمد حصراً على الأكريليك عالي النقاء المصنوع بالصب والتلوين المقاوم للاصفرار، محولات تيار مطرية معتمدة، وأنظمة ليد كورية أصلية تدوم حتى ٥٠ ألف ساعة تشغيل مستمر مع توفير مذهل للطاقة الكهربية.'
                : 'Unlike cheap commercial options, we only source high-grade Taiwanese acrylics, fire-retardant structural aluminum sheets, waterproof IP67 transformers, and original Samsung LED chips engineered for a 50,000-hour operational lifespan.'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 shrink-0 text-center">
            <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl min-w-[120px]">
              <strong className="text-2xl font-black text-gold-505 block leading-none font-mono">100%</strong>
              <span className="text-[10px] text-zinc-500 uppercase mt-1.5 block">{isAr ? 'رضا العملاء' : 'Client Satisfaction'}</span>
            </div>
            <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl min-w-[120px]">
              <strong className="text-2xl font-black text-gold-505 block leading-none font-mono">+12K</strong>
              <span className="text-[10px] text-zinc-500 uppercase mt-1.5 block">{isAr ? 'ساعات صيانة' : 'Rigging Hours'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
