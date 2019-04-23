import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ApplicationRef,
  ChangeDetectionStrategy,
  EventEmitter,
  Output
} from '@angular/core';

@Component({
  // selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  @Input() users;
  @Input() name;
  @Output() save = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  onSave() {
    this.save.emit({
      name: this.name
    });
  }

  ngOnDestroy() {
    console.log('User List component destroyed');
  }
}
