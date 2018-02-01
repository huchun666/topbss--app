import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppService, AppConfig } from './app.service';
import { NgModule, ErrorHandler } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Dialogs } from '@ionic-native/dialogs';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Network } from '@ionic-native/network';
import { SuperTabsModule } from 'ionic2-super-tabs';
import {
  FilterStatusPipe,
  FilterReturnStatusPipe,
  FilterCancelStatusPipe,
  FilterWithdrawStatusPipe,
  FilterGiftTypePipe,
  FilterHandleGiftTypePipe,
  IsOrIsnotInvalidAttrValuePipe,
  InvalidAttrValueClassPipe,
  ChangeGrayPipe,
  OverStockPipe,
  ProductSkuDTOImagePipe,
  ReasonTypePipe,
  HandleGiftImagePipe
} from './app.pipe';
import { QRCodeModule } from 'angular2-qrcode';
import { Login } from '../pages/login/login';
import { Forget } from '../pages/forget/forget';
import { UpdatePwd } from '../pages/update-pwd/update-pwd';
import { Home } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { Personl } from '../pages/personl/personl';
import { OrderInfo } from '../pages/order-info/order-info';
import { GiftInfo } from '../pages/gift-info/gift-info';
import { CreatOrder } from '../pages/creat-order/creat-order';
import { Help } from '../pages/help/help';
import { OrderLayer } from '../pages/order-layer/order-layer';
import { OrderStore } from '../pages/order-store/order-store';
import { PaymentCode } from '../pages/payment-code/payment-code';
import { UnauditTabs } from '../pages/unaudit-tabs/unaudit-tabs';
import { UnhandleTabs } from '../pages/unhandle-tabs/unhandle-tabs';
import { AuditCancelorder } from '../pages/audit-cancelorder/audit-cancelorder';
import { AuditReturnorder } from '../pages/audit-returnorder/audit-returnorder';
import { ReturnDetail } from '../pages/return-detail/return-detail';
import { ReturnedDetail } from '../pages/returned-detail/returned-detail';
import { HandleSelfgift } from '../pages/handle-selfgift/handle-selfgift';
import { HandleExpressgift } from '../pages/handle-expressgift/handle-expressgift';
import { Withdraw } from '../pages/withdraw/withdraw';
import { WithdrawRecord } from '../pages/withdraw-record/withdraw-record';
import { MyCode } from '../pages/mycode/mycode';
import { AwardTabs } from '../pages/award-tabs/award-tabs';
import { AwardActivity } from '../pages/award-activity/award-activity';
import { AwardOrderPage } from '../pages/award-order/award-order';
import { BindAccount } from '../pages/account/bind-account/bind-account';
import { AddAccount } from '../pages/account/add-account/add-account';
import { EditAccount } from '../pages/account/edit-account/edit-account';
import { OrderList } from '../pages/order-list/order-list';
import { BrandshopOrderList } from '../pages/brandshop-order-list/brandshop-order-list';
import { OrderDetail } from '../pages/order-detail/order-detail';
import { AwardDetail } from '../pages/award-detail/award-detail';
import { DetailTabs } from '../pages/detail-tabs/detail-tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OrderListAllPage } from '../pages/order-list-all/order-list-all';
import { OrderListCanceledPage } from '../pages/order-list-canceled/order-list-canceled';
import { OrderListFinishedPage } from '../pages/order-list-finished/order-list-finished';
import { OrderListPayPage } from '../pages/order-list-pay/order-list-pay';
import { OrderListReceiptPage } from '../pages/order-list-receipt/order-list-receipt';
import { BrandshopOrderAllPage } from '../pages/brandshop-order-all/brandshop-order-all';
import { BrandshopOrderCanceledPage } from '../pages/brandshop-order-canceled/brandshop-order-canceled';
import { BrandshopOrderCancelingPage } from '../pages/brandshop-order-canceling/brandshop-order-canceling';
import { BrandshopOrderFinishedPage } from '../pages/brandshop-order-finished/brandshop-order-finished';
import { BrandshopOrderPayPage } from '../pages/brandshop-order-pay/brandshop-order-pay';
import { BrandshopOrderReceiptedPage } from '../pages/brandshop-order-receipted/brandshop-order-receipted';
import { DetailActivityPage } from '../pages/detail-activity/detail-activity';
import { DetailOrderPage } from '../pages/detail-order/detail-order';
import { UnhandleSelfPage } from '../pages/unhandle-self/unhandle-self';
import { UnhandleExpressPage } from '../pages/unhandle-express/unhandle-express';
import { UnauditCancelPage } from '../pages/unaudit-cancel/unaudit-cancel';
import { UnauditReturnPage } from '../pages/unaudit-return/unaudit-return';
let componentsList = [
  MyApp,
  Login,
  Forget,
  UpdatePwd,
  Home,
  TabsPage,
  Personl,
  OrderInfo,
  GiftInfo,
  CreatOrder,
  Help,
  OrderLayer,
  OrderStore,
  PaymentCode,
  UnauditTabs,
  AuditCancelorder,
  AuditReturnorder,
  ReturnDetail,
  ReturnedDetail,
  UnhandleTabs,
  HandleSelfgift,
  HandleExpressgift,
  Withdraw,
  WithdrawRecord,
  MyCode,
  BindAccount,
  AddAccount,
  EditAccount,
  OrderList,
  BrandshopOrderList,
  OrderDetail,
  AwardDetail,
  DetailTabs,
  OrderListAllPage,
  OrderListCanceledPage,
  OrderListFinishedPage,
  OrderListPayPage,
  OrderListReceiptPage,
  BrandshopOrderAllPage,
  BrandshopOrderCanceledPage,
  BrandshopOrderCancelingPage,
  BrandshopOrderFinishedPage,
  BrandshopOrderPayPage,
  BrandshopOrderReceiptedPage,
  AwardTabs,
  AwardActivity,
  AwardOrderPage,
  DetailActivityPage,
  DetailOrderPage,
  UnhandleSelfPage,
  UnhandleExpressPage,
  UnauditCancelPage,
  UnauditReturnPage
];
@NgModule({
  declarations: [
    ...componentsList,
    FilterStatusPipe,
    FilterReturnStatusPipe,
    FilterCancelStatusPipe,
    FilterWithdrawStatusPipe,
    FilterGiftTypePipe,
    FilterHandleGiftTypePipe,
    IsOrIsnotInvalidAttrValuePipe,
    InvalidAttrValueClassPipe,
    ChangeGrayPipe,
    OverStockPipe,
    ProductSkuDTOImagePipe,
    ReasonTypePipe,
    HandleGiftImagePipe
  ],
  imports: [
    BrowserModule,
    QRCodeModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '返回',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      statusbarPadding: false,
      swipeBackEnabled: true,
      tabsHideOnSubPages: true,
      pageTransition: 'android-transition'
    }),
    SuperTabsModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: componentsList,
  providers: [
    StatusBar,
    SplashScreen,
    AppService,
    AppConfig,
    Dialogs,
    BarcodeScanner,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Network
  ]
})
export class AppModule { }
