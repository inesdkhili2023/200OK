import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  declare global {
    interface Window {
      turnstile: any;
    }
  }
  
  function waitForTurnstileReady(): Promise<void> {
    return new Promise(resolve => {
      const check = () => {
        if (window.turnstile && window.turnstile.render) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }
  
  async function initApp() {
    await waitForTurnstileReady();
  
    window.turnstile.render('#cf-turnstile', {
      sitekey: '0x4AAAAAABD3IE_zD-CeTtyI',
      callback: (token: string) => {
        console.log('✅ CAPTCHA passed', token);
  
        // Remove overlay and show Angular app
        const overlay = document.getElementById('captcha-overlay');
        const app = document.querySelector('app-root') as HTMLElement;
        if (overlay && app) {
          overlay.remove();
          app.style.display = 'block';
        }
  
        // Optionally store token for backend use
        localStorage.setItem('captchaToken', token);
      }
    });
  }
  
  initApp().then(() => {
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
  });
  
