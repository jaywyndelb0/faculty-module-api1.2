import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FacultyComponent } from './components/faculty/faculty.component';
import { StudentComponent } from './components/student/student.component';
import { GradeComponent } from './components/grade/grade.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { Notifications } from './components/notifications/notifications';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'faculty', component: FacultyComponent },
      { path: 'student', component: StudentComponent },
      { path: 'grade', component: GradeComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'notifications', component: Notifications },
    ]
  }
];
