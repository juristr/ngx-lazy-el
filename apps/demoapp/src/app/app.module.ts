import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { NxModule } from '@nrwl/angular';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared';
import { NgxLazyElModule, fakeMatcher } from '@juristr/ngx-lazy-el';
import { SimpleHelloWorldModule } from './simple-hello-world/simple-hello-world.module';

const lazyConfig = [
  {
    selector: 'app-user-list',
    matcher: fakeMatcher,
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    selector: 'app-hello-world',
    matcher: fakeMatcher,
    loadChildren: () =>
      import('./hello-world/hello-world.module').then(m => m.HelloWorldModule)
  },
  {
    selector: 'juristr-cmp1',
    matcher: fakeMatcher,
    loadChildren: () =>
      import('./multi-components/multi-components.module').then(
        m => m.MultiComponentsModule
      )
  },
  {
    selector: 'juristr-cmp2',
    matcher: fakeMatcher,
    loadChildren: () =>
      import('./multi-components/multi-components.module').then(
        m => m.MultiComponentsModule
      )
  }
];

@NgModule({
  declarations: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    SharedModule,
    NgxLazyElModule.forRoot(lazyConfig),
    NxModule.forRoot(),
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    BrowserAnimationsModule,
    SimpleHelloWorldModule
    // HelloWorldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
