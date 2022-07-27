import { isOk } from '../../../utils/response.util';
import { RadiologyAppointmentRequest } from './../../../models/radiology/request/radiology-appointment-request';
import { channelId, sourceApps } from './../../../variables/common.variable';
import { ModalityService } from './../../../services/modality.service';
import { GeneralService } from './../../../services/general.service';
import { PatientService } from './../../../services/patient.service';
import { AddedModality } from './../../../models/radiology/created-appointment-modality';
import { AlertService } from './../../../services/alert.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WidgetBaseComponent } from '../widget-base/widget-base.component';
import * as moment from 'moment';
import { omit } from 'lodash';
import { isValidEmail, isValidPhoneNumber } from '../../../utils/helpers.util';

@Component({
  selector: 'app-modal-new-patient',
  templateUrl: './modal-new-patient.component.html',
  styleUrls: ['./modal-new-patient.component.css']
})
export class ModalNewPatientComponent extends WidgetBaseComponent implements OnInit, OnDestroy {
  constructor(
    private activeModal: NgbActiveModal,
    private patientService: PatientService,
    private generalService: GeneralService,
    private modalityService: ModalityService,
    alertService: AlertService,
  ) {
    super(alertService, 'modal-search-patient-main-alert');
  }

  @Input() selectedAppointment: any;
  public key: any = JSON.parse(localStorage.getItem('key') || '{}');
  public hospital = this.key.hospital;
  public user = this.key.user;
  public userId: string = this.user.id;
  private userName: string = this.user.fullname;
  public source: string = sourceApps;
  public selectedModality: AddedModality;
  public edittedModality: any = {
    index: '',
    modalityHospitalId: '',
    modalityExaminationId: '',
    reserveDate: moment().format('YYYY-MM-DD'),
    notes: '',
    isBpjs: false,
    isAnesthesia: false,
    duration: 0,
    modalityLabel: '',
    roomName: ''
  };
  public nationalTypeIds: any = [];
  public examinationsList: any = [];
  public modalityHospitalList: any = [];
  public modalityAppointmentList: any = [];
  public model: any = {
    birthDate: '',
    name: '',
    mrLocalNo: '',
    identityNumber: '',
    identityTypeId: '',
    phoneNumber1: '',
    emailAddress: '',
  };


  // buttons
  public isSubmitting: boolean = false;
  public isExaminationButtonDisabled: boolean = true;
  public showModalityList: boolean = false;
  public isErrorTimer : boolean;
  public isFormValid: boolean = true;

  ngOnInit() {
    this.onDefaultSelected();
    this.getModalityHospitalList();
    this.getNationalityIdType();
  }

  getModalityHospitalList() {
    if(this.selectedModality.reserveDate) {
      const dateString = this.selectedModality.reserveDate.format('YYYY-MM-DD')
      this.modalityService.getModalityHospital(this.hospital.id, dateString, dateString)
        .subscribe(res => {
          const activeModalityHospital = res.data.map((eachModality: any) => {
              if (eachModality.status === '1') return eachModality;
            }
          );
          this.modalityHospitalList = activeModalityHospital;
        }, () => {
          this.modalityHospitalList = [];
        });
    } else {
      this.modalityHospitalList = [];
    }
  }

  getNationalityIdType() {
    this.generalService.getNationalityIdType()
      .subscribe(res => {
        this.nationalTypeIds = res.data
      })
      , () => {
        this.nationalTypeIds = [];
      }
  }

  getModalityExamination(val?:any) {
    this.modalityService.getModalityExamination(val)
      .subscribe(res => {
        this.examinationsList = res.data
      }), () => {
        this.examinationsList = [];
      }
  }

  close() {
    // this.selectedAppointment.refreshTableDaily()
    this.activeModal.close();
  }

  onDefaultSelected() {
    const {
      modalityHospitalId, fromTime, toTime, reserveDate, modalityLabel, roomName, duration,
      birthDate, patientName, mrLocalNo, idNumber, nationalIdTypeId,
    } = this.selectedAppointment;
    this.selectedModality = {
      ...this.selectedModality,
      isBpjs: false,
      isAnesthesia: false,
      fromTime,
      toTime,
      modalityHospitalId,
      reserveDate,
      duration,
      modalityLabel,
      roomName,
      notes: '',
      modalityExaminationId: '',

    }

    this.model = {
      birthDate,
      name: patientName,
      mrLocalNo,
      identityNumber: idNumber,
      identityTypeId: nationalIdTypeId
    }

    if (this.selectedModality.modalityHospitalId) {
      this.isExaminationButtonDisabled = false;
      this.getModalityExamination(this.selectedModality.modalityHospitalId);
    }
  }

