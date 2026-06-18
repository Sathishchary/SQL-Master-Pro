import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse, Course, Lesson, Quiz, Question, Challenge,
  Certificate, Payment, Blog, SqlExecutionResponse, SqlExecution,
  UserProgress, DashboardStats, PageResponse, SubscriptionPlan_
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Courses
  getCourses(): Observable<ApiResponse<Course[]>> {
    return this.http.get<ApiResponse<Course[]>>(`${this.base}/courses`);
  }
  getCourse(id: number): Observable<ApiResponse<Course>> {
    return this.http.get<ApiResponse<Course>>(`${this.base}/courses/${id}`);
  }
  getCourseLessons(courseId: number): Observable<ApiResponse<Lesson[]>> {
    return this.http.get<ApiResponse<Lesson[]>>(`${this.base}/courses/${courseId}/lessons`);
  }

  // Lessons
  getLesson(id: number): Observable<ApiResponse<Lesson>> {
    return this.http.get<ApiResponse<Lesson>>(`${this.base}/lessons/${id}`);
  }

  // Progress
  completeLesson(lessonId: number, timeSpent: number): Observable<ApiResponse<UserProgress>> {
    return this.http.post<ApiResponse<UserProgress>>(
      `${this.base}/progress/complete-lesson/${lessonId}`, { timeSpent });
  }
  getMyProgress(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.base}/progress/my-progress`);
  }
  getCourseProgress(courseId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/progress/course/${courseId}`);
  }

  // Quizzes
  getQuizzes(page = 0, size = 12): Observable<ApiResponse<PageResponse<Quiz>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Quiz>>>(`${this.base}/quizzes`, { params });
  }
  getQuiz(id: number): Observable<ApiResponse<Quiz>> {
    return this.http.get<ApiResponse<Quiz>>(`${this.base}/quizzes/${id}`);
  }
  getQuizQuestions(quizId: number): Observable<ApiResponse<Question[]>> {
    return this.http.get<ApiResponse<Question[]>>(`${this.base}/quizzes/${quizId}/questions`);
  }
  submitQuiz(quizId: number, answers: Record<number, string>): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/quizzes/${quizId}/submit`, answers);
  }
  getMyQuizAttempts(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.base}/quizzes/my-attempts`);
  }

  // Challenges
  getChallenges(page = 0, size = 12): Observable<ApiResponse<PageResponse<Challenge>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Challenge>>>(`${this.base}/challenges`, { params });
  }
  getChallenge(id: number): Observable<ApiResponse<Challenge>> {
    return this.http.get<ApiResponse<Challenge>>(`${this.base}/challenges/${id}`);
  }
  submitChallenge(id: number, query: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/challenges/${id}/submit`, { query });
  }

  // SQL Playground
  executeSQL(query: string, database: string): Observable<ApiResponse<SqlExecutionResponse>> {
    return this.http.post<ApiResponse<SqlExecutionResponse>>(
      `${this.base}/sql/execute`, { query, database });
  }
  getSQLHistory(page = 0, size = 20): Observable<ApiResponse<PageResponse<SqlExecution>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<SqlExecution>>>(`${this.base}/sql/history`, { params });
  }
  getSavedQueries(): Observable<ApiResponse<SqlExecution[]>> {
    return this.http.get<ApiResponse<SqlExecution[]>>(`${this.base}/sql/saved`);
  }
  saveExecution(id: number, name?: string): Observable<ApiResponse<SqlExecution>> {
    return this.http.patch<ApiResponse<SqlExecution>>(`${this.base}/sql/executions/${id}/save`, { saved: true, name: name || null });
  }
  getFavoriteQueries(): Observable<ApiResponse<SqlExecution[]>> {
    return this.http.get<ApiResponse<SqlExecution[]>>(`${this.base}/sql/favorites`);
  }
  getDatabases(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.base}/sql/databases`);
  }

  // Certificates
  getMyCertificates(): Observable<ApiResponse<Certificate[]>> {
    return this.http.get<ApiResponse<Certificate[]>>(`${this.base}/certificates/my`);
  }
  issueCertificate(courseId: number): Observable<ApiResponse<Certificate>> {
    return this.http.post<ApiResponse<Certificate>>(`${this.base}/certificates/issue/${courseId}`, {});
  }
  verifyCertificate(certNumber: string): Observable<ApiResponse<Certificate>> {
    return this.http.get<ApiResponse<Certificate>>(`${this.base}/certificates/verify/${certNumber}`);
  }

  // Payments
  getPlans(): Observable<ApiResponse<SubscriptionPlan_[]>> {
    return this.http.get<ApiResponse<SubscriptionPlan_[]>>(`${this.base}/payments/plans`);
  }
  createOrder(plan: string, duration: string, amount: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/payments/create-order`, { plan, duration, amount });
  }
  verifyPayment(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/payments/verify`, data);
  }
  verifyUpiPayment(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/payments/verify-upi`, data);
  }
  getPaymentHistory(): Observable<ApiResponse<Payment[]>> {
    return this.http.get<ApiResponse<Payment[]>>(`${this.base}/payments/history`);
  }

  // Blog
  getBlogs(page = 0, size = 9, category?: string, search?: string): Observable<ApiResponse<PageResponse<Blog>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (category) params = params.set('category', category);
    if (search) params = params.set('search', search);
    return this.http.get<ApiResponse<PageResponse<Blog>>>(`${this.base}/blogs`, { params });
  }
  getBlog(slug: string): Observable<ApiResponse<Blog>> {
    return this.http.get<ApiResponse<Blog>>(`${this.base}/blogs/${slug}`);
  }
  getFeaturedBlogs(): Observable<ApiResponse<Blog[]>> {
    return this.http.get<ApiResponse<Blog[]>>(`${this.base}/blogs/featured`);
  }

  // Admin
  getAdminStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/admin/dashboard`);
  }
  getAdminUsers(page = 0, size = 20): Observable<ApiResponse<PageResponse<any>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<any>>>(`${this.base}/admin/users`, { params });
  }
  getAdminPayments(page = 0, size = 20): Observable<ApiResponse<PageResponse<Payment>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Payment>>>(`${this.base}/admin/payments`, { params });
  }
  getAdminAnalytics(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/admin/analytics`);
  }
  createCourse(data: Partial<Course>): Observable<ApiResponse<Course>> {
    return this.http.post<ApiResponse<Course>>(`${this.base}/admin/courses`, data);
  }
  updateCourse(id: number, data: Partial<Course>): Observable<ApiResponse<Course>> {
    return this.http.put<ApiResponse<Course>>(`${this.base}/admin/courses/${id}`, data);
  }
  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/admin/users/${id}`);
  }
}
