import {
  NgModule,
  ModuleWithProviders,
  NgModuleFactoryLoader,
  SystemJsNgModuleLoader
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LAZY_CMPS_PATH_TOKEN } from './tokens';
import { ROUTES } from '@angular/router';
import { LazyLoadDirective } from './lazy-load.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [LazyLoadDirective],
  exports: [LazyLoadDirective]
})
export class NgxLazyElModule {
  static forRoot(modulePaths: any[]): ModuleWithProviders {
    return {
      ngModule: NgxLazyElModule,
      providers: [
        { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
        {
          provide: LAZY_CMPS_PATH_TOKEN,
          useValue: modulePaths
        },
        {
          provide: ROUTES,
          useValue: modulePaths,
          multi: true
        }
      ]
    };
  }
}
