import { Headers } from '@angular/http';
import { Component} from '@angular/core';
import { NavParams, App } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
import { TabsPage } from '../tabs/tabs';
@Component({
  selector: 'update-pwd',
  templateUrl: 'update-pwd.html'
})
export class UpdatePwd {
  initialPwd: string = "";//本页面初始密码
  prevInitialPwd: string;//上个页面密码
  newPwd: string = "";
  repeatPwd: string = "";
  isInitialPwd: Boolean = false;
  isNewPwd: Boolean = false;
  isRepeatPwd: Boolean = false;
  initialPwdValue: string;
  newPwdValue: string;
  repeatPwdValue: string;
  tpb_token: string;
  refresh_token: string;
  withTokenHeaders: any;
  user: any = {
    username: '',
    pwd: ''
  };
  rememberPassword: Boolean;
  constructor( 
    public navParams: NavParams,
    public appService: AppService,
    public app: App,
  ) {
    this.prevInitialPwd = this.navParams.get("initialPwd");
    this.tpb_token = this.navParams.get("tpb_token");
    this.refresh_token = this.navParams.get("refresh_token");
    this.user = this.navParams.get("user");
    this.rememberPassword = this.navParams.get("rememberPassword");
    console.log(this.user)
    this.withTokenHeaders = new Headers({
      'Authorization': 'Bearer '+ this.tpb_token
    });
  }
  confirm() {
    this.repeatPwdBlur();
    this.initialPwdBlur();
    this.newPwdBlur();
    if (!this.isInitialPwd && !this.isNewPwd && !this.isRepeatPwd && this.initialPwd != "" && this.newPwd != "" && this.repeatPwd != "") {
      let loading = this.appService.loading();
      loading.present();
      let url = AppConfig.API.editPassword;
      let body = {
        password: this.newPwd
      };
      this.appService.httpPostHeader(url, body, this.withTokenHeaders).then(data => {
        loading.dismiss();
        this.user = {
          username: this.user.username,
          pwd: this.newPwd
        };
        if (!this.rememberPassword) {
          this.user.pwd = ""; 
        };
        let newDateMS = (new Date()).getTime() + data.expires_in*1000 - AppConfig.RESERVED_TIME;
        this.appService.setItem("newDateMS", newDateMS);
        this.appService.setItem("user", JSON.stringify(this.user));
        this.appService.setItem("tpb_token", this.tpb_token);
        this.appService.setItem("refresh_token", this.refresh_token);
        if (data.type == "success") {
          this.appService.toast('修改成功', 1000, 'middle');
          let appNav = this.app.getRootNav();
          appNav.setRoot(TabsPage);
        }
      }).catch(error => {
        this.appService.getToken(error, () => {
          this.confirm();
        });
        loading.dismiss();
        console.log(error);
        this.appService.toast('网络错误，请稍后重试', 1000, 'middle');
      })
    }
  }
  initialPwdBlur() {
    if (this.initialPwd == "") {
      this.isInitialPwd = true;
      this.initialPwdValue = "*请输入出示密码";
    }else if (this.initialPwd != this.prevInitialPwd) {
      this.isInitialPwd = true;
      this.initialPwdValue = "*初始密码不正确，请重新输入";
    }else {
      this.isInitialPwd = false;
      this.initialPwdValue = "";
    }
  }
  newPwdBlur() {
    if (this.newPwd == "") {
      this.isNewPwd = true;
      this.newPwdValue = "*请输入新密码";
    }else {
      this.isNewPwd = false;
      this.newPwdValue = "";
    }
  }
  repeatPwdBlur() {
    if (this.repeatPwd == "") {
      this.isRepeatPwd = true;
      this.repeatPwdValue = "*请输入密码";
    }else if (this.repeatPwd != this.newPwd) {
      this.isRepeatPwd = true;
      this.repeatPwdValue = "*两次密码不一致";
    }else {
      this.isRepeatPwd = false;
      this.repeatPwdValue = "";
    }
  }
}
