import { Component, OnInit } from '@angular/core';

import { Post } from './component/post-create/post.model';

import { AuthService } from './component/signup/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// export class AppComponent {
//   sotredPosts: Post[] = [];
//   title = 'MEAN';

//   onPostAdded(post) {
//     this.sotredPosts.push(post);
//   }
// }
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
