import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { SharedModule } from '../shared';
import { HelloWorldComponent } from './hello-world.component';

@NgModule({
  declarations: [HelloWorldComponent],
  imports: [CommonModule, SharedModule],
  exports: [HelloWorldComponent],
  entryComponents: [HelloWorldComponent]
})
export class HelloWorldModule {
  customElementComponent: Type<any> = HelloWorldComponent;
}
