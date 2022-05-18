import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SignalRService } from './services/signalr.service';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    TableModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    SignalRService,
    {
      provide: APP_INITIALIZER,
      useFactory: (signalRService: SignalRService) => () =>
        signalRService.createHubConnection(),
      deps: [SignalRService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
