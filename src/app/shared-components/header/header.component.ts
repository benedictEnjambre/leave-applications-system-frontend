import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  users = ['Dexter S (Admin)', 'Sarah J (Manager)', 'David R (Member)',];
  selectedUser = this.users[0];

  onUserChanged(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedUser = target.value;
    console.log('Selected user:', this.selectedUser);
  }
}
