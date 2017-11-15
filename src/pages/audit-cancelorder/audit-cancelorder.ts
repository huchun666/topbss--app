import { Component} from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'audit-cancelorder',
  templateUrl: 'audit-cancelorder.html'
})
export class AuditCancelorder {
  audutCancelorderArray: any;
  currentPage: number = 1;
  pageSize: number = 10;
  up: Boolean = true;//上拉刷新和第一次进入页面时
  down: Boolean = false;//下拉刷新和返回上一级页面时
  noData:Boolean = false;
	constructor(
    public navCtrl: NavController, 
    public alertCtrl: AlertController, 
    public appService: AppService) {
      // 请求接口得到数据
      // this.getAuditCancelorder()

      this.audutCancelorderArray = [
        { 
          orderSeq: 2946,
          cancelOrderId: "20160906047616",
          amount: 39.75,
          status: "2",
          memberMobile: 11111111111, //会员手机号
          orderId: "20160905047352",
          payAmount: 39.75,
          orderStatus: "4",
          cancelTime: 1473157207000,
          createTime: 1473157148000,
          itemList: [
            {
              orderItemSeq: 2971,
              prodSeq: 289,
              skuSeq: 939,
              unitPrice: 78.75,
              number: 1,
              productSkuDTO: { 
                productSeq: 289,
                skuSeq: 939,
                productName: "MQD2016夏季印花短袖T恤216220510",
                fileName: './assets/image/productimg.png',
                attrValueList: [
                  {
                    skuSeq: null,
                    attrSeq: 300,
                    attrName: "颜色",
                    attrValue: "蓝色",
                    type: null,
                    fileSeq: null,
                    price: null,
                    selectedAttrValue: null,
                    invalidAttrValue: null
                  },
                  {
                      skuSeq: null,
                      attrSeq: 322,
                      attrName: "尺码",
                      attrValue: "100（3-4岁）",
                      type: null,
                      fileSeq: null,
                      price: null,
                      selectedAttrValue: null,
                      invalidAttrValue: null
                  }
                ],
                fallback: null
              }
            },
          ]
        },
        { 
          orderSeq: 2946,
          cancelOrderId: "20160906047616",
          amount: 39.75,
          status: "1",
          memberMobile: 11111111111, // 会员手机号
          orderId: "20160905047352",
          payAmount: 39.75,
          orderStatus: "4",
          cancelTime: 1473157207000,
          createTime: 1473157148000,
          itemList: [
            {
              orderItemSeq: 2971,
              prodSeq: 289,
              skuSeq: 939,
              unitPrice: 78.75,
              number: 1,
              productSkuDTO: { 
                productSeq: 289,
                skuSeq: 939,
                productName: "MQD2016夏季印花短袖T恤216220510",
                fileName: './assets/image/productimg.png',
                attrValueList: [
                  {
                    skuSeq: null,
                    attrSeq: 300,
                    attrName: "颜色",
                    attrValue: "蓝色",
                    type: null,
                    fileSeq: null,
                    price: null,
                    selectedAttrValue: null,
                    invalidAttrValue: null
                  },
                  {
                      skuSeq: null,
                      attrSeq: 322,
                      attrName: "尺码",
                      attrValue: "100（3-4岁）",
                      type: null,
                      fileSeq: null,
                      price: null,
                      selectedAttrValue: null,
                      invalidAttrValue: null
                  }
                ],
                fallback: null
              }
            },
          ]
        },
      ]
	}
	auditOrder() {
	
	}
	getAuditCancelorder() {
    // 待审核已取消订单 请求数据
    let loading = this.appService.loading();
    let url = `${AppConfig.hostUrl + AppConfig.API.getCancelorder}?deliveryType=1&status=1&start=${this.pageSize * (this.currentPage - 1)}&limit=${this.pageSize}`
	  // this.appService.httpGet(url).then( data => {
    //   loading.dismiss();
    //   if (data.count == 0 && this.audutCancelorderArray.length == 0) {
		//     //空空如也
		//     this.noData = true;
	  //   } else {
    //     this.noData = false;
    //     if(this.up){
    //       this.audutCancelorderArray.push(...data.data);
    //       this.currentPage++;
    //     } else if(this.down){
    //       this.audutCancelorderArray = data.data;
    //     }
    //   }
	  // }).catch(error => {
    //  console.log(error);
    // });
  }
  
  // 下拉刷新请求数据
  doRefresh(refresher) {
    this.down = true;
    this.up = false;
    setTimeout(() => {
      this.currentPage = 1;
      // this.getAuditCancelorder();
      refresher.complete();
    },1000)
  }
  
  // 上拉刷新请求数据
  infiniteGetSelfGiftList(infiniteScroll) {
    this.down = false;
    this.up = true;
    setTimeout(() => {
      // this.getAuditCancelorder();
      infiniteScroll.complete();
    },1000)
  }
}
