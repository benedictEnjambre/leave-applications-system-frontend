// import { Component } from '@angular/core';
//
// @Component({
//   selector: 'app-sidebar',
//   standalone: true,
//   imports: [],
//   templateUrl: './sidebar.component.html',
//   styleUrls: ['./sidebar.component.scss']
// })
// export class SidebarComponent {
//   activeItem: string = '';
//
//   setActive(item: string){
//     this.activeItem = item;
//   }
// }

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  activeItem: string = '';
  menuItems: string[] = [];

  @Input() set selectedUser(user: string) {
    if (user === 'Admin') {
      this.menuItems = ['Employees', 'Add New', 'Leaves'];
    } else if (user === 'Manager') {
      this.menuItems = ['Leaves', 'Apply', 'My Leaves'];
    } else if (user === 'Member') {
      this.menuItems = ['Apply', 'My Leaves'];
    }
  }

  setActive(item: string) {
    this.activeItem = item;
  }
}
