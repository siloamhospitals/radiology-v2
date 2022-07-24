import { AddedModality } from '../../../models/radiology/created-appointment-modality';
import { channelId, sourceApps } from './../../../variables/common.variable';
import { RadiologyAppointmentRequest } from './../../../models/radiology/request/radiology-appointment-request';
import { AlertService } from './../../../services/alert.service';
import { ModalityService } from './../../../services/modality.service';
import { GeneralService } from './../../../services/general.service';
import { NewPatientHope } from './../../../models/patients/patient-hope';
import { PatientService } from './../../../services/patient.service';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchPatientHopeGroupedRequest } from '../../../models/patients/search-patient-hope-grouped-request';
import * as moment from 'moment';
import { WidgetBaseComponent } from '../widget-base/widget-base.component';
import { isOk } from 'src/app/utils/response.util';

@Component({
  selector: 'app-modal-create-appointment',
  templateUrl: './modal-create-appointment.component.html',
  styleUrls: ['./modal-create-appointment.component.css']
})
export class ModalCreateAppointmentComponent extends WidgetBaseComponent implements OnInit, OnDestroy {

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
  public patientHope: NewPatientHope[];
  public search: any = {
    birthDate: '',
    patientName: '',
    mrLocalNo: '',
    idNumber: '',
    nationalIdTypeId: '',
  }

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
    modality_label: '',
    room_name: ''
  };

  public nationalTypeIds: any = [];
  public examinationsList: any = [];
  public modalityHospitalList: any = [];
  public modalityAppointmentList: any = [];
  public showPatientTable = '0';

  // buttons
  public isSubmitting: boolean = false;
  public isExaminationButtonDisabled: boolean = true;
  public isSelectedPatient: any;
  public showModalityList: boolean = false;
  public isLoadingPatientTable : boolean;
  @ViewChild('birthDate') birthDate: ElementRef
  public isErrorTimer : boolean;

  ngOnInit() {
    this.onDefaultSelected();
    this.getModalityHospitalList();
    this.getNationalityIdType();
    this.birthDate.nativeElement.focus()
  }

  ngOnChanges() {
    this.getNationalityIdType();
  }

  close() {
    this.activeModal.close();
  }

  getSearchedNameDob(ev : Event) {
    ev.preventDefault()

    if ((!this.search.patientName
      || !this.search.birthDate)) {
        this.showErrorAlert('Nama dan Tanggal Lahir Dibutuhkan.', 2000);
      return;
    }

    const formattedDob = moment(this.search.birthDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
    this.getSearchedPatient({
      ...this.search,
      birthDate: formattedDob,
    });
  }

  getSearchedMrLocal(ev : Event) {
    ev.preventDefault()

    if (!this.search.mrLocalNo) {
        this.showErrorAlert('Nomor MR Lokal Dibutuhkan.', 2000);
      return;
    }

    const formattedDob = this.search.birthDate ? moment(this.search.birthDate, 'DD-MM-YYYY').format('YYYY-MM-DD') : '';
    this.getSearchedPatient({
      ...this.search,
      birthDate: formattedDob,
    });
  }

  getSearchedIdNumber(ev : Event) {
    ev.preventDefault()

    if ((!this.search.idNumber
      || !this.search.nationalIdTypeId)) {
        this.showErrorAlert('Nomor Identitas Dibutuhkan.', 2000);
      return;
    }

    const formattedDob = this.search.birthDate ? moment(this.search.birthDate, 'DD-MM-YYYY').format('YYYY-MM-DD') : '';
    this.getSearchedPatient({
      ...this.search,
      birthDate: formattedDob,
    });
  }

  getSearchedPatient(request: SearchPatientHopeGroupedRequest) {
    this.isLoadingPatientTable = true
    this.patientService.searchPatientHopeGroup({
      ...request,
      nationalIdTypeId: request.idNumber ? request.nationalIdTypeId : '',
      hospitalId: this.hospital.id,
    }).subscribe(({ data = [] }) => {
      const patientHospital = data.map((patient : NewPatientHope) => {
          patient.patientHospitals = patient.patientHospitals.filter( hospital => hospital.hospitalId === this.hospital.id );
          return patient;
        }
      )
      if(request.idNumber && request.patientName && request.birthDate) {
        this.patientHope = patientHospital.filter((pt : NewPatientHope) => {          
          return request.patientName && request.patientName.includes(pt.name) && pt.birthDate === request.birthDate
        })
      }else {
        this.patientHope = patientHospital;
      }
      if(this.patientHope.length > 0) {
        this.showPatientTable = '2';
      } else {
        this.showPatientTable = '1';
      }
      this.isLoadingPatientTable = false
    }, () => {
      this.isLoadingPatientTable = false
    });
  }

  getNationalityIdType() {
    this.generalService.getNationalityIdType()
      .subscribe(res => this.nationalTypeIds = res.data),
      () => {
        this.nationalTypeIds = [];
      }
  }

  getModalityExamination(val?:any) {
    this.modalityService.getModalityExamination(val)
      .subscribe(res => {
        this.examinationsList = res.data
      }),
      () => {
        this.examinationsList = [];
      }
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

  onChangeDate = async () => {
    await this.getModalityHospitalList();
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

  public onCreateAppointment() {
    this.isSubmitting = true;
    if (this.modalityAppointmentList.length > 0) {
      this.modalityAppointmentList.forEach((element: any) => {
        if(element.isSuccess){
          return;
        }
        const payload = this.generatePayload(element);
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
            this.cancelModality()
          }, (error: any) => {
            this.isSubmitting = false;
            element.isSuccess = false
            element.messageError = (error.error && error.error.message) || error.message
            element.isLoading = false
          });
      });
    } else {
      const model = {
        ...this.selectedModality,
        ...this.isSelectedPatient,
      };
      const payload = this.generatePayload(model);
      this.modalityService.postAppointment(payload)
          .subscribe((response) => {
            if (isOk(response)) {
              this.showSuccessAlert('Appointment Berhasil Dibuat', 2000);
            }
            this.isSubmitting = false;
          }, (error: any) => {
            this.isSubmitting = false;
            this.showErrorAlert(error.error.message, 2000);
          });
    }
    return;
  }

  validateCreateAppointment() {
    let isValid = true;
    if (!this.selectedModality.modalityHospitalId) isValid = false;
    if (!this.selectedModality.modalityExaminationId) isValid = false;
    return isValid;
  }

  public generatePayload(model: any) {
    const {
      mobileNo1: phoneNumber, address, notes, emailAddress
    } = model;
    const patientHopeId = model ? model.patientId : null;
    const reserveDate = moment(model.reserveDate).format('YYYY-MM-DD')
    const payload: RadiologyAppointmentRequest = {
      modalityHospitalId: model.modalityHospitalId,
      contactId: model.contactId,
      modalityExaminationId: model.modalityExaminationId,
      reserveDate,
      userId: this.userId,
      fromTime: model.fromTime,
      toTime: model.toTime,
      name: model.name,
      birthDate: model.birthDate,
      phoneNumber1: phoneNumber,
      addressLine1: address,
      notes: notes,
      emailAddress,
      isWaitingList: false,
      patientHopeId,
      channelId: channelId.FRONT_OFFICE,
      userName: this.userName,
      source: this.source,
    };
    return payload;
  }

  onAddedModality() {
    this.showModalityList = true;
  }

  addModalityToList() {
    const objModality = this.modalityHospitalList.find((md :any) => md.modality_hospital_id === this.selectedModality.modalityHospitalId )
    let payloadAddedModal = {
      ...this.selectedModality,
      ...objModality,
      ...this.isSelectedPatient,
    }
    payloadAddedModal.reserveDate = this.selectedModality.reserveDate.format('dddd, DD MMMM YYYY')
    this.modalityAppointmentList.push(payloadAddedModal);
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

  onDefaultSelected() {
    const { modalityHospitalId, fromTime, toTime, reserveDate, modality_label, room_name, duration } = this.selectedAppointment;
    this.selectedModality = {
      ...this.selectedModality,
      isBpjs: false,
      isAnesthesia: false,
      fromTime,
      toTime,
      modalityHospitalId,
      reserveDate,
      duration,
      modality_label,
      room_name
    }

    if (this.selectedModality.modalityHospitalId) {
      this.isExaminationButtonDisabled = false;
      this.getModalityExamination(this.selectedModality.modalityHospitalId);
    }
  }

  cancelModality() {
    this.onReset();
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

  onReset() {
    this.edittedModality = {};
    this.onDefaultSelected();
  }

  isEditing() {
    return !!this.edittedModality.modalityHospitalId
  }

  onChangeTimer = () => {
    if(this.isEditing()) {
      const toTime = moment(this.edittedModality.toTime, 'HH:mm')
      const fromTime = moment(this.edittedModality.fromTime, 'HH:mm')
      if(toTime.isSameOrBefore(fromTime)){
        this.isErrorTimer = true
      }else {
        this.isErrorTimer = false
      }
    }else {
      const toTime = moment(this.selectedModality.toTime, 'HH:mm')
      const fromTime = moment(this.selectedModality.fromTime, 'HH:mm')
      if(toTime.isSameOrBefore(fromTime)){
        this.isErrorTimer = true
      }else {
        this.isErrorTimer = false
      }
    }
  }

  validasiFormModality() {
    if(this.isEditing()){
      return this.isErrorTimer || !this.edittedModality.modalityExaminationId
    }else {
      return this.isErrorTimer || !this.selectedModality.modalityExaminationId
    }
  }

}

