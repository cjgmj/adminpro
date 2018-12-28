import { Routes, RouterModule } from '@angular/router';

import { LoginGuard } from '../services/service.index';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalesComponent } from './hospitales/hospitales.component';

const PAGESROUTES: Routes = [
    { path: '', component: PagesComponent, canActivate: [ LoginGuard ], children: [
        // Usuario
        { path: 'profile', component: ProfileComponent, data: { titulo: 'Perfil' } },
        { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes' } },
        // Principal
        { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' } },
        { path: 'progress', component: ProgressComponent, data: { titulo: 'Progress' } },
        { path: 'graficas1', component: Graficas1Component, data: { titulo: 'Gráficas' } },
        { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
        { path: 'rxjs', component: RxjsComponent, data: { titulo: 'Rxjs' } },
        // Gestión
        { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Gestión de usuarios' } },
        { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Gestión de hospitales' } },
        // Por defecto
        { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ] }
];

export const PAGES_ROUTES = RouterModule.forChild( PAGESROUTES );
