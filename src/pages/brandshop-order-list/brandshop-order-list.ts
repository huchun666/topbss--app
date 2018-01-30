import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
import { BrandshopOrderAllPage } from '../brandshop-order-all/brandshop-order-all';
import { BrandshopOrderCanceledPage } from '../brandshop-order-canceled/brandshop-order-canceled';
import { BrandshopOrderCancelingPage } from '../brandshop-order-canceling/brandshop-order-canceling';
import { BrandshopOrderFinishedPage } from '../brandshop-order-finished/brandshop-order-finished';
import { BrandshopOrderPayPage } from '../brandshop-order-pay/brandshop-order-pay';
import { BrandshopOrderReceiptedPage } from '../brandshop-order-receipted/brandshop-order-receipted';
@Component({
  selector: 'order-list',
  templateUrl: 'brandshop-order-list.html'
})
export class BrandshopOrderList {
  @ViewChild(Content) content: Content;
  all: any = BrandshopOrderAllPage;
  canceled: any = BrandshopOrderCanceledPage;
  canceling: any = BrandshopOrderCancelingPage;
  finished: any = BrandshopOrderFinishedPage;
  pay: any = BrandshopOrderPayPage;
  receipted: any = BrandshopOrderReceiptedPage;
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
  date: any = {
    dateStart: '',
    dateEnd: ''
  }
  constructor(
    public navCtrl: NavController,
    public appService: AppService) {
    this.load = AppConfig.load;
    this.dateStartMax = this.appService.reserveDate();
    this.dateEndMax = this.appService.reserveDate();
  }
  // 每次进入页面的时候都会执行
  ionViewDidEnter(){
    this.dateStart = '';
    this.dateEnd = '';
    this.date.dateStart = this.dateStart;
    this.date.dateEnd = this.dateEnd;
    this.appService.eventBrand.emit(this.date);
    this.dateStartMax = this.appService.reserveDate();
    this.dateEndMax = this.appService.reserveDate();
  }

  // 选中时间获取订单
  getOrderListByDate() {
    if (this.dateStart != '') {
      this.date.dateStart = this.dateStart;
      this.appService.eventBrand.emit(this.date);
      this.dateEndMin = this.dateStart;
    }
    if (this.dateEnd != '') {
      this.date.dateEnd = this.dateEnd;
      this.appService.eventBrand.emit(this.date);
      this.dateStartMax = this.dateEnd;
    }
  }
  // 进入门店所有订单
  goBrandshoOrder() {
    this.navCtrl.push(BrandshopOrderList);
  }
  // 清除开始日期
  clearDateStart() {
    this.dateStart = '';
    this.date.dateStart = '';
    this.appService.eventBrand.emit(this.date);
    this.dateEndMin = '1970';
  }
  // 清除结束日期
  clearDateEnd() {
    this.dateEnd = '';
    this.date.dateEnd = '';
    this.appService.eventBrand.emit(this.date);
    this.dateStartMax = this.appService.reserveDate();;
  }
  onTabSelect() {
    this.date.dateStart = this.dateStart;
    this.date.dateEnd = this.dateEnd;
    this.appService.eventBrand.emit(this.date);
  }
}