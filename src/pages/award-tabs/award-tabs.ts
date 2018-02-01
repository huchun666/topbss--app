import { Content } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { AwardActivity } from '../award-activity/award-activity';
import{ AwardOrderPage } from '../award-order/award-order';
@Component({
  selector: 'award-tabs',
  templateUrl: 'award-tabs.html'
})
export class AwardTabs {
  @ViewChild(Content) content: Content;
  awardOrder: any = AwardOrderPage;
  awardActivity: any = AwardActivity;
  constructor() {
    
  }
}
