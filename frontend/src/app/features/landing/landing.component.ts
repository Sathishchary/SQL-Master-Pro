import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <!-- ═══ HERO ═══ -->
    <section class="hero">
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      <div class="hero-orb hero-orb-3"></div>
      <div class="hero-grid"></div>

      <div class="hero-inner">
        <div class="hero-left">
          <div class="hero-pill">
            <span class="pill-dot"></span> New: AI SQL Assistant is live
          </div>
          <h1>
            Master SQL Like a<br>
            <span class="grad-text">Pro Developer</span>
          </h1>
          <p class="hero-sub">
            The most comprehensive SQL learning platform with 650+ quiz questions,
            real-time database execution, coding challenges, and industry-recognized certifications.
          </p>
          <div class="hero-btns">
            <a routerLink="/auth/register" class="btn-primary">
              🚀 Start Learning Free
            </a>
            <a routerLink="/playground" class="btn-ghost">
              <mat-icon>play_circle</mat-icon> Try SQL Live
            </a>
          </div>
          <div class="hero-trust">
            @for (s of trustStats; track s.label) {
              <div class="trust-stat">
                <div class="trust-num">{{ s.num }}</div>
                <div class="trust-label">{{ s.label }}</div>
              </div>
            }
          </div>
        </div>

        <div class="hero-right">
          <div class="code-card">
            <div class="code-bar">
              <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
              <span class="code-title">sql_playground.sql</span>
              <span class="run-badge">▶ Run</span>
            </div>
            <div class="code-body">
<pre><span class="kw">SELECT</span>
  e.name,
  d.department_name,
  <span class="fn">AVG</span>(s.salary) <span class="kw">OVER</span> (
    <span class="kw">PARTITION BY</span> d.id
  ) <span class="kw">AS</span> dept_avg
