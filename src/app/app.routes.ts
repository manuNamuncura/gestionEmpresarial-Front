import { Routes } from '@angular/router';
import { LoginComponent } from '../app/features/auth/login/login.component';
import { DashboardComponent } from '../app/features/dashboard/dashboard.component';
import { authGuard } from '../app/core/guards/auth.guards';
import { LayouComponent } from './layout/layout.component';
import { EmpleadoListComponent } from './features/empleados/empleado-list/empleado-list.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: LayouComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'empleados', component: EmpleadoListComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'login' }
];
