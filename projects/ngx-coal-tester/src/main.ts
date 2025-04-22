import {provideHttpClient} from '@angular/common/http';
import {provideZoneChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';

import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';

bootstrapApplication(AppComponent, {
    providers: [provideZoneChangeDetection({eventCoalescing: true}), provideRouter(routes), provideAnimations(), provideHttpClient()],
    // eslint-disable-next-line no-console
}).catch((err) => console.error(err));
