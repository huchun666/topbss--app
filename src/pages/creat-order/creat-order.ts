import { Login } from './../login/login';
import { Component} from '@angular/core';
import { ModalController, NavController, NavParams, AlertController } from 'ionic-angular';
import { OrderLayer } from '../order-layer/order-layer';
import { OrderStore } from '../order-store/order-store';
import { AppService, AppConfig } from '../../app/app.service';

@Component({
  selector: 'creat-order',
  templateUrl: 'creat-order.html',
})
export class CreatOrder {
  creatOrderArray: any;
  noData: Boolean;
  start: number = 0;
  limit: number = 20;
  showNoMore: Boolean = false;
  up: Boolean;//上拉刷新和第一次进入页面时
  down: Boolean;//下拉刷新和返回上一级页面时
  warehouseCount: number;//配单仓数目
  searchKeyWord: string;//搜索内容
  loadingShow: Boolean = true;
  load: any = {}; 
  constructor(public modalCtrl: ModalController, 
    public navCtrl: NavController, 
    public alertCtrl: AlertController,
    public appService: AppService,
  ) {
    this.down = true;
    this.up = false;
    this.load = AppConfig.load;
    this.getCreatOrderList();
    this.creatOrderArray = [];
  }

  //进入页面，请求接口，得到数据
  getCreatOrderList() {
    this.loadingShow = true;
    let url = `${AppConfig.API.getBrandshopProducts}?brandshopSeq=133&start=${this.start}&limit=${this.limit}`;
    this.appService.httpGet(url).then( data => {
      this.loadingShow = false;
      if (data.totalRecord == 0) {
        //空空如也
        this.noData = true;
      }else {
        this.noData = false;
        if( this.start < data.totalRecord ) {
          if (this.up) {
            this.creatOrderArray.push(...data.data);
            this.start += this.limit;
          }else if (this.down){
            this.creatOrderArray = data.data;
            this.start += this.limit;
          }
        }else {
          this.showNoMore = true;
        }
      }
      
    }).catch(error => {
      this.loadingShow = false;
      console.log(error);
      this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
    });
  }

  addProductModal(index) {
	  const orderModal = this.modalCtrl.create(OrderLayer, {
      productSeq: this.creatOrderArray[index].productSeq,
      productName: this.creatOrderArray[index].productName,
      warehouseCount: this.warehouseCount,
      fileSeq: this.creatOrderArray[index].fileSeq
    }, {
	    cssClass: 'order-sku-list'
    });
	  orderModal.present();
  }
  orderRepertory () {
	  this.navCtrl.push(OrderStore);
  }

  // 搜索
  onInput(event) {
    this.down = true;
    this.up = false;
    this.start = 0;
    this.searchKeyWord = event.target.value;
    if (this.searchKeyWord){
      this.loadingShow = true;
      let url = `${AppConfig.API.getBrandshopProducts}?brandshopSeq=133&searchKeyWord=${this.searchKeyWord}&start=${this.start}&limit=${this.limit}`;
      this.appService.httpGet(url).then( data => {
        this.loadingShow = false;
        if (data.totalRecord == 0) {
          //空空如也
          this.noData = true;
          this.showNoMore = false;
        }else {
          this.noData = false;
          if( this.start < data.totalRecord ) {
            if (this.up) {
              this.creatOrderArray.push(...data.data);
              this.start += this.limit;
            }else if (this.down){
              this.creatOrderArray = data.data;
              this.start += this.limit;
            }
          }else {
            this.showNoMore = true;
          }
        }
      }).catch(error => {
        console.log(error);
        this.loadingShow = false;
      });
    }else {
      this.getCreatOrderList();
    }
  }

  // 下拉刷新请求数据
  refreshGetCreatOrderList(refresher) {
    this.start = 0;
    this.down = true;
	  this.up = false;
    let url = `${AppConfig.API.getBrandshopProducts}?brandshopSeq=133&start=${this.start}&limit=${this.limit}`;
    this.appService.httpGet(url).then( data => {
      refresher.complete();
      if (data.totalRecord == 0) {
        //空空如也
        this.noData = true;
      }else {
        this.noData = false;
        if (data.data.length != 0) {
          this.creatOrderArray = data.data;
          this.start += this.limit;
        }else {
          this.showNoMore = true;
        }
      }
    }).catch(error => {
      refresher.complete();
      console.log(error);
      this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
    });
  }

  // 上拉刷新请求数据
  infiniteGetCreatOrderList(infiniteScroll) {
    this.down = false;
	  this.up = true;
    if (this.searchKeyWord) {
      let url = `${AppConfig.API.getBrandshopProducts}?brandshopSeq=133&searchKeyWord=${this.searchKeyWord}&start=${this.start}&limit=${this.limit}`;
      this.appService.httpGet(url).then( data => {
        infiniteScroll.complete();
        if (data.totalRecord == 0) {
          //空空如也
          this.noData = true;
        }else {
          if (data.data.length != 0) {
            this.creatOrderArray.push(...data.data);
            this.start += this.limit;
          }else {
            this.showNoMore = true;
          }
        }
      }).catch(error => {
        console.log(error);
      });
    }else {
      let url = `${AppConfig.API.getBrandshopProducts}?brandshopSeq=133&start=${this.start}&limit=${this.limit}`;
      this.appService.httpGet(url).then( data => {
        infiniteScroll.complete();
        if (data.totalRecord == 0) {
          //空空如也
          this.noData = true;
        }else {
          this.noData = false;
          if (data.data.length != 0) {
            this.creatOrderArray.push(...data.data);
            this.start += this.limit;
          }else {
            this.showNoMore = true;
          }
        }
      }).catch(error => {
        infiniteScroll.complete();
        console.log(error);
        this.appService.toast('网络异常，请稍后再试', 1000, 'middle');
      });
    }
  }

  //查看配单仓订单总数
  getWarehouseCount() {
    let url = `${AppConfig.API.warehouseGetCount}`;
    this.appService.httpGet(url).then( number => {
      this.warehouseCount = number;
    }).catch(error => {
      console.log(error);
      this.appService.toast('获取配单仓数目失败，请稍后重试', 1000, 'middle');
    });
  }

  //再来一单按钮进来后，更新配单仓数量
  ionViewDidEnter() {
    this.getWarehouseCount();
  }
}
