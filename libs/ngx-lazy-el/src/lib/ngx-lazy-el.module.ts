import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { LazyLoadDirective } from './lazy-load.directive';
import { LAZY_CMPS_PATH_TOKEN } from './tokens';

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
        // { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
        {
          provide: LAZY_CMPS_PATH_TOKEN,
          useValue: modulePaths
        }
      ]
    };
  }
}
