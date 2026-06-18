import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TrustStat, FeatureCard, ProcessStep, ModuleSummary, BigStat, Testimonial, PlanSummary } from '../../core/models/models';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  protected readonly String = String;

  trustStats: TrustStat[] = [
    { num: '50K+', label: 'Students' },
    { num: '650+', label: 'Quizzes' },
    { num: '900+', label: 'Challenges' },
    { num: '98%', label: 'Satisfaction' }
  ];

  companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Uber', 'Flipkart', 'Infosys', 'TCS', 'Wipro'];

  features: FeatureCard[] = [
    { icon: '📚', title: '10 SQL Modules', desc: 'Structured curriculum from SQL basics to advanced query optimization and indexing.', gradient: 'linear-gradient(135deg, #ede9fe, #c4b5fd)', bg: 'linear-gradient(135deg, #ede9fe, #c4b5fd)', link: '/learn' },
    { icon: '⚡', title: 'Real SQL Execution', desc: 'Run queries against 7 real PostgreSQL databases directly in your browser — no setup.', bg: 'linear-gradient(135deg, #fef3c7, #fde68a)', link: '/playground' },
    { icon: '🏆', title: '650+ Quiz Questions', desc: 'Timed quizzes from beginner to expert with randomized questions and detailed explanations.', bg: 'linear-gradient(135deg, #dcfce7, #86efac)', link: '/quiz' },
    { icon: '⚔️', title: '900+ Challenges', desc: 'SQL coding challenges from easy to expert with success rate tracking and leaderboard.', bg: 'linear-gradient(135deg, #fee2e2, #fca5a5)', link: '/challenges' },
    { icon: '🎓', title: 'Certifications', desc: 'Earn industry-recognized SQL certificates with QR code verification and PDF download.', bg: 'linear-gradient(135deg, #ede9fe, #a78bfa)', link: '/certificates' },
    { icon: '🤖', title: 'AI SQL Assistant', desc: 'AI-powered query generation, automatic error explanation, and optimization suggestions.', bg: 'linear-gradient(135deg, #dbeafe, #93c5fd)', link: '/playground' },
    { icon: '💼', title: 'Interview Prep', desc: 'FAANG-focused SQL questions, company-specific practice sets, and mock interviews.', bg: 'linear-gradient(135deg, #fef3c7, #fcd34d)', link: '/interview-prep' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Track XP, streaks, weak areas, completion rates, and performance over time.', bg: 'linear-gradient(135deg, #ccfbf1, #5eead4)', link: '/dashboard' }
  ];

  steps: ProcessStep[] = [
    { icon: '🗺️', title: 'Pick a Learning Path', desc: 'Choose from 10 structured SQL modules based on your current skill level and goals.' },
    { icon: '⚡', title: 'Learn & Practice Live', desc: 'Study with interactive lessons, run real SQL queries, and solve coding challenges instantly.' },
    { icon: '🏆', title: 'Earn Certificates', desc: 'Pass quizzes, complete modules, and receive verifiable certificates to showcase on LinkedIn.' }
  ];

  modules: ModuleSummary[] = [
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

  bigStats: BigStat[] = [
    { icon: '👩‍💻', value: '50,000+', desc: 'Active Students' },
    { icon: '📝', value: '650+', desc: 'Quiz Questions' },
    { icon: '⚔️', value: '900+', desc: 'SQL Challenges' },
    { icon: '⭐', value: '98%', desc: 'Satisfaction Rate' }
  ];

  testimonials: Testimonial[] = [
    { text: 'SQL Master Pro took me from zero to landing a Data Engineer role at Flipkart in just 3 months. The challenges and real execution made all the difference.', name: 'Priya Sharma', role: 'Data Engineer', company: 'Flipkart' },
    { text: 'The window functions module alone is worth it. Best structured SQL course I have found — the AI assistant explains errors in plain English.', name: 'Rahul Gupta', role: 'Backend Developer', company: 'Infosys' },
    { text: 'I passed my Google SQL interview after practicing 200+ challenges here. The FAANG interview prep section is absolutely gold.', name: 'Ankit Verma', role: 'SDE II', company: 'Google' }
  ];

  plans: PlanSummary[] = [
    { name: 'Free', price: 0, sub: 'Get started with the basics', popular: false,
      features: ['10 Lessons/month', '5 Quiz attempts', 'Basic SQL Editor', '10 Easy Challenges', 'Community Access'] },
    { name: 'Pro', price: 999, sub: 'Everything you need to master SQL', popular: true,
      features: ['All 10 Modules Unlocked', '650+ Quiz Questions', '900+ Challenges', 'AI SQL Assistant', 'All Certificates', 'Interview Prep', 'Priority Support'] },
    { name: 'Enterprise', price: 2999, sub: 'For teams and organizations', popular: false,
      features: ['Everything in Pro', 'Team Management', 'Custom Learning Paths', 'Analytics Dashboard', 'API Access', 'Dedicated Support'] }
  ];
}
