import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, throwError } from 'rxjs';
import { ProfileService } from 'src/app/core/services/profile.service';
import { Profile } from 'src/app/core/models/profile.model';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit {
  profile$!: Observable<Profile | undefined>;
  currentSlide: number = 0;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.profile$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return id ? this.profileService.getProfileById(id) : throwError(() => new Error('No profile ID'));
      })
    );
  }

  updateSlideIndex(event: any, profile: Profile) {
    event.target.getActiveIndex().then((index: number) => {
      this.currentSlide = index % profile.images.length;
    });
  }

}
