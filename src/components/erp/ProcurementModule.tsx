/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, FileSpreadsheet, ClipboardList, Plus, Trash2, 
  CheckCircle, ArrowUpRight, Scale, ShieldAlert, ShoppingBag, 
  Calendar, FileText, CheckCircle2, RefreshCw, Layers, Award,
  DollarSign, PackageCheck
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  materialType: string;
  rating: number;
  contactPerson: string;
  creditPeriodDays: number;
}

interface PurchaseRequest {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  requestedBy: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Pending Manager' | 'Approved' | 'PO Issued' | 'Rejected';
  estimatedCost: number;
}

interface RfqProposal {
  id: string;
  supplierName: string;
  unitPrice: number;
  shippingDays: number;
  qualityScore: number; // out of 10
}

interface RFQ {
  id: string;
  itemName: string;
  quantityRequested: number;
  proposals: RfqProposal[];
  status: 'Open' | 'Closed_Awarded';
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  itemName: string;
  quantity: number;
  totalCost: number;
  createdAt: string;
  receivingStatus: 'Not Received' | 'Partially Received' | 'Fully Confirmed';
  inspectedNotes: string;
}

export default function ProcurementModule({ isAr, canEdit, userRole = 'Employee' }: { isAr: boolean; canEdit: boolean; userRole?: string }) {
  // Suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('yafta_procurement_suppliers');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'sup-1', name: 'Al-Kharafi Al-Arabi Metals', materialType: 'Iron Backbones & Stainless 304', rating: 4.8, contactPerson: 'Hassan Al-Saeed', creditPeriodDays: 45 },
      { id: 'sup-2', name: 'Al-Masry Cladding Group', materialType: 'ACP Cladding Fireproof 4mm', rating: 4.5, contactPerson: 'Eng. Sherif Aly', creditPeriodDays: 30 },
      { id: 'sup-3', name: 'Cairo Neon & LED imports', materialType: 'Samsung LED & Transformer Power Supplies', rating: 4.7, contactPerson: 'Marina Girgis', creditPeriodDays: 60 }
    ];
  });

  // Purchase Requests (Employee Requisitions)
  const [requests, setRequests] = useState<PurchaseRequest[]>(() => {
    const saved = localStorage.getItem('yafta_purchase_requests');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'req-1', itemName: 'Korean LED Modules 1.5W Red IP67', quantity: 600, unit: 'Pcs', requestedBy: 'Sherif Abdel Wahab', priority: 'High', status: 'PO Issued', estimatedCost: 12000 },
      { id: 'req-2', itemName: 'Aluminum Cladding Panels Matte Champagne 4mm', quantity: 150, unit: 'Sqm', requestedBy: 'Ibrahim Farouk', priority: 'High', status: 'Pending Manager', estimatedCost: 142500 },
      { id: 'req-3', itemName: 'CNC Laser Mechanical Acrylic Drill bits', quantity: 15, unit: 'Pack', requestedBy: 'Ahmed Refaat', priority: 'Medium', status: 'Approved', estimatedCost: 4500 }
    ];
  });

  // RFQ Compare Board
  const [rfqs, setRfqs] = useState<RFQ[]>(() => {
    const saved = localStorage.getItem('yafta_rfqs_compare');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'rfq-1',
        itemName: 'Imported Neon Flex 12V High-density Silicon',
        quantityRequested: 200,
        status: 'Open',
        proposals: [
          { id: 'p-1', supplierName: 'Cairo Neon & LED imports', unitPrice: 35, shippingDays: 3, qualityScore: 8 },
          { id: 'p-2', supplierName: 'Yasin Acrylic Trade Dokki', unitPrice: 32, shippingDays: 6, qualityScore: 7 },
          { id: 'p-3', supplierName: 'Elite Signage Components Heliopolis', unitPrice: 42, shippingDays: 1, qualityScore: 9.5 }
        ]
      }
    ];
  });

  // Purchase Orders (POs) + warehouse check-ins
  const [pos, setPos] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('yafta_purchase_orders');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'po-1',
        poNumber: 'PO-2026-0043',
        supplierName: 'Cairo Neon & LED imports',
        itemName: 'Korean LED Modules 1.5W Red IP67',
        quantity: 600,
        totalCost: 12000,
        createdAt: '2026-06-18',
        receivingStatus: 'Partially Received',
        inspectedNotes: 'Warehouse team Checked 450 pieces. Remaining 150 pieces pending import customs.'
      }
    ];
  });

  // Form states
  const [addingSupplier, setAddingSupplier] = useState(false);
  const [addingRequest, setAddingRequest] = useState(false);

  // Supplier Form
  const [supName, setSupName] = useState('');
  const [supMatSelect, setSupMatSelect] = useState('Iron Backbones & Stainless 304');
  const [supRating, setSupRating] = useState<number>(4.5);
  const [supContact, setSupContact] = useState('');
  const [supCredit, setSupCredit] = useState<number>(30);

  // Request Form
  const [reqItem, setReqItem] = useState('');
  const [reqQty, setReqQty] = useState<number>(50);
  const [reqUnit, setReqUnit] = useState('Pcs');
  const [reqEstCost, setReqEstCost] = useState<number>(1000);
  const [reqPri, setReqPri] = useState<PurchaseRequest['priority']>('Medium');

  // Receiving process Modal form
  const [inspectedNotesInput, setInspectedNotesInput] = useState('');
  const [recStatusField, setRecStatusField] = useState<'Not Received' | 'Partially Received' | 'Fully Confirmed'>('Fully Confirmed');
  const [isReceivingOpen, setIsReceivingOpen] = useState(false);
  const [targetPoId, setTargetPoId] = useState('');

  useEffect(() => {
    localStorage.setItem('yafta_procurement_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('yafta_purchase_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('yafta_rfqs_compare', JSON.stringify(rfqs));
  }, [rfqs]);

  useEffect(() => {
    localStorage.setItem('yafta_purchase_orders', JSON.stringify(pos));
  }, [pos]);

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName) return;

    const newSup: Supplier = {
      id: `sup-${Date.now()}`,
      name: supName,
      materialType: supMatSelect,
      rating: supRating,
      contactPerson: supContact || 'Sales Rep',
      creditPeriodDays: supCredit
    };

    setSuppliers([...suppliers, newSup]);
    setSupName('');
    setSupContact('');
    setAddingSupplier(false);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqItem) return;

    const newReq: PurchaseRequest = {
      id: `req-${Date.now()}`,
      itemName: reqItem,
      quantity: reqQty,
      unit: reqUnit,
      requestedBy: userRole === 'Client' ? 'Client System' : 'Eng. Crew Member',
      priority: reqPri,
      status: 'Pending Manager',
      estimatedCost: reqEstCost
    };

    setRequests([newReq, ...requests]);
    setReqItem('');
    setReqQty(50);
    setReqEstCost(1000);
    setAddingRequest(false);
  };

  const handleApproveRequest = (reqId: string, action: 'Approved' | 'Rejected') => {
    const target = requests.find(r => r.id === reqId);
    if (!target) return;

    // SLA Auto-escalation message
    if (target.estimatedCost > 50000 && userRole !== 'Admin' && userRole !== 'Super Admin') {
      alert(isAr 
        ? '⚠️ إشعار سلامة: قيمة الطلب تفوق 50,000 ج.م! تم تصعيد معاملة الموافقة لمدير الإدارة المالية الرئيسي.' 
        : '⚠️ Security warning: Procurement amount exceeds EGP 50,000! Request escalated to Super Admin sign-off queue.');
      return;
    }

    const updated = requests.map(r => {
      if (r.id === reqId) {
        return { ...r, status: action };
      }
      return r;
    });
    setRequests(updated);
  };

  const handleIssuePOFromRequest = (req: PurchaseRequest) => {
    const poNum = `PO-2026-0${Math.floor(1000 + Math.random() * 9000)}`;
    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: poNum,
      supplierName: 'Al-Masry Cladding Group', // default matching supplier
      itemName: req.itemName,
      quantity: req.quantity,
      totalCost: req.estimatedCost,
      createdAt: new Date().toISOString().split('T')[0],
      receivingStatus: 'Not Received',
      inspectedNotes: 'Pending supplier shipment routing.'
    };

    setPos([newPO, ...pos]);
    
    // update request state
    const updatedReqs = requests.map(r => {
      if (r.id === req.id) {
        return { ...r, status: 'PO Issued' as const };
      }
      return r;
    });
    setRequests(updatedReqs);
    alert(isAr ? `تم تمويه وتصدير أمر الشراء الرسمي ${poNum}` : `Dispatched official purchase order ${poNum}`);
  };

  // Helper comparative factors for RFQ Proposal table
  const findBestBid = (proposalList: RfqProposal[]) => {
    if (proposalList.length === 0) return null;
    return proposalList.reduce((min, p) => p.unitPrice < min.unitPrice ? p : min, proposalList[0]);
  };

  const findBestQuality = (proposalList: RfqProposal[]) => {
    if (proposalList.length === 0) return null;
    return proposalList.reduce((max, p) => p.qualityScore > max.qualityScore ? p : max, proposalList[0]);
  };

  const findFastestBid = (proposalList: RfqProposal[]) => {
    if (proposalList.length === 0) return null;
    return proposalList.reduce((min, p) => p.shippingDays < min.shippingDays ? p : min, proposalList[0]);
  };

  const handleAuditCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectedNotesInput) return;

    const updated = pos.map(p => {
      if (p.id === targetPoId) {
        return {
          ...p,
          receivingStatus: recStatusField,
          inspectedNotes: inspectedNotesInput
        };
      }
      return p;
    });

    setPos(updated);
    setIsReceivingOpen(false);
    setInspectedNotesInput('');
    alert(isAr ? 'تم تقييد فحص الخامات وتحديث السجل المخزني بنجاح!' : 'Commodity inspected and checked-in to active inventory.');
  };

  return (
    <div className="bg-neutral-950 p-6 rounded-2xl border border-gold-505/20 text-right font-sans space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-row-reverse">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-end">
            <ShoppingBag className="w-5 h-5 text-gold-505" />
            <span>{isAr ? 'شؤون التوريد والمشتريات والاعتمادات المالية' : 'Executive Procurement & Supplier Operations'}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isAr ? 'مقارنات تسعير الموردين، إصدار أوامر الشراء الرسمية التلقائية، وفحص خامات المخازن' : 'RFQ vendor cost comparisons, automatic PO workflow triggers, warehouse cargo inspections and check-ins.'}
          </p>
        </div>

        <div className="flex gap-2">
          {canEdit && (
            <button 
              onClick={() => setAddingSupplier(true)}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-850 hover:border-gold-505/20 border border-neutral-850 text-xs text-zinc-100 rounded-lg flex items-center gap-1.5 cursor-pointer font-bold transition-all"
            >
              <Users className="w-4 h-4 text-gold-505" />
              <span>{isAr ? 'إدراج مورد جديد' : 'Onboard Supplier'}</span>
            </button>
          )}
          {canEdit && (
            <button 
              onClick={() => setAddingRequest(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-black hover:opacity-90 text-xs font-black rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'طلب خامات فني' : 'Submit Requisition'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Suppliers Profiles Vault */}
        <div className="lg:col-span-1 bg-neutral-900/40 p-4 rounded-xl border border-neutral-850 space-y-4">
          <h4 className="text-xs font-black text-gold-300 flex items-center justify-end gap-1.5 pb-2 border-b border-neutral-800">
            <span>{isAr ? 'قاعدة بيانات الموردين المعتمدين:' : 'CERTIFIED SUPPLIERS DIRECTORY:'}</span>
            <Building2 className="w-4 h-4 text-gold-505" />
          </h4>

          <div className="space-y-3 max-h-[350px] overflow-y-auto">
            {suppliers.map(s => (
              <div key={s.id} className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-850 text-right space-y-1.5 hover:border-gold-505/25 transition-all">
                <div className="flex justify-between items-center flex-row-reverse">
                  <strong className="text-xs text-white block">{s.name}</strong>
                  <span className="text-[10px] text-gold-300 font-mono font-black">⭐ {s.rating.toFixed(1)}</span>
                </div>
                <p className="text-[10px] text-zinc-400">{s.materialType}</p>
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono flex-row-reverse pt-1 border-t border-neutral-900">
                  <span>{isAr ? `مسؤول الاتصال: ${s.contactPerson}` : `Contact: ${s.contactPerson}`}</span>
                  <span>{s.creditPeriodDays} {isAr ? 'يوم دفع' : 'days credit'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requests & Approval Workflow */}
        <div className="lg:col-span-2 bg-neutral-900/60 p-5 rounded-2xl border border-neutral-850 space-y-4">
          <h4 className="text-xs font-black text-white flex items-center justify-end gap-1.5 pb-2 border-b border-neutral-800">
            <span>{isAr ? 'طلبات توفير الخامات الميدانية وقبول المدراء:' : 'RAW MATERIALS REQUISITION BOARD:'}</span>
            <ClipboardList className="w-4 h-4 text-gold-505" />
          </h4>

          <div className="divide-y divide-neutral-900 max-h-[350px] overflow-y-auto">
            {requests.map(req => (
              <div key={req.id} className="py-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-right">
                
                {/* Actions & Price */}
                <div className="flex items-center gap-3.5 flex-wrap justify-end">
                  <div className="text-left font-mono pr-2">
                    <span className="text-[10px] text-zinc-500 block">{req.quantity} {req.unit}</span>
                    <strong className="text-white text-xs block">EGP {req.estimatedCost.toLocaleString()}</strong>
                  </div>

                  {req.status === 'Pending Manager' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleApproveRequest(req.id, 'Approved')}
                        className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/10 text-[9px] font-black rounded cursor-pointer"
                      >
                        {isAr ? 'قبول' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleApproveRequest(req.id, 'Rejected')}
                        className="px-2 py-1 bg-rose-950 text-rose-400 text-[9px] font-black rounded cursor-pointer"
                      >
                        {isAr ? 'رفض' : 'Reject'}
                      </button>
                    </div>
                  )}

                  {req.status === 'Approved' && (
                    <button
                      onClick={() => handleIssuePOFromRequest(req)}
                      className="px-2.5 py-1 bg-gold-505 hover:bg-gold-400 text-neutral-950 text-[10px] font-black rounded flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      <span>{isAr ? 'إصدار PO كود' : 'Dispatch PO'}</span>
                    </button>
                  )}

                  {req.status === 'PO Issued' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-neutral-950 text-gold-505 border border-gold-505/20 shrink-0">
                      🚚 {isAr ? 'أمر الشراء مفعل' : 'PO Active'}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className={`px-1 text-[8px] font-black uppercase rounded ${
                      req.priority === 'High' || req.priority === 'Emergency' ? 'bg-rose-950 text-rose-300' : 'bg-neutral-900 text-zinc-400'
                    }`}>
                      {req.priority}
                    </span>
                    <strong className="text-xs text-white block">{req.itemName}</strong>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-snug">
                    {isAr ? `مقدم الطلب: ${req.requestedBy}` : `Requested by: ${req.requestedBy}`} | STATUS: <strong className="text-zinc-300">{req.status}</strong>
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RFQ COMPARATIVE PRICE MATRIX */}
      <div className="border-t border-neutral-900 pt-6 space-y-4">
        <h3 className="text-sm font-black text-white flex items-center gap-2 justify-end">
          <span>{isAr ? 'لوحة المقارنة الذكية للمناقصات والأسعار (RFQ Compare):' : 'Bidding & Cost Oracle (RFQ Analysis Grid):'}</span>
          <Scale className="w-4 h-4 text-gold-505" />
        </h3>

        {rfqs.map(rfq => {
          const lowestProposal = findBestBid(rfq.proposals);
          const highestQuality = findBestQuality(rfq.proposals);
          const fastestProposal = findFastestBid(rfq.proposals);

          return (
            <div key={rfq.id} className="bg-neutral-900/60 p-5 rounded-2xl border border-neutral-850 space-y-4">
              <div className="flex justify-between items-center flex-row-reverse border-b border-neutral-800 pb-3">
                <div className="space-y-0.5 text-right">
                  <strong className="text-xs text-gold-300 font-extrabold">{isAr ? 'مستند المناقصة المفتوح:' : 'Active Tender Target:'}</strong>
                  <h4 className="text-sm font-black text-white">{rfq.itemName} (x{rfq.quantityRequested})</h4>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">RFQ-ID: {rfq.id}</span>
              </div>

              {/* Proposals comparative cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rfq.proposals.map(proposal => {
                  const isLowest = lowestProposal?.id === proposal.id;
                  const isBestQuality = highestQuality?.id === proposal.id;
                  const isFastest = fastestProposal?.id === proposal.id;

                  return (
                    <div 
                      key={proposal.id} 
                      className={`p-4 bg-neutral-950 rounded-xl border text-right space-y-3 relative ${
                        isLowest ? 'border-emerald-500/20 shadow-lg' : 'border-neutral-850'
                      }`}
                    >
                      {/* comparative highlights badges */}
                      <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                        {isLowest && (
                          <span className="px-1.5 py-0.5 text-[8px] font-black bg-emerald-950 text-emerald-400 rounded">
                            💰 {isAr ? 'الأقل سعراً' : 'Lowest bid'}
                          </span>
                        )}
                        {isBestQuality && (
                          <span className="px-1.5 py-0.5 text-[8px] font-black bg-yellow-950 text-gold-300 rounded">
                            💎 {isAr ? 'أعلى جودة' : 'Premium Quality'}
                          </span>
                        )}
                        {isFastest && (
                          <span className="px-1.5 py-0.5 text-[8px] font-black bg-rose-950 text-rose-300 rounded">
                            ⚡ {isAr ? 'الأسرع توصيلاً' : 'Fastest Delivery'}
                          </span>
                        )}
                      </div>

                      <strong className="text-xs text-white block pt-3">{proposal.supplierName}</strong>
                      
                      <div className="divide-y divide-neutral-900 border border-neutral-900 rounded bg-neutral-900/10 text-[10px] text-zinc-400">
                        <div className="flex justify-between items-center p-1.5 flex-row-reverse">
                          <span>{isAr ? 'سعر الوحدة المقترح:' : 'Proposed Unit cash:'}</span>
                          <strong className="text-white font-mono">{proposal.unitPrice} EGP</strong>
                        </div>
                        <div className="flex justify-between items-center p-1.5 flex-row-reverse">
                          <span>{isAr ? 'زمن النقل البري:' : 'Estimated Delivery:'}</span>
                          <span className="text-zinc-300 font-semibold">{proposal.shippingDays} {isAr ? 'أيام' : 'days'}</span>
                        </div>
                        <div className="flex justify-between items-center p-1.5 flex-row-reverse">
                          <span>{isAr ? 'فهرس جودة التجهيز:' : 'Component Quality score:'}</span>
                          <span className="text-gold-300 font-bold">{proposal.qualityScore}/10</span>
                        </div>
                      </div>

                      {canEdit && (
                        <button 
                          onClick={() => {
                            alert(isAr 
                              ? `تم ترسية المناقصة على المورد "${proposal.supplierName}" آلياً بقيمة إجمالية قدرها ${(proposal.unitPrice * rfq.quantityRequested).toLocaleString()} ج.م`
                              : `Awarded supply tender to "${proposal.supplierName}" for a total of EGP ${(proposal.unitPrice * rfq.quantityRequested).toLocaleString()}`);
                            const autoPO: PurchaseOrder = {
                              id: `po-${Date.now()}`,
                              poNumber: `PO-RFQ-0${Math.floor(100 + Math.random() * 900)}`,
                              supplierName: proposal.supplierName,
                              itemName: rfq.itemName,
                              quantity: rfq.quantityRequested,
                              totalCost: proposal.unitPrice * rfq.quantityRequested,
                              createdAt: new Date().toISOString().split('T')[0],
                              receivingStatus: 'Not Received',
                              inspectedNotes: 'Awarded tender from automatic comparative RFQs analysis.'
                            };
                            setPos([autoPO, ...pos]);
                          }}
                          className="w-full py-1.5 bg-neutral-900 hover:bg-neutral-850 hover:text-gold-505 border border-zinc-800 text-xs font-bold text-center rounded block cursor-pointer transition-all"
                        >
                          🏅 {isAr ? 'ترسية المناقصة وإصدار أمر الشراء' : 'Award & Issue PO'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* PO LISTING AND SHIPPING CHECK-IN */}
      <div className="border-t border-neutral-900 pt-6 space-y-4">
        <h3 className="text-sm font-black text-white flex items-center gap-2 justify-end">
          <span>{isAr ? 'أوامر الشراء المصدرة ومحاضر الفحص المخزني:' : 'Inbound Shipping & Warehouse QA Check-ins:'}</span>
          <PackageCheck className="w-4 h-4 text-gold-505" />
        </h3>

        <div className="divide-y divide-neutral-900 border border-neutral-850 rounded-xl overflow-hidden bg-neutral-900/20">
          {pos.map(order => (
            <div key={order.id} className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 text-right">
              
              <div className="flex gap-2 items-center flex-wrap justify-end">
                <span className={`text-[9px] px-2 py-0.5 rounded font-black ${
                  order.receivingStatus === 'Fully Confirmed' ? 'bg-emerald-950 text-emerald-300' :
                  order.receivingStatus === 'Partially Received' ? 'bg-yellow-950 text-gold-300' :
                  'bg-zinc-900 text-zinc-500'
                }`}>
                  {order.receivingStatus}
                </span>

                {canEdit && order.receivingStatus !== 'Fully Confirmed' && (
                  <button 
                    onClick={() => {
                      setTargetPoId(order.id);
                      setInspectedNotesInput(order.inspectedNotes);
                      setIsReceivingOpen(true);
                    }}
                    className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-900 hover:border-gold-505 border border-neutral-850 text-[10px] text-gold-300 hover:text-white rounded transition-colors cursor-pointer"
                  >
                    🔍 {isAr ? 'تسجيل فحص واستلام شحنة' : 'Inspect Received Cargo'}
                  </button>
                )}
              </div>

              <div className="space-y-1 text-right">
                <div className="flex items-center gap-1.5 justify-end flex-row-reverse">
                  <span className="text-[10px] bg-neutral-950 text-zinc-500 px-1.5 py-0.5 rounded font-mono font-bold">{order.poNumber}</span>
                  <strong className="text-xs text-white">{order.itemName} (x{order.quantity})</strong>
                </div>
                <p className="text-[10px] text-zinc-400">
                  {isAr ? `تاريخ الصدور: ${order.createdAt}` : `Issued: ${order.createdAt}`} | {isAr ? `تفاصيل الفحص:` : `Check notes:`} <strong className="text-zinc-300 leading-normal">{order.inspectedNotes}</strong>
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Onboard Supplier modal */}
      {addingSupplier && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-sm w-full relative space-y-6 text-right">
            <h3 className="text-base font-black text-white flex items-center gap-1.5 justify-end">
              <span>{isAr ? 'تسجيل وإدراج مورد قانوني جديد' : 'Register New Enterprise Supplier'}</span>
              <Building2 className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleCreateSupplier} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'اسم الشركة التجارية (المورد):' : 'Supplier Company Name:'}</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Al-Kharafi Metals"
                  value={supName}
                  onChange={e => setSupName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right focus:outline-none focus:border-gold-505"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'صنف الخامات الموردة:' : 'Material Categories Supplied:'}</label>
                <select 
                  value={supMatSelect}
                  onChange={e => setSupMatSelect(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white font-bold text-right"
                >
                  <option value="Iron Backbones & Stainless 304">{isAr ? 'الحديد والستانلس ستิล ٣٠٤' : 'Heavy Metal & Iron backbones'}</option>
                  <option value="ACP Cladding Fireproof 4mm">{isAr ? 'ألواح مجرى كلادينج ألومنيوم 4 مم' : 'Aluminum Cladding (ACP) panels'}</option>
                  <option value="Samsung LED & Transformer Power Supplies">{isAr ? 'ليدات سامسونج كوري ومحولات الضوء' : 'LED modules & electronics'}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'مسؤول الدعم' : 'Contact Person'}</label>
                  <input 
                    type="text" 
                    placeholder="Marina Girgis"
                    value={supContact}
                    onChange={e => setSupContact(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2 rounded text-white text-right"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'فترة السداد (أيام)' : 'Credit Days'}</label>
                  <input 
                    type="number" 
                    min={0}
                    value={supCredit}
                    onChange={e => setSupCredit(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2 rounded text-white text-right font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setAddingSupplier(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg border border-neutral-850 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 text-xs font-black rounded-lg transition-all cursor-pointer shadow-md hover:bg-gold-400"
                >
                  {isAr ? 'إدراج في الفهارس' : 'Onboard Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Requisition Request modal */}
      {addingRequest && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-sm w-full relative space-y-6 text-right">
            <h3 className="text-base font-black text-white flex items-center gap-1.5 justify-end">
              <span>{isAr ? 'تقديم طلب توفير واحتياج خامات فني' : 'Submit Raw Requisition Order'}</span>
              <ClipboardList className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'بيان الخامات المطلوبة بدقة:' : 'Item / material specification:'}</label>
                <input 
                  type="text" 
                  required
                  placeholder="Red Neon Flex silicone tubes"
                  value={reqItem}
                  onChange={e => setReqItem(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right focus:outline-none focus:border-gold-505"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'الكمية المطلوبة' : 'Quantity'}</label>
                  <input 
                    type="number" 
                    min={1}
                    required
                    value={reqQty}
                    onChange={e => setReqQty(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2.5 rounded text-white text-right font-mono focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'وحدة التعيين' : 'Unit measure'}</label>
                  <input 
                    type="text" 
                    required
                    value={reqUnit}
                    onChange={e => setReqUnit(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2.5 rounded text-white text-center font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'التكلفة التقريبية المقدرة:' : 'Estimated Cost EGP:'}</label>
                  <input 
                    type="number" 
                    min={5}
                    required
                    value={reqEstCost}
                    onChange={e => setReqEstCost(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2.5 rounded text-white text-right font-mono focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 block pb-1">{isAr ? 'درجة الأولوية' : 'Priority'}</label>
                  <select 
                    value={reqPri}
                    onChange={e => setReqPri(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs p-2.5 rounded text-white font-bold"
                  >
                    <option value="Low">Low priority</option>
                    <option value="Medium">Medium priority</option>
                    <option value="High">High priority</option>
                    <option value="Emergency">🚨 EMERGENCY CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setAddingRequest(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg border border-neutral-850 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 text-xs font-black rounded-lg transition-all cursor-pointer shadow-md hover:bg-gold-400"
                >
                  {isAr ? 'إرسال للمراجعة المباشرة' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cargo Inspection Modal */}
      {isReceivingOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-gold-505/30 rounded-2xl p-6 md:p-8 max-w-sm w-full relative space-y-6 text-right">
            <h3 className="text-base font-black text-white flex items-center gap-1.5 justify-end">
              <span>{isAr ? 'تسجيل محضر الفحص واستلام الشحنات' : 'Declare Warehouse Cargo Receipt'}</span>
              <PackageCheck className="w-5 h-5 text-gold-505" />
            </h3>

            <form onSubmit={handleAuditCheckInSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'الحالة المخزنية للاستلام:' : 'Cargo Receiving status:'}</label>
                <select 
                  value={recStatusField}
                  onChange={e => setRecStatusField(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white font-bold"
                >
                  <option value="Partially Received">{isAr ? 'استلام جزئي (Partially Received)' : 'Cargo partially received'}</option>
                  <option value="Fully Confirmed">{isAr ? 'استلام كامل ومطابق للفحص الكلي (Fully Received)' : 'Fully inspected & matches guidelines'}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 block font-bold">{isAr ? 'تقرير وملاحظات التدقيق والاستلام الفني:' : 'Notes from QA Inspection:'}</label>
                <textarea 
                  required
                  rows={3}
                  value={inspectedNotesInput}
                  onChange={e => setInspectedNotesInput(e.target.value)}
                  placeholder={isAr ? 'مثال: تم تفريغ الشحنة ووجدت مطابقة تامّة للمقاييس الكورية...' : 'Verified material thickness meets 4mm fire rating...'}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white text-right focus:outline-none focus:border-gold-505 font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsReceivingOpen(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-400 font-bold rounded-lg border border-neutral-850 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-gold-300 to-gold-505 text-neutral-950 text-xs font-black rounded-lg transition-all cursor-pointer shadow-md hover:bg-gold-400"
                >
                  {isAr ? 'تأكيد الحفظ المخزني وتسجيل الدخول' : 'Authorize Check-in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
