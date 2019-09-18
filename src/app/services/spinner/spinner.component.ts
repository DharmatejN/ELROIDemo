import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `
                <mat-progress-spinner [diameter]="100" color="primary" mode="indeterminate">
                </mat-progress-spinner>
              `,
  styles: ['./app.component.css']
})
export class SpinnerComponent { }
