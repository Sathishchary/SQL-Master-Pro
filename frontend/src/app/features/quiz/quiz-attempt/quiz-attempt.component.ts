import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription, interval } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Question, Quiz } from '../../../core/models/models';
import { getStaticQuiz, getStaticQuestions } from '../quiz-questions.data';

@Component({
  selector: 'app-quiz-attempt',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './quiz-attempt.component.html',
  styleUrls: ['./quiz-attempt.component.css']
})
export class QuizAttemptComponent implements OnInit, OnDestroy {
  quiz: Quiz | null = null;
  questions: Question[] = [];
  answers: Record<number, string> = {};
  timeLeft = 1800;
  shownHints: boolean[] = [];
  quizCompleted = false;
  result: any = null;
  activeQ = 0;
  private timerSub?: Subscription;

  constructor(private route: ActivatedRoute,
    private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadQuiz(id);
  }

  ngOnDestroy(): void { this.timerSub?.unsubscribe(); }

  get answeredCount(): number { return Object.keys(this.answers).length; }

  getOptions(q: Question): { label: string; value: string; text: string }[] {
    return [
      { label: 'A', value: 'A', text: q.optionA || '' },
      { label: 'B', value: 'B', text: q.optionB || '' },
      { label: 'C', value: 'C', text: q.optionC || '' },
      { label: 'D', value: 'D', text: q.optionD || '' },
    ].filter(o => o.text);
  }

  selectAnswer(qId: number, value: string): void {
    this.answers[qId] = value;
    const idx = this.questions.findIndex(q => q.id === qId);
    if (idx !== -1) this.activeQ = idx;
  }

  toggleHint(i: number): void { this.shownHints[i] = !this.shownHints[i]; }

  scrollTo(i: number): void {
    this.activeQ = i;
    const el = document.getElementById('q' + i);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  confirmSubmit(): void {
    const unanswered = this.questions.length - this.answeredCount;
    if (unanswered > 0) {
      const ok = window.confirm(`You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Submit anyway?`);
      if (!ok) return;
    }
    this.submitQuiz();
  }

  submitQuiz(): void {
    this.timerSub?.unsubscribe();
    const timeTaken = (this.quiz?.timeLimitMinutes || 30) * 60 - this.timeLeft;

    this.apiService.submitQuiz(this.quiz!.id, this.answers).subscribe({
      next: (res) => {
        if (res.success) {
          this.result = { ...res.data, timeTakenSeconds: timeTaken };
          this.quizCompleted = true;
        } else {
          this.computeLocalResult(timeTaken);
        }
      },
      error: () => this.computeLocalResult(timeTaken)
    });
  }

  retryQuiz(): void {
    this.answers = {};
    this.shownHints = [];
    this.quizCompleted = false;
    this.result = null;
    this.activeQ = 0;
    this.timeLeft = (this.quiz?.timeLimitMinutes || 30) * 60;
    this.startTimer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  formatTime(secs: number): string {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  private loadQuiz(id: number): void {
    this.apiService.getQuiz(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.quiz = res.data;
          this.timeLeft = res.data.timeLimitMinutes * 60;
          this.loadQuestions(id);
        } else {
          this.useStaticData(id);
        }
      },
      error: () => this.useStaticData(id)
    });
  }

  private loadQuestions(quizId: number): void {
    this.apiService.getQuizQuestions(quizId).subscribe({
      next: (res) => {
        if (res.success && res.data?.length > 0) {
          this.questions = res.data;
        } else {
          this.questions = getStaticQuestions(quizId);
        }
        this.shownHints = new Array(this.questions.length).fill(false);
        this.startTimer();
      },
      error: () => {
        this.questions = getStaticQuestions(quizId);
        this.shownHints = new Array(this.questions.length).fill(false);
        this.startTimer();
      }
    });
  }

  private useStaticData(id: number): void {
    this.quiz = getStaticQuiz(id);
    this.timeLeft = this.quiz.timeLimitMinutes * 60;
    this.questions = getStaticQuestions(id);
    this.shownHints = new Array(this.questions.length).fill(false);
    this.startTimer();
  }

  private computeLocalResult(timeTaken: number): void {
    const correct = this.questions.filter(q => this.answers[q.id] === q.correctAnswer).length;
    const total = this.questions.length;
    const score = Math.round((correct / total) * 100);
    const xp = correct * (this.questions[0]?.points ?? 1) * 10;
    this.result = {
      score, correctAnswers: correct, totalQuestions: total,
      passed: score >= (this.quiz?.passScore ?? 70),
      xpEarned: xp, timeTakenSeconds: timeTaken
    };
    this.quizCompleted = true;
  }

  private startTimer(): void {
    this.timerSub?.unsubscribe();
    this.timerSub = interval(1000).subscribe(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.snackBar.open('Time is up! Submitting...', 'Close', { duration: 3000 });
        this.submitQuiz();
      }
    });
  }
}
