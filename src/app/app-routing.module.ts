import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProfileSwipeComponent } from './features/profile-swipe/profile-swipe/profile-swipe.component';
import { ProfileSearchComponent } from './features/profile-search/profile-search/profile-search.component';
import { ProfileDetailComponent } from './features/profile-detail/profile-detail/profile-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'profile-search', pathMatch: 'full' },
  { path: 'profile-search', component: ProfileSearchComponent },
  { path: 'profile/:id', component: ProfileDetailComponent },
  { path: 'profile-swipe', component: ProfileSwipeComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }