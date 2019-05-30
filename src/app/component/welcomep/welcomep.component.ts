import { Component, OnInit } from '@angular/core';
import { AuthService } from '../signup/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-welcomep',
  templateUrl: './welcomep.component.html',
  styleUrls: ['./welcomep.component.css']
})
export class WelcomepComponent implements OnInit {
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

// tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
