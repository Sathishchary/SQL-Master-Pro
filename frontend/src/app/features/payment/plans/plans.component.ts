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

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatButtonModule, MatIconModule,
    MatCardModule, MatSlideToggleModule, MatChipsModule],
  template: `
    <div class="plans-container">
      <div class="plans-header">
        <h1>Choose Your SQL Learning Plan</h1>
        <p>Start free, scale as you grow. All plans include core SQL content.</p>

        <div class="billing-toggle">
          <span [class.active]="!isYearly">Monthly</span>
          <mat-slide-toggle [(ngModel)]="isYearly" color="primary"></mat-slide-toggle>
          <span [class.active]="isYearly">
            Yearly
            <span class="save-badge">Save 40%</span>
          </span>
        </div>
      </div>

      <div class="plans-grid">
        @for (plan of plans; track plan.id) {
          <div class="plan-card" [class.popular]="plan.popular">
            @if (plan.popular) {
              <div class="popular-ribbon">⭐ Most Popular</div>
            }

            <div class="plan-top">
              <div class="plan-icon">{{ plan.icon }}</div>
              <h2 class="plan-name">{{ plan.name }}</h2>
              <p class="plan-tagline">{{ plan.tagline }}</p>
            </div>

            <div class="plan-price">
              <span class="currency">₹</span>
              <span class="amount">{{ isYearly ? plan.yearlyMonthly : plan.monthly }}</span>
              <span class="period">/month</span>
            </div>
            @if (isYearly && plan.yearly > 0) {
              <div class="yearly-note">
                Billed annually ₹{{ plan.yearly }}/year
              </div>
            }

            <ul class="plan-features">
              @for (f of plan.features; track f.text) {
                <li>
                  <mat-icon [class.included]="f.included" [class.excluded]="!f.included">
                    {{ f.included ? 'check_circle' : 'cancel' }}
                  </mat-icon>
                  {{ f.text }}
                </li>
              }
            </ul>

            <button mat-raised-button [color]="plan.popular ? 'primary' : 'basic'"
              [disabled]="isCurrentPlan(plan.id)"
              (click)="selectPlan(plan)" class="plan-cta">
              {{ isCurrentPlan(plan.id) ? 'Current Plan' : plan.cta }}
            </button>
          </div>
        }
      </div>

      <!-- Feature Comparison -->
      <div class="comparison-section">
        <h2>Full Feature Comparison</h2>
        <div class="comparison-table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th>Basic</th>
                <th class="popular-col">Pro</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              @for (row of comparisonRows; track row.feature) {
                <tr>
                  <td class="feature-name">{{ row.feature }}</td>
                  @for (val of row.values; track $index) {
                    <td>
                      @if (val === true) {
                        <mat-icon class="check">check_circle</mat-icon>
                      } @else if (val === false) {
                        <mat-icon class="cross">cancel</mat-icon>
                      } @else {
                        <span>{{ val }}</span>
                      }
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- FAQ -->
      <div class="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div class="faq-grid">
          @for (faq of faqs; track faq.q) {
            <div class="faq-item">
              <h4>{{ faq.q }}</h4>
              <p>{{ faq.a }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .plans-container { max-width: 1200px; margin: 0 auto; padding: 60px 24px; }
    .plans-header { text-align: center; margin-bottom: 48px;
      h1 { font-size: 44px; font-weight: 900; margin-bottom: 12px; }
      p { font-size: 18px; color: var(--text-secondary); margin-bottom: 32px; }
    }
    .billing-toggle { display: flex; align-items: center; justify-content: center; gap: 12px;
      font-size: 16px; font-weight: 600;
      span.active { color: #667eea; }
      .save-badge { background: #48bb78; color: white; padding: 2px 8px;
        border-radius: 20px; font-size: 12px; margin-left: 6px; }
    }
    .plans-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
      margin-top: 48px;
      @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
      @media (max-width: 600px) { grid-template-columns: 1fr; }
    }
    .plan-card { border: 2px solid var(--border); border-radius: 20px; padding: 28px;
      background: var(--surface); position: relative; transition: all 0.3s;
      &:hover { box-shadow: var(--shadow-lg); }
      &.popular { border-color: #667eea; box-shadow: 0 0 0 4px rgba(102,126,234,0.1); }
    }
    .popular-ribbon { background: linear-gradient(135deg, #667eea, #764ba2);
      color: white; font-size: 12px; font-weight: 700; padding: 4px 16px;
      border-radius: 20px; position: absolute; top: -14px; left: 50%;
      transform: translateX(-50%); white-space: nowrap;
    }
    .plan-icon { font-size: 36px; margin-bottom: 8px; }
    .plan-name { font-size: 22px; font-weight: 800; margin: 0 0 4px; }
    .plan-tagline { font-size: 13px; color: var(--text-secondary); margin-bottom: 16px; }
    .plan-price { display: flex; align-items: baseline; gap: 2px; margin: 16px 0 4px;
      .currency { font-size: 20px; font-weight: 700; }
      .amount { font-size: 44px; font-weight: 900; }
      .period { font-size: 14px; color: var(--text-secondary); }
    }
    .yearly-note { font-size: 12px; color: var(--text-muted); margin-bottom: 16px; }
    .plan-features { list-style: none; padding: 0; margin: 16px 0 24px;
      li { display: flex; align-items: center; gap: 8px; padding: 7px 0;
        font-size: 13px; border-bottom: 1px solid var(--border);
        mat-icon { font-size: 18px; width: 18px; height: 18px;
          &.included { color: #48bb78; } &.excluded { color: #e2e8f0; }
        }
      }
    }
    .plan-cta { width: 100%; border-radius: 12px !important; height: 44px !important; }
    .comparison-section { margin-top: 80px;
      h2 { font-size: 32px; font-weight: 800; text-align: center; margin-bottom: 32px; }
    }
    .comparison-table-wrapper { overflow-x: auto; border-radius: 12px;
      border: 1px solid var(--border);
    }
    .comparison-table { width: 100%; border-collapse: collapse;
      th, td { padding: 14px 16px; text-align: center; border-bottom: 1px solid var(--border); }
      th { background: var(--bg-secondary); font-weight: 700; font-size: 14px;
        &.popular-col { background: var(--bg-secondary); color: #667eea; }
      }
      .feature-name { text-align: left; font-weight: 500; font-size: 14px; }
      .check { color: #48bb78; } .cross { color: var(--border); }
      tr:hover td { background: var(--bg-secondary); }
    }
    .faq-section { margin-top: 80px;
      h2 { font-size: 32px; font-weight: 800; text-align: center; margin-bottom: 32px; }
    }
    .faq-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;
      @media (max-width: 768px) { grid-template-columns: 1fr; }
    }
    .faq-item { padding: 24px; border: 1px solid var(--border); border-radius: 16px;
      background: var(--surface);
      h4 { font-size: 16px; font-weight: 700; margin: 0 0 8px; color: var(--text-primary); }
      p { color: var(--text-secondary); font-size: 14px; line-height: 1.7; margin: 0; }
    }
  `]
})
export class PlansComponent implements OnInit {
  isYearly = false;

  plans = [
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

  comparisonRows = [
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

  faqs = [
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

  selectPlan(plan: any): void {
    if (!this.authService.isAuthenticated()) {
      window.location.href = '/auth/register';
      return;
    }
    if (plan.monthly === 0) return;
    window.location.href = `/checkout?plan=${plan.id}&duration=${this.isYearly ? 'YEARLY' : 'MONTHLY'}`;
  }
}
