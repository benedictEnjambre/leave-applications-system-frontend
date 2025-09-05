// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import {HeaderComponent} from './shared-components/header/header.component';
// import {SidebarComponent} from './shared-components/sidebar/sidebar.component';
//
// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, HeaderComponent, SidebarComponent],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss'
// })
// export class AppComponent {
//   title = 'leave-management';
// }


// import { Component } from '@angular/core';
//
// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {
//   selectedUser: string = 'Admin'; // default
//
//   onUserChanged(user: string) {
//     this.selectedUser = user;
//   }
//


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared-components/header/header.component';
import { SidebarComponent } from './shared-components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,     // for *ngIf, *ngFor, etc.
    RouterOutlet,     // 🔥 so <router-outlet> works
    HeaderComponent,  // 🔥 so <app-header> works
    SidebarComponent  // 🔥 so <app-sidebar> works
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedUser: string = 'Admin';

  onUserChanged(user: string) {
    this.selectedUser = user;
  }
}
