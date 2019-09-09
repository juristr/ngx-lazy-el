import { CommonModule } from '@angular/common';
import { NgModule, Type, Injector } from '@angular/core';
import { SharedModule } from '../shared';
import { SimpleHelloWorldComponent } from './simple-hello-world.component';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [SimpleHelloWorldComponent],
  imports: [CommonModule, SharedModule],
  entryComponents: [SimpleHelloWorldComponent]
})
export class SimpleHelloWorldModule {
  constructor(injector: Injector) {
    const el = createCustomElement(SimpleHelloWorldComponent, { injector });
    customElements.define('simple-hello-world', el);
  }
}
