import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment'
import { AlertService } from '../../../services/alert.service';
import { ModalCancelAppointmentComponent } from '../modal-cancel-appointment/modal-cancel-appointment.component';
import { ModalCreateAdmissionComponent } from '../modal-create-admission/modal-create-admission.component';
import { ModalQueueNumberComponent } from '../modal-queue-number/modal-queue-number.component';
import { ModalHistoryComponent } from '../modal-history/modal-history.component';
import { RadiologyService } from '../../../services/radiology/radiology.service';
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
  public errorTimer: boolean;
  public errorMsg: string;


  admissionLateTime: any = null
  admissionIsNotToday: boolean = false

  @ViewChild('modalConfirmPatient') modalConfirmPatientData: ElementRef
  @ViewChild('modalConfirmAdmission') modalConfirmAdmission: ElementRef
  @ViewChild('modalConfirmCheckIn') modalConfirmCheckIn: ElementRef

  constructor(
    public alertService: AlertService,
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
      notes: [{value: this.selectedAppointment.notes, disabled: false}],
    });
    this.onChangeDefaultSelected();
    this.fillExaminations(this.selectedAppointment.modality_hospital_id);
  }

  close(isSuccess? : boolean) {
    // this.selectedAppointment.refreshTableDaily();
    this.activeModal.close(isSuccess);
  }

  createAdmission() {
    const openModalAdmission = () => {
      // Open Modal Admission
      this.close()
      const m = this.modalService.open(ModalCreateAdmissionComponent, { windowClass: 'modal_create_admission' })
      m.componentInstance.modelId = this.selectedAppointment && this.selectedAppointment.modality_slot_id ? this.selectedAppointment.modality_slot_id : null
      m.componentInstance.selectedModel = this.selectedAppointment
      // console.log('selectedModel', this.selectedAppointment, m.componentInstance.selectedModel)
      m.result.then((result: any) => {
        console.log('modal is closed', {result})
      })
    }
    const {
      local_mr_no: localMrNo,
      to_time: toTime,
      reserve_date: reserveDate}
    = this.selectedAppointment
    // Check Patient Data is Complete
    if (!localMrNo) {
      this.modalService.open(this.modalConfirmPatientData, { centered: true })
      return
    }
    // Check On Late
    const lastTime = moment(`${reserveDate} ${toTime}`, 'YYYY-MM-DD HH:mm')
    const diffTime = moment().diff(lastTime)
    if (diffTime > 0) {
      this.admissionLateTime = moment.utc(diffTime).format('HH [jam] mm [menit] ss [detik]')
      this.admissionIsNotToday = moment().isAfter(lastTime, 'days')
      const c = this.modalService.open(this.modalConfirmAdmission, { centered: true })
      c.result.then((_result: any) => {
        openModalAdmission()
      }).catch((_e) => {
        console.log('MODAL_CLOSE', _e)
      })
    } else {
      openModalAdmission()
    }
  }

  inputQueueNumber() {
    const openModalVisitNumber = () => {
      const m = this.modalService.open(ModalQueueNumberComponent, { windowClass: 'modal_queue_number', centered: true })
      m.componentInstance.data = this.selectedAppointment;
      m.result.then((result: any) => {
        console.log('modal is closed', {result})
      })
    }
    const {
      local_mr_no: localMrNo,
      to_time: toTime,
      reserve_date: reserveDate}
    = this.selectedAppointment
    // Check Patient Data is Complete
    if (!localMrNo) {
      this.modalService.open(this.modalConfirmPatientData, { centered: true })
      return
    }
    // Check On Late
    const lastTime = moment(`${reserveDate} ${toTime}`, 'YYYY-MM-DD HH:mm')
    const diffTime = moment().diff(lastTime)
    if (diffTime > 0) {
      this.admissionLateTime = moment.utc(diffTime).format('HH [jam] mm [menit] ss [detik]')
      this.admissionIsNotToday = moment().isAfter(lastTime, 'days')
      const c = this.modalService.open(this.modalConfirmCheckIn, { centered: true })
      c.result.then((_result: any) => {
        openModalVisitNumber()
      }).catch((_e) => {
        console.log('MODAL_CLOSE', _e)
      })
    }else {
      openModalVisitNumber()
    }
  }

  showHistoryModal() {
    const m = this.modalService.open(ModalHistoryComponent, { windowClass: 'modal_history', centered: true })
    m.componentInstance.modalitySlotId = this.selectedAppointment.modality_slot_id
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
    const m = this.modalService.open(ModalCancelAppointmentComponent, { windowClass: 'modal_cancel_appointment', centered: true })
    m.result.then((result: any) => {if (result.result === 'OK') {
      this.radiologyService.deleteAppointment(item.modality_slot_id, {
        ...this.getUserPayload(),
        note: result.note,
      })
        .subscribe((res) => {
          if (isOk(res)) {
            this.showSuccessAlert(res.message);
            this.close(true);
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
      notes: this.updateAppointmentForm.controls.notes.value,
      isBpjs: this.updateAppointmentForm.controls.is_bpjs.value,
      isAnesthesia: this.updateAppointmentForm.controls.is_anesthesia.value,
      userId: this.userId,
      userName: this.userName,
      source: this.source,
      reserveDate: this.selectedAppointment.reserve_date
    };
    if(moment(payload.fromTime, 'hh:mm').isSameOrAfter(moment(payload.toTime, 'hh:mm'))) {
      this.showErrorAlert('Jam mulai harus lebih kecil dari pada jam selesai')
    }
    if(moment(payload.toTime, 'hh:mm').isSameOrBefore(moment(payload.fromTime, 'hh:mm'))){
      this.showErrorAlert('Jam selesai harus lebih besar dari pada jam mulai')
    }

    if(payload.fromTime === this.fromTime && payload.toTime === this.toTime) {
      this.radiologyService.putAppointment(payload)
      .subscribe((response) => {
        if (isOk(response)) {
          this.showSuccessAlert(response.message);
          this.close(true)
        }
      }, () => {
        this.showErrorAlert('Update gagal');
      });
    }else{
      this.radiologyService.reschedule(payload)
      .subscribe((response) => {
        if (isOk(response)) {
          this.showSuccessAlert(response.message);
          this.close(true)
        }
        // location.reload();
      }, () => {
        this.showErrorAlert('Update gagal');
      });
    }
  }

  onChangeTimer = () => {
    const toTime = moment(this.selectedAppointment.to_time, 'HH:mm')
    const fromTime = moment(this.selectedAppointment.from_time, 'HH:mm')
    if(toTime.isSameOrBefore(fromTime)){
      this.errorTimer = true
      this.errorMsg = 'Jam selesai harus lebih besar dari pada jam mulai'
    }else if(fromTime.isSameOrAfter(toTime)){
      this.errorTimer = true
      this.errorMsg = 'Jam mulai harus lebih kecil dari pada jam selesai'
    }else {
      this.errorTimer = false
    }
  }


  onChangeDate = () => {
    this.selectedAppointment.reserve_date = this.selectedAppointment.reserveDate.format('YYYY-MM-DD');
  }

  onChangeDefaultSelected() {
    this.fromTime = this.selectedAppointment.from_time;
    this.toTime = this.selectedAppointment.to_time;
  }

  validateForm() {
    return this.errorTimer
  }

  public showSuccessAlert(message: string) {
    Swal.fire({
      type: 'success',
      title: 'Success',
      text: message,
      timer: 3000
    });
  }

  public showErrorAlert(message: string) {
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: message,
      timer: 3000
    });
  }
}


