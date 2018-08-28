import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component'

const appRoutes: Routes = [
    { path: ':id', pathMatch: 'full', component: AppComponent }
];

export const routing = RouterModule.forRoot(appRoutes);