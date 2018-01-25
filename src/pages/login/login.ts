import { Http, Headers } from '@angular/http';
import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { AppService, AppConfig } from '../../app/app.service';
import { Forget } from '../forget/forget';
import { TabsPage } from '../tabs/tabs';
import { Buffer } from 'buffer';
import { UpdatePwd } from '../update-pwd/update-pwd';
@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class Login {
  oauthTokenHeaders: any;
  loginHeaders: any;
  username: string = "";
  pwd: string = "";
  isUserName: boolean = false;
  isPwd: boolean = false;
  rememberPassword: boolean = true;
  userNameValue: string = "*账号不正确，请确认后重新输入";
  userPwdValue: string = "*请输入密码";
  constructor(
    public navCtrl: NavController,
    public app: App,
    public appService: AppService,
    public http: Http
  ) {
    this.pageInit();
  }
  pageInit() {
    let user = this.appService.getItem("user");
    if (user) {
      user = JSON.parse(user);
      this.username = user.username;
      this.pwd = user.pwd;
      if (this.pwd) {
        this.rememberPassword = true;
      } else {
        this.rememberPassword = false;
      }
    }
  }
  login() {
    if (this.pwd == "") {
      this.isPwd = true;
      this.userNameValue = "*请输入密码";
    } else {
      this.isPwd = false;
    }
    if (this.username == "") {
      this.isUserName = true;
      this.userNameValue = "*请输入账号或手机号";
    } else {
      this.isUserName = false;
    }
    if (this.isUserName == false && this.username != "" && this.pwd != "") {
      this.isPwd = false;
      let loading = this.appService.loading();
      loading.present();
      let base64encode = new Buffer(`${AppConfig.client_id}:${AppConfig.secret}`).toString('base64');
      this.oauthTokenHeaders = new Headers({
        'Authorization': 'Basic ' + base64encode,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      let oauthTokenUrl = AppConfig.oauthTokenUrl;
      let body = `username=${this.username}&password=${this.pwd}&grant_type=${AppConfig.grant_type}`;
      this.appService.httpPostHeader(oauthTokenUrl, body, this.oauthTokenHeaders).then(data => {
        if (data.access_token) {
          loading.dismiss();
          let firstLoginUrl = AppConfig.API.firstLogin;
          this.loginHeaders = new Headers(
            {
              'Authorization': 'Bearer ' + data.access_token
            });
          this.appService.httpGetHeader(firstLoginUrl, this.loginHeaders).then(firstLoginData => {
            let user = {
              username: this.username,
              pwd: this.pwd
            };
            if (!this.rememberPassword) {
              user.pwd = "";
            }
            if (firstLoginData.firstLogin == 1) {//初次登录
              let appNav = this.app.getRootNav();
              appNav.setRoot(UpdatePwd, { initialPwd: this.pwd, tpb_token: data.access_token, refresh_token: data.refresh_token, user: user, rememberPassword: this.rememberPassword });
            } else if (firstLoginData.firstLogin == 0) {
              let newDateMS = (new Date()).getTime() + data.expires_in * 1000 - AppConfig.RESERVED_TIME;
              this.appService.setItem("newDateMS", newDateMS);
              this.appService.setItem("user", JSON.stringify(user));
              this.appService.setItem("tpb_token", data.access_token);
              this.appService.setItem("refresh_token", data.refresh_token);
              let appNav = this.app.getRootNav();
              appNav.setRoot(TabsPage);
            }
          }).catch(error => {
            console.log(error);
            this.appService.toast('网络错误，请稍后重试', 1000, 'middle');
          })
        } else {
          loading.dismiss();
          this.appService.toast('网络错误，请稍后重试', 1000, 'middle');
        }
      }).catch(error => {
        loading.dismiss();
        console.log(`访问错误:${error}`);
        if (error.status == 400 && error.json().error == "invalid_grant") {
          this.appService.toast('用户名或密码错误', 1000, 'middle');
        } else {
          this.appService.toast('网络异常，请稍后重试', 1000, 'middle');
        }
      })
    }
  }
  //忘记密码
  forget() {
    this.navCtrl.push(Forget);
  }
  onblurAffirm() {
    if (this.username == '') {
      this.isUserName = true;
      this.userNameValue = '*账号不得为空'
    } else {
      this.isUserName = false;
      this.userNameValue = '*账号不正确，请确认后重新输入'
    }
  }
}
