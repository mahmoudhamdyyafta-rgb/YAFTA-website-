/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PageId } from '../types';
import { Sparkles, Check, Code, Layout, Laptop, Phone, Database, Shield, Cpu, ExternalLink } from 'lucide-react';

interface Props {
  setActivePage: (page: PageId) => void;
  isAr: boolean;
}

export default function Digital({ setActivePage, isAr }: Props) {
  const digitalProjects = [
    {
      titleAr: 'مواقع الشركات والمنصات التعريفية الفخمة',
      titleEn: 'Deluxe Corporate Web Portals & CMS',
      descAr: 'تصميم وبرمجة مواقع بصرية فخمة تعزز هيبة شركتكم على الإنترنت، وتأتي مع لوحة تحكم سهلة وتستجيب تماً لكافة الأجهزة.',
      descEn: 'High-performance bespoke corporate portals optimized for extreme speed, custom animations, and Google SEO.',
      tech: ['React.js & Vite', 'Node.js Express', 'Tailwind CSS v4'],
      featuresAr: ['متوافق تماماً مع محركات البحث وجوجل SEO', 'تحميل كسول وتصغير تلقائي للصور', 'درجات أمان فائقة للحماية من الاختراقات'],
      featuresEn: ['Optimized for Google core web vitals (100% SEO scores)', 'Lazy loading and native next-gen assets delivery', 'Built-in security audits protecting corporate assets']
    },
    {
      titleAr: 'منصات التجارة والمتاجر الإلكترونية الكبيرة',
      titleEn: 'Scale-Ready Enterprise E-Commerce Engines',
      descAr: 'متاجر إلكترونية غنية بميزات متقدمة لعرض وبيع مئات المنتجات بدععم بوابات الدفع المصرية وسلال الشراء السلسة.',
      descEn: 'Fully integrated e-commerce solutions supporting automated receipts, local payment gateways, and inventory controls.',
      tech: ['TypeScript Native', 'PostgreSQL Database', 'Tailwind CSS'],
      featuresAr: ['دعم بوابات فوري، فودافون كاش، وكروت فيزا ومستركارت', 'نظام مرن لحساب تكاليف الشحن الداخلي والخارجي للمنتجات', 'تتبع تفصيلي لحالات الطلب والشحن للمستهلكين'],
      featuresEn: ['Supports local Egyptian card processors & wallet checkouts', 'Dynamic shipping fee calculators per governorate', 'Bespoke client dashboard protecting customer state']
    },
    {
      titleAr: 'أنظمة إدارة الموارد وعلاقات العملاء (ERP/CRM)',
      titleEn: 'Bespoke Business CRM & Administrative ERPs',
      descAr: 'برمجيات مخصصة لتنظيم العمل والإنتاج وإدارة مبيعات مصانعك ومحسبات عملائك بدقة متناهية وإحصائيات فورية مفصلة.',
      descEn: 'Custom internal web apps designed to optimize team workflows, lead logging, client tracking, and production management.',
      tech: ['Node.js API REST', 'D3.js Charts Engine', 'PostgreSQL / SQL'],
      featuresAr: ['إدارة كاملة للفواتير ودفاتر القيود والحسابات الضريبية', 'توزيع مبرمج تلقائي للمهام والصلاحيات الإدارية للموظفين', 'تقارير ذكية تفاعلية لمبيعات ونسب ربح الشركة شهرياً'],
      featuresEn: ['Invoice generation, tax accounting charts, and logs', 'Role-based access permissions & security protocols', 'Interactive spatial charts tracking commercial KPIs']
    }
  ];

  const technologiesUsed = [
    { name: 'React.js', descAr: 'لبناء واجهات مستخدم بالغة السرعة متجاوبة مع الأجهزة الذكية', descEn: 'High-speed UI reactive and dynamic rendering' },
    { name: 'Node.js & Express', descAr: 'خوادم خلفية متينة لتكامل البيانات والأمان العالي', descEn: 'Robust server routing and REST API handlers' },
    { name: 'PostgreSQL', descAr: 'قواعد بيانات علائقية لتنظيم بياناتك ومحاسباتك بأشد المعايير', descEn: 'Secure relational database storing structural states' },
    { name: 'Tailwind CSS', descAr: 'لتصميم واجهات عصرية فخمة خفيفة الحجم وسريعة التحميل', descEn: 'Modern, highly responsive styles with zero layout shift' }
  ];

  return (
    <div className="space-y-16 pb-16 font-sans">
      
      {/* 1. Page Title Hero */}
      <section className="text-center space-y-4 max-w-4xl mx-auto pt-8">
        <span className="text-xs font-bold tracking-[0.3em] text-gold-505 uppercase flex items-center justify-center gap-1.5">
          <Code className="w-5 h-5 text-gold-505 animate-pulse" />
          <span>{isAr ? 'رواد الحلول والمنصات الرقمية المتكاملة' : 'SPECIALTY DIVISION: DIGITAL INNOVATION & WEB ENGINE'}</span>
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          {isAr ? 'نصمم واجهات تبني الثقة وتدفع نمو المبيعات' : 'Futuristic Digital Architectures Designed to Scale'}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {isAr 
            ? 'نحن ندمج الحلول الإبداعية مع أحدث لغات البرمجة لنبني لعلامتكم التجارية موقعاً أو تطبيقاً فخماً يمثل فخركم وسرعة استجابتكم.' 
            : 'Explore bespoke software engineering with YAFTAs digital unit. We develop beautiful corporate web pages and secure SME management backends.'}
        </p>
      </section>

      {/* 2. Visual card grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {digitalProjects.map((proj, idx) => (
          <div 
            key={idx}
            className="bg-neutral-950 p-6 md:p-8 rounded-2xl border border-gold-500/10 hover:border-gold-505/30 transition-all duration-300 flex flex-col justify-between shadow-2xl"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-gold-505">
                <Layout className="w-5 h-5 shrink-0" />
                <h3 className="text-lg md:text-xl font-extrabold text-white">
                  {isAr ? proj.titleAr : proj.titleEn}
                </h3>
              </div>
              
              <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                {isAr ? proj.descAr : proj.descEn}
              </p>

              {/* Bullet list of specs with checks */}
              <div className="space-y-2 pt-3 border-t border-gold-500/10">
                <span className="text-[10px] uppercase tracking-widest text-gold-300 font-bold block">
                  {isAr ? 'مزايا المنصة البرمجية:' : 'Software Capabilities:'}
                </span>
                <ul className="space-y-1.5">
                  {(isAr ? proj.featuresAr : proj.featuresEn).map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-1.5 text-xs text-neutral-400 font-sans">
                      <span className="w-1.5 h-1.5 bg-gold-505 rounded-full shrink-0 mt-1.5"></span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies block tag */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {proj.tech.map((tag, tIdx) => (
                  <span key={tIdx} className="bg-neutral-900 text-[10px] font-bold text-gold-300 px-2 py-0.5 rounded border border-gold-500/15">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-gold-500/10 text-xs text-neutral-450 flex justify-between items-center bg-gold-950/20 px-3 py-2 rounded text-neutral-400 font-bold">
              <span>{isAr ? 'برمجة يدوية ناصعة نظيفة' : 'Hand-crafted dynamic code'}</span>
              <span className="text-gold-505">🚀 {isAr ? 'سرعة فائقة' : 'Fast PageLoad'}</span>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Technology stack section */}
      <section className="max-w-5xl mx-auto px-4 space-y-6">
        <h3 className="text-xl font-black text-center text-white">
          {isAr ? 'التقنيات البرمجية التي نستخدمها في مشاريعنا:' : 'Our Enterprise Technology Stack:'}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {technologiesUsed.map((tech, idx) => (
            <div key={idx} className="bg-neutral-950 p-4 rounded-xl border border-gold-500/5 text-center space-y-1 hover:border-gold-505/20 transition-all font-sans">
              <span className="text-white font-extrabold text-sm block">{tech.name}</span>
              <span className="text-[10px] text-neutral-400 block">{isAr ? tech.descAr : tech.descEn}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Action CTA */}
      <section className="bg-neutral-950 p-8 rounded-2xl max-w-5xl mx-auto border border-gold-500/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-right font-sans">
          <h4 className="text-lg font-bold text-white">
            {isAr ? 'هل تفكر في إنشاء موقع تعريفي لشركتك أو متجر الكتروني متكامل؟' : 'Looking for high-impact web presence or an ERP framework?'}
          </h4>
          <p className="text-xs text-neutral-400">
            {isAr ? 'راسل مهندسينا لحجز جلسة استشارة مجانية نوضح لك فيها الهيكل المالي والمواصفات.' : 'Schedule a tech advisory session with our lead system designers.'}
          </p>
        </div>
        <button 
          onClick={() => setActivePage('contact')}
          className="px-6 py-3 bg-gradient-to-r from-gold-300 to-gold-505 hover:from-gold-200 text-neutral-950 font-black rounded-lg text-xs shrink-0 text-center uppercase tracking-wider"
        >
          {isAr ? 'اطلب استشارة برمجية مجانية 🚀' : 'Request Consult 🚀'}
        </button>
      </section>

    </div>
  );
}
