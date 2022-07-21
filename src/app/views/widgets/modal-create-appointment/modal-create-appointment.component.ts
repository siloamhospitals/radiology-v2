import { channelId, sourceApps } from './../../../variables/common.variable';
import { RadiologyAppointmentRequest } from './../../../models/radiology/request/radiology-appointment-request';
import { AlertService } from './../../../services/alert.service';
import { ModalityService } from './../../../services/modality.service';
import { GeneralService } from './../../../services/general.service';
import { NewPatientHope, PatientHope } from './../../../models/patients/patient-hope';
import { PatientService } from './../../../services/patient.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchPatientHopeGroupedRequest } from '../../../models/patients/search-patient-hope-grouped-request';
import * as moment from 'moment';
import { clone, pick } from 'lodash';
import { WidgetBaseComponent } from '../widget-base/widget-base.component';
import { isOk } from 'src/app/utils/response.util';
// import { isOk } from '../../../utils/response.util';
// import { Subscription } from 'rxjs';

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
  public choosedPatient: PatientHope;
  public search: any = {
    birthDate: '',
    patientName: '',
    mrLocalNo: '',
    idNumber: '',
    nationalIdTypeId: '',
  }

  public selectedModality: any = {
    modalityHospitalId: '',
    modalityExaminationId: '',
    reserveDate: moment().format('YYYY-MM-DD'),
    notes: '',
    isBpjs: false,
    isAnesthesia: false,
  };
  public edittedModality: any = {
    index: '',
    modalityHospitalId: '',
    modalityExaminationId: '',
    reserveDate: moment().format('YYYY-MM-DD'),
    notes: '',
    isBpjs: false,
    isAnesthesia: false,
  };

  public nationalTypeIds: any = [];
  public examinationsList: any = [];
  public modalityHospitalList: any = [];
  public modalityAppointmentList: any = [];
  public viewFromTime: any = '';
  public showPatientTable = '0';
  public selectedInput: any = {};

  // buttons
  public isSubmitting: boolean = false;
  public isExaminationButtonDisabled: boolean = true;
  public isSelectedPatient: any;
  public showModalityList: boolean = false;
  public dateTimeWidth: string = '160px';
  public isLoadingPatientTable : boolean;
  public model: any;
  public selectedDateTime: any;
  public viewDate: any = moment();

  ngOnInit() {
    this.onChangeDefaultSelected();
    this.getModalityHospitalList();
    this.getNationalityIdType();
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

    const formattedDob = moment(this.search.birthDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
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

    const formattedDob = moment(this.search.birthDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
    this.getSearchedPatient({
      ...this.search,
      birthDate: formattedDob,
    });
  }

  getSearchedPatient(request: SearchPatientHopeGroupedRequest) {
    this.isLoadingPatientTable = true
    this.patientService.searchPatientHopeGroup({
      ...request,
      hospitalId: this.hospital.id,
    }).subscribe(res => {
      this.patientHope = res.data;
      const patientHospital = this.patientHope.map( patient => {
          patient.patientHospitals = patient.patientHospitals.filter( hospital => hospital.hospitalId === this.hospital.id );
          return patient;
        }
      )
      this.patientHope = patientHospital;
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
      this.getModalityExamination(this.edittedModality.modalityHospitalId);
    } else {
      this.selectedModality.modalityHospitalId = this.selectedInput.modality_hospital_id;
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
        const payload = this.generatePayload(element, this.choosedPatient);
        this.modalityService.postAppointment(payload)
          .subscribe((response) => {
            if (isOk(response)) {
              response.data.local_mr_no = this.model.localMrNo;
              this.actionSuccess();
            }
            this.isSubmitting = false;
          }, (error: any) => {
            this.isSubmitting = false;
            this.alertService.error(error && error.message, false, 3000);
          });
      });
    } else {
      const payload = this.generatePayload(this.selectedModality, this.choosedPatient);
      this.modalityService.postAppointment(payload)
          .subscribe((response) => {
            if (isOk(response)) {
              response.data.local_mr_no = this.model.localMrNo;
              this.actionSuccess();
            }
            this.isSubmitting = false;
          }, (error: any) => {
            this.isSubmitting = false;
            this.alertService.error(error.message, false, 3000);
          });
    }
    // const isValidForm = this.validateCreateAppointment();
    // if (isValidForm === false) {
    //   this.isSubmitting = false;
    //   return false;
    // }
    return;
  }

  public actionSuccess() {
    this.alertService.success('Success to create appointment', false, 3000);
  }

  validateCreateAppointment() {
    let isValid = true;
    return isValid;
  }

  public generatePayload(model: any, choosedPatient: any) {
    const { mobileNo1: phoneNumber, address, notes } = model;
    const dob = model.birthDate.split('-');
    const birthDate = dob[2] + '-' + dob[1] + '-' + dob[0];
    const patientHopeId = choosedPatient ? choosedPatient.patientId : null;
    const payload: RadiologyAppointmentRequest = {
      modalityExaminationId: model.modalityExaminationId,
      modalityHospitalId: model.modalityHospitalId,
      modalityOperationalId: model.modalityOperationalId,
      reserveDate: model.reserveDate,
      fromTime: model.fromTime,
      toTime: model.toTime,
      patientHopeId,
      name: model.name,
      birthDate,
      phoneNumber1: this.filteredPhoneNumber(phoneNumber),
      addressLine1: address,
      notes: notes,
      channelId: channelId.FRONT_OFFICE,
      userId: this.userId,
      userName: this.userName,
      source: this.source,
      isWaitingList: false
    };
    return payload;
  }

  filteredPhoneNumber(phoneNumber: string) {
    return phoneNumber.replace(/_/gi, '');
  }

  onAddedModality() {
    this.showModalityList = true;
  }

  addModalityToList() {
    const objModality = pick(this.selectedInput, ['modality_label', 'room_name'])
    let payloadAddedModal = {
      ...objModality,
      ...this.selectedModality,
      ...this.isSelectedPatient,
    }
    payloadAddedModal.reserveDate = this.selectedModality.reserveDate.format('dddd, DD MMMM YYYY')
    this.modalityAppointmentList.push(payloadAddedModal);
  }

  editModalityToList() {
    const modalityAppointmentList = this.modalityAppointmentList.slice()
    const modality = this.modalityHospitalList.find((md :any) => md.modality_hospital_id === this.edittedModality.modalityHospitalId )
    const { fromTime, toTime, reserveDate } = this.selectedDateTime;
    modalityAppointmentList[this.edittedModality.index] = { ...this.edittedModality, ...modality, fromTime, toTime, reserveDate: reserveDate.format('dddd, DD MMMM YYYY')}
    this.modalityAppointmentList = modalityAppointmentList;
    this.onReset();
  }

  onChangeDefaultSelected() {
    const { modalityHospitalId, fromTime, toTime, reserveDate } = this.selectedAppointment;
    this.selectedModality = {
      ...this.selectedModality,
      fromTime,
      toTime,
      modalityHospitalId,
      reserveDate
    }
    if (this.selectedModality.modalityHospitalId) {
      this.isExaminationButtonDisabled = false;
      this.selectedInput.modality_hospital_id = modalityHospitalId;
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
    this.edittedModality = this.modalityAppointmentList[index];
    this.edittedModality.index = index;
    this.selectedDateTime = clone(this.edittedModality);
    this.selectedDateTime.reserveDate = moment(this.selectedDateTime.reserveDate);
    this.getModalityExamination(this.edittedModality.modalityHospitalId);
  }

  onReset() {
    this.edittedModality = {};
    const { fromTime, toTime, reserveDate, modalityHospitalId } =  this.selectedAppointment;
    this.selectedModality = {
      modalityHospitalId,
      modalityExaminationId: '',
      reserveDate,
      notes: '',
      isBpjs: false,
      isAnesthesia: false,
      fromTime,
      toTime,
    };
    this.examinationsList = [];
  }
}
