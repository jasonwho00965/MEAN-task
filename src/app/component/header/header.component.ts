import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../signup/auth.service';
import { Subscription } from 'rxjs';
import { AuthData } from '../signup/auth-data.model';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  name: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.name = this.authService.getname();
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
