export interface Material {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  thicknessOptions: number[]; // in mm
  thicknessPrices: Record<number, number>; // thickness -> added EGP per sqm
  durabilityAr: string;
  durabilityEn: string;
  indicator: 'indoor' | 'outdoor' | 'both';
  pricePerSqm: number;
  badge: 'popular' | 'premium' | 'recommended' | 'none';
  advantagesAr: string[];
  advantagesEn: string[];
  disadvantagesAr: string[];
  disadvantagesEn: string[];
  textureUrl?: string;
  colorOptions?: string[];
}

export interface PricingRule {
  id: string;
  nameAr: string;
  nameEn: string;
  type: 'bulk' | 'quantity' | 'promo' | 'seasonal';
  discountPercent: number;
  minQty: number;
  active: boolean;
}

export interface DimensionRule {
  id: string;
  nameAr: string;
  nameEn: string;
  unit: 'cm' | 'mm' | 'm';
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  presetSizes: {
    labelAr: string;
    labelEn: string;
    w: number;
    h: number;
  }[];
}

export interface ProductTemplate {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'signage' | 'printing' | 'digital';
  baseMaterialId: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultQty: number;
}

export interface Quotation {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientCompany: string;
  date: string;
  category: string;
  productLabel: string;
  dimensions: string;
  quantity: number;
  subtotal: number;
  tax: number;
  grandTotal: number;
  status: 'pending' | 'approved' | 'rejected';
  costBreakdown: {
    baseMaterialCost: number;
    areaCost: number;
    thicknessCost: number;
    printingCost: number;
    finishingCost: number;
    installationCost: number;
    transportationCost: number;
    urgencyCost: number;
    promoDiscount: number;
  };
}

export interface ConfigSettings {
  baseProcessingCost: number;
  printingCostPerSqm: number;
  finishingOptions: {
    id: string;
    nameAr: string;
    nameEn: string;
    price: number;
  }[];
  installationCostPerSqm: number;
  transportationCostPerKm: number;
  urgencyFactor: number;
  profitMargin: number;
}
