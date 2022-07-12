import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-cancel-appointment',
  templateUrl: './modal-cancel-appointment.component.html',
  styleUrls: ['./modal-cancel-appointment.component.css']
})
export class ModalCancelAppointmentComponent implements OnInit {
  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  public selectedText: string = '';

  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }
}
