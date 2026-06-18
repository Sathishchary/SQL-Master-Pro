import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../../core/services/api.service';
import { Challenge } from '../../../core/models/models';
import { ChallengeFilter } from '../../../core/models/models';

@Component({
  selector: 'app-challenge-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './challenge-list.component.html',
  styleUrls: ['./challenge-list.component.css']
})
export class ChallengeListComponent implements OnInit {
  challenges: Challenge[] = [];
  displayedChallenges: Challenge[] = [];
  selectedFilter = 'all';

  filters: ChallengeFilter[] = [
    { label: 'All', value: 'all', icon: '🎯' },
    { label: 'Easy', value: 'EASY', icon: '🟢' },
    { label: 'Medium', value: 'MEDIUM', icon: '🟡' },
    { label: 'Advanced', value: 'ADVANCED', icon: '🔴' },
    { label: 'Expert', value: 'EXPERT', icon: '🟣' },
    { label: 'SELECT', value: 'SELECT', icon: '📋' },
    { label: 'JOINs', value: 'JOIN', icon: '🔗' },
    { label: 'Aggregation', value: 'AGGREGATE', icon: '📊' },
    { label: 'Subqueries', value: 'SUBQUERY', icon: '🔄' },
  ];

  sampleChallenges: Challenge[] = [
    { id: 1, title: 'Find All Active Users', description: 'Write a query to retrieve all users who have logged in within the last 30 days.', problemStatement: '', difficulty: 'EASY', points: 10, xpReward: 50, databaseName: 'users_db', premium: false, topic: 'SELECT', totalSubmissions: 1240, successfulSubmissions: 1050 },
    { id: 2, title: 'Top 5 Products by Revenue', description: 'Find the top 5 products generating the highest total revenue using GROUP BY and ORDER BY.', problemStatement: '', difficulty: 'EASY', points: 15, xpReward: 75, databaseName: 'ecommerce', premium: false, topic: 'AGGREGATE', totalSubmissions: 980, successfulSubmissions: 780 },
    { id: 3, title: 'Employee Department JOIN', description: 'List all employees with their department name using an INNER JOIN on the departments table.', problemStatement: '', difficulty: 'EASY', points: 20, xpReward: 100, databaseName: 'hr_db', premium: false, topic: 'JOIN', totalSubmissions: 1500, successfulSubmissions: 1350 },
    { id: 4, title: 'Second Highest Salary', description: 'Find the second highest salary from the employees table without using LIMIT OFFSET.', problemStatement: '', difficulty: 'MEDIUM', points: 30, xpReward: 150, databaseName: 'hr_db', premium: false, topic: 'SUBQUERY', totalSubmissions: 2200, successfulSubmissions: 1430 },
    { id: 5, title: 'Customers Without Orders', description: 'Find all customers who have never placed an order using a LEFT JOIN or NOT EXISTS subquery.', problemStatement: '', difficulty: 'MEDIUM', points: 35, xpReward: 175, databaseName: 'ecommerce', premium: false, topic: 'JOIN', totalSubmissions: 1800, successfulSubmissions: 990 },
    { id: 6, title: 'Monthly Sales Report', description: 'Generate a monthly sales report showing total orders, revenue, and average order value per month.', problemStatement: '', difficulty: 'MEDIUM', points: 40, xpReward: 200, databaseName: 'ecommerce', premium: false, topic: 'AGGREGATE', totalSubmissions: 1100, successfulSubmissions: 550 },
    { id: 7, title: 'Cumulative Revenue with Window Functions', description: 'Calculate running total of revenue per month using SUM() OVER() window function with ORDER BY.', problemStatement: '', difficulty: 'ADVANCED', points: 60, xpReward: 300, databaseName: 'ecommerce', premium: true, topic: 'WINDOW', totalSubmissions: 650, successfulSubmissions: 210 },
    { id: 8, title: 'Hierarchical Employee Tree', description: 'Use a recursive CTE to build an employee management hierarchy from a self-referencing table.', problemStatement: '', difficulty: 'ADVANCED', points: 80, xpReward: 400, databaseName: 'hr_db', premium: true, topic: 'CTE', totalSubmissions: 420, successfulSubmissions: 98 },
    { id: 9, title: 'Detect Duplicate Records', description: 'Identify and list all duplicate email addresses in the users table, showing count per email.', problemStatement: '', difficulty: 'MEDIUM', points: 30, xpReward: 150, databaseName: 'users_db', premium: false, topic: 'AGGREGATE', totalSubmissions: 1600, successfulSubmissions: 1200 },
    { id: 10, title: 'Pivot Sales by Quarter', description: 'Pivot sales data to show Q1, Q2, Q3, Q4 revenue per product category in a single result set.', problemStatement: '', difficulty: 'EXPERT', points: 100, xpReward: 500, databaseName: 'ecommerce', premium: true, topic: 'AGGREGATE', totalSubmissions: 280, successfulSubmissions: 42 },
    { id: 11, title: 'Dense Rank on Scores', description: 'Rank students by score using DENSE_RANK() and identify students who tie for the same rank.', problemStatement: '', difficulty: 'ADVANCED', points: 65, xpReward: 325, databaseName: 'school_db', premium: true, topic: 'WINDOW', totalSubmissions: 510, successfulSubmissions: 185 },
    { id: 12, title: 'Rolling 7-Day Average', description: 'Calculate the 7-day rolling average of daily active users using window functions.', problemStatement: '', difficulty: 'EXPERT', points: 90, xpReward: 450, databaseName: 'analytics_db', premium: true, topic: 'WINDOW', totalSubmissions: 190, successfulSubmissions: 28 },
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getChallenges().subscribe({
      next: (res) => {
        if (res.success && res.data.content.length > 0) {
          this.challenges = res.data.content;
        } else {
          this.challenges = this.sampleChallenges;
        }
        this.filterChallenges();
      },
      error: () => {
        this.challenges = this.sampleChallenges;
        this.filterChallenges();
      }
    });
  }

  filterChallenges(): void {
    const diffFilters = ['EASY', 'MEDIUM', 'ADVANCED', 'EXPERT'];
    if (this.selectedFilter === 'all') {
      this.displayedChallenges = this.challenges;
    } else if (diffFilters.includes(this.selectedFilter)) {
      this.displayedChallenges = this.challenges.filter(c => c.difficulty === this.selectedFilter);
    } else {
      this.displayedChallenges = this.challenges.filter(c => c.topic === this.selectedFilter);
    }
  }

  getSuccessRate(ch: Challenge): number {
    return ch.totalSubmissions > 0 ? Math.round((ch.successfulSubmissions / ch.totalSubmissions) * 100) : 0;
  }

  getDiffClass(difficulty: string): string {
    const map: Record<string, string> = {
      EASY: 'easy', BEGINNER: 'easy', MEDIUM: 'medium', INTERMEDIATE: 'medium',
      ADVANCED: 'hard', HARD: 'hard', EXPERT: 'expert'
    };
    return map[difficulty] ?? 'easy';
  }

  getDiffLabel(difficulty: string): string {
    const map: Record<string, string> = {
      EASY: 'Easy', BEGINNER: 'Easy', MEDIUM: 'Medium', INTERMEDIATE: 'Medium',
      ADVANCED: 'Hard', HARD: 'Hard', EXPERT: 'Expert'
    };
    return map[difficulty] ?? difficulty;
  }
}
