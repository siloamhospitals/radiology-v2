import { sourceApps } from './../../../variables/common.variable';
import { AlertService } from './../../../services/alert.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Alert, AlertType} from '../../../models/alerts/alert';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-queue-number',
  templateUrl: './modal-queue-number.component.html',
  styleUrls: ['./modal-queue-number.component.css']
})
export class ModalQueueNumberComponent implements OnInit {
  @Input() data: any;
  public alertMap: {[key: string]: Alert[]} = {};

  constructor(
    private activeModal: NgbActiveModal,
    private alertService: AlertService,
  ) { }
  public key: any = JSON.parse(localStorage.getItem('key') || '{}');
  public hospital = this.key.hospital;
  public user = this.key.user;
  public userId: string = this.user.id;
  public source: string = sourceApps;
  public visitId: any = null;
  public charLength: string;
  // public mask_visit_number = [/[a-zA-Z]/, /[a-zA-Z0-9]/, /\d/, /\d/, /\d/];
  public fieldError: boolean = true;
  public isSubmit: boolean = false;
  
  ngOnInit() {
    console.log(this.data, 'data dari admission')
    // this.data.patient_visit_number = 'A0001'
    this.data.modified_date = moment(this.data.modified_date).format('DD / MM / DD hh:mm:ss')
  }

  async checkCountChar() {
    let countChar = this.charRemove(this.visitId);
    this.charLength = countChar;
    if(this.charLength.length === 5) {
      this.fieldError = false;
    }else{
      this.fieldError = true;
    }
    console.log('🚀 ~ this.fieldError', this.fieldError);
  }

  charRemove(str: any) {
    if (str) {
      str = str.replace('(+62)', '0');
      str = str.replace(/_/g, '');
      str = str.replace(/ /g, '');
      str = str.replace(/ /g, '');
      str = str.substr(0, 2) == '00' ? str.substr(1) : str;
    }
    return str;
  }

  inputVisitCode(){
    this.visitId.toUpperCase()
    this.isSubmit = true
    console.log(this.visitId.toUpperCase())
  }

  close() {
    this.activeModal.close();
  }

  public actionSuccess() {
    this.alertService.success('Success to create appointment', false, 3000);
  }

  cssAlertType(alert: Alert) {
    if (!alert) {
      return;
    }

    switch (alert.type) {
      case AlertType.Success:
        return 'success';
      case AlertType.Error:
        return 'danger';
      case AlertType.Info:
        return 'info';
      case AlertType.Warning:
        return 'warning';
    }
  }

}
