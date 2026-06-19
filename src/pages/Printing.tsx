/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PageId } from '../types';
import { Sparkles, Check, Droplet, Layers, FileText, ArrowLeft, ArrowRight, Printer } from 'lucide-react';

interface Props {
  setActivePage: (page: PageId) => void;
  isAr: boolean;
}

export default function Printing({ setActivePage, isAr }: Props) {
  const printingSolutions = [
    {
      titleAr: 'العلب والتعبئة والتغليف المبتكر (Packaging)',
      titleEn: 'Deluxe Product Packaging & Rigid Boxes',
      descAr: 'تصميم وتصنيع علب المنتجات الكرتونية الفاخرة المقواة والعلب المنزلقة مع حشوات داخلية مخملية لحماية منتجك وإبرازه.',
      descEn: 'Design and automated production of rigid gift boxes, perfume packaging, sliding boxes, and cosmetic cases.',
      detailsAr: ['كرتون مقوى مستورد 2 مم مقاوم للاعوجاج', 'تأثير السلوفان المخملي لمس ناعم (Velvet)', 'متاح بحقائب ورقية مطابقة للهوية'],
      detailsEn: ['Heavy imported 2mm rigid binders', 'Velvet soft-touch laminations', 'Custom boutiques paper bags matching brand design']
    },
    {
      titleAr: 'كتالوجات وملفات تعريف الشركات الشاملة',
      titleEn: 'Corporate Profiles & High-End Catalogs',
      descAr: 'كتيبات ومجلات مطبوعة بأعلى دقة لتباين الألوان وسماكة ورق عالية مع تشطيب خياطة أو لحام حراري نقي.',
      descEn: 'Brilliant commercial booklet catalogs, annual folders, and sales brochures printed with precision CMYK calibration.',
      detailsAr: ['ورق كوشيه مستورد سميك 150 جرام إلى 350 جرام', 'تغطية سلوفان مطفي ومط لامع لحماية الأوراق', 'تجليد فاخر دبوس أو غراء حراري كوني'],
      detailsEn: ['Coated premium stock (150gsm to 350gsm)', 'Matte and gloss lamination for tear protection', 'Sewn-bound or high-strength perfect bound finishing']
    },
    {
      titleAr: 'تأثيرات البصمة الحرارية والورنيش الموضعي',
      titleEn: 'Premium Finishes: Spot UV & Golden Hot Foil',
      descAr: 'إضافة تأثيرات بصرية ساحرة عند اللمس تلفت الانتباه بقوة، مثل البصمة الذهبية والفضية والنحاسية البارزة والورنيش اللامع.',
      descEn: 'Luxury post-press embellishments: Raised Spot UV, metallic gold-foil hot stamping, and deep custom embossing.',
      detailsAr: ['بصمة مذهبة حرارية بالليزر (Hot Foil)', 'ورنيش بؤري لامع (Spot UV) بمستوى تحسسي عالي', 'حفر بارز للوغو والشعار لإحساس ملموس رائع'],
      detailsEn: ['High-resistance golden & silver thermal hot-foils', 'Tactile spot UV gloss coating', 'Convex/concave structural embossing options']
    }
  ];

  return (
    <div className="space-y-16 pb-16 font-sans">
      
      {/* 1. Page Title Hero */}
      <section className="text-center space-y-4 max-w-4xl mx-auto pt-8">
        <span className="text-xs font-bold tracking-[0.3em] text-gold-505 uppercase flex items-center justify-center gap-1.5">
          <Printer className="w-5 h-5 text-gold-505 animate-pulse" />
          <span>{isAr ? 'قطاع المطبوعات الاحترافية وعلم التعبئة' : 'SPECIALTY DIVISION: OFFSET MEDIA & PREMIUM PACKAGING'}</span>
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          {isAr ? 'جودة لا تُرى بمثابة أثر.. نمنح ورقك وسام الفخامة' : 'Preserving Color Fidelity & Tactile Grandeur in Print'}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {isAr 
            ? 'نحن ندرك في يافطة أن جودة علب التغليف والكتالوجات تعبر مباشرة عن قيمة منتجك. لذلك نستخدم أحدث خطوط طباعة هايدلبرغ الألمانية.' 
            : 'Uncompromised CMYK precision coupled with luxury post-press embellishments. We build rigid retail boxes and catalogs that demand premium shelf-space.'}
        </p>
      </section>

      {/* 2. Visual card grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {printingSolutions.map((sol, idx) => (
          <div 
            key={idx}
            className="bg-neutral-950 p-6 md:p-8 rounded-2xl border border-gold-500/10 hover:border-gold-505/30 transition-all duration-300 flex flex-col justify-between shadow-2xl"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gold-505">
                <Layers className="w-5 h-5 shrink-0" />
                <h3 className="text-lg md:text-xl font-extrabold text-white">
                  {isAr ? sol.titleAr : sol.titleEn}
                </h3>
              </div>
              
              <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                {isAr ? sol.descAr : sol.descEn}
              </p>

              <div className="space-y-2 pt-3 border-t border-gold-500/10">
                <span className="text-[10px] uppercase tracking-widest text-gold-300 font-bold block">
                  {isAr ? 'المميزات والمواصفات الورقية:' : 'Print specs & techniques:'}
                </span>
                <ul className="space-y-1.5">
                  {(isAr ? sol.detailsAr : sol.detailsEn).map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-1.5 text-xs text-neutral-400 font-sans">
                      <span className="w-1.5 h-1.5 bg-gold-505 rounded-full shrink-0"></span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-gold-500/10 text-xs text-gold-350 font-bold flex justify-between items-center bg-gold-950/20 px-3 py-2 rounded text-gold-300">
              <span>{isAr ? 'طباعة أوفست ألمانية بأعلى دقة' : 'Heidelberg offset machinery'}</span>
              <span>✨ {isAr ? 'جودة فاخرة' : 'Boutique Grade'}</span>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Materials Specs Block */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-neutral-950 p-6 md:p-8 rounded-2xl border border-gold-505/15 space-y-4 font-sans">
          <h4 className="text-base font-extrabold text-white flex items-center gap-2">
            <Droplet className="w-5 h-5 text-gold-505 shrink-0" />
            <span>{isAr ? 'خيارات الخامات والتشطيب المتوفرة للمطبوعات:' : 'Post-Press Finishes & Custom Textures:'}</span>
          </h4>
          <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
            {isAr 
              ? 'متاح لدينا في يافطة تشكيلة واسعة من الأوراق الفاخرة المستوردة مثل أوراق الفبريان الإيطالية، الكوشيه بلوزن مختلفة، وأوراق الكرافت البيئية. نوفر بصمات حرارية بالألوان الذهبية البراقة والذهبية النارية والفضية والنحاسية المطفية لتعطي كروتك أو علبتك هيبتها الخاصة.'
              : 'Our post-press shop accommodates an endless inventory of high-end cardstocks like Italian Fabriano, textured linen sheets, dynamic kraft boxes and high-gloss chromo layouts. Choose from various metallic embossing foils to maximize prestige.'}
          </p>
        </div>
      </section>

      {/* 4. Action CTA */}
      <section className="bg-neutral-950 p-8 rounded-2xl max-w-5xl mx-auto border border-gold-500/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-right">
          <h4 className="text-lg font-bold text-white">
            {isAr ? 'تريد طباعة كتالوج شركتك وتصميم العلب الفاخرة لمنتجك؟' : 'Ready to draft premium retail product box templates?'}
          </h4>
          <p className="text-xs text-neutral-400">
            {isAr ? 'أطلب عينات طباعة مجانية لتلمس وتتحقق من جودة الورق والملمس المخملي بأنفسكم.' : 'Speak with our press engineers to request physical stock samples.'}
          </p>
        </div>
        <button 
          onClick={() => setActivePage('contact')}
          className="px-6 py-3 bg-gradient-to-r from-gold-300 to-gold-505 hover:from-gold-200 text-neutral-950 font-black rounded-lg text-xs shrink-0 text-center uppercase tracking-wider"
        >
          {isAr ? 'ابدأ حساب كمية والأسعار 📦' : 'Request Print Estimate 📦'}
        </button>
      </section>

    </div>
  );
}
