/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, Info } from 'lucide-react';

export const NEON_PALETTE = [
  { id: 'gold', nameAr: 'ذهبي مرآة', nameEn: 'Imperial Gold', hex: '#E5C060', ambientAr: 'دالي 3000K دافئ فاخر', ambientEn: 'Calm 3000K Deluxe warm' },
  { id: 'emerald', nameAr: 'أخضر ملكي', nameEn: 'Royal Emerald', hex: '#10B981', ambientAr: 'أخضر ليد مشرق', ambientEn: 'Energetic Emerald' },
  { id: 'sapphire', nameAr: 'أزرق زاهي', nameEn: 'Electric Blue', hex: '#3B82F6', ambientAr: 'أزرق يافطة نيون', ambientEn: 'Deep Sea Blue Neon' },
  { id: 'ruby', nameAr: 'أحمر ناري', nameEn: 'Ruby Fire', hex: '#EF4444', ambientAr: 'أحمر مشع جذاب', ambientEn: 'Blazing Ruby LED' },
  { id: 'rose', nameAr: 'وردي نيون', nameEn: 'Neon Rose', hex: '#EC4899', ambientAr: 'وردي رومنسي دافئ', ambientEn: 'Seductive Velvet Rose' },
  { id: 'pearl', nameAr: 'أبيض ثلجي', nameEn: 'Cool Pearl', hex: '#F3F4F6', ambientAr: 'أبيض ناصع 6000K', ambientEn: 'Pure Arctic White 6000K' }
];

interface Props {
  isAr: boolean;
  brandName: string;
}

export default function ContrastSimulator({ isAr, brandName }: Props) {
  const [selectedNeon, setSelectedNeon] = useState(NEON_PALETTE[0]);
  const [isDaytime, setIsDaytime] = useState(false);

  return (
    <div className="glass-premium rounded-3xl p-6 border border-gold-505/20 bg-neutral-950/60 shadow-2xl flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gold-500/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold-950 border border-gold-505/30 flex items-center justify-center text-gold-300">
              <Eye className="w-4 h-4 text-gold-550 animate-pulse" />
            </div>
            <div className="text-right">
              <h3 className="text-base font-bold text-white">
                {isAr ? 'مستكشف تباين الإضاءة ليلاً ونهاراً 💡' : 'Nocturnal Contrast Simulator'}
              </h3>
              <p className="text-[10px] text-neutral-400">
                {isAr ? 'معاينة سطوع اللافتات في الأحوال الجوية المختلفة' : 'Test dynamic LED contrast values instantly'}
              </p>
            </div>
          </div>
          <span className="text-[9px] bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
            {isAr ? 'تفاعلي' : 'Interactive'}
          </span>
        </div>

        {/* Simulated Storefront Box */}
        <div 
          className={`relative h-44 rounded-2xl border transition-all duration-700 flex flex-col items-center justify-center p-4 overflow-hidden ${
            isDaytime 
              ? 'bg-gradient-to-b from-blue-100 to-sky-200 border-sky-300' 
              : 'bg-neutral-950 border-neutral-800'
          }`}
        >
          {isDaytime && (
            <>
              <div className="absolute top-2 right-4 w-9 h-9 rounded-full bg-yellow-400 blur-sm animate-pulse"></div>
              <div className="absolute inset-0 bg-white/20 pointer-events-none"></div>
            </>
          )}

          <div className="relative text-center space-y-2 z-10 w-full max-w-xs transition-colors duration-500">
            <div className={`p-1.5 rounded-t-lg text-[9px] font-mono border transition-all duration-500 ${
              isDaytime ? 'bg-slate-700/10 text-slate-800 border-slate-700/20' : 'bg-neutral-900/60 text-neutral-400 border-neutral-800'
            }`}>
              {isDaytime ? (isAr ? 'واجهة بمصر تحت أشعة الشمس المباشرة ☀️' : 'Direct glare sunlight ☀️') : (isAr ? 'الواجهة مساءً تحت النور خافت 🌙' : 'Night ambient lighting 🌙')}
            </div>

            <div 
              className="p-5 rounded-b-xl border border-dashed transition-all duration-500 flex flex-col items-center justify-center"
              style={{
                backgroundColor: isDaytime ? 'rgba(30, 41, 59, 0.1)' : 'rgba(0, 0, 0, 0.85)',
                borderColor: isDaytime ? 'rgba(30, 41, 59, 0.2)' : selectedNeon.hex
              }}
            >
              <h4 
                className="text-2xl md:text-3xl font-extrabold tracking-widest transition-all duration-500 font-sans"
                style={{
                  color: isDaytime ? '#2D3748' : selectedNeon.hex,
                  textShadow: isDaytime ? 'none' : `0 0 16px ${selectedNeon.hex}, 0 0 24px ${selectedNeon.hex}88`
                }}
              >
                {brandName.trim() ? brandName.toUpperCase().slice(0,18) : 'YAFTA'}
              </h4>

              <span 
                className={`text-[8px] font-mono tracking-widest uppercase mt-2.5 px-2 py-0.5 rounded transition-all duration-500 ${
                  isDaytime ? 'bg-slate-600/10 text-slate-500' : 'bg-black/80 text-neutral-400'
                }`}
                style={{
                  borderColor: isDaytime ? 'transparent' : `${selectedNeon.hex}33`,
                  borderWidth: isDaytime ? '0px' : '1px'
                }}
              >
                LED: {isAr ? selectedNeon.ambientAr : selectedNeon.ambientEn}
              </span>
            </div>
          </div>
        </div>

        {/* Color Selection Palette & Daytime Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
          <div className="space-y-1 w-full text-right sm:w-auto">
            <label className="text-[10px] font-extrabold text-neutral-300 block">{isAr ? 'اختر لون اللمبة والنيون:' : 'Select Neon Color:'}</label>
            <div className="flex gap-2 justify-end">
              {NEON_PALETTE.map(color => (
                <button
                  key={color.id}
                  onClick={() => setSelectedNeon(color)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform duration-305 hover:scale-115 cursor-pointer ${
                    selectedNeon.id === color.id ? 'scale-110 border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={isAr ? color.nameAr : color.nameEn}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end w-full sm:w-auto mt-2 sm:mt-0">
            <span className="text-[11px] font-bold text-neutral-300">{isAr ? 'محاكاة النهار الشمسية' : 'Daytime Mode'}</span>
            <button 
              onClick={() => setIsDaytime(!isDaytime)} 
              className={`relative w-12 h-6 rounded-full transition-colors duration-400 focus:outline-none cursor-pointer ${
                isDaytime ? 'bg-amber-400' : 'bg-neutral-800 border border-gold-505/20'
              }`}
            >
              <span 
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-black transition-transform duration-350 flex items-center justify-center text-xs ${
                  isDaytime ? 'translate-x-6 bg-white' : ''
                }`}
              >
                {isDaytime ? '☀️' : '🌙'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="text-[9px] font-mono text-neutral-400 text-center pt-3 border-t border-neutral-900 mt-3">
        🔋 {isAr ? 'نظام ليد سامسونج يوفر 75% من الطاقة مزود بترانسات 12 فولت معزولة تماماً.' : 'Samsung Korean low-draw 12V LED modules save 75% of grid power.'}
      </div>
    </div>
  );
}
