

import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './src/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection()
  ],
}).then(() => console.log('App bootstrap complete'))
  .catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
