import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cmp1Component } from './cmp1.component';
import { Cmp2Component } from './cmp2.component';

@NgModule({
  declarations: [Cmp1Component, Cmp2Component],
  imports: [CommonModule],
  entryComponents: [Cmp1Component, Cmp2Component]
})
export class MultiComponentsModule {
  customElementComponent: { [prop: string]: Type<any> } = {
    'juristr-cmp1': Cmp1Component,
    'juristr-cmp2': Cmp2Component
  };
}
