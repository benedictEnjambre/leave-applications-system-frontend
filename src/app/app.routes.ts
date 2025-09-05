import { Routes } from '@angular/router';
import { CreateUserComponent } from './hr/create-user/create-user.component';
import {EditUserComponent} from './hr/edit-user/edit-user.component';
import {UserComponent} from './user/user.component';
import {UsersListComponent} from './hr/user-list/user-list.component';
import {AddLeaveComponent} from './manager/add-leave/add-leave.component';

export const routes: Routes = [
  {
    path: 'hr',
    children: [
      {path:'employees',component:UsersListComponent},
      { path: 'create-employee', component: CreateUserComponent  },
      { path: 'employee/:id/edit', component: EditUserComponent }
    ]
  },

  {
    path: 'manager',
    children: [
      {path: 'add-leave', component: AddLeaveComponent},

    ]

  },
  { path: '**', redirectTo: 'hr/employees' },
];
