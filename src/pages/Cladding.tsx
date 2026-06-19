/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PageId } from '../types';
import { Sparkles, Check, ShieldAlert, Award, ChevronRight, HelpCircle, ArrowLeft, ArrowRight, Flame } from 'lucide-react';

interface Props {
  setActivePage: (page: PageId) => void;
  isAr: boolean;
}

export default function Cladding({ setActivePage, isAr }: Props) {
  const claddingFeatures = [
    {
      titleAr: 'ألواح ألومنيوم كلادينج مقاومة للحريق B1',
      titleEn: 'Fire-Resistant Structural ACP B1 Panels',
      descAr: 'تحتوي على نواة معدنية معالجة تبطئ وتمنع انتشار النيران والحرائق، معتمدة ومطابقة للمواصفات الحكومية.',
      descEn: 'Equipped with non-combustible material cores tested to withstand severe heat parameters safely.',
      specsAr: ['سمك لوح الكلادينج: 4 مم', 'طبقة دهان خارجية تيفلون PVDF', 'بضمان 10 سنوات ضد التقشر أو التآكل'],
      specsEn: ['Material thickness: 4mm panel', 'High durability PVDF coating treatment', '10-Year warranty against color fading']
    },
    {
      titleAr: 'الواجهات الزجاجية المتطورة (Glass Facades)',
      titleEn: 'Bespoke Architectural Glass Facades',
      descAr: 'دمج فخم لألواح الزجاج السيكوريت المقاوم للصدمات والزجاج المزدوج العازل للصوت والحرارة مع الواجهات.',
      descEn: 'Frameless glass panels, structural double-glazing, and energy-conserving thermal solutions.',
      specsAr: ['زجاج سيكوريت معالج 10 مم و12 مم', 'إكسسوارات وهياكل تثبيت من الألمنيوم السميك', 'عزل تام لتسريب الأتربة والأمطار والرياح'],
      specsEn: ['10mm & 12mm Tempered Security Glass option', 'Heavy structural aluminum anchors', '100% dust & waterproof sealants']
    },
    {
      titleAr: 'التشطيب المعماري الخارجي للمقر الإداري والشركات',
      titleEn: 'Total Commercial Building Facade Renovation',
      descAr: 'تحويل شامل للمباني القديمة والمتهالكة لتصبح لمستودعات الهيبة الإنشائية بواجهات مودرن فخمة بلمسات خطوط إضاءة خفية.',
      descEn: 'Converting classic masonry buildings into sleek futuristic masterpieces with clean modern metal geometries.',
      specsAr: ['تخطيط هيكل معدني مدعم بأوزان الأحمال', 'دمج مسلخات إضاءة بروفايل ليد ذكي', 'صيانة دورية ميسرة وقدرة تنظيف سهلة'],
      specsEn: ['Calculated steel structural backings', 'Programmed linear LED accent borders', 'Minimum maintenance operations required']
    }
  ];

  return (
    <div className="space-y-16 pb-16 font-sans">
      
      {/* 1. Page Title Hero */}
      <section className="text-center space-y-4 max-w-4xl mx-auto pt-8">
        <span className="text-xs font-bold tracking-[0.3em] text-gold-505 uppercase flex items-center justify-center gap-1.5">
          <Flame className="w-4.5 h-4.5 text-gold-505 animate-pulse" />
          <span>{isAr ? 'رواد واجهات الكلادينج والتشطيب الإنشائي' : 'SPECIALTY DIVISION: ARCHITECTURAL COMMERCIAL FACADES'}</span>
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          {isAr ? 'نكسو المباني بالفخامة والوقار الهندسي المتين' : 'Bespoke Metal Panel Cladding & Structural Rigging'}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {isAr 
            ? 'تنفذ يافطة مشروعات تكسية المباني والواجهات التجارية بواسطة مهندسين معتمدين لحساب أحمال الطبيعة، لتدوم دافئة وصامدة دون اهتزاز أو بهتان.' 
            : 'Unlocking architectural excellence using 4mm fireproof ACP sheets treated under international weather protection indexes. Perfect for headquarters and shops.'}
        </p>
      </section>

      {/* 2. Visual card grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {claddingFeatures.map((feat, idx) => (
          <div 
            key={idx}
            className="bg-neutral-950 p-6 md:p-8 rounded-2xl border border-gold-500/10 hover:border-gold-505/30 transition-all duration-300 flex flex-col justify-between shadow-2xl"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gold-550 text-gold-505">
                <Award className="w-5 h-5 shrink-0" />
                <h3 className="text-lg md:text-xl font-extrabold text-white">
                  {isAr ? feat.titleAr : feat.titleEn}
                </h3>
              </div>
              
              <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                {isAr ? feat.descAr : feat.descEn}
              </p>

              <div className="space-y-2 pt-3 border-t border-gold-500/10">
                <span className="text-[10px] uppercase tracking-widest text-gold-300 font-bold block">
                  {isAr ? 'المواصفات الهندسية الشاملة:' : 'Structural engineering guidelines:'}
                </span>
                <ul className="space-y-1.5">
                  {(isAr ? feat.specsAr : feat.specsEn).map((spec, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-1.5 text-xs text-neutral-400 font-sans">
                      <span className="w-1.5 h-1.5 bg-gold-505 rounded-full shrink-0"></span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-gold-500/10 text-xs text-gold-300 font-bold flex justify-between items-center bg-gold-950/20 px-3 py-2 rounded">
              <span>{isAr ? 'بضمان معتمد 10 سنوات' : '10-Year certified warranty'}</span>
              <span>🔥 {isAr ? 'كود حريق B1' : 'Code B1'}</span>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Safety and Quality Trust Block */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-neutral-950 p-6 md:p-8 rounded-2xl border border-gold-505/20 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-500/10 pb-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-gold-505" />
              <span>{isAr ? 'التزام يافطة الصارم بالأمان والسلامة:' : 'YAFTA Strict Structural Safety Compliance:'}</span>
            </h4>
            <span className="text-xs bg-red-950/90 text-red-200 px-3 py-1 rounded border border-red-500/30 font-bold uppercase tracking-wider">
              {isAr ? 'معايير الدفاع المدني' : 'Civil Defense Standards'}
            </span>
          </div>

          <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
            {isAr 
              ? 'تلتزم يافطة بإعداد دراسات هندسية دقيقة لحساب أحمال ومقاومات الرياح (Wind Load Calculations) قبل تثبيت أي جدار حديدي أو تغطية كلادينج للمباني الشاهقة. نستخدم حصرياً مسامير الربط الكيميائي من هيلتي والمثبتات الكربيرية ذات العزل الكهربائي الكلي لضمان حماية مطلقة للعابرين والممتلكات.' 
              : 'Our technical teams perform complete structural analysis simulating highwind loads at Cairo and sea-side governorates. We use specialized Hilti chemical anchors and structural heavy steel lattices to ensure 0% mechanical fatigue throughout the life cycle of the facade.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              { ar: 'عزل تام ضد الرطوبة ومياه الأمطار', en: '100% Waterproof moisture-barrier' },
              { ar: 'طلاء PVDF مقاوم للأشعة فوق البنفسجية', en: 'UV-resistant PVDF surface' },
              { ar: 'هياكل حديدية بسماكات فائقة مدعمة', en: 'Heavy-gauge reinforced structural steel frame' }
            ].map((safety, idx) => (
              <div key={idx} className="bg-neutral-900/60 p-3 rounded border border-gold-500/5 text-xs text-center font-sans text-neutral-300">
                ✔️ {isAr ? safety.ar : safety.en}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Action CTA */}
      <section className="bg-neutral-950 p-8 rounded-2xl max-w-5xl mx-auto border border-gold-500/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-right">
          <h4 className="text-lg font-bold text-white">
            {isAr ? 'هل تمتلك واجهة وتريد معاينتها وحساب تكلفة الكلادينج؟' : 'Have an existing storefront requiring architectural renovation?'}
          </h4>
          <p className="text-xs text-neutral-400">
            {isAr ? 'مهندسونا يزورون موقعك خلال 48 ساعة لرفع المقاييس الدقيقة وإعطائك مقترحاً مجانياً.' : 'Get a professional site audit and rendering layouts for your brand.'}
          </p>
        </div>
        <button 
          onClick={() => setActivePage('contact')}
          className="px-6 py-3 bg-gradient-to-r from-gold-300 to-gold-505 hover:from-gold-200 text-neutral-950 font-black rounded-lg text-xs shrink-0 text-center uppercase tracking-wider"
        >
          {isAr ? 'ابدأ حساب المقاسات والأسعار 🏢' : 'Calculate Cladding Estimations 🏢'}
        </button>
      </section>

    </div>
  );
}
