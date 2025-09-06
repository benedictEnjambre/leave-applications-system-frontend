import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-leave',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-leave.component.html',
  styleUrls: ['./my-leave.component.scss']
})
export class EmployeeMyLeaveComponent{

}
