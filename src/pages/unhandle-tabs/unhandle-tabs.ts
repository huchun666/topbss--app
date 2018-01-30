import { Component, ViewChild, NgZone } from '@angular/core';
import { NavParams, AlertController, Content, ModalController } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
import { UnhandleSelfPage } from '../unhandle-self/unhandle-self';
import { UnhandleExpressPage } from '../unhandle-express/unhandle-express';
import { SuperTabs } from 'ionic2-super-tabs';
@Component({
  selector: 'unhandle-tabs',
  templateUrl: 'unhandle-tabs.html'
})
export class UnhandleTabs {
  @ViewChild(Content) content: Content;
  @ViewChild(SuperTabs) superTabs: SuperTabs;
  self: any = UnhandleSelfPage;
  express: any = UnhandleExpressPage;
  selfGiftCount: string = '到店自提赠品';
  expressGiftCount: string = '快递到家赠品';
  limit: number = 10;
  start: number = 0;
  constructor(
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public appService: AppService,
    public modalCtrl: ModalController,
    public zone: NgZone
  ) {
    this.start = 0;
    // 获取tab数量
    this.getTabCount();
  }
  // 获取tab上显示的数量
  getTabCount() {
    let urlExpress = `${AppConfig.API.getGiftList}?type=1&start=${this.start}&limit=${this.limit}`;
    let urlSelf = `${AppConfig.API.getGiftList}?type=0&start=${this.start}&limit=${this.limit}`;
    this.appService.httpGet(urlExpress).then(data => {
      this.expressGiftCount =`快递到家赠品（${data.count}）`;
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getTabCount();
      });
      if (error.error != "invalid_token") {
        this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
      }
    });
    this.appService.httpGet(urlSelf).then(data => {
      this.selfGiftCount =`到店自提赠品（${data.count}）`;
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getTabCount();
      });
      if (error.error != "invalid_token") {
        this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
      }
    })
  }
  
}