/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import { BeforeAfterItem } from '../types';
import { Eye, CheckCircle2, RefreshCw } from 'lucide-react';

interface Props {
  item: BeforeAfterItem;
  isAr: boolean;
}

export default function BeforeAfterSlider({ item, isAr }: Props) {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.01] border border-gold-500/20">
      {/* Visual Slider Container */}
      <div 
        ref={containerRef}
        className="relative h-[320px] md:h-[400px] w-full select-none overflow-hidden cursor-ew-resize bg-neutral-900"
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* BEFORE IMAGE (Bottom/Right side) */}
        <img 
          src={item.beforeImage} 
          alt="Before YAFTA Renovation"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="absolute right-4 bottom-4 z-10 bg-red-950/90 text-red-200 text-xs md:text-sm px-3 py-1.5 rounded-full font-bold border border-red-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          {isAr ? 'قبل التنفيذ' : 'Before'}
        </div>

        {/* AFTER IMAGE (Top/Left side - clipped) */}
        <div 
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img 
            src={item.afterImage} 
            alt="After YAFTA Renovation"
            className="absolute inset-0 h-[320px] md:h-[400px] w-full object-cover"
            style={{ width: containerRef.current?.offsetWidth || '100vw', maxWidth: 'none' }}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute left-4 bottom-4 z-10 bg-gold-950/95 text-gold-200 text-xs md:text-sm px-3 py-1.5 rounded-full font-bold border border-gold-505/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-505 animate-ping"></span>
          {isAr ? 'بعد تعديل يافطة' : 'After YAFTA'}
        </div>

        {/* SLIDER LINE & DRAGGER BUTTON */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-gold-505 via-gold-300 to-gold-600 cursor-ew-resize z-20"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-neutral-950 border-2 border-gold-505 flex items-center justify-center shadow-lg text-gold-505 hover:bg-gold-505 hover:text-black transition-colors duration-200">
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
          </div>
        </div>

        {/* Drag Guidance Prompt Overlay (Only visible on hover) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-gold-100 text-[11px] md:text-xs py-1 px-3 rounded-full border border-gold-500/20 backdrop-blur-md pointer-events-none transition-opacity duration-300">
          {isAr ? '◄ اسحب الشريط لرؤية الفرق الفني ►' : '◄ Drag the bar to see the craftsmanship ►'}
        </div>
      </div>

      {/* Info Panel under the slider */}
      <div className="p-5 md:p-6 bg-neutral-950/95 border-t border-gold-500/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gold-300 bg-gold-950/60 px-2.5 py-1 rounded border border-gold-500/20 inline-block mb-1.5">
              {isAr ? item.categoryAr : item.categoryEn}
            </span>
            <h4 className="text-lg md:text-xl font-bold text-white tracking-tight">
              {isAr ? item.titleAr : item.titleEn}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-gold-300 text-xs bg-gold-900/10 px-3 py-1.5 rounded-lg border border-gold-500/10 self-start md:self-center">
            <Eye className="w-4 h-4" />
            <span>{isAr ? 'نتيجة ملموسة بنسبة 100%' : '100% Tangible upgrade'}</span>
          </div>
        </div>

        <div className="border-t border-neutral-900 pt-4">
          <p className="text-xs text-gold-100/60 font-bold uppercase tracking-wider mb-2">
            {isAr ? 'مواصفات وتفاصيل التعديل الفني:' : 'Branding & Structural Specs Implemented:'}
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {(isAr ? item.specsAr : item.specsEn).map((spec, index) => (
              <li key={index} className="flex items-center gap-2 text-xs md:text-sm text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-gold-505 shrink-0" />
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
