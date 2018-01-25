import { Component } from '@angular/core';
import { NavParams, AlertController } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'withdraw',
  templateUrl: 'withdraw.html'
})
export class Withdraw {
  amount: number;
  balance: string = '';
  isAllow: boolean = true;
  constructor(
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public appService: AppService
  ) {
    this.getBalance();
  }
  /* 获取可提现金额 */
  getBalance() {
    console.log(this.navParams.get("param1"));
    this.balance = this.navParams.get("param1");
  }
  /* 提现 */
  withdraw() {
    if (!this.isAllow) {
      return;
    }
    this.isAllow = false;
    let url = `${AppConfig.API.withdraw}`;
    let body = Number(Number(this.amount).toFixed(2));
    this.appService.httpPost(url, body).then(data => {
      this.isAllow = true;
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.withdraw();
      });
      if (error.type) {
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: error.message,
          buttons: ['确定']
        });
        alert.present();
      }
      console.log(error);
      this.isAllow = true
    });
  }
}
