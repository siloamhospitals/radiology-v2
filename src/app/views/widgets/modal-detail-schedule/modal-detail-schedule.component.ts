import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment'
import { ModalCancelAppointmentComponent } from '../modal-cancel-appointment/modal-cancel-appointment.component';
import { ModalCreateAdmissionComponent } from '../modal-create-admission/modal-create-admission.component';
import { ModalHistoryComponent } from '../modal-history/modal-history.component';
import { RadiologyService } from 'src/app/services/radiology/radiology.service';
import {Examination} from '../../../models/radiology/examination';
import {sourceApps} from '../../../variables/common.variable';
import {isOk} from '../../../utils/response.util';
import Swal from 'sweetalert2';
import BasicRequest from '../../../models/radiology/requests/basic-request';


@Component({
  selector: 'app-modal-detail-schedule',
  templateUrl: './modal-detail-schedule.component.html',
  styleUrls: ['./modal-detail-schedule.component.css']
})
export class ModalDetailScheduleComponent implements OnInit {
  @Input() data: any
  public examinations: Examination[] = [];
  public key: any = JSON.parse(localStorage.getItem('key')!);
  public hospital = this.key.hospital;
  public user = this.key.user;
  public userId: string = this.user.id;
  private userName: string = this.user.fullname;
  public source: string = sourceApps;
  public isBpjs: false;
  public modalityExaminationId: any;
  public isAnesthesia: false;
  public note: any;
  public bpjsValue: any = '';
  public anastesiValue: any = '';
  public getUserPayload(): BasicRequest {
    const key: any = JSON.parse(localStorage.getItem('key')!);
    const user = key.user;
    return {
      userId: user.id,
      userName: user.fullname,
      source: sourceApps
    };
  }
  

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private radiologyService : RadiologyService,
    modalSetting: NgbModalConfig,
  ) {
    modalSetting.backdrop = 'static';
    modalSetting.keyboard = false;
    // modalSetting.centered = true;
  }

  date : any = moment()

  ngOnInit() {
    this.fillExaminations(this.data.modality_hospital_id);
    this.note = this.data.note
    this.isBpjs = this.data.isBpjs
    this.modalityExaminationId = this.data.modality_examination_id
  }

  close() {
    this.activeModal.close();
  }

  createAdmission() {
    const m = this.modalService.open(ModalCreateAdmissionComponent, { windowClass: 'modal_create_admission' })
    m.result.then((result: any) => {
      console.log('modal is closed', {result})
    })
  }

  showHistoryModal() {
    const m = this.modalService.open(ModalHistoryComponent, { windowClass: 'modal_history' })
    m.result.then((result: any) => {
      console.log('modal is closed', {result})
    })
  }

  public fillExaminations(modalityHospitalId: any) {
    if (modalityHospitalId == null) {
      return;
    }
    this.radiologyService.getModalityExaminations(modalityHospitalId)
      .subscribe((response) => {
        this.examinations = response.data;
      });
  }

  cancelAppointment(item: any = this.data) {
    console.log(item)
    const m = this.modalService.open(ModalCancelAppointmentComponent, { windowClass: 'modal_cancel_appointment' })
    m.result.then((result: any) => {if (result.result === 'OK') {
      this.radiologyService.deleteAppointment(item.modality_slot_id, {
        ...this.getUserPayload(),
        note: result.note,
      })
        .subscribe((res) => {
          if (isOk(res)) {
            this.showSuccessAlert(res.message);
          } else {
            this.showErrorAlert('Delete failed');
          }
        });
    }
  }, (_) => {});
}

  public updateAppointment() {
   
    const payload = {
      modalityExaminationId: this.modalityExaminationId,
      modalityHospitalId: this.data.modality_hospital_id,
      modalityOperationalId: this.data.modality_operational_id,
      modalitySlotId: this.data.modality_slot_id,
      channelId: '2',
      notes: this.note,
      isBpjs: this.isBpjs,
      isAnesthesia: this.isAnesthesia,
      userId: this.userId,
      userName: this.userName,
      source: this.source,
    };
    console.log(payload)
    this.radiologyService.putAppointment(payload)
      .subscribe((response) => {
        if (isOk(response)) {
          this.showSuccessAlert(response.message);
        }
      }, () => {
        this.showErrorAlert('Update gagal');
      });
  }

  async onChangeBpjsResult(event: any) {
    this.isBpjs = event.target.value;
  }
  public showSuccessAlert(message: string) {
    Swal.fire({
      type: 'success',
      title: 'Success',
      text: message,
      timer: 1500
    });
  }

  public showErrorAlert(message: string) {
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: message,
      timer: 1500
    });
  }
}


