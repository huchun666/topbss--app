import { Component } from '@angular/core';
import { App, Nav, ModalController, NavController } from 'ionic-angular';
import { Withdraw } from '../withdraw/withdraw';
import { Login } from '../login/login';
import { MyCode } from '../mycode/mycode';
import { DetailTabs } from '../detail-tabs/detail-tabs';
import { AwardTabs } from '../award-tabs/award-tabs';
import { WithdrawRecord } from '../withdraw-record/withdraw-record';
import { Help } from '../help/help';
import { AddAccount } from '../account/add-account/add-account';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'personl',
  templateUrl: 'personl.html'
})
export class Personl {
  /* 当前导购员基本信息
   * 用户ID,手机号，门店ID，微信号，身份证
  */
  userCurrent: any = {
    id: '', //用户id
    cellphone: '', //手机
    brandshopId: '', //门店id
    wechatNumber: '', //微信号
    idcard: '', //身份证
    boundWechat: false
  }
  /* 当前导购员账户信息
   * 导购员ID，类型账户，已审核金额（旧版本的总金额），可提现金额，审核中金额，已提取金额
   */
  userAccount: any = {
    userId: null,
    acctType: null,
    totalAmount: 0.00,
    balance: 0.00,
    verifyAmount: 0.00,
    withdrawAmount: 0.00,
  }
  /* 临时存储可提现金额，审核中金额，和已提现金额 */
  moneyList: any = {
    balance: 0.00,
    verifyAmount: 0.00,
    withdrawAmount: 0.00
  }
  isStar: boolean = false;
  showImg: string = 'hide.png';
  showText: string = '隐藏';
  pageList: any = null;
  constructor(
    public nav: Nav,
    public modalCtrl: ModalController,
    private app: App,
    public appService: AppService,
    public navCtrl: NavController
  ) {
    /* 设置组件名称，方便跳转参数调用 */
    this.pageList = {
      "withdraw": Withdraw,
      "myCode": MyCode,
      "detailTabs": DetailTabs,
      "awardTabs": AwardTabs,
      "withdrawRecord": WithdrawRecord,
      "addAccount": AddAccount,
      "help": Help
    }
  }
  ionViewDidEnter() {
    this.getCurrent();
    this.getAccount();
  }
  /* 显示和隐藏金额 */
  showMoney() {
    this.isStar = !this.isStar;
    this.showText = !this.isStar ? '隐藏' : '显示';
    this.showImg = !this.isStar ? 'hide.png' : 'show.png';
    this.userAccount.balance = !this.isStar ? this.moneyList.balance : '*****';
    this.userAccount.verifyAmount = !this.isStar ? this.moneyList.verifyAmount : '*****';
    this.userAccount.withdrawAmount = !this.isStar ? this.moneyList.withdrawAmount : '*****';
  }
  /* 退出登录 */
  logOut() {
    this.appService.setItem("tpb_token", "");
    this.appService.setItem("refresh_token", "");
    let appNav = this.app.getRootNav();
    appNav.setRoot(Login);
  }
  /* 跳转页面 */
  redirectPage(page, param1, param2) {
    if (!this.userCurrent.boundWechat && page === Withdraw) {
      page = this.pageList.addAccount;
    }
    if (page === MyCode || page === Withdraw || page === WithdrawRecord || page === AddAccount || page === Help) {
      this.navCtrl.push(page, { 'param1': param1, 'param2': param2 });
    }else {
      let pageModal = this.modalCtrl.create(page, { 'param1': param1, 'param2': param2 });
      pageModal.onDidDismiss(data => {
        this.getCurrent();
        this.getAccount();
      });
      pageModal.present();
    }
  }
  /* 将电话号码格式化 */
  formatTelphone() {
    this.userCurrent.cellphone = this.userCurrent.cellphone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
  /* 获取当前导购员基本信息 */
  getCurrent() {
    let url = AppConfig.API.current;
    this.appService.httpGet(url).then(data => {
      this.userCurrent = data;
      this.formatTelphone();
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getCurrent();
      });
      console.log(error);
    });
  }
  getAccount() {
    let url = AppConfig.API.account;
    this.appService.httpGet(url).then(data => {
      this.moneyList.balance = data.balance;
      this.moneyList.verifyAmount = data.verifyAmount;
      this.moneyList.withdrawAmount = data.withdrawAmount;
      this.userAccount = data;
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getAccount();
      });
      console.log(error);
    });
  }
}
