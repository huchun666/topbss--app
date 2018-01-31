import { Component, ViewChild } from '@angular/core';
import { NavParams, AlertController, Content, ModalController, Events } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
import { AuditCancelorder } from '../audit-cancelorder/audit-cancelorder';

@Component({
  selector: 'page-unaudit-cancel',
  templateUrl: 'unaudit-cancel.html',
})
export class UnauditCancelPage {
  @ViewChild(Content) content: Content;
  cancelCount: string;
  returnCount: string;
  cancelOrderCount: number;
  returnOrderCount: number;
  currentStatus: any;
  statusList: any;
  unauditCancelorderArray: any = [];
  unauditReturnorderArray: any = [];
  limit: number = 10;
  up: Boolean;//上拉刷新和第一次进入页面时
  down: Boolean;//下拉刷新和返回上一级页面时
  noData: Boolean = false;
  start: number = 0;
  showNoMore: Boolean = false;
  load: any = {};
  loadingShow: Boolean = true;
  currentIndex = 0;
  requestDefeat: Boolean = false;
  showInfinite: Boolean = false;
  constructor(
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public appService: AppService,
    public modalCtrl: ModalController,
    public events: Events
  ) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.load = AppConfig.load;
    this.getUnauditCancelorder();
  }
  // 获取待审核取消订单列表
  getUnauditCancelorder() {
    this.loadingShow = true;
    this.showNoMore = false;
    this.noData = false;
    this.requestDefeat = false;
    let url = `${AppConfig.API.getCancelorder}?deliveryType=1&status=0&start=${this.start}&limit=${this.limit}`
    this.appService.httpGet(url).then(data => {
      this.loadingShow = false;
      this.events.publish('cancel:created',data.count, Date.now());
      if (this.start < data.count) {
        this.showNoMore = false;
        this.noData = false;
        this.start += this.limit;
        this.showInfinite = true;
        if (this.up) {
          this.unauditCancelorderArray.push(...data.data);
        } else if (this.down) {
          this.unauditCancelorderArray = data.data;
        }
      } else if (data.count == 0) {
        this.noData = true;
        this.showNoMore = false;
        this.unauditCancelorderArray = [];
      } else if (data.data.length == 0) {
        this.noData = false;
        this.showNoMore = true;
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getUnauditCancelorder();
      });
      this.unauditCancelorderArray = [];
      this.loadingShow = false;
      console.log(error);
      if(error.error != "invalid_token") {
        this.showInfinite = false;
        this.requestDefeat = true;
      }
    })
  }
  //审核点击事件
  auditOrder(index) {
    const alert = this.alertCtrl.create({
      message: `同意会员${this.unauditCancelorderArray[index].memberMobile}的订单${this.unauditCancelorderArray[index].orderId}取消申请？`,
      buttons: [
        {
          text: '拒绝',
          handler: () => {
            this.auditOrderRefusePost(index);
          }
        },
        {
          text: '通过',
          handler: () => {
            this.auditOrderSuccessPost(index);
          }
        }
      ]
    });
    alert.present();
  }
  auditOrderRefusePost(index) {
    this.start = 0;
    this.down = true;
    this.up = false;
    // 点击拒绝后的执行代码
    let loading = this.appService.loading();
    loading.present();
    let url = `${AppConfig.API.auditCancelOrder}?id=${this.unauditCancelorderArray[index].orderSeq}&isAgree=0`;
    this.appService.httpPost(url, null).then(data => {
      if (data.type == 'success') {
        loading.dismiss();
        this.getUnauditCancelorder();
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.auditOrderRefusePost(index);
      });
      loading.dismiss();
      console.log(error);
      if(error.error != "invalid_token") {
        this.appService.toast('操作失败，请稍后重试', 1000, 'middle');
      }
    });
  }
  auditOrderSuccessPost(index) {
    this.start = 0;
    this.down = true;
    this.up = false;
    // 点击同意后的执行代码
    let loading = this.appService.loading();
    loading.present();
    let url = `${AppConfig.API.auditCancelOrder}?id=${this.unauditCancelorderArray[index].orderSeq}&isAgree=1`;
    this.appService.httpPost(url, null).then(data => {
      if (data.type == 'success') {
        loading.dismiss();
        this.getUnauditCancelorder();
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.auditOrderSuccessPost(index);
      });
      loading.dismiss();
      console.log(error);
      if(error.error != "invalid_token") {
        this.appService.toast('操作失败', 1000, 'middle');
      }
    });
  }
  goAuditCancel() {
    const orderModal = this.modalCtrl.create(AuditCancelorder);
    orderModal.present();
  }
  // 下拉刷新请求数据
  doRefresh(refresher) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.requestDefeat = false;
    setTimeout(() => {
      this.getUnauditCancelorder();
      refresher.complete();
    }, AppConfig.LOAD_TIME);
    this.showNoMore = false;
  }
  // 上拉刷新请求数据
  loadMore(infiniteScroll) {
    let url = `${AppConfig.API.getCancelorder}?deliveryType=1&status=0&start=${this.start}&limit=${this.limit}`
    this.appService.httpGet(url).then(data => {
      infiniteScroll.complete();
      if (data.count == 0) {
        //空空如也
        this.noData = true;
      } else {
        this.noData = false;
        this.showInfinite = true;
        if (data.data.length != 0) {
          this.unauditCancelorderArray.push(...data.data);
          this.start += this.limit;
        } else {
          this.showNoMore = true;
        }
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.loadMore(infiniteScroll);
      });
      console.log(error);
      if(error.error != "invalid_token") {
        infiniteScroll.complete();
        this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
      }
    });
  }
  requestDefeatRefreshCancelorder() {
    this.requestDefeat = false;
    this.loadingShow = true;
    this.start = 0;
    this.down = true;
    this.up = false;
    this.getUnauditCancelorder();
  }

}
