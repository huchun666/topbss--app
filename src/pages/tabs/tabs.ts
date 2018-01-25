import { Component } from '@angular/core';
import { Home } from '../home/home';
import { OrderList } from '../order-list/order-list';
import { Personl } from '../personl/personl';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  home = Home;
  orderList = OrderList;
  personl = Personl;
  constructor() {
  }
}