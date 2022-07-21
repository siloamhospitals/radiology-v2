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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-modal-detail-schedule',
  templateUrl: './modal-detail-schedule.component.html',
  styleUrls: ['./modal-detail-schedule.component.css']
})
export class ModalDetailScheduleComponent implements OnInit {
  @Input() selectedAppointment: any
  public examinations: Examination[] = [];
  public key: any = JSON.parse(localStorage.getItem('key')!);
  public hospital = this.key.hospital;
  public user = this.key.user;
  public userId: string = this.user.id;
  public source: string = 'Front Office';
  public isBpjs: false;
  public modalityExaminationId: any;
  public isAnesthesia: false;
  public note: any;
  public getUserPayload(): BasicRequest {
    const key: any = JSON.parse(localStorage.getItem('key')!);
    const user = key.user;
    return {
      userId: user.id,
      userName: user.fullname,
      source: sourceApps
    };
  }
  private userName: string = this.user.fullname;
  public fromTime: any;
  public toTime: any;
  public updateAppointmentForm:any = FormGroup;
  

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private radiologyService : RadiologyService,
    private _fb: FormBuilder,
    modalSetting: NgbModalConfig,
  ) {
    modalSetting.backdrop = 'static';
    modalSetting.keyboard = false;
    // modalSetting.centered = true;
  }

  date : any = moment()

  ngOnInit() {
    console.log(this.selectedAppointment)
    this.updateAppointmentForm = this._fb.group({
      modalityExaminationId: [{value: this.selectedAppointment.modality_examination_id, disabled: false}, [Validators.required]],
      is_bpjs: [{value: this.selectedAppointment.is_bpjs, disabled: false}, [Validators.required]],
      is_anesthesia: [{value: this.selectedAppointment.is_anesthesia, disabled: false}, [Validators.required]],
      note: [{value: this.selectedAppointment.note, disabled: false}],
    });
    this.onChangeDefaultSelected();
    this.fillExaminations(this.selectedAppointment.modality_hospital_id);
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

  cancelAppointment(item: any = this.selectedAppointment) {
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
            location.reload();
          } else {
            this.showErrorAlert('Delete failed');
          }
        });
    }
  }, (_) => {});
}

  public updateAppointment() {
  const payload = {
    modalityExaminationId: this.updateAppointmentForm.controls.modalityExaminationId.value,
    modalityHospitalId: this.selectedAppointment.modality_hospital_id,
    modalityOperationalId: this.selectedAppointment.modality_operational_id,
    modalitySlotId: this.selectedAppointment.modality_slot_id,
    channelId: '2',
    isWaitingList: false,
    fromTime: this.selectedAppointment.from_time,
    toTime: this.selectedAppointment.to_time,
    notes: this.updateAppointmentForm.controls.note.value,
    isBpjs: this.updateAppointmentForm.controls.is_bpjs.value,
    isAnesthesia: this.updateAppointmentForm.controls.is_anesthesia.value,
    userId: this.userId,
    userName: this.userName,
    source: this.source,
    reserveDate: this.selectedAppointment.reserve_date
  };
  if(payload.fromTime === this.fromTime && payload.toTime === this.toTime) {
    this.radiologyService.putAppointment(payload)
    .subscribe((response) => {
      if (isOk(response)) {
        this.showSuccessAlert(response.message);
        this.activeModal.close('success');
      }
      // location.reload();
    }, () => {
      this.showErrorAlert('Update gagal');
    });
  }else{
    this.radiologyService.reschedule(payload)
    .subscribe((response) => {
      if (isOk(response)) {
        this.showSuccessAlert(response.message);
      }
      // location.reload();
    }, () => {
      this.showErrorAlert('Update gagal');
    });
  }
  
  }

  onChangeDefaultSelected() {
    this.fromTime = this.selectedAppointment.from_time;
    this.toTime = this.selectedAppointment.to_time;
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


