import { Component, ViewChild, NgZone } from '@angular/core';
import { NavParams, Content, ModalController } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
import { HandleSelfgift } from '../handle-selfgift/handle-selfgift';

@Component({
  selector: 'page-unhandle-self',
  templateUrl: 'unhandle-self.html',
})
export class UnhandleSelfPage {

  @ViewChild(Content) content: Content;
  selfGiftCount: string;
  unhandleSeflGiftArray: any = [];
  limit: number = 10;
  up: Boolean;
  down: Boolean;
  noData: Boolean = false;
  start: number = 0;
  showNoMore: Boolean = false;
  load: any = {};
  loadingShow: Boolean = true;
  reserveShopTimeMin: string = '';
  toTop: Boolean;//是否显示返回顶部按钮
  requestDefeat: Boolean = false;
  showInfinite: Boolean = false;
  constructor(
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
    // 获取快递到家赠品
    this.getUnhandleSelfGiftList();
  }
  ionViewDidEnter() {
  }
  //回到顶部
  scrollToTop() {
    this.content.scrollTo(0, 0, 0);
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
  // 查看已完成的自提
  goSelfgift() {
    const orderModal = this.modalCtrl.create(HandleSelfgift);
    orderModal.onDidDismiss(() => {
      // 返回自提赠品页重新请求接口，渲染页面
      this.start = 0;
      this.down = true;
      this.up = false;
      this.scrollToTop();
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
        loading.dismiss();
        console.log(error.message);
        if (error.error != "invalid_token") {
          this.appService.toast('操作失败，请稍后重试', 1000, 'middle');
        }
      });
    } else {
      this.appService.toast('请选择会员预约到店时间', 1000, 'middle');
    }
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
  // 下拉刷新请求数据
  doRefresh(refresher) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.requestDefeat = false;
    setTimeout(() => {
      this.getUnhandleSelfGiftList();
      refresher.complete();
    }, AppConfig.LOAD_TIME);
    this.showNoMore = false;
  }
  // 上拉刷新请求数据
  loadMore(infiniteScroll) {
    let url = `${AppConfig.API.getGiftList}?type=0&start=${this.start}&limit=${this.limit}`;
    this.appService.httpGet(url).then(data => {
      if (data.data.length != 0) {
        this.unhandleSeflGiftArray.push(...data.data);
        this.start += this.limit;
        this.addOrderStatusClass(this.unhandleSeflGiftArray);
      } else {
        this.showNoMore = true;
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
  requestDefeatRefreshSelfGift() {
    this.requestDefeat = false;
    this.loadingShow = true;
    this.start = 0;
    this.down = true;
    this.up = false;
    this.getUnhandleSelfGiftList();
  }


}
