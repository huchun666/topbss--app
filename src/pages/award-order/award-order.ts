import { Component } from '@angular/core';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'award-order',
  templateUrl: 'award-order.html'
})
export class AwardOrder {
  pageSize: number = 10;
  currentPage: number = 1;
  awardOrder: any = [];
  count: number = 0;
  sum: any;
  isShow: boolean = false;
  requestFail: boolean = false;
  isEmpty: boolean = false;
  isRefresh: boolean = true;
  load: any;
  isLoadingShow: boolean = false;
  constructor(
    public appService: AppService
  ) {
    this.load = AppConfig.load;
    this.getAllData();
  }
  getAwardOrder() {
    this.isLoadingShow = true;
    let url = `${AppConfig.API.bonusList}?typeList=1&statusList=0,1&start=${(this.currentPage - 1) * this.pageSize}&limit=${this.pageSize}`;
    this.appService.httpGet(url)
      .then(data => {
        if (data.data.length > 0) {
          data.data.map(item => {
            item.baseAmount = item.baseAmount.toFixed(2);
            item.percent = item.percent;
            item.amount = item.amount.toFixed(2);
            item.returnAmount = item.returnAmount.toFixed(2);
          });
          this.awardOrder.push(...data.data);
        }
        this.count = data.count;
        this.isEmpty = data.count === 0 ? true : false;
        this.requestFail = false;
        this.isLoadingShow = false;
      }).catch(error => {
        this.appService.getToken(error, () => {
          this.getAwardOrder();
        });
        console.log(error);
        this.isEmpty = false;
        this.isLoadingShow = false;
        if (error.error != "invalid_token") {
          this.requestFail = true;
        }
      });
  }
  /** 获取总金额 **/
  getBonusSum() {
    let url = `${AppConfig.API.bonusSum}?typeList=1&statusList=0,1`;
    this.appService.httpGet(url).then(data => {
      this.sum = data.sum;
      this.setIsShow(this.sum);
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getBonusSum();
      });
      console.log(error);
    });
  }
  /** 有无明细列表时的判断（判断总金额是否为0）**/
  setIsShow(sum) {
    return this.isShow = sum > 0 ? true : false;
  }
  /** 上拉翻页 **/
  loadMore(infiniteScroll) {
    this.currentPage++;
    this.refreshPage(infiniteScroll);
  }
  /** 请求错误时，刷新页面 **/
  refresh() {
    this.requestFail = false;
    this.currentPage = 1;
    this.getAllData();
  }
  /** 下拉刷新页面 **/
  pullRefresh(refresher) {
    this.requestFail = false;
    this.isEmpty = false;
    this.currentPage = 1;
    this.awardOrder = [];
    this.refreshPage(refresher);
  }
  /** 下拉上拉公共方法 **/
  refreshPage(refresher) {
    setTimeout(() => {
      this.getAllData();
      refresher.complete();
    }, 500);
  }
  /** 获取列表数据和总金额 **/
  getAllData() {
    this.getAwardOrder();
    this.getBonusSum();
  }
}
