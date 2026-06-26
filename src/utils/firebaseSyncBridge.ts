/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db, isFirebaseConfigured } from '../firebaseConfig';
import { doc, setDoc, getDoc, collection, onSnapshot } from 'firebase/firestore';

// Maps local storage keys to unique document IDs in the 'siteSettings' Firestore collection
export const SYNC_KEYS_MAPPING: Record<string, string> = {
  'yafta_company_details': 'company_details',
  'yafta_logo_config': 'logo_config',
  'yafta_experience_config': 'experience_config',
  'yafta_seo_meta': 'seo_meta',
  'yafta_whatsapp_config': 'whatsapp_config',
  'yafta_projects_list': 'projects_list',
  'yafta_services_list': 'services_list',
  'yafta_testimonials_list': 'testimonials_list',
  'yafta_before_after_items': 'before_after_items',
  'yafta_team_members': 'team_members',
  'yafta_blog_articles': 'blog_articles',
  'yafta_custom_content': 'custom_content',
  'yafta_submitted_inquiries': 'submitted_inquiries',
  'yafta_media_files': 'media_files',
  'yafta_admin_users': 'admin_users',
  'yafta_users_list': 'users_list',
  'yafta_activity_logs': 'activity_logs',

  // ERP Specific Modules Data Keys
  'yafta_erp_leads': 'erp_leads',
  'yafta_erp_calllogs': 'erp_calllogs',
  'yafta_suppliers': 'erp_suppliers',
  'yafta_dealers': 'erp_dealers',
  'yafta_calculator_quotes': 'erp_calculator_quotes',
  'yafta_contracts_list': 'erp_contracts_list',
  'yafta_legal_docs': 'erp_legal_docs',
  'yafta_dam_assets': 'erp_dam_assets',
  'yafta_quotations': 'erp_quotations',
  'yafta_procurement_suppliers': 'erp_procurement_suppliers',
  'yafta_purchase_requests': 'erp_purchase_requests',
  'yafta_rfqs_compare': 'erp_rfqs_compare',
  'yafta_purchase_orders': 'erp_purchase_orders',
  'yafta_supplier_invoices': 'erp_supplier_invoices',
  'yafta_supplier_payments': 'erp_supplier_payments',
  'yafta_erp_employees': 'erp_employees',
  'yafta_erp_leave_requests': 'erp_leave_requests',
  'yafta_erp_finance': 'erp_finance',
  'yafta_treasury_accounts': 'erp_treasury_accounts',
  'yafta_treasury_transfers': 'erp_treasury_transfers',
  'yafta_reconciliation_checklist': 'erp_reconciliation_checklist',
  'yafta_erp_projects': 'erp_projects',
  'yafta_erp_installations': 'erp_installations',
  'yafta_site_surveys': 'erp_site_surveys',
  'yafta_installation_jobs': 'erp_installation_jobs',
  'yafta_automation_rules': 'erp_automation_rules',
  'yafta_automation_logs': 'erp_automation_logs',
  'yafta_seo_keywords': 'erp_seo_keywords'
};

// Original localStorage setters to bypass interception loops
const originalSetItem = window.localStorage.setItem;
const originalRemoveItem = window.localStorage.removeItem;

// State flags to avoid infinite write/sync loops
let isSyncingIncomingFromFirestore = false;

