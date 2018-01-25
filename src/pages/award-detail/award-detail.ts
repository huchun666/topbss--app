import { NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  templateUrl: 'award-detail.html',
  selector: 'withdraw-awardDetail'
})
export class AwardDetail {
  pageSize: number = 10;
  currentPage: number = 1;
  awardDetail: any = [];
  count: number = 0;
  sum: any;
  isShow: boolean = false;
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
    this.getAllData();
  }
  getAwardDetail() {
    this.isLoadingShow = true;
    let url = `${AppConfig.API.bonusList}?typeList=3,4&statusList=2&start=${(this.currentPage - 1) * this.pageSize}&limit=${this.pageSize}`;
    this.appService.httpGet(url).then(data => {
      if (data.data.length > 0) {
        data.data.map(item => {
          item.baseAmount = item.baseAmount.toFixed(2);
          item.percent = item.percent;
          item.amount = item.amount.toFixed(2);
          item.returnAmount = item.returnAmount.toFixed(2);
        });
        this.awardDetail.push(...data.data);
      }
      this.count = data.count;
      this.isEmpty = data.count === 0 ? true : false;
      this.requestFail = false;
      this.isLoadingShow = false;
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getAwardDetail();
      });
      console.log(error);
      if (error.error != "invalid_token") {
        this.requestFail = true;
      }
      this.isLoadingShow = false;
      this.isEmpty = false;
    });
  }
  /** 获取总金额 **/
  getBonusSum() {
    let url = `${AppConfig.API.bonusSum}?typeList=3,4&statusList=2`;
    this.appService.httpGet(url)
      .then(data => {
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
    this.awardDetail = [];
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
    this.getAwardDetail();
    this.getBonusSum();
  }
}