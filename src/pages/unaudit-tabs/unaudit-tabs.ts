import { Component, ViewChild } from '@angular/core';
import { NavParams, AlertController, Content, ModalController, Events } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { SuperTabs } from 'ionic2-super-tabs';
import { UnauditCancelPage } from '../unaudit-cancel/unaudit-cancel';
import { UnauditReturnPage } from '../unaudit-return/unaudit-return';
@Component({
  selector: 'unaudit-tabs',
  templateUrl: 'unaudit-tabs.html'
})
export class UnauditTabs {
  @ViewChild(Content) content: Content;
  @ViewChild(SuperTabs) superTabs: SuperTabs;
  cancel: any = UnauditCancelPage;
  return: any = UnauditReturnPage;
  cancelCount: string;
  returnCount: string;
  cancelOrderCount: number;
  returnOrderCount: number;
  constructor(
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public appService: AppService,
    public modalCtrl: ModalController,
    public events: Events
  ) {
    this.cancelOrderCount = navParams.get('cancelOrderCount'); //待审核取消订单数量
    this.returnOrderCount = navParams.get('returnOrderCount'); //待审核退货订单数量
    this.cancelCount = `待审核取消订单（${this.cancelOrderCount}）`;
    this.returnCount = `待处理退货订单（${this.returnOrderCount}）`;
    events.subscribe('cancel:created', (cancel, time) => {
      UnauditTabs.prototype.cancelCount = `待审核取消订单（${cancel}）`; 
      this.cancelCount = UnauditTabs.prototype.cancelCount;
    });
    events.subscribe('return:created', (data, time) => {
      UnauditTabs.prototype.cancelCount = `待处理退货订单（${data}）`; 
      this.returnCount = UnauditTabs.prototype.cancelCount;
    });
  }
  
}
