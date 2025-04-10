import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GestureController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from 'src/app/core/services/profile.service';
import { Profile } from 'src/app/core/models/profile.model';

@Component({
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.scss']
})
export class ProfileSearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  profiles: Profile[] = [];
  newCount: number = 0;
  pendingCount: number = 0;


  constructor(
    private profileService: ProfileService,
    private router: Router,
    private gestureCtrl: GestureController
  ) { }

  ngOnInit() {
    this.profileService.loadProfiles()
      .pipe(takeUntil(this.destroy$))
      .subscribe(profiles => {
        this.profiles = profiles;
        this.pendingCount = profiles.length;
        this.newCount = profiles.length;
        setTimeout(() => this.initGestures(), 0);
      });
  }

  initGestures() {
    const cards = document.querySelectorAll('.profile-card');

    cards.forEach((card, index) => {
      const gesture = this.gestureCtrl.create({
        el: card,
        gestureName: `swipe-card-${index}`,
        threshold: 10,
        onMove: ev => {
          (card as HTMLElement).style.transform = `translateX(${ev.deltaX}px)`;
        },
        onEnd: ev => {
          (card as HTMLElement).style.transition = 'transform 0.3s ease-out';

          if (Math.abs(ev.deltaX) > 100) {
            const direction = ev.deltaX > 0 ? 1 : -1;
            (card as HTMLElement).style.transform = `translateX(${direction * 500}px)`;
            setTimeout(() => card.remove(), 300);
          } else {
            (card as HTMLElement).style.transform = 'translateX(0)';
          }
        }
      });

      gesture.enable();
    });
  }

  handleAction(action: 'yes' | 'no', profile: Profile) {
    if (action === 'yes') {
      this.router.navigate(['/profile', profile.id]);
    } else {
      const card = document.getElementById(`card-${profile.id}`);
      this.profiles = this.profiles.filter(p => p.id !== profile.id);
      this.pendingCount = this.profiles.length;
      this.newCount = this.profiles.length;
      if (card) {
        card.style.transition = 'transform 0.3s ease-out';
        card.style.transform = 'translateX(-500px)';
        setTimeout(() => card.remove(), 300);
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
