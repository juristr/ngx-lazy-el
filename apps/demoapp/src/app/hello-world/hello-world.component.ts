import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  template: `
    {{ message }}
  `
})
export class HelloWorldComponent {
  @Input() message: string;
}
