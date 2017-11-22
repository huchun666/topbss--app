import { Injectable } from '@angular/core';
import { LoadingController, Loading, ToastController } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';

@Injectable()
export class AppConfig {

  //域名基地址
  static hostUrl: string = "http://192.168.31.202:6333";

  //请求超时时间
  static TIME_OUT: number = 30000;

  //获取token的url
  static oauthTokenUrl: string = "/uaa/oauth/token";

  //接口url
  static API: any = {
    login: "/demo-resource-server/me",
    getOrderList: "/rest/order/bssList",    //门店/导购员订单列表
    getCancelorder: "/rest/order/cancel/list",    //待审核/已审核取消订单列表
    auditCancelOrder: "/rest/order/cancel/approval",    //审核取消订单
    getReturnorderList: '/rest/order/return/list',    //未处理/已处理退货订单列表
    returnDetail: '/rest/order/return/details',    //退货订单详情
    returnReceived: '/rest/order/return/received',    // 退货-确认收货
    auditReturnOrder: '/rest/order/return/approval',    //审核退货订单
    getGiftList: "/promotion/member/gift/account/getGiftList",//各种赠品列表
    getUnhandleGiftCount: "/promotion/member/gift/account/getUnhandleGiftCount",//待处理自提订单列表
    confirmReserveShopTime: "/promotion/member/gift/account/confirmReserveShopTime",//确认预约时间
    confirmExpressInfo: "/promotion/member/gift/account/confirmExpressInfo",//确认发货
    getBrandshopProducts: "/product/getBrandshopProducts",//商品列表
    warehouseGetCount: "/rest/order/warehouse/getCount",//查看配单仓订单总数
    getProductSkuWithDefault: "/product/getProductSkuWithDefault",//SKU初始加载
    getValidSKUAttrValue: "/product/getValidSKUAttrValue",//SKU切换
    warehouseAdd: "/rest/order/warehouse/add",//添加配单行接口
    warehouseList: "/rest/order/warehouse/list",//查看配单仓列表接口
    warehouseGenerateCode: "/rest/order/warehouse/generateCode",//生成订单付款码接口
    warehouseDeleteById: "/rest/order/warehouse/item/deleteById",//删除单个配单行
    warehouseUpdate: "/rest/order/warehouse/item/update",//修改配单行接口
    warehouseEmpty: "/rest/order/warehouse/empty",//清空配单仓接口
    current: "/brandshop/user/current", //查询当前导购员基本信息
    account: "/brandshop/user/account", //查询当前导购员基本信息
    withdraw: "/brandshop/user/withdraw/", //提现
    qrcode: "/brandshop/user/qrcode", //我的二维码
    withdrawList: "/brandshop/user/withdraw/list", //提现记录
    bonusList: "/brandshop/user/bonus/list" //查询可提现余额明显、审核中余额明细
  };

  //ion-spinner
  static load: any = {
    spinner: 'dots',
    content: '加载中'
  }

}
@Injectable()
export class AppService {

  constructor(
    private http: Http,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private dialogs: Dialogs
  ) {

  }

  //get request
  httpGet(url: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url, {headers: headers}).timeout(AppConfig.TIME_OUT).toPromise()
      .then(res => res.json())
      .catch(error => {
        console.log(`访问错误:${error}`);
        this.handleError(error);
      });
  }

  //get request
  httpGetReturnData(url: string) {
    return this.http.get(url).timeout(AppConfig.TIME_OUT).toPromise()
      .then(res => res)
      .catch(error => {
        console.log(`访问错误:${error}`);
        this.handleError(error);
      }
    );
  }

  //get request with headers
  httpGetHeader(url: string, header: any) {
    return this.http.get(url, {headers: header}).timeout(AppConfig.TIME_OUT).toPromise()
      .then(res => res.json())
      .catch(error => {
        console.log(`访问错误:${error}`);
        this.handleError(error);
      }
    );
  }
  
  //post request
  httpPost(url: string, body: any) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url, body, {headers: headers}).timeout(AppConfig.TIME_OUT).toPromise()
      .then(res => res.json())
      .catch(error => {
        console.log(`访问错误:${error}`);
        this.handleError(error);
      }
      );
  }

  //post 带有headers 
  httpPostHeader(url: string, body: any, header: any) {
    return this.http.post(url, body, {headers: header}).timeout(AppConfig.TIME_OUT).toPromise()
      .then(res => res.json())
      .catch(error => {
        console.log(`访问错误:${error}`);
        this.handleError(error);
      }
    );
  }
  
  //put request
  httpPut(url: string, parameters: any) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(url, parameters, {headers: headers}).timeout(AppConfig.TIME_OUT).toPromise()
      .then(res => res.json())
      .catch(error => {
        console.log(`访问错误:${error}`);
        this.handleError(error);
      }
      );
  }

  //delete request
  httpDelete(url: string) {
    return this.http.delete(url).timeout(AppConfig.TIME_OUT).toPromise()
      .then(res => res.json())
      .catch(error => {
        console.log(`访问错误:${error}`);
        this.handleError(error);
      }
      );
  }

  //错误或者异常处理提示
  private handleError(error: Response) {
    this.alert("提示", error.toString());
    return Observable.throw(error.status || "服务错误");
  }

  //弹出提示信息
  public alert(msg: string, title?: string) {
    if (!title) {
      title = '提示';
    }
    this.dialogs.alert(msg, title);
  }

  //加载中的友好提示loader.present();
  public loading(): Loading {
    let loader = this.loadingCtrl.create({
      spinner: "dots",
      content: "加载中...",
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

}