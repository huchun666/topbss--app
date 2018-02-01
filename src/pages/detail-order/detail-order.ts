import { NavController, NavParams, ViewController, Platform, Content } from 'ionic-angular';
import { Component, ViewChild, } from '@angular/core';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'page-detail-order',
  templateUrl: 'detail-order.html',
})
export class DetailOrderPage {
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
    this.load = AppConfig.load;
    this.getOrderDetail();
    this.getBonusSum();
  }
  getOrderDetail() {
    this.loadingShow = true;
    this.showNoMore = false;
    this.noData = false;
    this.requestDefeat = false;
    let url = `${AppConfig.API.bonusList}?typeList=1,6&statusList=2&start=${this.start}&limit=${this.pageSize}`;
    this.appService.httpGet(url)
      .then(data => {
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
  getBonusSum() {
    let url = `${AppConfig.API.bonusSum}?typeList=1,6&statusList=2`;
    this.appService.httpGet(url)
      .then(data => {
        this.sum = data.sum;
        this.setIsShow(this.sum);
      }).catch(error => {
        this.appService.getToken(error, () => {
          this.getBonusSum();
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
    let url = `${AppConfig.API.bonusList}?typeList=1,6&statusList=2&start=${this.start}&limit=${this.pageSize}`;
    this.appService.httpGet(url)
      .then(data => {
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
        infiniteScroll.complete();
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
  /** 下拉刷新页面 **/
  pullRefresh(refresher) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.requestDefeat = false;
    setTimeout(() => {
      this.getOrderDetail();
      this.getBonusSum();
      refresher.complete();
    }, AppConfig.LOAD_TIME);
    this.showNoMore = false;
  }
}
