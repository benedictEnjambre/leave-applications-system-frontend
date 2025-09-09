import { Component, effect, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {User} from '../../shared-data/paginated-users';
import {UsersService} from '../../shared-data/users.service';
import {FormsModule} from '@angular/forms';
import {CurrentUserService} from '../../shared-data/currentUserService';


@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./user-list.component.scss']
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  currentPage = 1;
  totalPages = 0;
  readonly pageSize = 5;

  showSuccessMsg = '';
  successType: 'success' | 'info' | 'error' | '' = '';


  constructor(
    private readonly router: Router,
    private readonly usersService: UsersService,
    private readonly currentUserService: CurrentUserService
  ) {
/*    effect(() => {
    //  const createUserSuccessMessage = this.userTransactionSignalService.userSuccessEventMessage();
      if (!createUserSuccessMessage) return;

      this.showSuccessMsg = createUserSuccessMessage;
      this.successType = 'success'; // default for signal
     // this.userTransactionSignalService.userSuccessEventMessage.set(null);
    }, { allowSignalWrites: true });*/
  }

  ngOnInit() {

    this.loadUsers();

/*    const nav = history.state;
    if (nav?.created) {
      this.showSuccessMsg = 'User successfully created';
      this.successType = 'success';
    } else if (nav?.edited) {
      this.showSuccessMsg = 'User successfully edited';
      this.successType = 'info';
    }*/


  }

  private loadUsers(page: number = 1) {
    this.usersService.getAllUsers(page, this.pageSize).subscribe((response) => {
      this.users = response.content;
      this.currentPage = response.pageNumber;
      this.totalPages = Math.ceil(response.totalCount / this.pageSize);
    });
  }

  goToEdit(employeeId: number): void {
    const currentUser = this.currentUserService.getCurrentUser();

    if (!currentUser || currentUser.role !== 'HR') {
      alert('Only HR can edit employees.');
      return;
    }

    this.router.navigate(['/hr/employee/edit', employeeId], {
      state: {
        edited: true,
        hrId: currentUser.id
      }
    });
  }


  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.loadUsers(page);
    }
  }

  searchTerm(){

  }


}
