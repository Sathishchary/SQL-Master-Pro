import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { CheckoutPlanDetails, PaymentOrder, RazorpayResponse } from '../../../core/models/models';

declare const Razorpay: any;

type PayMethod = 'razorpay' | 'upi';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  selectedPlan = 'PRO';
  billingCycle = 'monthly';
  payMethod: PayMethod = 'razorpay';

  rzpLoading = false;
  upiLoading = false;
  copied = false;
  utrNumber = '';

  upiId = environment.upiId;
  upiName = environment.upiName;

  planDetails: CheckoutPlanDetails | null = null;
  orderData: PaymentOrder | null = null;

  private readonly planConfig: Record<string, CheckoutPlanDetails> = {
    BASIC:      { name: 'Basic Plan',      price: 999,  features: ['All Beginner Courses', '50 Quiz Questions', '100 Challenges', 'Email Support'] },
    PRO:        { name: 'Pro Plan',         price: 1999, features: ['All Courses', '650+ Questions', '900+ Challenges', 'Certificates', 'AI Features', 'Priority Support'] },
    ENTERPRISE: { name: 'Enterprise Plan', price: 4999, features: ['Everything in Pro', 'Team Management', 'Custom Domains', 'API Access', 'Dedicated Support'] }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.selectedPlan = this.route.snapshot.queryParamMap.get('plan') || 'PRO';
    this.billingCycle = this.route.snapshot.queryParamMap.get('billing') || 'monthly';
    this.planDetails  = this.planConfig[this.selectedPlan];
    if (!this.planDetails) { this.router.navigate(['/pricing']); }
  }

  // ── UPI deep links ──────────────────────────────────────────────────────────

  private get upiParams(): string {
    const amt  = this.billingCycle === 'yearly'
      ? Math.round(this.planDetails!.price * 12 * 0.6)
      : this.planDetails!.price;
    const note = encodeURIComponent(`${this.selectedPlan} Plan ${this.billingCycle}`);
    return `pa=${encodeURIComponent(this.upiId)}&pn=${encodeURIComponent(this.upiName)}&am=${amt}&cu=INR&tn=${note}`;
  }

  get gpayLink():    string { return `tez://upi/pay?${this.upiParams}&mode=00&purpose=00`; }
  get phonepeLink(): string { return `phonepe://pay?${this.upiParams}`; }
  get paytmLink():   string { return `paytmmp://pay?${this.upiParams}`; }
  get bhimLink():    string { return `upi://pay?${this.upiParams}`; }

  // ── Clipboard ───────────────────────────────────────────────────────────────

  copyUpiId(): void {
    navigator.clipboard.writeText(this.upiId).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2500);
    });
  }

  // ── Razorpay flow ───────────────────────────────────────────────────────────

  initiateRazorpay(): void {
    this.rzpLoading = true;
    const amount = this.billingCycle === 'yearly'
      ? Math.round(this.planDetails!.price * 12 * 0.6)
      : this.planDetails!.price;

    this.apiService.createOrder(this.selectedPlan, this.billingCycle.toUpperCase(), amount).subscribe({
      next: (res) => {
        this.rzpLoading = false;
        if (!res.success) {
          this.snackBar.open('Could not create order. Please try again.', 'Close', { duration: 3000 });
          return;
        }
        this.orderData = res.data;
        this.openRazorpayPopup();
      },
      error: () => {
        this.rzpLoading = false;
        this.snackBar.open('Could not connect to payment server. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  private openRazorpayPopup(): void {
    const user = this.authService.currentUser();
    const options = {
      key: environment.razorpayKeyId,
      amount: this.orderData!.amount * 100,
      currency: 'INR',
      name: 'SQL Master Pro',
      description: `${this.selectedPlan} Plan — ${this.billingCycle}`,
      order_id: this.orderData!.orderId,
      prefill: {
        name:    (user?.firstName ?? '') + ' ' + (user?.lastName ?? ''),
        email:   user?.email ?? '',
        contact: ''
      },
      config: {
        display: {
          blocks: {
            upi: {
              name: 'UPI — Google Pay / PhonePe / Paytm',
              instruments: [{ method: 'upi', flows: ['intent', 'collect', 'qr'] }]
            },
            other: {
              name: 'Cards · Net Banking · Wallets',
              instruments: [
                { method: 'card' },
                { method: 'netbanking' },
                { method: 'wallet' }
              ]
            }
          },
          sequence: ['block.upi', 'block.other'],
          preferences: { show_default_blocks: false }
        }
      },
      theme: { color: '#667eea' },
      modal: {
        ondismiss: () => { this.rzpLoading = false; }
      },
      handler: (response: RazorpayResponse) => { this.verifyRazorpayPayment(response); }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', () => {
      this.snackBar.open('Payment failed. Please try again.', 'Close', { duration: 4000 });
    });
    rzp.open();
  }

  private verifyRazorpayPayment(response: RazorpayResponse): void {
    this.rzpLoading = true;
    this.apiService.verifyPayment({
      razorpayOrderId:   response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature
    }).subscribe({
      next: (res) => {
        this.rzpLoading = false;
        if (res.success) {
          this.snackBar.open(`Payment successful! Welcome to ${this.selectedPlan}!`, 'Close', { duration: 5000 });
          if (res.data?.user) { this.authService.updateCurrentUser(res.data.user); }
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.rzpLoading = false;
        this.snackBar.open('Payment verification failed. Contact support.', 'Close', { duration: 5000 });
      }
    });
  }

  // ── Direct UPI flow ─────────────────────────────────────────────────────────

  submitUpiPayment(): void {
    if (!this.utrNumber.trim()) return;
    this.upiLoading = true;

    const amount = this.billingCycle === 'yearly'
      ? Math.round(this.planDetails!.price * 12 * 0.6)
      : this.planDetails!.price;

    this.apiService.verifyUpiPayment({
      upiTransactionId: this.utrNumber.trim(),
      plan:     this.selectedPlan,
      duration: this.billingCycle.toUpperCase(),
      amount:   String(amount)
    }).subscribe({
      next: (res) => {
        this.upiLoading = false;
        if (res.success) {
          this.snackBar.open(
            'Payment submitted! Your subscription will activate within 24 hours after verification.',
            'Close', { duration: 8000 }
          );
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.upiLoading = false;
        this.snackBar.open('Submission failed. Please try again or contact support.', 'Close', { duration: 4000 });
      }
    });
  }
}
