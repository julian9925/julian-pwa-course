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

    readonly VAPID_PUBLIC_KEY = 'BHGh1uOJtOtivoFiUmlcF54-d25PPMOB41ZxLQyAopIrONDntZ3urtDVylD_JrNUnVXvbFnWmip1pNBonR3v6UI';

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

              this.newsletterService.addPushSubscriber(sub).subscribe(
                () => console.log('Send push subscription object to server'),
                (err) => console.log('Could not send subscription object to server, reason: ', err)
              );
          })
          .catch((err) => console.error('Could not subscribe to notification', err));
    }


    sendNewsletter() {


    }





}
