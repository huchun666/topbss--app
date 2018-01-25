import { NavController, NavParams, ViewController, Platform, Content } from 'ionic-angular';
import { Component, ViewChild, } from '@angular/core';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  templateUrl: 'detail-tabs.html',
  selector: 'withdraw-detailTabs'
})
export class DetailTabs {
  @ViewChild(Content) content: Content;
  statusList = [];
  pageSize: number = 10;
  currentPage: number = 1;
  currentStatus: number = 0;
  orderDetail: any = [];
  awardDetail: any = [];
  count: number = 0;
  start: number = 0;
  sum1: any;
  sum2: any;
  sum: any;
  up: Boolean = false;
  down: Boolean = true;
  isShow: boolean = false;
  isEmpty: boolean = false;
  requestFail: boolean = false;
  isRefresh: boolean = true;
  isLoadingShow: boolean = false;
  showNoMore: Boolean = false;
  load: any = {};
  loadingShow: Boolean = true;
  noData: Boolean = false;
  requestDefeat: Boolean = false;
  showInfinite: Boolean = false;
  limit = 10;
  constructor(public navController: NavController, public navParams: NavParams, public viewController: ViewController, public platform: Platform, public appService: AppService) {
    this.statusList = [{
      label: "订单处理金额明细",
      status: 0
    }, {
      label: "奖励活动金额明细",
      status: 1
    }];
    this.load = AppConfig.load;
    this.getOrderDetail();
    this.getBonusSum1();
  }
  getCurrentStatus(i) {
    this.start = 0;
    this.up = false;
    this.down = true;
    this.currentStatus = this.statusList[i].label;
    this.currentStatus = i;
    this.content.scrollTo(0, 0, 0);
    if (this.currentStatus == 0) {
      this.getOrderDetail();
      this.getBonusSum1();
    } else {
      this.getAwardDetail();
      this.getBonusSum2();
    }
  }
  getOrderDetail() {
    this.loadingShow = true;
    this.showNoMore = false;
    this.noData = false;
    this.requestDefeat = false;
    let url = `${AppConfig.API.bonusList}?typeList=1,6&statusList=2&start=${this.start}&limit=${this.pageSize}`;
    this.appService.httpGet(url).then(data => {
      this.loadingShow = false;
      if (this.start < data.count) {
        this.showNoMore = false;
        this.noData = false;
        this.start += this.limit;
        this.showInfinite = true;
        if (this.up) {
          data.data.map(item => {
            item.baseAmount = item.baseAmount.toFixed(2);
            item.percent = item.percent;
            item.amount = item.amount.toFixed(2);
            item.returnAmount = item.returnAmount.toFixed(2);
          });
          this.orderDetail.push(...data.data);
        } else if (this.down) {
          data.data.map(item => {
            item.baseAmount = item.baseAmount.toFixed(2);
            item.percent = item.percent;
            item.amount = item.amount.toFixed(2);
            item.returnAmount = item.returnAmount.toFixed(2);
          });
          this.orderDetail = data.data;
        }
      } else if (data.count == 0) {
        this.noData = true;
        this.showNoMore = false;
        this.orderDetail = [];
      } else if (data.data.length == 0) {
        this.noData = false;
        this.showNoMore = true;
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getOrderDetail();
      });
      console.log(error);
      this.isEmpty = false;
      this.isLoadingShow = false;
      if (error.error != "invalid_token") {
        this.requestFail = true;
      }
    });
  }
  /** 获取总金额 **/
  getBonusSum1() {
    let url = `${AppConfig.API.bonusSum}?typeList=1,6&statusList=2`;
    this.appService.httpGet(url).then(data => {
      this.sum = data.sum;
      this.setIsShow(this.sum);
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getBonusSum1();
      });
      console.log(error);
    });
  }
  getAwardDetail() {
    this.loadingShow = true;
    this.showNoMore = false;
    this.noData = false;
    this.requestDefeat = false;
    let url = `${AppConfig.API.bonusList}?typeList=3,4&statusList=2&start=${this.start}&limit=${this.pageSize}`;
    this.appService.httpGet(url).then(data => {
      this.loadingShow = false;
      if (this.start < data.count) {
        this.showNoMore = false;
        this.noData = false;
        this.start += this.limit;
        this.showInfinite = true;
        if (this.up) {
          data.data.map(item => {
            item.baseAmount = item.baseAmount.toFixed(2);
            item.percent = item.percent;
            item.amount = item.amount.toFixed(2);
            item.returnAmount = item.returnAmount.toFixed(2);
          });
          this.awardDetail.push(...data.data);
        } else if (this.down) {
          data.data.map(item => {
            item.baseAmount = item.baseAmount.toFixed(2);
            item.percent = item.percent;
            item.amount = item.amount.toFixed(2);
            item.returnAmount = item.returnAmount.toFixed(2);
          });
          this.awardDetail = data.data;
        }
      } else if (data.count == 0) {
        this.noData = true;
        this.showNoMore = false;
        this.awardDetail = [];
      } else if (data.data.length == 0) {
        this.noData = false;
        this.showNoMore = true;
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getAwardDetail();
      });
      console.log(error);
      this.isEmpty = false;
      this.isLoadingShow = false;
      if (error.error != "invalid_token") {
        this.requestFail = true;
      }
    });
  }
  /** 获取总金额 **/
  getBonusSum2() {
    let url = `${AppConfig.API.bonusSum}?typeList=3,4&statusList=2`;
    this.appService.httpGet(url).then(data => {
      this.sum = data.sum;
      this.setIsShow(this.sum);
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getBonusSum2();
      });
      console.log(error);
    });
  }
  /** 有无明细列表时的判断（判断总金额是否为0）**/
  setIsShow(sum) {
    return this.isShow = sum > 0 ? true : false;
  }
  /** 上拉翻页 **/
  loadMore(infiniteScroll) {
    if (this.currentStatus == 0) {
      let url = `${AppConfig.API.bonusList}?typeList=1,6&statusList=2&start=${this.start}&limit=${this.pageSize}`;
      this.appService.httpGet(url).then(data => {
        infiniteScroll.complete();
        if (data.data.length != 0) {
          data.data.map(item => {
            item.baseAmount = item.baseAmount.toFixed(2);
            item.percent = item.percent;
            item.amount = item.amount.toFixed(2);
            item.returnAmount = item.returnAmount.toFixed(2);
          });
          this.orderDetail.push(...data.data);
          this.start += this.limit;
        } else {
          this.showNoMore = true;
        }
      }).catch(error => {
        this.appService.getToken(error, () => {
          this.loadMore(infiniteScroll);
        });
        console.log(error);
        this.isEmpty = false;
        this.isLoadingShow = false;
        if (error.error != "invalid_token") {
          this.requestFail = true;
        }
      });
    } else {
      let url = `${AppConfig.API.bonusList}?typeList=3,4&statusList=2&start=${this.start}&limit=${this.pageSize}`;
      this.appService.httpGet(url).then(data => {
        infiniteScroll.complete();
        if (data.data.length != 0) {
          data.data.map(item => {
            item.baseAmount = item.baseAmount.toFixed(2);
            item.percent = item.percent;
            item.amount = item.amount.toFixed(2);
            item.returnAmount = item.returnAmount.toFixed(2);
          });
          this.awardDetail.push(...data.data);
          this.start += this.limit;
        } else {
          this.showNoMore = true;
        }
      }).catch(error => {
        this.appService.getToken(error, () => {
          this.loadMore(infiniteScroll);
        });
        console.log(error);
        this.isEmpty = false;
        this.isLoadingShow = false;
        if (error.error != "invalid_token") {
          this.requestFail = true;
        }
      });
    }
  }
  /** 下拉刷新页面 **/
  pullRefresh(refresher) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.requestDefeat = false;
    setTimeout(() => {
      if (this.currentStatus == 0) {
        this.getOrderDetail();
        this.getBonusSum1();
      } else {
        this.getAwardDetail();
        this.getBonusSum2();
      }
      refresher.complete();
    }, AppConfig.LOAD_TIME);
    this.showNoMore = false;
  }
}