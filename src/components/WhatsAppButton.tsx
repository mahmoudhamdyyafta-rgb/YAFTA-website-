/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, ChevronRight, Shield, Briefcase, Wrench, FileText, Landmark, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface WhatsAppDepartment {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  number: string;
  greetingMessage: string;
  isOnline: boolean;
}

export interface WhatsAppConfig {
  number: string;
  position: 'bottom-right' | 'bottom-left';
  color: string;
  text: string;
  enabled: boolean;
  greetingMessage: string;
  
  // Enhanced Fields
  showWelcomeTrigger?: boolean;
  welcomeTriggerTextAr?: string;
  welcomeTriggerTextEn?: string;
  welcomeTriggerDelay?: number;
  departments?: WhatsAppDepartment[];
}

interface Props {
  config: WhatsAppConfig;
  isAr: boolean;
}

export default function WhatsAppButton({ config, isAr }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [hasNotificationBeenDismissed, setHasNotificationBeenDismissed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Safely grab departments or fallback to default single department if none exists
  const departmentsList: WhatsAppDepartment[] = config.departments && config.departments.length > 0 
    ? config.departments 
    : [
        {
          id: 'default',
          nameAr: 'المبيعات والاستفسارات 💼',
          nameEn: 'Sales & Inquiries 💼',
          descriptionAr: 'لطلب عروض الأسعار وتصميم اللوحات الإعلانية',
          descriptionEn: 'Get custom quotes and professional signage designs',
          number: config.number || '201116210464',
          greetingMessage: config.greetingMessage || 'مرحباً بقسم المبيعات، أود الاستفسار عن تفاصيل أسعار لوحات يافطة.',
          isOnline: true
        }
      ];

  // Automatic trigger of the welcome message notification bubble
  useEffect(() => {
    if (!config || !config.enabled) return;
    
    const showTrigger = config.showWelcomeTrigger !== false; // Default to true if undefined
    if (!showTrigger || isOpen || hasNotificationBeenDismissed) return;

    const delayMs = (config.welcomeTriggerDelay || 4) * 1000;
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [config, isOpen, hasNotificationBeenDismissed]);

  if (!config || !config.enabled) return null;

  const handleWhatsAppRedirect = (dept: WhatsAppDepartment) => {
    const message = dept.greetingMessage || config.greetingMessage || '';
    const encodedText = encodeURIComponent(message);
    const cleanNumber = dept.number.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodedText}`, '_blank', 'noopener,noreferrer');
  };

  const isRight = config.position === 'bottom-right';

  // Helper to match icons based on department ID
  const getDepartmentIcon = (id: string) => {
    switch (id) {
      case 'sales':
      case 'default':
        return <Briefcase className="w-4 h-4 text-gold-300" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-amber-400" />;
      case 'production':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileText className="w-4 h-4 text-gold-300" />;
    }
  };

  const welcomeText = isAr 
    ? (config.welcomeTriggerTextAr || 'مرحباً بك! لدينا فريق متخصص لمساعدتك في تصميم وتصنيع لافتاتك الإعلانية بأفضل سعر.')
    : (config.welcomeTriggerTextEn || 'Welcome! We have a specialized team ready to design and fabricate your custom signages.');

  return (
    <div 
      className={`fixed z-50 flex flex-col ${isRight ? 'items-end' : 'items-start'} gap-3 font-sans`}
      style={{
        top: '65%',
        transform: 'translateY(-50%)',
        left: isRight ? 'auto' : '0px',
        right: isRight ? '0px' : 'auto',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ════════════════════════════════════════════════════
          1. Automated Welcome Notification Bubble (Pulsing)
          ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showNotification && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, x: isRight ? 50 : -50 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`relative max-w-[280px] sm:max-w-[320px] bg-zinc-950 border border-gold-505/30 rounded-2xl p-4 shadow-2xl z-40 text-right flex flex-col gap-2 ${isRight ? 'mr-4' : 'ml-4'}`}
            style={{
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.7), 0 0 15px rgba(212, 175, 55, 0.15)'
            }}
          >
            {/* Close Button for Notification */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowNotification(false);
                setHasNotificationBeenDismissed(true);
              }}
              className="absolute top-2 left-2 w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Notification Sender Info */}
            <div className={`flex items-center gap-2 ${isAr ? 'flex-row-reverse' : 'flex-row'} mb-1`}>
              <div className="w-7 h-7 rounded-full bg-gold-950 border border-gold-505/30 flex items-center justify-center text-[10px] text-gold-300">
                ⭐
              </div>
              <div className="text-right">
                <h4 className="text-[11px] font-bold text-white leading-none">
                  {isAr ? 'فريق مبيعات يافطة' : 'YAFTA Support Team'}
                </h4>
                <span className="text-[8px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                  {isAr ? 'متصل الآن' : 'Active Now'}
                </span>
              </div>
            </div>

            {/* Notification Bubble Body */}
            <p className={`text-xs text-zinc-200 leading-relaxed ${isAr ? 'text-right' : 'text-left'}`}>
              {welcomeText}
            </p>

            {/* Call to Action Button inside notification */}
            <button
              onClick={() => {
                setIsOpen(true);
                setShowNotification(false);
              }}
              className="mt-1 w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer"
            >
              <span>{isAr ? 'تحدث معنا الآن 💬' : 'Chat With Us 💬'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════
          2. Multi-Department Support Portal (Popup)
          ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className={`w-[90vw] sm:w-[360px] bg-neutral-950 border border-gold-505/20 rounded-2xl overflow-hidden shadow-2xl z-50 flex flex-col ${isRight ? 'mr-4' : 'ml-4'}`}
            style={{
              boxShadow: '0 20px 50px -15px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.1)'
            }}
          >
            {/* Popover Header */}
            <div className="bg-gradient-to-r from-neutral-900 to-zinc-950 p-4 border-b border-gold-505/10 flex items-center justify-between">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2.5 text-right">
                <div>
                  <h3 className="text-sm font-black text-white tracking-wide">
                    {isAr ? 'مركز دعم عملاء يافطة ⚡' : 'YAFTA Signage Desk ⚡'}
                  </h3>
                  <p className="text-[10px] text-zinc-400">
                    {isAr ? 'اختر القسم المناسب لمحادثة سريعة' : 'Select a department to connect'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                  <MessageCircle className="w-5 h-5 fill-emerald-400/10" />
                </div>
              </div>
            </div>

            {/* Department Selection Body */}
            <div className="p-4 space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar">
              
              {/* Real-time automated typing simulator block */}
              <div className={`p-3 bg-neutral-900/60 border border-neutral-800/40 rounded-xl flex gap-2.5 items-start ${isAr ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                <div className="w-6 h-6 rounded-full bg-gold-950 border border-gold-505/30 flex items-center justify-center text-[10px]">
                  🤖
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[9px] font-bold text-gold-400 block">{isAr ? 'الرد التلقائي الذكي:' : 'Automated Response:'}</span>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    {isAr 
                      ? 'مرحباً بك! جميع ممثلي خدمة العملاء متصلون وجاهزون لمساعدتك فوراً في تنفيذ لافتتك الإعلانية.'
                      : 'Hello! Our engineers and representatives are online and ready to build your luxury signs.'}
                  </p>
                </div>
              </div>

              <div className="py-1">
                <span className="text-[9px] bg-neutral-900 text-zinc-400 border border-neutral-800 px-2 py-0.5 rounded uppercase tracking-wider font-mono block w-fit mx-auto">
                  {isAr ? 'قنوات المحادثة المتوفرة' : 'Available Contact Channels'}
                </span>
              </div>

              {departmentsList.map((dept) => (
                <motion.button
                  key={dept.id}
                  whileHover={{ scale: 1.02, x: isAr ? -3 : 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleWhatsAppRedirect(dept)}
                  className={`w-full p-3.5 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800/80 hover:border-gold-505/40 rounded-xl flex items-center justify-between gap-3 text-right cursor-pointer transition-colors duration-200 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`flex items-center gap-2 ${isAr ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-5 h-5 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    </div>
                    {isAr ? <ChevronRight className="w-4 h-4 text-zinc-600 rotate-180" /> : <ChevronRight className="w-4 h-4 text-zinc-600" />}
                  </div>

                  <div className={`flex items-center gap-3 flex-1 ${isAr ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                    <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-neutral-800 flex items-center justify-center shrink-0">
                      {getDepartmentIcon(dept.id)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {isAr ? dept.nameAr : dept.nameEn}
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                        {isAr ? dept.descriptionAr : dept.descriptionEn}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Popover Footer */}
            <div className="p-3.5 bg-neutral-950 border-t border-neutral-900 flex items-center justify-between text-[9px] font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-500" />
                {isAr ? 'اتصال آمن ومباشر' : 'Secure Encrypted Connection'}
              </span>
              <span>YAFTA v3.5</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════
          3. Core Floating WhatsApp Trigger Button (Pulsing / Hover-Sensitive)
          ════════════════════════════════════════════════════ */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          if (showNotification) setShowNotification(false);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        initial={{ opacity: 0, scale: 0.8, x: isRight ? 24 : -24 }}
        animate={{ 
          opacity: isOpen ? 1 : (isHovered ? 1 : 0.65), 
          scale: isOpen ? 1 : (isHovered ? 1.05 : 0.9),
          x: isOpen || isHovered ? 0 : (isRight ? 24 : -24)
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        whileTap={{ scale: 0.92 }}
        className={`relative flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-2xl cursor-pointer select-none border border-white/10 overflow-hidden transition-all duration-300 ${
          isRight ? 'rounded-l-full rounded-r-none border-r-0' : 'rounded-r-full rounded-l-none border-l-0'
        }`}
        style={{
          backgroundColor: config.color || '#25D366',
          boxShadow: isOpen || isHovered 
            ? `0 10px 30px -5px ${config.color || '#25D366'}a0` 
            : `0 4px 15px -5px ${config.color || '#25D366'}40`,
          padding: isOpen || isHovered ? '12px 18px' : '12px',
          width: isOpen || isHovered ? 'auto' : '48px',
          height: '48px',
        }}
      >
        {/* Pulsing Backlit Aura Waves */}
        <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
        {(isOpen || isHovered) && (
          <>
            <span className="absolute -inset-2 rounded-full bg-white/20 animate-ping pointer-events-none opacity-40"></span>
            <span className="absolute -inset-4 rounded-full bg-emerald-400/10 animate-pulse pointer-events-none"></span>
          </>
        )}

        <div className="relative flex items-center gap-2 justify-center">
          {isOpen ? (
            <X className="w-5 h-5 text-white animate-spin-once" />
          ) : (
            <MessageCircle className="w-5 h-5 text-white fill-white" />
          )}
          
          <AnimatePresence>
            {config.text && !isOpen && isHovered && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap font-black tracking-wide overflow-hidden"
              >
                {isAr ? config.text : 'Chat Support'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  );
}