<span class="kw">FROM</span> employees e
<span class="kw">JOIN</span> departments d <span class="kw">ON</span> e.dept_id = d.id
<span class="kw">ORDER BY</span> dept_avg <span class="kw">DESC</span>;</pre>
            </div>
            <div class="code-result">
              <div class="result-ok">✅ 47 rows · 12ms</div>
              <table>
                <thead><tr><th>name</th><th>department</th><th>dept_avg</th></tr></thead>
                <tbody>
                  <tr><td>Alice Johnson</td><td>Engineering</td><td>$125,000</td></tr>
                  <tr><td>Bob Smith</td><td>Engineering</td><td>$125,000</td></tr>
                  <tr><td>Carol Davis</td><td>Marketing</td><td>$89,500</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="floating-badge xp-badge">🏆 +150 XP Earned!</div>
          <div class="floating-badge cert-badge">🎓 Certificate Issued</div>
        </div>
      </div>
    </section>

    <!-- ═══ LOGOS / TRUSTED BY ═══ -->
    <section class="logos-section">
      <p class="logos-label">Trusted by developers from</p>
      <div class="logos-row">
        @for (c of companies; track c) {
          <div class="logo-item">{{ c }}</div>
        }
      </div>
    </section>

    <!-- ═══ FEATURES ═══ -->
    <section class="features-section">
      <div class="wrap">
        <div class="sec-head">
          <div class="sec-badge">Platform Features</div>
          <h2>Everything You Need to Master SQL</h2>
          <p>A complete ecosystem — from fundamentals to enterprise-level SQL mastery</p>
        </div>
        <div class="features-grid">
          @for (f of features; track f.title) {
            <div class="feat-card">
              <div class="feat-icon" [style.background]="f.bg">{{ f.icon }}</div>
              <h3>{{ f.title }}</h3>
              <p>{{ f.desc }}</p>
              <a [routerLink]="f.link" class="feat-link">Learn more →</a>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ═══ HOW IT WORKS ═══ -->
    <section class="how-section">
      <div class="wrap">
        <div class="sec-head">
          <div class="sec-badge">How It Works</div>
          <h2>Learn SQL in 3 Simple Steps</h2>
          <p>Structured, hands-on, and gamified — built for real results</p>
        </div>
        <div class="steps-grid">
          @for (s of steps; track s.title; let i = $index) {
            <div class="step-card">
              <div class="step-num">{{ i + 1 }}</div>
              <div class="step-icon">{{ s.icon }}</div>
              <h3>{{ s.title }}</h3>
              <p>{{ s.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ═══ MODULES ═══ -->
    <section class="modules-section">
      <div class="wrap">
        <div class="sec-head">
          <div class="sec-badge">Curriculum</div>
          <h2>10 Comprehensive SQL Modules</h2>
          <p>Structured learning path from SQL basics to expert-level optimization</p>
        </div>
        <div class="modules-grid">
          @for (m of modules; track m.title; let i = $index) {
            <a [routerLink]="['/learn', i + 1]" class="module-card"
              [style.--accent]="m.color">
              <div class="mod-head">
                <span class="mod-num">{{ String(i+1).padStart(2,'0') }}</span>
                <span class="mod-level" [class]="m.level.toLowerCase()">{{ m.level }}</span>
              </div>
              <div class="mod-icon">{{ m.icon }}</div>
              <h3>{{ m.title }}</h3>
              <p>{{ m.desc }}</p>
              <div class="mod-foot">
                <span>{{ m.lessons }} lessons</span>
                <mat-icon>arrow_forward</mat-icon>
              </div>
            </a>
          }
        </div>
        <div class="sec-cta">
          <a routerLink="/learn" class="btn-primary">View All Modules <mat-icon>arrow_forward</mat-icon></a>
        </div>
      </div>
    </section>

    <!-- ═══ STATS ═══ -->
    <section class="stats-section">
      <div class="wrap">
        <div class="stats-grid">
          @for (s of bigStats; track s.desc) {
            <div class="stat-box">
              <div class="stat-icon">{{ s.icon }}</div>
              <div class="stat-val">{{ s.value }}</div>
              <div class="stat-desc">{{ s.desc }}</div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ═══ TESTIMONIALS ═══ -->
    <section class="testimonials-section">
      <div class="wrap">
        <div class="sec-head">
          <div class="sec-badge">Testimonials</div>
          <h2>Loved by Developers Worldwide</h2>
          <p>See what our students say about SQL Master Pro</p>
        </div>
        <div class="testi-grid">
          @for (t of testimonials; track t.name) {
            <div class="testi-card">
              <div class="stars">★★★★★</div>
              <p class="testi-text">"{{ t.text }}"</p>
              <div class="testi-author">
                <div class="testi-avatar">{{ t.name[0] }}</div>
                <div>
                  <div class="testi-name">{{ t.name }}</div>
                  <div class="testi-role">{{ t.role }}</div>
                </div>
                <div class="testi-company">{{ t.company }}</div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ═══ PRICING ═══ -->
    <section class="pricing-section">
      <div class="wrap">
        <div class="sec-head">
          <div class="sec-badge">Pricing</div>
          <h2>Simple, Transparent Pricing</h2>
          <p>Start free, upgrade when you're ready. No hidden fees.</p>
        </div>
        <div class="pricing-grid">
          @for (p of plans; track p.name) {
            <div class="price-card" [class.popular]="p.popular">
              @if (p.popular) {
                <div class="pop-label">⭐ Most Popular</div>
              }
              <div class="price-head">
                <h3>{{ p.name }}</h3>
                <div class="price-row">
                  <span class="price-currency">₹</span>
                  <span class="price-amount">{{ p.price }}</span>
                  <span class="price-period">/mo</span>
                </div>
                <p class="price-sub">{{ p.sub }}</p>
              </div>
              <ul class="price-features">
                @for (f of p.features; track f) {
                  <li>
                    <span class="feat-check">✓</span> {{ f }}
                  </li>
                }
              </ul>
              <a [routerLink]="p.price === 0 ? '/auth/register' : '/pricing'" class="price-btn"
                [class.btn-primary]="p.popular" [class.btn-outline]="!p.popular">
                {{ p.price === 0 ? 'Get Started Free' : 'Choose Plan' }}
              </a>
            </div>
          }
        </div>
        <p class="pricing-note">7-day free trial on paid plans · Cancel anytime · No credit card for Free</p>
      </div>
    </section>

    <!-- ═══ CTA ═══ -->
    <section class="final-cta">
      <div class="cta-orb cta-orb-1"></div>
      <div class="cta-orb cta-orb-2"></div>
      <div class="cta-inner">
        <div class="cta-badge">Join 50,000+ Developers</div>
        <h2>Start Your SQL Journey Today</h2>
        <p>From zero to SQL hero — structured, gamified, and built for real-world results.</p>
        <div class="cta-btns">
          <a routerLink="/auth/register" class="btn-primary btn-xl">
            🚀 Get Started for Free
          </a>
          <a routerLink="/learn" class="btn-ghost-light btn-xl">
            Browse Curriculum →
          </a>
        </div>
        <div class="cta-perks">
          <span>✓ Free forever plan</span>
          <span>✓ No credit card</span>
          <span>✓ Instant access</span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ─── Shared ─── */
    .wrap { max-width: 1200px; margin: 0 auto; padding: 0 28px; }
    .sec-head { text-align: center; margin-bottom: 40px;
      h2 { font-size: clamp(26px, 4vw, 40px) !important; font-weight: 900 !important;
        margin: 10px 0 !important; color: var(--text-primary) !important;
      }
      p { color: var(--text-secondary) !important; font-size: 16px; max-width: 560px; margin: 0 auto; }
    }
    .sec-badge { display: inline-block; background: linear-gradient(135deg, #ede9fe, #ddd6fe);
      color: #7c3aed; padding: 6px 18px; border-radius: 30px; font-size: 13px;
      font-weight: 700; letter-spacing: 0.5px; margin-bottom: 16px;
    }
    .btn-primary { display: inline-flex; align-items: center; gap: 8px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white !important; padding: 14px 32px; border-radius: 50px;
      font-size: 15px; font-weight: 700; text-decoration: none; transition: all 0.25s;
      border: none; cursor: pointer;
      &:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(102,126,234,0.4); }
    }
    .btn-ghost { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.85);
      padding: 14px 28px; border-radius: 50px; font-size: 15px; font-weight: 600;
      border: 1.5px solid rgba(255,255,255,0.25); text-decoration: none; transition: all 0.25s;
      background: rgba(255,255,255,0.06); backdrop-filter: blur(4px);
      &:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.5); }
    }
    .btn-outline { display: inline-flex; align-items: center; justify-content: center;
      gap: 8px; padding: 14px 28px; border-radius: 50px; border: 2px solid var(--border);
      color: var(--text-primary); font-size: 15px; font-weight: 700; text-decoration: none;
      transition: all 0.2s; background: var(--surface);
      &:hover { border-color: #667eea; color: #667eea; }
    }
    .btn-xl { padding: 16px 40px !important; font-size: 16px !important; }
    .sec-cta { text-align: center; margin-top: 48px; }

    /* ─── Hero ─── */
    .hero { position: relative; background: linear-gradient(150deg, #0d0221 0%, #190d3a 45%, #0f1e3a 100%);
      min-height: 100vh; overflow: hidden; display: flex; align-items: center;
      h1, h2, h3, h4, h5, h6 { color: white !important; }
      p { color: rgba(255,255,255,0.65) !important; }
    }
    .hero-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
    .hero-orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(102,126,234,0.25), transparent);
      top: -150px; left: -100px;
    }
    .hero-orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(240,147,251,0.18), transparent);
      bottom: -100px; right: 200px;
    }
    .hero-orb-3 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(72,187,120,0.12), transparent);
      top: 30%; right: 5%;
    }
    .hero-grid { position: absolute; inset: 0;
      background-image: linear-gradient(rgba(102,126,234,0.07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(102,126,234,0.07) 1px, transparent 1px);
      background-size: 48px 48px;
    }
    .hero-inner { position: relative; z-index: 2; width: 100%; max-width: 1200px; margin: 0 auto;
      padding: 100px 28px 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 64px;
      align-items: center;
      @media (max-width: 1024px) { grid-template-columns: 1fr; gap: 48px; }
    }
    .hero-left { color: white; }
    .hero-pill { display: inline-flex; align-items: center; gap: 8px;
      background: rgba(102,126,234,0.18); border: 1px solid rgba(102,126,234,0.4);
      padding: 8px 18px; border-radius: 30px; font-size: 13px; font-weight: 600;
      color: #c4b5fd !important; margin-bottom: 24px;
      .pill-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e;
        animation: pulse-dot 2s infinite;
      }
    }
    @keyframes pulse-dot {
      0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
      50% { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
    }
    .hero-left h1 { font-size: clamp(36px, 4.5vw, 60px); font-weight: 900; line-height: 1.15;
      margin: 0 0 20px; letter-spacing: -1.5px; color: white !important;
    }
    .grad-text { background: linear-gradient(135deg, #a78bfa, #f093fb, #f9a8d4) !important;
      -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
      background-clip: text !important; color: transparent !important;
    }
    .hero-sub { font-size: 17px; color: rgba(255,255,255,0.65) !important; line-height: 1.8;
      max-width: 480px; margin-bottom: 36px;
    }
    .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 48px; }
    .hero-trust { display: flex; gap: 0; }
    .trust-stat { padding: 0 28px; border-right: 1px solid rgba(255,255,255,0.12);
      &:first-child { padding-left: 0; }
      &:last-child { border-right: none; }
      .trust-num { font-size: 26px; font-weight: 900; color: white !important;
        background: linear-gradient(135deg, #a78bfa, #f093fb);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      }
      .trust-label { font-size: 11px; color: rgba(255,255,255,0.5) !important; text-transform: uppercase;
        letter-spacing: 1px; margin-top: 2px;
      }
    }

    /* Code card */
    .hero-right { position: relative; }
    .code-card { background: #12121f; border-radius: 20px; overflow: hidden;
      border: 1px solid rgba(102,126,234,0.25);
      box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05);
    }
    .code-bar { background: #1c1c2e; padding: 14px 18px; display: flex; align-items: center; gap: 8px; }
    .dot { width: 12px; height: 12px; border-radius: 50%;
      &.r { background: #ff5f57; } &.y { background: #febc2e; } &.g { background: #28c840; }
    }
    .code-title { margin-left: 8px; color: #6b7280; font-size: 13px; font-family: 'JetBrains Mono', monospace; flex: 1; }
    .run-badge { background: #22c55e; color: white; font-size: 11px; font-weight: 700;
      padding: 3px 10px; border-radius: 6px;
    }
    .code-body { padding: 20px 22px;
      pre { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.75; color: #e2e8f0; }
      .kw { color: #c792ea; font-weight: 700; }
      .fn { color: #82aaff; }
    }
    .code-result { padding: 0 22px 20px; }
    .result-ok { color: #4ade80; font-size: 12px; font-family: monospace; margin-bottom: 10px; }
    .code-result table { width: 100%; border-collapse: collapse; font-size: 12px;
      th { background: #1c1c2e; padding: 8px 10px; text-align: left; color: #667eea; font-family: monospace; }
      td { padding: 7px 10px; border-bottom: 1px solid #1c1c2e; color: #94a3b8; }
    }
    .floating-badge { position: absolute; background: white; border-radius: 12px;
      padding: 10px 16px; font-size: 13px; font-weight: 700; color: #1a1a1a;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2); animation: float 4s ease-in-out infinite;
      &.xp-badge { bottom: -20px; left: -20px; animation-delay: 0s; }
      &.cert-badge { top: -16px; right: -16px; animation-delay: 2s; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    /* ─── Logos ─── */
    .logos-section { padding: 40px 28px; text-align: center; border-bottom: 1px solid var(--border); }
    .logos-label { font-size: 13px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px;
      font-weight: 600; margin-bottom: 20px;
    }
    .logos-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; max-width: 900px; margin: 0 auto; }
    .logo-item { background: var(--bg-secondary); border: 1px solid var(--border); color: var(--text-secondary);
      padding: 8px 22px; border-radius: 30px; font-size: 14px; font-weight: 700;
      transition: all 0.2s;
      &:hover { border-color: #667eea; color: #667eea; background: var(--bg-secondary); }
    }

    /* ─── Features ─── */
    .features-section { padding: 60px 0; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
    .feat-card { padding: 28px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface);
      transition: all 0.3s; position: relative; overflow: hidden;
      &::after { content: ''; position: absolute; inset: 0; border-radius: 20px;
        background: linear-gradient(135deg, rgba(102,126,234,0.04), transparent);
        opacity: 0; transition: opacity 0.3s;
      }
      &:hover { transform: translateY(-6px); box-shadow: 0 24px 48px rgba(102,126,234,0.12);
        border-color: rgba(102,126,234,0.3);
        &::after { opacity: 1; }
      }
      h3 { font-size: 17px; font-weight: 800; margin: 16px 0 8px; }
      p { font-size: 13px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 14px; }
    }
    .feat-icon { width: 56px; height: 56px; border-radius: 16px; display: flex;
      align-items: center; justify-content: center; font-size: 26px;
    }
    .feat-link { font-size: 13px; font-weight: 700; color: #667eea; text-decoration: none;
      &:hover { text-decoration: underline; }
    }

    /* ─── How It Works ─── */
    .how-section { padding: 60px 0; background: var(--bg-secondary); }
    .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px;
      @media (max-width: 768px) { grid-template-columns: 1fr; }
    }
    .step-card { text-align: center; padding: 40px 24px; border-radius: 20px;
      background: var(--surface); border: 1px solid var(--border); position: relative;
      &::before { content: ''; position: absolute; top: 50%; left: -16px;
        width: 32px; height: 2px; background: linear-gradient(90deg, #667eea, #764ba2);
      }
      &:first-child::before { display: none; }
    }
    .step-num { width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white; font-weight: 900; font-size: 16px;
      display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
    }
    .step-icon { font-size: 44px; margin-bottom: 16px; }
    .step-card h3 { font-size: 18px; font-weight: 800; margin-bottom: 10px; }
    .step-card p { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }

    /* ─── Modules ─── */
    .modules-section { padding: 60px 0; }
    .modules-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 18px; }
    .module-card { display: block; text-decoration: none; color: inherit; padding: 22px 20px 18px;
      border-radius: 18px; border: 1.5px solid var(--border); background: var(--surface); transition: all 0.25s;
      position: relative; overflow: hidden;
      &::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
        background: var(--accent, #667eea);
      }
      &:hover { transform: translateY(-5px); border-color: var(--accent, #667eea);
        box-shadow: 0 16px 40px rgba(0,0,0,0.08);
      }
    }
    .mod-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .mod-num { font-size: 28px; font-weight: 900; color: var(--border); line-height: 1; }
    .mod-level { padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.5px;
      &.beginner { background: #dcfce7; color: #16a34a; }
      &.intermediate { background: #fef3c7; color: #d97706; }
      &.advanced { background: #fce7f3; color: #be185d; }
    }
    :host-context(.dark-theme) .mod-level {
      &.beginner { background: rgba(34,197,94,0.15); color: #4ade80; }
      &.intermediate { background: rgba(245,158,11,0.15); color: #fbbf24; }
      &.advanced { background: rgba(236,72,153,0.15); color: #f472b6; }
    }
    .mod-icon { font-size: 32px; margin-bottom: 10px; }
    .module-card h3 { font-size: 15px; font-weight: 800; margin: 0 0 6px; }
    .module-card p { font-size: 12px; color: var(--text-muted); line-height: 1.6; margin-bottom: 14px; }
    .mod-foot { display: flex; justify-content: space-between; align-items: center;
      font-size: 12px; color: var(--text-muted);
      mat-icon { font-size: 16px; width: 16px; height: 16px; color: var(--accent, #667eea);
        transition: transform 0.2s;
      }
    }
    .module-card:hover .mod-foot mat-icon { transform: translateX(4px); }

    /* ─── Stats ─── */
    .stats-section { padding: 80px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 60%, #f093fb 100%);
      h1, h2, h3, h4, h5, h6, p { color: white !important; }
    }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
      @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
    }
    .stat-box { text-align: center; padding: 40px 20px; color: white;
      border-right: 1px solid rgba(255,255,255,0.15);
      &:last-child { border-right: none; }
    }
    .stat-icon { font-size: 36px; margin-bottom: 12px; }
    .stat-val { font-size: 44px; font-weight: 900; letter-spacing: -1px; color: white !important; }
    .stat-desc { font-size: 14px; color: rgba(255,255,255,0.75) !important; margin-top: 6px; }

    /* ─── Testimonials ─── */
    .testimonials-section { padding: 60px 0; background: var(--bg-secondary); }
    .testi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
    .testi-card { background: var(--surface); border-radius: 20px; padding: 28px; border: 1px solid var(--border);
      transition: all 0.3s;
      &:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
    }
    .stars { color: #f59e0b; font-size: 18px; letter-spacing: 2px; margin-bottom: 14px; }
    .testi-text { font-size: 14px; color: var(--text-primary); line-height: 1.8; margin-bottom: 20px;
      font-style: italic;
    }
    .testi-author { display: flex; align-items: center; gap: 12px; }
    .testi-avatar { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 16px;
    }
    .testi-name { font-weight: 700; font-size: 14px; }
    .testi-role { font-size: 12px; color: var(--text-muted); }
    .testi-company { margin-left: auto; font-size: 12px; font-weight: 700;
      color: #667eea; background: #ede9fe; padding: 3px 10px; border-radius: 20px;
    }

    /* ─── Pricing ─── */
    .pricing-section { padding: 60px 0; }
    .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;
      align-items: start;
    }
    .price-card { border-radius: 24px; border: 2px solid var(--border); padding: 36px 32px;
      position: relative; background: var(--surface); transition: all 0.3s;
      &:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
      &.popular { border-color: #667eea; box-shadow: 0 0 0 4px rgba(102,126,234,0.1);
        transform: scale(1.03);
        &:hover { transform: scale(1.03) translateY(-4px); }
      }
    }
    .pop-label { position: absolute; top: -15px; left: 50%; transform: translateX(-50%);
      background: linear-gradient(135deg, #667eea, #764ba2); color: white;
      padding: 5px 20px; border-radius: 20px; font-size: 12px; font-weight: 800;
      white-space: nowrap;
    }
    .price-head h3 { font-size: 20px; font-weight: 800; margin: 0 0 12px; }
    .price-row { display: flex; align-items: baseline; gap: 3px; margin-bottom: 6px;
      .price-currency { font-size: 18px; font-weight: 700; }
      .price-amount { font-size: 48px; font-weight: 900; line-height: 1; }
      .price-period { font-size: 14px; color: var(--text-muted); }
    }
    .price-sub { font-size: 13px; color: var(--text-muted); margin: 0 0 24px; }
    .price-features { list-style: none; padding: 0; margin: 0 0 28px; border-top: 1px solid var(--border); padding-top: 20px;
      li { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0;
        font-size: 14px; color: var(--text-primary); border-bottom: 1px solid var(--border);
      }
      .feat-check { color: #10b981; font-weight: 800; flex-shrink: 0; }
    }
    .price-btn { display: block; text-align: center; width: 100%; padding: 14px !important;
      border-radius: 12px !important; font-weight: 700 !important; text-decoration: none;
    }
    .pricing-note { text-align: center; color: var(--text-muted); font-size: 14px; margin-top: 32px; }

    /* ─── Final CTA ─── */
    .final-cta { position: relative; overflow: hidden;
      background: linear-gradient(150deg, #0d0221 0%, #190d3a 45%, #0f1e3a 100%);
      padding: 80px 28px; text-align: center;
      h1, h2, h3, h4, h5, h6 { color: white !important; }
    }
    .cta-orb { position: absolute; border-radius: 50%; filter: blur(80px); }
    .cta-orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(102,126,234,0.2), transparent);
      top: -150px; left: -100px;
    }
    .cta-orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(240,147,251,0.15), transparent);
      bottom: -100px; right: -100px;
    }
    .cta-inner { position: relative; z-index: 1; max-width: 720px; margin: 0 auto; color: white; }
    .cta-badge { display: inline-block; background: rgba(102,126,234,0.25); border: 1px solid rgba(167,139,250,0.5);
      color: #c4b5fd !important; padding: 7px 20px; border-radius: 30px; font-size: 13px;
      font-weight: 700; margin-bottom: 20px;
    }
    .cta-inner h2 { font-size: clamp(32px, 5vw, 52px) !important; font-weight: 900 !important;
      margin: 0 0 16px !important; line-height: 1.1 !important; color: white !important;
    }
    .cta-inner > p { font-size: 17px !important; color: rgba(255,255,255,0.65) !important;
      line-height: 1.7 !important; margin-bottom: 40px !important;
    }
    .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 32px; }
    .btn-ghost-light { display: inline-flex; align-items: center; gap: 6px;
      color: rgba(255,255,255,0.85) !important; font-size: 15px; font-weight: 600; text-decoration: none;
      padding: 14px 28px; border-radius: 50px; border: 1.5px solid rgba(255,255,255,0.3);
      background: rgba(255,255,255,0.08); transition: all 0.2s;
      &:hover { color: white !important; background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.5); }
    }
    .cta-perks { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap;
      span { font-size: 14px; color: rgba(255,255,255,0.55) !important; font-weight: 600; }
    }
  `]
})
export class LandingComponent {
  protected readonly String = String;

  trustStats = [
    { num: '50K+', label: 'Students' },
    { num: '650+', label: 'Quizzes' },
    { num: '900+', label: 'Challenges' },
    { num: '98%', label: 'Satisfaction' }
  ];

  companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Uber', 'Flipkart', 'Infosys', 'TCS', 'Wipro'];

  features = [
    { icon: '📚', title: '10 SQL Modules', desc: 'Structured curriculum from SQL basics to advanced query optimization and indexing.', gradient: 'linear-gradient(135deg, #ede9fe, #c4b5fd)', bg: 'linear-gradient(135deg, #ede9fe, #c4b5fd)', link: '/learn' },
    { icon: '⚡', title: 'Real SQL Execution', desc: 'Run queries against 7 real PostgreSQL databases directly in your browser — no setup.', bg: 'linear-gradient(135deg, #fef3c7, #fde68a)', link: '/playground' },
    { icon: '🏆', title: '650+ Quiz Questions', desc: 'Timed quizzes from beginner to expert with randomized questions and detailed explanations.', bg: 'linear-gradient(135deg, #dcfce7, #86efac)', link: '/quiz' },
    { icon: '⚔️', title: '900+ Challenges', desc: 'SQL coding challenges from easy to expert with success rate tracking and leaderboard.', bg: 'linear-gradient(135deg, #fee2e2, #fca5a5)', link: '/challenges' },
    { icon: '🎓', title: 'Certifications', desc: 'Earn industry-recognized SQL certificates with QR code verification and PDF download.', bg: 'linear-gradient(135deg, #ede9fe, #a78bfa)', link: '/certificates' },
    { icon: '🤖', title: 'AI SQL Assistant', desc: 'AI-powered query generation, automatic error explanation, and optimization suggestions.', bg: 'linear-gradient(135deg, #dbeafe, #93c5fd)', link: '/playground' },
    { icon: '💼', title: 'Interview Prep', desc: 'FAANG-focused SQL questions, company-specific practice sets, and mock interviews.', bg: 'linear-gradient(135deg, #fef3c7, #fcd34d)', link: '/interview-prep' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Track XP, streaks, weak areas, completion rates, and performance over time.', bg: 'linear-gradient(135deg, #ccfbf1, #5eead4)', link: '/dashboard' }
  ];

  steps = [
    { icon: '🗺️', title: 'Pick a Learning Path', desc: 'Choose from 10 structured SQL modules based on your current skill level and goals.' },
    { icon: '⚡', title: 'Learn & Practice Live', desc: 'Study with interactive lessons, run real SQL queries, and solve coding challenges instantly.' },
    { icon: '🏆', title: 'Earn Certificates', desc: 'Pass quizzes, complete modules, and receive verifiable certificates to showcase on LinkedIn.' }
  ];

  modules = [
    { icon: '🗄️', title: 'SQL Introduction', desc: 'Database concepts, RDBMS, keys, and schema design', level: 'Beginner', lessons: 12, color: '#22c55e' },
    { icon: '🔍', title: 'SQL Fundamentals', desc: 'SELECT, WHERE, GROUP BY, ORDER BY, DISTINCT, LIMIT', level: 'Beginner', lessons: 18, color: '#3b82f6' },
    { icon: '🔗', title: 'SQL Joins', desc: 'INNER, LEFT, RIGHT, FULL, SELF, CROSS joins with examples', level: 'Intermediate', lessons: 14, color: '#f59e0b' },
    { icon: '⚙️', title: 'SQL Functions', desc: 'String, Numeric, Date, Aggregate and Window functions', level: 'Intermediate', lessons: 20, color: '#8b5cf6' },
    { icon: '📦', title: 'Subqueries & CTEs', desc: 'Correlated subqueries, WITH clauses, EXISTS, ANY, ALL', level: 'Intermediate', lessons: 16, color: '#06b6d4' },
    { icon: '🚀', title: 'Advanced SQL', desc: 'Views, Stored Procedures, Indexes, Query Optimization', level: 'Advanced', lessons: 24, color: '#ef4444' },
    { icon: '⚡', title: 'Window Functions', desc: 'RANK, DENSE_RANK, ROW_NUMBER, LAG, LEAD, NTILE', level: 'Advanced', lessons: 18, color: '#f97316' },
    { icon: '📐', title: 'Normalization', desc: '1NF through 5NF, denormalization, ER design patterns', level: 'Intermediate', lessons: 15, color: '#10b981' },
    { icon: '🔐', title: 'Transactions', desc: 'ACID, COMMIT, ROLLBACK, Deadlocks, Isolation Levels', level: 'Advanced', lessons: 16, color: '#6366f1' },
    { icon: '🏗️', title: 'Database Design', desc: 'ER Diagrams, relationships, schema design best practices', level: 'Intermediate', lessons: 14, color: '#ec4899' }
  ];

  bigStats = [
    { icon: '👩‍💻', value: '50,000+', desc: 'Active Students' },
    { icon: '📝', value: '650+', desc: 'Quiz Questions' },
    { icon: '⚔️', value: '900+', desc: 'SQL Challenges' },
    { icon: '⭐', value: '98%', desc: 'Satisfaction Rate' }
  ];

  testimonials = [
    { text: 'SQL Master Pro took me from zero to landing a Data Engineer role at Flipkart in just 3 months. The challenges and real execution made all the difference.', name: 'Priya Sharma', role: 'Data Engineer', company: 'Flipkart' },
    { text: 'The window functions module alone is worth it. Best structured SQL course I have found — the AI assistant explains errors in plain English.', name: 'Rahul Gupta', role: 'Backend Developer', company: 'Infosys' },
    { text: 'I passed my Google SQL interview after practicing 200+ challenges here. The FAANG interview prep section is absolutely gold.', name: 'Ankit Verma', role: 'SDE II', company: 'Google' }
  ];

  plans = [
    { name: 'Free', price: 0, sub: 'Get started with the basics', popular: false,
      features: ['10 Lessons/month', '5 Quiz attempts', 'Basic SQL Editor', '10 Easy Challenges', 'Community Access'] },
    { name: 'Pro', price: 999, sub: 'Everything you need to master SQL', popular: true,
      features: ['All 10 Modules Unlocked', '650+ Quiz Questions', '900+ Challenges', 'AI SQL Assistant', 'All Certificates', 'Interview Prep', 'Priority Support'] },
    { name: 'Enterprise', price: 2999, sub: 'For teams and organizations', popular: false,
      features: ['Everything in Pro', 'Team Management', 'Custom Learning Paths', 'Analytics Dashboard', 'API Access', 'Dedicated Support'] }
  ];
}
