/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

interface Props {
  isAr: boolean;
}

export default function LoadCalculator({ isAr }: Props) {
  const [storeWidth, setStoreWidth] = useState(10); // in meters

  return (
    <div className="glass-premium rounded-3xl p-5 border border-gold-505/19 lg:col-span-2 space-y-4 text-right bg-neutral-950/60 shadow-xl">
      <div className="flex items-center justify-between pb-2 border-b border-gold-500/10">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 text-gold-550" />
          <h4 className="text-sm font-bold text-white">
            {isAr ? 'حاسبة خلايا الـ LED واستهلاك الطاقة الميكانيكية' : 'Samsung LED Count & Electrical Load Calculator'}
          </h4>
        </div>
        <span className="text-[9px] text-neutral-400 font-mono">
          {isAr ? 'حسابات هندسية' : 'Computed load'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-1">
          <label className="text-[11px] text-neutral-400 block">
            {isAr ? 'عرض لافتة المحل (بالأمتار):' : 'Storefront Width (Meters):'}
          </label>
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-gold-505/25 rounded-xl px-3 py-1.5 justify-end">
            <span className="text-xs text-gold-300 font-bold">{isAr ? 'أمتار' : 'meters'}</span>
            <input
              type="number"
              value={storeWidth}
              onChange={(e) => setStoreWidth(Math.max(1, parseFloat(e.target.value) || 1))}
              className="bg-transparent text-white text-sm font-extrabold text-left w-20 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-3 gap-3 text-center font-sans text-xs">
          <div className="p-2.5 bg-neutral-900/50 border border-neutral-800 rounded-xl">
            <span className="text-neutral-400 block text-[9px] mb-0.5">{isAr ? 'اللدات المطلوبة:' : 'Samsung LED chips:'}</span>
            <span className="text-sm font-bold text-gold-305 font-mono">{(storeWidth * 115).toLocaleString()} {isAr ? 'ديود' : 'units'}</span>
          </div>
          <div className="p-2.5 bg-neutral-900/50 border border-neutral-800 rounded-xl">
            <span className="text-neutral-400 block text-[9px] mb-0.5">{isAr ? 'الاستهلاك الكهربائي:' : 'Electrical Load:'}</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">{(storeWidth * 38).toLocaleString()} {isAr ? 'وات' : 'Watts'}</span>
          </div>
          <div className="p-2.5 bg-neutral-900/50 border border-neutral-800 rounded-xl">
            <span className="text-neutral-400 block text-[9px] mb-0.5">{isAr ? 'زاوية الرؤية للأفراد:' : 'Legibility Arc:'}</span>
            <span className="text-sm font-bold text-white font-mono">{(storeWidth * 1.6).toFixed(1)} {isAr ? 'متر' : 'meters'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
