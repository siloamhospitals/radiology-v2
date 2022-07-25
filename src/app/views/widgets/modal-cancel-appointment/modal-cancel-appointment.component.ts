import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-cancel-appointment',
  templateUrl: './modal-cancel-appointment.component.html',
  styleUrls: ['./modal-cancel-appointment.component.css']
})
export class ModalCancelAppointmentComponent implements OnInit {

  public static readonly OK = 'OK';
  public static readonly CLOSE = 'CLOSE';
  public note = '';

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  public selectedText: string = '';

  ngOnInit() {
  }

  back(){
    this.activeModal.close();
  }

  close() {
    const data = {
      result: ModalCancelAppointmentComponent.OK,
      note: this.selectedText,
    };
    this.activeModal.close(data);
  }
}

export interface ModalConfirmCancelInput {
  readonly message: string;
  readonly toggleNote?: boolean;
}
