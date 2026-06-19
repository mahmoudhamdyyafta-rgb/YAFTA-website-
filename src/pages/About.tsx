/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PageId } from '../types';
import { Award, ShieldCheck, Heart, Users, Clock, Flame, Shield, ArrowRight, CheckCircle } from 'lucide-react';

interface Props {
  setActivePage: (page: PageId) => void;
  isAr: boolean;
}

export default function About({ setActivePage, isAr }: Props) {
  const companyValues = [
    {
      titleAr: 'الابتكار الدائم والإبداع المفتوح',
      titleEn: 'Infinite Architectural Innovation',
      descAr: 'لا نقلد بل نبتكر صيحات تصميمية تزيد من القوة البصرية والحضور التجاري لعملائنا في الشوارع المصرية.',
      descEn: 'We formulate unique structural paradigms that amplify visual gravity and store footprint conversions.',
      icon: <Flame className="w-5 h-5 text-gold-505" />
    },
    {
      titleAr: 'الأمان والالتزام الهندسي الصارم',
      titleEn: 'Strict Structural Safety Calculations',
      descAr: 'معايير جودة ميكانيكية دقيقة في اختيار سمك الألواح ومقاومات الرياح لحماية المشاة وثبات يدوم عقوداً.',
      descEn: 'Safety calculations are computed under stormy conditions to prevent mechanical layout detachment.',
      icon: <ShieldCheck className="w-5 h-5 text-gold-505" />
    },
    {
      titleAr: 'خدمة فائقة السرعة بضمان حقيقي',
      titleEn: '100% Reliable Support Promise',
      descAr: 'خدمة صيانة ومتابعة مستمرة لشبكات الليد والترانسات ليبقى مشروعك مشرقاً على مدار اليوم دون انقطاع.',
      descEn: 'Constant customer follow-ups and rapid periodic inspection calls to maximize illuminated lifespans.',
      icon: <Clock className="w-5 h-5 text-gold-505" />
    }
  ];

  const brandPartners = [
    { name: 'MADO Egypt', role: 'الضيافة الفاخرة' },
    { name: 'Emaar Misr', role: 'التطوير العقاري' },
    { name: 'Samsung Egypt', role: 'المعدات والليدات' },
    { name: 'Marriott Group', role: 'الفنادق واللافتات' },
    { name: 'National Banks', role: 'الصراف الآلي واللوحات' },
    { name: 'Life Clinics', role: 'العيادات الكبرى' },
    { name: 'Puma Egypt', role: 'المتاجر واللوحات' },
    { name: 'BuildPro Enterprise', role: 'المقاولات والتشييد' }
  ];

  return (
    <div className="space-y-20 pb-16 font-sans">
      
      {/* 1. Page Title Hero */}
      <section className="text-center space-y-4 max-w-4xl mx-auto pt-8">
        <span className="text-xs font-bold tracking-[0.3em] text-gold-505 uppercase">
          {isAr ? 'قصة يافطة للدعاية والإعلان' : 'OUR LEGACY & CORPORATE CREED'}
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
          {isAr ? 'عقد من الريادة الإعلانية والابتكار الإنشائي في مصر' : 'A Decade of Transforming Stores into Landmarks'}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {isAr 
            ? 'تأسست يافطة لتسد الفجوة بين الإبداع الفني والجودة الهندسية الرصينة في تصنيع اللافتات وتغطية الواجهات التجارية والكلادينج.' 
            : 'Since 2014, YAFTA has designed and fabricated award-winning facades and structural storefront icons across Egypt.'}
        </p>
      </section>

      {/* 2. Visual founders overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-[0.2em] text-gold-300 uppercase">
              {isAr ? 'الجذور والتأسيس' : 'Foundations & Timeline'}
            </span>
            <h2 className="text-3xl font-black text-white">
              {isAr ? 'يافطة.. حينما يلتقي الفن بهندسة الفولاذ' : 'A Legacy Born out of Rigor & Passion'}
            </h2>
          </div>
          <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
            {isAr 
              ? 'انطلقت مسيرة يافطة من قلب القاهرة في منطقة عين شمس كفريق مخصص برؤية واضحة: رفع سقف مواصفات وجودة اللافتات والكلادينج بالسوق المصرية لتضاهي المعايير المطبقة في كبرى العواصم العالمية. على مدار 10 سنوات، نجحنا بفضل الله في تجهيز مقرات ومحلات لـ أكثر من 300 علامة تجارية مرموقة بمختلف المحافظات.'
              : 'YAFTA expanded from a compact drafting studio in Ayn Shams into a premier industrial manufacturing site servicing Egypt’s mega commercial brands. Over the past 10 years, we built close bonds with real estate developers, restaurants, and pharmacy chains, securing a stellar reputation for delivering on-time, leakproof, and wind-calculated architectural assets.'}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-950 p-4 border border-gold-500/10 rounded-xl space-y-1">
              <span className="text-gold-505 font-mono font-black text-lg block">Estd. 2014</span>
              <span className="text-[10px] text-neutral-400 block">{isAr ? 'عقد كامل من الصدارة الإنشائية' : 'A full decade of construction focus'}</span>
            </div>
            <div className="bg-neutral-950 p-4 border border-gold-500/10 rounded-xl space-y-1">
              <span className="text-gold-505 font-mono font-black text-lg block">300+ Clients</span>
              <span className="text-[10px] text-neutral-400 block">{isAr ? 'شراكات نجاح مستدامة بمصر' : 'Pioneering brand projects in Egypt'}</span>
            </div>
          </div>
        </div>

        {/* Backdrop images */}
        <div className="relative h-[250px] sm:h-[350px] rounded-3xl overflow-hidden border border-gold-505/20 shadow-2xl bg-neutral-950">
          <img 
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800" 
            alt="YAFTA Mechanical Plant Production"
            className="w-full h-full object-cover filter brightness-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 z-10"></div>
          <div className="absolute inset-x-6 bottom-6 z-20 space-y-2 text-right">
            <span className="text-[10px] text-neutral-950 font-black tracking-widest uppercase bg-gold-505 px-3 py-1 rounded">
              {isAr ? 'مصانعنا الميكانيكية بالقاهرة' : 'Cairo Manufacturing Desk'}
            </span>
            <p className="text-xs text-neutral-100 font-bold leading-relaxed font-sans">
              {isAr ? 'نمتلك أحدث خطوط الإنتاج والتشغيل ليزر فايبر وسي إن سي لضمان عزل تام ودقة مليمترية.' : 'Precision CNC routers, fiber laser cutters and in-house paint lines.'}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Core Company Values */}
      <section className="bg-neutral-950 border-t border-b border-gold-500/15 py-16 space-y-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold tracking-[0.25em] text-gold-505 uppercase">
              {isAr ? 'مرتكزات الهوية الإعلانية ليافطة' : 'OUR CORE ORGANIZATIONAL PILLARS'}
            </span>
            <h3 className="text-2xl md:text-4xl font-black text-white">
              {isAr ? 'القيم التي نعتنقها في ورشنا يومياً' : 'Values That Steer Our Hand-crafted Operations'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {companyValues.map((val, idx) => (
              <div key={idx} className="bg-neutral-900 rounded-xl p-6 border border-gold-500/5 hover:border-gold-505/20 transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-neutral-950 border border-gold-505/25 flex items-center justify-center">
                    {val.icon}
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-white">{isAr ? val.titleAr : val.titleEn}</h4>
                  <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-sans">{isAr ? val.descAr : val.descEn}</p>
                </div>
                <div className="pt-4 text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
                  PILLAR 0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Brand partners trust grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] text-gold-505 uppercase">
            {isAr ? 'شركاء النجاح الموثقين بمصر' : 'ENTERPRISE PATRONS TRUSTING YAFTA'}
          </span>
          <h3 className="text-2xl md:text-4xl font-black text-white">
            {isAr ? 'شركات وعقارات ونوادٍ تعتمد واجهاتها على يافطة' : 'Leading Regional Brands We Proudly Support'}
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brandPartners.map((partner, idx) => (
            <div 
              key={idx} 
              className="bg-neutral-950 p-5 rounded-xl border border-gold-500/5 hover:border-gold-505/20 transition-all text-center space-y-1 font-sans"
            >
              <strong className="text-gold-505 text-sm md:text-base font-bold block">{partner.name}</strong>
              <span className="text-[10px] text-neutral-500 block font-semibold">{isAr ? partner.role : 'Corporate Partner'}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Team division architecture overview */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 border border-gold-505/25 p-6 md:p-8 rounded-2xl space-y-4 text-center">
          <h4 className="text-lg font-bold text-white">{isAr ? 'هيكل تشغيلي متكامل لخدمتك:' : 'Multidisciplinary In-House Operations:'}</h4>
          <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
            {isAr 
              ? 'تضم يافطة نخبة من المهندسين المدنيين لحساب أحمال الطبيعة، مهندسي كهرباء لتجهيز خطوط الإنارة الذكية سامسونج، ومصممين فنيين محترفين لتخطيط المحاكاة ثلاثية الأبعاد والألوان الكونية قبل بدء أي لحام ميكانيكي بورش العمل.' 
              : 'Our operations unite structural project managers, electrical safety inspectors, certified scaffold riggers, offset calibration technicians, and spatial visual designers into a single cohesive Egyptian agency.'}
          </p>
          <div className="flex justify-center flex-wrap gap-2 pt-2">
            {[
              { labelAr: 'قسم الهندسة المدنية والأحمال', labelEn: 'Structural Load Engineering Desk' },
              { labelAr: 'قسم التصنيع الميكانيكي والتركيب', labelEn: 'Heavy Metals & Bending Plant' },
              { labelAr: 'قسم الهويات البصرية والمحاكاة ثلاثية الأبعاد', labelEn: 'Bespoke Spatial Design & CAD House' }
            ].map((div, idx) => (
              <span key={idx} className="bg-gold-950/60 text-gold-300 text-[10px] md:text-xs px-3.5 py-1.5 rounded-full border border-gold-505/15 font-bold">
                ✓ {isAr ? div.labelAr : div.labelEn}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
