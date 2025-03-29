import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//aaaaaaa
import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
