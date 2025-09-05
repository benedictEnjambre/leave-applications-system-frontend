import { Routes } from '@angular/router';
import { CreateUserComponent } from './hr/create-user/create-user.component';
import {EditUserComponent} from './hr/edit-user/edit-user.component';

export const routes: Routes = [
  {
    path: 'hr',
    children: [
      { path: 'create-employee', component: CreateUserComponent  },
      { path: 'employee/:id/edit', component: EditUserComponent }
    ]
  },
  { path: '**', redirectTo: 'hr/employees' }
];
