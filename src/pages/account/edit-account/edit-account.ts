import { Component } from '@angular/core';
@Component({
  selector: 'edit-account',
  templateUrl: 'edit-account.html'
})
export class EditAccount {
  name: string = '';
  phone: string = '';
  idCard: string = '';
  constructor() {
    this.name = '张小花';
    this.phone = '13761489650';
    this.idCard = '420117198902080853';
  }
}
