import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'page-brandshop-order-pay',
  templateUrl: 'brandshop-order-pay.html',
})
export class BrandshopOrderPayPage {
  @ViewChild(Content) content: Content;
  isShowDetail = [];
  orderList = [];
  pageSize: number = 10;
  paramsDate: string = '';
  noData: Boolean = false;
  start: number = 0;
  showNoMore: Boolean = false;
  loadingShow: Boolean = true;
  load: any = {};
  requestDefeat: Boolean = false;
  showInfinite: Boolean = true;
  up: Boolean = false;//上拉刷新和第一次进入页面时
  down: Boolean = true;//下拉刷新和返回上一级页面时
  constructor(
    public navCtrl: NavController,
    public appService: AppService) {
    this.load = AppConfig.load;
    this.appService.eventBrand.subscribe((data) => {
      this.getOrderListByDate(data);
    })
  }
  // 获取订单列表
  getOrderList() {
    this.loadingShow = true;
    this.noData = false;
    this.requestDefeat = false;
    this.showNoMore = false;
    this.showInfinite = true;
    var url = `${AppConfig.API.getOrderList}?status=0&start=${this.start}&limit=${this.pageSize}`;
    if (this.paramsDate != '')
      url += this.paramsDate;
    this.appService.httpGet(url).then(data => {
      this.loadingShow = false;
      this.orderList = [];
      if (this.start < data.count) {
        this.showNoMore = false;
        this.noData = false;
        this.start += this.pageSize;
        this.showInfinite = true;
        if (this.up) {
          this.orderList.push(...data.data);
          for (let i = 0; i < this.orderList.length; i++) {
            this.isShowDetail[i] = false;
          }
        } else if (this.down) {
          this.orderList = data.data;
          for (let i = 0; i < this.orderList.length; i++) {
            this.isShowDetail[i] = false;
          }
        }
      } else if (data.count == 0) {
        this.noData = true;
        this.showNoMore = false;
        this.orderList = [];
      } else if (data.data.length == 0) {
        this.noData = false;
        this.showNoMore = true;
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getOrderList();
      });
      this.orderList = [];
      this.loadingShow = false;
      if(error.error != "invalid_token") {
        this.showInfinite = false;
        this.requestDefeat = true;
      }
      console.log(error);
    })
  }
  // 选中时间获取订单
  getOrderListByDate(date) {
    this.start = 0;
    this.paramsDate = '';
    if (date.dateStart != '') {
      this.paramsDate += `&startTime=${date.dateStart}`;
    }
    if (date.dateEnd != '') {
      this.paramsDate += `&endTime=${date.dateEnd}`;
    }
    this.content.scrollTo(0, 0, 0);
    this.getOrderList();
  }
  // 是否显示明细
  showDetail(index) {
    this.isShowDetail[index] = !this.isShowDetail[index];
  }
  // 下拉刷新请求数据
  doRefresh(refresher) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.requestDefeat = false;
    setTimeout(() => {
      this.getOrderList();
      refresher.complete();
    }, AppConfig.LOAD_TIME);
    this.showNoMore = false;
  }
  // 上拉加载更多 请求数据
  loadMore(infiniteScroll) {
    var url = `${AppConfig.API.getOrderList}?status=0&start=${this.start}&limit=${this.pageSize}`;
    if (this.paramsDate != '')
      url += this.paramsDate;
    this.appService.httpGet(url).then(data => {
      if (this.start < data.count) {
        this.orderList.push(...data.data);
        this.start += this.pageSize;
        for (let i = 0; i < this.orderList.length; i++) {
          this.isShowDetail[i] = false;
        }
      } else if (data.data.length == 0) {
        this.showInfinite = false;
        this.showNoMore = true;
      }
      infiniteScroll.complete();
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.loadMore(infiniteScroll);
      });
      if(error.error != "invalid_token") {
        infiniteScroll.complete();
        this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
      }
      console.log(error);
    })
  }
  //请求失败后刷新
  requestDefeatRefresh() {
    this.requestDefeat = false;
    this.loadingShow = true;
    this.start = 0;
    this.orderList = [];
    this.getOrderList();
  }
}
