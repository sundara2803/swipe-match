import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { addIcons } from 'ionicons';
import { ellipsisVertical, sadOutline } from 'ionicons/icons';
addIcons({
  'ellipsis-vertical': ellipsisVertical,
  'sad-outline': sadOutline,
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
