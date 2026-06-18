export interface NavItem {
  icon: string;
  label: string;
  path: string;
  badge?: string;
}

export interface ThemeOption {
  value: string;
  label: string;
  icon: string;
}

export interface FilterOption {
  label: string;
  value: string;
  icon: string;
}

export interface TrustStat {
  num: string;
  label: string;
}

export interface FeatureCard {
  icon: string;
  title: string;
  desc: string;
  bg: string;
  gradient?: string;
  color?: string;
  link?: string;
}

export interface ProcessStep {
  icon: string;
  title: string;
  desc: string;
}

export interface ModuleSummary {
  icon: string;
  title: string;
  desc: string;
  level: string;
  lessons: number;
  color: string;
}

export interface BigStat {
  icon: string;
  value: string;
  desc: string;
}

export interface Testimonial {
  text: string;
  name: string;
  role: string;
  company: string;
}

export interface JourneyStep {
  level: string;
  title: string;
  color: string;
  icon: string;
  skills: string[];
}
