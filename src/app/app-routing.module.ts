import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../app/guard/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: './views/pages/page-login/page-login.module#PageLoginModule',
  },
  {
    path: 'swab-list',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-swab-list/page-swab-list.module#PageSwabListModule',
  },
  {
    path: 'schedule',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-radiology-schedule/page-radiology-schedule.module#PageRadiologyScheduleModule'
  },
  {
    path: 'worklist',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-worklist/page-worklist.module#PageWorklistModule'
  },
  {
    path: 'modality-master',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-modality-master/page-modality-master.module#PageModalityMasterModule',
  },
  {
    path: 'maintenence-schedule',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-modality-maintenance/page-modality-maintenance.module#PageModalityMaintenanceModule'
  },
  {
    path: 'queue-management',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-queue-management/page-queue-management.module#PageQueueManagementModule'
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-home/page-home.module#PageHomeModule'
  },
  {
    path: 'doctor-schedule',
    canActivate: [AuthGuard],
    loadChildren: './views/pages/page-doctor-schedule/page-doctor-schedule.module#PageDoctorScheduleModule'
  },
  {
    path: '',
    canActivate: [AuthGuard],
    redirectTo: '/schedule',
    pathMatch: 'full'
    // loadChildren: './views/pages/page-home/page-home.module#PageHomeModule'
  },  
  {
    path: '**',
    redirectTo: '/schedule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
