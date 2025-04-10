import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener
} from '@angular/core';
import { Gesture, GestureController } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from 'src/app/core/services/profile.service';
import { Profile } from 'src/app/core/models/profile.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile-swipe',
  templateUrl: './profile-swipe.component.html',
  styleUrls: ['./profile-swipe.component.scss']
})
export class ProfileSwipeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('card', { static: false }) cardElement!: ElementRef;

  private destroy$ = new Subject<void>();
  private gesture?: Gesture;

  profiles: Profile[] = [];
  currentProfileIndex = 0;
  currentProfile: Profile | null = null;
  currentImageIndex = 0;
  rotationAngle = 0;
  cardPosition = 0;

  constructor(
    private gestureCtrl: GestureController,
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.profileService.loadProfiles()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.profileService.profiles
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.profiles = data;
            this.loadCurrentProfile();
          });
      });
  }

  ngAfterViewInit() {
    this.setupGesture();
  }

  loadCurrentProfile(): void {
    this.currentProfile = this.profiles[this.currentProfileIndex] || null;
    this.currentImageIndex = 0;
  
    this.resetCardPosition();
  
    if (this.currentProfile) {
      setTimeout(() => {
        this.setupGesture();
      });
    }
  }
  

  resetCardPosition(): void {
    if (this.cardElement?.nativeElement) {
      this.cardPosition = 0;
      this.rotationAngle = 0;
      this.updateCardTransform();
    }
  }

  updateCardTransform(): void {
    this.cardElement.nativeElement.style.transform = `
      translateX(${this.cardPosition}px)
      rotate(${this.rotationAngle}deg)
    `;
  }

  moveToNext(): void {
    if (this.currentProfileIndex < this.profiles.length - 1) {
      this.currentProfileIndex++;
      this.loadCurrentProfile();
    } else {
      this.currentProfile = null;
    }
  }

  interested(): void {
    this.showToast('Interested');
    this.animateCardOut(1);
  }

  notInterested(): void {
    this.showToast('Not Interested');
    this.animateCardOut(-1);
  }

  shortlist(): void {
    this.showToast('Shortlisted');
    this.animateCardOut(1);
  }

  animateCardOut(direction: number): void {
    if (!this.cardElement?.nativeElement) return;

    this.cardElement.nativeElement.style.transition = 'transform 0.4s ease-out';
    this.cardPosition = direction * 500;
    this.rotationAngle = direction * 25;
    this.updateCardTransform();

    setTimeout(() => {
      this.moveToNext();
    }, 400);
  }

  showToast(message: string): void {
    this.snackBar.open(message, '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      this.interested();
    } else if (event.key === 'ArrowLeft') {
      this.notInterested();
    } else if (event.key.toLowerCase() === 's') {
      this.shortlist();
    }
  }

  setupGesture(): void {
    if (!this.cardElement?.nativeElement) return;

    this.gesture = this.gestureCtrl.create({
      el: this.cardElement.nativeElement,
      gestureName: 'swipe-card',
      threshold: 5,
      gesturePriority: 10,
      onMove: (ev) => {
        this.cardPosition = ev.deltaX;
        this.rotationAngle = (ev.deltaX / 150) * 25;
        this.updateCardTransform();
      },
      onEnd: (ev) => {
        this.cardElement.nativeElement.style.transition = 'transform 0.4s ease-out';

        if (Math.abs(ev.deltaX) > 100) {
          ev.deltaX > 0 ? this.interested() : this.notInterested();
        } else {
          this.resetCardPosition();
        }
      }
    }, true);

    this.gesture.enable(true);
  }

  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.gesture?.destroy();
  }
}
