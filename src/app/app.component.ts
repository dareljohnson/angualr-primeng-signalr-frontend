import { Component } from '@angular/core';
import { Book } from './models/book';
import { SignalRService } from './services/signalr.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent {
  title = 'signalr-demo';
  loading: boolean = true;
  books: Book[] = [];
  messageUpdate!: string;

  constructor(
    private signalRService: SignalRService,
    private messageService: MessageService
  ) {}

  public ngOnInit(): void {
    this.signalRService.bookUpdated.subscribe((data) => {
      this.books = data;
    });

    this.signalRService.messageReceived.subscribe((message) => {
      this.messageUpdate = message;
      if (this.messageUpdate != null) {
        this.toastAlert(this.messageUpdate);
      }
    });
    this.loading = false;
  }

  toastAlert(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Message Received',
      detail: 'New book ' + message,
    });
  }

  ngOnDestroy(): void {
    this.signalRService.stopHubConnection();
  }
}
