import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'withdraw-record',
  templateUrl: 'withdraw-record.html'
})
export class WithdrawRecord {
  pageSize: number = 10;
  currentPage: number = 1;
  withdrawAmount: number = 0;
  count: number = 0;
  withdrawList: any = [];
  isEmpty: boolean = false;
  requestFail: boolean = false;
  isRefresh: boolean = true;
  load: any;
  isLoadingShow: boolean = false;
  constructor(
    public navParams: NavParams,
    public appService: AppService
  ) {
    this.load = AppConfig.load;
    this.getWithdrawList();
  }
  getWithdrawList() {
    this.isLoadingShow = true;
    let url = `${AppConfig.API.withdrawList}?start=${(this.currentPage - 1) * this.pageSize}&limit=${this.pageSize}`;
    this.appService.httpGet(url).then(data => {
        if (data.data.length > 0) {
          data.data.map(item => {
            item.amount = item.amount.toFixed(2);
            item.realAmount = item.realAmount.toFixed(2);
            item.individualTax = item.individualTax.toFixed(2);
          });
          this.withdrawList.push(...data.data);
        }
        this.count = data.count;
        this.isEmpty = data.count === 0 ? true : false;
        this.requestFail = false;
        this.isLoadingShow = false;
        this.withdrawAmount = this.navParams.get("param1"); //提现总计，从当前账户传入过来
      }).catch(error => {
        this.appService.getToken(error, () => {
          this.getWithdrawList();
        });
        console.log(error);
        this.isEmpty = false;
        this.isLoadingShow = false;
        if(error.error != "invalid_token") {
          this.requestFail = true;
        }
      }
      );
  }
  loadMore(infiniteScroll) {
    this.currentPage++;
    this.refreshPage(infiniteScroll);
  }
  refresh() {
    this.requestFail = false;
    this.currentPage = 1;
    this.withdrawList = [];
    this.withdrawAmount = 0;
    this.getWithdrawList();
  }
  pullRefresh(refresher) {
    this.requestFail = false;
    this.isEmpty = false;
    this.currentPage = 1;
    this.withdrawList = [];
    this.withdrawAmount = 0;
    this.refreshPage(refresher);
  }
  refreshPage(refresher) {
    setTimeout(() => {
      this.getWithdrawList();
      refresher.complete();
    }, 500);
  }
}
