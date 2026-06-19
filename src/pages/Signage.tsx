/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PageId } from '../types';
import { Sparkles, Check, Info, ShieldCheck, Mail, ArrowLeft, ArrowRight, Table } from 'lucide-react';

interface Props {
  setActivePage: (page: PageId) => void;
  isAr: boolean;
}

export default function Signage({ setActivePage, isAr }: Props) {
  const signageTypes = [
    {
      titleAr: 'لافتات LED الموفرة للطاقة',
      titleEn: 'Eco-Friendly High-Glow LED Signs',
      descAr: 'تتميز بسطوع قوي للغاية يجتذب الأنظار لمئات الأمتار مع كفاءة طاقة قصوى وعزل مائي معتمد.',
      descEn: 'Exceptional visual luminance optimized via micro Korean LEDs, delivering zero shadow spots and rain resistance.',
      materialsAr: ['مادة الأكريليك التايواني الفاخر', 'ترانسات طاقة معتمدة مقاومة للرطوبة', 'صمامات ليد كورية بضمان 3 سنوات'],
      materialsEn: ['Pure 100% Cast Acrylic sheets', 'IP67 Weatherproof certified power drivers', 'Original Samsung high-luminance LEDs']
    },
    {
      titleAr: 'الحروف البارزة الاستانلس ستيل الفاخر',
      titleEn: 'Luxury 3D Stainless Steel Lettering',
      descAr: 'مصنوعة من الفولاذ المقاوم للصدأ عيار 304 السميك، بلمسات مذهبة مرآتية أو فضية مصقولة هير لاين فخمة.',
      descEn: 'Bespoke dimensional characters folded with fiber lasers from non-magnetic 304 structural steel plates.',
      materialsAr: ['فولاذ ستانلس ذهبي مرآتي 1.2 مم', 'لحام غاز الأرجون غير المرئي كلياً', 'متاحة بلمسة Brushed مطفية كلاسيكية'],
      materialsEn: ['Mirror flat gold 1.2mm grade 304 steel', 'Argon-welded hidden joints', 'Available in classic brushed finish']
    },
    {
      titleAr: 'لافتات المولات الضخمة والشركات الكبيرة',
      titleEn: 'Corporate Wayfinding & Large-Scale Mall Signage',
      descAr: 'حلول إرشادية وتوجيهية متكاملة للمباني الإدارية، لافتات البوابات (Pylons) المرتفعة لمسافات شاهقة بتركيب آمن.',
      descEn: 'Industrial floor directories, double-sided signposts, highway totems, and monumental architectural installations.',
      materialsAr: ['هياكل حديدية ثقيلة مطلية ضد عهوامل الصدأ', 'تثبيت بمسامير كيميائية بالخرسانة', 'عزل كهربائي كامل لمخاطر الصواعق والمطر'],
      materialsEn: ['Heavy-gauge structural iron skeleton with rust treatment', 'Structural chemical anchor fixing', 'Integrated surge protections']
    },
    {
      titleAr: 'صناديق لوحات الفلكس المضيئة (Flex Box)',
      titleEn: 'Vivid Backlit & Frontlit Flex Signposts',
      descAr: 'يافطات فليكس عريضة مطبوعة بأحدث ماكينات الطباعة اليابانية دقة للألوان والتباين الساطع بالنهار والليل.',
      descEn: 'Vibrant graphic backdrops printed on heavy high-tensile vinyl fabric with premium internal light-box framing.',
      materialsAr: ['قماش بنر فلكس ألماني ممتد ومقاوم للرياح', 'حوامل إضاءة ليد موحدة التوزيع الداخلي', 'صندوق لوحة ألومنيوم مقاوم للصدمات'],
      materialsEn: ['German high-tensile flex fabric', 'Uniform light diffusion grid', 'Shock-proof aluminum profile structure']
    }
  ];

  return (
    <div className="space-y-16 pb-16 font-sans">
      
      {/* 1. Category Title Hero */}
      <section className="text-center space-y-4 max-w-4xl mx-auto pt-8">
        <span className="text-xs font-bold tracking-[0.3em] text-gold-505 uppercase">
          {isAr ? 'قطاع اللافتات والحروف البارزة' : 'SPECIALTY DIVISION: 3D RECEPTIONS & OUTDOOR LOGOS'}
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          {isAr ? 'لافتات تضيء نجاح علامتك وتتحمل العوامل الجوية' : 'Certified Signs Built for Extreme Outdoor Conditions'}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {isAr 
            ? 'نحن نوفر تصميم وتصنيع لافتات استقبال مكاتب فخمة ولوحات مباني عملاقة باستخدام أحدث أدوات التشكيل لضمان وضوح كامل وصمود طيلة سنوات.' 
            : 'Whether a custom corporate reception logo or structural pylons mounted on highway pillars, YAFTAs signs remain perfectly operational through wind, sun, and sand.'}
        </p>
      </section>

      {/* 2. Visual list of Signage Types */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {signageTypes.map((type, idx) => (
          <div 
            key={idx}
            className="bg-neutral-950 p-6 md:p-8 rounded-2xl border border-gold-500/10 hover:border-gold-505/30 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gold-505">
                <Sparkles className="w-5 h-5 shrink-0" />
                <h3 className="text-lg md:text-xl font-extrabold text-white">
                  {isAr ? type.titleAr : type.titleEn}
                </h3>
              </div>
              <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                {isAr ? type.descAr : type.descEn}
              </p>

              {/* Materials bullets tag */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-bold text-gold-300 uppercase block tracking-wider">
                  {isAr ? 'المواد وجودة المكونات المستخدمة:' : 'Structure & Material Specs:'}
                </span>
                <ul className="grid grid-cols-1 gap-1.5">
                  {(isAr ? type.materialsAr : type.materialsEn).map((mat, mIdx) => (
                    <li key={mIdx} className="flex items-center gap-1.5 text-xs text-neutral-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-505 shrink-0"></span>
                      <span>{mat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-gold-500/10 mt-6 text-xs flex justify-between items-center text-neutral-400 font-sans">
              <span>{isAr ? 'عزل مائي معتمد IP68' : 'IP68 Certified System'}</span>
              <span className="text-gold-505 font-bold">{isAr ? 'عمر طويل مضمون' : 'Extended lifespan'}</span>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Detailed technical specification chart */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-neutral-950 rounded-2xl border border-gold-500/10 overflow-hidden">
          <div className="p-5 md:p-6 bg-neutral-900/40 border-b border-gold-500/10 flex items-center justify-between">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Table className="w-5 h-5 text-gold-505" />
              <span>{isAr ? 'مقارنة فنية هامة للحروف البارزة:' : 'Metal Grade COMPARATIVE CHART:'}</span>
            </h4>
            <span className="text-[10px] bg-gold-950/80 text-gold-300 font-bold px-2.5 py-1 rounded border border-gold-505/20 uppercase">
              {isAr ? 'مستند الجودة الفني' : 'Technical Sheet'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right text-neutral-300 divide-y divide-neutral-900">
              <thead className="bg-neutral-900/60 text-gold-300 font-bold">
                <tr>
                  <th className="px-4 py-3">{isAr ? 'النوع والمقارنة' : 'Sign Type'}</th>
                  <th className="px-4 py-3">{isAr ? 'مادة السطح' : 'Face Material'}</th>
                  <th className="px-4 py-3">{isAr ? 'مادة الجوانب' : 'Side Return'}</th>
                  <th className="px-4 py-3">{isAr ? 'أسلوب الإضاءة' : 'Lighting Style'}</th>
                  <th className="px-4 py-3">{isAr ? 'مكان التركيب الأفضل' : 'Best Placement'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/30">
                <tr>
                  <td className="px-4 py-3 font-bold text-white">{isAr ? 'أكريليك مضيء' : 'All-Acrylic Light'}</td>
                  <td className="px-4 py-3">{isAr ? 'أكريليك تايواني 3 مم' : '3mm cast Acrylic'}</td>
                  <td className="px-4 py-3">{isAr ? 'بلاستيك معالج بي في سي' : 'Custom PVC profile'}</td>
                  <td className="px-4 py-3">{isAr ? 'إضاء إمامية ساطعة الكثافة' : 'Front-Lit core'}</td>
                  <td className="px-4 py-3 text-gold-505">{isAr ? 'صيدليات ومطاعم حديثة' : 'Pharmacies, cafes'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-white">{isAr ? 'استانلس مذهب هالو' : 'Stainless Halo Backlit'}</td>
                  <td className="px-4 py-3">{isAr ? 'ستانلس ستيل 304 مذهب' : '304 Gold Stainless'}</td>
                  <td className="px-4 py-3">{isAr ? 'ستانلس روز جولد عيار 304' : '304 Rose Stainless'}</td>
                  <td className="px-4 py-3">{isAr ? 'إضاءة خلفية هالة ناعمة خافتة' : 'Halo back-lit glow'}</td>
                  <td className="px-4 py-3 text-gold-505">{isAr ? 'مكاتب استقبال وعيادات فخمة' : 'Corporate reception, clinics'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-white">{isAr ? 'استانلس مفرغ مضيء' : 'Front-lit Cut Metal'}</td>
                  <td className="px-4 py-3">{isAr ? 'أكريليك مدمج بقلب استانلس' : 'Acrylic inlaid'}</td>
                  <td className="px-4 py-3">{isAr ? 'استانلس ستيل فضي أو مذهب' : 'Silver/Gold Stainless'}</td>
                  <td className="px-4 py-3">{isAr ? 'إضاء إمامية وخلفية مزدوجة' : 'Double face glow'}</td>
                  <td className="px-4 py-3 text-gold-505">{isAr ? 'مؤسسات كبرى ومولات تجارية' : 'Mall facades, HQ'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Contact action redirect */}
      <section className="bg-neutral-950 p-8 rounded-2xl max-w-5xl mx-auto border border-gold-500/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-right">
          <h4 className="text-lg font-bold text-white">
            {isAr ? 'احصل على محاكاة ثلاثية الأبعاد لشعارك مجاناً' : 'Request dynamic 3D simulation of your logo'}
          </h4>
          <p className="text-xs text-neutral-400">
            {isAr ? 'أرسل لنا ملف شعارك المتجه (Vector) لتشاهده مجسماً بالضوء والمظهر الذهبي.' : 'Upload your vector file to render actual metal material reflections.'}
          </p>
        </div>
        <button 
          onClick={() => setActivePage('contact')}
          className="px-6 py-3 bg-gradient-to-r from-gold-300 to-gold-505 hover:from-gold-200 text-neutral-950 font-black rounded-lg text-xs"
        >
          {isAr ? 'احسب المقاس والسعر والسرعة 💰' : 'Get quotation calculations 💰'}
        </button>
      </section>

    </div>
  );
}
