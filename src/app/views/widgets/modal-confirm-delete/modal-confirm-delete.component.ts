import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-confirm-delete',
  templateUrl: './modal-confirm-delete.component.html',
  styleUrls: ['./modal-confirm-delete.component.css']
})

export class ModalConfirmDeleteComponent implements OnInit {
  @Input() itemId: string;
  @Input() msg: string;
  @Input() service: any;
  @Input() modalitySlot: any = [];
  @Input() headerMsg: string;
  @Input() msgUpadte: string;
  @Input() maintenance: boolean = false;
  
  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  public selectedText: string = '';
  public reserveDate: string = '';

  ngOnInit() {
    if(this.modalitySlot.length != 0){
      this.reserveDate = moment(this.modalitySlot[0].reserve_date).format('YYYY-MM-DD');
    }
  }

  public deleteData() {
    this.activeModal.close('OK');
  }

  public test() {
    this.activeModal.close('clear');
  }
}
