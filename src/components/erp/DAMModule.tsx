/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FolderLock, Image, FileCode, Tag, Search, Plus, Trash2, Download, 
  RefreshCw, CloudLightning, ShieldAlert, Layers, CheckCircle2,
  Info, Sparkles, FolderUp, Lock, Share2, Palette, FileText
} from 'lucide-react';

interface AssetFile {
  id: string;
  name: string;
  extension: '.cdr' | '.ai' | '.dwg' | '.png' | '.pdf';
  size: string;
  tag: 'Facade Design' | 'Backlit Vector' | '3D Architectural Render' | 'Brand Board';
  version: number;
  uploadedBy: string;
  url: string;
  clonesList: string[]; // history of previous file names
}

export default function DAMModule({ isAr, canEdit, userRole = 'Employee' }: { isAr: boolean; canEdit: boolean; userRole?: string }) {
  // DAM inventory list
  const [assets, setAssets] = useState<AssetFile[]>(() => {
    const saved = localStorage.getItem('yafta_dam_assets');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'dam-1',
        name: 'Al-Masry-Restaurant-Front-Sign-Final',
        extension: '.cdr',
        size: '14.2 MB',
        tag: 'Backlit Vector',
        version: 3,
        uploadedBy: 'Islam Hamdy',
        url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=300',
        clonesList: ['Al-Masry-Draft-v1.cdr', 'Al-Masry-Front-Sign-v2-adjusted.cdr']
      },
      {
        id: 'dam-2',
        name: 'Zayed-Avenue-Facade-3D-Cladding',
        extension: '.dwg',
        size: '48.9 MB',
        tag: '3D Architectural Render',
        version: 1,
        uploadedBy: 'Ahmed Refaat',
        url: 'https://images.unsplash.com/photo-1581094719523-28956b9c9f00?q=80&w=300',
        clonesList: []
      },
      {
        id: 'dam-3',
        name: 'YAFTA-Enterprise-Corporate-Logo-Pack',
        extension: '.ai',
        size: '8.4 MB',
        tag: 'Brand Board',
        version: 2,
        uploadedBy: 'Marina Girgis',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300',
        clonesList: ['YAFTA-Logo-v1-Classic.ai']
      }
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<'All' | 'Facade Design' | 'Backlit Vector' | '3D Architectural Render' | 'Brand Board'>('All');
  const [cloudDriveSync, setCloudDriveSync] = useState(true);

  // Upload simulation states
  const [isUploading, setIsUploading] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileExt, setNewFileExt] = useState<AssetFile['extension']>('.cdr');
  const [newFileTag, setNewFileTag] = useState<AssetFile['tag']>('Facade Design');
  const [addingAsset, setAddingAsset] = useState(false);

  useEffect(() => {
    localStorage.setItem('yafta_dam_assets', JSON.stringify(assets));
  }, [assets]);

  const handleUploadAssetSim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName) return;

    setIsUploading(true);
    setTimeout(() => {
      const newAsset: AssetFile = {
        id: `dam-${Date.now()}`,
        name: newFileName,
        extension: newFileExt,
        size: `${(1 + Math.random() * 20).toFixed(1)} MB`,
        tag: newFileTag,
        version: 1,
        uploadedBy: userRole === 'Client' ? 'Client upload' : 'Chief Designer',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300',
        clonesList: []
      };

      setAssets([newAsset, ...assets]);
      setNewFileName('');
      setIsUploading(false);
      setAddingAsset(false);
      alert(isAr ? 'تم تشفير وتامين تصاميم يافطة في المنظومة الرقمية!' : 'Design drawing fully secured & indexed in YAFTA DAM.');
    }, 1500);
  };

  const deleteAsset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Role-based restrictions check
    if (userRole === 'Employee') {
      alert(isAr 
        ? '⚠️ خطأ بالصلاحيات: الرتبة "موظف" لا تملك تصريحات الحذف من الأرشيف الرقمي للتصاميم!' 
        : '⚠️ Permission Error: Role "Employee" cannot wipe core architectural CAD files from Enterprise system.');
      return;
    }

    if (confirm(isAr ? 'حذف هذا الملف الفني نهائياً من سيرفرات يافطة؟' : 'Permanently wipe this original design?')) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const restoreOldVersion = (assetId: string, cloneName: string) => {
    const updated = assets.map(a => {
      if (a.id === assetId) {
        // swap current name and remove restoration item from list
        const nextClones = a.clonesList.filter(name => name !== cloneName);
        return {
          ...a,
          name: cloneName.replace(/\.[a-z0-9]+$/, ''),
          version: a.version + 1,
          clonesList: [...nextClones, `${a.name}${a.extension}`]
        };
      }
      return a;
    });

    setAssets(updated);
    alert(isAr 
      ? `تم تراجع الإصدار واسترداد نسخة الملف السابقة: ${cloneName}` 
      : `Restored previous file revision successfully: ${cloneName}`);
  };

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || a.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="bg-neutral-950 p-6 rounded-2xl border border-gold-505/20 text-right font-sans space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-row-reverse">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-end">
            <FolderLock className="w-5 h-5 text-gold-505" />
            <span>{isAr ? 'أرشيف الأصول الرقمية والتصاميم الهندسية (DAM)' : 'Digital Asset Management (DAM) Vault'}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isAr ? 'حفظ ملفات التصميم الفنية (.cdr, .ai, .dwg)، أرشيف إصدارات العملاء، ونظام المزامنة السحابي الآمن' : 'Secure CorelDraw vectors, AutoCAD blueprints, design revision trees, with role-based download guards.'}
          </p>
        </div>

        <div className="flex gap-2">
          {/* Cloud sync simulation toggler */}
          <button 
            onClick={() => {
              setCloudDriveSync(!cloudDriveSync);
              alert(isAr 
                ? (cloudDriveSync ? 'تم قطع تتبع المزامنة السحابية' : 'مزامنة السحابة مفعلة مع Google Drive / Dropbox')
                : (cloudDriveSync ? 'Paused cloud synchronization.' : 'Enabled live Google Drive cloud mirroring.'));
            }}
            className={`px-3 py-2 border text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer ${
              cloudDriveSync 
                ? 'border-emerald-500/20 bg-emerald-950/20 text-emerald-400' 
                : 'border-neutral-850 bg-neutral-950 text-neutral-500'
            }`}
          >
            <CloudLightning className="w-3.5 h-3.5" />
            <span>{cloudDriveSync ? (isAr ? 'سحابة كود: نشطة' : 'Cloud Sync: Active') : (isAr ? 'سحابة كود: معطلة' : 'Cloud Sync: Off')}</span>
          </button>

          {canEdit && (
            <button 
              onClick={() => setAddingAsset(true)}
              className="px-4 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black hover:opacity-90 text-xs font-black rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <FolderUp className="w-4 h-4" />
              <span>{isAr ? 'أرشفة ملف تصميم عاجل' : 'Archive File'}</span>
            </button>
          )}
        </div>
      </div>

      {/* SEARCH AND TAG FILTERS ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-neutral-900/40 p-4 rounded-xl border border-neutral-850 flex-row-reverse">
        
        {/* keyword search bar */}
        <div className="relative w-full sm:max-w-xs">
          <input 
            type="text"
            placeholder={isAr ? 'ابحث عن ملف أو مصمم...' : 'Search designs or authors...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950 border border-gold-505/10 focus:border-gold-505 text-xs text-zinc-100 placeholder-zinc-500 py-2 pr-8 pl-3 rounded-lg focus:outline-none text-right font-sans"
          />
          <Search className="w-4 h-4 text-gold-505 absolute right-2.5 top-2.5" />
        </div>

        {/* Categories tags selectors */}
        <div className="flex gap-1.5 flex-wrap items-center">
          {['All', 'Facade Design', 'Backlit Vector', '3D Architectural Render', 'Brand Board'].map(tg => (
            <button
              key={tg}
              onClick={() => setSelectedTag(tg as any)}
              className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded transition-all cursor-pointer ${
                selectedTag === tg
                  ? 'bg-gold-505 text-neutral-950'
                  : 'bg-neutral-950 border border-neutral-850 text-neutral-400 hover:text-white'
              }`}
            >
              {tg}
            </button>
          ))}
        </div>
      </div>

      {/* ARCHIVE MEDIA GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        {filteredAssets.map(asset => (
          <div key={asset.id} className="bg-neutral-900/60 rounded-2xl border border-neutral-850 overflow-hidden text-right space-y-4 shadow flex flex-col justify-between">
            
            {/* Asset thumbnail */}
            <div className="relative h-32 bg-neutral-950 flex items-center justify-center overflow-hidden">
              <img referrerPolicy="no-referrer" src={asset.url} className="w-full h-full object-cover opacity-45" alt={asset.name} />
              <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/80 border border-neutral-800 text-[10px] rounded text-gold-550 text-gold-300 font-mono font-bold uppercase">
                {asset.extension}
              </div>
              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-neutral-950/90 border border-neutral-850 rounded text-[9px] text-zinc-400 uppercase font-black font-semibold">
                {asset.tag}
              </span>
            </div>

            {/* Content text */}
            <div className="p-4 space-y-3.5">
              <div className="space-y-0.5">
                <strong className="text-[12.5px] text-white block truncate leading-tight">{asset.name}</strong>
                <span className="text-[9.5px] text-zinc-500 font-mono block">SIZE: {asset.size} | Uploader: {asset.uploadedBy}</span>
              </div>

              {/* Version History / Restore Tree */}
              <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-850/60 space-y-1.5">
                <div className="flex justify-between items-center text-[9px] text-zinc-500 flex-row-reverse pb-1 border-b border-neutral-900">
                  <span>{isAr ? 'شجرة التعديل وتعديل النسخ:' : 'Revision history tree:'}</span>
                  <strong className="text-gold-505">Ver {asset.version}</strong>
                </div>

                {asset.clonesList.length === 0 ? (
                  <span className="text-[9px] text-zinc-600 block italic">{isAr ? 'لا يوجد نسخ أرشيفية سابقة' : 'No previous edits cataloged.'}</span>
                ) : (
                  <div className="space-y-1">
                    {asset.clonesList.map((clone, cIdx) => (
                      <div key={cIdx} className="flex justify-between items-center text-[9.5px] text-zinc-400 flex-row-reverse font-mono">
                        <span className="truncate max-w-[150px]">{clone}</span>
                        {canEdit && (
                          <button
                            onClick={() => restoreOldVersion(asset.id, clone)}
                            className="text-[9px] text-gold-505 hover:underline font-bold cursor-pointer"
                          >
                            {isAr ? 'استرجاع النسخة' : 'Restore'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Interaction Footer buttons */}
            <div className="p-4 pt-0 flex justify-between items-center border-t border-neutral-950 mt-auto flex-row-reverse">
              <button
                onClick={() => alert(`Simulating safe engineering CAD download for ${asset.name}${asset.extension}`)}
                className="px-3.5 py-1.5 bg-neutral-950 hover:bg-neutral-850 border border-neutral-850 text-white hover:text-gold-505 hover:border-gold-505/30 transition-all text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-gold-505" />
                <span>{isAr ? 'تحميل للتعديل' : 'CAD Load'}</span>
              </button>

              <button
                onClick={(e) => deleteAsset(asset.id, e)}
                className="text-xs text-zinc-600 hover:text-red-400 p-1 rounded hover:bg-rose-950/10 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* BRAND ASSETS COLOR BOOK COGNITIVE ACCENT */}
      <div className="border-t border-neutral-900 pt-6 space-y-4">
        <h3 className="text-sm font-black text-white flex items-center gap-2 justify-end">
          <span>{isAr ? 'دليل الألوان والشعار المعتمد لوكالة يافطة (Brand Guidelines):' : 'Official Corporate Layout Palette & Typography guidelines:'}</span>
          <Palette className="w-4 h-4 text-gold-505" />
        </h3>

        <div className="bg-neutral-900/60 p-5 rounded-2xl border border-neutral-850 grid grid-cols-1 sm:grid-cols-3 gap-4 text-right">
          {[
            { nameAr: 'ذهبي يافطة الشامبين الأنيق', nameEn: 'YAFTA Champagne Gold', hex: '#e5c060', bg: 'bg-[#e5c060]', text: 'text-black' },
            { nameAr: 'أسود الفنادق الفاخر المعول', nameEn: 'Luxury Matte Jet Black', hex: '#09090b', bg: 'bg-[#09090b]', text: 'text-white border border-neutral-800' },
            { nameAr: 'فضي النود الكلادينج المنسوج', nameEn: 'Polished Silver Nude', hex: '#d4d4d8', bg: 'bg-[#d4d4d8]', text: 'text-black' }
          ].map((color, cIdx) => (
            <div key={cIdx} className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-850 flex items-center gap-3.5 flex-row-reverse">
              <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center font-bold font-mono text-[9px] ${color.bg} ${color.text}`}>
                HEX
              </div>
              <div>
                <strong className="text-white text-xs block leading-snug">{isAr ? color.nameAr : color.nameEn}</strong>
                <span className="text-[10px] text-zinc-500 font-mono block mt-1">{color.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File Upload slide dialog */}
      {addingAsset && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-sm w-full relative space-y-6 text-right">
            <h3 className="text-base font-black text-white flex items-center gap-1.5 justify-end">
              <span>{isAr ? 'أرشفة وفهرسة ملف تصميم أصلي' : 'Onboard Original Blueprint vector'}</span>
              <FolderUp className="w-5 h-5 text-gold-505 animate-bounce" />
            </h3>

            <form onSubmit={handleUploadAssetSim} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'اسم الرسم أو الملف الفني:' : 'Drawing / File name:'}</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. mado-sign-letters-3d"
                  value={newFileName}
                  onChange={e => setNewFileName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right focus:outline-none focus:border-gold-505"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-right">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'امتداد الملف الهندسي' : 'CAD extension'}</label>
                  <select 
                    value={newFileExt}
                    onChange={e => setNewFileExt(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white font-bold text-center"
                  >
                    <option value=".cdr">.cdr (CorelDraw vector)</option>
                    <option value=".ai">.ai (Adobe Illustrator vector)</option>
                    <option value=".dwg">.dwg (AutoCAD architectural)</option>
                    <option value=".pdf">.pdf (Document print)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'تصنيف الأرشفة' : 'DAM Tag label'}</label>
                  <select 
                    value={newFileTag}
                    onChange={e => setNewFileTag(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white font-bold"
                  >
                    <option value="Facade Design">Facade Design</option>
                    <option value="Backlit Vector">Backlit Vector</option>
                    <option value="3D Architectural Render">3D Architectural Render</option>
                    <option value="Brand Board">Brand Board</option>
                  </select>
                </div>
              </div>

              {/* Simulated upload load progress bar */}
              {isUploading && (
                <div className="space-y-1 text-right">
                  <span className="text-[9px] text-gold-505 font-bold animate-pulse block">{isAr ? 'جاري التشفير والفهرسة برمجياً...' : 'Encoding and calculating block metadata...'}</span>
                  <div className="w-full bg-neutral-900 h-1 rounded overflow-hidden">
                    <div className="bg-gold-505 h-full w-2/3 animate-pulse"></div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setAddingAsset(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg border border-neutral-850 cursor-pointer"
                  disabled={isUploading}
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 text-xs font-black rounded-lg transition-all cursor-pointer shadow-md hover:bg-gold-400"
                  disabled={isUploading}
                >
                  {isAr ? 'تأصيل وتشفير الأصول' : 'Archive Blueprint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
