import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { SharedModule } from '../shared';
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  declarations: [UserListComponent],
  imports: [CommonModule, SharedModule],
  entryComponents: [UserListComponent]
})
export class UsersModule {
  customElementComponent: Type<any> = UserListComponent;
}
