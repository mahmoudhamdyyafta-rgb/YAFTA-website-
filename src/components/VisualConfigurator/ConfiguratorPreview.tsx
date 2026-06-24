import React, { useState } from 'react';
import { Material } from '../../types/configurator';
import { Sun, Moon, Maximize2, MoveRight, Eye, User, Sparkles } from 'lucide-react';

interface ConfiguratorPreviewProps {
  isAr: boolean;
  widthM: number;
  heightM: number;
  selectedMaterial: Material;
  selectedColor: string;
  selectedThickness: number;
  selectedFinishing: string;
  hasBacklitGlow: boolean;
}

export const ConfiguratorPreview: React.FC<ConfiguratorPreviewProps> = ({
  isAr,
  widthM,
  heightM,
  selectedMaterial,
  selectedColor,
  selectedThickness,
  selectedFinishing,
  hasBacklitGlow
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState<'mockup' | '2d'>('mockup');
  const [dayNightTime, setDayNightTime] = useState<number>(50); // 0 = Midnight, 100 = Midday

  // Human scale factors (standard human height is 1.75 meters)
  const humanHeightPx = 140;
  const pixelsPerMeter = humanHeightPx / 1.75; // ~80px per meter

  // Limit preview dims to keep inside bounds
  const previewWidthPx = Math.min(Math.max(widthM * pixelsPerMeter, 40), 450);
  const previewHeightPx = Math.min(Math.max(heightM * pixelsPerMeter, 20), 220);

  // Compute ambient background based on dayNightTime slider
  const getAmbientBg = () => {
    if (dayNightTime > 75) {
      // Clear Midday
      return 'from-sky-300 via-sky-100 to-amber-50';
    } else if (dayNightTime > 40) {
      // Sunset / Golden hour
      return 'from-indigo-900 via-orange-800 to-amber-700';
    } else {
      // Deep Night
      return 'from-neutral-950 via-neutral-900 to-black';
    }
  };

  const isNight = dayNightTime <= 40;

  // Compute text glowing properties
  const getGlowStyles = () => {
    if (!isNight) return {};
    
    let glowColor = selectedColor || '#e5c060';
    if (hasBacklitGlow || selectedMaterial.id === 'neon' || selectedMaterial.id === 'acrylic') {
      return {
        color: glowColor,
        textShadow: `0 0 8px ${glowColor}, 0 0 15px ${glowColor}, 0 0 30px ${glowColor}`,
        boxShadow: hasBacklitGlow ? `0 0 35px ${glowColor}66` : 'none',
        borderColor: glowColor,
        backgroundColor: `${glowColor}15`
      };
    }
    return {
      color: glowColor,
      textShadow: 'none'
    };
  };

  return (
    <div className="bg-neutral-950 border border-gold-505/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between h-full relative" id="configurator-live-preview-box">
      
      {/* Top Bar Switchers */}
      <div className="p-4 bg-neutral-900/80 border-b border-gold-505/10 flex items-center justify-between z-10">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPreviewMode('mockup')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wider transition-all cursor-pointer ${
              isPreviewMode === 'mockup'
                ? 'bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 shadow-md shadow-gold-500/10 scale-102'
                : 'text-neutral-400 hover:text-white bg-neutral-950'
            }`}
          >
            {isAr ? '🏙️ محاكاة واجهة الفرع' : '🏙️ Facade Mockup'}
          </button>
          <button
            onClick={() => setIsPreviewMode('2d')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wider transition-all cursor-pointer ${
              isPreviewMode === '2d'
                ? 'bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 shadow-md shadow-gold-500/10 scale-102'
                : 'text-neutral-400 hover:text-white bg-neutral-950'
            }`}
          >
            {isAr ? '📐 رسم هندسي ثنائي الأبعاد' : '📐 2D Technical Diagram'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-gold-505 animate-pulse" />
          <span className="text-xs font-bold text-white">
            {isAr ? 'معاينة تفاعلية فورية' : 'Interactive Preview'}
          </span>
        </div>
      </div>

      {/* Main Preview Screen */}
      <div className={`relative flex-1 min-h-[300px] flex flex-col items-center justify-center p-6 transition-all duration-700 bg-gradient-to-b ${
        isPreviewMode === 'mockup' ? getAmbientBg() : 'from-neutral-950 to-neutral-900 border-b border-neutral-900'
      }`}>
        
        {/* Sky Background Overlay for Night Mockup */}
        {isPreviewMode === 'mockup' && isNight && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/30 via-transparent to-black/80 pointer-events-none" />
        )}

        {/* 1. FACADE MOCKUP VIEW */}
        {isPreviewMode === 'mockup' && (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            
            {/* The Building Storefront Frame */}
            <div className={`relative w-full max-w-[500px] h-[220px] rounded-xl border transition-all duration-500 overflow-hidden shadow-2xl flex flex-col justify-end ${
              isNight ? 'bg-neutral-950/90 border-neutral-800' : 'bg-neutral-200 border-neutral-300'
            }`}>
              
              {/* Storefront Cladding Wall Background */}
              <div 
                className="absolute inset-0 opacity-15 transition-all"
                style={{
                  backgroundImage: selectedMaterial.textureUrl ? `url(${selectedMaterial.textureUrl})` : 'none',
                  backgroundSize: 'cover',
                  filter: isNight ? 'brightness(0.3) contrast(1.2)' : 'brightness(1) contrast(1)'
                }}
              />

              {/* Floor / Sidewalk shadow line */}
              <div className={`absolute bottom-0 left-0 right-0 h-4 border-t ${
                isNight ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-300 border-neutral-400'
              }`} />

              {/* Store Glass Door Frame below Sign */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-20 border-t border-x rounded-t flex justify-around p-1 border-neutral-700/40 bg-neutral-900/10">
                <div className="w-0.5 h-full bg-neutral-700/20" /> {/* Glass division */}
              </div>

              {/* THE SIGNBOARD ON THE WALL - Dynamic Sizing & Styling */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20">
                <div 
                  className="rounded-lg flex items-center justify-center border font-sans font-black text-center select-none shadow-2xl transition-all duration-300 relative group"
                  style={{
                    width: `${previewWidthPx}px`,
                    height: `${previewHeightPx}px`,
                    backgroundColor: isNight ? '#0b0b0b' : '#ffffff',
                    borderColor: isNight ? 'rgba(229, 192, 96, 0.2)' : 'rgba(17,17,17,0.15)',
                    ...getGlowStyles()
                  }}
                >
                  {/* Subtle material texture layer */}
                  {selectedMaterial.textureUrl && (
                    <div 
                      className="absolute inset-0 opacity-5 mix-blend-overlay rounded-lg" 
                      style={{ backgroundImage: `url(${selectedMaterial.textureUrl})`, backgroundSize: 'cover' }}
                    />
                  )}

                  {/* Active Customizing Info overlay on Hover */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all rounded-lg flex flex-col justify-center items-center text-[10px] text-gold-300 font-bold p-1 space-y-0.5">
                    <span className="font-mono">{widthM.toFixed(1)}m × {heightM.toFixed(1)}m</span>
                    <span>{isAr ? selectedMaterial.nameAr : selectedMaterial.nameEn}</span>
                    <span className="text-[9px] text-neutral-400">{selectedThickness}mm • {selectedFinishing}</span>
                  </div>

                  {/* Sign text/emblem rendering based on values */}
                  <div className="p-2 flex flex-col items-center justify-center">
                    <span 
                      className="text-xs md:text-sm font-black uppercase tracking-widest"
                      style={{ color: selectedColor }}
                    >
                      {isAr ? 'يافطة الفاخرة' : 'YAFTA ADVERTISING'}
                    </span>
                    <span className="text-[8px] opacity-80 font-bold">
                      {isAr ? 'اللافتات الهندسية المضيئة' : 'Precision Architectural Signs'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scale Comparison: Human figure */}
            <div className="absolute bottom-0 right-10 z-30 flex flex-col items-center select-none animate-fade-in pointer-events-none">
              <div className="text-[8px] font-mono text-neutral-400 bg-neutral-900/60 px-1 py-0.5 rounded border border-neutral-800 mb-0.5">
                {isAr ? 'مقياس إنساني (١.٧٥م)' : 'Human (1.75m)'}
              </div>
              <div className="text-neutral-400 relative flex flex-col items-center">
                <User className="w-8 h-8 opacity-80" />
                <div className="w-3 h-12 bg-neutral-400 opacity-60 rounded-t" />
              </div>
            </div>
          </div>
        )}

        {/* 2. 2D TECHNICAL DIAGRAM VIEW */}
        {isPreviewMode === '2d' && (
          <div className="w-full max-w-[450px] aspect-[16/10] bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center relative select-none">
            
            {/* Sizing Indicator: Vertical Line (Height) */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center h-48 justify-between">
              <div className="w-2 h-0.5 bg-gold-505" />
              <div className="h-full w-0.5 bg-dashed bg-gold-505/30 flex items-center justify-center">
                <span className="bg-neutral-950 text-gold-305 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-gold-505/20 rotate-90 my-2 shrink-0">
                  {heightM.toFixed(2)} {isAr ? 'متر' : 'Meters'}
                </span>
              </div>
              <div className="w-2 h-0.5 bg-gold-505" />
            </div>

            {/* Sizing Indicator: Horizontal Line (Width) */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center w-64 justify-between">
              <div className="h-2 w-0.5 bg-gold-505" />
              <div className="w-full h-0.5 bg-dashed bg-gold-505/30 flex items-center justify-center">
                <span className="bg-neutral-950 text-gold-305 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-gold-505/20 my-2 shrink-0">
                  {widthM.toFixed(2)} {isAr ? 'متر' : 'Meters'}
                </span>
              </div>
              <div className="h-2 w-0.5 bg-gold-505" />
            </div>

            {/* Sign outline box */}
            <div 
              className="border-2 border-dashed border-gold-505/50 bg-gold-950/5 flex flex-col items-center justify-center rounded p-4 relative text-center"
              style={{
                width: `${previewWidthPx * 0.9}px`,
                height: `${previewHeightPx * 0.9}px`,
                borderColor: selectedColor
              }}
            >
              <div className="text-[10px] font-black tracking-widest text-white/90">
                {isAr ? 'يافطة كروكي' : 'YAFTA BLUEPRINT'}
              </div>
              
              {/* Core technical calculations shown directly inside */}
              <div className="hidden sm:block text-[8px] font-mono text-neutral-400 mt-1 space-y-0.5">
                <p>Area: {(widthM * heightM).toFixed(2)} m²</p>
                <p>Perim: {((widthM + heightM) * 2).toFixed(2)} m</p>
              </div>
            </div>

            {/* Engineering watermark */}
            <div className="absolute top-2 right-2 text-[8px] font-mono text-neutral-600">
              CAD COMPATIBLE • SCALE 1:{(100 / pixelsPerMeter).toFixed(1)}
            </div>
          </div>
        )}
      </div>

      {/* Control sliders & labels (only show for Facade mockup to trigger daytime simulation) */}
      <div className="p-4 bg-neutral-900 border-t border-gold-505/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        {isPreviewMode === 'mockup' ? (
          <div className="w-full flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Moon className={`w-4 h-4 ${isNight ? 'text-amber-400 animate-pulse' : ''}`} />
              <span className="text-[10px] font-bold">{isAr ? 'مساءً' : 'Night'}</span>
            </div>
            
            <input 
              type="range"
              min="0"
              max="100"
              value={dayNightTime}
              onChange={(e) => setDayNightTime(parseInt(e.target.value))}
              className="flex-1 accent-gold-505 h-1.5 bg-neutral-950 rounded-lg cursor-pointer"
            />

            <div className="flex items-center gap-1.5 text-neutral-400">
              <span className="text-[10px] font-bold">{isAr ? 'نهاراً' : 'Day'}</span>
              <Sun className={`w-4 h-4 ${!isNight ? 'text-amber-500' : ''}`} />
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between text-[11px] text-neutral-400 font-mono">
            <span>{isAr ? 'البلوبيرنت الهندسي النشط ومعدلات القطع بالليزر والأرجون' : 'Active CNC tooling & structural alignment indices'}</span>
            <span className="text-gold-505">100% CAD RECONCILED</span>
          </div>
        )}
      </div>
    </div>
  );
};
