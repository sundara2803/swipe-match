import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  HostListener
} from '@angular/core';
import { Gesture, GestureController } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from 'src/app/core/services/profile.service';
import { Profile } from 'src/app/core/models/profile.model';

@Component({
  selector: 'app-profile-swipe',
  templateUrl: './profile-swipe.component.html',
  styleUrls: ['./profile-swipe.component.scss']
})
export class ProfileSwipeComponent implements OnInit, AfterViewInit {
  @ViewChild('card', { static: false }) cardElement!: ElementRef;

  profiles: Profile[] = [];
  currentProfileIndex = 0;
  currentProfile: Profile | null = null;
  currentImageIndex = 0;

  constructor(
    private gestureCtrl: GestureController,
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.profileService.loadProfiles().subscribe(() => {
      this.profileService.profiles.subscribe(data => {
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

    setTimeout(() => {
      this.setupGesture();
    });
  }

  moveToNext(): void {
    this.currentProfileIndex++;
    this.loadCurrentProfile();
  }

  interested(): void {
    this.showToast('Interested');
    this.moveToNext();
  }

  notInterested(): void {
    this.showToast('Not Interested');
    this.moveToNext();
  }

  shortlist(): void {
    this.showToast('Shortlisted');
    this.moveToNext();
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
    }
  }

  setupGesture() {
    if (!this.cardElement) return;

    const gesture: Gesture = this.gestureCtrl.create({
      el: this.cardElement.nativeElement,
      gestureName: 'swipe-card',
      threshold: 15,
      onEnd: ev => {
        if (ev.deltaX > 75) {
          this.interested();
        } else if (ev.deltaX < -75) {
          this.notInterested();
        }
      }
    });

    gesture.enable();
  }
}
