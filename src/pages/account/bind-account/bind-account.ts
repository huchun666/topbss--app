import { Component } from '@angular/core';
import { NavParams, ModalController } from 'ionic-angular';
import { AddAccount } from '../add-account/add-account';
@Component({
  selector: 'bind-account',
  templateUrl: 'bind-account.html'
})
export class BindAccount {
  userId: any;
  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) {
    this.userId = this.navParams.get('param');
  }
  goAccount() {
    let accountModal = this.modalCtrl.create(AddAccount, { userId: this.userId });
    accountModal.present();
  }
}
