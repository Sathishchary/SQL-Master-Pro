import { SubscriptionPlan } from './common.model';
import { User } from './user.model';

export interface Payment {
  id: number;
  userId: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  subscriptionPlan?: SubscriptionPlan;
  planDuration?: 'MONTHLY' | 'YEARLY';
  subscriptionStart?: string;
  subscriptionEnd?: string;
  invoiceNumber?: string;
  createdAt: string;
}

export interface PricingPlanDto {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  popular?: boolean;
  features: string[];
}

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  monthly: number;
  yearlyMonthly: number;
  yearly: number;
  popular: boolean;
  cta: string;
  features: PlanFeature[];
}

export interface PlanSummary {
  name: string;
  price: number;
  sub: string;
  popular: boolean;
  features: string[];
}

export interface ComparisonRow {
  feature: string;
  values: (string | boolean)[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface CheckoutPlanDetails {
  name: string;
  price: number;
  features: string[];
}

export interface PaymentOrder {
  amount: number;
  orderId: string;
}

export interface RazorpayVerifyRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PaymentVerifyResult {
  user?: User;
}

export interface UpiVerifyRequest {
  upiTransactionId: string;
  plan: string;
  duration: string;
  amount: string;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
