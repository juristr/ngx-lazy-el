import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
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
  multilazy = false;
  multilazyEl = false;
  message;
  userList = [
    {
      name: 'Juri'
    },
    {
      name: 'Steffi'
    }
  ];

  person;

  constructor(
    private elementRef: ElementRef,
    private cd: ChangeDetectorRef,
    private cmpLoader: ComponentLoaderService
  ) {}

  ngOnInit() {
    setInterval(() => {
      this.person = {
        name: 'Peter ' + Math.random()
      };
      // this.cd.detectChanges();
      // console.log(this.person.name);
    }, 2500);
  }

  onLoaded(lazyCmp: LazyCmpLoadedEvent) {
    console.log(lazyCmp.selector + ' got instantiated');
  }

  onSave(value) {
    console.log('Got', value);
    this.message = value.detail;
  }

  loadProgrammatically() {
    this.cmpLoader
      .loadComponent('app-hello-world', true)
      .then((ev: LazyCmpLoadedEvent) => {
        ev.componentInstance['person'] = { name: 'Juri' };

        this.elementRef.nativeElement
          .querySelector('#manualLoading')
          .prepend(ev.componentInstance);
      });
  }
}
