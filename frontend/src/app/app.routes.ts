import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';
import { redirectAdminGuard } from './core/guards/redirect-admin.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [redirectAdminGuard],
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'verify-email',
        loadComponent: () => import('./features/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, redirectAdminGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'learn',
    canActivate: [redirectAdminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/learning/module-list/module-list.component').then(m => m.ModuleListComponent)
      },
      {
        path: ':courseId',
        loadComponent: () => import('./features/learning/course-landing/course-landing.component').then(m => m.CourseLandingComponent)
      },
      {
        path: ':courseId/lesson/:lessonId',
        canActivate: [authGuard, redirectAdminGuard],
        loadComponent: () => import('./features/learning/lesson-detail/lesson-detail.component').then(m => m.LessonDetailComponent)
      }
    ]
  },
  {
    path: 'playground',
    canActivate: [authGuard, redirectAdminGuard],
    loadComponent: () => import('./features/playground/playground.component').then(m => m.PlaygroundComponent)
  },
  {
    path: 'quiz',
    canActivate: [redirectAdminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/quiz/quiz-list/quiz-list.component').then(m => m.QuizListComponent)
      },
      {
        path: ':id/attempt',
        canActivate: [authGuard, redirectAdminGuard],
        loadComponent: () => import('./features/quiz/quiz-attempt/quiz-attempt.component').then(m => m.QuizAttemptComponent)
      }
    ]
  },
  {
    path: 'challenges',
    canActivate: [redirectAdminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/challenges/challenge-list/challenge-list.component').then(m => m.ChallengeListComponent)
      },
      {
        path: ':id',
        canActivate: [authGuard, redirectAdminGuard],
        loadComponent: () => import('./features/challenges/challenge-detail/challenge-detail.component').then(m => m.ChallengeDetailComponent)
      }
    ]
  },
  {
    path: 'certificates',
    canActivate: [authGuard, redirectAdminGuard],
    loadComponent: () => import('./features/certifications/certifications.component').then(m => m.CertificationsComponent)
  },
  {
    path: 'interview-prep',
    canActivate: [redirectAdminGuard],
    loadComponent: () => import('./features/interview-prep/interview-prep.component').then(m => m.InterviewPrepComponent)
  },
  {
    path: 'blog',
    canActivate: [redirectAdminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/blog/blog-list/blog-list.component').then(m => m.BlogListComponent)
      },
      {
        path: ':slug',
        loadComponent: () => import('./features/blog/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent)
      }
    ]
  },
  {
    path: 'pricing',
    canActivate: [redirectAdminGuard],
    loadComponent: () => import('./features/payment/plans/plans.component').then(m => m.PlansComponent)
  },
  {
    path: 'checkout',
    canActivate: [authGuard, redirectAdminGuard],
    loadComponent: () => import('./features/payment/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/users/admin-users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'users/new',
        loadComponent: () => import('./features/admin/users/admin-user-create/admin-user-create.component').then(m => m.AdminUserCreateComponent)
      },
      {
        path: 'courses',
        loadComponent: () => import('./features/admin/courses/admin-courses.component').then(m => m.AdminCoursesComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./features/admin/analytics/admin-analytics.component').then(m => m.AdminAnalyticsComponent)
      },
      {
        path: 'blog',
        loadComponent: () => import('./features/admin/blog/admin-blog.component').then(m => m.AdminBlogComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
