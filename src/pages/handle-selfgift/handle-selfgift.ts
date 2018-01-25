import { Component, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'handle-selfgift',
  templateUrl: 'handle-selfgift.html'
})
export class HandleSelfgift {
  @ViewChild(Content) content: Content;
  handleSeflGiftArray: any = [];
  noData: Boolean;
  start: number = 0;
  limit: number = 10;
  showNoMore: Boolean = false;
  up: Boolean;//上拉刷新和第一次进入页面时
  down: Boolean;//下拉刷新和返回上一级页面时
  load: any = {};
  loadingShow: Boolean = true;
  requestDefeat: Boolean = false;
  showInfinite: Boolean = false;
  constructor(
    public appService: AppService,
  ) {
    this.down = true;
    this.up = false;
    this.load = AppConfig.load;
  }
  ionViewDidEnter() {
    setTimeout(this.getHandleSelfGiftList(), 100);
  }
  //进入页面，请求接口，得到数据
  getHandleSelfGiftList() {
    let url = `${AppConfig.API.getGiftList}?type=2&start=${this.start}&limit=${this.limit}`;//brandshopSeq=${this.brandshopSeqId}
    this.appService.httpGet(url).then(data => {
      this.loadingShow = false;
      if (data.count == 0) {
        //空空如也
        this.noData = true;
      } else {
        this.noData = false;
        this.showInfinite = true;
        if (this.start < data.count) {
          if (this.up) {
            this.handleSeflGiftArray.push(...data.data);
            this.start += this.limit;
          } else if (this.down) {
            this.handleSeflGiftArray = data.data;
            this.start += this.limit;
            this.content.scrollTo(0, 0, 0);
          }
        } else {
          this.showNoMore = true;
        }
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getHandleSelfGiftList();
      });
      this.loadingShow = false;
      console.log(error);
      if(error.error != "invalid_token") {
        this.showInfinite = false;
        this.requestDefeat = true;
      }
    });
  }
  // 下拉刷新请求数据
  refreshGetHandleSelfGiftList(refresher) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.showNoMore = false;
    this.showInfinite = true;
    let url = `${AppConfig.API.getGiftList}?type=2&start=${this.start}&limit=${this.limit}`;
    this.appService.httpGet(url).then(data => {
      refresher.complete();
      if (data.count == 0) {
        //空空如也
        this.noData = true;
      } else {
        this.noData = false;
        this.showInfinite = true;
        if (data.data.length != 0) {
          this.handleSeflGiftArray = data.data;
          this.start += this.limit;
        } else {
          this.showNoMore = true;
        }
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.refreshGetHandleSelfGiftList(refresher);
      });
      this.handleSeflGiftArray = [];
      refresher.complete();
      console.log(error);
      if(error.error != "invalid_token") {
        this.showInfinite = false;
        this.requestDefeat = true;
      }
    });
  }
  // 上拉刷新请求数据
  infiniteGetHandleSelfGiftList(infiniteScroll) {
    this.down = false;
    this.up = true;
    let url = `${AppConfig.API.getGiftList}?type=2&start=${this.start}&limit=${this.limit}`;
    this.appService.httpGet(url).then(data => {
      infiniteScroll.complete();
      if (data.count == 0) {
        //空空如也
        this.noData = true;
      } else {
        this.noData = false;
        if (data.data.length != 0) {
          this.handleSeflGiftArray.push(...data.data);
          this.start += this.limit;
        } else {
          this.showNoMore = true;
        }
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.infiniteGetHandleSelfGiftList(infiniteScroll);
      });
      console.log(error);
      if(error.error != "invalid_token") {
        infiniteScroll.complete();
        this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
      }
    });
  }
  //请求失败后刷新
  requestDefeatRefresh() {
    this.requestDefeat = false;
    this.loadingShow = true;
    this.start = 0;
    this.down = true;
    this.up = false;
    this.getHandleSelfGiftList();
  }
}
