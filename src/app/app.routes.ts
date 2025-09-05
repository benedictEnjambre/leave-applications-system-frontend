import { Routes } from '@angular/router';
import {CreateUserComponent} from './create-user/create-user.component';

export const routes: Routes = [
  {
    path:'employee',
    children:[
      {
        path:'create-employee', component: CreateUserComponent
      }
    ]
  },
  {path:'**',component: CreateUserComponent}
];