  onChangeModality() {
    this.isExaminationButtonDisabled = false;
    if (this.edittedModality.modalityHospitalId) {
      this.edittedModality.modalityExaminationId = ''
      this.getModalityExamination(this.edittedModality.modalityHospitalId);
    } else {
      this.selectedModality.modalityExaminationId = ''
      this.getModalityExamination(this.selectedModality.modalityHospitalId);
    }
  }

  compareByModalityHospital(itemOne?: any, itemTwo?: any) {
    return itemOne && itemTwo && itemOne.modality_hospital_id == itemTwo.modality_hospital_id;
  }

  isEditing() {
    return !!this.edittedModality.modalityHospitalId
  }

  onChangeDate = async () => {
    await this.getModalityHospitalList();
  }

  onChangeTimer = () => {
    if (this.isEditing()) {
      const toTime = moment(this.edittedModality.toTime, 'HH:mm')
      const fromTime = moment(this.edittedModality.fromTime, 'HH:mm')
      if(toTime.isSameOrBefore(fromTime)){
        this.isErrorTimer = true
      }else {
        this.isErrorTimer = false
      }
    } else {
      const toTime = moment(this.selectedModality.toTime, 'HH:mm')
      const fromTime = moment(this.selectedModality.fromTime, 'HH:mm')
      if(toTime.isSameOrBefore(fromTime)){
        this.isErrorTimer = true
      }else {
        this.isErrorTimer = false
      }
    }
  }

  cancelModality() {
    this.onReset();
  }

  onReset() {
    this.edittedModality = {};
    this.onResettedSelected();
  }

  onResettedSelected() {
    const { fromTime, toTime, reserveDate, duration } = this.selectedAppointment;
    this.selectedModality = {
      ...this.selectedModality,
      isBpjs: false,
      isAnesthesia: false,
      fromTime,
      toTime,
      modalityHospitalId: '',
      reserveDate,
      duration,
      modality_label: '',
      room_name: '',
      notes: '',
      modalityExaminationId: ''
    }
  }

  addModalityToList() {
    const objModality = this.modalityHospitalList.find((md :any) => md.modality_hospital_id === this.selectedModality.modalityHospitalId )
    let payloadAddedModal = {
      ...this.selectedModality,
      ...objModality,
    }
    payloadAddedModal.reserveDate = this.selectedModality.reserveDate.format('dddd, DD MMMM YYYY')
    this.modalityAppointmentList.push(payloadAddedModal);
    this.onReset()
  }

  editModalityToList() {
    const modalityAppointmentList = this.modalityAppointmentList.slice()
    const modality = this.modalityHospitalList.find((md :any) => md.modality_hospital_id === this.edittedModality.modalityHospitalId )
    const { fromTime, toTime, reserveDate } = this.edittedModality;
    modalityAppointmentList[this.edittedModality.index] = {
      ...this.edittedModality,
      ...modality,
      fromTime, toTime,
      reserveDate: reserveDate.format('dddd, DD MMMM YYYY')
    }
    this.modalityAppointmentList = modalityAppointmentList;
    this.onReset();
  }

  onAddedModality() {
    this.showModalityList = true;
  }

