import { Component } from '@angular/core';
import { LazyCmpLoadedEvent } from '@juristr/ngx-lazy-el';

@Component({
  selector: 'juristr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demoapp';
  isLoaded = false;
  message;
  userList = [
    {
      name: 'Juri'
    },
    {
      name: 'Steffi'
    }
  ];

  onLoaded(lazyCmp: LazyCmpLoadedEvent) {
    switch (lazyCmp.selector) {
      case 'app-user-list': {
        lazyCmp.componentInstance['users'] = this.userList;
        break;
      }
    }
  }

  onSave(value) {
    console.log('Got', value);
    this.message = value.detail;
  }
}
