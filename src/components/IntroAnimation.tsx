/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
  isAr: boolean;
}

export default function IntroAnimation({ onComplete, isAr }: IntroAnimationProps) {
  const [lettersLoaded, setLettersLoaded] = useState<boolean[]>(Array(5).fill(false));
  const [isFullyAssembled, setIsFullyAssembled] = useState(false);
  const [cameraShake, setCameraShake] = useState({ x: 0, y: 0 });
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Initialize Web Audio Context on user event or automatically
  useEffect(() => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      setAudioContext(new AudioCtx());
    }
  }, []);

  // Web Audio Synthesizer for high-performance sound effects (Bell / Metallic impact)
  const playImpactSound = (pitch: number) => {
    if (!audioContext) return;
    try {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      const now = audioContext.currentTime;
      
      // Main oscillator - metallic bell tone
      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(pitch, now);
      // Ring modulation/harmonic component
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(pitch * 1.5, now);
      
      // Soft release envelope
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.4, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch (e) {
      // Fail silently if browser blocks autoplay
    }
  };

  const playRevealSound = () => {
    if (!audioContext) return;
    try {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      const now = audioContext.currentTime;
      
      // Warm major chord sweep + bass drop rumble
      const masterGain = audioContext.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.5, now + 0.1);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      masterGain.connect(audioContext.destination);

      const notes = [196, 293.66, 392, 587.33]; // G3, D4, G4, D5 (Rich open gold harmony)
      notes.forEach((freq, idx) => {
        const osc = audioContext.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        
        // Lowpass filter for smooth luxurious feel
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(1200, now + 0.5);
        filter.frequency.exponentialRampToValueAtTime(200, now + 1.5);
        
        osc.connect(filter);
        filter.connect(masterGain);
        osc.start(now);
        osc.stop(now + 2.0);
      });

      // Cinematic Sub Drop
      const subOsc = audioContext.createOscillator();
      const subGain = audioContext.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(65, now);
      subOsc.frequency.exponentialRampToValueAtTime(30, now + 1.2);
      
      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.6, now + 0.1);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      
      subOsc.connect(subGain);
      subGain.connect(audioContext.destination);
      subOsc.start(now);
      subOsc.stop(now + 1.6);
    } catch (e) {
      // Fail silently
    }
  };

  // Stagger letters arriving from BOTTOM (A, T, F, A, Y sequentially, since vertical assembly goes bottom to top)
  const letters = ['A', 'T', 'F', 'A', 'Y']; // YAFTA backwards for bottom-to-top assembly
  const letterPitches = [220, 261.63, 329.63, 392, 440]; // Harmonic pitches ascending

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    
    // Animate each letter
    letters.forEach((_, index) => {
      const timer = setTimeout(() => {
        setLettersLoaded(prev => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
        
        // Soft impact sound
        playImpactSound(letterPitches[index]);
        
        // Tiny vibration on impact
        setCameraShake({ x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 6 });
        setTimeout(() => setCameraShake({ x: 0, y: 0 }), 80);
        
      }, index * 450 + 400);
      timers.push(timer);
    });

    // Final golden sweep & complete cinematic impact
    const finalTimer = setTimeout(() => {
      setIsFullyAssembled(true);
      playRevealSound();
      
      // Stronger vibration on final match
      setCameraShake({ x: (Math.random() - 0.5) * 15, y: (Math.random() - 0.5) * 15 });
      setTimeout(() => setCameraShake({ x: 0, y: 0 }), 150);

      // Finish intro animation after beautiful sweep
      setTimeout(() => {
        onComplete();
      }, 2000);

    }, letters.length * 450 + 600);

    timers.push(finalTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[1000] bg-black select-none overflow-hidden flex flex-col items-center justify-between py-12 px-4 transition-transform duration-100 ease-out"
      style={{
        transform: `translate(${cameraShake.x}px, ${cameraShake.y}px)`,
        fontFamily: 'Outfit, sans-serif'
      }}
    >
      {/* Background ambient stars */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,192,96,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Top logo marker */}
      <div className="flex items-center gap-1.5 opacity-40 select-none pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-gold-505" />
        <span className="text-[10px] tracking-[0.4em] text-white/80 font-black uppercase">
          {isAr ? 'يافطة الفاخرة' : 'YAFTA ARCHITECTURAL'}
        </span>
      </div>

      {/* Main Assembly Arena */}
      <div className="relative flex flex-col items-center justify-center my-auto">
        
        <div className="flex flex-row-reverse items-center justify-center gap-4 sm:gap-7 md:gap-10 perspective-[1000px] h-32">
          {letters.map((letter, idx) => {
            const letterIndex = 4 - idx; // map back to real Y-A-F-T-A position
            const isLoaded = lettersLoaded[idx];
            
            return (
              <div key={idx} className="relative w-10 sm:w-16 md:w-24 text-center">
                <AnimatePresence>
                  {isLoaded && (
                    <motion.span
                      initial={{ 
                        opacity: 0, 
                        y: 350, 
                        rotateX: 95, 
                        rotateY: -45, 
                        scale: 0.2 
                      }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        rotateX: 0, 
                        rotateY: 0, 
                        scale: 1,
                        transition: {
                          type: 'spring',
                          stiffness: 120,
                          damping: 14,
                          mass: 1.2
                        }
                      }}
                      className="block text-5xl sm:text-7xl md:text-8xl font-black select-none cursor-default font-sans text-transparent bg-clip-text bg-gradient-to-b from-[#fcf6ba] via-[#e5c060] to-[#b8860b]"
                      style={{
                        filter: 'drop-shadow(0 15px 15px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 10px rgba(229, 192, 96, 0.15))',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {letter}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Vertical guiding shadow trace line for assemble feedback */}
                {!isLoaded && (
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-gold-500/10 to-transparent h-40 pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* Golden Light Sweep Overlay */}
        <AnimatePresence>
          {isFullyAssembled && (
            <motion.div 
              initial={{ x: '-150%', opacity: 0 }}
              animate={{ 
                x: '150%', 
                opacity: [0, 1, 1, 0],
                transition: { duration: 1.6, ease: 'easeInOut' } 
              }}
              className="absolute inset-y-0 w-80 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[35deg] pointer-events-none mix-blend-overlay z-20"
            />
          )}
        </AnimatePresence>

        {/* Subtitle Underneath */}
        <AnimatePresence>
          {isFullyAssembled && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs sm:text-sm font-light tracking-[0.35em] text-gold-300 mt-6 md:mt-10 max-w-[280px] sm:max-w-md text-center uppercase"
            >
              {isAr ? 'الفخامة الهندسية بآفاق معاصرة' : 'Cinematic Architectural Brilliance'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Skip button at bottom */}
      <div className="relative z-50">
        <button
          onClick={onComplete}
          className="px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:border-gold-505/40 hover:bg-white/10 text-neutral-300 hover:text-white transition-all text-xs font-semibold active:scale-95 duration-100 uppercase tracking-widest cursor-pointer"
        >
          {isAr ? 'تخطي الإعلان ✕' : 'Skip Intro ✕'}
        </button>
      </div>

      {/* Global CSS for 3D depth inside parent */}
      <style>{`
        .perspective-[1000px] {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
