import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-success-message',
  standalone: true,
  imports: [],
  templateUrl: './success-message.component.html',
  styleUrl: './success-message.component.scss'
})
export class SuccessMessageComponent implements OnChanges{
  @Input() message: string | null = null;
  @Output() messageChange = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges){
    const msg = changes['message']?.currentValue;

    if(msg){
      this.clearAfterDelay(msg)
    }
  }

  private clearAfterDelay(msg: string){
    if(msg) {
      setTimeout(() => {
        this.messageChange.emit('');
      }, 3000)
    }
  }

  dismiss() {
    this.messageChange.emit('');
  }

}
