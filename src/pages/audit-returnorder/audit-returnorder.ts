import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { ReturnedDetail } from '../returned-detail/returned-detail';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'audit-returnorder',
  templateUrl: 'audit-returnorder.html'
})
export class AuditReturnorder {
  auditReturnorderArray: any = [];
  limit: number = 10; 
  up: Boolean = true;//上拉刷新和第一次进入页面时
  down: Boolean = false;//下拉刷新和返回上一级页面时
  noData: Boolean = false;
  start: number = 0;
  showNoMore: Boolean = false;
  load: any = {};
  loadingShow: Boolean = true;
  requestDefeat: Boolean = false;
  showInfinite: Boolean = false;
  constructor(
    public modalCtrl: ModalController,
    public appService: AppService) {
      this.up = false;
      this.down = true;
      this.load = AppConfig.load;
      this.getAuditReturnorderList();
  }
  goReturnedDetail(index) {
    let contactModal = this.modalCtrl.create(ReturnedDetail, { indexId: this.auditReturnorderArray[index].orderReturnSeq, status: this.auditReturnorderArray[index].status });
    contactModal.present();
  }
  getAuditReturnorderList() {
    // 已审核退货订单 请求数据
    let url = `${AppConfig.API.getReturnorderList}?deliveryType=1&status=1&start=${this.start}&limit=${this.limit}`
    this.appService.httpGet(url).then(data => {
      this.loadingShow = false;
      if (data.count == 0 && this.auditReturnorderArray.length == 0) {
        this.noData = true;
      } else {
        this.noData = false;
        this.showInfinite = true;
        if (this.start < data.count) {
          if (this.up) {
            this.auditReturnorderArray.push(...data.data);
            this.start += this.limit;
          } else if (this.down) {
            this.auditReturnorderArray = data.data;
            this.start += this.limit;
          }
        } else {
          this.showNoMore = true;
        }
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getAuditReturnorderList();
      });
      this.auditReturnorderArray = [];
      this.loadingShow = false;
      console.log(error);
      if(error.error != "invalid_token")  {
        this.showInfinite = false;
        this.requestDefeat = true;
      }
    });
  }
  // 下拉刷新请求数据
  doRefresh(refresher) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.showNoMore = false;
    this.showInfinite = true;
    let url = `${AppConfig.API.getReturnorderList}?deliveryType=1&status=1&start=${this.start}&limit=${this.limit}`;
    this.appService.httpGet(url).then(data => {
      refresher.complete();
      if (data.count == 0) {
        this.noData = true;
      }else {
        this.noData = false;
        this.showInfinite = true;
        if (data.data.length != 0) {
          this.auditReturnorderArray = data.data;
          this.start += this.limit;
        }else {
          this.showNoMore = true;
        }
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.doRefresh(refresher);
      });
      this.auditReturnorderArray = [];
      refresher.complete();
      console.log(error);
      if(error.error != "invalid_token") {
        this.showInfinite = false;
        this.requestDefeat = true;
      }
    });
  }
  // 上拉刷新请求数据
  infiniteGetSelfGiftList(infiniteScroll) {
    this.down = false;
    this.up = true;
    let url = `${AppConfig.API.getReturnorderList}?deliveryType=1&status=1&start=${this.start}&limit=${this.limit}`
    this.appService.httpGet(url).then(data => {
      if (data.count == 0) {
        this.noData = true;
      }else {
        this.noData = false;
        if (data.data.length != 0) {
          this.auditReturnorderArray.push(...data.data);
          this.start += this.limit;
        }else {
          this.showNoMore = true;
        }
      }
      infiniteScroll.complete();
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.infiniteGetSelfGiftList(infiniteScroll);
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
    this.getAuditReturnorderList();
  }
}
