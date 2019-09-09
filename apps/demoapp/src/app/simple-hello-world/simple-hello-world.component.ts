import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  template: `
    Hi, {{ person?.name }}
  `
})
export class SimpleHelloWorldComponent {
  @Input() person: { name: string };
}
