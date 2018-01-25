import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { Login } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppService, AppConfig } from './app.service';
import { Buffer } from 'buffer';
import { Headers } from '@angular/http';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  // make TabsPage the root (or first) page
  rootPage: any;
  oauthTokenHeaders: any;
  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public appService: AppService
  ) {
    this.initializeApp();
    this.initializePage();
  }

  initializePage() {
    if (this.appService.getItem("tpb_token")) {
      let getItemNewDateMs = this.appService.getItem("newDateMS");
      if ((new Date()).getTime() < getItemNewDateMs) {
        this.rootPage = TabsPage;
      } else {
        let base64encode = new Buffer(`${AppConfig.client_id}:${AppConfig.secret}`).toString('base64');
        this.oauthTokenHeaders = new Headers({
          'Authorization': 'Basic ' + base64encode,
          'Content-Type': 'application/x-www-form-urlencoded'
        });
        let oauthTokenUrl = AppConfig.oauthTokenUrl;
        let body = `grant_type=refresh_token&refresh_token=${this.appService.getItem("refresh_token")}`;
        this.appService.httpPostHeader(oauthTokenUrl, body, this.oauthTokenHeaders).then(data => {
          let newDateMS = (new Date()).getTime() + data.expires_in * 1000 - AppConfig.RESERVED_TIME;
          this.appService.setItem("newDateMS", newDateMS);
          this.appService.setItem("tpb_token", data.access_token);
          this.appService.setItem("refresh_token", data.refresh_token);
          this.rootPage = TabsPage;
        }).catch(err => {
          console.log(err);
          this.appService.toast('登录已过期，请重新登录', 1000, 'middle');
          this.appService.setItem("tpb_token", "");
          this.appService.setItem("refresh_token", "");
          this.rootPage = Login;
        })
      }
    } else {
      this.rootPage = Login;
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
