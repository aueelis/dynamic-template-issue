import '@angular/compiler';
import { CommonModule } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  NgModule,
  NgModuleRef,
  ViewChild,
  ViewContainerRef,
  createNgModule,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <ng-template #dynamicContainer></ng-template>
  `,
})
export class App implements AfterViewInit {
  name = 'Angular';

  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
  dynamicContainer: ViewContainerRef = {} as ViewContainerRef;

  constructor(private httpClient: HttpClient) {}

  ngAfterViewInit(): void {
    this.httpClient
      .get('dynamic-template.html', { responseType: 'text' })
      .subscribe((template) => this.useTemplate(template));
  }

  private useTemplate(template: string): void {
    const { component, moduleRef } = this.createDynamic(template);
    this.dynamicContainer.clear();
    this.dynamicContainer.createComponent(component, {
      environmentInjector: moduleRef.injector,
    });
  }

  private createDynamic(template: string): {
    component: any;
    moduleRef: NgModuleRef<any>;
  } {
    const component = this.createComponent(template);
    const module = this.createModule(component);
    const moduleRef = createNgModule(module, this.dynamicContainer.injector);

    return { component, moduleRef };
  }

  private createComponent(template: string) {
    return Component({
      template,
    })(class DynamicComponent {});
  }

  private createModule(component: any) {
    return NgModule({
      imports: [CommonModule],
      declarations: [component],
    })(class DynamicModule {});
  }
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
