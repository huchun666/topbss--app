import { Component, ViewChild, NgZone } from '@angular/core';
import { NavParams, AlertController, Content, ModalController } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
import { HandleSelfgift } from '../handle-selfgift/handle-selfgift';
import { HandleExpressgift } from '../handle-expressgift/handle-expressgift';
@Component({
  selector: 'unhandle-tabs',
  templateUrl: 'unhandle-tabs.html'
})
export class UnhandleTabs {
  @ViewChild(Content) content: Content;
  selfGiftCount: string;
  expressGiftCount: string;
  currentStatus: any;
  statusList: any;
  unhandleSeflGiftArray: any = [];
  unhandleExpressGiftArray: any = [];
  limit: number = 10;
  up: Boolean;
  down: Boolean;
  noData: Boolean = false;
  start: number = 0;
  showNoMore: Boolean = false;
  load: any = {};
  loadingShow: Boolean = true;
  currentIndex = 1;
  reserveShopTimeMin: string = '';
  toTop: Boolean;//是否显示返回顶部按钮
  requestDefeat: Boolean = false;
  showInfinite: Boolean = false;
  constructor(
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public appService: AppService,
    public modalCtrl: ModalController,
    public zone: NgZone
  ) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.load = AppConfig.load;
    this.reserveShopTimeMin = this.appService.reserveDate();
    this.currentStatus = '快递到家赠品'
    this.statusList = [{
      label: '到店自提赠品',
      num: this.selfGiftCount
    }, {
      label: '快递到家赠品',
      num: this.expressGiftCount
    }];
    // 获取tab数量
    this.getTabCount();
    // 获取快递到家赠品
    this.getUnhandleExpressGiftList();
  }
  // 获取tab上显示的数量
  getTabCount() {
    let urlExpress = `${AppConfig.API.getGiftList}?type=0&start=${this.start}&limit=${this.limit}`;
    let urlSelf = `${AppConfig.API.getGiftList}?type=1&start=${this.start}&limit=${this.limit}`;
    this.appService.httpGet(urlExpress).then(data => {
      this.expressGiftCount = data.count;
      this.statusList[0].num = data.count;
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getTabCount();
      });
      if(error.error != "invalid_token") {
        this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
      }
    });
    this.appService.httpGet(urlSelf).then(data => {
      this.selfGiftCount = data.count;
      this.statusList[1].num = data.count;
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getTabCount();
      });
      if(error.error != "invalid_token") {
        this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
      }
    })
  }
  // 获取自提赠品
  getUnhandleSelfGiftList() {
    this.loadingShow = true;
    this.showNoMore = false;
    this.noData = false;
    this.requestDefeat = false;
    let url = `${AppConfig.API.getGiftList}?type=0&start=${this.start}&limit=${this.limit}`;
    this.appService.httpGet(url).then(data => {
      this.loadingShow = false;
      this.statusList[0].num = data.count;
      if (this.start < data.count) {
        this.showNoMore = false;
        this.noData = false;
        this.start += this.limit;
        this.showInfinite = true;
        if (this.up) {
          this.unhandleSeflGiftArray.push(...data.data);
        } else if (this.down) {
          this.unhandleSeflGiftArray = data.data;
        }
        this.addOrderStatusClass(this.unhandleSeflGiftArray);
      } else if (data.count == 0) {
        this.noData = true;
        this.showNoMore = false;
        this.unhandleSeflGiftArray = [];
      } else if (data.data.length == 0) {
        this.noData = false;
        this.showNoMore = true;
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getUnhandleSelfGiftList();
      });
      this.unhandleSeflGiftArray = [];
      this.loadingShow = false;
      console.log(error);
      if(error.error != "invalid_token") {
        this.showInfinite = false;
        this.requestDefeat = true;
      }
    })
  }
  addOrderStatusClass(param: any) {
    param.map(function (item) {
      if (item.giftType == '0' && item.status == '2') {
        item.className = 'unstart';
      } else if (item.giftType == '1') {
        item.className = 'unstart';
      } else {
        item.className = 'success';
      }
    });
  }
  // 查看已完成的自提
  goSelfgift() {
    const orderModal = this.modalCtrl.create(HandleSelfgift);
    orderModal.onDidDismiss(() => {
      // 返回自提赠品页重新请求接口，渲染页面
      this.start = 0;
      this.down = true;
      this.up = false;
      this.getUnhandleSelfGiftList();
    })
    orderModal.present();
  }
  clearReserveArriveTime(index) {
    this.unhandleSeflGiftArray[index].reserveShopTime = "";
  }
  reserveAffirm(index) {
    if (this.unhandleSeflGiftArray[index].reserveShopTime != null) {
      // 预约确认更改数据
      let body = {
        memberGiftAccountSeq: this.unhandleSeflGiftArray[index].memberGiftAccountSeq,
        reserveShopTime: new Date(this.unhandleSeflGiftArray[index].reserveShopTime).getTime()
      }
      let loading = this.appService.loading();
      loading.present();
      let url = AppConfig.API.confirmReserveShopTime;
      this.appService.httpPost(url, body).then(data => {
        if (data.type == "success") {
          this.start = 0;
          this.down = true;
          this.up = false;
          loading.dismiss();
          this.appService.toast('预约成功！', 1000, 'middle');
          this.getUnhandleSelfGiftList();
        }
      }).catch(error => {
        this.appService.getToken(error, () => {
          this.reserveAffirm(index);
        });
        if(error.error != "invalid_token") {
          this.appService.toast('操作失败，请稍后重试', 1000, 'middle');
          loading.dismiss();
        }
        console.log(error.message);
      });
    } else {
      this.appService.toast('请选择会员预约到店时间', 1000, 'middle');
    }
  }
  //回到顶部
  scrollTo() {
    this.content.scrollTo(0, 0, 300);
  }
  //获取当前距离顶部位置
  scrollHandler(event) {
    this.zone.run(() => {
      if (event.scrollTop >= 300) {
        this.toTop = true;
      } else {
        this.toTop = false;
      }
    })
  }
  // 获取快递赠品
  getUnhandleExpressGiftList() {
    this.loadingShow = true;
    this.showNoMore = false;
    this.noData = false;
    this.requestDefeat = false;
    this.showInfinite = true;
    let url = `${AppConfig.API.getGiftList}?type=1&start=${this.start}&limit=${this.limit}`;
    this.appService.httpGet(url).then(data => {
      this.loadingShow = false;
      this.statusList[this.currentIndex].num = data.count;
      if (this.start < data.count) {
        this.showNoMore = false;
        this.noData = false;
        this.start += this.limit;
        if (this.up) {
          this.unhandleExpressGiftArray.push(...data.data);
        } else if (this.down) {
          this.unhandleExpressGiftArray = data.data;
        }
        this.addOrderStatusClass(this.unhandleExpressGiftArray);
      } else if (data.count == 0) {
        this.noData = true;
        this.showNoMore = false;
        this.unhandleExpressGiftArray = [];
      } else if (data.data.length == 0) {
        this.noData = false;
        this.showNoMore = true;
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getUnhandleExpressGiftList();
      });
      this.unhandleExpressGiftArray = [];
      this.loadingShow = false;
      console.log(error);
      if(error.error != "invalid_token") {
        this.showInfinite = false;
        this.requestDefeat = true;
      }
    })
  }
  goExpressgift() {
    const orderModal = this.modalCtrl.create(HandleExpressgift);
    orderModal.onDidDismiss(() => {
      // 返回自提赠品页重新请求接口，渲染页面
      this.start = 0;
      this.down = true;
      this.up = false;
      this.getUnhandleExpressGiftList();
    })
    orderModal.present();
  }
  sendProductPost(index, data) {
    if (data.companyName != "" && data.orderNum != "") {
      let body = {
        memberGiftAccountSeq: this.unhandleExpressGiftArray[index].memberGiftAccountSeq,
        expressCompany: data.companyName,
        expressNo: data.orderNum
      }
      let loading = this.appService.loading();
      loading.present();
      let url = AppConfig.API.confirmExpressInfo;
      this.appService.httpPost(url, body).then(data => {
        if (data.type == "success") {
          this.start = 0;
          this.down = true;
          this.up = false;
          loading.dismiss();
          this.getUnhandleExpressGiftList();
        }
      }).catch(error => {
        this.appService.getToken(error, () => {
          this.sendProductPost(index, data);
        });
        loading.dismiss();
        console.log(error);
        if (error.error != "invalid_token") {
          this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
        }
      });
    } else if (data.companyName != "") {
      this.appService.toast('请填写快递单号', 1000, 'middle');
    } else if (data.orderNum != "") {
      this.appService.toast('请填写公司名称', 1000, 'middle');
    }
  }
  sendProduct(index) {
    let alert = this.alertCtrl.create({
      message: '赠品发货确认',
      inputs: [
        {
          name: 'companyName',
          type: 'text',
          placeholder: '请在此输入快递公司名称'
        }, {
          name: 'orderNum',
          type: 'text',
          placeholder: '请在此输入快递单号'
        }
      ],
      buttons: [
        {
          text: '取消',
          handler: () => {
            //点击取消后的执行代码
          }
        },
        {
          text: '确认',
          handler: data => {
            this.sendProductPost(index, data);
          }
        }
      ]
    });
    alert.present();
  }
  // 下拉刷新请求数据
  doRefresh(refresher) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.requestDefeat = false;
    setTimeout(() => {
      if (this.currentIndex == 0) {
        this.getUnhandleSelfGiftList();
      } else {
        this.getUnhandleExpressGiftList();
      }
      refresher.complete();
    }, AppConfig.LOAD_TIME);
    this.showNoMore = false;
  }
  // 上拉刷新请求数据
  loadMore(infiniteScroll) {
    if (this.currentIndex == 0) {
      let url = `${AppConfig.API.getGiftList}?type=0&start=${this.start}&limit=${this.limit}`;
      this.appService.httpGet(url).then(data => {
        infiniteScroll.complete();
        if (data.data.length != 0) {
          this.unhandleSeflGiftArray.push(...data.data);
          this.start += this.limit;
          this.addOrderStatusClass(this.unhandleSeflGiftArray);
        } else {
          this.showNoMore = true;
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
      let url = `${AppConfig.API.getGiftList}?type=1&start=${this.start}&limit=${this.limit}`;
      this.appService.httpGet(url).then(data => {
        infiniteScroll.complete();
        if (data.count == 0) {
          //空空如也
          this.noData = true;
        } else {
          this.noData = false;
          if (data.data.length != 0) {
            this.unhandleExpressGiftArray.push(...data.data);
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
    if (this.currentIndex == 0) {
      this.getUnhandleSelfGiftList();
    } else {
      this.getUnhandleExpressGiftList();
    }
  }
  //请求失败后刷新
  requestDefeatRefresh() {
    this.requestDefeat = false;
    this.loadingShow = true;
    this.start = 0;
    this.down = true;
    this.up = false;
    this.getUnhandleExpressGiftList();
  }
  //请求失败后刷新
  requestDefeatRefreshSelfGift() {
    this.requestDefeat = false;
    this.loadingShow = true;
    this.start = 0;
    this.down = true;
    this.up = false;
    this.getUnhandleSelfGiftList();
  }
  requestDefeatRefreshExpressGift() {
    this.requestDefeat = false;
    this.loadingShow = true;
    this.start = 0;
    this.down = true;
    this.up = false;
    this.getUnhandleExpressGiftList();
  }
}