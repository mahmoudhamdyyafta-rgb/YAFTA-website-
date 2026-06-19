/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PageId, ServiceDetail } from '../types';
import { SERVICE_DETAILS, COMPANY_DETAILS } from '../data';
import { Sparkles, CheckCircle2, ChevronRight, Compass, Wrench, Shield, MessageSquare, ArrowLeft, ArrowRight, Layers, Cpu, Eye } from 'lucide-react';
import { useState } from 'react';

interface Props {
  setActivePage: (page: PageId) => void;
  isAr: boolean;
  servicesList?: ServiceDetail[];
}

export default function Services({ setActivePage, isAr, servicesList = SERVICE_DETAILS }: Props) {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const steps = [
    {
      num: '01',
      titleAr: 'المعاينة ورفع المقاييس',
      titleEn: 'Site Survey & Dimensioning',
      descAr: 'المعانية الميدانية المجانية وقياس الأطوال ومستويات الخرسانة بموقع المشروح على يد مهندسينا لحساب أدق الأرقام.',
      descEn: 'Free physical site audit checking concrete density, load-bearing capacities and structural laser measurements.'
    },
    {
      num: '02',
      titleAr: 'التصميم والمحاكاة ثلاثية الأبعاد',
      titleEn: '3D Photorealistic Design',
      descAr: 'نقوم بتخطيط وتصميم ورسم مجسم ثلاثي الأبعاد واقعي تماماً للواجهة والحروف فوتومتري لترى مشروعك واقعياً قبل التنفيذ.',
      descEn: 'Our designers model photorealistic 3D external simulations detailing day and night shadows.'
    },
    {
      num: '03',
      titleAr: 'التصنيع الميكانيكي بالليزر',
      titleEn: 'Precision Laser Cutting',
      descAr: 'قطع الألواح وتشكيل الاستانلس والأكريليك في مصانعنا بواسطة أحدث ماكينات ليزر الفايبر وثني الهيدروليك.',
      descEn: 'Highly rigorous manufacturing utilizing CNC routers, heavy hydraulic folders and fiber laser precision welding.'
    },
    {
      num: '04',
      titleAr: 'توصيل وتمديد شبكات الأمان',
      titleEn: 'Smart LED Integration',
      descAr: 'تثبيت ألواح سامسونج LED أصلية كورية على حوامل معزولة ضد المياه والرطوبة وتجربتها لـ 48 ساعة متواصلة.',
      descEn: 'Seeding high-efficacy Korean LED arrays with certified moisture isolation drivers tested under continuous load.'
    },
    {
      num: '05',
      titleAr: 'التركيب الميداني المهني',
      titleEn: 'Rigging & Safe Installation',
      descAr: 'التركيب في الموقع بواسطة الأوناش والمعدات الثقيلة تحت إشراف مهندسي سلامة ومثبتات كيميائية فائقة الصلابة.',
      descEn: 'Certified structural builders mount framework using chemical anchor bolts and premium heavy duty cranes.'
    }
  ];

  const tools = [
    { titleAr: 'ماكينات ليزر الفايبر (Fiber Laser)', titleEn: 'High-Power Fiber Laser Cutters', descAr: 'تعمل بقدرة جبارة لحفر وقطع كافة سمكات الاستانلس والنحاس بدقة ميكرومترية خالية من العيوب.', descEn: 'Cuts through thick stainless steel, brass, and aluminum plates effortlessly with high optical precision.' },
    { titleAr: 'ماكينات الراوتر CNC الكبيرة', titleEn: 'Heavy Industrial CNC Routers', descAr: 'لقطع وتشكيل ألواح الكلادينج، الخشب، والفيبر والأكريليك بمقاسات عملاقة وخطوط حادة.', descEn: 'High-speed cutting and shape formation of thick ACP cladding sheets, dense acrylics, and heavy board materials.' },
    { titleAr: 'ثنايات المعادن الآلية (Letter Bender)', titleEn: 'Robotic Steel Letter Benders', descAr: 'تساعد ورشتنا في تشكيل الحواف الخارجية لأعقد الحروف والكتابات المتصلة آلياً دون تشوه معدني.', descEn: 'Enables high precision dimensional turning of cursive calligraphy in stainless steel and titanium sheets.' },
    { titleAr: 'طاولات اللحام بالأرجون البارد', titleEn: 'Advanced Cold Argon Welding Stars', descAr: 'لحام المعادن بدون ترك أي حواف حادة أو بقع تشوه سوداء بالسطح الخارجي للحصول على ملمس ناعم كلياً.', descEn: 'Achieves seamless microscopic metal bonding without leaving singe marks or visible rough edges.' }
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* 1. Header Hero state */}
      <section className="text-center space-y-4 max-w-4xl mx-auto pt-8">
        <span className="text-xs font-bold tracking-[0.3em] text-gold-505 uppercase">
          {isAr ? 'كتالوج ومجالات أعمال يافطة' : 'SERVICES & EXECUTION PIPELINE'}
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
          {isAr ? 'من الفكرة للتصميم.. إلى الفولاذ الموشى بالذهب' : 'Engineered Visual Media & Signage'}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {isAr 
            ? 'نقدم مجموعة متكاملة من حلول الدعاية المادية والرقمية التي تمنح المقرات والشركات والمنتجات هيبة بصرية وموثوقية ملموسة.' 
            : 'Explore YAFTAs multidimensional services bridging structural heavy signages with premium print and high-converting modern digital storefronts.'}
        </p>
      </section>

      {/* 2. Detailed Grid of Core Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {servicesList.map((service) => (
          <div 
            key={service.id}
            onMouseEnter={() => setHoveredService(service.id)}
            onMouseLeave={() => setHoveredService(null)}
            className="bg-neutral-950 rounded-2xl overflow-hidden border border-gold-500/10 hover:border-gold-550 hover:border-gold-505/40 transition-all duration-300 flex flex-col justify-between shadow-2xl relative"
          >
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Header inside card */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-gold-300 tracking-wider uppercase font-bold bg-gold-950/80 px-2.5 py-1 rounded border border-gold-500/20">
                    {isAr ? 'قسم معتمد ومجهّز' : 'Certified Division'}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white pt-1.5">
                    {isAr ? service.titleAr : service.titleEn}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gold-950 flex items-center justify-center text-gold-505 border border-gold-505/20">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              {/* Cover layout */}
              <div className="relative h-48 rounded-xl overflow-hidden">
                <img 
                  src={service.image} 
                  alt={isAr ? service.titleAr : service.titleEn}
                  className="w-full h-full object-cover filter brightness-75 contrast-110 hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent"></div>
              </div>

              <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                {isAr ? service.descriptionAr : service.descriptionEn}
              </p>

              {/* Bullet list of features with check */}
              <div className="space-y-2 border-t border-gold-500/10 pt-4">
                <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-gold-300">
                  {isAr ? 'أهم تفاصيل ومزايا الخدمة:' : 'Operations & Standard Features:'}
                </h4>
                <ul className="grid grid-cols-1 gap-2.5">
                  {(isAr ? service.featuresAr : service.featuresEn).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-neutral-400 font-sans">
                      <CheckCircle2 className="w-4.5 h-4.5 text-gold-505 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Footer action */}
            <div className="p-6 md:px-8 md:pb-8 bg-neutral-900/60 border-t border-gold-500/10 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-[11px] text-neutral-400">
                {isAr ? 'ضمان ميكانيكي وحقيقي شامل' : '100% Structural Mechanical Warranty'}
              </span>
              <button 
                onClick={() => {
                  setActivePage(service.id as PageId);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-neutral-950 text-gold-505 hover:bg-gold-505 hover:text-black rounded-lg border border-gold-505/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <span>{isAr ? 'استكشف مشاريع هذا القطاع' : 'View Division Portfolio'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* 3. YAFTA WORKFLOW STAGES FLOW */}
      <section className="bg-neutral-950 border-t border-b border-gold-500/15 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold tracking-[0.3em] text-gold-505 uppercase">
              {isAr ? 'رحلة تنفيذ مشروعك الفريد' : 'OUR RIGID 5-STAGE PIPELINE'}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              {isAr ? 'آلية دقيقة لتسليم مشاريع خالية من العيوب' : 'Operational Precision: Concept to Heavy Sign Assembly'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
            {steps.map((st, index) => (
              <div 
                key={st.num}
                className="bg-neutral-900 rounded-xl p-6 border border-gold-500/5 hover:border-gold-505/20 transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl font-extrabold text-gold-505/25 mb-4 font-mono">{st.num}</div>
                  <h4 className="text-base md:text-lg font-bold text-white mb-2">{isAr ? st.titleAr : st.titleEn}</h4>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">{isAr ? st.descAr : st.descEn}</p>
                </div>
                
                {index < 4 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3.5 transform -translate-y-1/2 text-gold-505 opacity-30 z-20">
                    {isAr ? <ChevronRight className="w-6 h-6 rotate-180" /> : <ChevronRight className="w-6 h-6" />}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ADVANCED HEAVY MACHINERY IN-HOUSE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-[0.3em] text-gold-505 uppercase">
              {isAr ? 'قدراتنا التصنيعية الميكانيكية' : 'IN-HOUSE INDUSTRIAL FACTORIES'}
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              {isAr ? 'أحدث المعدات والماكينات لضمان أعلى المواصفات' : 'Rigid German & Korean Machinery'}
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-gold-950/60 text-gold-252 border border-gold-505/20 p-3 rounded-lg text-xs font-bold text-gold-300">
            <Cpu className="w-4 h-4 text-gold-505 shrink-0" />
            <span>{isAr ? 'ورشتنا مجهزة ومطابقة للمقاييس' : 'Industrial production grade'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tl, index) => (
            <div key={index} className="glass-panel rounded-2xl p-6 md:p-8 space-y-4 flex flex-col justify-between hover:border-gold-505/30 transition-all">
              <div className="space-y-2">
                <div className="text-[10px] text-gold-505 font-mono uppercase tracking-widest bg-gold-950 px-2 py-0.5 rounded border border-gold-500/25 inline-block">
                  {isAr ? 'معدة ثقيلة معتمدة' : 'Industrial Hardware'}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white">
                  {isAr ? tl.titleAr : tl.titleEn}
                </h3>
                <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                  {isAr ? tl.descAr : tl.descEn}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <Eye className="w-4.5 h-4.5 text-gold-505" />
                <span>{isAr ? 'تشغيل آلي مبرمج بالكمبيوتر 100%' : 'Computer programmed CNC operating'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. QUICK QUOTATION BOX DIRECT ACTION */}
      <section className="bg-neutral-950 border border-gold-500/15 py-12 px-6 rounded-3xl max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-right">
          <h3 className="text-xl md:text-2xl font-black text-white">
            {isAr ? 'تأكد من اختيار يافطة لمشروعك القادم' : 'Entrust YAFTA with Your Corporate Storefront'}
          </h3>
          <p className="text-xs md:text-sm text-neutral-400 max-w-xl font-sans">
            {isAr 
              ? 'نحن ندمج الحلول المبتكرة مع أسس التصميم الهندسي المتين لمنع تآكل أو سقوط الواحهات طيلة سنوات.' 
              : 'Our mechanical engineers ensure safety certifications, preventing fatigue or material decay over structural lifespans.'}
          </p>
        </div>
        <button 
          onClick={() => setActivePage('contact')} 
          className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-gold-300 to-gold-505 hover:from-gold-200 hover:to-gold-300 text-neutral-950 text-xs font-black rounded-lg transition-all shadow-lg shrink-0 text-center uppercase tracking-wider cursor-pointer"
        >
          {isAr ? 'ابدأ حساب التكلفة وتصميم الواجهة 💵' : 'Calculate Custom Quotation 💵'}
        </button>
      </section>

    </div>
  );
}
