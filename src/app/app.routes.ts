import { Routes } from '@angular/router';
import { CreateUserComponent } from './hr/create-user/create-user.component';
import {EditUserComponent} from './hr/edit-user/edit-user.component';
import {UserComponent} from './user/user.component';
import {UsersListComponent} from './hr/user-list/user-list.component';

export const routes: Routes = [
  {
    path: 'hr',
    children: [
      {path:'employees',component:UsersListComponent},
      { path: 'create-employee', component: CreateUserComponent  },
      { path: 'employee/:id/edit', component: EditUserComponent }

    ]
  },
  { path: '**', redirectTo: 'hr/employees' }
];
