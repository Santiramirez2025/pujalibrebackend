import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
const serviceAccount = require('../config/serviceAccountKey.json');


@Injectable()
export class FirebaseService {
  private messaging: admin.messaging.Messaging;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
    }
    this.messaging = admin.messaging();
  }

  async sendNotification(token: string, title: string, body: string) {
    const message = {
      notification: { title, body },
      token,
    };
    return this.messaging.send(message);
  }
}
