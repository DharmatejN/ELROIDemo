import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { SpinnerService } from './services/spinner/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'elroidemo';
  constructor(
    private router: Router,
    private spinnerSvc: SpinnerService
  ) {

    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
        this.spinnerSvc.open();
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        this.spinnerSvc.close();
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator
        this.spinnerSvc.close();
        // Present error to user
      }
      if (event instanceof NavigationCancel) {
        // Hide loading indicator
        this.spinnerSvc.close();
        // Present error to user
      }
    });

  }
}