// Notification visual trigger helper
export const showGlobalNotification = (messageAr: string, messageEn: string, type: 'success' | 'error' | 'sync' = 'success') => {
  const isAr = document.documentElement.lang === 'ar' || true;
  const text = isAr ? messageAr : messageEn;
  
  // Try to find the app's existing toast trigger or show an elegant overlay toast
  const container = document.getElementById('global-sync-toast-container') || document.createElement('div');
  if (!container.id) {
    container.id = 'global-sync-toast-container';
    container.className = 'fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-400' : type === 'error' ? 'bg-rose-950/90 border-rose-500/30 text-rose-400' : 'bg-neutral-900/90 border-gold-505/30 text-gold-505';
  toast.className = `${bgClass} backdrop-blur-md border px-5 py-3.5 rounded-2xl flex items-center gap-3 text-xs font-black shadow-2xl transition-all duration-300 transform translate-y-2 opacity-0 text-right justify-end font-sans max-w-sm pointer-events-auto`;
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '☁️';
  toast.innerHTML = `
    <div class="grow font-bold text-white text-right">${text}</div>
    <div class="text-base">${icon}</div>
  `;

  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.className = toast.className.replace('translate-y-2 opacity-0', 'translate-y-0 opacity-100');
  }, 50);

  // Auto dismiss
  setTimeout(() => {
    toast.className = toast.className.replace('translate-y-0 opacity-100', 'translate-y-2 opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }, 4000);
};

// Initialize the global Firebase sync bridge
export function initFirebaseSyncBridge() {
  console.log('Initializing Global Firebase Storage Sync Bridge...');

  // 1. Intercept localStorage.setItem
  window.localStorage.setItem = function (key: string, value: string) {
    // Write locally first for instant responsive UI feedback
    originalSetItem.call(window.localStorage, key, value);

    // If it's a key we should synchronize with Firestore, upload it!
    const docId = SYNC_KEYS_MAPPING[key];
    if (docId && isFirebaseConfigured && db && !isSyncingIncomingFromFirestore) {
      // Run the upload asynchronously without blocking the main render thread
      (async () => {
        try {
          const parsed = JSON.parse(value);
          const docRef = doc(db, 'siteSettings', docId);

          // Save to Firestore
          await setDoc(docRef, { payload: parsed, updated_at: new Date().toISOString() });

          // SAVE VERIFICATION SYSTEM: Verify the document exists on Firestore and matches exactly
          const verifySnap = await getDoc(docRef);
          if (verifySnap.exists()) {
            const serverData = verifySnap.data();
            const matches = JSON.stringify(serverData.payload) === JSON.stringify(parsed);
            
            if (matches) {
              showGlobalNotification(
                `تم حفظ وتأكيد التعديلات سحابياً بنجاح! ☁️`,
                `All changes successfully saved and verified in the cloud! ☁️`,
                'success'
              );
            } else {
              throw new Error('Server payload mismatch verification failed.');
            }
          } else {
            throw new Error('Saved document not found on the server.');
          }

          // Dispatch a custom window event for other components to listen to
          window.dispatchEvent(new CustomEvent('local-storage-update', { detail: { key, value } }));
        } catch (error) {
          console.error(`Firebase Sync failed for key: ${key}`, error);
          showGlobalNotification(
            `❌ فشل مزامنة التعديلات سحابياً. يتم المتابعة محلياً في المتصفح.`,
            `❌ Cloud sync failed. Continuing in local browser cache.`,
            'error'
          );
        }
      })();
    } else {
      // Still dispatch local update event for components on the same page
      window.dispatchEvent(new CustomEvent('local-storage-update', { detail: { key, value } }));
    }
  };

  // 2. Intercept localStorage.removeItem
  window.localStorage.removeItem = function (key: string) {
    originalRemoveItem.call(window.localStorage, key);
    window.dispatchEvent(new CustomEvent('local-storage-update', { detail: { key, value: null } }));
  };

  // 3. Set up Real-Time Firestore Collection Listener
  if (isFirebaseConfigured && db) {
    try {
      const siteSettingsCollectionRef = collection(db, 'siteSettings');
      
      onSnapshot(siteSettingsCollectionRef, (snapshot) => {
        isSyncingIncomingFromFirestore = true;
        let anyChanges = false;

        snapshot.forEach((docSnap) => {
          const docId = docSnap.id;
          const serverData = docSnap.data();
          if (!serverData || !serverData.payload) return;

          // Find corresponding localStorage key
          const localKey = Object.keys(SYNC_KEYS_MAPPING).find(k => SYNC_KEYS_MAPPING[k] === docId);
          if (localKey) {
            const localValueStr = originalSetItem.call(window.localStorage, 'dummy', 'dummy'); // Dummy helper to read
            const currentLocalVal = window.localStorage.getItem(localKey);
            const serverValStr = JSON.stringify(serverData.payload);

            if (currentLocalVal !== serverValStr) {
              // Update local storage with raw originalSetItem to bypass setter interception
              originalSetItem.call(window.localStorage, localKey, serverValStr);
              anyChanges = true;

              // Dispatch window-level event to notify active React components
              window.dispatchEvent(new CustomEvent('local-storage-update', { detail: { key: localKey, value: serverValStr } }));
            }
          }
        });

        if (anyChanges) {
          showGlobalNotification(
            `تم تحديث ومزامنة البيانات في الخلفية تلقائياً! 🔄`,
            `Data synced in the background successfully! 🔄`,
            'sync'
          );
        }

        isSyncingIncomingFromFirestore = false;
      }, (err) => {
        console.warn('Real-time database listener deactivated:', err);
        isSyncingIncomingFromFirestore = false;
      });
    } catch (err) {
      console.warn('Real-time listener setup failed:', err);
    }
  }
}
