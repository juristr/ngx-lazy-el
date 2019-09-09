import { Component, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  template: `
    <mat-card> Hello, {{ person?.name }} </mat-card>
  `
})
export class HelloWorldComponent {
  @Input() person: { name: string };

  constructor(private cd: ChangeDetectorRef) {
    console.log('instantiated');
  }

  ngOnInit() {
    console.log('initialized');
  }
}
