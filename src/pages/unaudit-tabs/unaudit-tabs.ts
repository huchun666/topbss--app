import { Component, ViewChild } from '@angular/core';
import { NavParams, AlertController, Content, ModalController } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
import { AuditCancelorder } from '../audit-cancelorder/audit-cancelorder';
import { AuditReturnorder } from '../audit-returnorder/audit-returnorder';
import { ReturnDetail } from '../return-detail/return-detail';
@Component({
  selector: 'unaudit-tabs',
  templateUrl: 'unaudit-tabs.html'
})
export class UnauditTabs {
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
  ) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.load = AppConfig.load;
    // 获取待审核取消订单
    this.currentStatus = '待审核取消订单'
    this.cancelOrderCount = navParams.get('cancelOrderCount'); //待审核取消订单数量
    this.returnOrderCount = navParams.get('returnOrderCount'); //待审核退货订单数量
    this.statusList = [{
      label: '待审核取消订单',
      num: this.cancelOrderCount
    }, {
      label: '待处理退货订单',
      num: this.returnOrderCount
    }];
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
      this.statusList[0].num = data.count;
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
  auditOrderPost(index, isAgree) {
    this.start = 0;
    this.down = true;
    this.up = false;
    let loading = this.appService.loading();
    loading.present();
    let url = `${AppConfig.API.auditCancelOrder}?id=${this.unauditCancelorderArray[index].orderSeq}&isAgree=${isAgree}`;
    this.appService.httpPost(url, null).then(data => {
      if (data.type == 'success') {
        loading.dismiss();
        this.getUnauditCancelorder();
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.auditOrderPost(index, isAgree);
      });
      loading.dismiss();
      console.log(error);
      if (error.error != "invalid_token") {
        this.appService.toast('操作失败，请稍后重试', 1000, 'middle');
      }
    });
  }
  auditOrder(index) {
    const alert = this.alertCtrl.create({
      message: `同意会员${this.unauditCancelorderArray[index].memberMobile}的订单${this.unauditCancelorderArray[index].orderId}取消申请？`,
      buttons: [
        {
          text: '拒绝',
          handler: () => {
            this.auditOrderPost(index, 0);
          }
        },
        {
          text: '通过',
          handler: () => {
            this.auditOrderPost(index, 1);
          }
        }
      ]
    });
    alert.present();
  }
  goAuditCancel() {
    const orderModal = this.modalCtrl.create(AuditCancelorder);
    orderModal.present();
  }
  // 获取待审核退货订单列表
  getUnauditReturnorderList() {
    this.loadingShow = true;
    this.showNoMore = false;
    this.noData = false;
    this.requestDefeat = false;
    let url = `${AppConfig.API.getReturnorderList}?deliveryType=1&status=0&start=${this.start}&limit=${this.limit}`;
    this.appService.httpGet(url).then(data => {
      this.loadingShow = false;
      this.statusList[1].num = data.count;
      if (this.start < data.count) {
        this.showNoMore = false;
        this.noData = false;
        this.start += this.limit;
        this.showInfinite = true;
        if (this.up) {
          this.unauditReturnorderArray.push(...data.data);
        } else if (this.down) {
          this.unauditReturnorderArray = data.data;
        }
      } else if (data.count == 0) {
        this.noData = true;
        this.showNoMore = false;
        this.unauditReturnorderArray = [];
      } else if (data.data.length == 0) {
        this.noData = false;
        this.showNoMore = true;
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getUnauditReturnorderList();
      });
      this.unauditReturnorderArray = [];
      this.loadingShow = false;
      console.log(error);
      if(error.error != "invalid_token") {
        this.showInfinite = false;
        this.requestDefeat = true;
      }
    })
  }
  confirmReturnPost(index) {
    let loading = this.appService.loading();
    loading.present();
    let url = `${AppConfig.API.returnReceived}?id=${this.unauditReturnorderArray[index].orderReturnSeq}`;
    this.appService.httpPost(url, null).then(data => {
      loading.dismiss();
      if (data.type == 'success') {
        this.start = 0;
        this.up = false;
        this.down = true;
        this.getUnauditReturnorderList();
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.confirmReturnPost(index);
      });
      loading.dismiss();
      console.log(error);
      if (error.error != "invalid_token") {
        this.appService.toast('操作失败，请稍后重试', 1000, 'middle');
      }
    });
  }
  // 处理订单操作
  confirmReturn(index) {
    const alert = this.alertCtrl.create({
      message: `确认已收到会员${this.unauditReturnorderArray[index].mobile}的订单${this.unauditReturnorderArray[index].orderId}的${this.unauditReturnorderArray[index].number}件退货商品？`,
      buttons: [
        {
          text: '取消',
          handler: () => {
            //点击取消后的执行代码
          }
        },
        {
          text: '确认',
          handler: () => {
            this.confirmReturnPost(index);
          }
        }
      ]
    });
    alert.present();
  }
  auditReturn(index) {
    const orderModal = this.modalCtrl.create(ReturnDetail, { productId: this.unauditReturnorderArray[index].orderReturnSeq });
    orderModal.onDidDismiss(() => {
      this.start = 0;
      this.down = true;
      this.up = false;
      this.getUnauditReturnorderList();
    })
    orderModal.present();
  }
  goAuditReturn() {
    const orderModal = this.modalCtrl.create(AuditReturnorder);
    orderModal.present();
  }
  // 下拉刷新请求数据
  doRefresh(refresher) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.requestDefeat = false;
    setTimeout(() => {
      if (this.currentIndex == 0) {
        this.getUnauditCancelorder();
      } else {
        this.getUnauditReturnorderList();
      }
      refresher.complete();
    }, AppConfig.LOAD_TIME);
    this.showNoMore = false;
  }
  // 上拉刷新请求数据
  loadMore(infiniteScroll) {
    if (this.currentIndex == 0) {
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
    } else {
      let url = `${AppConfig.API.getReturnorderList}?deliveryType=1&status=0&start=${this.start}&limit=${this.limit}`;
      this.appService.httpGet(url).then(data => {
        infiniteScroll.complete();
        if (data.count == 0) {
          //空空如也
          this.noData = true;
        } else {
          this.noData = false;
          this.showInfinite = true;
          if (data.data.length != 0) {
            this.unauditReturnorderArray.push(...data.data);
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
  }
  // 切换tab标签
  getCurrentStatus(index) {
    this.start = 0;
    this.up = false;
    this.down = true;
    this.content.scrollTo(0, 0, 0);
    this.currentStatus = this.statusList[index].label;
    this.currentIndex = index;
    this.requestDefeat = false;
    if (this.currentIndex == 0) {
      this.getUnauditCancelorder();
    } else {
      this.getUnauditReturnorderList();
    }
  }
  //请求失败后刷新
  requestDefeatRefreshReturnorder() {
    this.requestDefeat = false;
    this.loadingShow = true;
    this.start = 0;
    this.down = true;
    this.up = false;
    this.getUnauditReturnorderList();
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
