/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId =
  | 'home'
  | 'services'
  | 'portfolio'
  | 'signage'
  | 'cladding'
  | 'printing'
  | 'digital'
  | 'portal'
  | 'about'
  | 'contact';

export interface CompanyInfo {
  nameAr: string;
  nameEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  whatsapp: string;
  emails: string[];
  website: string;
}

export interface Project {
  id: string;
  titleAr: string;
  titleEn: string;
  clientAr: string;
  clientEn: string;
  category: string; // matches Category types
  industryAr: string;
  industryEn: string;
  serviceTypeAr: string;
  serviceTypeEn: string;
  completionDate: string;
  overviewAr: string;
  overviewEn: string;
  resultsAr: string;
  resultsEn: string;
  coverImage: string;
  galleryImages: string[];
  
  // Custom states
  beforeImage?: string;
  afterImage?: string;
  featured?: boolean;
  visible?: boolean;
  
  // Case Study details
  challengeAr?: string;
  challengeEn?: string;
  researchAr?: string;
  researchEn?: string;
  conceptAr?: string;
  conceptEn?: string;
  designAr?: string;
  designEn?: string;
  productionAr?: string;
  productionEn?: string;
  stagesAr?: string[];
  stagesEn?: string[];
  feedbackAr?: string;
  feedbackEn?: string;
  rating?: number;

  // Signage/Cladding specs if relevant
  specificationsAr?: string[];
  specificationsEn?: string[];
}

export interface BeforeAfterItem {
  id: string;
  categoryAr: string;
  categoryEn: string;
  titleAr: string;
  titleEn: string;
  beforeImage: string;
  afterImage: string;
  specsAr: string[];
  specsEn: string[];
}

export interface Testimonial {
  id: string;
  clientNameAr: string;
  clientNameEn: string;
  companyAr: string;
  companyEn: string;
  avatar: string;
  rating: number;
  reviewAr: string;
  reviewEn: string;
  projectTypeAr: string;
  projectTypeEn: string;
}

export interface ServiceDetail {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  featuresAr: string[];
  featuresEn: string[];
  iconName: string; // Key of lucide icon
  image: string;
}

export interface FaqItem {
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}

export interface LogoConfig {
  logoType: 'text' | 'icon' | 'image' | 'svg';
  imageSrcLight: string;
  imageSrcDark: string;
  svgCodeLight: string;
  svgCodeDark: string;
  brandTextAr: string;
  brandTextEn: string;
  brandSubtitleAr: string;
  brandSubtitleEn: string;
  sizeMobile: number;
  sizeTablet: number;
  sizeDesktop: number;
  colorAccent: string;
  opacity: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  padding: number;
  position: 'left' | 'center' | 'right' | 'custom';
  customX: number;
  customY: number;
  visibleInHeader: boolean;
  visibleInHero: boolean;
  visibleInFooter: boolean;
  visibleInMenu: boolean;
  animation: 'none' | 'spin-slow' | 'bounce-slow' | 'pulse-slow' | 'glow-breath' | 'slide-in';
  hoverEffect: 'none' | 'scale' | 'rotate' | 'brightness' | 'gold-shine';
  scrollEffect: 'none' | 'shrink' | 'fade-out' | 'skew';
}

export type UserRole = 'Super Admin' | 'Admin' | 'Manager' | 'Employee' | 'Client' | 'Visitor';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  phone?: string;
  registeredDate?: string;
  status?: 'active' | 'suspended';
  assignedTasks?: string[];
}


