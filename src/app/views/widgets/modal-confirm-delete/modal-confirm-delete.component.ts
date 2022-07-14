import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirm-delete',
  templateUrl: './modal-confirm-delete.component.html',
})
export class ModalConfirmDeleteComponent {
  @Input() itemId: string;
  @Input() msg: string;
  @Input() service: any;

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  public deleteData() {
    this.activeModal.close('OK');
  }

  public test() {
    this.activeModal.close('clear');
  }
}
