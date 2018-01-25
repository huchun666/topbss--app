import { Component } from '@angular/core';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'audit-cancelorder',
  templateUrl: 'audit-cancelorder.html'
})
export class AuditCancelorder {
  auditCancelorderArray: any = [];
  currentPage: number = 1;
  limit: number = 10;
  up: Boolean = true;//上拉刷新和第一次进入页面时
  down: Boolean = false;//下拉刷新和返回上一级页面时
  noData: Boolean = false;
  start: number = 0;
  showNoMore: Boolean = false;
  load: any = {};
  loadingShow: Boolean = true;
  requestDefeat: Boolean = false;
  showInfinite: Boolean = false;
  constructor(
    public appService: AppService) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.load = AppConfig.load;
    this.getAuditCancelorder();
  }
  getAuditCancelorder() {
    // 待审核已取消订单 请求数据
    let url = `${AppConfig.API.getCancelorder}?deliveryType=1&status=1&start=${this.start}&limit=${this.limit}`;
    this.appService.httpGet(url).then(data => {
      this.loadingShow = false;
      if (data.count == 0 && this.auditCancelorderArray.length == 0) {
        //空空如也
        this.noData = true;
      } else {
        this.noData = false;
        this.showInfinite = true;
        if (this.start < data.count) {
          if (this.up) {
            this.auditCancelorderArray.push(...data.data);
            this.start += this.limit;
          } else if (this.down) {
            this.auditCancelorderArray = data.data;
            this.start += this.limit;
          }
        } else {
          this.showNoMore = true;
        }
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getAuditCancelorder();
      });
      this.auditCancelorderArray = [];
      this.loadingShow = false;
      console.log(error);
      if(error.error != "invalid_token") {
        this.showInfinite = false;
        this.requestDefeat = true;
      }
    });
  }
  // 下拉刷新请求数据
  refreshGetSelfGiftList(refresher) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.showNoMore = false;
    this.showInfinite = true;
    let url = `${AppConfig.API.getCancelorder}?deliveryType=1&status=1&start=${this.start}&limit=${this.limit}`
    this.appService.httpGet(url).then(data => {
      refresher.complete();
      if (data.count == 0) {
        //空空如也
        this.noData = true;
      } else {
        this.noData = false;
        this.showInfinite = true;
        if (data.data.length != 0) {
          this.auditCancelorderArray = data.data;
          this.start += this.limit;
        } else {
          this.showNoMore = true;
        }
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.refreshGetSelfGiftList(refresher);
      });
      this.auditCancelorderArray = [];
      refresher.complete();
      console.log(error);
      if(error.error != "invalid_token") {
        this.showInfinite = false;
        this.requestDefeat = true;
      }
    });
  }
  // 上拉刷新请求数据
  infiniteGetSelfGiftList(infiniteScroll) {
    this.down = false;
    this.up = true;
    let url = `${AppConfig.API.getCancelorder}?deliveryType=1&status=1&start=${this.start}&limit=${this.limit}`
    this.appService.httpGet(url).then(data => {
      if (data.count == 0) {
        //空空如也
        this.noData = true;
      } else {
        this.noData = false;
        if (data.data.length != 0) {
          this.auditCancelorderArray.push(...data.data);
          this.start += this.limit;
        } else {
          this.showNoMore = true;
        }
      }
      infiniteScroll.complete();
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.infiniteGetSelfGiftList(infiniteScroll);
      });
      console.log(error);
      if(error.error != "invalid_token") {
        infiniteScroll.complete();
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
    this.getAuditCancelorder();
  }
}
