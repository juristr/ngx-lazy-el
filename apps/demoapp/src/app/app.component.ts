import { Component, ElementRef } from '@angular/core';
import {
  LazyCmpLoadedEvent,
  ComponentLoaderService
} from '@juristr/ngx-lazy-el';

@Component({
  selector: 'juristr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Component Lazy Loading 💪 by ng elements';
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

  constructor(
    private elementRef: ElementRef,
    private cmpLoader: ComponentLoaderService
  ) {}

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

  loadProgrammatically() {
    this.cmpLoader
      .loadComponent('app-hello-world')
      .then((ev: LazyCmpLoadedEvent) => {
        ev.componentInstance['message'] = 'Hi there';

        this.elementRef.nativeElement
          .querySelector('#manualLoading')
          .prepend(ev.componentInstance);
      });
  }
}
