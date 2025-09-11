import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: "root"
})

export class SuccessMessageSignalService {
  public SuccessEventMessage = signal<string | null>('');
}
