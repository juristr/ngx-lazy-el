# ngx-lazy-el (alpha)

[![npm version](https://badge.fury.io/js/%40juristr%2Fngx-lazy-el.svg)](https://badge.fury.io/js/%40juristr%2Fngx-lazy-el)

Easy lazy loading components 💪 by Angular Elements.

**Important note:** for now this is an experiment and still needs to be battle-tested. **API might break!** Meanwhile, follow me [@juristr](https://twitter.com/juristr)) for questions/ideas/getting notified about updates.

## How to use it

### Install Angular Elements on your project

This library depends on Angular Elements. You can install that via

```
$ ng add @angular/elements
```

### Install ngx-lazy-el

Install the library from npm.

```
$ npm install @juristr/ngx-lazy-el
```

or

```
$ yarn add @juristr/ngx-lazy-el
```

### Lazy load a component

#### Configure the Module containing the lazy loaded component

First of all, expose the Angular Component that should be loaded via a `customElementComponent` property.

```
...
@NgModule({
  declarations: [HelloWorldComponent],
  ...
  exports: [HelloWorldComponent]
})
export class HelloWorldModule {
  customElementComponent: Type<any> = HelloWorldComponent;
}
```

#### Define the lazy component map in your AppModule

Just like with the Angular Router, define the map of component selector and lazy module.

```
// app.module.ts
...
const lazyConfig = [
  {
    selector: 'app-hello-world',
    loadChildren: () =>
      import('./hello-world/hello-world.module').then(m => m.HelloWorldModule)
  }
];

@NgModule({
  ...
  imports: [
    ...
    NgxLazyElModule.forRoot(lazyConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

#### Use the lazy loaded Component

To use the lazy loaded component in another module, first of all register the `CUSTOM_ELEMENT_SCHEMA`.

```
import { ..., CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  ...
})
export class SomeModule {}
```

That is needed because otherwise Angular won't recognize the tag as it is no more an Angular Component, but Custom Element.

Next, you can just use the Custom Element by applying the `*ngxLazyEl` directive.

```
<app-hello-world *ngxLazyEl [person]="person"></app-hello-world>
```

If it is behind a `*ngIf` or other non-visible component, the `app-hello-world` will be lazy loaded on the fly.

## Questions?

Open an [issue](https://github.com/juristr/ngx-lazy-el/issues) or ping me [on Twitter](https://twitter.com/juristr).
