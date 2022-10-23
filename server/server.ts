
import * as express from 'express';
import {Application} from 'express';
import {readAllLessons} from './read-all-lessons.route';
import {addPushSubscriber} from './add-push-subscriber.route';
import {sendNewsletter} from './send-newsletter.route';
const bodyParser = require('body-parser');

const webpush = require('web-push');


const vapidKeys = {
    'publicKey': 'BFbuXqQFF8CwI6Qg3KbIwrweTsJLG5X0tQh6uWUdizq_TuPMqcWRILK0V5P9DvwMFpUbLl48VD7ehU9Elamqh78',
    'privateKey': 'mfvckBPbdmIFfz1hvcV3vK6HCijf7ZsEG6CW5L2wCgk'
};


webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);


const app: Application = express();


app.use(bodyParser.json());


// REST API
app.route('/api/lessons')
    .get(readAllLessons);

app.route('/api/notifications')
    .post(addPushSubscriber);

app.route('/api/newsletter')
    .post(sendNewsletter);



// launch an HTTP Server
const httpServer: any = app.listen(9000, () => {
    console.log('HTTP Server running at http://localhost:' + httpServer.address().port);
});
