import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'return-detail',
  templateUrl: 'return-detail.html'
})
export class ReturnDetail {
  returnDetail: any = {
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
  productId: number;
  imageArray: any;
  load: any = {};
  loadingShow: Boolean = true;
  constructor(
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public appService: AppService
  ) {
    this.productId = this.navParams.get('productId');  //传上个页面当前点击的id来获取详情页信息
    this.load = AppConfig.load;
    this.getReturnDetailList();
  }
  getReturnDetailList() {
    let url = `${AppConfig.API.returnDetail}?id=${this.productId}`;
    this.appService.httpGet(url).then(data => {
      this.loadingShow = false;
      this.returnDetail = data;
      if (this.returnDetail.orderReturn.imageIds) {
        this.imageArray = this.returnDetail.orderReturn.imageIds.split(",");
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getReturnDetailList();
      });
      this.loadingShow = false;
      console.log(error);
      if(error.error != "invalid_token") {
        this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
      }
    })
  }
  agreeReturnPost() {
    let loading = this.appService.loading();
    loading.present();
    let url = `${AppConfig.API.auditReturnOrder}?id=${this.productId}&isAgree=1&totalReturnPrice=${this.returnDetail.returnAmount}`;
    this.appService.httpPost(url, null).then(data => {
      if (data.type == "success") {
        loading.dismiss();
        this.viewCtrl.dismiss();
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.agreeReturnPost();
      });
      loading.dismiss();
      console.log(error);
      if (error.error != "invalid_token") {
        this.appService.toast('操作失败，请稍后再试', 1000, 'middle');
      }
    })
  }
  agreeReturn() {
    let alert = this.alertCtrl.create({
      message: '退货数量: ' + this.returnDetail.orderReturn.number + `<span>拟退款金额：${this.returnDetail.returnAmount} 元</span>`,
      buttons: [
        {
          text: '取消',
          handler: () => {
            //点击取消后的执行代码
          }
        },
        {
          text: '确认',
          handler: () => {
            this.agreeReturnPost();
          }
        }
      ],
      cssClass: 'detail-alert'
    });
    alert.present();
  }
  refuseReturnPost() {
    let loading = this.appService.loading();
    loading.present();
    let url = `${AppConfig.API.auditReturnOrder}?id=${this.productId}&isAgree=0&totalReturnPrice=${this.returnDetail.returnAmount}`;
    this.appService.httpPost(url, null).then(data => {
      if (data.type == "success") {
        loading.dismiss();
        this.viewCtrl.dismiss();
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.refuseReturnPost();
      });
      loading.dismiss();
      console.log(error);
      if (error.error != "invalid_token") {
        this.appService.toast('操作失败，请稍后再试', 1000, 'middle');
      }
    })
  }
  refuseReturn() {
    let alert = this.alertCtrl.create({
      message: `确认拒绝会员${this.returnDetail.orderReturn.mobile}的订单${this.returnDetail.orderReturn.returnOrderId}退货申请？`,
      buttons: [
        {
          text: '取消',
          handler: () => {
            //点击取消后的执行代码
          }
        },
        {
          text: '确认',
          handler: () => {
            this.refuseReturnPost();
          }
        }
      ],
    });
    alert.present();
  }
}
