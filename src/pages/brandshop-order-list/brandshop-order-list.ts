import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'order-list',
  templateUrl: 'brandshop-order-list.html'
})
export class BrandshopOrderList {
  @ViewChild(Content) content: Content;
  dateStart: string = '';
  dateEnd: string = '';
  isShowDetail = [];
  orderList = [];
  orderStatusList: any;
  currentStatus: any;
  pageSize: number = 10;
  paramsStatus: string = '';
  paramsDate: string = '';
  noData: Boolean = false;
  start: number = 0;
  showNoMore: Boolean = false;
  loadingShow: Boolean = true;
  load: any = {};
  dateEndMin = '1970'; //结束日期的最小值
  dateEndMax: string = ''; //结束日期的最大值
  dateStartMax: string = ''; //开始日期的最大值
  requestDefeat: Boolean = false;
  showInfinite: Boolean = true;
  up: Boolean = false;//上拉刷新和第一次进入页面时
  down: Boolean = true;//下拉刷新和返回上一级页面时
  constructor(
    public navCtrl: NavController,
    public appService: AppService) {
    this.orderStatusList = [{
      label: "全部",
      status: 'all'
    }, {
      label: "待支付",
      status: '0'
    }, {
      label: "已收货",
      status: '3'
    }, {
      label: "已取消",
      status: '4'
    }, {
      label: "取消中",
      status: '6'
    }, {
      label: "已完成",
      status: 'C'
    }];
    this.currentStatus = this.orderStatusList[0].status;
    this.load = AppConfig.load;
    this.dateStartMax = this.appService.reserveDate();
    this.dateEndMax = this.appService.reserveDate();
    this.getOrderList();
  }
  // 获取订单列表
  getOrderList() {
    this.loadingShow = true;
    this.noData = false;
    this.requestDefeat = false;
    this.showNoMore = false;
    this.showInfinite = true;
    var url = `${AppConfig.API.getOrderList}?start=${this.start}&limit=${this.pageSize}`;
    if (this.paramsDate != '')
      url += this.paramsDate;
    if (this.paramsStatus != '')
      url += this.paramsStatus;
    this.appService.httpGet(url).then(data => {
      this.loadingShow = false;
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
      if(error.error != "invalid_token") {
        this.loadingShow = false;
        this.requestDefeat = true;
      }
      console.log(error);
    })
  }
  // 选中时间获取订单
  getOrderListByDate() {
    this.start = 0;
    this.paramsDate = '';
    this.orderList = [];
    if (this.dateStart != '') {
      this.paramsDate += `&startTime=${this.dateStart}`;
      this.dateEndMin = this.dateStart;
    }
    if (this.dateEnd != '') {
      this.paramsDate += `&endTime=${this.dateEnd}`;
      this.dateStartMax = this.dateEnd;
    }
    this.content.scrollTo(0, 0, 0);
    this.getOrderList();
  }
  // 点击状态时切换，获取当前订单状态
  getCurrentStatus(index) {
    this.start = 0;
    this.paramsStatus = '';
    this.orderList = [];
    this.currentStatus = this.orderStatusList[index].status
    if (this.orderStatusList[index].status != 'all') {
      this.paramsStatus += '&status=' + this.currentStatus
    }
    this.content.scrollTo(0, 0, 0);
    this.getOrderList();
  }
  // 是否显示明细
  showDetail(index) {
    this.isShowDetail[index] = !this.isShowDetail[index];
  }
  // 进入门店所有订单
  goBrandshoOrder() {
    this.navCtrl.push(BrandshopOrderList);
  }
  // 清除开始日期
  clearDateStart() {
    this.dateStart = '';
    this.dateEndMin = '1970';
  }
  // 清除结束日期
  clearDateEnd() {
    this.dateEnd = '';
    this.dateStartMax = this.appService.reserveDate();
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
    var url = `${AppConfig.API.getOrderList}?start=${this.start}&limit=${this.pageSize}`;
    if (this.paramsDate != '')
      url += this.paramsDate;
    if (this.paramsStatus != '')
      url += this.paramsStatus;
    this.appService.httpGet(url).then(data => {
      infiniteScroll.complete();
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
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.loadMore(infiniteScroll);
      });
      if(error.error != "invalid_token") {
        this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
        infiniteScroll.complete();
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