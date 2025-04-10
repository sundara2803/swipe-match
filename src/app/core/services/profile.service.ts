import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profiles$ = new BehaviorSubject<Profile[]>([]);

  constructor(private http: HttpClient) { }

  loadProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>('assets/data/profiles.json').pipe(
      tap(profiles => this.profiles$.next(profiles)),
      catchError(error => {
        console.error('Error loading profiles', error);
        this.profiles$.next([]);
        return of([]);
      })
    );
  }

  get profiles(): Observable<Profile[]> {
    return this.profiles$.asObservable();
  }

  getProfileById(id: string): Observable<Profile | undefined> {
    return this.profiles$.pipe(
      map(profiles => profiles.find(p => p.id === id))
    );
  }
}
