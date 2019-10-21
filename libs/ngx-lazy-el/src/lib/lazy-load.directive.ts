import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectorRef,
  ViewContainerRef,
  TemplateRef,
  ContentChild,
  ContentChildren,
  AfterContentInit,
  Input
} from '@angular/core';
import { ComponentLoaderService } from './component-loader.service';
import { LazyCmpLoadedEvent } from './lazy-cmp-loaded-event';

@Directive({
  selector: '[ngxLazyEl]'
})
export class LazyLoadDirective implements OnInit, OnDestroy {
  // @Input() ngxLazyEl: string[] | string | null;
  @Output() loaded = new EventEmitter<LazyCmpLoadedEvent>();

  constructor(
    private elementRef: ElementRef,
    private componentLoader: ComponentLoaderService,
    private cd: ChangeDetectorRef,
    private vcr: ViewContainerRef,
    private template: TemplateRef<any>
  ) {}

  ngOnInit() {
    let nodeTags: string[]; // = this.ngxLazyEl;

    if (!nodeTags) {
      // try to automatically infer the elemements

      const template = this.template.createEmbeddedView({});
      if (template.rootNodes[0].children.length > 0) {
        // we probably have a container with elements in it, so try to load all of them
        // lazily
        nodeTags = [...template.rootNodes[0].children].map(x =>
          x.tagName.toLowerCase()
        );
      } else {
        nodeTags = [template.rootNodes[0].tagName.toLowerCase()];
      }
    }

    if (!nodeTags) {
      throw new Error(
        `Unable to automatically determine the dynamic element selectors. Alternatively you can pass them in via the *ngxLazyEl="['my-lazy-el']"`
      );
    }

    this.componentLoader
      // .loadContainedCustomElements(this.elementRef.nativeElement)
      .loadContainedCustomElements(nodeTags)
      .subscribe(elements => {
        this.vcr.clear();
        this.vcr.createEmbeddedView(this.template);

        // try to get the element DOM
        let domInstance = null;
        if (this.elementRef.nativeElement.parentElement) {
          domInstance = this.elementRef.nativeElement.parentElement.querySelector(
            elements[0].selector
          );
        }

        this.notifyComponentLoaded({
          selector: nodeTags[0],
          componentInstance: domInstance
        });
      });
  }

  private isIvyMode(): boolean {
    return (this.template as any)._declarationTContainer;
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
