import { Component } from '@angular/core';
import { NavParams, AlertController, NavController } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'withdraw',
  templateUrl: 'withdraw.html'
})
export class Withdraw {
  amount: number;
  balance: number;
  isAllow: boolean = true;
  balanceString: string = '';
  timer: any;
  constructor(
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public appService: AppService,
    public navCtrl: NavController
  ) {
    this.getBalance();
  }
  /* 获取可提现金额 */
  getBalance() {
    this.balance = this.navParams.get("param1");
    if (this.balance > 2000) {
      this.balance = 2000;
    }
    this.balanceString = this.balance.toFixed(2);
  }
  /* 提现 */
  withdraw() {
    if (!this.isAllow) {
      return;
    }
    this.isAllow = false;
    let self = this;
    let amountFloat = Number(Number(this.amount).toFixed(2));
    let withdrawTaxUrl = `${AppConfig.API.withdrawTax}?amount=${amountFloat}`;
    this.appService.httpGet(withdrawTaxUrl).then(data => {
      this.isAllow = true;
      let alert = this.alertCtrl.create({
        message: `当前可到账金额为${data.realWithdrawAmount}元`,
        buttons: [
          {
            text: '取消'
          },
          {
            text: '确定',
            handler: () => {
              let withdrawUrl = `${AppConfig.API.withdraw}`;
              let body = Number(Number(this.amount).toFixed(2));
              let loading = this.appService.loading();
              loading.present();
              this.appService.httpPost(withdrawUrl, body).then(data => {
                this.appService.toast('提现成功', 1000, 'middle');
                this.timer = setTimeout(function() {
                  loading.dismiss();
                  self.navCtrl.pop();
                }, 1000)
              }).catch(error => {
                loading.dismiss();
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
              });
            }
          }
        ]
      });
      alert.present();
    }).catch(error => {
      console.log(error);
    });
  }
}
