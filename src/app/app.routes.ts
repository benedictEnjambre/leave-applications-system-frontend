import { Routes } from '@angular/router';
import {CreateUserComponent} from './hr/create-user/create-user.component';
import {AppComponent} from './app.component';

export const routes: Routes = [
  {
    path:'hr',
    children:[
      {
        path:'create-employee', component: CreateUserComponent
      }
    ]
  }
];