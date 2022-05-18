import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Book } from '../models/book';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  public hubConnection!: signalR.HubConnection;
  private readonly signalrDemoEndpoint?: string;

  bookUpdated = new BehaviorSubject<Book[]>([]);
  messageReceived!: BehaviorSubject<string>;

  constructor() {
    this.signalrDemoEndpoint = environment.hubUrls.signalRDemo;
    this.bookUpdated = new BehaviorSubject<Book[]>([]);
    this.messageReceived = new BehaviorSubject<string>('');
  }

  public createHubConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(this.signalrDemoEndpoint!) // the SignalR server url, in the .NET Project properties
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.registerClientMethods();

      this.hubConnection
        .start()
        .then(() => {
          console.log(
            `SignalR connection success! connectionId: ${this.hubConnection.connectionId} `
          );
          resolve();
        })
        .catch((error) => {
          console.log(`SignalR connection error: ${error}`);
          reject();
        });
    });
  }

  private registerClientMethods(): void {
    this.hubConnection.on('myBooks', (message: Book[]) => {
      this.bookUpdated.next(message);
    });
    this.hubConnection.on('myToaster', (message: string) => {
      this.messageReceived.next(message);
    });
  }

  public stopHubConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      console.log(
        `SignalR connection stopped! connectionId: ${this.hubConnection.connectionId} `
      );
    }
  }
}
