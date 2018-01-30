import { Component, ViewChild} from '@angular/core';
import { NavController, Content, Events } from 'ionic-angular';
import { BrandshopOrderList } from '../brandshop-order-list/brandshop-order-list';
import { AppService, AppConfig } from '../../app/app.service';
import { OrderListAllPage } from '../order-list-all/order-list-all';
import { OrderListCanceledPage } from '../order-list-canceled/order-list-canceled';
import { OrderListFinishedPage } from '../order-list-finished/order-list-finished'; 
import { OrderListPayPage } from '../order-list-pay/order-list-pay';
import { OrderListReceiptPage } from '../order-list-receipt/order-list-receipt';
@Component({
  selector: 'order-list',
  templateUrl: 'order-list.html'
})

export class OrderList {
  @ViewChild(Content) content: Content;
  all: any = OrderListAllPage;
  pay: any = OrderListPayPage;
  receipt: any = OrderListReceiptPage;
  canceled: any = OrderListCanceledPage;
  finished: any = OrderListFinishedPage;
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
  up: Boolean = false;//上拉刷新和第一次进入页面时
  down: Boolean = true;//下拉刷新和返回上一级页面时
  dateEndMin = '1970'; //结束日期的最小值
  dateEndMax: string; //结束日期的最大值
  dateStartMax: string; //开始日期的最大值
  requestDefeat: Boolean = false;
  showInfinite: Boolean = true;
  date: any = {
    dateStart: '',
    dateEnd: ''
  }
  param: any;
  constructor(
    public navCtrl: NavController,
    public appService: AppService,
    public events: Events,
  ) {
    this.load = AppConfig.load;
  }
  // 每次进入页面的时候都会执行
  ionViewDidEnter(){
    this.dateStart = '';
    this.dateEnd = '';
    this.date.dateStart = this.dateStart;
    this.date.dateEnd = this.dateEnd;
    this.appService.event.emit(this.date);
    this.dateStartMax = this.appService.reserveDate();
    this.dateEndMax = this.appService.reserveDate();
  }
  // 进入门店所有订单
  goBrandshoOrder() {
    this.orderList = [];
    this.navCtrl.push(BrandshopOrderList);
  }

  // 通过日期获取订单
  getOrderListByDate() {
    if (this.dateStart != '') {
      this.date.dateStart = this.dateStart;
      this.appService.event.emit(this.date);
      this.dateEndMin = this.dateStart;
    }
    if (this.dateEnd != '') {
      this.date.dateEnd = this.dateEnd;
      this.appService.event.emit(this.date);
      this.dateStartMax = this.dateEnd;
    }
  }
  // 清除开始日期
  clearDateStart() {
    this.dateStart = '';
    this.date.dateStart = '';
    this.appService.event.emit(this.date);
    this.dateEndMin = '1970';
  }
  // 清除结束日期
  clearDateEnd() {
    this.dateEnd = '';
    this.date.dateEnd = '';
    this.appService.event.emit(this.date);
    this.dateStartMax = this.appService.reserveDate();;
  }

  onTabSelect() {
    this.date.dateStart = this.dateStart;
    this.date.dateEnd = this.dateEnd;
    this.appService.event.emit(this.date);
  }
}