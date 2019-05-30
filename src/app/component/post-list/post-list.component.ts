import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from '../post-create/post.model';
import { PostsService } from '../../services/posts.service';
import { AuthService } from '../signup/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  @ViewChild('paginator') paginator: any;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  userId: string;
  name: string;


  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.name = this.authService.getname();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  // onDelete(postId: string) {
  //   this.isLoading = true;
  //   this.postsService.deletePost(postId).subscribe(() => {
  //     this.postsService.getPosts(this.postsPerPage, this.currentPage);
  //   });
  // }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      // this if block with terniary operator is not in the instructors code : )
      if (this.totalPosts - 1 - (this.postsPerPage * (this.currentPage - 1)) <= 0) {
        this.currentPage = (this.currentPage === 1) ? 1 : this.currentPage - 1;
        this.paginator.pageIndex = this.currentPage - 1;
        this.totalPosts = (this.totalPosts === 0) ? 0 : this.totalPosts - 1;
        this.paginator.page.next({
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize,
          length: this.totalPosts
        });
      }
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
