/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId, Project, BeforeAfterItem } from '../types';
import { PROJECTS_DATA, BEFORE_AFTER_DATA } from '../data';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { 
  Calendar, Tag, ShieldCheck, FileText, ArrowLeft, Star, MessageSquare, 
  GripVertical, Edit2, Trash2, CheckCircle2, Eye, EyeOff, Plus, 
  Settings, Check, X, Shield, RefreshCw, Sparkles, Image, Play, Sliders
} from 'lucide-react';

interface Props {
  isAr: boolean;
  selectedProject: Project | null;
  setSelectedProject: (proj: Project | null) => void;
  setActivePage: (page: PageId) => void;
  projectsList?: Project[];
  setProjectsList?: (projs: Project[]) => void;
  beforeAfterItems?: BeforeAfterItem[];
  currentUser?: any;
}

// Inline Sub-component: Interactive Before/After Reveal Slider Modal
interface BeforeAfterModalProps {
  project: Project;
  isAr: boolean;
  onClose: () => void;
}

function ProjectBeforeAfterModal({ project, isAr, onClose }: BeforeAfterModalProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallback before image generator/placeholder
  const beforeImage = project.beforeImage || (() => {
    switch (project.category) {
      case 'cladding':
        return 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800'; // building scaffolding / raw concrete
      case 'printing':
        return 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800'; // blank canvas / conceptual sketching
      case 'digital':
      case 'websites':
      case 'apps':
        return 'https://images.unsplash.com/photo-1541462608141-2c099415e42a?q=80&w=800'; // technical desk / wireframing schematic
      case 'identity':
      case 'socialmedia':
        return 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800'; // sketch paper / grid layout
      default:
        return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800'; // deep dark geometric structure
    }
  })();

  const afterImage = project.afterImage || project.coverImage;

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-gold-505/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 text-neutral-400 hover:text-white bg-neutral-950/80 rounded-full border border-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Comparison Slider Frame */}
        <div className="w-full md:w-2/3 relative h-[300px] sm:h-[400px] md:h-[500px] select-none bg-neutral-950 overflow-hidden flex-1">
          <div 
            ref={containerRef}
            className="relative w-full h-full cursor-ew-resize"
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            onMouseMove={(e) => {
              if (!isDragging) return;
              handleMove(e.clientX);
            }}
            onTouchMove={(e) => {
              if (!isDragging || e.touches.length === 0) return;
              handleMove(e.touches[0].clientX);
            }}
          >
            {/* BEFORE IMAGE (Lower layer / right layer) */}
            <img 
              src={beforeImage} 
              alt="Before YAFTA execution"
              className="absolute inset-0 w-full h-full object-cover filter brightness-90 saturate-50"
              referrerPolicy="no-referrer"
            />
            {/* Draggable/Clipped AFTER IMAGE */}
            <div 
              className="absolute inset-0 h-full overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img 
                src={afterImage} 
                alt="After YAFTA execution"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: containerRef.current?.offsetWidth || '100vw', maxWidth: 'none' }}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Slider Dividing Bar */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-gold-505 via-gold-300 to-gold-600 z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-neutral-950 border-2 border-gold-505 flex items-center justify-center shadow-lg text-gold-505">
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
              </div>
            </div>

            {/* Floating Side Badges */}
            <div className="absolute left-4 bottom-4 z-30 bg-gold-950/95 text-gold-300 font-bold px-3 py-1.5 rounded-lg border border-gold-505/30 text-[10px] sm:text-xs flex items-center gap-1.5 shadow">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-505 animate-pulse"></span>
              <span>{isAr ? 'بعد التنفيذ' : 'After Execution'}</span>
            </div>

            <div className="absolute right-4 bottom-4 z-30 bg-red-950/95 text-red-200 font-bold px-3 py-1.5 rounded-lg border border-red-500/20 text-[10px] sm:text-xs flex items-center gap-1.5 shadow">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>{isAr ? 'قبل التنفيذ' : 'Before Execution'}</span>
            </div>

            {/* Slider Drag Prompt */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-black/80 backdrop-blur-md border border-gold-505/20 text-gold-200 text-[10px] px-3 py-1 rounded-full pointer-events-none select-none text-center">
              {isAr ? '◄ اسحب المقبض لرؤية الفرق الفني ►' : '◄ Drag handle to reveal transformation ►'}
            </div>
          </div>
        </div>

        {/* Metadata sidebar info */}
        <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[300px] md:max-h-full bg-neutral-900 border-t md:border-t-0 md:border-r border-neutral-800 text-right font-sans">
          <div className="space-y-4">
            <span className="text-[9px] bg-gold-950 text-gold-300 font-bold border border-gold-505/20 px-2 py-0.5 rounded tracking-widest uppercase inline-block font-mono">
              {project.category.toUpperCase()}
            </span>
            <h3 className="text-lg md:text-xl font-extrabold text-white leading-tight">
              {isAr ? project.titleAr : project.titleEn}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {isAr ? project.overviewAr : project.overviewEn}
            </p>

            <div className="border-t border-neutral-800 pt-4 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">{isAr ? 'العميل:' : 'Client:'}</span>
                <span className="text-white font-bold">{isAr ? project.clientAr : project.clientEn}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">{isAr ? 'تاريخ التسليم:' : 'Completion:'}</span>
                <span className="text-gold-300 font-bold">{project.completionDate}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">{isAr ? 'المواصفات الفنية:' : 'Specifications:'}</span>
                <span className="text-neutral-300 font-semibold text-right max-w-[150px] truncate">{isAr ? project.serviceTypeAr : project.serviceTypeEn}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-radial border-neutral-800">
            <button 
              onClick={onClose}
              className="w-full py-2.5 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 font-black rounded-lg text-xs hover:scale-102 transition-transform shadow-md cursor-pointer"
            >
              {isAr ? 'إغلاق المعاينة' : 'Dismiss Comparison'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio({ 
  isAr, 
  selectedProject, 
  setSelectedProject, 
  setActivePage,
  projectsList = PROJECTS_DATA,
  setProjectsList,
  beforeAfterItems = BEFORE_AFTER_DATA,
  currentUser
}: Props) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Modal displays
  const [zoomedBaProject, setZoomedBaProject] = useState<Project | null>(null);
  const [adminEditingProject, setAdminEditingProject] = useState<Project | null>(null);
  const [isAdminCreatingProject, setIsAdminCreatingProject] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  const isAdmin = currentUser?.role === 'Admin';

  // 14 Required categories exactly
  const [categoriesList, setCategoriesList] = useState(() => {
    const saved = localStorage.getItem('yafta_portfolio_categories_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      { id: 'all', ar: 'جميع الأعمال', en: 'All Works' },
      { id: 'cladding', ar: 'واجهات كلادينج', en: 'ACP Cladding Facades' },
      { id: 'acrylic', ar: 'حروف أكريليك', en: 'Acrylic Letters' },
      { id: 'stainless', ar: 'حروف استانلس', en: 'Stainless Steel' },
      { id: 'illuminated', ar: 'حروف مضيئة', en: 'Illuminated Letters' },
      { id: 'letters3d', ar: 'حروف بارزة', en: '3D letters' },
      { id: 'billboards', ar: 'لوحات إعلانية', en: 'Billboards & Signage' },
      { id: 'printing', ar: 'مطبوعات', en: 'Printing Services' },
      { id: 'identity', ar: 'هويات بصرية', en: 'Visual Identities' },
      { id: 'socialmedia', ar: 'سوشيال ميديا', en: 'Social Media' },
      { id: 'websites', ar: 'مواقع إلكترونية', en: 'Websites' },
      { id: 'apps', ar: 'تطبيقات موبايل', en: 'Mobile Apps' },
      { id: 'photography', ar: 'تصوير وإنتاج', en: 'Photography & Media' },
      { id: 'exhibitions', ar: 'معارض ومؤتمرات', en: 'Exhibitions & Events' }
    ];
  });

  const saveCategoriesToLocal = (updatedCats: any[]) => {
    setCategoriesList(updatedCats);
    localStorage.setItem('yafta_portfolio_categories_list', JSON.stringify(updatedCats));
  };

  // Helper template/preset projects if none exist or categories need items
  useEffect(() => {
    // If we have custom fields missing (like visible or featured) or want to ensure healthy listing, inject them
    if (projectsList.length > 0 && projectsList.some(p => p.visible === undefined)) {
      const fixed = projectsList.map(p => ({
        ...p,
        visible: p.visible ?? true,
        featured: p.featured ?? false
      }));
      if (setProjectsList) {
        setProjectsList(fixed);
        localStorage.setItem('yafta_projects_list', JSON.stringify(fixed));
      }
    }
  }, [projectsList, setProjectsList]);

  // Drag and Drop ordering handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (!isAdmin) return;
    setDraggingId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    if (!isAdmin) return;
    e.preventDefault();
    if (draggingId && draggingId !== id) {
      setDragOverId(id);
    }
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    if (!isAdmin) return;
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId && draggedId !== targetId) {
      const dragIndex = projectsList.findIndex((p) => p.id === draggedId);
      const targetIndex = projectsList.findIndex((p) => p.id === targetId);
      if (dragIndex !== -1 && targetIndex !== -1) {
        const updated = [...projectsList];
        const [removed] = updated.splice(dragIndex, 1);
        updated.splice(targetIndex, 0, removed);
        if (setProjectsList) {
          setProjectsList(updated);
          localStorage.setItem('yafta_projects_list', JSON.stringify(updated));
        }
      }
    }
    setDraggingId(null);
    setDragOverId(null);
  };

  // Map sub-filters to core data categories
  const filterProjects = projectsList.filter((proj) => {
    // If not visible, hide from normal visitors
    if (!isAdmin && proj.visible === false) return false;

    if (selectedFilter === 'all') return true;

    // Direct match:
    if (proj.category === selectedFilter) return true;

    // Smart back-mapping for older database items:
    if (selectedFilter === 'cladding' && proj.category === 'cladding') return true;
    if (selectedFilter === 'printing' && proj.category === 'printing') return true;
    if (selectedFilter === 'identity' && proj.category === 'identity') return true;
    
    if (selectedFilter === 'acrylic' && proj.category === 'signage' && (proj.titleAr.includes('أكريليك') || proj.titleEn.toLowerCase().includes('acrylic'))) return true;
    if (selectedFilter === 'stainless' && proj.category === 'signage' && (proj.titleAr.includes('استانلس') || proj.titleAr.includes('ستانلس') || proj.titleEn.toLowerCase().includes('stainless'))) return true;
    if (selectedFilter === 'illuminated' && proj.category === 'signage' && (proj.titleAr.includes('مضيئة') || proj.titleAr.includes('ليد') || proj.titleEn.toLowerCase().includes('led') || proj.titleEn.toLowerCase().includes('illuminated'))) return true;
    if (selectedFilter === 'letters3d' && proj.category === 'signage') return true;
    if (selectedFilter === 'billboards' && proj.category === 'signage') return true;

    if (selectedFilter === 'socialmedia' && (proj.category === 'media' || proj.category === 'other')) return true;
    if (selectedFilter === 'websites' && (proj.category === 'digital' || proj.category === 'other')) return true;
    if (selectedFilter === 'apps' && (proj.category === 'digital' || proj.category === 'other')) return true;
    if (selectedFilter === 'photography' && proj.category === 'media') return true;
    if (selectedFilter === 'exhibitions' && proj.category === 'other') return true;

    return false;
  });

  const handleCloseCaseStudy = () => {
    setSelectedProject(null);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Add Project helper
  const handleAddNewProject = (formValues: any) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      titleAr: formValues.titleAr || 'مشروع جديد مميز',
      titleEn: formValues.titleEn || 'Premium New Showcase Project',
      clientAr: formValues.clientAr || 'شركة يافطة المرموقة',
      clientEn: formValues.clientEn || 'Yafta Elite Corporates',
      category: formValues.category || 'cladding',
      industryAr: formValues.industryAr || 'قطاع الخدمات الإنمائية',
      industryEn: formValues.industryEn || 'Urban Planning & Retailing',
      serviceTypeAr: formValues.serviceTypeAr || 'واجهات وهندسة لافتات ليد متكاملة',
      serviceTypeEn: formValues.serviceTypeEn || 'Custom integrated architectural facade solutions',
      completionDate: formValues.completionDate || '2026',
      overviewAr: formValues.overviewAr || 'تنفيذ احترافي من قِبل خبراء وكالة يافطة لمشروع استثنائي شامل.',
      overviewEn: formValues.overviewEn || 'A luxurious delivery featuring top-tier raw materials engineered by Yafta experts.',
      resultsAr: formValues.resultsAr || 'تحسين الرؤية والإقبال البصري بمعدل لا مثيل له.',
      resultsEn: formValues.resultsEn || 'Dramatically enhanced footfall conversions and outdoor visual prominence.',
      coverImage: formValues.coverImage || 'https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=800',
      galleryImages: [formValues.coverImage || 'https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=800'],
      beforeImage: formValues.beforeImage || '',
      afterImage: formValues.afterImage || '',
      featured: formValues.featured ?? false,
      visible: formValues.visible ?? true
    };

    const updated = [newProj, ...projectsList];
    if (setProjectsList) {
      setProjectsList(updated);
      localStorage.setItem('yafta_projects_list', JSON.stringify(updated));
    }
    setIsAdminCreatingProject(false);
  };

  // Update existing project
  const handleSaveEditedProject = (updatedProj: Project) => {
    const updated = projectsList.map(p => p.id === updatedProj.id ? updatedProj : p);
    if (setProjectsList) {
      setProjectsList(updated);
      localStorage.setItem('yafta_projects_list', JSON.stringify(updated));
    }
    setAdminEditingProject(null);
  };

  // Delete project
  const handleDeletePortfolioProject = (id: string) => {
    if (confirm(isAr ? 'هل أنت متأكد تماماً من رغبتك بحذف هذا المشروع من سابقة الأعمال؟ لا يمكن التراجع عن ذلك.' : 'Delete portfolio permanently?')) {
      const updated = projectsList.filter(p => p.id !== id);
      if (setProjectsList) {
        setProjectsList(updated);
        localStorage.setItem('yafta_projects_list', JSON.stringify(updated));
      }
      setAdminEditingProject(null);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* CASE STUDY DETAIL VIEW */}
      {selectedProject ? (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in px-4 text-right selection:bg-gold-505 selection:text-neutral-950">
          
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gold-550/15">
            <button 
              onClick={handleCloseCaseStudy}
              className="flex items-center gap-2 text-xs md:text-sm font-bold text-gold-505 hover:underline bg-neutral-950 px-4 py-2 rounded-lg border border-gold-505/15 self-start cursor-pointer transition-all duration-200 hover:border-gold-505/40"
            >
              <ArrowLeft className="w-4 h-4 shrink-0 rotate-180" />
              <span>{isAr ? 'العودة لمعرض المشاريع الرئيسي' : 'Back to Main Portfolio'}</span>
            </button>
            <div className="text-[11px] text-neutral-400 font-mono font-bold self-start sm:self-center flex items-center gap-1.5 direction-rtl">
              <Calendar className="w-4 h-4 text-gold-505" />
              <span>{isAr ? 'تاريخ الإنجاز:' : 'Completion date:'} {selectedProject.completionDate}</span>
            </div>
          </div>

          {/* Title block */}
          <div className="space-y-3">
            <span className="text-[10px] font-black text-gold-300 tracking-[0.25em] uppercase bg-gold-950/70 py-1.5 px-3 rounded border border-gold-505/20 inline-block font-mono">
              {selectedProject.category.toUpperCase()} CASE STUDY
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {isAr ? selectedProject.titleAr : selectedProject.titleEn}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-neutral-400 font-semibold pt-1">
              <span>{isAr ? 'العميل الشريك:' : 'Client Partner:'} <strong className="text-gold-505">{isAr ? selectedProject.clientAr : selectedProject.clientEn}</strong></span>
              <span className="text-neutral-700">|</span>
              <span>{isAr ? 'القطاع الصناعي:' : 'Industry:'} <strong className="text-zinc-200">{isAr ? selectedProject.industryAr : selectedProject.industryEn}</strong></span>
            </div>
          </div>

          {/* Main Case Cover */}
          <div className="relative h-[280px] sm:h-[420px] rounded-3xl overflow-hidden border border-gold-505/20 shadow-2xl bg-neutral-950">
            <img 
              src={selectedProject.coverImage} 
              alt={selectedProject.titleEn}
              className="w-full h-full object-cover filter brightness-95"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
          </div>

          {/* Overview & specifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-extrabold text-gold-505 flex items-center gap-2 justify-end">
                  <span>{isAr ? 'ملخص ونطاق المشروع:' : 'Project Overview & Objectives:'}</span>
                  <FileText className="w-5 h-5 text-gold-505" />
                </h3>
                <p className="text-xs md:text-base text-neutral-300 leading-relaxed whitespace-pre-line font-sans">
                  {isAr ? selectedProject.overviewAr : selectedProject.overviewEn}
                </p>
              </div>

              {selectedProject.challengeAr && (
                <div className="space-y-2 pt-4 border-t border-neutral-900">
                  <h3 className="text-lg md:text-xl font-extrabold text-gold-505 flex items-center gap-2 justify-end">
                    <span>{isAr ? 'تحديات الهيكل اللوجستية والإنشائية:' : 'Engineering Challenges & Critical Risks:'}</span>
                    <Shield className="w-5 h-5 text-gold-505" />
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed whitespace-pre-line font-sans">
                    {isAr ? selectedProject.challengeAr : selectedProject.challengeEn}
                  </p>
                </div>
              )}
            </div>

            {/* specifications blueprint */}
            <div className="bg-neutral-950 border border-gold-505/20 p-5 md:p-6 rounded-2xl h-fit space-y-4 shadow-xl">
              <h4 className="text-[10px] font-black tracking-widest text-gold-300 uppercase pb-2 border-b border-gold-505/10 font-mono">
                {isAr ? 'المواصفات الهندسية المعتمدة' : 'TECHNICAL SPECIFICATIONS'}
              </h4>
              
              {selectedProject.specificationsAr ? (
                <ul className="space-y-3 text-xs text-neutral-400">
                  {(isAr ? selectedProject.specificationsAr : selectedProject.specificationsEn || []).map((spec, index) => (
                    <li key={index} className="flex gap-2 items-start justify-start text-right font-sans leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-505 mt-1.5 shrink-0"></span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-neutral-500 italic leading-relaxed">
                  {isAr ? 'أعمال معالجة ضد الرطوبة وعوامل الحرارة الشديدة بضمان يافطة المعمر.' : 'Sealed under extreme durability constraints.'}
                </p>
              )}

              <div className="pt-2 border-t border-gold-505/10">
                <div className="bg-gold-500/5 text-gold-300 p-2.5 rounded border border-gold-505/25 flex items-center gap-1.5 justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-gold-505 shrink-0" />
                  <span>{isAr ? 'أمان الهياكل والرياح معتمد' : 'Structural Wind Safety Guard'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Before/After reveal on actual project inside study! */}
          <div className="bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-gold-505/15 space-y-6">
            <div className="text-center md:text-right space-y-1">
              <h4 className="text-lg md:text-xl font-extrabold text-white flex items-center gap-2 justify-end">
                <span>{isAr ? 'مقارنة التحول الهندسي للمشروع (قبل / بعد) :' : 'Before & After Engineering Transformation Comparison:'}</span>
                <Sliders className="w-5 h-5 text-gold-505" />
              </h4>
              <p className="text-xs text-neutral-400">
                {isAr ? 'اسحب المقبض في المنتصف لمعاينة جودة التركيب المعماري الدقيق.' : 'Interactively slide back-and-forth to verify quality architectural upgrades.'}
              </p>
            </div>

            {/* Slider Container on project detail page */}
            <div>
              <BeforeAfterSlider 
                isAr={isAr}
                item={{
                  id: selectedProject.id,
                  categoryAr: isAr ? selectedProject.industryAr : selectedProject.industryEn,
                  categoryEn: selectedProject.industryEn,
                  titleAr: selectedProject.titleAr,
                  titleEn: selectedProject.titleEn,
                  beforeImage: selectedProject.beforeImage || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800',
                  afterImage: selectedProject.afterImage || selectedProject.coverImage,
                  specsAr: selectedProject.specificationsAr || [],
                  specsEn: selectedProject.specificationsEn || []
                }}
              />
            </div>
          </div>

          {/* Additional details (Research / Concept) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b border-gold-505/10 py-8 font-sans">
            {selectedProject.researchAr && (
              <div className="space-y-2">
                <h4 className="text-base font-bold text-white flex items-center gap-2 justify-end">
                  <span>{isAr ? 'الدراسة والتخطيط الهندسي:' : 'Engineering Mapping & Site Audit:'}</span>
                  <span className="text-xs font-mono bg-gold-950 p-1 px-2 text-gold-505 border border-gold-505/30 rounded font-black">01</span>
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed text-right md:pr-8">
                  {isAr ? selectedProject.researchAr : selectedProject.researchEn}
                </p>
              </div>
            )}
            {selectedProject.conceptAr && (
              <div className="space-y-2">
                <h4 className="text-base font-bold text-white flex items-center gap-2 justify-end">
                  <span>{isAr ? 'الروح والتصميم الإبداعي الشامل:' : 'Philosophical Graphic Identity & Spirit:'}</span>
                  <span className="text-xs font-mono bg-gold-950 p-1 px-2 text-gold-505 border border-gold-505/30 rounded font-black">02</span>
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed text-right md:pr-8">
                  {isAr ? selectedProject.conceptAr : selectedProject.conceptEn}
                </p>
              </div>
            )}
          </div>

          {/* Results check */}
          <div className="bg-gradient-to-r from-gold-950/40 via-neutral-900 to-gold-950/40 p-6 md:p-8 rounded-2xl border border-gold-505/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans text-right">
            <div>
              <h4 className="text-base font-black text-gold-505 mb-1">{isAr ? 'أثر الهوية البصرية والنتائج التجارية:' : 'Business Revenue Yield & Conversion Metrics:'}</h4>
              <p className="text-xs md:text-sm text-neutral-200">
                {isAr ? selectedProject.resultsAr : selectedProject.resultsEn}
              </p>
            </div>
            <div className="shrink-0 bg-gold-505 text-neutral-950 font-black text-center px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider self-start sm:self-center">
              {isAr ? 'أثر تشغيلي ومثبت ✓' : 'Tangible Revenue Lift ✓'}
            </div>
          </div>

          {/* Feedback */}
          {selectedProject.feedbackAr && (
            <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-2xl space-y-4 relative overflow-hidden font-sans text-right">
              <div className="flex items-center gap-1.5 text-gold-505 justify-end">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current text-gold-505" />
                ))}
              </div>
              <blockquote className="text-xs md:text-sm italic text-neutral-300 leading-relaxed">
                "{isAr ? selectedProject.feedbackAr : selectedProject.feedbackEn}"
              </blockquote>
              <cite className="not-italic text-[11px] font-bold text-neutral-400 block mt-1.5 font-sans">
                — {isAr ? selectedProject.clientAr : selectedProject.clientEn}
              </cite>
            </div>
          )}

          {/* Gallery block */}
          <div className="space-y-4">
            <h4 className="text-base font-extrabold text-gold-505">{isAr ? 'ألبوم صور تفاصيل المشروع والتصنيع:' : 'Industrial Build Details Gallery:'}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedProject.galleryImages.map((img, idx) => (
                <div key={idx} className="h-40 rounded-xl overflow-hidden border border-gold-505/10">
                  <img src={img} alt={`Gallery index ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick contact */}
          <div className="border-t border-gold-550/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
            <h4 className="text-base text-neutral-300 font-bold">
              {isAr ? 'هل تود الحصول على تشطيب لافتة أو واجهة بنفس المستوى الهندسي المتميز لعلامتك؟' : 'Ready to upgrade your store layout with identical precision?'}
            </h4>
            <button 
              onClick={() => {
                setActivePage('contact');
                setSelectedProject(null);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-gradient-to-r from-gold-300 to-gold-505 hover:from-gold-200 hover:to-gold-300 text-neutral-950 font-black rounded-lg text-xs hover:scale-103 transition-transform cursor-pointer"
            >
              {isAr ? 'تواصل معنا واطلب مقايسة أعمالك' : 'Get Matching Quote Now'}
            </button>
          </div>

        </div>
      ) : (
        /* PORTFOLIO LISTING HOME */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 selection:bg-gold-505 selection:text-neutral-950">
          
          {/* Section banner */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-1 bg-gold-950/80 border border-gold-505/20 text-gold-300 font-bold text-[10px] md:text-xs px-3 py-1.5 rounded-full select-none uppercase tracking-widest font-sans">
              <Sparkles className="w-3.5 h-3.5 text-gold-505" />
              <span>{isAr ? 'سجل الإنجاز والروعة الميدانية' : 'ELITE MECHANICAL SIGNAGE PORTFOLIO'}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
              {isAr ? 'أعمالنا' : 'Our Work'}
            </h1>
            <p className="text-sm md:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed font-sans">
              {isAr ? 'استكشف مشاريع يافطة في جميع القطاعات' : 'Explore YAFTA flagship projects delivered with utmost engineering excellence'}
            </p>
          </div>

          {/* Admin Command Bars */}
          {isAdmin && (
            <div className="p-4 bg-neutral-950 border border-gold-505/30 rounded-2xl flex flex-wrap items-center justify-between gap-4 font-sans">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold-505 animate-ping"></div>
                <span className="text-xs font-black text-gold-300">{isAr ? 'التحكم الإداري المباشر' : 'Admin Operations Console'}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-right">
                <button 
                  onClick={() => setIsCategoryManagerOpen(true)}
                  className="px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-gold-505/40 text-neutral-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-gold-300" />
                  <span>{isAr ? 'إدارة تصنيفات المعرض' : 'Manage Categories'}</span>
                </button>
                <button 
                  onClick={() => setIsAdminCreatingProject(true)}
                  className="px-3.5 py-2 rounded-lg bg-gold-950 border border-gold-505/40 hover:bg-gold-900 text-gold-300 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-gold-505" />
                  <span>{isAr ? 'إضافة مشروع جديد للمعرض' : 'Add New Project'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Horizontal Scrollable Category Tabs */}
          <div className="relative pt-4 border-t border-gold-550/10">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-950 to-transparent z-15 pointer-events-none md:hidden"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-neutral-950 to-transparent z-15 pointer-events-none md:hidden"></div>
            
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none pb-2 select-none direction-rtl max-w-full">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`px-4 py-2 text-xs font-black rounded-full border transition-all cursor-pointer inline-flex items-center gap-1 ${
                    selectedFilter === cat.id
                      ? 'bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 border-gold-505 shadow-[0_0_15px_rgba(229,192,96,0.2)]'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-900 hover:text-white hover:border-gold-505/30'
                  }`}
                >
                  <span>{isAr ? cat.ar : cat.en}</span>
                  {selectedFilter === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-pulse"></span>}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Drag and Drop Information Banner */}
          {isAdmin && (
            <div className="bg-gradient-to-r from-gold-950/40 via-neutral-905 to-gold-950/40 p-4 rounded-xl border border-gold-505/20 text-right flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in font-sans">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-505/10 rounded-lg border border-gold-505/20 text-gold-505">
                  <GripVertical className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">
                    {isAr ? 'بنية السحب والإفلات لترتيب الأعمال نشط' : 'Admin Custom Project Sorters is Active'}
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    {isAr ? 'يمكنك سحب أي بطاقة أعمال بأصبعك أو الماوس من مقبض الترتيب وإفلاتها مباشرة لتغيير تموضعها بالمعرض.' : 'Drag project cards using handles to reorder live on screen.'}
                  </p>
                </div>
              </div>
              <span className="text-[9px] bg-gold-950 text-gold-300 font-bold border border-gold-505/20 px-2 py-0.5 rounded font-mono">
                {isAr ? 'حفظ فوري نشط ✓' : 'AUTO-PERSIST SHIELD ✓'}
              </span>
            </div>
          )}

          {/* Grid display logic with support, and horizontal swipe scrolling on mobile */}
          <motion.div 
            key={selectedFilter}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
            initial="hidden"
            animate="show"
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-6 md:pb-0 scroll-smooth scrollbar-none"
          >
            {filterProjects.map((item, index) => (
              <motion.div 
                key={item.id}
                layout
                draggable={isAdmin}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, item.id)}
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  show: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
                  }
                }}
                whileHover={isAdmin ? {} : { 
                  y: -6,
                  scale: 1.01,
                  borderColor: "rgba(229, 192, 96, 0.35)",
                  boxShadow: "0 15px 30px -8px rgba(0,0,0,0.8), 0 0 15px rgba(229,192,96,0.06)",
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                className={`snap-center shrink-0 w-[82vw] sm:w-[48vw] md:w-auto bg-neutral-950 border rounded-2xl overflow-hidden flex flex-col font-sans transition-all duration-300 ${
                  draggingId === item.id 
                    ? 'opacity-40 border-gold-505/50 scale-95' 
                    : dragOverId === item.id
                    ? 'border-gold-505 border-dashed scale-102 bg-neutral-900 shadow-lg'
                    : 'border-gold-500/10'
                } ${isAdmin ? 'cursor-grab active:cursor-grabbing hover:border-gold-505/30' : ''}`}
              >
                {/* Cover Frame */}
                <div 
                  className="relative h-48 sm:h-52 overflow-hidden group cursor-pointer bg-neutral-900"
                  onClick={() => setSelectedProject(item)}
                >
                  <img 
                    src={item.coverImage} 
                    alt={item.titleEn}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 z-10"></div>
                  
                  {/* Category overlay tab */}
                  <div className="absolute left-3 top-3 z-15 bg-neutral-950/95 text-[9px] text-gold-505 font-bold tracking-widest px-2.5 py-1 rounded border border-gold-505/20 uppercase font-mono">
                    {isAr ? categoriesList.find(c => c.id === item.category)?.ar || item.category : item.category.toUpperCase()}
                  </div>

                  {/* Badges */}
                  <div className="absolute right-3 top-3 z-15 flex flex-col items-end gap-1.5">
                    {item.featured && (
                      <span className="bg-gold-505 text-neutral-950 text-[8px] font-black px-2 py-0.5 rounded border border-neutral-950 flex items-center gap-1 shadow">
                        <Star className="w-2.5 h-2.5 fill-current text-neutral-950" />
                        <span>{isAr ? 'مميز' : 'FEATURED'}</span>
                      </span>
                    )}
                    {item.visible === false && (
                      <span className="bg-rose-950/95 text-rose-300 text-[8px] font-mono font-bold px-2 py-0.5 rounded border border-rose-500/30 flex items-center gap-1 shadow">
                        <EyeOff className="w-2.5 h-2.5" />
                        <span>{isAr ? 'مسودة مخفية' : 'HIDDEN'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Info block */}
                <div className="p-4 flex-1 flex flex-col justify-between text-right">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[9px] text-neutral-500 font-bold font-mono">
                      <span>{isAr ? item.clientAr : item.clientEn}</span>
                      <span>{item.completionDate}</span>
                    </div>

                    <h3 
                      onClick={() => setSelectedProject(item)}
                      className="text-sm sm:text-base font-extrabold text-white hover:text-gold-505 transition-colors cursor-pointer line-clamp-1"
                    >
                      {isAr ? item.titleAr : item.titleEn}
                    </h3>

                    <p className="text-[11px] sm:text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {isAr ? item.overviewAr : item.overviewEn}
                    </p>
                  </div>

                  {/* Actions row */}
                  <div className="pt-3 border-t border-gold-500/10 mt-3.5 flex items-center justify-between gap-1.5 font-sans">
                    {/* Before/After button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedBaProject(item);
                      }}
                      className="px-2.5 py-1 bg-gold-950 hover:bg-gold-900 border border-gold-505/30 hover:border-gold-505/60 text-gold-300 text-[10px] font-black rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Sliders className="w-3 h-3 text-gold-505" />
                      <span>{isAr ? 'قبل / بعد' : 'Before/After'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {isAdmin && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setAdminEditingProject(item);
                          }}
                          className="p-1 px-1.5 bg-neutral-900 border border-neutral-800 hover:border-gold-505/30 text-neutral-400 hover:text-white rounded cursor-pointer"
                          title={isAr ? 'تعديل البيانات' : 'Edit specifications'}
                        >
                          <Edit2 className="w-3 h-3 text-gold-505" />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => setSelectedProject(item)}
                        className="text-[10px] font-bold text-neutral-400 hover:text-gold-505 transition-colors"
                      >
                        {isAr ? 'دراسة حالة 📝' : 'Case Study 📝'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {filterProjects.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-12 bg-neutral-950/70 rounded-2xl border border-gold-505/20 space-y-4 w-full h-fit flex flex-col items-center justify-center p-8">
                <div className="p-3 bg-neutral-900 rounded-lg text-neutral-500">
                  <Tag className="w-6 h-6" />
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
                  {isAr 
                    ? 'لم يتم تسجيل أعمال منجزة بعد في هذا القسم الفرعي المعين. يمكنك إضافتها من لوحة إدارة المشرفين أعلاه بكل سهولة.' 
                    : 'Currently empty under this tag. Administrators can dynamically log new showpieces.'}
                </p>
                <button 
                  onClick={() => setSelectedFilter('all')}
                  className="px-4 py-2 bg-neutral-905 text-gold-505 text-xs font-black rounded-lg border border-gold-505/25 hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  {isAr ? 'استعراض كافة الأعمال المتاحة' : 'View All Works'}
                </button>
              </div>
            )}
          </motion.div>

        </div>
      )}

      {/* RENDER BEFORE/AFTER COMPARISON MODAL */}
      {zoomedBaProject && (
        <ProjectBeforeAfterModal 
          project={zoomedBaProject}
          isAr={isAr}
          onClose={() => setZoomedBaProject(null)}
        />
      )}

      {/* RENDER NEW PROJECT FORM MODAL */}
      {isAdminCreatingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/95 backdrop-blur-md animate-fade-in text-right font-sans">
          <div className="bg-neutral-900 border border-gold-505/20 max-w-2xl w-full rounded-2xl p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
              <button onClick={() => setIsAdminCreatingProject(false)} className="text-neutral-500 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              <h3 className="text-base sm:text-lg font-black text-white">{isAr ? 'إدراج مشروع سابقة أعمال جديد بالمعرض' : 'Add New Portfolio Entry'}</h3>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              handleAddNewProject({
                titleAr: fd.get('titleAr'),
                titleEn: fd.get('titleEn'),
                clientAr: fd.get('clientAr'),
                clientEn: fd.get('clientEn'),
                category: fd.get('category'),
                completionDate: fd.get('completionDate'),
                coverImage: fd.get('coverImage'),
                beforeImage: fd.get('beforeImage'),
                afterImage: fd.get('afterImage'),
                overviewAr: fd.get('overviewAr'),
                overviewEn: fd.get('overviewEn'),
                industryAr: fd.get('industryAr'),
                industryEn: fd.get('industryEn'),
                serviceTypeAr: fd.get('serviceTypeAr'),
                serviceTypeEn: fd.get('serviceTypeEn'),
                featured: fd.get('featured') === 'true',
                visible: fd.get('visible') !== 'false'
              });
            }} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'عنوان المشروع (عربي):' : 'Title (Arabic):'}</label>
                  <input required name="titleAr" type="text" className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded focus:border-gold-505" />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'عنوان المشروع (إنجليزي):' : 'Title (English):'}</label>
                  <input required name="titleEn" type="text" className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded focus:border-gold-505 text-left" />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'اسم الشريك/العميل (عربي):' : 'Client Name (Arabic):'}</label>
                  <input required name="clientAr" type="text" className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded focus:border-gold-505" />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'اسم الشريك/العميل (إنجليزي):' : 'Client Name (English):'}</label>
                  <input required name="clientEn" type="text" className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded focus:border-gold-505 text-left" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'التصنيف الرئيسي بالتطبيق:' : 'Display Category:'}</label>
                  <select name="category" className="w-full bg-neutral-950 border border-neutral-800 text-gold-300 p-2 rounded focus:border-gold-505">
                    {categoriesList.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{isAr ? c.ar : c.en}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 font-mono">
                  <label className="text-neutral-400 block">{isAr ? 'تاريخ التنفيذ (مثال: 2026-05) :' : 'Completion date (Ex: 2026-05):'}</label>
                  <input required name="completionDate" defaultValue="2026-05" type="text" className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded focus:border-gold-505 text-left" />
                </div>
              </div>

              {/* Image Fields */}
              <div className="space-y-1.5 border-t border-neutral-800 pt-3">
                <span className="text-gold-505 text-[11px] font-black block">{isAr ? 'روابط وموارد الصور (مستلمة ومحفورة):' : 'Digital asset resource locators:'}</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div>
                    <label className="text-neutral-500 block text-[9px]">{isAr ? 'رابط غلاف المشروع:' : 'Cover image link:'}</label>
                    <input name="coverImage" type="text" defaultValue="https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=800" className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded text-[10px]" />
                  </div>
                  <div>
                    <label className="text-neutral-500 block text-[9px]">{isAr ? 'رابط الحالة "قبل التنفيذ":' : 'Before renovation link:'}</label>
                    <input name="beforeImage" type="text" placeholder="https://..." className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded text-[10px]" />
                  </div>
                  <div>
                    <label className="text-neutral-500 block text-[9px]">{isAr ? 'رابط الحالة "بعد التنفيذ":' : 'After renovation link:'}</label>
                    <input name="afterImage" type="text" placeholder="https://..." className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded text-[10px]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-neutral-800 pt-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'وصف تفاصيل المشروع (عربي):' : 'Project overview (Arabic):'}</label>
                  <textarea name="overviewAr" rows={2} className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded text-[11px] focus:border-gold-505"></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'وصف تفاصيل المشروع (إنجليزي):' : 'Project overview (English):'}</label>
                  <textarea name="overviewEn" rows={2} className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded text-[11px] focus:border-gold-505 text-left"></textarea>
                </div>
              </div>

              <div className="flex items-center gap-6 border-t border-neutral-800 pt-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input type="checkbox" name="featured" value="true" className="rounded-full bg-neutral-950 border-neutral-800 text-gold-505 accent-gold-505" />
                  <span>{isAr ? 'تمييز كـ مشروع مميز ببنر خاص 🌟' : 'Feature inside key focus rows 🌟'}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input type="checkbox" name="visible" value="true" defaultChecked className="rounded-full bg-neutral-950 border-neutral-800 text-gold-505 accent-gold-505" />
                  <span>{isAr ? 'نشر فوري للعامة' : 'Publish live directly for public visitors'}</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
                <button type="button" onClick={() => setIsAdminCreatingProject(false)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 cursor-pointer">{isAr ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 font-black rounded shadow hover:scale-101 transition-transform cursor-pointer">{isAr ? 'حفظ ونشر' : 'Create & Publish'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENDER EDIT PROJECT DETAILS FILE MODAL */}
      {adminEditingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/95 backdrop-blur-md animate-fade-in text-right font-sans">
          <div className="bg-neutral-900 border border-gold-505/20 max-w-2xl w-full rounded-2xl p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
              <button 
                type="button"
                onClick={() => handleDeletePortfolioProject(adminEditingProject.id)}
                className="px-3 py-1.5 bg-rose-950/50 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-[10px] font-black rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'حذف هذا العمل تماماً' : 'Delete Project Permanently'}</span>
              </button>
              <h3 className="text-base sm:text-lg font-black text-white">{isAr ? 'تعديل بيانات مشروع المعرض' : 'Edit Project Details'}</h3>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              handleSaveEditedProject({
                ...adminEditingProject,
                titleAr: fd.get('titleAr') as string,
                titleEn: fd.get('titleEn') as string,
                clientAr: fd.get('clientAr') as string,
                clientEn: fd.get('clientEn') as string,
                category: fd.get('category') as string,
                completionDate: fd.get('completionDate') as string,
                coverImage: fd.get('coverImage') as string,
                beforeImage: fd.get('beforeImage') as string,
                afterImage: fd.get('afterImage') as string,
                overviewAr: fd.get('overviewAr') as string,
                overviewEn: fd.get('overviewEn') as string,
                featured: fd.get('featured') === 'true',
                visible: fd.get('visible') === 'true'
              });
            }} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'العنوان بالعربية:' : 'Title (Arabic):'}</label>
                  <input required name="titleAr" defaultValue={adminEditingProject.titleAr} type="text" className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded" />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'العنوان بالإنجليزية:' : 'Title (English):'}</label>
                  <input required name="titleEn" defaultValue={adminEditingProject.titleEn} type="text" className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded text-left" />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'العميل بالعربية:' : 'Client (Arabic):'}</label>
                  <input required name="clientAr" defaultValue={adminEditingProject.clientAr} type="text" className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded" />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'العميل بالإنجليزية:' : 'Client (English):'}</label>
                  <input required name="clientEn" defaultValue={adminEditingProject.clientEn} type="text" className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded text-left" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'التصنيف كقسم فرعي:' : 'Portfolio Category:'}</label>
                  <select name="category" defaultValue={adminEditingProject.category} className="w-full bg-neutral-950 border border-neutral-800 text-gold-300 p-2 rounded">
                    {categoriesList.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{isAr ? c.ar : c.en}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1 font-mono">
                  <label className="text-neutral-400 block">{isAr ? 'تاريخ التنفيذ:' : 'Completion Date:'}</label>
                  <input required name="completionDate" defaultValue={adminEditingProject.completionDate} type="text" className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded text-left" />
                </div>
              </div>

              {/* Image URL updates */}
              <div className="space-y-1.5 border-t border-neutral-800 pt-3 font-mono text-[11px]">
                <span className="text-gold-505 block font-bold">{isAr ? 'تعديل واستبدال صور المشروع (Image Replacement):' : 'Digital image assets:'}</span>
                <div className="grid grid-cols-1 gap-2.5">
                  <div>
                    <label className="text-neutral-500 block text-[9px]">{isAr ? 'رابط الغلاف الرئيسي (Cover Link):' : 'Main cover image url:'}</label>
                    <input name="coverImage" defaultValue={adminEditingProject.coverImage} type="text" className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded text-[10px]" />
                  </div>
                  <div>
                    <label className="text-neutral-500 block text-[9px]">{isAr ? 'رابط صورة "قبل التنفيذ" (Before Link):' : 'Before photo url (comparison):'}</label>
                    <input name="beforeImage" defaultValue={adminEditingProject.beforeImage || ''} placeholder="https://..." type="text" className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded text-[10px]" />
                  </div>
                  <div>
                    <label className="text-neutral-500 block text-[9px]">{isAr ? 'رابط صورة "بعد التنفيذ" (After Link):' : 'After photo url (comparison):'}</label>
                    <input name="afterImage" defaultValue={adminEditingProject.afterImage || ''} placeholder="https://..." type="text" className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded text-[10px]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-neutral-800 pt-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'الوصف بالعربية:' : 'Overview (Arabic):'}</label>
                  <textarea name="overviewAr" defaultValue={adminEditingProject.overviewAr} rows={3} className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded text-[11px]"></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">{isAr ? 'الوصف بالإنجليزية:' : 'Overview (English):'}</label>
                  <textarea name="overviewEn" defaultValue={adminEditingProject.overviewEn} rows={3} className="w-full bg-neutral-950 border border-neutral-800 text-white p-2 rounded text-[11px] text-left"></textarea>
                </div>
              </div>

              <div className="flex items-center gap-6 border-t border-neutral-800 pt-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input type="checkbox" name="featured" value="true" defaultChecked={adminEditingProject.featured} className="rounded bg-neutral-950 border-neutral-800 text-gold-505 accent-gold-505" />
                  <span>{isAr ? 'تعليم كـ مشروع مميز 🌟' : 'Featured Product Project 🌟'}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input type="checkbox" name="visible" value="true" defaultChecked={adminEditingProject.visible !== false} className="rounded bg-neutral-950 border-neutral-800 text-gold-505 accent-gold-505" />
                  <span>{isAr ? 'نشر عام وظاهر للزوار' : 'Visible online for all customers'}</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
                <button type="button" onClick={() => setAdminEditingProject(null)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 cursor-pointer">{isAr ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 font-black rounded shadow hover:scale-101 transition-transform cursor-pointer">{isAr ? 'حفظ التغييرات ✓' : 'Save Changes ✓'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENDER CATEGORY MANAGER PANEL MODAL */}
      {isCategoryManagerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/95 backdrop-blur-md animate-fade-in text-right font-sans">
          <div className="bg-neutral-900 border border-gold-505/20 max-w-md w-full rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <button onClick={() => setIsCategoryManagerOpen(false)} className="text-neutral-500 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              <h3 className="text-base sm:text-lg font-black text-white">{isAr ? 'إدارة تصنيفات المعرض الذكية' : 'Category Management Hub'}</h3>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] text-neutral-400 block leading-relaxed">{isAr ? 'يمكنك تحسين أو إضافة أو تعديل مسميات وبنية التصنيفات الفرعية الـ 14 المتاحة بالمعرض حالياً:' : 'Update tags or append custom categories to suit project expansions:'}</span>
              
              <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                {categoriesList.map((cat, idx) => (
                  <div key={cat.id} className="flex items-center gap-2 bg-neutral-955 p-2 rounded-lg border border-neutral-800 justify-between">
                    {cat.id !== 'all' ? (
                      <button 
                        onClick={() => {
                          if (confirm(isAr ? 'هل تود حذف هذا التصنيف نهائياً؟ قد يؤدي لحذف ربط المشاريع المرتبطة به.' : 'Delete category?')) {
                            const updated = categoriesList.filter(c => c.id !== cat.id);
                            saveCategoriesToLocal(updated);
                          }
                        }}
                        className="text-rose-400 hover:text-rose-300 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : <span className="w-6"></span>}
                    
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <input 
                        type="text" 
                        value={cat.ar} 
                        onChange={(e) => {
                          const updated = categoriesList.map((c, i) => i === idx ? { ...c, ar: e.target.value } : c);
                          saveCategoriesToLocal(updated);
                        }}
                        className="bg-neutral-950 text-right text-xs text-white border border-neutral-800 rounded p-1 max-w-[120px] focus:border-gold-505"
                      />
                      <input 
                        type="text" 
                        value={cat.en} 
                        onChange={(e) => {
                          const updated = categoriesList.map((c, i) => i === idx ? { ...c, en: e.target.value } : c);
                          saveCategoriesToLocal(updated);
                        }}
                        className="bg-neutral-950 text-left text-xs text-white border border-neutral-800 rounded p-1 max-w-[120px] focus:border-gold-505"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add category tag */}
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const tagId = (fd.get('tagId') as string || '').toLowerCase().trim();
                const tagAr = fd.get('tagAr') as string;
                const tagEn = fd.get('tagEn') as string;
                
                if (tagId && tagAr && tagEn) {
                  if (categoriesList.some(c => c.id === tagId)) {
                    alert(isAr ? 'المعرف مستخدم بالفعل لتصنيف آخر!' : 'Category ID already exists!');
                    return;
                  }
                  const updated = [...categoriesList, { id: tagId, ar: tagAr, en: tagEn }];
                  saveCategoriesToLocal(updated);
                  e.currentTarget.reset();
                }
              }} className="space-y-2 pt-3 border-t border-neutral-800">
                <span className="text-[10px] text-gold-300 font-bold block">{isAr ? 'إلحاق تصنيف فرعي جديد:' : 'Add Custom Category:'}</span>
                <div className="grid grid-cols-3 gap-2">
                  <input required name="tagId" placeholder="ID (ex: cards)" type="text" className="bg-neutral-950 border border-neutral-800 text-white rounded p-1.5 text-center text-[10px]" />
                  <input required name="tagEn" placeholder="English name" type="text" className="bg-neutral-950 border border-neutral-800 text-white rounded p-1.5 text-center text-[10px]" />
                  <input required name="tagAr" placeholder="الاسم بالعربي" type="text" className="bg-neutral-950 border border-neutral-800 text-white rounded p-1.5 text-center text-[10px]" />
                </div>
                <button type="submit" className="w-full py-1.5 bg-gold-950 border border-gold-505/30 text-gold-300 font-black rounded text-[10px] hover:bg-gold-900 transition-colors cursor-pointer">
                  {isAr ? 'إضافة وتثبيت التصنيف الجديد للمعرض 📊' : 'Register New Category 📊'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
