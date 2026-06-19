/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CompanyInfo, PageId, UserAccount, UserRole } from '../types';
import { 
  Layout, FileText, CheckCircle2, TrendingUp, DollarSign, Upload, Bell, 
  User, Layers, Shield, FileSpreadsheet, Send, Sparkles, Receipt, 
  Activity, CreditCard, MessageSquare, Download, Lock, CheckCircle, 
  UserCheck, AlertTriangle, Users, ToggleLeft, Edit2, ShieldAlert, ListTodo, Plus, Info, Key, Check, KeyRound,
  Briefcase, X, Settings, Smartphone, Award, Network, Package
} from 'lucide-react';

// ERP & CRM System Upgrade modules imports
import CRMModule from '../components/erp/CRMModule';
import InventoryModule from '../components/erp/InventoryModule';
import HRModule from '../components/erp/HRModule';
import FinancialModule from '../components/erp/FinancialModule';
import ProjectTrackingModule from '../components/erp/ProjectTrackingModule';
import ReportingCenterModule from '../components/erp/ReportingCenterModule';
import AndroidModule from '../components/erp/AndroidModule';

// Advanced Business Modules
import QuotationBuilderModule from '../components/erp/QuotationBuilderModule';
import SiteManagementModule from '../components/erp/SiteManagementModule';
import ContractManagementModule from '../components/erp/ContractManagementModule';
import ProcurementModule from '../components/erp/ProcurementModule';
import TreasuryBankingModule from '../components/erp/TreasuryBankingModule';
import WorkflowAutomationModule from '../components/erp/WorkflowAutomationModule';
import SeoMarketingModule from '../components/erp/SeoMarketingModule';
import DAMModule from '../components/erp/DAMModule';

interface Props {
  isAr: boolean;
  companyInfo: CompanyInfo;
  setActivePage: (p: PageId) => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
}

