import { Component } from '@angular/core';
import { NavParams, AlertController, ViewController } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'gift-info',
  templateUrl: 'gift-info.html'
})
export class GiftInfo {
  isAllow: boolean = true;
  giftInfo: any = {
    "memberGiftAccountSeq": null,
    "giftSeq": null,
    "giftCode": "",
    "giftName": "",
    "giftType": "",
    "imageName": "",   //赠品图片
    "giftRemark": "",
    "brandshopSeq": null,
    "brandshopName": "",    //门店名称
    "startDate": null,
    "endDate": null,
    "status": "",
    "receiveDate": null,         //领取时间
    "useDate": null,
    "memberSeq": null,
    "memberPhone": null,
    "reservePhone": "",
    "reserveShopTime": null,
    "expressCompany": null,
    "expressNo": null,
    "deliveryTime": null,
    "brandshopUserSeq": null,
    "brandshopUserName": null,
    "attrValueList": null
  };
  constructor(
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public appService: AppService
  ) {
  }
  ionViewDidEnter() {
    this.getGiftDetail();
  }
  presentConfirm() {
    if (!this.isAllow) {
      return;
    }
    this.isAllow = false;
    let url = `${AppConfig.API.receiveGift}`;
    let body = {
      giftCode: this.giftInfo.giftCode
    }
    this.appService.httpPost(url, body)
      .then(data => {
        this.isAllow = true;
        this.alertLayer();
      })
      .catch(error => {
        this.isAllow = true;
        console.log(error);
      });
  }
  alertLayer() {
    const alert = this.alertCtrl.create({
      message: '确认兑换完成',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: '查看赠品',
          handler: () => {
            let data = { 'type': '0' };
            //点击查看赠品后的执行代码
            this.viewCtrl.dismiss(data);
          }
        },
        {
          text: '继续扫码',
          handler: () => {
            let data = { 'type': '1' };
            this.viewCtrl.dismiss(data);
          }
        }
      ]
    });
    alert.present();
  }
  getGiftDetail() {
    let url = this.navParams.get("url"); //提现总计，从当前账户传入过来;
    this.appService.httpGet(url)
      .then(data => {
        console.log(data);
        this.giftInfo = data;
      }).catch(error => {
        console.log(error);
        this.appService.getToken(error, () => {
          this.getGiftDetail();
        });
        if (error.type) {
          const alert = this.alertCtrl.create({
            message: error.message,
            enableBackdropDismiss: false,
            buttons: [
              {
                text: '确定',
                handler: () => {
                  this.viewCtrl.dismiss();
                }
              }
            ]
          });
          alert.present();
        }else {
          this.appService.toast("系统繁忙，请稍后重试", 1000, "middle");
        }  
      });
  }
}
