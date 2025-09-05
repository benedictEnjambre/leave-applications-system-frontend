import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  users: string[] = ['Admin', 'Manager', 'Member']; // 🔥 3 roles
  selectedUser: string = 'Admin';

  @Output() userChanged = new EventEmitter<string>();

  onUserChanged(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedUser = target.value;
    this.userChanged.emit(this.selectedUser); // 🔥 notify parent (AppComponent)
  }
}
