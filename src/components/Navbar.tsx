/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PageId, CompanyInfo, LogoConfig, UserAccount } from '../types';
import { Menu, X, Landmark, Globe, Hammer, ShieldAlert, Award, ChevronDown, User, LogIn } from 'lucide-react';
import LogoRenderer from './LogoRenderer';

interface Props {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  isAr: boolean;
  setIsAr: (val: boolean) => void;
  companyInfo: CompanyInfo;
  logoConfig?: LogoConfig;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export default function Navbar({ activePage, setActivePage, isAr, setIsAr, companyInfo, logoConfig, currentUser, onOpenAuth, onLogout }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSolutionsDropdown, setShowSolutionsDropdown] = useState(false);

  // Default logo config fallback for robust error resilience
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

  const navItems = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home' },
    { id: 'about', labelAr: 'من نحن', labelEn: 'About Us' },
    { id: 'services', labelAr: 'الخدمات', labelEn: 'Services' },
    { id: 'portfolio', labelAr: 'أعمالنا', labelEn: 'Portfolio' },
  ];

  const specialtySolutions = [
    { id: 'signage', labelAr: 'اللافتات والحروف البارزة', labelEn: 'Signage & 3D Letters' },
    { id: 'cladding', labelAr: 'الواجهات والكلادينج', labelEn: 'Cladding & Facades' },
    { id: 'printing', labelAr: 'الطباعة الاحترافية', labelEn: 'Printing Solutions' },
    { id: 'digital', labelAr: 'الحلول الرقمية والمواقع', labelEn: 'Digital Solutions' }
  ];

  const primaryActions = [
    { id: 'portal', labelAr: 'بوابة العملاء 📊', labelEn: 'Client Portal 📊', isHighlight: true },
    { id: 'contact', labelAr: 'طلب عرض سعر 💰', labelEn: 'Get Quotation 💰', isButton: true }
  ];

  const handleNavClick = (pageId: PageId) => {
    setActivePage(pageId);
    setIsOpen(false);
    setShowSolutionsDropdown(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-gold-500/20 text-white transition-all duration-300">
      {/* Top micro bar for phone / urgency */}
      <div className="bg-gradient-to-r from-gold-950 via-neutral-950 to-gold-950 py-1.5 px-4 text-center border-b border-gold-500/10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-gold-252 text-gold-300">
          <div className="flex items-center gap-4">
            <span className="font-bold flex items-center gap-1">
              📞 {isAr ? 'اتصل بنا المبيعات:' : 'Sales Call:'} <a href={`tel:${companyInfo.phone}`} className="hover:underline">{companyInfo.phone}</a>
            </span>
            <span className="hidden md:inline text-neutral-400">|</span>
            <span className="hidden md:inline font-bold">
              📍 {isAr ? 'القاهرة - مصر' : 'Cairo, Egypt'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-[11px] font-bold text-neutral-300">
              {isAr ? 'استجابة سريعة لطلبات عروض الأسعار خلال 24 ساعة' : 'Quick quotation response in 24 hours'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand Title */}
          {currentLogoConfig.visibleInHeader && (
            <LogoRenderer 
              config={currentLogoConfig} 
              isAr={isAr} 
              mode="dark"
              onClick={() => handleNavClick('home')}
            />
          )}
          {!currentLogoConfig.visibleInHeader && <div className="w-1 h-1"></div>}

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as PageId)}
                className={`px-3 py-2 text-[14px] font-bold rounded-lg transition-all duration-200 ${
                  activePage === item.id 
                    ? 'text-gold-505 bg-gold-950/40 border border-gold-505/20' 
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900/50'
                }`}
              >
                {isAr ? item.labelAr : item.labelEn}
              </button>
            ))}

            {/* Specialty Solutions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSolutionsDropdown(!showSolutionsDropdown)}
                onMouseEnter={() => setShowSolutionsDropdown(true)}
                className={`px-3 py-2 text-[14px] font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                  specialtySolutions.some(s => s.id === activePage)
                    ? 'text-gold-505 bg-gold-950/40 border border-gold-505/20'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900/50'
                }`}
              >
                <span>{isAr ? 'قطاعات التخصص' : 'Specialties'}</span>
                <ChevronDown className="w-4 h-4 text-gold-505" />
              </button>

              {showSolutionsDropdown && (
                <div 
                  className="absolute right-0 mt-1 w-64 bg-neutral-950 border border-gold-500/20 rounded-xl shadow-2xl p-1 z-50 glass-panel"
                  onMouseLeave={() => setShowSolutionsDropdown(false)}
                >
                  <div className="py-1 px-3 text-[10px] font-bold tracking-wider text-gold-300 uppercase border-b border-gold-500/10 mb-1">
                    {isAr ? 'خدمات التصنيع والتركيب:' : 'Manufacturing & Installation:'}
                  </div>
                  {specialtySolutions.map((sol) => (
                    <button
                      key={sol.id}
                      onClick={() => handleNavClick(sol.id as PageId)}
                      className={`w-full text-right px-4 py-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-between ${
                        activePage === sol.id
                          ? 'bg-gold-500/10 text-gold-505'
                          : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                      }`}
                    >
                      <span>{isAr ? sol.labelAr : sol.labelEn}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-505 opacity-50"></span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Client Portal Link */}
            <button
              onClick={() => handleNavClick('portal')}
              className={`px-3 py-2 text-[14px] font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                activePage === 'portal'
                  ? 'text-gold-505 bg-gold-900/10 border border-gold-505/20'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <span>{isAr ? 'بوابة العملاء' : 'Client Portal'}</span>
              <span className="bg-gold-500 text-black text-[9px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                {isAr ? 'جديد' : 'NEW'}
              </span>
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language switch */}
            <button
              onClick={() => setIsAr(!isAr)}
              className="px-3 py-1.5 rounded-lg border border-gold-500/15 bg-neutral-900 hover:border-gold-505/50 transition-all text-xs font-bold flex items-center gap-1.5 text-gold-300"
              title={isAr ? 'Switch to English' : 'تحويل للغة العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-gold-450 text-gold-505" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>

            {/* Authentication Portal */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('portal')}
                  className="px-3.5 py-1.5 rounded-lg border border-gold-505/30 bg-neutral-900 hover:bg-neutral-850 text-xs font-bold flex items-center gap-2 text-gold-300 transition-all"
                  title={isAr ? 'عرض لوحة التحكم الشخصية' : 'View Personal Dashboard'}
                >
                  <User className="w-3.5 h-3.5 text-gold-505" />
                  <span className="max-w-[120px] truncate">{currentUser.name}</span>
                  <span className="text-[10px] bg-gold-950 text-gold-350 px-1.5 py-0.5 rounded-md font-black uppercase border border-gold-505/10">
                    {currentUser.role === 'Admin' ? (isAr ? 'مشرف' : 'Admin') : currentUser.role === 'Employee' ? (isAr ? 'موظف' : 'Employee') : (isAr ? 'عميل' : 'Client')}
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg border border-rose-500/15 bg-neutral-950 hover:bg-rose-950/20 text-rose-450 hover:text-rose-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  title={isAr ? 'تسجيل الخروج' : 'Log Out'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-lg border-2 border-dashed border-gold-505/40 hover:border-gold-505 bg-neutral-950 hover:bg-neutral-900 transition-all text-xs font-black flex items-center gap-1.5 text-gold-300 cursor-pointer"
                title={isAr ? 'تسجيل الدخول أو فتح الحساب' : 'Security Access Login'}
              >
                <User className="w-4 h-4 text-gold-505 animate-pulse" />
                <span>{isAr ? 'تسجيل الدخول 🔐' : 'Gate Login 🔐'}</span>
              </button>
            )}

            {/* Quotation request CTA button */}
            <button
              onClick={() => handleNavClick('contact')}
              className="px-5 py-2.5 text-xs text-black font-extrabold bg-gradient-to-r from-gold-300 via-gold-505 to-gold-400 rounded-xl hover:from-gold-200 hover:to-gold-300 transition-all shadow-lg shadow-gold-500/10 active:scale-95 flex items-center gap-1.5 uppercase tracking-wider"
            >
              {isAr ? 'اطلب عرض سعر مجاني 💰' : 'Request Free Quote 💰'}
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Language switcher mobile */}
            <button
              onClick={() => setIsAr(!isAr)}
              className="px-2 py-1.5 rounded bg-neutral-900 border border-gold-500/10 text-[11px] font-extrabold text-gold-505 flex items-center gap-1"
            >
              <Globe className="w-3 h-3" />
              <span>{isAr ? 'EN' : 'عربي'}</span>
            </button>

            {/* Hamburger button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-neutral-900 border border-gold-500/10 text-gold-505 hover:bg-neutral-800"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gold-500/15 bg-neutral-950 p-4 space-y-3 shadow-2xl animate-fade-in">
          {currentLogoConfig.visibleInMenu && (
            <div className="pb-3 border-b border-gold-500/10 flex justify-center">
              <LogoRenderer 
                config={currentLogoConfig} 
                isAr={isAr} 
                mode="dark" 
                onClick={() => handleNavClick('home')}
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-gold-500/10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as PageId)}
                className={`p-3 text-xs font-bold rounded-lg text-center transition-colors ${
                  activePage === item.id
                    ? 'bg-gold-500/10 text-gold-505 border border-gold-505/20'
                    : 'bg-neutral-900/40 text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                {isAr ? item.labelAr : item.labelEn}
              </button>
            ))}
          </div>

          <div>
            <div className="text-[10px] font-black tracking-widest text-gold-300 uppercase mb-2 px-1">
              {isAr ? 'قطاعات التصميم والتصنيع:' : 'Manufacturing Divisions:'}
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {specialtySolutions.map((sol) => (
                <button
                  key={sol.id}
                  onClick={() => handleNavClick(sol.id as PageId)}
                  className={`w-full text-right px-3 py-2.5 text-xs font-semibold rounded-lg flex items-center justify-between ${
                    activePage === sol.id
                      ? 'bg-gold-500/10 text-gold-505'
                      : 'bg-neutral-900/20 text-neutral-300 hover:bg-neutral-900'
                  }`}
                >
                  <span>{isAr ? sol.labelAr : sol.labelEn}</span>
                  <span className="w-1 h-1 rounded-full bg-gold-505"></span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-gold-500/10 space-y-2">
            {/* Mobile User Authentication state */}
            {currentUser ? (
              <div className="p-3 bg-neutral-900 rounded-xl border border-gold-505/20 space-y-2 text-right">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-gold-950 text-gold-350 px-2 py-0.5 rounded font-black uppercase text-[9px]">
                    {currentUser.role === 'Admin' ? (isAr ? 'مدير عام مشرف' : 'Super Admin') : currentUser.role === 'Employee' ? (isAr ? 'موظف تشغيل فني' : 'Operations Staff') : (isAr ? 'حساب عميل معتمد' : 'Verified Client')}
                  </span>
                  <strong className="text-white text-xs">{currentUser.name}</strong>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">{currentUser.email}</div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleNavClick('portal')}
                    className="py-2 bg-gold-505 text-neutral-950 rounded-lg text-[10px] font-black text-center"
                  >
                    {isAr ? 'لوحة التحكم 📊' : 'Dashboard 📊'}
                  </button>
                  <button
                    onClick={onLogout}
                    className="py-2 bg-rose-950/50 hover:bg-rose-950 border border-rose-500/20 text-rose-300 rounded-lg text-[10px] font-black text-center"
                  >
                    {isAr ? 'خروج 🔐' : 'Log Out 🔐'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setIsOpen(false); onOpenAuth && onOpenAuth(); }}
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-850 border border-gold-505/20 text-gold-505 hover:text-white rounded-xl text-center text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
              >
                🔐 {isAr ? 'تسجيل الدخول / فتح حساب جديد' : 'Gate Authentication Access'}
              </button>
            )}

            {/* Portal link mobile */}
            <button
              onClick={() => handleNavClick('portal')}
              className={`w-full py-3 px-4 rounded-xl text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activePage === 'portal'
                  ? 'bg-neutral-900 text-gold-505 border border-gold-505/30'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              📊 {isAr ? 'بوابة العملاء ولوحة التحكم' : 'Client Portal & DB'}
            </button>

            {/* Quote mobile button */}
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full py-3.5 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 font-black rounded-xl text-center text-xs shadow-lg flex items-center justify-center gap-1.5"
            >
              💰 {isAr ? 'ابدأ مشروعك واطلب عرض سعر' : 'Get a Custom Quote'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