export default function ClientPortal({ isAr, companyInfo, setActivePage, currentUser, onOpenAuth }: Props) {
  
  // ----------------------------------------------------
  // GENERAL STATE & DATA SYNCHRONIZATION
  // ----------------------------------------------------
  
  // Security Activity Queue with localStorage persistence
  const [activities, setActivities] = useState<any[]>(() => {
    const saved = localStorage.getItem('yafta_portal_activities');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', time: '09:41 AM', textAr: 'فحص الحماية الأمنية لجدران الحماية: سليم (100%)', textEn: 'Security firewall diagnostic check: CLEAN (100%)', type: 'security' },
      { id: '2', time: '09:12 AM', textAr: 'طلب معاينة مشروع جديدة من العميل أحمد محمود', textEn: 'New project estimation requested by Ahmed Mahmoud', type: 'success' },
      { id: '3', time: '08:00 AM', textAr: 'توليد تلقائي لخرائط الأرشفة sitemap.xml بنجاح', textEn: 'Sitemap maps generated successfully', type: 'info' }
    ];
  });

  const addActivityLog = (textAr: string, textEn: string, type: 'info' | 'security' | 'success' | 'alert') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const log = { id: `${Date.now()}`, time, textAr, textEn, type };
    setActivities(prev => {
      const updated = [log, ...prev].slice(0, 50);
      localStorage.setItem('yafta_portal_activities', JSON.stringify(updated));
      return updated;
    });
  };

  // 1. Client Hub Roles State
  const [uploadedFiles, setUploadedFiles] = useState(() => {
    const saved = localStorage.getItem('yafta_client_blueprints');
    if (saved) return JSON.parse(saved);
    return [
      { name: 'تصميم_الشعار_النهائي.pdf', size: '2.4 MB', date: '2026-06-15' },
      { name: 'مواصفات_حديد_التثبيت.zip', size: '12.8 MB', date: '2026-06-10' },
      { name: 'واجهة_محل_مادو_نهائي.png', size: '5.6 MB', date: '2026-06-08' },
      { name: 'عرض_سعر_يافطة.pdf', size: '1.1 MB', date: '2026-06-05' }
    ];
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('yafta_client_invoices');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'INV-2026-0890', title: 'دفعة واجهة مادو كلادينج', amount: '85,000 ج.م', status: 'غير مدفوعة', date: '2026-06-18', canPay: true, clientName: 'أحمد محمود', clientEmail: 'client@yafta.com' },
      { id: 'INV-2026-0875', title: 'دفعة تصميم الشعار والمطبوعات', amount: '45,000 ج.م', status: 'مدفوعة', date: '2026-06-12', canPay: false, clientName: 'أحمد محمود', clientEmail: 'client@yafta.com' },
      { id: 'INV-2026-0860', title: 'دفعة موقع بيلدبرو الإلكتروني', amount: '68,000 ج.م', status: 'مدفوعة', date: '2026-06-01', canPay: false, clientName: 'أحمد محمود', clientEmail: 'client@yafta.com' },
      { id: 'INV-2026-0845', title: 'دفعة أولى حروف بارزة سيجنتشر', amount: '25,000 ج.م', status: 'مدفوعة', date: '2026-05-10', canPay: false, clientName: 'أحمد محمود', clientEmail: 'client@yafta.com' }
    ];
  });

  const [projectRequests, setProjectRequests] = useState(() => {
    const saved = localStorage.getItem('yafta_project_requests');
    if (saved) return JSON.parse(saved);
    return [
      { title: 'تصميم هوية بصرية مادو', progress: 65, status: 'قيد التنفيذ', date: '2026-06-18', clientEmail: 'client@yafta.com' },
      { title: 'واجهة محل كلادينج إيليت', progress: 40, status: 'قيد التنفيذ', date: '2026-06-15', clientEmail: 'client@yafta.com' },
      { title: 'موقع إلكتروني بيلدبرو', progress: 90, status: 'قيد المراجعة', date: '2026-06-01', clientEmail: 'client@yafta.com' },
      { title: 'حروف بارزة سيجنتشر', progress: 20, status: 'في الانتظار', date: '2026-06-14', clientEmail: 'client@yafta.com' }
    ];
  });

  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // 2. Employee Hub Roles State
  const [employeeTasks, setEmployeeTasks] = useState<any[]>(() => {
    const saved = localStorage.getItem('yafta_employee_tasks');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'task-1', titleAr: 'تفصيل المجرى الفولاذي لواجهة مادو', titleEn: 'Weld structural ACP channel for Mado Facade', priority: 'High', status: 'CNC cutting', assignedTo: 'employee@yafta.com', date: '2026-06-18' },
      { id: 'task-2', titleAr: 'تثبيت الليدات الكورية لحبات سيجنتشر', titleEn: 'Solder Samsung LED modules inside Signature letters', priority: 'Medium', status: 'Assembly', assignedTo: 'employee@yafta.com', date: '2026-06-17' },
      { id: 'task-3', titleAr: 'مراجعة أبعاد ارتفاع واجهة بنك مصر الجديدة', titleEn: 'Review safety wind stress factor for Banque Misr cladding', priority: 'High', status: 'Pencil draft', assignedTo: 'employee@yafta.com', date: '2026-06-16' },
      { id: 'task-4', titleAr: 'طباعة البنر المقاوم للأمطار لفرع الدقي', titleEn: 'Print UV flex banners for Dokki branch', priority: 'Low', status: 'Quality Control', assignedTo: 'employee@yafta.com', date: '2026-06-15' }
    ];
  });

  // Support / chat messages
  const [supportMessage, setSupportMessage] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('yafta_portal_chat_messages');
    if (saved) return JSON.parse(saved);
    return [
      { sender: 'team', text: 'أهلاً بك يا فندم، تم بفضل الله الانتهاء من حفر حروف الاستانلس لصالون سيجنتشر وجاري توصيل الليدات الكورية بالداخل.', time: 'منذ ساعتين' }
    ];
  });

  // Client Tab state
  const [clientActiveTab, setClientActiveTab] = useState<'overview' | 'invoices' | 'files' | 'support'>('overview');

  // ERP Admin Tab state selection
  const [erpActiveTab, setErpActiveTab] = useState<'overview' | 'crm' | 'inventory' | 'hr' | 'financial' | 'projects' | 'reports' | 'android' | 'quotation' | 'site' | 'contract' | 'procurement' | 'treasury' | 'workflow' | 'seo' | 'dam'>('overview');

  // Admin users list state
  const [usersList, setUsersList] = useState<UserAccount[]>([]);

  useEffect(() => {
    // Load registered users list from local storage
    const listRaw = localStorage.getItem('yafta_users_list');
    if (listRaw) {
      setUsersList(JSON.parse(listRaw));
    } else {
      const defaultUsers: UserAccount[] = [
        { id: '1', name: 'Super Admin', email: 'admin@yafta.com', role: 'Admin', password: 'admin123', registeredDate: '2026-01-01', phone: '+201011223344', status: 'active' },
        { id: '2', name: 'Production Engineer', email: 'employee@yafta.com', role: 'Employee', password: 'employee123', registeredDate: '2026-02-15', phone: '+201055667788', status: 'active' },
        { id: '3', name: 'Ahmed Mahmoud', email: 'client@yafta.com', role: 'Client', password: 'client123', registeredDate: '2026-03-20', phone: '+201199001122', status: 'active' }
      ];
      setUsersList(defaultUsers);
      localStorage.setItem('yafta_users_list', JSON.stringify(defaultUsers));
    }
  }, [currentUser]);

  // Handle Client Invoices Payment Simulation
  const handleSimPayment = (id: string) => {
    const updated = invoices.map(inv => {
      if (inv.id === id) {
        addActivityLog(
          `تم سداد الفاتورة ${id} بنجاح للعميل أحمد محمود بقيمة ${inv.amount}`,
          `Invoice ${id} paid successfully by Client Ahmed Mahmoud for ${inv.amount}`,
          'success'
        );
        return { ...inv, status: 'مدفوعة', canPay: false };
      }
      return inv;
    });
    setInvoices(updated);
    saveToLocalStorage('yafta_client_invoices', updated);
    alert(isAr ? 'تمت عملية محاكاة الدفع بنجاح تام وتم تصفير الفاتورة فورا!' : 'Mock payment processed successfully! Invoice cleared.');
  };

  // Handle Client Project Request Submission
  const [isSubmitRequestOpen, setIsSubmitRequestOpen] = useState(false);
  const [newReqName, setNewReqName] = useState('');
  const [newReqDesc, setNewReqDesc] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqName) return;

    const newProj = {
      title: newReqName,
      progress: 10,
      status: isAr ? 'في جرد المعاينة والموقع' : 'Site measurement inspection',
      date: new Date().toISOString().split('T')[0],
      clientEmail: currentUser?.email || 'guest@example.com'
    };

    const updated = [newProj, ...projectRequests];
    setProjectRequests(updated);
    saveToLocalStorage('yafta_project_requests', updated);

    addActivityLog(
      `تم استلام طلب مشروع جديد من ${currentUser?.name}: ${newReqName}`,
      `New project estimate request received from ${currentUser?.name}: ${newReqName}`,
      'info'
    );

    setNewReqName('');
    setNewReqDesc('');
    setIsSubmitRequestOpen(false);
    setSuccessMsg(isAr ? 'تم إرسال طلب مشروعك الجديد للمهندسين المختصين فورا!' : 'Your new project request has been transmitted directly to structural engineers!');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  // Client Technical plan mock upload
  const [simFileUploading, setSimFileUploading] = useState(false);
  const handleFileUploadSim = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setSimFileUploading(true);
      const name = e.target.files[0].name;
      const sizeLong = e.target.files[0].size / (1024 * 1024);
      const sizeStr = `${sizeLong.toFixed(1)} MB`;
      setTimeout(() => {
        const updated = [
          { name, size: sizeStr, date: new Date().toISOString().split('T')[0] },
          ...uploadedFiles
        ];
        setUploadedFiles(updated);
        saveToLocalStorage('yafta_client_blueprints', updated);
        setSimFileUploading(false);

        addActivityLog(
          `قام العميل بتقديم ملف فني جديد: ${name}`,
          `Client submitted technical drawing file: ${name}`,
          'success'
        );

        alert(isAr ? 'تم رفع المخطط الفني بنجاح تام على خوادم يافطة وسيقوم المهندسين بفحصه!' : 'Technical plan uploaded successfully to YAFTA servers!');
      }, 1550);
    }
  };

  // Chat message send handler
  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (supportMessage.trim()) {
      const updatedMessages = [
        ...messages,
        { sender: 'client', text: supportMessage, time: 'الآن' }
      ];
      setMessages(updatedMessages);
      saveToLocalStorage('yafta_portal_chat_messages', updatedMessages);
      const clientMsg = supportMessage;
      setSupportMessage('');
      
      setTimeout(() => {
        const teamReply = { 
          sender: 'team', 
          text: isAr 
            ? 'تلقينا رسالتك بالكامل وقمنا بتوجيهها للمهندسين المشرفين على الموقع، سنقوم بالرد عليك خلال دقائق.' 
            : 'We received your specifications and flagged the active factory production manager.', 
          time: 'الآن' 
        };
        const finalMessages = [...updatedMessages, teamReply];
        setMessages(finalMessages);
        saveToLocalStorage('yafta_portal_chat_messages', finalMessages);
      }, 1500);
    }
  };

  // ----------------------------------------------------
  // EMPLOYEE SECTOR LOGIC
  // ----------------------------------------------------
  const [employeeNewTaskNameEn, setEmployeeNewTaskNameEn] = useState('');
  const [employeeNewTaskNameAr, setEmployeeNewTaskNameAr] = useState('');
  const [employeeNewTaskPriority, setEmployeeNewTaskPriority] = useState('Medium');
  const [isEmployeeAddTaskOpen, setIsEmployeeAddTaskOpen] = useState(false);

  const handleCreateEmployeeTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeNewTaskNameAr || !employeeNewTaskNameEn) return;

    const newTask = {
      id: `task-${Date.now()}`,
      titleAr: employeeNewTaskNameAr,
      titleEn: employeeNewTaskNameEn,
      priority: employeeNewTaskPriority,
      status: 'Pencil draft',
      assignedTo: currentUser?.email || 'employee@yafta.com',
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newTask, ...employeeTasks];
    setEmployeeTasks(updated);
    saveToLocalStorage('yafta_employee_tasks', updated);

    addActivityLog(
      `تم إسناد مهمة تشغيل جديدة بالورشة: ${employeeNewTaskNameAr}`,
      `New fabrication order assigned: ${employeeNewTaskNameEn}`,
      'info'
    );

    setEmployeeNewTaskNameAr('');
    setEmployeeNewTaskNameEn('');
    setEmployeeNewTaskPriority('Medium');
    setIsEmployeeAddTaskOpen(false);
  };

  const handleUpdateTaskStatus = (taskId: string, currentStatus: string) => {
    const statuses = ['Pencil draft', 'CNC cutting', 'Assembly', 'Quality Control', 'Shipped', 'Completed'];
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];

    const updated = employeeTasks.map(t => {
      if (t.id === taskId) {
        addActivityLog(
          `تحديث حالة تصنيع المهمة (${t.titleAr}) إلى: ${nextStatus}`,
          `Updated manufacturing order (${t.titleEn}) to: ${nextStatus}`,
          'info'
        );
        return { ...t, status: nextStatus };
      }
      return t;
    });

    setEmployeeTasks(updated);
    saveToLocalStorage('yafta_employee_tasks', updated);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm(isAr ? 'هل أنت متأكد من مسح هذه المهمة؟' : 'Are you sure you want to drop this task?')) {
      const target = employeeTasks.find(t => t.id === taskId);
      const updated = employeeTasks.filter(t => t.id !== taskId);
      setEmployeeTasks(updated);
      saveToLocalStorage('yafta_employee_tasks', updated);

      addActivityLog(
        `قام الموظف بحذف مهمة التشغيل: ${target?.titleAr}`,
        `Employee deleted fabrication task: ${target?.titleEn}`,
        'alert'
      );
    }
  };

  // ----------------------------------------------------
  // ADMIN CONTROL PANEL LOGIC (USER ROLE CONTROL)
  // ----------------------------------------------------
  const handleModifyUserRole = (userId: string, targetRole: UserRole) => {
    const updated = usersList.map(usr => {
      if (usr.id === userId) {
        addActivityLog(
          `تعديل صلاحيات المستخدم (${usr.name}) إلى دور: ${targetRole}`,
          `Elevated authorization level for ${usr.name} to: ${targetRole}`,
          'security'
        );
        return { ...usr, role: targetRole };
      }
      return usr;
    });
    setUsersList(updated);
    localStorage.setItem('yafta_users_list', JSON.stringify(updated));
    alert(isAr ? 'تم تعديل مفعول الدور وصلاحية المستخدم بنجاح!' : 'User role updated instantly on safe production node!');
  };

  const handleToggleUserSuspension = (userId: string, currentStatus: string | undefined) => {
    const targetStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    const updated = usersList.map(usr => {
      if (usr.id === userId) {
        addActivityLog(
          `تم ${targetStatus === 'suspended' ? 'تعطيل' : 'تفعيل'} حساب المستخدم (${usr.name})`,
          `Security flag ${targetStatus === 'suspended' ? 'DISABLED' : 'ACTIVATED'} user access for: ${usr.name}`,
          'security'
        );
        return { ...usr, status: targetStatus };
      }
      return usr;
    });
    setUsersList(updated);
    localStorage.setItem('yafta_users_list', JSON.stringify(updated));
  };


  // ----------------------------------------------------
  // RENDER SECURITY LOCKED SCREEN FOR VISITOR
  // ----------------------------------------------------
  if (!currentUser || currentUser.role === 'Visitor') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center font-sans">
        <div className="max-w-2xl mx-auto bg-neutral-950 p-8 md:p-12 rounded-3xl border border-gold-505/25 shadow-2xl relative overflow-hidden space-y-8">
          
          {/* Glowing Background Radial */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-950/15 via-transparent to-transparent pointer-events-none"></div>

          {/* Golden Shield Lock Icon */}
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-neutral-900 border-2 border-dashed border-gold-505 rounded-full text-gold-505 animate-pulse shadow-xl">
            <KeyRound className="w-10 h-10 text-gold-550 text-gold-505" />
          </div>

          <div className="space-y-3 relative z-10">
            <span className="text-[10px] bg-gold-950 text-gold-300 px-3 py-1 rounded-full border border-gold-500/20 uppercase tracking-widest font-black font-mono">
              {isAr ? 'البوابة المغلقة • حماية الصلاحيات الأمنية' : 'PROTECTED ZONE • ROLE GATEWAY'}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
              {isAr ? 'عفواً، يتطلب تسجيل الدخول المسبق' : 'Authentication Required'}
            </h2>
            <p className="text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
              {isAr 
                ? 'مرحباً بك في لوحة تحصيل الطلبات وبناء المخططات. الرجاء تسجيل الدخول أو إنشاء حساب لاختبار مفعول الصلاحيات للأدوار المختلفة (مدير، عميل، موظف تشغيل فني)' 
                : 'This panel contains protected corporate resources. Authenticated clients can review quotes or pay invoices, while staff manage factory orders.'}
            </p>
          </div>

          {/* Action Gateway */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10 max-w-sm mx-auto">
            <button
              onClick={onOpenAuth}
              className="w-full py-4 bg-gradient-to-r from-gold-350 via-gold-505 to-gold-450 text-neutral-950 text-xs font-black rounded-xl hover:scale-103 active:scale-97 transition-all duration-300 shadow-lg shadow-gold-550/10 uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
            >
              <Key className="w-4 h-4 text-neutral-950" />
              <span>{isAr ? 'تسجيل الدخول / فتح الحساب الموحد' : 'Establish Secure Entry'}</span>
            </button>
          </div>

          {/* Sandbox Role Explainer Bento Items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-neutral-900 text-right">
            {[
              {
                role: 'Client',
                titleAr: 'بوابة العميل المعتمد',
                titleEn: 'Authorized Client Sandbox',
                descAr: 'استعراض تقدم الهياكل ومراجعة عروض الأسعار والدفع الرقمي وشهادات الضمان للمنشآت.',
                descEn: 'Track site preparation progress, download approved technical blueprints, and make mock invoice payments.',
                icon: <User className="w-5 h-5 text-gold-505" />
              },
              {
                role: 'Employee',
                titleAr: 'تحدير موظفي الإنتاج والورش',
                titleEn: 'Factory Employee Room',
                descAr: 'تحديث مراحل التقطيع عبر الماكينات CNC وسداد الحروف وتلوين الهياكل الفولاذية للعملاء.',
                descEn: 'Update shop floor task queues, report machine downtime issues, and report material specifications.',
                icon: <Briefcase className="w-5 h-5 text-blue-400" />
              },
              {
                role: 'Admin',
                titleAr: 'حقوق الإدارة والملاّك',
                titleEn: 'Corporate Board Admin',
                descAr: 'تخصيص الهوية الإعلانية والمحتويات ومتابعة التقارير المالية وضبط أدوار مستخدمي النظام.',
                descEn: 'Modify site layout text instantly, audit security system activity log, and adjust personnel user roles.',
                icon: <Shield className="w-5 h-5 text-red-400" />
              }
            ].map((box, idx) => (
              <div key={idx} className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-900 hover:border-gold-505/10 transition-colors space-y-2">
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-xs font-extrabold text-white">{isAr ? box.titleAr : box.titleEn}</span>
                  {box.icon}
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans text-right">
                  {isAr ? box.descAr : box.descEn}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // CLIENT ROLE VISUAL INTERFACE
  // ----------------------------------------------------
  if (currentUser.role === 'Client') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16 font-sans animate-fade-in text-right">
        
        {/* Welcome Section Header */}
        <section className="bg-neutral-950 p-6 md:p-8 rounded-2xl border border-gold-505/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-right md:text-right flex-row-reverse w-full md:w-auto">
            <div className="w-14 h-14 rounded-full bg-gold-950 border-2 border-gold-505 flex items-center justify-center text-gold-505">
              <User className="w-8 h-8" />
            </div>
            <div className="grow">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                  ● {isAr ? 'عضو نشط' : 'CONNECTED'}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  {isAr ? `مرحباً بك، ${currentUser.name}` : `Welcome back, ${currentUser.name}`}
                </h2>
              </div>
              <p className="text-xs text-neutral-400 mt-1 font-mono">ID: YAFTA-CL-{currentUser.id.slice(-6)} | {currentUser.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setIsSubmitRequestOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 text-xs font-black rounded-lg transition-all cursor-pointer hover:opacity-90"
            >
              ➕ {isAr ? 'طلب مشروع جديد' : 'New Project Request'}
            </button>
            
            <label className="px-4 py-2.5 bg-neutral-900 border border-gold-505/20 hover:border-gold-505 text-gold-505 hover:bg-neutral-800 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 justify-center">
              <Upload className="w-4 h-4" />
              <span>{simFileUploading ? (isAr ? 'جاري الفتح والرفع...' : 'Processing upload...') : (isAr ? 'رفع مخطط فني PDF' : 'Upload Blueprint PDF')}</span>
              <input type="file" onChange={handleFileUploadSim} className="hidden" disabled={simFileUploading} />
            </label>
          </div>
        </section>

        {successMsg && (
          <div className="bg-gold-950/85 text-gold-300 p-4 rounded-xl border border-gold-505/35 text-center text-xs font-bold animate-pulse">
            ✨ {successMsg}
          </div>
        )}

        {/* Client KPI Counters */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { labelAr: 'المشاريع المنفذة والنشطة', labelEn: 'My Projects', val: projectRequests.length, icon: <Activity className="w-5 h-5" />, color: 'text-blue-400' },
            { labelAr: 'الفواتير وعروض الأسعار', labelEn: 'Invoices Issued', val: invoices.length, icon: <Receipt className="w-5 h-5" />, color: 'text-emerald-400' },
            { labelAr: 'المستندات الهندسية المعتمدة', labelEn: 'My Blueprints', val: uploadedFiles.length, icon: <FileText className="w-5 h-5" />, color: 'text-gold-505' },
            { labelAr: 'قيمة الالتزام التعاقدي', labelEn: 'Contract Value (EGP)', val: '158,000 ج.م', icon: <DollarSign className="w-5 h-5" />, color: 'text-neutral-200' },
          ].map((counter, idx) => (
            <div key={idx} className="bg-neutral-950 p-5 rounded-2xl border border-gold-500/10 flex items-center justify-between text-right">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-gold-500/10 flex items-center justify-center shrink-0">
                {counter.icon}
              </div>
              <div className="space-y-1">
                <span className="text-xs text-neutral-400 block">{isAr ? counter.labelAr : counter.labelEn}</span>
                <strong className="text-xl md:text-2xl font-black block text-white">{counter.val}</strong>
              </div>
            </div>
          ))}
        </section>

        {/* Dashboard Tabs Selector */}
        <div className="border-b border-gold-500/15 flex gap-4 overflow-x-auto pb-1">
          {[
            { id: 'overview', ar: 'حالات تقدم مشاريعي الحالية 📁', en: 'Project Progress' },
            { id: 'invoices', ar: 'مستحقات وسداد الفواتير 💳', en: 'Invoices & Payments' },
            { id: 'files', ar: 'الملفات ومطابقات المعاينة 📄', en: 'Render Blueprints' },
            { id: 'support', ar: 'محرر الاستفسار والدعم الإنشائي 💬', en: 'Factory Chatroom' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setClientActiveTab(tab.id as any)}
              className={`pb-3 text-xs md:text-sm font-extrabold border-b-2 transition-all px-2 cursor-pointer shrink-0 ${
                clientActiveTab === tab.id
                  ? 'border-gold-505 text-gold-505 font-black'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              {isAr ? tab.ar : tab.en}
            </button>
          ))}
        </div>

        {/* Dynamic Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Overview tab */}
            {clientActiveTab === 'overview' && (
              <div className="bg-neutral-950 rounded-2xl border border-gold-500/10 p-5 md:p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 justify-end">
                  <span>{isAr ? 'وتيرة العمليات ونسب تصنيع اللوحة:' : 'Real-time Manufacturing Progress:'}</span>
                  <Activity className="w-5 h-5 text-gold-505" />
                </h3>

                <div className="divide-y divide-neutral-900 border border-neutral-900 rounded-xl p-4 space-y-4 bg-neutral-950/40">
                  {projectRequests.map((req, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-2">
                      <div className="flex justify-between items-center text-xs md:text-sm flex-row-reverse">
                        <span className="font-bold text-white">{req.title}</span>
                        <span className="text-gold-300 font-mono font-bold bg-gold-950 px-2 py-0.5 rounded border border-gold-500/20">{req.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-gold-600 via-gold-505 to-gold-300 rounded-full transition-all duration-1000"
                          style={{ width: `${req.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-neutral-500 font-bold flex-row-reverse">
                        <span>{isAr ? 'الحالة الحالية والتنفيذ:' : 'Status:'} <strong className="text-neutral-300">{req.status}</strong></span>
                        <span>{req.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invoices tab */}
            {clientActiveTab === 'invoices' && (
              <div className="bg-neutral-950 rounded-2xl border border-gold-500/10 p-5 md:p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 justify-end">
                  <span>{isAr ? 'سجل المطالبات المالية والفواتير المستندة:' : 'Billing invoices & payment history:'}</span>
                  <Receipt className="w-5 h-5 text-gold-505" />
                </h3>

                <div className="overflow-x-auto text-xs text-right">
                  <table className="w-full divide-y divide-neutral-950">
                    <thead className="text-gold-300 font-extrabold bg-neutral-900/60">
                      <tr>
                        <th className="px-3 py-3 rounded-r-md text-right">{isAr ? 'رقم الفاتورة' : 'Invoice ID'}</th>
                        <th className="px-3 py-3 text-right">{isAr ? 'البيان والتفاصيل' : 'Remarks'}</th>
                        <th className="px-3 py-3 text-right">{isAr ? 'القيمة' : 'Amount'}</th>
                        <th className="px-3 py-3 text-right">{isAr ? 'الحالة المرجعية' : 'Status'}</th>
                        <th className="px-3 py-3 rounded-l-md text-center">{isAr ? 'إجراء' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900/40 text-neutral-300">
                      {invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td className="px-3 py-4 font-mono font-bold text-white">{inv.id}</td>
                          <td className="px-3 py-4">{inv.title}</td>
                          <td className="px-3 py-4 font-bold text-white">{inv.amount}</td>
                          <td className="px-3 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              inv.status === 'مدفوعة' 
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/20' 
                                : 'bg-red-950 text-red-200 border border-red-500/30'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-3 py-4 text-center">
                            {inv.canPay ? (
                              <button 
                                onClick={() => handleSimPayment(inv.id)}
                                className="px-3 py-1 bg-gold-505 hover:bg-gold-400 text-neutral-950 text-[10px] font-black rounded-md cursor-pointer transition-colors"
                              >
                                {isAr ? 'سداد فوري 💳' : 'Pay Invoice 💳'}
                              </button>
                            ) : (
                              <span className="text-zinc-500 text-[10px] font-bold">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Blueprints Files tab */}
            {clientActiveTab === 'files' && (
              <div className="bg-neutral-950 rounded-2xl border border-gold-500/10 p-5 md:p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 justify-end">
                  <span>{isAr ? 'مستندات الرسوم ثلاثية الأبعاد والمقاسات متبعة:' : 'Technical construction drawings & mockups:'}</span>
                  <FileText className="w-5 h-5 text-gold-505" />
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="bg-neutral-900 p-4 rounded-xl border border-gold-500/5 hover:border-gold-505/20 transition-all flex flex-row-reverse items-center justify-between gap-4">
                      <div className="space-y-1 overflow-hidden text-right">
                        <span className="text-xs font-bold text-white block truncate">{file.name}</span>
                        <div className="flex gap-2 text-[10px] text-neutral-400 justify-end">
                          <span>{file.size}</span>
                          <span>|</span>
                          <span>{file.date}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => alert(isAr ? 'تجهيز وتنزيل الملف الهندسي المعتمد حالاً...' : 'Preparing safety file download...')}
                        className="p-2 bg-neutral-950 hover:bg-gold-505 hover:text-neutral-950 text-gold-505 rounded-lg border border-gold-505/15 transition-all shrink-0 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Support Messaging tab */}
            {clientActiveTab === 'support' && (
              <div className="bg-neutral-950 rounded-2xl border border-gold-500/10 overflow-hidden flex flex-col h-[400px]">
                
                <div className="p-4 bg-neutral-900 border-b border-gold-500/10 flex flex-row-reverse items-center justify-between bg-gold-950/20">
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="animate-pulse w-2.5 h-2.5 rounded-full bg-emerald-505 bg-emerald-500"></span>
                    <span className="text-xs font-bold text-white">{isAr ? 'غرفة المتابعة الفنية • وكالة يافطة' : 'Operations & Welding Desk - YAFTA'}</span>
                  </div>
                  <span className="text-[9px] text-gold-300 font-mono">SECURE-CHAT-NODE-5</span>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col max-w-[80%] ${msg.sender === 'client' ? 'mr-auto items-start text-left' : 'ml-auto items-end text-right'}`}
                    >
                      <div className={`p-3 rounded-xl text-xs font-sans ${
                        msg.sender === 'client'
                          ? 'bg-gold-505 text-neutral-955 text-neutral-950 font-extrabold rounded-tl-none'
                          : 'bg-neutral-900 text-neutral-300 border border-gold-500/10 rounded-tr-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-neutral-500 font-bold mt-1 block px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 bg-neutral-900 border-t border-gold-500/15 flex gap-2">
                  <input
                    type="text"
                    required
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder={isAr ? 'اكتب تساؤلك أو ملحوظة الخامات هنا لتصل فوراً...' : 'Type message to factory project manager...'}
                    className="bg-neutral-950 border border-gold-500/15 text-xs text-white rounded-lg px-3 focus:outline-none focus:border-gold-505 grow font-sans text-right"
                  />
                  <button
                    type="submit"
                    className="bg-gold-550 bg-gold-505 hover:bg-gold-400 text-neutral-950 px-4 py-2 rounded-lg font-black text-xs shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>
            )}

          </div>

          {/* Sidebar News */}
          <div className="space-y-6">
            <div className="bg-neutral-950 rounded-2xl border border-gold-500/10 p-5 md:p-6 space-y-4 text-right">
              <h4 className="text-xs font-black tracking-widest text-gold-300 uppercase pb-2 border-b border-gold-500/10 flex items-center gap-1.5 justify-end">
                <span>{isAr ? 'المتابعة التنفيذية الفورية للورش:' : 'PRODUCTION & REQUISITION BULLETIN:'}</span>
                <Bell className="w-4 h-4 text-gold-505 animate-bounce" />
              </h4>
              
              <div className="space-y-3">
                {[
                  { textAr: 'تثبيت ألواح الألمنيوم لمدخل واجهة مادو بمثبتات فولاذية مضاعفة', textEn: 'ACP panels locknut assembly started for Mado Project', date: 'منذ ساعتين' },
                  { textAr: 'فحص الحروف بنجاح كامل تحت ضغط تغذية سامسونج ليد الأصلي 12 فولت', textEn: 'Samsung LED module testing passed with isolation rate of 99%', date: 'منذ يوم' },
                  { textAr: 'إصدار شهادة الترخيص المبدئي واختبار الأحمال لهيكل الكلادينج الخارجي', textEn: 'Primary safety certification dispatched for cladding skeleton', date: 'منذ يومين' }
                ].map((not, idx) => (
                  <div key={idx} className="bg-neutral-900/40 p-3 rounded-lg border border-gold-500/5 text-xs font-sans space-y-1">
                    <span className="text-neutral-300 block leading-snug">{isAr ? not.textAr : not.textEn}</span>
                    <span className="text-[10px] text-neutral-500 font-semibold block">{not.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-950 rounded-2xl border border-gold-505/25 p-5 md:p-6 space-y-3 relative overflow-hidden text-right">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-full blur-xl"></div>
              <h4 className="text-sm font-bold text-white relative z-10">{isAr ? 'قسم الحسابات والمتابعة المالية:' : 'Accounts & Billing Office:'}</h4>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed relative z-10">
                {isAr ? 'إذا واجهت أي استفسار في سداد الفواتير أو تسوية الدفعة الرقمية المتاحة، اتصل بالقسم المالي مباشرة:' : 'Need custom invoice breakdown? Ping production administration directly.'}
              </p>
              <p className="text-sm font-extrabold text-gold-505 font-mono relative z-10">{companyInfo.phone}</p>
            </div>
          </div>

        </div>

        {/* Create Request Dialog (Client Modal) */}
        {isSubmitRequestOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-md w-full relative space-y-6">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 justify-end">
                <span>{isAr ? 'طلب معاينة وتصميم واجهة جديدة' : 'Request Facade Inspection'}</span>
                <Sparkles className="w-5 h-5 text-gold-505" />
              </h3>
              
              <form onSubmit={handleCreateRequest} className="space-y-4 text-right">
                <div className="space-y-1">
                  <label className="text-xs text-gold-300 font-bold block">{isAr ? 'اسم وتوثيق المشروع المقترح:' : 'Proposed Project Name:'}</label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'مثال: واجهة واى برجر الشيخ زايد' : 'e.g. whyburger Zayed Branch'}
                    value={newReqName}
                    onChange={(e) => setNewReqName(e.target.value)}
                    className="w-full bg-neutral-900 border border-gold-500/15 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-505 text-right font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gold-300 font-bold block">{isAr ? 'اسم العميل وملاحظة المقاس والارتفاع:' : 'Specifications:'}</label>
                  <textarea
                    required
                    rows={3}
                    placeholder={isAr ? 'مثال: علبة كلادينج فضي مطفي 4مم مع حفر ليزر دقيق' : 'ACP Cladding Matte finish + CNC laser steel engraving'}
                    value={newReqDesc}
                    onChange={(e) => setNewReqDesc(e.target.value)}
                    className="w-full bg-neutral-900 border border-gold-500/15 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-505 text-right font-sans"
                  />
                </div>

                <div className="flex gap-2 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsSubmitRequestOpen(false)}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-400 font-bold rounded-lg border border-neutral-850 cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 text-xs font-black rounded-lg transition-all cursor-pointer shadow-md"
                  >
                    {isAr ? 'إرسال طلب المعاينة' : 'Transmit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ----------------------------------------------------
  // EMPLOYEE ROLE VISUAL INTERFACE
  // ----------------------------------------------------
  if (currentUser.role === 'Employee') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16 font-sans animate-fade-in text-right">
        
        {/* Welcome Block Staff header */}
        <section className="bg-neutral-950 p-6 md:p-8 rounded-2xl border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-right md:text-right flex-row-reverse w-full md:w-auto">
            <div className="w-14 h-14 rounded-full bg-blue-950 border-2 border-blue-550 flex items-center justify-center text-blue-400 shadow-lg">
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="grow">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[10px] bg-blue-950 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-500/20">
                  ● {isAr ? 'قسم الإنتاج والمصانع' : 'PRODUCTION TEAM'}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  {isAr ? `أهلاً بك مهندس، ${currentUser.name}` : `Welcome back Engineer, ${currentUser.name}`}
                </h2>
              </div>
              <p className="text-xs text-neutral-400 mt-1 font-mono">STAFF ACCOUNT: {currentUser.email} | ID: YAFTA-OP-60</p>
            </div>
          </div>

          <button 
            onClick={() => setIsEmployeeAddTaskOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-900/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة مشروع تشغيلي جديد' : 'Register Shop Floor Task'}</span>
          </button>
        </section>

        {/* Employee KPI Counters */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { labelAr: 'مشاريع التشغيل النشطة', labelEn: 'Active Shop Orders', val: employeeTasks.length, icon: <ListTodo className="w-5 h-5" />, color: 'text-blue-400' },
            { labelAr: 'الأولوية القصوى (High)', labelEn: 'Critical Backlogs', val: employeeTasks.filter(t => t.priority === 'High').length, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-red-400' },
            { labelAr: 'معدل جودة المنتج النهائي', labelEn: 'Shop floor QC score', val: '98.5%', icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-400' },
            { labelAr: 'آلات الورشة و CNC ليزر', labelEn: 'CNC Machine Nodes', val: 'متصل (3)', icon: <Activity className="w-5 h-5" />, color: 'text-zinc-300' }
          ].map((counter, idx) => (
            <div key={idx} className="bg-neutral-950 p-5 rounded-2xl border border-neutral-900 flex items-center justify-between text-right">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-805 flex items-center justify-center shrink-0">
                {counter.icon}
              </div>
              <div className="space-y-1">
                <span className="text-xs text-neutral-400 block">{isAr ? counter.labelAr : counter.labelEn}</span>
                <strong className="text-xl md:text-2xl font-black block text-white">{counter.val}</strong>
              </div>
            </div>
          ))}
        </section>

        {/* Assigned tasks manager list */}
        <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-900 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-neutral-900 gap-4 flex-row-reverse">
            <div>
              <h3 className="text-base font-bold text-white">{isAr ? 'جدول مشاريع الإنتاج وخطوط التجميع الشاملة:' : 'Shop floor fabrication queue & active assemblies:'}</h3>
              <p className="text-xs text-neutral-400 mt-1">{isAr ? 'يمكنك تحديث التقدم بالتصنيع وسكب الاستانلس وتثبيت الليد تباعاً للعملاء' : 'Click "Change Phase" button to cycle the fabrication status of each project.'}</p>
            </div>
            <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-blue-400 px-3 py-1 rounded font-mono font-bold">
              AUTHORIZED OPS ENVIRONMENT v2.1
            </span>
          </div>

          <div className="space-y-3.5">
            {employeeTasks.map((t) => (
              <div key={t.id} className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-850 flex flex-col md:flex-row justify-between items-center gap-4 text-right hover:border-blue-500/10 transition-colors">
                
                {/* Change status action triggers */}
                <div className="flex gap-2 w-full md:w-auto justify-end">
                  <button 
                    onClick={() => handleUpdateTaskStatus(t.id, t.status)}
                    className="px-3.5 py-2 bg-neutral-950 hover:bg-blue-600 border border-neutral-800 hover:border-blue-500 text-[10px] font-black text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isAr ? 'نقل مرحلة إنتاج ⚡' : 'Go Next Stage ⚡'}</span>
                  </button>

                  <button 
                    onClick={() => handleDeleteTask(t.id)}
                    className="p-2 bg-rose-950/20 hover:bg-rose-950 border border-rose-500/10 hover:border-rose-500 text-rose-400 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress details */}
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto justify-end">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-zinc-500 font-mono block">DATE: {t.date}</span>
                    <span className="text-[10px] text-zinc-400 block">{t.assignedTo}</span>
                  </div>

                  {/* Status Indicator */}
                  <div className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-850 flex items-center gap-2">
                    <span className="animate-ping w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span className="text-xs font-mono font-bold text-white uppercase">{t.status}</span>
                  </div>

                  {/* Task details */}
                  <div className="space-y-1 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                        t.priority === 'High' ? 'bg-red-950 text-red-300' : t.priority === 'Medium' ? 'bg-blue-950 text-blue-300' : 'bg-neutral-800 text-zinc-400'
                      }`}>
                        {t.priority}
                      </span>
                      <strong className="text-xs text-white block">{isAr ? t.titleAr : t.titleEn}</strong>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Add Task Dialog Modal (Employee) */}
        {isEmployeeAddTaskOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-950 border border-blue-500/30 rounded-2xl p-6 md:p-8 max-w-md w-full relative space-y-6 text-right">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 justify-end">
                <span>{isAr ? 'تسجيل أمر تشغيلي هندسي' : 'Create Fabrication Project'}</span>
                <Briefcase className="w-5 h-5 text-blue-400" />
              </h3>

              <form onSubmit={handleCreateEmployeeTask} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'تفاصيل المهمة بالعربية:' : 'Fabrication task description (AR):'}</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تركيب لوحة سامسونج LED مكدسة لواجهة فرع المهندسين"
                    value={employeeNewTaskNameAr}
                    onChange={(e) => setEmployeeNewTaskNameAr(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-white focus:outline-none text-right font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'تفاصيل المهمة بالإنجليزية:' : 'Fabrication task description (EN):'}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solder wiring for LED layout No 5"
                    value={employeeNewTaskNameEn}
                    onChange={(e) => setEmployeeNewTaskNameEn(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-white focus:outline-none text-left font-sans font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'درجة أولوية تصنيع الهيكل:' : 'Priority dispatch:'}</label>
                  <select
                    value={employeeNewTaskPriority}
                    onChange={(e) => setEmployeeNewTaskPriority(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-white font-bold"
                  >
                    <option value="High">{isAr ? 'خط الإنتاج العاجل (High priority)' : 'High priority / Out-of-turn'}</option>
                    <option value="Medium">{isAr ? 'أولوية اعتيادية (Medium priority)' : 'Medium priority'}</option>
                    <option value="Low">{isAr ? 'أولوية مرنة (Low priority)' : 'Low priority'}</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEmployeeAddTaskOpen(false)}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg border border-neutral-850 cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-lg transition-all cursor-pointer shadow-md"
                  >
                    {isAr ? 'تعميد المهمة بالورش' : 'Commit Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ----------------------------------------------------
  // ADMIN & ERP SYSTEM ROLE VISUAL INTERFACE
  // ----------------------------------------------------
  if (currentUser.role === 'Super Admin' || currentUser.role === 'Admin' || currentUser.role === 'Manager') {
    const canEdit = currentUser.role === 'Super Admin' || currentUser.role === 'Admin';
    
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16 font-sans animate-fade-in text-right">
        
        {/* Admin Dashboard header info */}
        <section className="bg-neutral-950 p-6 md:p-8 rounded-2xl border border-gold-505/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gold-950/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-4 text-right md:text-right flex-row-reverse w-full md:w-auto">
            <div className="w-14 h-14 rounded-full bg-gold-950 border-2 border-gold-505 flex items-center justify-center text-gold-505 shadow-xl shadow-gold-500/5 animate-pulse">
              <Shield className="w-8 h-8" />
            </div>
            <div className="grow">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[10px] bg-red-950 text-red-300 font-extrabold px-2 py-0.5 rounded-full border border-red-500/20">
                  {currentUser.role.toUpperCase()}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  {isAr ? `أهلاً بك، المالك والمدير ${currentUser.name}` : `Welcome Commander, ${currentUser.name}`}
                </h2>
              </div>
              <p className="text-xs text-neutral-400 mt-1 font-mono">YAFTA ADVERTISING ERP • SECURED SATELLITE HUB • {currentUser.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <span className="text-xs bg-neutral-900 border border-gold-505/20 text-gold-505 px-3 py-2 rounded-xl font-mono font-black">
              SECURE OPERATOR MODULE ACTIVE
            </span>
          </div>
        </section>

        {/* GOLD & BLACK LUXURY ERP TAB SELECTOR */}
        <div className="border-b border-gold-500/10 flex gap-2 overflow-x-auto pb-1 text-right justify-end flex-row-reverse pr-2 scrollbar-none">
          {[
            { id: 'overview', ar: 'التحكم العام 📊', en: 'Control Center' },
            { id: 'crm', ar: 'العملاء والفرص (CRM) 📁', en: 'CRM Station' },
            { id: 'quotation', ar: 'عروض الأسعار الذكية 📝', en: 'Smart Quotations' },
            { id: 'contract', ar: 'إدارة العقود الإلكترونية 📄', en: 'Contract Desk' },
            { id: 'inventory', ar: 'المستودع والخامات 📦', en: 'Inventory & Stock' },
            { id: 'procurement', ar: 'المشتريات والتوريد 🚚', en: 'Procurement Board' },
            { id: 'hr', ar: 'شؤون الموظفين وكفاءتهم 📇', en: 'HR Personnel' },
            { id: 'financial', ar: 'الحسابات والقيود 💰', en: 'Ledger & Finance' },
            { id: 'treasury', ar: 'الخزانة وحسابات البنوك 🏦', en: 'Treasury & Liquidity' },
            { id: 'projects', ar: 'متابعة وتوجيه المشاريع ⚡', en: 'Project Pipeline' },
            { id: 'site', ar: 'المعاينة والتركيب الميداني 🛠️', en: 'Site Management' },
            { id: 'workflow', ar: 'الربط والعمليات الآلية ⚙️', en: 'Workflow Automation' },
            { id: 'reports', ar: 'مركز التقارير السنوية 📉', en: 'Reporting Center' },
            { id: 'seo', ar: 'التسويق وأرشفة جوجل 🌐', en: 'SEO & Marketing' },
            { id: 'dam', ar: 'أرشيف التصاميم الرقمية 🗄️', en: 'Digital Assets (DAM)' },
            { id: 'android', ar: 'محاكي أندرويد الأصلي 📱', en: 'Android Client' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setErpActiveTab(tab.id as any)}
              className={`pb-3 text-xs font-black border-b-2 px-3 cursor-pointer shrink-0 transition-colors ${
                erpActiveTab === tab.id
                  ? 'border-gold-505 text-gold-505 font-black'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              {isAr ? tab.ar : tab.en}
            </button>
          ))}
        </div>

        {/* DYNAMIC COMPONENT INJECTION ZONE */}
        <div className="space-y-8 animate-fade-in">
          
          {/* TAB 1: SYSTEM OVERVIEW (ORIGINAL VIEW MODIFIED FOR ROLES INTEGRATED) */}
          {erpActiveTab === 'overview' && (
            <>
              {/* System Admin KPI stats */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { labelAr: 'إجمالي حسابات الأعضاء بالسيستم', labelEn: 'Registered Users', val: usersList.length, icon: <Users className="w-5 h-5" />, color: 'text-red-400' },
                  { labelAr: 'مشاريع التشغيل الإجمالية', labelEn: 'Active Shop Floor Orders', val: employeeTasks.length, icon: <ListTodo className="w-5 h-5" />, color: 'text-blue-400' },
                  { labelAr: 'الفواتير المستحقة والمسددة', labelEn: 'System Invoices', val: invoices.length, icon: <Receipt className="w-5 h-5" />, color: 'text-gold-505' },
                  { labelAr: 'فواتير غير مدفوعة (EGP)', labelEn: 'EGP Outstanding balance', val: '85,000 ج.م', icon: <DollarSign className="w-5 h-5" />, color: 'text-rose-400' }
                ].map((counter, idx) => (
                  <div key={idx} className="bg-neutral-950 p-5 rounded-2xl border border-gold-500/10 flex items-center justify-between text-right">
                    <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-gold-500/10 flex items-center justify-center shrink-0 text-gold-300">
                      {counter.icon}
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-neutral-400 block">{isAr ? counter.labelAr : counter.labelEn}</span>
                      <strong className="text-xl md:text-2xl font-black block text-white">{counter.val}</strong>
                    </div>
                  </div>
                ))}
              </section>

              {/* User security management & roles adjuster desk */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* USER MANAGEMENT & ROLE MANIPULATION BOARD */}
                <div className="lg:col-span-2 bg-neutral-950 p-6 rounded-2xl border border-gold-500/10 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-neutral-900 gap-4 flex-row-reverse">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2 justify-end">
                        <span>{isAr ? 'منصة إدارة المستخدمين وتحديد رتب الأمان:' : 'Security operator directory & role assignment panels:'}</span>
                        <Users className="w-4 h-4 text-gold-505" />
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1">{isAr ? 'يمكنك تبديل صلاحيات أي عضو بالسيستم فوراً (أدمن، موظف تشغيل، عميل) أو تعطيل الحساب لأسباب أمنية' : 'Adjust authorization roles directly or toggle account suspension status locks.'}</p>
                    </div>
                  </div>

                  <div className="divide-y divide-neutral-900 space-y-4">
                    {usersList.map((usr) => (
                      <div key={usr.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row justify-between items-center gap-4 text-right">
                        
                        {/* Action Dropdown / buttons for user role change and status block */}
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                          
                          {/* Choose Role Selector with upgraded Super Admin and Manager supports */}
                          <div className="flex items-center gap-1 bg-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-800">
                            <span className="text-[10px] text-zinc-500 font-bold hidden sm:inline">{isAr ? 'تحديث الرتبة:' : 'Role:'}</span>
                            <select
                              value={usr.role}
                              disabled={usr.id === currentUser.id} // prevent self-demotion
                              onChange={(e) => handleModifyUserRole(usr.id, e.target.value as UserRole)}
                              className="bg-transparent text-xs text-gold-300 font-bold focus:outline-none cursor-pointer"
                            >
                              <option value="Super Admin" className="bg-neutral-950 text-white">Super Admin</option>
                              <option value="Admin" className="bg-neutral-950 text-white">Admin</option>
                              <option value="Manager" className="bg-neutral-950 text-white">Manager</option>
                              <option value="Employee" className="bg-neutral-950 text-white">Employee</option>
                              <option value="Client" className="bg-neutral-950 text-white">Client</option>
                              <option value="Visitor" className="bg-neutral-950 text-white">Visitor</option>
                            </select>
                          </div>

                          {/* Disable Toggle lock */}
                          <button
                            onClick={() => handleToggleUserSuspension(usr.id, usr.status)}
                            disabled={usr.id === currentUser.id} // protect admin account lockouts
                            className={`px-3 py-1.5 text-[10px] font-black rounded-lg border transition-colors cursor-pointer ${
                              usr.id === currentUser.id 
                                ? 'opacity-40 cursor-not-allowed border-zinc-800 text-zinc-650 text-neutral-500'
                                : usr.status === 'suspended'
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/20 hover:bg-emerald-900'
                                  : 'bg-rose-950/20 text-rose-350 border-rose-500/10 hover:bg-rose-950 hover:text-white hover:border-rose-500'
                            }`}
                          >
                            {usr.status === 'suspended' ? (isAr ? 'تفعيل الدخول' : 'Re-Activate') : (isAr ? 'عزل أمني 🔒' : 'Suspend 🔒')}
                          </button>
                        </div>

                        {/* Account display details */}
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-row-reverse">
                          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gold-505 shrink-0">
                            <User className="w-5 h-5 font-bold" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 justify-end">
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
                                usr.role === 'Admin' || usr.role === 'Super Admin'
                                  ? 'bg-red-950 text-red-300 border-red-500/20' 
                                  : usr.role === 'Manager'
                                    ? 'bg-yellow-950 text-gold-300 border-gold-500/30'
                                    : usr.role === 'Employee'
                                      ? 'bg-blue-950 text-blue-300 border-blue-500/20'
                                      : 'bg-neutral-900 text-zinc-400 border-neutral-850'
                              }`}>
                                {usr.role}
                              </span>
                              
                              {usr.status === 'suspended' && (
                                <span className="text-[9px] bg-red-900 text-white px-1.5 py-0.5 rounded font-bold animate-pulse">
                                  {isAr ? 'معلق ومحظور' : 'SUSPENDED'}
                                </span>
                              )}
                              <strong className="text-white text-xs">{usr.name}</strong>
                            </div>
                            <div className="text-[10px] text-zinc-400 mt-0.5">{usr.email} | {isAr ? `تاريخ التسجيل: ${usr.registeredDate}` : `Registered: ${usr.registeredDate}`}</div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                {/* ACTIVE EXTREME SECURITY AUDIT SHIELD */}
                <div className="bg-neutral-950 p-6 rounded-2xl border border-gold-500/10 space-y-6 text-right">
                  <div>
                    <h4 className="text-xs font-black tracking-widest text-gold-300 uppercase pb-2 border-b border-gold-500/10 flex items-center justify-end gap-1.5">
                      <span>{isAr ? 'سجلات النشاطات وطرق تتبع الأمان:' : 'ACTIVE TRACE AUDIT SYSTEM:'}</span>
                      <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-1 lines-clamp-2 leading-relaxed">
                      {isAr ? 'مستمع أمني يسجل جميع عمليات تبديل الرتب المعطاة وسداد المطالبات بدقة تامة وبصمة زمنية:' : 'Live listener tracking personnel edits, invoice clearances and role assignments.'}
                    </p>
                  </div>

                  <div className="space-y-3.5 max-h-[350px] overflow-y-auto">
                    {activities.map((act) => (
                      <div key={act.id} className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-850 space-y-1">
                        <div className="flex justify-between text-[10px] items-center flex-row-reverse">
                          <span className="text-[9px] bg-neutral-950 px-2 py-0.5 rounded text-zinc-500 font-mono font-bold">{act.time}</span>
                          <span className={`px-1.5 rounded-full text-[8px] font-black uppercase ${
                            act.type === 'security' 
                              ? 'bg-rose-950 text-rose-350 border border-rose-500/20'
                              : act.type === 'success'
                                ? 'bg-emerald-950 text-emerald-300'
                                : 'bg-neutral-800 text-zinc-400'
                          }`}>
                            {act.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-snug">{isAr ? act.textAr : act.textEn}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}

          {/* TAB 2: CRM MODULE */}
          {erpActiveTab === 'crm' && (
            <CRMModule isAr={isAr} canEdit={canEdit} />
          )}

          {/* ADVANCED MODULE: SMART QUOTATION BUILDER */}
          {erpActiveTab === 'quotation' && (
            <QuotationBuilderModule isAr={isAr} canEdit={canEdit} />
          )}

          {/* ADVANCED MODULE: CONTRACT MANAGEMENT */}
          {erpActiveTab === 'contract' && (
            <ContractManagementModule isAr={isAr} canEdit={canEdit} />
          )}

          {/* TAB 3: INVENTORY MODULE */}
          {erpActiveTab === 'inventory' && (
            <InventoryModule isAr={isAr} canEdit={canEdit} />
          )}

          {/* ADVANCED MODULE: PROCUREMENT */}
          {erpActiveTab === 'procurement' && (
            <ProcurementModule isAr={isAr} canEdit={canEdit} />
          )}

          {/* TAB 4: HR MODULE */}
          {erpActiveTab === 'hr' && (
            <HRModule isAr={isAr} canEdit={canEdit} />
          )}

          {/* TAB 5: FINANCIAL DATA LOGS */}
          {erpActiveTab === 'financial' && (
            <FinancialModule isAr={isAr} canEdit={canEdit} />
          )}

          {/* ADVANCED MODULE: TREASURY & BANKING */}
          {erpActiveTab === 'treasury' && (
            <TreasuryBankingModule isAr={isAr} canEdit={canEdit} />
          )}

          {/* TAB 6: PROJECTS PIPELINE ROUTING */}
          {erpActiveTab === 'projects' && (
            <ProjectTrackingModule isAr={isAr} canEdit={canEdit} />
          )}

          {/* ADVANCED MODULE: SITE MANAGEMENT */}
          {erpActiveTab === 'site' && (
            <SiteManagementModule isAr={isAr} canEdit={canEdit} />
          )}

          {/* ADVANCED MODULE: WORKFLOW AUTOMATION */}
          {erpActiveTab === 'workflow' && (
            <WorkflowAutomationModule isAr={isAr} canEdit={canEdit} />
          )}

          {/* TAB 7: REPORTING & ANALYTICS DATA SHEETS */}
          {erpActiveTab === 'reports' && (
            <ReportingCenterModule isAr={isAr} />
          )}

          {/* ADVANCED MODULE: SEO MARKETING */}
          {erpActiveTab === 'seo' && (
            <SeoMarketingModule isAr={isAr} canEdit={canEdit} />
          )}

          {/* ADVANCED MODULE: DIGITAL ASSETS DAM */}
          {erpActiveTab === 'dam' && (
            <DAMModule isAr={isAr} canEdit={canEdit} userRole={currentUser.role} />
          )}

          {/* TAB 8: ANDROID APP EMULATOR CLIENT */}
          {erpActiveTab === 'android' && (
            <AndroidModule isAr={isAr} />
          )}

        </div>

      </div>
    );
  }


  return null;
}
