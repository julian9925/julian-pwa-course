import {Component, OnInit} from '@angular/core';
import {LessonsService} from '../services/lessons.service';
import {Observable, of} from 'rxjs';
import {Lesson} from '../model/lesson';
import {SwPush} from '@angular/service-worker';
import {NewsletterService} from '../services/newsletter.service';
import {catchError} from 'rxjs/operators';

@Component({
    selector: 'lessons',
    templateUrl: './lessons.component.html',
    styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {

    lessons$: Observable<Lesson[]>;
    isLoggedIn$: Observable<boolean>;
    sub: PushSubscription;

    readonly VAPID_PUBLIC_KEY = 'BFbuXqQFF8CwI6Qg3KbIwrweTsJLG5X0tQh6uWUdizq_TuPMqcWRILK0V5P9DvwMFpUbLl48VD7ehU9Elamqh78';

    constructor(
        private lessonsService: LessonsService,
        private swPush: SwPush,
        private newsletterService: NewsletterService) {

    }

    ngOnInit() {
        this.loadLessons();
    }


    loadLessons() {
        this.lessons$ = this.lessonsService.loadAllLessons().pipe(catchError(() => of([])));
    }

    subscribeToNotifications() {
        this.swPush.requestSubscription({
           serverPublicKey: this.VAPID_PUBLIC_KEY
        })
          .then((sub) => {
              console.log('Notification Subscription: ', sub);
              this.sub = sub;

              this.newsletterService.addPushSubscriber(sub).subscribe(
                () => console.log('Send push subscription object to server'),
                (err) => console.log('Could not send subscription object to server, reason: ', err)
              );
          })
          .catch((err) => console.error('Could not subscribe to notification', err));
    }


    sendNewsletter() {
      console.log('Sending Newsletter to all subscribers ...');

      this.newsletterService.send().subscribe();
    }





}
