/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LogoConfig } from '../types';

interface Props {
  config: LogoConfig;
  isAr: boolean;
  mode?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

export default function LogoRenderer({ config, isAr, mode = 'dark', className = '', onClick }: Props) {
  // If visibility is turned off for this layout section, we can let parent control or handle it here
  const {
    logoType,
    imageSrcLight,
    imageSrcDark,
    svgCodeLight,
    svgCodeDark,
    brandTextAr,
    brandTextEn,
    brandSubtitleAr,
    brandSubtitleEn,
    sizeMobile,
    sizeTablet,
    sizeDesktop,
    colorAccent,
    opacity,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    padding,
    position,
    customX,
    customY,
    animation,
    hoverEffect,
  } = config;

  // Resolve responsive pixel sizing styles
  const sizingStyle = {
    '--logo-w-mobile': `${sizeMobile}px`,
    '--logo-w-tablet': `${sizeTablet}px`,
    '--logo-w-desktop': `${sizeDesktop}px`,
  } as React.CSSProperties;

  // Spacing custom margin & padding styles
  const layoutStyle = {
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    marginLeft: `${marginLeft}px`,
    marginRight: `${marginRight}px`,
    padding: `${padding}px`,
    opacity: opacity,
    color: colorAccent,
    borderColor: colorAccent,
    transform: position === 'custom' ? `translate(${customX}px, ${customY}px)` : undefined,
  } as React.CSSProperties;

  // Animations classes mapper
  let animationClass = '';
  if (animation === 'spin-slow') {
    animationClass = 'animate-spin';
  } else if (animation === 'bounce-slow') {
    animationClass = 'animate-bounce';
  } else if (animation === 'pulse-slow') {
    animationClass = 'animate-pulse';
  } else if (animation === 'glow-breath') {
    animationClass = 'animate-pulse filter drop-shadow-[0_0_15px_rgba(229,192,96,0.6)]';
  } else if (animation === 'slide-in') {
    animationClass = 'transition-transform duration-1000 ease-out translate-x-0';
  }

  // Hover Effect mapper
  let hoverClass = '';
  if (hoverEffect === 'scale') {
    hoverClass = 'hover:scale-110 active:scale-95 transition-all duration-300';
  } else if (hoverEffect === 'rotate') {
    hoverClass = 'hover:rotate-6 hover:scale-105 active:scale-95 transition-all duration-300';
  } else if (hoverEffect === 'brightness') {
    hoverClass = 'hover:brightness-125 transition-all duration-200';
  } else if (hoverEffect === 'gold-shine') {
    hoverClass = 'hover:filter hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] transition-all duration-300';
  }

  // Alignment classes mapper based on "position"
  let alignmentClass = 'flex items-center gap-3';
  if (position === 'center') {
    alignmentClass = 'flex flex-col md:flex-row items-center justify-center text-center md:text-right gap-3';
  } else if (position === 'right') {
    alignmentClass = 'flex items-center justify-end text-right gap-3';
  }

  // Choose correct image/svg content based on light or dark modes
  const imageSrc = mode === 'light' ? (imageSrcLight || imageSrcDark) : (imageSrcDark || imageSrcLight);
  const svgSource = mode === 'light' ? (svgCodeLight || svgCodeDark) : (svgCodeDark || svgCodeLight);

  // Default Luxury "Y" SVG / Icon Renderer
  const renderFallbackIcon = () => (
    <div 
      className={`relative flex items-center justify-center w-[var(--logo-w-mobile)] h-[var(--logo-w-mobile)] sm:w-[var(--logo-w-tablet)] sm:h-[var(--logo-w-tablet)] lg:w-[var(--logo-w-desktop)] lg:h-[var(--logo-w-desktop)] rounded-xl bg-gradient-to-br from-neutral-900 to-gold-950 border shadow-inner ${animationClass} ${hoverClass}`}
      style={{
        borderColor: colorAccent || '#e5c060',
        boxShadow: `inset 0 2px 8px rgba(0,0,0,0.8), 0 0 10px ${(colorAccent || '#e5c060')}22`
      }}
    >
      <span 
        className="text-xl md:text-2xl font-black font-sans tracking-widest leading-none drop-shadow"
        style={{ color: colorAccent || '#e5c060' }}
      >
        {isAr ? 'Y' : 'Y'}
      </span>
      <div 
        className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-neutral-950"
        style={{ backgroundColor: colorAccent || '#e5c060' }}
      ></div>
    </div>
  );

  // Render content depending on chosen asset type
  const renderLogoGraphic = () => {
    switch (logoType) {
      case 'image':
        if (!imageSrc) return renderFallbackIcon();
        return (
          <img 
            src={imageSrc} 
            alt="YAFTA Custom Brand Logo" 
            referrerPolicy="no-referrer"
            className={`object-contain w-[var(--logo-w-mobile)] sm:w-[var(--logo-w-tablet)] lg:w-[var(--logo-w-desktop)] ${animationClass} ${hoverClass}`}
          />
        );
      case 'svg':
        if (!svgSource) return renderFallbackIcon();
        return (
          <div 
            className={`w-[var(--logo-w-mobile)] sm:w-[var(--logo-w-tablet)] lg:w-[var(--logo-w-desktop)] cursor-pointer overflow-hidden ${animationClass} ${hoverClass}`}
            style={{ color: colorAccent }}
            dangerouslySetInnerHTML={{ __html: svgSource }}
          />
        );
      case 'text':
        // Pure text brand logo, no graphic container
        return null;
      case 'icon':
      default:
        return renderFallbackIcon();
    }
  };

  return (
    <div 
      className={`${alignmentClass} ${className} cursor-pointer`} 
      style={{ ...sizingStyle, ...layoutStyle }} 
      onClick={onClick}
    >
      {/* 1. Brand Logo Image or Vector */}
      {renderLogoGraphic()}

      {/* 2. Brand Typography (Right-to-Left or Left-to-Right responsive layout alignment) */}
      <div className={`flex flex-col ${isAr ? 'text-right' : 'text-left'}`}>
        <span 
          className="text-xl font-extrabold tracking-widest font-sans uppercase"
          style={{ color: colorAccent || '#e5c060' }}
        >
          {isAr ? brandTextAr : brandTextEn}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-400">
          {isAr ? brandSubtitleAr : brandSubtitleEn}
        </span>
      </div>
    </div>
  );
}
