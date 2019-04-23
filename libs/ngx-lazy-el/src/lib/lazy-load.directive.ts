import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { ComponentLoaderService } from './component-loader.service';
import { LazyCmpLoadedEvent } from './lazy-cmp-loaded-event';

@Directive({
  selector: 'ngx-lazy-el, [ngx-lazy-el]'
})
export class LazyLoadDirective implements OnInit, OnDestroy {
  @Output() loaded = new EventEmitter<LazyCmpLoadedEvent>();

  constructor(
    private elementRef: ElementRef,
    private componentLoader: ComponentLoaderService
  ) {}

  ngOnInit() {
    this.componentLoader
      .loadContainedCustomElements(this.elementRef.nativeElement)
      .subscribe(elements => {
        elements.forEach(x => {
          const elInstance = this.elementRef.nativeElement.querySelector(
            x.selector
          );
          if (elInstance) {
            this.notifyComponentLoaded({
              selector: x.selector,
              componentInstance: elInstance
            });
          }
        });
      });
  }

  private notifyComponentLoaded(lazyCmpEv: LazyCmpLoadedEvent) {
    this.loaded.emit({
      selector: lazyCmpEv.selector,
      componentInstance: lazyCmpEv.componentInstance
    });
  }

  ngOnDestroy() {
    console.log('lazy load destroyed');
  }
}
