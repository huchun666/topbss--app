import { Component } from '@angular/core';
import { ModalController, NavController, AlertController, Events } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MyCode } from '../mycode/mycode';
import { CreatOrder } from '../creat-order/creat-order';
import { GiftInfo } from '../gift-info/gift-info';
import { OrderInfo } from '../order-info/order-info';
import { UnauditTabs } from '../unaudit-tabs/unaudit-tabs';
import { UnhandleTabs } from '../unhandle-tabs/unhandle-tabs';
import { HandleSelfgift } from '../handle-selfgift/handle-selfgift';
import { Network } from '@ionic-native/network';
@Component({
  selector: 'home',
  templateUrl: 'home.html'
})
export class Home {
  cancelOrderCount: number = 0;
  returnOrderCount: number = 0;
  selfGiftCount: number = 0;
  expressgiftCount: number = 0;
  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public appService: AppService,
    public barcodeScanner: BarcodeScanner,
    public events: Events,
    public network: Network
  ) {
  }
  ionViewDidEnter() {
    this.getUnAuditCount();
    this.getUnHandleCount();
    this.events.subscribe('check: status', (data) => {
      if (data) {
        this.navCtrl.parent.select(1);
      }
    });
    this.watchNetwork();
  }
  // 每次离开页面的时候执行
  ionViewDidLeave() {
    this.events.unsubscribe('check: status', () => {
      console.log('did unsubscribe');
    });
  }
  //获取取消订单、退货订单数量
  getUnAuditCount() {
    let url = AppConfig.API.untreatedCount
    this.appService.httpGet(url).then(data => {
      this.cancelOrderCount = data.cancelCount;
      this.returnOrderCount = data.returnCount;
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getUnAuditCount();
      });
      console.log(error);
    });
  }
  //获取自提赠品、快递赠品数量
  getUnHandleCount() {
    let url = `${AppConfig.API.getUnhandleGiftCount}`;
    this.appService.httpGet(url).then(data => {
      this.selfGiftCount = data.reserved;
      this.expressgiftCount = data.undelivered;
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getUnHandleCount();
      });
      console.log(error);
    });
  }
  goUnAudit() {
    let unAuditModal = this.modalCtrl.create(UnauditTabs, {
      cancelOrderCount: this.cancelOrderCount,
      returnOrderCount: this.returnOrderCount
    });
    unAuditModal.present();
    unAuditModal.onDidDismiss(() => {
      this.getUnAuditCount();
    });
  }
  goUnHandle() {
    let unHandleModal = this.modalCtrl.create(UnhandleTabs, {
      selfGiftCount: this.selfGiftCount,
      expressGiftCount: this.expressgiftCount
    });
    unHandleModal.present();
    unHandleModal.onDidDismiss(() => {
      this.getUnHandleCount();
    })
  }
  qrCodeScan() {
    this.barcodeScanner.scan().then((barcodeData) => {
      let url = barcodeData.text;
      if (!url) {
        return;
      }
      if (url.indexOf(AppConfig.mainUrl) < 0) {
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '请扫描淘璞系统内二维码',
          buttons: ['确定']
        });
        alert.present();
      } else {
        if (url.indexOf('id') > 0) {
          let myCodeModal = this.modalCtrl.create(OrderInfo, { 'url': url });
          myCodeModal.onDidDismiss(data => {
            if (!data) {
              return;
            }
            if (data.type === '1') {
              this.qrCodeScan();
            } else if (data.type === '0') {
              this.navCtrl.parent.select(1);
            }
          });
          myCodeModal.present();
        } else if (url.indexOf('giftCode') > 0) {
          let myCodeModal = this.modalCtrl.create(GiftInfo, { 'url': url });
          myCodeModal.onDidDismiss(data => {
            if (!data) {
              return;
            }
            if (data.type === '1') {
              this.qrCodeScan();
            } else if (data.type === '0') {
              const giftModal = this.modalCtrl.create(HandleSelfgift);
              giftModal.present();
            }
          });
          myCodeModal.present();
        }
        else {
          let alert = this.alertCtrl.create({
            title: '提示',
            subTitle: '请扫描订单或者赠品二维码',
            buttons: ['确定']
          });
          alert.present();
        }
      }
    }, (err) => {
      console.log('扫码失败');
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '扫描失败，请重新再试',
        buttons: ['确定']
      });
      alert.present();
    });
  }
  /** 我的二维码 **/
  goMyCode() {
    let myCodeModal = this.modalCtrl.create(MyCode);
    myCodeModal.present();
  }
  /** 配单仓 **/
  goCreatOrder() {
    let creatOrderModal = this.modalCtrl.create(CreatOrder);
    creatOrderModal.present();
  }
  /** Network检查网络状态 **/
  watchNetwork() {
    this.network.onDisconnect().subscribe(() => {
      this.appService.toast('当前网络不可用', 1000, 'middle');
    });
  }
}
