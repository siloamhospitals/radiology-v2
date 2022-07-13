import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment'
import { ModalCancelAppointmentComponent } from '../modal-cancel-appointment/modal-cancel-appointment.component';
import { ModalCreateAdmissionComponent } from '../modal-create-admission/modal-create-admission.component';
import { ModalHistoryComponent } from '../modal-history/modal-history.component';

@Component({
  selector: 'app-modal-detail-schedule',
  templateUrl: './modal-detail-schedule.component.html',
  styleUrls: ['./modal-detail-schedule.component.css']
})
export class ModalDetailScheduleComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { }

  date : any = moment()

  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }

  cancelAppointment() {
    const m = this.modalService.open(ModalCancelAppointmentComponent, { windowClass: 'modal_cancel_appointment', backdrop: 'static', keyboard: false })
    m.result.then((result: any) => {
      console.log('modal is closed', {result})
    })
  }

  createAdmission() {
    const m = this.modalService.open(ModalCreateAdmissionComponent, { windowClass: 'modal_create_admission', backdrop: 'static', keyboard: false })
    m.result.then((result: any) => {
      console.log('modal is closed', {result})
    })
  }

  showHistoryModal() {
    const m = this.modalService.open(ModalHistoryComponent, { windowClass: 'modal_history', backdrop: 'static', keyboard: false })
    m.result.then((result: any) => {
      console.log('modal is closed', {result})
    })
  }
}
