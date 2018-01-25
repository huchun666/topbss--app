import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { PaymentCode } from '../payment-code/payment-code';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'order-store',
  templateUrl: 'order-store.html'
})
export class OrderStore {
  @ViewChild(Content) content: Content;
  start: number = 0;
  limit: number = 50;
  noData: Boolean;
  up: Boolean;//上拉刷新和第一次进入页面时
  down: Boolean;//下拉刷新和返回上一级页面时
  orderStoreDataArray: any = [];//得到的数据里面的data数组
  returnUrl: string;//返回得到的url字符串
  loadingShow: Boolean = true;
  load: any = {};
  totalPrice: number = 0;
  confirmOrder: Boolean = false;
  totalPriceFloat: any;
  overStock: Boolean;
  requestDefeat: Boolean = false;
  totalPriceIsOrNull: Boolean = true;
  totalNumberIsOrNull: Boolean = true;
  constructor(
    public navCtrl: NavController,
    public appService: AppService,
  ) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.load = AppConfig.load;
    this.getOrderStore();
  }
  getOrderStore() {
    let url = `${AppConfig.API.warehouseList}?start=${this.start}&limit=${this.limit}`;
    this.appService.httpGet(url).then(data => {
      this.loadingShow = false;
      if (data.count == 0) {
        this.noData = true;
        this.confirmOrder = false;
      } else {
        this.noData = false;
        this.confirmOrder = true;
        if (this.up) {
          this.orderStoreDataArray.push(...data.data);
          this.start += this.limit;
        } else if (this.down) {
          this.orderStoreDataArray = data.data;
          this.start += this.limit;
        }
        this.orderStoreDataArray.map((item) => {
          this.totalPrice += item.itemPrice;
        })
        this.orderStoreDataArray.map((item) => {
          item.productSkuDTO.attrValueList.map((single) => {
            if (single.fileSeq) {
              item.productSkuDTO.fileSeq = single.fileSeq;
              return
            }
          })
        })
        this.totalPriceFloat = parseFloat(`${this.totalPrice.toString()}`).toFixed(2);
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.getOrderStore();
      });
      this.loadingShow = false;
      if(error.error != "invalid_token") {
        this.requestDefeat = true;
      }
      console.log(error);
    });
  }
  //更新的函数
  warehouseUpdate(index, addOrRemove) {
    let body = [];
    let url = AppConfig.API.warehouseUpdate;
    let loading = this.appService.loading();
    loading.present();
    this.orderStoreDataArray.map(function (item) {
      let order = {};
      order['warehouseItemId'] = item.warehouseItemId;
      order['warehouseId'] = item.warehouseId;
      order['itemPrice'] = item.itemPrice;
      order['productNum'] = item.productNum;
      order['remark'] = item.remark;
      body.push(order);
    })
    this.appService.httpPut(url, body[index]).then(data => {
      if (data.type == "success") {
        loading.dismiss();
        this.totalPrice = 0;
        this.orderStoreDataArray.map((item) => {
          this.totalPrice += item.itemPrice;
        })
        this.totalPriceFloat = parseFloat(`${this.totalPrice.toString()}`).toFixed(2);
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.warehouseUpdate(index, addOrRemove);
      });
      if (addOrRemove == "add") {
        this.orderStoreDataArray[index].productNum--;
      } else if (addOrRemove == "remove") {
        this.orderStoreDataArray[index].productNum++;
      }
      if(error.error != "invalid_token") {
        this.appService.toast('更新失败，请稍后再试', 1000, 'middle');
        loading.dismiss();
      }
      console.log(error);
    })
  }
  //加
  addCount(index) {
    if (this.orderStoreDataArray[index].productSkuDTO.stock > this.orderStoreDataArray[index].productNum) {
      this.orderStoreDataArray[index].productNum++;
      this.warehouseUpdate(index, "add");
    } else {
      this.appService.toast('不能添加更多宝贝了哦！', 1000, 'middle');
    }
  }
  //减
  removeCount(index) {
    if (this.orderStoreDataArray[index].productNum > 1) {
      this.orderStoreDataArray[index].productNum--;
      this.warehouseUpdate(index, "remove");
    }
  }
  //删除
  delete(index) {
    let loading = this.appService.loading();
    loading.present();
    let url = `${AppConfig.API.warehouseDeleteById}?id=${this.orderStoreDataArray[index].warehouseItemId}`;
    this.appService.httpDelete(url).then(data => {
      if (data.type == "success") {
        loading.dismiss();
        this.orderStoreDataArray.splice(index, 1);
        this.totalPrice = 0;
        this.orderStoreDataArray.map((item) => {
          this.totalPrice += item.itemPrice;
        })
        this.totalPriceFloat = parseFloat(`${this.totalPrice.toString()}`).toFixed(2);
        if (this.orderStoreDataArray.length == 0) {
          this.confirmOrder = false;
          this.noData = true;
        }
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.delete(index);
      });
      console.log(error);
      if(error.error != "invalid_token") {
        this.appService.toast('删除失败，请稍后再试', 1000, 'middle');
        loading.dismiss();
      }
    })
  }
  //失去焦点
  resetCount(index) {
    if (this.orderStoreDataArray[index].itemPrice == null) {
      this.orderStoreDataArray[index].itemPrice = 0;
      this.appService.toast('商品总额不能为空', 1000, 'middle');
    }
    this.warehouseUpdate(index, "reset");
  }
  resetProductNum(index) {
    if (this.orderStoreDataArray[index].productNum <= 0) {
      this.orderStoreDataArray[index].productNum = 1;
      this.appService.toast('商品数量不能为空', 1000, 'middle');
    }
    if (this.orderStoreDataArray[index].productSkuDTO.stock >= this.orderStoreDataArray[index].productNum) {
      this.warehouseUpdate(index, "reset");
    } else {
      this.appService.toast('不能超出库存哦', 1000, 'middle');
      this.orderStoreDataArray[index].productNum = this.orderStoreDataArray[index].productSkuDTO.stock;
      this.warehouseUpdate(index, "reset");
    }
  }
  //确认订单
  addProductModal() {
    this.totalPrice = 0;
    let totalArr: any = document.getElementsByClassName("total-input-count");
    let totalNumberArr: any = document.getElementsByClassName("total-input-number");
    for (let i = 0; i < totalArr.length; i++) {
      this.totalPrice += Number(totalArr[i].value);
    }
    for (let i = 0; i < totalArr.length; i++) {
      if (totalArr[i].value === '') {
        this.totalPriceIsOrNull = false;
        return;
      } else {
        this.totalPriceIsOrNull = true;
      }
    }
    for (let i = 0; i < totalNumberArr.length; i++) {
      if (totalNumberArr[i].value === '') {
        this.totalNumberIsOrNull = false;
        return;
      } else {
        this.totalNumberIsOrNull = true;
      }
    }
    if (this.totalPriceIsOrNull && this.totalNumberIsOrNull) {
      this.totalPriceFloat = parseFloat(`${this.totalPrice.toString()}`).toFixed(2);
      let loading = this.appService.loading();
      loading.present();
      let url = `${AppConfig.API.warehouseGenerateCode}?warehouseId=${this.orderStoreDataArray[0].warehouseId}`;
      this.appService.httpGetReturnData(url).then(data => {
        loading.dismiss();
        this.returnUrl = data['_body'];
        this.navCtrl.push(PaymentCode, {
          returnUrl: this.returnUrl,
          totalPriceFloat: this.totalPriceFloat,
          warehouseId: this.orderStoreDataArray[0].warehouseId
        });
      }).catch(error => {
        this.appService.getToken(error, () => {
          this.addProductModal();
        });
        console.log(error);
        if(error.error != "invalid_token") {
          this.appService.toast('操作失败，请稍后再试', 1000, 'middle');
          loading.dismiss();
        }
      })
    }
  }
  // 下拉刷新请求数据
  refreshGetOrderStoreList(refresher) {
    this.start = 0;
    this.down = true;
    this.up = false;
    this.requestDefeat = false;
    this.noData = false;
    let url = `${AppConfig.API.warehouseList}?start=${this.start}&limit=${this.limit}`;
    this.appService.httpGet(url).then(data => {
      refresher.complete();
      if (data.count == 0) {
        //空空如也
        this.noData = true;
      } else {
        this.noData = false;
        this.orderStoreDataArray = data.data;
        this.start += this.limit;
      }
    }).catch(error => {
      this.appService.getToken(error, () => {
        this.refreshGetOrderStoreList(refresher);
      });
      this.orderStoreDataArray = [];
      if(error.error != "invalid_token") {
        refresher.complete();
        this.requestDefeat = true;
      }
      console.log(error);
    });
  }
  //请求失败后刷新
  requestDefeatRefresh() {
    this.requestDefeat = false;
    this.loadingShow = true;
    this.start = 0;
    this.down = true;
    this.up = false;
    this.getOrderStore();
  }
}
