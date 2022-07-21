import { channelId, sourceApps } from './../../../variables/common.variable';
import { RadiologyAppointmentRequest } from './../../../models/radiology/request/radiology-appointment-request';
import { AlertService } from './../../../services/alert.service';
import { ModalityService } from './../../../services/modality.service';
import { GeneralService } from './../../../services/general.service';
import { NewPatientHope, PatientHope } from './../../../models/patients/patient-hope';
import { PatientService } from './../../../services/patient.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchPatientHopeGroupedRequest } from '../../../models/patients/search-patient-hope-grouped-request';
import * as moment from 'moment';
import { pick } from 'lodash';
import { isOk } from 'src/app/utils/response.util';
// import { isOk } from '../../../utils/response.util';
// import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-create-appointment',
  templateUrl: './modal-create-appointment.component.html',
  styleUrls: ['./modal-create-appointment.component.css']
})
export class ModalCreateAppointmentComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
    private patientService: PatientService,
    private generalService: GeneralService,
    private modalityService: ModalityService,
    private alertService: AlertService,
  ) { }

  @Input() selectedAppointment: any;
  public key: any = JSON.parse(localStorage.getItem('key') || '{}');
  public hospital = this.key.hospital;
  public user = this.key.user;
  public userId: string = this.user.id;
  private userName: string = this.user.fullname;
  public source: string = sourceApps;
  public patientHope: NewPatientHope[];
  public choosedPatient: PatientHope;
  public model: any = {};
  public search: any = {
    birthDate: '',
    patientName: '',
    mrLocalNo: '',
    idNumber: '',
    nationalIdTypeId: '',
  }
  // private postAppointmentSubscription: Subscription;
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
  public viewCurrentDate: any = moment();
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
  public onEdit: boolean = false;

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
    // if (isEmpty(this.searchKeywords.patientName)
    //   || isEmpty(this.searchKeywords.birthDate)) {
    //     this.showErrorAlert('Name and DOB is required.', 2000);
    //   return;
    // }

    const formattedDob = moment(this.search.birthDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
    this.getSearchedPatient({
      patientName: this.search.patientName,
      birthDate: formattedDob,
    });
  }

  onIdNumberSearchButtonClicked() {
    // if (isEmpty(this.searchKeywords.nationalIdTypeId)
    //   || isEmpty(this.searchKeywords.idNumber)) {
    //     this.showErrorAlert('National type id and id number is required.', 3000);
    //   return;
    // }
    this.getSearchedPatient({
      idNumber: this.search.idNumber,
      nationalIdTypeId: this.search.nationalIdTypeId
    });
  }

  onLocalMrSearchButtonClicked() {
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
    if(this.viewCurrentDate) {
      const dateString = this.viewCurrentDate.format('YYYY-MM-DD')
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
    this.selectedModality.reserveDate = this.viewCurrentDate.format('YYYY-MM-DD');
    await this.getModalityHospitalList();
  }

  onChangeModality() {
    this.selectedModality.modalityHospitalId = this.selectedInput.modality_hospital_id;
    this.isExaminationButtonClicked = false;
    this.getModalityExamination(this.selectedModality.modalityHospitalId)
  }

  public onCreateAppointment() {
    this.isSubmitting = true;
    // halo halo mas agung di sini mas untuk yg create appointment,note  di generatepayload itu blm kusesuaikan dengan payload appointmentnya
    if (this.modalityAppointmentList.length > 0) {
      this.modalityAppointmentList.array.forEach((element: any) => {
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
            this.alertService.error(error.message, false, 3000);
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
    const objModality = pick(this.selectedInput, ['modality_label', 'room_name', 'modality_hospital_id'])
    let payloadAddedModal = {
      ...objModality,
      ...this.selectedModality,
      ...this.isSelectedPatient,
    }
    payloadAddedModal.reserveDate = this.viewCurrentDate.format('dddd, DD MMMM YYYY');
    this.modalityAppointmentList.push(payloadAddedModal);
  }

  editModalityToList() {
    const modalityAppointmentList = this.modalityAppointmentList.slice()
    const modality = this.modalityHospitalList.find((md :any) => md.modality_hospital_id === this.edittedModality.modalityHospitalId )
    modalityAppointmentList[this.edittedModality.index] = { ...this.edittedModality, ...modality }
    this.modalityAppointmentList = modalityAppointmentList;
    this.edittedModality = {};
  }

  onChangeDefaultSelected() {
    this.selectedModality.fromTime = this.selectedAppointment.fromTime;
    this.selectedModality.toTime = this.selectedAppointment.toTime;
  }

  cancelModality() {
    this.edittedModality = {}
  }

  onDeleteModality(val: any) {
    const filtered = this.modalityAppointmentList.filter((list: any) => list !== val );
    this.modalityAppointmentList = filtered;
  }

  onEditModality(list: any, index: any) {
    this.onEdit = true;
    console.log(list, 'list')
    this.edittedModality = this.modalityAppointmentList[index];
    this.edittedModality.index = index;
    console.log(this.edittedModality, '============== this editted modality')
  }
}
