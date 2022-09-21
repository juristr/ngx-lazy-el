import {
  Injectable,
  NgModuleFactoryLoader,
  Injector,
  Inject,
  NgModuleRef,
  Compiler,
  NgModuleFactory,
  Type,
  ChangeDetectorRef,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createCustomElement } from '@angular/elements';
import { LazyComponentDef, LAZY_CMPS_PATH_TOKEN } from './tokens';
import { Observable, of, from } from 'rxjs';
import { LazyCmpLoadedEvent } from './lazy-cmp-loaded-event';
import { LoadChildrenCallback } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ComponentLoaderService {
  private componentsToLoad: Map<string, LazyComponentDef>;
  private loadedCmps = new Map<string, NgModuleRef<any>>();
  private elementsLoading = new Map<string, Promise<LazyCmpLoadedEvent>>();

  constructor(
    // private loader: NgModuleFactoryLoader,
    // private moduleRef: NgModuleRef<any>,
    private injector: Injector,
    @Inject(LAZY_CMPS_PATH_TOKEN)
      elementModulePaths: {
      selector: string;
      loadChildren: LoadChildrenCallback;
    }[],
    @Inject(PLATFORM_ID) private platformId: string,
    private compiler: Compiler
  ) {
    const ELEMENT_MODULE_PATHS = new Map<string, any>();
    elementModulePaths.forEach(route => {
      ELEMENT_MODULE_PATHS.set(route.selector, route);
    });
    this.componentsToLoad = ELEMENT_MODULE_PATHS;
  }

  getComponentsToLoad() {
    return this.componentsToLoad.keys();
  }

  /**
   * Heavily inspired by the Angular elements loader on the official repo
   */
  // loadContainedCustomElements(
  //   element: HTMLElement
  // ): Observable<LazyCmpLoadedEvent[]> {
  //   const unregisteredSelectors = Array.from(
  //     this.componentsToLoad.keys()
  //   ).filter(s => element.querySelector(s));

  //   // already registered elements
  //   const alreadyRegistered = Array.from(this.loadedCmps.keys()).filter(s =>
  //     element.querySelector(s)
  //   );

  //   // add the already registered in...elements won't be recreated
  //   // the "loadComponent(...)"
  //   unregisteredSelectors.push(...alreadyRegistered);

  //   // Returns observable that completes when all discovered elements have been registered.
  //   const allRegistered = Promise.all(
  //     unregisteredSelectors.map(async s => {
  //       // element.querySelector(s).remove();
  //       const result = await this.loadComponent(s, true);
  //       return result;
  //     })
  //   );
  //   return from(allRegistered);
  // }

  loadContainedCustomElements(
    tags: string[]
  ): Observable<LazyCmpLoadedEvent[]> {
    const unregisteredSelectors = Array.from(
      this.componentsToLoad.keys()
    ).filter(s => tags.find(x => x.toLowerCase() === s.toLowerCase()));

    // already registered elements
    const alreadyRegistered = Array.from(this.loadedCmps.keys()).filter(s =>
      tags.find(x => x.toLowerCase() === s.toLowerCase())
    );

    // add the already registered in...elements won't be recreated
    // the "loadComponent(...)"
    unregisteredSelectors.push(...alreadyRegistered);

    // Returns observable that completes when all discovered elements have been registered.
    const allRegistered = Promise.all(
      unregisteredSelectors.map(s => this.loadComponent(s, false))
    );
    return from(allRegistered);
  }

  /**
   * Allows to lazy load a component given it's selector (i.e. tagname).
   * If the component selector has been registered, it's according module
   * will be fetched lazily
   * @param componentTag selector of the component to load
   * @param createInstance if true, creates an element and returns it in the promise
   */
  loadComponent(
    componentTag: string,
    createInstance = true
  ): Promise<LazyCmpLoadedEvent> {
    if (this.elementsLoading.has(componentTag)) {
      return this.elementsLoading.get(componentTag);
    }

    if (this.componentsToLoad.has(componentTag)) {
      const cmpRegistryEntry = this.componentsToLoad.get(componentTag);

      const path = cmpRegistryEntry.loadChildren;

      const loadPromise = new Promise<LazyCmpLoadedEvent>((resolve, reject) => {
        (path() as Promise<NgModuleFactory<any> | Type<any>>)
          // this.loader
          //   .load(path)
          .then(elementModuleOrFactory => {
            /**
             * With View Engine, the NgModule factory is created and provided when loaded.
             * With Ivy, only the NgModule class is provided loaded and must be compiled.
             * This uses the same mechanism as the deprecated `SystemJsNgModuleLoader` in
             * in `packages/core/src/linker/system_js_ng_module_factory_loader.ts`
             * to pass on the NgModuleFactory, or compile the NgModule and return its NgModuleFactory.
             */
            if (elementModuleOrFactory instanceof NgModuleFactory) {
              return elementModuleOrFactory;
            } else {
              try {
                return this.compiler.compileModuleAsync(elementModuleOrFactory);
              } catch (err) {
                // return the error
                reject(err);

                // break the promise chain
                throw err;
              }
            }
          })
          .then(moduleFactory => {
            if (!isPlatformBrowser(this.platformId)) {
              return;
            }

            try {
              const elementModuleRef = moduleFactory.create(this.injector);
              const injector = elementModuleRef.injector;

              let customElementComponent;

              if (
                typeof elementModuleRef.instance.customElementComponent ===
                'object'
              ) {
                customElementComponent =
                  elementModuleRef.instance.customElementComponent[
                    componentTag
                    ];
                if (!customElementComponent) {
                  throw `You specified multiple component elements in module ${elementModuleRef} but there was no match for tag ${componentTag} in ${JSON.stringify(
                    elementModuleRef.instance.customElementComponent
                  )}. Make sure the selector in the module is aligned with the one specified in the lazy module definition.`;
                }
              } else {
                customElementComponent =
                  elementModuleRef.instance.customElementComponent;
              }

              const CustomElement = createCustomElement(
                customElementComponent,
                {
                  injector
                }
              );

              // define the Angular Element
              customElements!.define(componentTag, CustomElement);
              customElements
                .whenDefined(componentTag)
                .then(() => {
                  // remember for next time
                  this.loadedCmps.set(componentTag, elementModuleRef);
                  // instantiate the component
                  const componentInstance = createInstance
                    ? document.createElement(componentTag)
                    : null;
                  // const componentInstance = null;
                  resolve({
                    selector: componentTag,
                    componentInstance
                  });
                })
                .then(() => {
                  this.elementsLoading.delete(componentTag);
                  this.componentsToLoad.delete(componentTag);
                })
                .catch(err => {
                  this.elementsLoading.delete(componentTag);
                  return Promise.reject(err);
                });
            } catch (err) {
              reject(err);
              throw err;
            }
          })
          .catch(err => {
            this.elementsLoading.delete(componentTag);
            return Promise.reject(err);
          });
      });

      this.elementsLoading.set(componentTag, loadPromise);
      return loadPromise;
    } else if (this.loadedCmps.has(componentTag)) {
      // component already loaded
      return new Promise(resolve => {
        resolve({
          selector: componentTag,
          componentInstance: createInstance
            ? document.createElement(componentTag)
            : null
        });
      });
    } else {
      throw new Error(
        `Unrecognized component "${componentTag}". Make sure it is registered in the component registry`
      );
    }
  }
}
