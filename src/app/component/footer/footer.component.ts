import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../signup/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
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

// tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
