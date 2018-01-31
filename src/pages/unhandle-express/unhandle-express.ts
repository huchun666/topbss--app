import { Component, ViewChild, NgZone } from '@angular/core';
import { NavParams, AlertController, Content, ModalController, Events } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
import { HandleExpressgift } from '../handle-expressgift/handle-expressgift';

@Component({
  selector: 'page-unhandle-express',
  templateUrl: 'unhandle-express.html',
})
export class UnhandleExpressPage {
  @ViewChild(Content) content: Content;
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
    public zone: NgZone,
    public events: Events

  ) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.load = AppConfig.load;
    this.reserveShopTimeMin = this.appService.reserveDate();
    // 获取快递到家赠品
    this.getUnhandleExpressGiftList();
  }
  //回到顶部
  scrollToTop() {
    this.content.scrollTo(0, 0, 0);
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
    let url = `${AppConfig.API.getGiftList}?type=1&start=${this.start}&limit=${this.limit}`;
    this.appService.httpGet(url).then(data => {
      this.loadingShow = false;
      this.events.publish('express:created',data.count, Date.now());
      if (this.start < data.count) {
        this.showNoMore = false;
        this.noData = false;
        this.start += this.limit;
        this.showInfinite = true;
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
      if (error.error != "invalid_token") {
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
  goExpressgift() {
    const orderModal = this.modalCtrl.create(HandleExpressgift);
    orderModal.onDidDismiss(() => {
      // 返回自提赠品页重新请求接口，渲染页面
      this.start = 0;
      this.down = true;
      this.up = false;
      this.scrollToTop();
      this.getUnhandleExpressGiftList();
    })
    orderModal.present();
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
        if(error.error != "invalid_token") {
          this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
        }
      });
    } else if (data.companyName != "") {
      this.appService.toast('请填写快递单号', 1000, 'middle');
    } else if (data.orderNum != "") {
      this.appService.toast('请填写公司名称', 1000, 'middle');
    }
  }
  // 下拉刷新请求数据
  doRefresh(refresher) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.requestDefeat = false;
    setTimeout(() => {
      this.getUnhandleExpressGiftList();
      refresher.complete();
    }, AppConfig.LOAD_TIME);
    this.showNoMore = false;
  }
  // 上拉刷新请求数据
  loadMore(infiniteScroll) {
    let url = `${AppConfig.API.getGiftList}?type=1&start=${this.start}&limit=${this.limit}`;
    this.appService.httpGet(url).then(data => {
      if (data.count == 0) {
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
      infiniteScroll.complete();
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.loadMore(infiniteScroll);
      });
      if (error.error != "invalid_token") {
        infiniteScroll.complete();
        console.log(error);
        this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
      }
    });
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
  requestDefeatRefreshExpressGift() {
    this.requestDefeat = false;
    this.loadingShow = true;
    this.start = 0;
    this.down = true;
    this.up = false;
    this.getUnhandleExpressGiftList();
  }

}
