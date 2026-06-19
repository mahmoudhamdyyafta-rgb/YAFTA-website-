/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, FileText, DollarSign, Award, Plus, Check, X,
  Briefcase, Star, Search, ShieldAlert
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  attendancePresent: boolean;
  baseSalary: number;
  incentives: number;
  deductions: number;
  rating: number;
  evaluationNote: string;
}

interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

interface Props {
  isAr: boolean;
  canEdit: boolean;
}

export default function HRModule({ isAr, canEdit }: Props) {
  // Employees List
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('yafta_erp_employees');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'emp-1', name: 'Eng. Amr Soliman', email: 'amr@yafta.com', department: 'Engineering & Design', role: 'Chief Structural Engineer', attendancePresent: true, baseSalary: 28000, incentives: 3500, deductions: 0, rating: 5, evaluationNote: 'Designs beautiful heavy steel skeletons and claddings.' },
      { id: 'emp-2', name: 'Sherif Aly', email: 'sherif@yafta.com', department: 'Sales & Marketing', role: 'Key Account Manager', attendancePresent: true, baseSalary: 14000, incentives: 5200, deductions: 250, rating: 4, evaluationNote: 'Brings prestigious brands and coordinates cladding files.' },
      { id: 'emp-3', name: 'Zaki Abdelrahman', email: 'zaki@yafta.com', department: 'Welding & Assembly', role: 'Master CNC & Argon Welder', attendancePresent: true, baseSalary: 12000, incentives: 1500, deductions: 0, rating: 5, evaluationNote: 'Flawless stainless steel molding and LED socket routing.' },
      { id: 'emp-4', name: 'Mahmoud Hassan', email: 'mahmoud@yafta.com', department: 'Printing & Packaging', role: 'UV Banner Plotter Expert', attendancePresent: false, baseSalary: 9500, incentives: 800, deductions: 100, rating: 4, evaluationNote: 'Excellent color matching but tardy with ink refilling.' },
      { id: 'emp-5', name: 'Tarek Refaat', email: 'tarek@yafta.com', department: 'On-site Installation', role: 'Safety Assembly Supervisor', attendancePresent: true, baseSalary: 11000, incentives: 2000, deductions: 0, rating: 5, evaluationNote: 'Supervises difficult crane operations with absolute caution.' }
    ];
  });

  // Leave Requests state
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('yafta_erp_leave_requests');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'lre-1', employeeName: 'Mahmoud Hassan', type: 'Sick Leave', startDate: '2026-06-19', endDate: '2026-06-20', status: 'Pending', reason: 'Flu symptoms and medical checkup.' },
      { id: 'lre-2', employeeName: 'Sherif Aly', type: 'Annual Leave', startDate: '2026-06-28', endDate: '2026-07-03', status: 'Approved', reason: 'Family trip to North Coast.' }
    ];
  });

  const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'payroll' | 'leaves'>('employees');
  const [search, setSearch] = useState('');
  const [addingEmployee, setAddingEmployee] = useState(false);

  // Form states employee
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Design');
  const [role, setRole] = useState('Assistant Designer');
  const [baseSalary, setBaseSalary] = useState(10000);

  // Form performance rating states
  const [evalEmployeeId, setEvalEmployeeId] = useState<string | null>(null);
  const [evalRating, setEvalRating] = useState(5);
  const [evalNote, setEvalNote] = useState('');

  useEffect(() => {
    localStorage.setItem('yafta_erp_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('yafta_erp_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name,
      email,
      department,
      role,
      attendancePresent: true,
      baseSalary,
      incentives: 0,
      deductions: 0,
      rating: 5,
      evaluationNote: 'Newly boarded teammate.'
    };

    setEmployees([...employees, newEmp]);
    setName('');
    setEmail('');
    setAddingEmployee(false);
    alert(isAr ? 'تم ضم الموظف الجديد لقاعدة البيانات وصرف رقم القيد الوظيفي!' : 'Teammate onboarded and record entered in personnel database.');
  };

  const toggleAttendance = (id: string) => {
    if (!canEdit) return;
    setEmployees(employees.map(e => e.id === id ? { ...e, attendancePresent: !e.attendancePresent } : e));
  };

  const handleLeaveDecision = (id: string, status: 'Approved' | 'Rejected') => {
    if (!canEdit) return;
    setLeaveRequests(leaveRequests.map(r => r.id === id ? { ...r, status } : r));
    
    const request = leaveRequests.find(r => r.id === id);
    if (status === 'Approved' && request) {
      // Mark employee absent
      setEmployees(employees.map(e => e.name === request.employeeName ? { ...e, attendancePresent: false } : e));
    }

    alert(isAr ? `تم تعديل القرار إلى: ${status === 'Approved' ? 'موافق عليه' : 'مرفوض'}` : `Request status modified to: ${status}`);
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalEmployeeId) return;

    setEmployees(employees.map(emp => emp.id === evalEmployeeId ? { 
      ...emp, 
      rating: evalRating, 
      evaluationNote: evalNote 
    } : emp));

    setEvalEmployeeId(null);
    setEvalNote('');
    alert(isAr ? 'تم توثيق تقييم الكفاءة والجهوزية المهنية بنجاح!' : 'Personnel efficiency review signed and archived.');
  };

  // Payroll calculations helper
  const totalPayrollValue = employees.reduce((acc, emp) => acc + emp.baseSalary + emp.incentives - emp.deductions, 0);

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(search.toLowerCase()) || 
    emp.department.toLowerCase().includes(search.toLowerCase()) ||
    emp.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 flex-row-reverse text-right">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-end">
            <Users className="w-5 h-5 text-gold-505" />
            <span>{isAr ? 'منظومة الموارد البشرية وشؤون الموظفين' : 'HR Personnel & Payroll Station'}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isAr ? 'إحصاء الحضور بالورش، التقييم السنوي، كشوف الرواتب، وطلبات الإجازات' : 'Monitor factory shift check-ins, performance metrics, and salary charts.'}
          </p>
        </div>

        <div className="flex gap-2">
          {canEdit && (
            <button 
              onClick={() => setAddingEmployee(true)}
              className="px-4 py-2 bg-gradient-to-r from-gold-300 to-gold-505 hover:from-gold-250 text-black text-xs font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'تسجيل موظف جديد' : 'Onboard Employee'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-gold-500/10 flex gap-4 overflow-x-auto pb-1 text-right justify-end flex-row-reverse pr-2">
        {[
          { id: 'employees', ar: 'دليل الموظفين 📇', en: 'Staff Directory' },
          { id: 'attendance', ar: 'حضور اليوم بالورش ⏰', en: 'Daily Attendance' },
          { id: 'payroll', ar: 'مسير الرواتب والحوافز 💰', en: 'Payroll & Allowances' },
          { id: 'leaves', ar: 'طلبات الإجازات 📅', en: 'Leave Requests' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-xs font-extrabold border-b-2 px-1 cursor-pointer shrink-0 transition-colors ${
              activeTab === tab.id
                ? 'border-gold-505 text-gold-505 font-black'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            {isAr ? tab.ar : tab.en}
          </button>
        ))}
      </div>

      {/* Main rendering area based on Tab content selection */}
      <div className="bg-neutral-950 rounded-2xl border border-gold-500/10 p-5 font-sans text-right">
        
        {/* TAB 1: EMPLOYEES DIRECTORY WITH EVALUATION TRIGGERS */}
        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-4 flex-row-reverse pb-2">
              <h3 className="text-sm font-bold text-white">{isAr ? 'دليل الكادر الفني والإداري:' : 'Active Factory Teammates:'}</h3>
              <input
                type="text"
                placeholder={isAr ? 'البحث بالاسم أو القسم...' : 'Search employees...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-neutral-905 bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white placeholder-zinc-550 placeholder-zinc-500 w-52"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEmployees.map((emp) => (
                <div key={emp.id} className="p-4 bg-neutral-900/60 hover:bg-neutral-900 rounded-xl border border-gold-500/5 hover:border-gold-505/15 transition-all flex justify-between items-start gap-4">
                  {/* Actions / Evaluation trigger */}
                  <div className="flex flex-col gap-2 items-start shrink-0">
                    <div className="flex gap-0.5 text-gold-505">
                      {Array.from({ length: emp.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    {canEdit && (
                      <button 
                        onClick={() => {
                          setEvalEmployeeId(emp.id);
                          setEvalRating(emp.rating);
                          setEvalNote(emp.evaluationNote);
                        }}
                        className="px-2.5 py-1 text-[9px] font-black bg-neutral-950 border border-gold-505/20 text-gold-300 hover:bg-gold-505 hover:text-black rounded transition-all cursor-pointer"
                      >
                        {isAr ? 'تقييم كفاءة 📊' : 'Review Metric'}
                      </button>
                    )}
                  </div>

                  {/* Teammate Detail profile info */}
                  <div className="space-y-1.5 flex flex-row-reverse gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-950 border border-gold-500/10 flex items-center justify-center text-gold-300 shrink-0 mt-0.5">
                      <Briefcase className="w-5 h-5 text-gold-505" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">{emp.name}</h4>
                      <p className="text-xs text-zinc-400 font-mono">{emp.role}</p>
                      <span className="text-[10px] bg-neutral-950 text-neutral-400 px-2 py-0.5 rounded border border-neutral-850 mt-1.3 block w-fit">
                        {emp.department}
                      </span>
                      {emp.evaluationNote && (
                        <p className="text-[10px] text-zinc-500 italic leading-snug mt-1.5 max-w-sm">
                          &ldquo;{emp.evaluationNote}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE CHECKLIST SIMULATOR */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <div className="border-b border-neutral-900 pb-3 flex justify-between items-center flex-row-reverse">
              <div>
                <h3 className="text-sm font-bold text-white">{isAr ? 'شاشه إثبات الحضور والمغادرة بالورشة:' : 'Daily shop-floor shift attendance:'}</h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">{isAr ? 'اضغط على السطر لتسجيل حضور أو غياب الفني الميداني' : 'Toggle checklist manually. Checked names are marked active for shift dispatch.'}</p>
              </div>
              <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-emerald-400 px-3 py-1 rounded font-mono">
                {new Date().toISOString().split('T')[0]}
              </span>
            </div>

            <div className="divide-y divide-neutral-900">
              {employees.map((emp) => (
                <div 
                  key={emp.id} 
                  onClick={() => toggleAttendance(emp.id)}
                  className={`py-3.5 px-4 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    emp.attendancePresent ? 'hover:bg-neutral-900/30' : 'bg-rose-950/5 hover:bg-neutral-900/45'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                      emp.attendancePresent 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/20' 
                        : 'bg-rose-950 text-rose-300 border border-rose-500/10'
                    }`}>
                      {emp.attendancePresent ? (isAr ? 'حاضر بالورشة' : 'Present') : (isAr ? 'غياب مبرر' : 'Absent')}
                    </span>
                  </div>

                  <div className="text-right">
                    <b className="text-xs text-white block">{emp.name}</b>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">{emp.department} • {emp.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PAYROLL TRACKER SUMMARY */}
        {activeTab === 'payroll' && (
          <div className="space-y-4 font-mono">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-neutral-900 text-right">
              <div className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-850">
                <span className="text-[10px] text-neutral-400 block">{isAr ? 'إجمالي كشف المرتبات الفعلي' : 'Overall Monthly Payroll'}</span>
                <span className="text-base text-gold-505 font-black">{totalPayrollValue.toLocaleString()} ج.م</span>
              </div>
              <div className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-850">
                <span className="text-[10px] text-neutral-400 block">{isAr ? 'إجمالي البدلات والإنتاجية' : 'Allowances Dispatched'}</span>
                <span className="text-base text-emerald-400 font-black">
                  {employees.reduce((s, e) => s + e.incentives, 0).toLocaleString()} ج.م
                </span>
              </div>
              <div className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-850">
                <span className="text-[10px] text-neutral-400 block">{isAr ? 'كادر قوة التجميع واللحام' : 'Production Workforce Size'}</span>
                <span className="text-base text-white font-black">{employees.length} فنيين</span>
              </div>
            </div>

            <div className="overflow-x-auto text-xs text-right">
              <table className="w-full divide-y divide-neutral-900">
                <thead className="bg-neutral-900/80 text-gold-300">
                  <tr>
                    <th className="p-3 text-right">{isAr ? 'الاسم والصفة' : 'Employee & Grade'}</th>
                    <th className="p-3 text-right">{isAr ? 'الراتب الأساسي' : 'Base wage'}</th>
                    <th className="p-3 text-right">{isAr ? 'الحوافز والمكافآت' : 'Commission/Add'}</th>
                    <th className="p-3 text-right">{isAr ? 'الاستقطاعات والتأخير' : 'Deductions'}</th>
                    <th className="p-3 text-right">{isAr ? 'صافي المقبوض' : 'Net Disbursed'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/30 text-neutral-300">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-neutral-900/20">
                      <td className="p-3">
                        <span className="block text-white font-bold text-xs">{emp.name}</span>
                        <span className="text-[10px] text-zinc-500 font-sans mt-0.5">{emp.role}</span>
                      </td>
                      <td className="p-3">{emp.baseSalary.toLocaleString()} ج.م</td>
                      <td className="p-3 text-emerald-400 font-bold">+{emp.incentives.toLocaleString()} ج.م</td>
                      <td className="p-3 text-rose-400">-{emp.deductions.toLocaleString()} ج.م</td>
                      <td className="p-3 font-bold text-white">{(emp.baseSalary + emp.incentives - emp.deductions).toLocaleString()} ج.م</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: LEAVE REQUESTS PANEL */}
        {activeTab === 'leaves' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-neutral-900 pb-2">{isAr ? 'إجازات الفنيين المعلقة والموافقات:' : 'Time-off requests queue & compliance panels:'}</h3>
            
            <div className="space-y-3.5">
              {leaveRequests.map((req) => (
                <div key={req.id} className="p-4 bg-neutral-900/60 border border-neutral-850 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 text-right">
                  {/* Actions choice button */}
                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    {req.status === 'Pending' ? (
                      canEdit ? (
                        <>
                          <button
                            onClick={() => handleLeaveDecision(req.id, 'Approved')}
                            className="px-3.5 py-1.5 bg-emerald-950 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-900 text-[10px] font-black rounded-lg transition-colors cursor-pointer"
                          >
                            {isAr ? 'قبول الإجازة ✓' : 'Approve Leave ✓'}
                          </button>
                          <button
                            onClick={() => handleLeaveDecision(req.id, 'Rejected')}
                            className="px-3.5 py-1.5 bg-rose-950/20 border border-rose-500/10 text-rose-400 hover:bg-rose-950 hover:text-white rounded-lg transition-colors cursor-pointer"
                          >
                            {isAr ? 'رفض الإجازة ✗' : 'Reject leave ✗'}
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-zinc-500 font-bold">{isAr ? 'في جرد الانتظار' : 'Pending authorization'}</span>
                      )
                    ) : (
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${
                        req.status === 'Approved' 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/10' 
                          : 'bg-rose-950 text-rose-300 border border-rose-500/10'
                      }`}>
                        {isAr ? (req.status === 'Approved' ? 'مصادق عليها' : 'مرفوضة') : req.status}
                      </span>
                    )}
                  </div>

                  {/* Leave details description */}
                  <div className="space-y-1">
                    <strong className="text-xs text-white block">{req.employeeName}</strong>
                    <p className="text-[11px] text-neutral-300 leading-snug">{req.reason}</p>
                    <div className="flex gap-2 text-[10px] text-zinc-500 justify-end font-mono">
                      <span>{isAr ? 'نوع الطلب:' : 'Category:'} <strong className="text-zinc-300">{req.type}</strong></span>
                      <span>|</span>
                      <span>{req.startDate} {isAr ? 'إلى' : 'to'} {req.endDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add Teammate modal */}
      {addingEmployee && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-md w-full relative space-y-6 text-right font-sans">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 justify-end border-b border-neutral-900 pb-3">
              <span>{isAr ? 'تسجيل فني أو مصمم جديد بالقائمة' : 'Add New Employee Record'}</span>
              <Users className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'اسم زميل العمل بالكامل:' : 'Full Legal Name:'}</label>
                <input
                  type="text"
                  required
                  placeholder="Eng. Ahmed Aly"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-550 text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'البريد الإلكتروني المهني:' : 'Work corporate Email:'}</label>
                <input
                  type="email"
                  required
                  placeholder="employee@yafta.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-550 text-left"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'القسم والفرقة:' : 'Department:'}</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-805 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="Engineering & Design">Engineering & Design</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Welding & Assembly">Welding & Assembly</option>
                    <option value="Printing & Packaging">Printing & Packaging</option>
                    <option value="On-site Installation">On-site Installation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'رقم الراتب الأساسي (EGP):' : 'Base Salary (EGP):'}</label>
                  <input
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white text-center font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300 font-bold block">{isAr ? 'الصفة الوظيفية الدقيقة (Role):' : 'Specific Role/Grade:'}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master UV Plotter"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setAddingEmployee(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg cursor-pointer border border-neutral-850"
                >
                  {isAr ? 'إلغاء' : 'Close'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black text-xs font-black rounded-lg cursor-pointer animate-pulse"
                >
                  {isAr ? 'تعميد الموظف' : 'Dispatch Onboard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee performance Evaluation modal Dialogue */}
      {evalEmployeeId && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-sm w-full relative space-y-5 text-right font-sans">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 justify-end border-b border-neutral-900 pb-2">
              <span>{isAr ? 'تقييم معامل الانتاجية والجهوزية' : ' teampartner competency evaluation'}</span>
              <Award className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleSaveEvaluation} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-bold block">{isAr ? 'نقاط التقييم المعطاة (Stars):' : 'Rating scale:'}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={evalRating}
                  onChange={(e) => setEvalRating(parseInt(e.target.value))}
                  className="w-full accent-gold-505 cursor-pointer"
                />
                <div className="flex gap-1 text-gold-505 justify-center mt-1.5">
                  {Array.from({ length: evalRating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current text-gold-500" />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-bold block">{isAr ? 'ملاحظة الأداء المهني وبطاقة الكفاءة:' : 'Performance Remarks:'}</label>
                <textarea
                  rows={3}
                  required
                  placeholder={isAr ? 'مثال: يتمتع بدقة قياس متناهية في هندسة الواجهات والكلادينج...' : 'e.g. Shows caution in heavy high-altitude on-site assembling...'}
                  value={evalNote}
                  onChange={(e) => setEvalNote(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 p-2 text-xs text-white focus:outline-none focus:border-gold-550 text-right"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEvalEmployeeId(null)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black text-xs font-black rounded-lg cursor-pointer"
                >
                  {isAr ? 'تحديث التقييم بالملف العام' : 'Amend Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
