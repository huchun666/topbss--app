import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'returned-detail',
  templateUrl: 'returned-detail.html'
})
export class ReturnedDetail {
  listIndexId: number;
  orderStatus: string;
  imageArray: any;
  load: any = {};
  loadingShow: Boolean = true;
  returnedDetail: any = {
    orderReturn: {
      orderReturnSeq: '',
      returnOrderId: '',
      invoiced: '',
      detail: '',
      mobile: '',
      number: '',
      name: '',
      returnType: '',
      totalReturnPrice: '',
      status: '',
      returnReason: ''
    },
    order: {
      orderSeq: '',
      orderId: '',
      payAmount: ''
    },
    itemProductSkuDTO: {
      orderItemSeq: null,
      prodSeq: null,
      skuSeq: null,
      unitPrice: null,
      number: null,
      productSkuDTO: {
        productSeq: null,
        skuSeq: null,
        unitPrice: '',
        number: '',
        productName: "",
        fileName: '',
        attrValueList: [
          {
            skuSeq: null,
            attrSeq: null,
            attrName: "",
            attrValue: "",
            type: null,
            fileSeq: null,
            price: null,
            selectedAttrValue: null,
            invalidAttrValue: null
          },
          {
            skuSeq: null,
            attrSeq: null,
            attrName: "",
            attrValue: "",
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
    returnAmount: null
  };
  constructor(
    public navParams: NavParams,
    public appService: AppService) {
    this.listIndexId = this.navParams.get('indexId')  //传上个页面当前点击的id来获取详情页信息
    this.orderStatus = this.navParams.get('status');  //传过来的订单的状态
    this.load = AppConfig.load;
    this.getReturnedDetailList();
  }
  getReturnedDetailList() {
    // 点击审核时的详情页 请求数据
    let url = `${AppConfig.API.returnDetail}?id=${this.listIndexId}`;
    this.appService.httpGet(url).then(data => {
      this.loadingShow = false;
      this.returnedDetail = data;
      if (this.returnedDetail.orderReturn.imageIds) {
        this.imageArray = this.returnedDetail.orderReturn.imageIds.split(",");
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getReturnedDetailList();
      });
      this.loadingShow = false;
      console.log(error);
      if(error.error != "invalid_token") {
        this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
      }
    })
  }
}
