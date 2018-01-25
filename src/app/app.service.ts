import { Injectable } from '@angular/core';
import { LoadingController, Loading, ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';
import { Buffer } from 'buffer';
import { ENV } from '@app/env'

@Injectable()
export class AppConfig {

  //域名基地址
  static mainUrl: string = ENV.mode;
  static hostUrl: string = `https://rest.${AppConfig.mainUrl}`;
  static imgUrl: string = `https://images.${AppConfig.mainUrl}/`;
  //请求超时时间
  static TIME_OUT: number = 30000;
  // 上拉加载、下拉刷新的定时器时间
  static LOAD_TIME: number = 500;
  // 请求token预留时间1800000毫秒（半小时）
  static RESERVED_TIME: number = 1800000;
  //获取token的url
  static oauthTokenUrl: string = `${AppConfig.hostUrl}/uaa/oauth/token`;
  static client_id: string = ENV.client_id;
  static secret: string = ENV.secret;
  static grant_type: string = "password";
  //接口url
  static API: any = {
    login: `${AppConfig.hostUrl}/uaa/user`,
    getOrderList: `${AppConfig.hostUrl}/order/bssList`,    //门店/导购员订单列表
    getCancelorder: `${AppConfig.hostUrl}/order/cancel/list`,    //待审核/已审核取消订单列表
    auditCancelOrder: `${AppConfig.hostUrl}/order/cancel/approval`,    //审核取消订单
    getReturnorderList: `${AppConfig.hostUrl}/order/return/list`,    //未处理/已处理退货订单列表
    returnDetail: `${AppConfig.hostUrl}/order/return/details`,    //退货订单详情
    returnReceived: `${AppConfig.hostUrl}/order/return/received`,    // 退货-确认收货
    auditReturnOrder: `${AppConfig.hostUrl}/order/return/approval`,    //审核退货订单
    getGiftList: `${AppConfig.hostUrl}/promotion/member/gift/account/getGiftList`,//各种赠品列表
    getUnhandleGiftCount: `${AppConfig.hostUrl}/promotion/member/gift/account/getUnhandleGiftCount`,//待处理自提订单列表
    confirmReserveShopTime: `${AppConfig.hostUrl}/promotion/member/gift/account/confirmReserveShopTime`,//确认预约时间
    confirmExpressInfo: `${AppConfig.hostUrl}/promotion/member/gift/account/confirmExpressInfo`,//确认发货
    getBrandshopProducts: `${AppConfig.hostUrl}/product/getBrandshopProducts`,//商品列表
    warehouseGetCount: `${AppConfig.hostUrl}/order/warehouse/getCount`,//查看配单仓订单总数
    getProductSkuWithDefault: `${AppConfig.hostUrl}/product/sku/getProductSkuWithDefault`,//SKU初始加载
    getValidSKUAttrValue: `${AppConfig.hostUrl}/product/sku/getValidSkuAttrValue`,//SKU切换
    warehouseAdd: `${AppConfig.hostUrl}/order/warehouse/add`,//添加配单行接口
    warehouseList: `${AppConfig.hostUrl}/order/warehouse/list`,//查看配单仓列表接口
    warehouseGenerateCode: `${AppConfig.hostUrl}/order/warehouse/generateCode`,//生成订单付款码接口
    warehouseDeleteById: `${AppConfig.hostUrl}/order/warehouse/item/deleteById`,//删除单个配单行
    warehouseUpdate: `${AppConfig.hostUrl}/order/warehouse/item/update`,//修改配单行接口
    warehouseEmpty: `${AppConfig.hostUrl}/order/warehouse/empty`,//清空配单仓接口
    checkStatus: `${AppConfig.hostUrl}/order/warehouse/checkStatus`,//检测配单仓状态接口
    current: `${AppConfig.hostUrl}/account/brandshop/user/current`, //更新当前导购员基本信息
    account: `${AppConfig.hostUrl}/account/brandshop/user/account`, //查询当前导购员基本信息
    withdraw: `${AppConfig.hostUrl}/account/brandshop/user/withdraw/`, //提现
    qrcode: `${AppConfig.hostUrl}/account/brandshop/user/qrcode`, //我的二维码
    withdrawList: `${AppConfig.hostUrl}/account/brandshop/user/withdraw/list`, //提现记录
    bonusList: `${AppConfig.hostUrl}/account/brandshop/user/bonus/list`, //查询可提现余额明显、审核中余额明细
    bonusSum: `${AppConfig.hostUrl}/account/brandshop/user/bonus/sum`,
    untreatedCount: `${AppConfig.hostUrl}/order/untreatedCount`,//查看待处理订单总数
    orderReceive: `${AppConfig.hostUrl}/order/receive/received`, //确定订单
    receiveGift: `${AppConfig.hostUrl}/promotion/member/gift/account/receiveGift`,
    firstLogin: `${AppConfig.hostUrl}/uaa/getInfo`,//查询是否第一次登录
    editPassword: `${AppConfig.hostUrl}/uaa/password`,//更改密码
  };
  // ion-spinner
  static load: any = {
    spinner: 'dots',
    content: '加载中'
  }
}
@Injectable()
export class AppService {
  withTokenHeaders: any;
  oauthTokenHeaders: any;
  constructor(
    private http: Http,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
  }

  //get request with Authorization
  httpGet(url: string) {
    this.withTokenHeaders = new Headers({
      'Authorization': 'Bearer ' + this.getItem('tpb_token')
    });
    return this.http.get(url, { headers: this.withTokenHeaders }).timeout(AppConfig.TIME_OUT).toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  //get request with No Authorization
  httpGetNoAuthor(url: string) {
    return this.http.get(url).timeout(AppConfig.TIME_OUT).toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  //get request
  httpGetReturnData(url: string) {
    this.withTokenHeaders = new Headers({
      'Authorization': 'Bearer ' + this.getItem('tpb_token')
    });
    return this.http.get(url, { headers: this.withTokenHeaders }).timeout(AppConfig.TIME_OUT).toPromise()
      .then(res => res)
      .catch(this.handleError);
  }

  //get request with headers
  httpGetHeader(url: string, header: any) {
    return this.http.get(url, { headers: header }).timeout(AppConfig.TIME_OUT).toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  //post request
  httpPost(url: string, body: any) {
    this.withTokenHeaders = new Headers({
      'Authorization': 'Bearer ' + this.getItem('tpb_token'),
      'content-type': 'application/json'
    });
    return this.http.post(url, body, { headers: this.withTokenHeaders }).timeout(AppConfig.TIME_OUT).toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  //post 带有headers 
  httpPostHeader(url: string, body: any, header: any) {
    return this.http.post(url, body, { headers: header }).timeout(AppConfig.TIME_OUT).toPromise()
      .then(res => res.json());
  }

  //put request
  httpPut(url: string, parameters: any) {
    this.withTokenHeaders = new Headers({
      'Authorization': 'Bearer ' + this.getItem('tpb_token')
    });
    return this.http.put(url, parameters, { headers: this.withTokenHeaders }).timeout(AppConfig.TIME_OUT).toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  //delete request
  httpDelete(url: string) {
    this.withTokenHeaders = new Headers({
      'Authorization': 'Bearer ' + this.getItem('tpb_token')
    });
    return this.http.delete(url, { headers: this.withTokenHeaders }).timeout(AppConfig.TIME_OUT).toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  //access_token过期
  private handleError(error: any) {
    return Promise.reject(error.json() || error);
  }

  getToken(error, callback) {
    let self = this;
    if (error.error == "invalid_token") {
      let base64encode = new Buffer(`${AppConfig.client_id}:${AppConfig.secret}`).toString('base64');
      self.oauthTokenHeaders = new Headers({
        'Authorization': 'Basic ' + base64encode,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      let oauthTokenUrl = AppConfig.oauthTokenUrl;
      let body = `grant_type=refresh_token&refresh_token=${self.getItem("refresh_token")}`;
      self.httpPostHeader(oauthTokenUrl, body, self.oauthTokenHeaders).then(data => {
        let newDateMS = (new Date()).getTime() + data.expires_in * 1000 - AppConfig.RESERVED_TIME;
        self.setItem("newDateMS", newDateMS);
        self.setItem("tpb_token", data.access_token);
        self.setItem("refresh_token", data.refresh_token);
        callback();
      }).catch(err => {
        console.log(err);
        self.toast('登录已过期，请重新登录', 1000, 'middle');
        self.setItem("tpb_token", "");
        self.setItem("refresh_token", "");
        setTimeout(history.go(0), 1000);
      })
    }
  }

  //加载中的友好提示loader.present();
  public loading(): Loading {
    let loader = this.loadingCtrl.create({
      spinner: "dots",
      content: "加载中",
      dismissOnPageChange: true, //切换页面之后关闭loading框
      showBackdrop: false //不显示遮罩层
    });
    return loader;
  }

  // 提示信息
  toast(message: string, duration: number, position: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });
    toast.present();
  }

  //localstorage设置key
  setItem(key: string, value: any) {
    try {
      window.localStorage[key] = value;
    }
    catch (e) {
      console.error("window.localStorage error:" + e);
    }
  }

  //localstorage获取key
  getItem(key: string) {
    try {
      return window.localStorage[key];
    }
    catch (e) {
      console.error("window.localStorage error:" + e);
    }
  }

  // 将日期格式化为yyyy-mm-dd
  reserveDate() {
    let fillZero = (n) => {
      let result = (n).toString().length === 1 ? ('0' + n) : n;
      return result;
    }
    let formatTime = () => {
      let d = new Date();
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let date = d.getDate();
      let result = `${year}-${fillZero(month)}-${fillZero(date)}`;
      return result;
    }
    let res = formatTime();
    return res;
  }
}
