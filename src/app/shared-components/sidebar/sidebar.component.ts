import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../shared-data/paginated-users';
import { CurrentUserService } from '../../shared-data/currentUserService';

interface MenuItem {
  label: string;
  children?: { label: string; route: string }[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems: MenuItem[] = [];
  activeItem: string = '';

  constructor(
    public currentUserService: CurrentUserService,
    private router: Router
  ) {
    effect(() => {
      const user = this.currentUserService.getCurrentUser();
      this.menuItems = this.buildMenu(user);

      // 👇 if there’s at least one menu with children, set the first one active
      const firstChild = this.menuItems[0]?.children?.[0];
      if (firstChild) {
        this.activeItem = firstChild.label;
        this.router.navigate([firstChild.route]); // navigate automatically
      }
    });
  }

  private buildMenu(user?: User): MenuItem[] {
    if (!user) return [];
    switch ((user.role ?? '').toUpperCase()) {
      case 'HR':
        return [
          { label: '', children: [    //remove the Employees
              { label: 'Employees', route: '/hr/employees' },
              { label: 'Add New', route: '/hr/create-employee' },
            ]},
          { label: '', children: [ // leaves
              { label: 'Leaves', route: '/hr/view-all-leave' },
            ]},
        ];
      case 'MANAGER':
        return [
          { label: '', children: [
              { label: 'Apply', route: '/manager/add-leave' },  // change route
              { label: 'My Leaves', route: '/manager/view-leave' },
              { label: 'View All', route: '/manager/view-employee-leave' },
            ]},
        ];
      case 'EMPLOYEE':
        return [
          { label: '', children: [
              { label: 'Apply', route: '/employee/add-leave' },
              { label: 'My Leaves', route: '/employee/my-leave' },
            ]},
        ];
      default:
        return [];
    }
  }

  setActive(item: { label: string; route: string }) {
    this.activeItem = item.label;
    this.router.navigate([item.route]);
  }
}
