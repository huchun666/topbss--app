/** start 解决ios9下报错 “Can't find variable: Intl”， 时间显示不出来 **/
import 'intl';
import 'intl/locale-data/jsonp/en';
/** end */

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
