import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // <- ESTO ES VITAL PARA TU BACKEND

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient() // <- SIN ESTO LA PANTALLA SE QUEDA EN BLANCO
  ]
};