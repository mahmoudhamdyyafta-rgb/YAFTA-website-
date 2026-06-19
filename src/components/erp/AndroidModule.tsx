/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Smartphone, ChevronRight, Bell, Code, Layers, CloudOff, FileCode, CheckCircle, Space
} from 'lucide-react';

interface Props {
  isAr: boolean;
}

export default function AndroidModule({ isAr }: Props) {
  const [screen, setScreen] = useState<'home' | 'crm' | 'stock' | 'source'>('home');
  const [pushed, setPushed] = useState(false);

  // Ready-to-copy code blocks
  const composeCode = `// MainActivity.kt - YAFTA Advertising ERP + CRM Mobile Client
package com.yafta.erp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            YaftaTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = Color(0xFF030303) // Matte Black Branding
                ) {
                    ErpNavigationNode()
                }
            }
        }
    }
}

// Room Database Offline Support Entity
@Entity(tableName = "materials")
data class MaterialEntity(
    @PrimaryKey val id: String,
    val name: String,
    val category: String,
    val stock: Int,
    val safetyLimit: Int
)`;

  const viewModelCode = `// LeadsViewModel.kt - MVVM Architecture
package com.yafta.erp.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.yafta.erp.repository.LeadsRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class LeadsViewModel(private val repository: LeadsRepository) : ViewModel() {
    private val _leadsState = MutableStateFlow<List<Lead>>(emptyList())
    val leadsState: StateFlow<List<Lead>> = _leadsState

    init {
        fetchLeadsOfflineFirst()
    }

    fun fetchLeadsOfflineFirst() = viewModelScope.launch {
        repository.observeLeadsOffline().collect { cachedList ->
            _leadsState.value = cachedList
        }
    }
}`;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 flex-row-reverse text-right">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-end">
            <Smartphone className="w-5 h-5 text-gold-505" />
            <span>{isAr ? 'منصة تصدير ومحاكاة تطبيق أندرويد الأصلي' : 'Native Android Suite & Kotlin Simulator'}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isAr ? 'تصفح محاكي Jetpack Compose، هيكلية MVVM، ملفات التصدير الجاهزة والدعم غير متصل بالإنترنت' : 'Compile structural Kotlin code-blocks, trigger push notifications, and preview Compose screens.'}
          </p>
        </div>

        <span className="text-[10px] bg-neutral-900 border border-gold-500/10 text-emerald-400 py-1.5 px-3 rounded-lg font-mono">
          ● TARGET SDK: 34 (Android 14)
        </span>
      </div>

      {/* Main split interactive phone & copy codes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* INTERACTIVE PHONE FRAME SIMULATOR */}
        <div className="lg:col-span-1 flex justify-center">
          <div className="w-72 h-[520px] bg-neutral-950 border-4 border-neutral-800 rounded-[36px] p-3 shadow-2xl relative flex flex-col overflow-hidden outline outline-1 outline-gold-505/20">
            
            {/* Phone notch speaker */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-neutral-900 rounded-full flex justify-center items-center gap-1 z-25">
              <span className="w-1.5 h-1.5 rounded-full bg-lens bg-neutral-950"></span>
              <span className="w-12 h-1 bg-neutral-800 rounded"></span>
            </div>

            {/* Simulated Android Screen Content */}
            <div className="flex-1 bg-black rounded-[28px] overflow-hidden flex flex-col p-4 pt-6 select-none font-sans relative">
              
              {/* Simulated status bar */}
              <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono pb-2">
                <span>09:41 AM</span>
                <div className="flex gap-1 items-center">
                  <CloudOff className="w-2.5 h-2.5 text-zinc-650" title="Offline-first Cache armed" />
                  <span>5G</span>
                  <div className="w-4 h-2 border border-zinc-600 rounded-sm p-0.5"><div className="h-full bg-gold-400 w-full rounded-2xs"></div></div>
                </div>
              </div>

              {/* Inside page content */}
              {screen === 'home' && (
                <div className="flex-1 flex flex-col justify-between pt-4">
                  <div className="space-y-4 text-center">
                    <span className="text-[9px] bg-gold-950 text-gold-300 px-2 py-0.5 rounded-full border border-gold-500/20 font-black uppercase">
                      YAFTA MOBILE v1.0
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-white">{isAr ? 'تطبيق يا فطة الإعلاني' : 'YAFTA ERP Mobile'}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{isAr ? 'وكالة الإعلان والديكور الميداني' : 'Commercial Facades Sync'}</p>
                    </div>

                    {/* Quick navigation dashboard buttons within screen */}
                    <div className="space-y-2.3 space-y-2.5 pt-4 text-right">
                      {[
                        { id: 'crm', titleAr: 'متابعة العملاء المرشحين', titleEn: 'CRM Deals', icon: '📁' },
                        { id: 'stock', titleAr: 'مراجعة خامات المستودع', titleEn: 'Materials Stock', icon: '📦' }
                      ].map(box => (
                        <button
                          key={box.id}
                          onClick={() => setScreen(box.id as any)}
                          className="w-full p-2.5 bg-neutral-900 hover:bg-neutral-850 text-[10px] font-bold text-white rounded-xl border border-neutral-850 flex items-center justify-between cursor-pointer"
                        >
                          <ChevronRight className="w-3 h-3 text-gold-505" />
                          <span>{isAr ? box.titleAr : box.titleEn} {box.icon}</span>
                        </button>
                      ))}
                    </div>

                    <div className="bg-neutral-950 border border-gold-500/10 p-3 rounded-xl space-y-1.5 text-right text-[10px]">
                      <div className="flex gap-1.5 items-center justify-end">
                        <span className="text-xs text-white">إشعار فوري</span>
                        <Bell className="w-3.5 h-3.5 text-gold-505" />
                      </div>
                      <p className="text-zinc-400 leading-snug">
                        {isAr ? 'تم استلام اعتماد المقاسات الفنية لواجهة مادو.' : 'Samsung LED modules safety inspect passed.'}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setPushed(true);
                      setTimeout(() => setPushed(false), 3500);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black text-[10px] font-black rounded-lg cursor-pointer"
                  >
                    {isAr ? 'محاكاة إشعار فوري (FCM) 🔔' : 'Simulate FCM Push Notification'}
                  </button>
                </div>
              )}

              {/* CRM Lead page in Compose */}
              {screen === 'crm' && (
                <div className="flex-1 flex flex-col justify-between pt-2">
                  <div className="space-y-3">
                    <button onClick={() => setScreen('home')} className="text-[10px] text-gold-300">← {isAr ? 'رجوع':'Back'}</button>
                    <h5 className="text-xs font-black text-white">{isAr ? 'المتابعة والصفقات المفتوحة:' : 'Active CRM Leads:'}</h5>

                    <div className="space-y-2 text-right">
                      {[
                        { company: 'Al-Masry Restaurant', amt: '45,000 ج.م', stage: 'New' },
                        { company: 'Elite Real Estate', amt: '125,000 ج.م', stage: 'Discussion' }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-neutral-900 p-2 rounded-lg border border-neutral-850 text-[10px]">
                          <div className="flex justify-between items-center flex-row-reverse">
                            <strong className="text-white">{item.company}</strong>
                            <span className="bg-gold-950 text-gold-300 px-1 rounded text-[8px]">{item.stage}</span>
                          </div>
                          <span className="text-zinc-500 font-mono block mt-1">{item.amt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Stock checking screen */}
              {screen === 'stock' && (
                <div className="flex-1 flex flex-col justify-between pt-2">
                  <div className="space-y-3">
                    <button onClick={() => setScreen('home')} className="text-[10px] text-gold-300">← {isAr ? 'رجوع':'Back'}</button>
                    <h5 className="text-xs font-black text-white">{isAr ? 'النواقص وموازين المستودع' : 'Warehouse Stocks:'}</h5>

                    <div className="space-y-2 text-right">
                      <div className="bg-neutral-900 p-2.5 rounded-lg border border-rose-500/20 text-[10px]">
                        <div className="flex justify-between items-center flex-row-reverse">
                          <strong className="text-white">Samsung LEDs Chips</strong>
                          <span className="bg-rose-950 text-rose-300 px-1 rounded text-[8px]">Low Stock</span>
                        </div>
                        <span className="text-zinc-400 font-mono block mt-1">Available check: 85 chips / Safe 500</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Notification overlap if pushed */}
              {pushed && (
                <div className="absolute top-2 left-2 right-2 p-3 bg-neutral-950 border border-gold-505/40 rounded-xl flex items-center justify-between gap-2 shadow-2xl z-30 animate-bounce text-right">
                  <Bell className="w-4 h-4 text-gold-505 shrink-0" />
                  <div className="grow">
                    <b className="text-[10px] text-white block">YAFTA Push Notification</b>
                    <p className="text-[9px] text-zinc-400 leading-snug mt-0.5">
                      {isAr ? 'تنبيه: مخزون ليدات سامسونج يقترب من النفاد التام 🚨' : 'Alert: Solder stock levels dropped below safety line 🚨'}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* MVVM KOTLIN INTEGRATION CODES EXPORTER */}
        <div className="lg:col-span-2 bg-neutral-950 p-5 rounded-2xl border border-gold-500/10 space-y-4">
          <div className="border-b border-neutral-900 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 justify-end text-right">
              <span>{isAr ? 'الأكود الأصلية لـ Jetpack Compose + MVVM:' : 'Native Kotlin Compose files:'}</span>
              <Code className="w-4 h-4 text-gold-505" />
            </h3>
            <p className="text-[11px] text-neutral-400 text-right">
              {isAr ? 'تصفح وانسخ الكلاسات الهندسية الداعمة للمزامنة غير المتصلة والربط بالشبكة المحلية بالشركة' : 'Onboard offline Room local sync caches and state view models.'}
            </p>
          </div>

          <div className="flex gap-2">
            {[
              { id: 'compose', title: 'MainActivity.kt (Compose view)' },
              { id: 'viewmodel', title: 'LeadsViewModel.kt (MVVM model)' }
            ].map(b => (
              <button
                key={b.id}
                onClick={() => setScreen(b.id === 'compose' ? 'home' : 'stock')} // Sync view changes representing switching codes
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-[10px] text-white font-bold border border-neutral-800 rounded-lg cursor-pointer"
              >
                {b.title}
              </button>
            ))}
          </div>

          <div className="bg-black/90 p-4 border border-zinc-900 rounded-2xl overflow-x-auto select-all max-h-72">
            <pre className="text-[11px] font-mono text-zinc-400 text-left leading-relaxed">
              <code>{screen === 'home' ? composeCode : viewModelCode}</code>
            </pre>
          </div>

          <div className="bg-yellow-950/20 p-4 border border-gold-505/10 rounded-xl space-y-1 text-right">
            <h4 className="text-xs font-bold text-gold-300 flex items-center gap-1 justify-end">
              <span>{isAr ? 'إرشادات النشر وتصدير التطبيق:' : 'Offline Room sync specifications:'}</span>
              <Layers className="w-3.5 h-3.5 text-gold-505" />
            </h4>
            <p className="text-[10px] text-neutral-400 leading-relaxed">
              {isAr 
                ? 'تم تصميم الكود البرمجي ليدعم قراءة مخزون الخامات وحفظ القيود المالية دون وجود إنترنت، وعند الاتصال مجدداً بالشبكة تتم المزامنة تلقائياً مع خادم يافطة الإعلاني العام بأمان تامة!'
                : 'Built with offline-first persistence utilizing Android Jetpack Room library. Local edits match server records once the 5G node establishes gateway connection.'}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
