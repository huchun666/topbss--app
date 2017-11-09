import { Component} from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
@Component({
  selector: 'handle-selfgift',
  templateUrl: 'handle-selfgift.html'
})
export class HandleSelfgift {
  handleSeflGiftArray: any;
  noData: Boolean;
  start: number;
  showNoMoreGift: Boolean = true;
  constructor(public navCtrl: NavController, 
    public alertCtrl: AlertController, 
    public appConFig: AppConfig, 
    public appService: AppService,
  ) {
    // this.down = false;
		// this.up = true;
    //this.getHandleSelfGiftList()

    //模拟数据
    this.handleSeflGiftArray = [
      {
        "memberGiftAccountSeq": 260,
        "giftSeq": 11,
        "giftCode": "COUPON00020154",
        "giftName": "爱法呗赠品小马甲1",
        "giftType": "0",
        "imageName": "../assets/image/productimg.png",
        "giftRemark": "1.适用年龄：0-2岁 2.课程总共4节 5.需提前预约，再到店兑换使用",
        "brandshopSeq": 133,
        "brandshopName": "1001夜杭州旗舰店",
        "startDate": 1492706727000,
        "endDate": 1493916327000,
        "status": "0",
        "receiveDate": 1492706727000,
        "useDate": 1492713204000,
        "memberSeq": 435,
        "memberPhone": "18366155533",
        "reservePhone": "13214567890",
        "reserveShopTime": 1492713204000,
        "expressCompany": null,
        "expressNo": null,
        "deliveryTime": null,
        "brandshopUserSeq": 769,
        "brandshopUserName": "周二",
        "attrValueList": [],
      },
      {
        "memberGiftAccountSeq": 260,
        "giftSeq": 11,
        "giftCode": "COUPON00020154",
        "giftName": "爱法呗赠品小马甲2",
        "giftType": "1",
        "imageName": "../assets/image/productimg.png",
        "giftRemark": "1.适用年龄：0-2岁 2.课程总共4节 5.需提前预约，再到店兑换使用",
        "brandshopSeq": 133,
        "brandshopName": "1001夜杭州旗舰店",
        "startDate": 1492706727000,
        "endDate": 1493916327000,
        "status": "1",
        "receiveDate": 1492706727000,
        "useDate": 1492713204000,
        "memberSeq": 435,
        "memberPhone": "18366155533",
        "reservePhone": "",
        "reserveShopTime": null,
        "expressCompany": null,
        "expressNo": null,
        "deliveryTime": null,
        "brandshopUserSeq": 769,
        "brandshopUserName": "周三",
        "attrValueList": [],
      },
      // {
      //   id: 1,
			// 	name: "爱法呗赠品小马甲1",
			// 	memberPhone: "12131415161",
			// 	subscribePhone: "222222222",
      //   getTime: "2017.09.27 23:59",
      //   exchangeTime: "2017.09.27 11:59",
			// 	subscribeArriveTime: "2017.09.28 23:59",
			// 	imgUrl: "../assets/image/productimg.png",
      //   subscribeState: "1",//1: 预约兑换，2：到店兑换
      //   shoppingGuideName: "周三"
      // },
      // {
      //   id: 1,
			// 	name: "爱法呗赠品小马甲2",
			// 	memberPhone: "12131415161",
			// 	subscribePhone: "",
      //   getTime: "2017.09.27 23:59",
      //   exchangeTime: "2017.09.27 11:59",
			// 	subscribeArriveTime: "",
			// 	imgUrl: "../assets/image/productimg.png",
      //   subscribeState: "2",//1: 预约兑换，2：到店兑换
      //   shoppingGuideName: "王四"
      // }
    ]
  }
  
  //进入页面，请求接口，得到数据
  getHandleSelfGiftList() {
    let url = `$(this.appConFig.API.)?brandshopSeq=$(this.brandshopSeqId)&type=2&start=$(this.start)&limit=10`;
    this.appService.httpGet(url).then( data => {
    if (data.totalRecord == 0) {
      //空空如也
      this.noData = false;
    }else {
      this.noData = true;
      if( this.start < data.totalRecord ) {
        this.handleSeflGiftArray.push(...data.data);
        this.start+=10;
      }else {
        this.showNoMoreGift = false;
      }
    }
    
    }).catch(error => {
      console.log(error);
    });
  }
	refreshGetSelfGiftList(refresher) {
    // 下拉刷新请求数据
    // this.start = 0;
    // this.down = true;
	  // this.up = false;
    // setTimeout(() => {
    //   this.getHandleSelfGiftList();
    //   refresher.complete();
    // },1000)
  }
  infiniteGetSelfGiftList(infiniteScroll) {
    // 上拉刷新请求数据
    // this.down = false;
	  // this.up = true;
    // setTimeout(() => {
    //   this.getHandleSelfGiftList();
    //   infiniteScroll.complete();
    // },1000)
  }
}
