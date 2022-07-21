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
import { pick } from 'lodash';
import { WidgetBaseComponent } from '../widget-base/widget-base.component';
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
  public isExaminationButtonClicked: boolean = true;
  public isSelectedPatient: any;
  public showModalityList: boolean = false;
  public dateTimeWidth: string = '160px';

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

  onNameAndDobSearchButtonClicked() {
    if (!this.search.patientName
      || !this.search.birthDate) {
        this.showErrorAlert('Nama and Tanggal Lahir Dibutuhkan.', 2000);
      return;
    }

    const formattedDob = moment(this.search.birthDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
    this.getSearchedPatient({
      patientName: this.search.patientName,
      birthDate: formattedDob,
    });
  }

  onIdNumberSearchButtonClicked() {
    if (!this.search.idNumber) {
      this.showErrorAlert('No. Identitas Pasien Dibutuhkan', 2000);
      return;
    }
    this.getSearchedPatient({
      idNumber: this.search.idNumber,
      nationalIdTypeId: this.search.nationalIdTypeId
    });
  }

  onLocalMrSearchButtonClicked() {
    if (!this.search.mrLocalNo) {
      this.showErrorAlert('No. MR Lokal Pasien Dibutuhkan', 2000);
      return;
    }
    this.getSearchedPatient({
      mrLocalNo: this.search.mrLocalNo,
    });
  }


  getSearchedPatient(request: SearchPatientHopeGroupedRequest) {
    this.patientService.searchPatientHopeGroup({
      ...request,
      hospitalId: this.hospital.id,
    }).subscribe(res => {
      this.patientHope = res.data;
      if(this.patientHope.length > 0) {
        this.showPatientTable = '2';
      } else {
        this.showPatientTable = '1';
      }
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
    this.isExaminationButtonClicked = false;
    if (this.edittedModality.hospitalId) {
      this.getModalityExamination(this.edittedModality.modalityHospitalId);
    } else {
      this.selectedModality.modalityHospitalId = this.selectedInput.modality_hospital_id;
      this.getModalityExamination(this.selectedModality.modalityHospitalId);
    }

  }

  public onCreateAppointment() {
    this.isSubmitting = true;
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
    const { patientName, phoneNumber, address, note } = model;
    const dob = model.birthDate.split('-');
    const birthDate = dob[2] + '-' + dob[1] + '-' + dob[0];
    const patientHopeId = choosedPatient ? choosedPatient.patientId : null;
    const payload: RadiologyAppointmentRequest = {
      modalityExaminationId: model.modalityExaminationId,
      modalityHospitalId: model.modalityHospitalId,
      modalityOperationalId: model.modalityOperationalId,
      reserveDate: model.date,
      fromTime: model.fromTime,
      toTime: model.toTime,
      patientHopeId,
      name: patientName,
      birthDate,
      phoneNumber1: this.filteredPhoneNumber(phoneNumber),
      addressLine1: address,
      notes: note,
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
    modalityAppointmentList[this.edittedModality.index] = { ...this.edittedModality, ...modality }
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
  }

  cancelModality() {
    this.onReset();
  }

  onDeleteModality(val: any) {
    const filtered = this.modalityAppointmentList.filter((list: any) => list !== val );
    this.modalityAppointmentList = filtered;
  }

  onEditModality(list: any, index: any) {
    console.log(list, 'list')
    this.edittedModality = this.modalityAppointmentList[index];
    this.edittedModality.index = index;
    this.getModalityExamination(this.edittedModality.modalityHospitalId);
  }

  onReset() {
    console.log(this.selectedAppointment, '=========== selected appointment')
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
