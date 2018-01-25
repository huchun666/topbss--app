import { Component } from '@angular/core';
import { AppService, AppConfig } from '../../app/app.service';
import CryptoJS from 'crypto-js';
import Base64 from 'js-base64';
@Component({
  selector: 'mycode',
  templateUrl: 'mycode.html'
})
export class MyCode {
  btnText: string = "查看门店二维码";
  isShow: boolean = false;
  myCode: string = "";
  brandshopIndexUrl: string = "";
  constructor(
    public appService: AppService
  ) {
    this.getParams();
  }
  // 是否显示门店二维码
  showBrandshopCode() {
    this.isShow = !this.isShow;
    this.btnText = !this.isShow ? "查看门店二维码" : "收起门店二维码";
  }
  //获取门店二维码，以及导购员参数
  getParams() {
    let obj = this.restFulSha("GET", "/topbaby/restful/wechat/qrCode/getQRCodeUrl", "bsSecret2017");
    let url = AppConfig.API.qrcode;
    this.appService.httpGet(url)
      .then(data => {
        this.brandshopIndexUrl = `${data.brandshopIndexUrl}?id=${data.brandshopId}`;
        let myCodeUrl = `${data.userRecommendWechatQrCodeUrl}?type=U&userId=${data.brandshopUserId}&accessKeyId=topbabyBs&signature=${obj.signature}&expires=${obj.expires}`;
        this.getMyQRcode(myCodeUrl);
      })
      .catch(error => {
        this.appService.getToken(error, () => {
          this.getParams();
        });
        console.log(error);
      });
  }
  // 获取导购员带参二维码
  getMyQRcode(paramUrl) {
    this.appService.httpGetNoAuthor(paramUrl)
      .then(data => {
        this.myCode = data.url;
      })
      .catch(error => {
        this.appService.getToken(error, () => {
          this.getMyQRcode(paramUrl);
        });
        console.log(error);
      });
  }
  /** 获取时间 **/
  getNowUtcTime() {
    let date = new Date();
    let nowYear = date.getFullYear();
    let nowMoth = date.getMonth() + 1;
    let nowDay = date.getDate();
    let nowHour = date.getHours();
    let nowMinute = date.getMinutes();
    let nowSecond = date.getSeconds();
    let expired = Date.UTC(nowYear, nowMoth, nowDay, nowHour, nowMinute + 10, nowSecond) + '';
    return Number(expired.substr(0, 10));
  }
  // 加密
  restFulSha(RequestMethod, url, topbabysecret) {
    let expired = this.getNowUtcTime();
    url = RequestMethod + "\n" + url + "\n" + expired + "\n";
    let signature = CryptoJS.HmacSHA1(url, topbabysecret);
    signature = Base64.Base64.encode(signature);
    let obj = {
      expires: expired,
      signature: signature
    }
    return obj;
  }
}
