import { async, TestBed } from '@angular/core/testing';
import { NgxLazyElModule } from './ngx-lazy-el.module';

describe('NgxLazyElModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxLazyElModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgxLazyElModule).toBeDefined();
  });
});
