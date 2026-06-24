/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, ShieldCheck } from 'lucide-react';
import { LogoConfig } from '../types';
import LogoRenderer from './LogoRenderer';

interface IntroAnimationProps {
  onComplete: () => void;
  isAr: boolean;
  logoConfig?: LogoConfig;
}

export default function IntroAnimation({ onComplete, isAr, logoConfig }: IntroAnimationProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);
  const [stage, setStage] = useState<'black' | 'tracing' | 'sweep' | 'monolith' | 'fade'>('black');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Initialize background star coordinates
  useEffect(() => {
    const list = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 4 + 3
    }));
    setParticles(list);

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      setAudioContext(new AudioCtx());
    }
  }, []);

  // Web Audio Cinematic Sub-bass drop + high crystalline chime
  const playCinematicSound = () => {
    if (!audioContext) return;
    try {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      const now = audioContext.currentTime;

      // 1. Deep Sub Drop
      const subOsc = audioContext.createOscillator();
      const subGain = audioContext.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(75, now);
      subOsc.frequency.exponentialRampToValueAtTime(28, now + 2.5);
      
      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.7, now + 0.15);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

      subOsc.connect(subGain);
      subGain.connect(audioContext.destination);
      subOsc.start(now);
      subOsc.stop(now + 2.5);

      // 2. High Shimmer Chime
      const shimmerOsc = audioContext.createOscillator();
      const shimmerGain = audioContext.createGain();
      shimmerOsc.type = 'triangle';
      shimmerOsc.frequency.setValueAtTime(880, now); // A5 note
      shimmerOsc.frequency.exponentialRampToValueAtTime(1200, now + 1.5);

      shimmerGain.gain.setValueAtTime(0.001, now);
      shimmerGain.gain.exponentialRampToValueAtTime(0.35, now + 0.1);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      // Add a highpass filter to shimmer to make it sound premium and airy
      const filter = audioContext.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1000, now);

      shimmerOsc.connect(filter);
      filter.connect(shimmerGain);
      shimmerGain.connect(audioContext.destination);

      shimmerOsc.start(now);
      shimmerOsc.stop(now + 2.5);
    } catch {
      // Ignored if autoplay policy blocks sound
    }
  };

  // Cinematic staging timeline
  useEffect(() => {
    // Stage 1: Pitch Black
    const t1 = setTimeout(() => {
      setStage('tracing');
      playCinematicSound();
    }, 400);

    // Stage 2: Light Sweep across brand name
    const t2 = setTimeout(() => {
      setStage('sweep');
    }, 1800);

    // Stage 3: The billboard monolith scale-up / cinematic passing
    const t3 = setTimeout(() => {
      setStage('monolith');
    }, 3200);

    // Stage 4: Fade out and release
    const t4 = setTimeout(() => {
      onComplete();
    }, 4900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [audioContext]);

  return (
    <div className="fixed inset-0 z-[99999] bg-black select-none overflow-hidden flex flex-col items-center justify-between py-16 px-6 font-sans">
      
      {/* Golden Stardust Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-gold-400"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              boxShadow: '0 0 8px #d4af37'
            }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
              scale: [0.8, 1.2, 0.8],
              y: [`${p.y}%`, `${p.y - 12}%`]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Ambient Radial Golden Depth Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_75%)] pointer-events-none" />

      {/* Top Brand Tag */}
      <div className="z-10 flex items-center gap-2 opacity-30 select-none pointer-events-none">
        <Sparkles className="w-4 h-4 text-gold-505 animate-pulse" />
        <span className="text-[9px] tracking-[0.45em] text-white/95 font-black uppercase">
          {isAr ? 'منظومة يافطة المتكاملة' : 'YAFTA ARCHITECTURAL ERP'}
        </span>
      </div>

      {/* MIDDLE PRESENTATION ZONE */}
      <div className="relative flex flex-col items-center justify-center my-auto z-10">
        <AnimatePresence mode="wait">
          
          {/* TRACING & SWEEP STAGE */}
          {(stage === 'tracing' || stage === 'sweep') && (
            <motion.div
              key="brand-reveal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="relative">
                {/* Glowing Aura detrás del texto */}
                <div className="absolute inset-0 blur-2xl bg-gold-500/10 rounded-full animate-pulse"></div>
                
                {/* Brand Logo/Text */}
                {logoConfig && logoConfig.visibleInIntro !== false ? (
                  <div className="flex justify-center items-center py-4">
                    <LogoRenderer config={logoConfig} isAr={isAr} mode="dark" className="scale-125 md:scale-150 transform transition-all duration-300" />
                  </div>
                ) : (
                  <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fffbf0] via-[#e5c060] to-[#aa7c11] select-none tracking-wide">
                    {isAr ? 'يافطة' : 'YAFTA'}
                  </h1>
                )}

                {/* Tracing Underline Light Sweep */}
                {stage === 'sweep' && (
                  <motion.div 
                    initial={{ left: '-10%', opacity: 0 }}
                    animate={{ left: '110%', opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.4, ease: 'easeInOut' }}
                    className="absolute bottom-0 h-[3px] w-36 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_15px_#fff] pointer-events-none"
                  />
                )}
              </div>

              {/* Sophisticated subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xs sm:text-sm font-light tracking-[0.4em] text-gold-300 uppercase"
              >
                {isAr ? 'فخامة التصنيع الهندسي الرقمي' : 'SIGNAGE & CLADDING ENGINEERING'}
              </motion.p>
            </motion.div>
          )}

          {/* MONOLITH FLYTHROUGH EXPERIENCE */}
          {stage === 'monolith' && (
            <motion.div
              key="monolith-scale"
              initial={{ opacity: 0, scale: 1, z: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                scale: 1.4,
                z: 100,
                transition: { duration: 1.8, ease: 'easeInOut' }
              }}
              className="flex flex-col items-center justify-center space-y-6 text-center"
            >
              {/* Premium agency crest */}
              <div className="w-16 h-16 rounded-2xl border border-gold-505/30 bg-neutral-950 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.15)] mb-2">
                <Trophy className="w-8 h-8 text-gold-505 animate-bounce-slow" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                {isAr ? 'دخول المنصة الذهبية' : 'Entering YAFTA Suite'}
              </h2>
              <p className="text-[10px] text-gold-300 font-mono tracking-widest uppercase">
                {isAr ? 'التحقق من الرتب والاتصال بقواعد البيانات' : 'VERIFYING CREDENTIALS & SECURE BLUEPRINTS'}
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* BOTTOM SKIP TRIGGERS */}
      <div className="z-20 relative">
        <button
          onClick={onComplete}
          className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-gold-505/40 hover:bg-white/10 text-neutral-350 hover:text-white transition-all text-xs font-bold active:scale-95 duration-100 uppercase tracking-widest cursor-pointer select-none shadow-2xl"
        >
          {isAr ? 'تخطي الواجهة ✕' : 'Skip Intro ✕'}
        </button>
      </div>

    </div>
  );
}
