import { Component } from '@angular/core';
import { NavParams, ViewController, LoadingController } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'order-layer',
  templateUrl: 'order-layer.html'
})
export class OrderLayer {
  count: number = 1;
  orderLayerData: any;//请求接口得到的数据
  attrMap: any = [];//转换后的数据（数组格式）
  productSeq: number;//商品ID
  productName: string;//商品名称
  noData: Boolean;
  start: number;
  showNoMoreGift: Boolean = false;
  up: Boolean;//上拉刷新和第一次进入页面时
  down: Boolean;//下拉刷新和返回上一级页面时
  skuAttrValue: any = [];//sku切换时选中的值
  attrSeqArr: any = [];//选中属性的attrSeq数组
  attrSeqArrPJ: any = [];//拼接的attrSeq数组
  attrValueArr: any = [];//选中属性的attrValue数组
  warehouseCount: number;
  fileSeq: string;//图片
  attrImageSeq: number;
  loadingShow: Boolean = true;
  load: any = {};
  confirmAdd: Boolean = false;
  skuPrice: number;//sku切换价格
  overStock: Boolean = false;
  isShowAddNumber: Boolean = false;
  brandshopSeq: number;
  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public appService: AppService,
    public loadingCtrl: LoadingController,
  ) {
    this.productSeq = navParams.get('productSeq');
    this.productName = navParams.get('productName');
    this.warehouseCount = navParams.get('warehouseCount');
    this.fileSeq = navParams.get('fileSeq');
    this.brandshopSeq = navParams.get('brandshopSeq');
    this.load = AppConfig.load;
    this.getProductSkuWithDefault();
  }
  //初始化sku属性
  getProductSkuWithDefault() {
    let url = `${AppConfig.API.getProductSkuWithDefault}?brandshopSeq=${this.brandshopSeq}&productSeq=${this.productSeq}`;
    this.appService.httpGet(url).then(data => {
      this.isShowAddNumber = true;
      this.skuPrice = data.price;
      this.loadingShow = false;
      this.confirmAdd = true;
      if (data.skuLength != 0) {
        this.orderLayerData = data;
        this.attrImageSeq = this.orderLayerData.attrImageSeq
        for (let key in this.orderLayerData.attrMap) {
          this.attrMap.push(this.orderLayerData.attrMap[key])
        }
        for (let i = 0; i < this.attrMap.length; i++) {
          for (let j = 0; j < this.attrMap[i].length; j++) {
            if (this.attrMap[i][j].selectedAttrValue == "selectedAttrValue") {
              this.skuAttrValue.push(this.attrMap[i][j].attrValue)
            }
          }
        }
        for (let i = 0; i < this.attrMap.length; i++) {
          this.attrSeqArr.push(this.attrMap[i][0].attrSeq);
        }
        for (let i = 0; i < this.attrMap.length; i++) {
          this.attrSeqArrPJ.push(this.attrMap[i][0].attrSeq);
        }
        this.attrValueArr = this.skuAttrValue;
      } else {
        this.orderLayerData = {}
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getProductSkuWithDefault();
      });
      this.loadingShow = false;
      this.isShowAddNumber = false;
      console.log(error);
      if (error.error != "invalid_token") {
        this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
      }
    });
  }
  dismiss() {
    let data = { 'warehouseCount': this.warehouseCount };
    this.viewCtrl.dismiss(data);
  }
  addCount() {
    if (this.overStock == true) {
      return;
    }
    if (this.orderLayerData.stock > this.count) {
      this.overStock = false;
      this.count++;
    } else {
      this.overStock = true;
      this.appService.toast('不能添加更多宝贝了哦', 1000, 'middle');
    }
  }
  removeCount() {
    this.overStock = false;
    this.count = this.count === 1 ? 1 : (this.count - 1);
  }
  //输入数字为负数时重置为1
  resetCount() {
    this.count = this.count <= 0 ? 1 : this.count;
    if (this.count > this.orderLayerData.stock) {
      this.count = this.orderLayerData.stock;
      this.appService.toast('不能超出库存哦', 1000, 'middle');
    } else {
      this.count = this.count;
    }
  }
  // 切换sku属性时
  changeRadio(event, index, currentValue) {
    if (this.attrValueArr[index] != currentValue) {
      this.attrValueArr[index] = currentValue;
      this.attrSeqArrPJ[index] = this.attrSeqArr[index];
    } else {
      this.attrValueArr[index] = "";
      this.attrSeqArrPJ[index] = "";
      event.target.setAttribute("class", "labelTag");
    }
    let attrSeqString = "";
    let attrValueString = "";
    let attrString = "";
    this.attrSeqArrPJ.map(function (item, i) {
      if (item) {
        attrSeqString += "&" + "attrSeqArr=" + item;
      }
    })
    this.attrValueArr.map(function (item, i) {
      if (item) {
        attrValueString += "&" + "attrValueArr=" + item;
      }
    })
    attrString = attrSeqString + attrValueString;
    let url = `${AppConfig.API.getValidSKUAttrValue}?brandshopSeq=${this.brandshopSeq}&productSeq=${this.orderLayerData.productSeq}&skulength=${this.orderLayerData.skuLength}${attrString}`;
    this.appService.httpGet(url).then(data => {
      this.skuPrice = data.price;
      this.orderLayerData = data;
      this.attrMap = [];
      for (let key in this.orderLayerData.attrMap) {
        this.attrMap.push(this.orderLayerData.attrMap[key])
      }
      this.attrImageSeq = this.orderLayerData.attrImageSeq;
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.changeRadio(event, index, currentValue);
      });
      console.log(error);
      if (error.error != "invalid_token") {
        this.appService.toast('操作失败，请稍后重试', 1000, 'middle');
      }
    });
  }
  //确认添加
  warehouseAdd() {
    let olabel = document.getElementsByClassName('labelTag');
    let classLength = 0;
    for (let i = 0; i < olabel.length; i++) {
      if (olabel[i].className == 'labelTag active') {
        classLength++;
      }
    }
    if (this.orderLayerData.stock >= this.count) {
      this.overStock = false;
    } else {
      this.overStock = true;
    }
    if (this.attrMap.length === classLength && !this.overStock) {
      let url = AppConfig.API.warehouseAdd;
      let body = {
        "productId": this.orderLayerData.productSeq,
        "skuId": this.orderLayerData.skuSeq,
        "itemPrice": this.orderLayerData.price,
        "productNum": this.count,
        "remark": ""
      }
      this.appService.httpPost(url, body).then(data => {
        if (data.type == 'success') {
          this.appService.toast('添加成功！', 1000, 'middle');
          this.dismiss();
        }
      }).catch(error => {
        this.appService.getToken(error, () => {
          this.warehouseAdd();
        });
        console.log(error.message);
        if (error.error != "invalid_token") {
          this.appService.toast('操作失败，请稍后重试', 1000, 'middle');
        }
      })
    } else if (this.attrMap.length != classLength) {
      this.appService.toast('请选择商品参数信息', 1000, 'middle');
    }
  }
}
