import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './component/post-list/post-list.component';
import { PostCreateComponent } from './component/post-create/post-create.component';
import { LoginComponent } from './component/login/login.component';
import { WelcomepComponent } from './component/welcomep/welcomep.component';
import { SignupComponent } from './component/signup/signup.component';
import { AuthGuard } from './component/signup/auth.guard';
import { AboutComponent } from './component/about/about.component';

const routes: Routes = [
  {path: 'posts', component: PostListComponent},
  {path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: '', component: WelcomepComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'about', component: AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
