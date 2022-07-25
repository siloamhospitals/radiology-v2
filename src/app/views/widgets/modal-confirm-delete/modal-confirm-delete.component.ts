import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';

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
  
  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  public selectedText: string = '';

  ngOnInit() {
    console.log(this.modalitySlot)
  }

  public deleteData() {
    this.activeModal.close('OK');
  }

  public test() {
    this.activeModal.close('clear');
  }
}
