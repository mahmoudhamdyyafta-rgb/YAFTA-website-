/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { PageId, CompanyInfo, LogoConfig } from '../types';
import { Send, MapPin, Phone, Mail, Globe, Facebook, Instagram, Linkedin, Youtube, CheckCircle2 } from 'lucide-react';
import LogoRenderer from './LogoRenderer';

interface Props {
  setActivePage: (page: PageId) => void;
  isAr: boolean;
  companyInfo: CompanyInfo;
  logoConfig?: LogoConfig;
}

export default function Footer({ setActivePage, isAr, companyInfo, logoConfig }: Props) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const fallbackConfig: LogoConfig = {
    logoType: 'icon',
    imageSrcLight: '',
    imageSrcDark: '',
    svgCodeLight: '',
    svgCodeDark: '',
    brandTextAr: 'يافطة',
    brandTextEn: 'YAFTA',
    brandSubtitleAr: 'وكالة يافطة للدعاية والإعلان',
    brandSubtitleEn: 'ADVERTISING AGENCY',
    sizeMobile: 48,
    sizeTablet: 48,
    sizeDesktop: 48,
    colorAccent: '#e5c060',
    opacity: 1,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
    position: 'left',
    customX: 0,
    customY: 0,
    visibleInHeader: true,
    visibleInHero: true,
    visibleInFooter: true,
    visibleInMenu: true,
    animation: 'none',
    hoverEffect: 'scale',
    scrollEffect: 'none',
  };

  const currentLogoConfig = logoConfig || fallbackConfig;

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 5000);
    }
  };

  const handlePageTransition = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#090909] text-white border-t border-gold-500/20 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            {currentLogoConfig.visibleInFooter && (
              <LogoRenderer 
                config={currentLogoConfig} 
                isAr={isAr} 
                mode="dark"
                onClick={() => handlePageTransition('home')}
              />
            )}
            
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-sans">
              {isAr 
                ? 'مؤسسة يافطة الرائدة في الشرق الأوسط ومصر لصناعة اللافتات المضيئة ثلاثية الأبعاد، الكلادينج المعماري، والمطبوعات الفاخرة المعتمدة هندسياً وموقع الويب ذو التقنية الفائقة.' 
                : 'YAFTA is an industry-leading Cairo-based enterprise designing and fabricating certified fireproof ACP cladding facades, structural 3D LED signs, high-end packaging and digital solutions.'}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://www.facebook.com/share/1CnpSH45Yf/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-neutral-900 border border-gold-500/20 flex items-center justify-center text-neutral-400 hover:text-gold-505 hover:border-gold-505 hover:scale-110 transition-all duration-200">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 border border-gold-500/20 flex items-center justify-center text-neutral-400 hover:text-gold-505 hover:border-gold-505 hover:scale-110 transition-all duration-200">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 border border-gold-500/20 flex items-center justify-center text-neutral-400 hover:text-gold-505 hover:border-gold-505 hover:scale-110 transition-all duration-200">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 border border-gold-500/20 flex items-center justify-center text-neutral-400 hover:text-gold-505 hover:border-gold-505 hover:scale-110 transition-all duration-200">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-gold-505 uppercase tracking-wider mb-4 pb-2 border-b border-gold-500/10 inline-block">
              {isAr ? 'روابط سريعة' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-xs md:text-sm text-neutral-400">
              <li>
                <button onClick={() => handlePageTransition('home')} className="hover:text-gold-505 hover:underline transition-colors block text-right">
                  {isAr ? '• الصفحة الرئيسية' : '• Home Page'}
                </button>
              </li>
              <li>
                <button onClick={() => handlePageTransition('about')} className="hover:text-gold-505 hover:underline transition-colors block text-right">
                  {isAr ? '• من نحن وعملائنا' : '• About Our Legacy'}
                </button>
              </li>
              <li>
                <button onClick={() => handlePageTransition('services')} className="hover:text-gold-505 hover:underline transition-colors block text-right">
                  {isAr ? '• خدماتنا الهندسية والتسويقية' : '• Services & Operations'}
                </button>
              </li>
              <li>
                <button onClick={() => handlePageTransition('portfolio')} className="hover:text-gold-505 hover:underline transition-colors block text-right">
                  {isAr ? '• معرض أعمالنا المتميز' : '• View Case Studies'}
                </button>
              </li>
              <li>
                <button onClick={() => handlePageTransition('portal')} className="hover:text-gold-505 hover:underline transition-colors block text-right">
                  {isAr ? '• بوابة تتبع المشروعات الذكية' : '• Client Portal System'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Specialty Services */}
          <div>
            <h4 className="text-sm font-bold text-gold-505 uppercase tracking-wider mb-4 pb-2 border-b border-gold-500/10 inline-block">
              {isAr ? 'تخصصات يافطة' : 'Specialization Hubs'}
            </h4>
            <ul className="space-y-2 text-xs md:text-sm text-neutral-400">
              <li>
                <button onClick={() => handlePageTransition('signage')} className="hover:text-gold-505 hover:underline transition-colors block text-right">
                  {isAr ? '• اللافتات المضيئة والحروف البارزة' : '• 3D Lettering & Signs'}
                </button>
              </li>
              <li>
                <button onClick={() => handlePageTransition('cladding')} className="hover:text-gold-505 hover:underline transition-colors block text-right">
                  {isAr ? '• الكلادينج والواجهات التجارية' : '• Exterior ACP Cladding'}
                </button>
              </li>
              <li>
                <button onClick={() => handlePageTransition('printing')} className="hover:text-gold-505 hover:underline transition-colors block text-right">
                  {isAr ? '• الطباعة الاحترافية والعلب' : '• Packaging & Offset'}
                </button>
              </li>
              <li>
                <button onClick={() => handlePageTransition('digital')} className="hover:text-gold-505 hover:underline transition-colors block text-right">
                  {isAr ? '• المواقع والتطبيقات والحلول الرقمية' : '• Advanced Web/App Portals'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact Address */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gold-505 uppercase tracking-wider pb-2 border-b border-gold-500/10 inline-block">
              {isAr ? 'النشرة الدورية الحصرية' : 'Exclusive Brand Newsletter'}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              {isAr ? 'اشترك لتصلك أحدث مشاريع يافطة، وعروض أسعار الكلادينج واللافتات.' : 'Subscribe to receive updates on manufacturing techniques, cladding projects, and promotional offers.'}
            </p>
            
            {subscribed ? (
              <div className="bg-gold-950/60 text-gold-300 text-xs p-3 rounded-lg border border-gold-505/30 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-505 shrink-0" />
                <span>{isAr ? 'تم الاشتراك بنجاح تام!' : 'Successfully subscribed!'}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex h-10 w-full overflow-hidden rounded-lg border border-gold-550 border-gold-500/30">
                <input
                  type="email"
                  required
                  placeholder={isAr ? 'بريدك الإلكتروني...' : 'Email address...'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-neutral-900 border-none px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-gold-505 shrink grow placeholder-neutral-500"
                />
                <button
                  type="submit"
                  className="bg-gold-550 bg-gold-505 hover:bg-gold-600 text-neutral-950 px-4 flex items-center justify-center transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4 font-bold" />
                </button>
              </form>
            )}

            {/* Micro QR scanner simulation */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-12 h-12 bg-white rounded p-1 border border-gold-505 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full text-black" viewBox="0 0 24 24" fill="currentColor">
                  {/* Pseudo QR code block representation */}
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm14-2h4v4h-4V2zm0 6h4v4h-4V8zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm10-2h4v8h-4v-8zm4 4h4v4h-4v-4zM16 4h2v2h-2V4zm-2 2h2v2h-2V6zm2 6h2v2h-2v-2z" />
                </svg>
              </div>
              <p className="text-[10px] text-neutral-400 font-sans leading-tight">
                {isAr ? 'امسح الرمز لزيارة موقع يافطة المعتمد وحفظ بيانات الاتصال' : 'Scan to save YAFTA Digital VCard on your smart device'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact info row strip */}
        <div className="border-t border-b border-gold-500/10 py-6 my-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-5 h-5 text-gold-505 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-neutral-200">{isAr ? 'عنوان الإدارة:' : 'Main Headquarters:'}</p>
              <p className="text-neutral-400">{isAr ? companyInfo.addressAr : companyInfo.addressEn}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Phone className="w-5 h-5 text-gold-505 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-neutral-200">{isAr ? 'اتصل بنا والواتساب المباشر:' : 'Direct Phone & WhatsApp:'}</p>
              <p className="text-neutral-400">
                {isAr ? 'هاتف:' : 'Phone:'} {companyInfo.phone} <br />
                {isAr ? 'واتساب:' : 'WhatsApp:'} {companyInfo.whatsapp}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Mail className="w-5 h-5 text-gold-505 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-neutral-200">{isAr ? 'البريد الإلكتروني المباشر:' : 'Corporate Mailroom:'}</p>
              <p className="text-neutral-400">
                {companyInfo.emails[1]} <br />
                {companyInfo.emails[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright information */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-neutral-500 font-sans pt-4 gap-4">
          <p>© {new Date().getFullYear()} YAFTA Advertising Group (يافطة للدعاية والإعلان). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4 text-neutral-400">
            <a href="#" className="hover:text-gold-505 transition-colors">{isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}</a>
            <span>|</span>
            <a href="#" className="hover:text-gold-505 transition-colors">{isAr ? 'سياسة الخصوصية' : 'Privacy Protection'}</a>
            <span>|</span>
            <a href="#" className="hover:text-gold-505 transition-colors">{isAr ? 'الدعم الفني' : 'Technical Inquiries'}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