  onCreateAppointment() {
    this.isSubmitting = true;
    const isValid = this.validForm();
    if(isValid) {
      this.createNewContact();
      if (this.modalityAppointmentList.length > 0) {
        this.modalityAppointmentList.forEach((element: any) => {
          if(element.isSuccess){
            return;
          }
          const model = {
            ...element,
            ...this.model,
          };
          const payload = this.generatePayload(model);
          element.isLoading = true
          this.modalityService.postAppointment(payload)
            .subscribe((response) => {
              if (isOk(response)) {
                this.showSuccessAlert('Appointment Berhasil Dibuat', 2000);
              }
              this.isSubmitting = false;
              element.isSuccess = true
              element.messageError = null
              element.isLoading = false
              this.cancelModality();

            }, (error: any) => {
              this.isSubmitting = false;
              element.isSuccess = false
              element.messageError = (error.error && error.error.message) || error.message
              element.isLoading = false
            });
        });
        this.isFormValid = true;
        this.model = {
          birthDate: '',
          name: '',
          mrLocalNo: '',
          identityNumber: '',
          identityTypeId: '',
          phoneNumber1: '',
          emailAddress: '',
        }
      } else {
        const model = {
          ...this.selectedModality,
          ...this.model,
        };
        const payload = this.generatePayload(model);
        this.modalityService.postAppointment(payload)
          .subscribe((response) => {
            if (isOk(response)) {
              this.showSuccessAlert('Appointment Berhasil Dibuat', 2000);
            }
            this.isSubmitting = false;
            this.isFormValid = true;
            this.model = {
              birthDate: '',
              name: '',
              mrLocalNo: '',
              identityNumber: '',
              identityTypeId: '',
              phoneNumber1: '',
              emailAddress: '',
            }
          }, (error: any) => {
            this.isSubmitting = false;
            this.showErrorAlert(error.error.message, 2000);
          });
      }
    } else {
      this.showErrorAlert('Silahkan Isi Kolom yang Wajib Diisi Sebelum Menjadwalkan Pasien', 2000);
      this.isSubmitting = false;
      this.isFormValid = false;
    }
    return;
  }

  generatePayload(model: any) {
    const {
      phoneNumber1, address, notes, emailAddress, isBpjs, isAnesthesia
    } = model;
    const patientHopeId = model ? model.patientId : null;
    const reserveDate = moment(model.reserveDate).format('YYYY-MM-DD')
    const payload: RadiologyAppointmentRequest = {
      modalityHospitalId: model.modalityHospitalId,
      modalityExaminationId: model.modalityExaminationId,
      reserveDate,
      userId: this.userId,
      fromTime: model.fromTime,
      toTime: model.toTime,
      name: model.name,
      birthDate: model.birthDate,
      phoneNumber1,
      addressLine1: address,
      notes: notes,
      emailAddress,
      isWaitingList: false,
      patientHopeId,
      isBpjs,
      isAnesthesia,
      channelId: channelId.FRONT_OFFICE,
      userName: this.userName,
      source: this.source,
    };
    return payload;
  }

  formModalityValidation() {
    if(this.isEditing()){
      return this.isErrorTimer || !this.edittedModality.modalityExaminationId
    }else {
      return this.isErrorTimer || !this.selectedModality.modalityExaminationId
    }
  }

  onDeleteModality(val: any) {
    const filtered = this.modalityAppointmentList.filter((list: any) => list !== val );
    this.modalityAppointmentList = filtered;
    this.edittedModality = {};
  }

  onEditModality(index: any) {
    this.edittedModality = { ...this.modalityAppointmentList[index] }
    this.edittedModality.index = index;
    this.edittedModality.reserveDate = moment(this.edittedModality.reserveDate, 'dddd, DD MMMM YYYY');
    this.getModalityExamination(this.edittedModality.modalityHospitalId);
  }

  createNewContact() {
    const omittedModal = omit(this.model, ['mrLocalNo']);
    omittedModal.birthDate = moment().format('YYYY-MM-DD')
    const payload = {
      ...omittedModal,
      channelId: channelId.FRONT_OFFICE,
      userId: this.userId,
    };
    this.patientService.addContact(payload).subscribe(
      () => {
        this.showSuccessAlert('Pasien Baru Berhasil Dibuat', 2000);
      }, error => {
        this.showErrorAlert(error.error.message, 2000);
      }
    );
  }

  validForm() {
    const {
      birthDate, name, identityNumber, identityTypeId, phoneNumber1, emailAddress,
    } = this.model

    if ( birthDate && name && identityNumber && identityTypeId && phoneNumber1 && emailAddress ) {
      console.log(birthDate)
      console.log(name)
      console.log(identityNumber)
      console.log(identityTypeId)
      console.log(phoneNumber1)
      console.log(emailAddress)
      const testPhone = this.isValidHandphone(phoneNumber1);
      console.log(testPhone, '=========== test phone')
      return true;
    } else {
      return false;
    }
  }

  isValidHandphone(phoneNumber: string) {
    return isValidPhoneNumber(phoneNumber);
  }

  isValidEmailAdress(email: string) {
    return isValidEmail(email);
  }

}
