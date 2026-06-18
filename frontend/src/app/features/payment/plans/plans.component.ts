import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { PricingPlan, ComparisonRow, FaqItem } from '../../../core/models/models';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatButtonModule, MatIconModule,
    MatCardModule, MatSlideToggleModule, MatChipsModule],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {
  isYearly = false;

  plans: PricingPlan[] = [
    { id: 'FREE', name: 'Free', icon: '🌱', tagline: 'Start your SQL journey', monthly: 0, yearlyMonthly: 0, yearly: 0, popular: false, cta: 'Get Started',
      features: [
        { text: '10 Lessons per month', included: true },
        { text: '5 Quiz attempts', included: true },
        { text: 'Basic SQL editor', included: true },
        { text: 'Community support', included: true },
        { text: 'Advanced challenges', included: false },
        { text: 'Certificates', included: false },
        { text: 'AI SQL Assistant', included: false }
      ]
    },
    { id: 'BASIC', name: 'Basic', icon: '🚀', tagline: 'For serious learners', monthly: 499, yearlyMonthly: 416, yearly: 4999, popular: false, cta: 'Start Basic',
      features: [
        { text: '50 Lessons per month', included: true },
        { text: 'Unlimited quiz attempts', included: true },
        { text: 'Advanced SQL editor', included: true },
        { text: 'Email support', included: true },
        { text: 'Certificates', included: true },
        { text: '50 Challenges', included: true },
        { text: 'AI SQL Assistant', included: false }
      ]
    },
    { id: 'PRO', name: 'Pro', icon: '⭐', tagline: 'Most popular choice', monthly: 999, yearlyMonthly: 833, yearly: 9999, popular: true, cta: 'Start Pro',
      features: [
        { text: 'Unlimited lessons', included: true },
        { text: 'Unlimited quizzes', included: true },
        { text: '300+ Challenges', included: true },
        { text: 'Priority support', included: true },
        { text: 'All certificates', included: true },
        { text: 'AI SQL Assistant', included: true },
        { text: 'Interview preparation', included: true }
      ]
    },
    { id: 'ENTERPRISE', name: 'Enterprise', icon: '🏢', tagline: 'For teams & organizations', monthly: 2999, yearlyMonthly: 2499, yearly: 29999, popular: false, cta: 'Contact Sales',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Team management', included: true },
        { text: 'Custom learning paths', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'API access', included: true },
        { text: 'SSO integration', included: true },
        { text: 'SLA guarantee', included: true }
      ]
    }
  ];

  comparisonRows: ComparisonRow[] = [
    { feature: 'SQL Lessons', values: ['10/month', '50/month', 'Unlimited', 'Unlimited'] },
    { feature: 'Quiz Questions', values: ['50', '200', '650+', '650+'] },
    { feature: 'SQL Challenges', values: [false, '50', '300+', '900+'] },
    { feature: 'SQL Playground', values: [true, true, true, true] },
    { feature: 'Certificates', values: [false, true, true, true] },
    { feature: 'AI SQL Assistant', values: [false, false, true, true] },
    { feature: 'Interview Prep', values: [false, false, true, true] },
    { feature: 'Team Management', values: [false, false, false, true] },
    { feature: 'Support', values: ['Community', 'Email', 'Priority', 'Dedicated'] }
  ];

  faqs: FaqItem[] = [
    { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription anytime. Your access continues until the end of the billing period.' },
    { q: 'Is there a free trial?', a: 'The Free plan is always available. Paid plans have a 7-day money-back guarantee.' },
    { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI, and net banking through Razorpay.' },
    { q: 'Can I switch plans?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.' },
    { q: 'Is SQL execution safe?', a: 'Yes, all SQL execution happens in sandboxed schemas with read-only access to sample data.' },
    { q: 'Do certificates expire?', a: 'SQL Master Pro certificates do not expire and include a QR code for permanent verification.' }
  ];

  constructor(private authService: AuthService, private apiService: ApiService) {}

  ngOnInit(): void {}

  isCurrentPlan(planId: string): boolean {
    return this.authService.currentUser()?.subscriptionPlan === planId;
  }

  selectPlan(plan: PricingPlan): void {
    if (!this.authService.isAuthenticated()) {
      window.location.href = '/auth/register';
      return;
    }
    if (plan.monthly === 0) return;
    window.location.href = `/checkout?plan=${plan.id}&duration=${this.isYearly ? 'YEARLY' : 'MONTHLY'}`;
  }
}
