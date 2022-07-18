import { channelId, sourceApps } from './../../../variables/common.variable';
import { RadiologyAppointmentRequest } from './../../../models/radiology/request/radiology-appointment-request';
import { AlertService } from './../../../services/alert.service';
import { ModalityService } from './../../../services/modality.service';
import { GeneralService } from './../../../services/general.service';
import { NewPatientHope, PatientHope } from './../../../models/patients/patient-hope';
import { PatientService } from './../../../services/patient.service';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchPatientHopeGroupedRequest } from '../../../models/patients/search-patient-hope-grouped-request';
import * as moment from 'moment';
import { isOk } from '../../../utils/response.util';
import { Subscription } from 'rxjs';

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
  private postAppointmentSubscription: Subscription;
  public selectedModality: any = {
    modalityHospitalId: '',
    modalityExaminationId: '',
    reserveDate: moment().format('YYYY-MM-DD'),
    fromTime: '00:00',
    toTime: '00:00',
    notes: '',
    isBpjs: false,
    isAnesthesia: false,
  };

  public nationalTypeIds: any = [];
  public examinationsList: any = [];
  public viewCurrentDate: any = moment();
  public modalityHospitalList: any = [];
  public viewFromTime: any = '';
  public showPatientTable = '0';

  // buttons
  public isSubmitting = false;
  public isExaminationButtonClicked: boolean = true;
  public isSelectedPatient: any;

  ngOnInit() {
    this.getNationalityIdType();
    this.getModalityHospitalList();
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
    this.selectedModality.reserveDate = moment(this.viewCurrentDate).format('YYYY-MM-DD');
    await this.getModalityHospitalList();
  }

  onChangeModality(e?:any) {
    console.log(this.isSelectedPatient,'============= is selected patient')
    this.selectedModality.modalityHospitalId = e.target.value;
    this.isExaminationButtonClicked = false;
    this.getModalityExamination(this.selectedModality.modalityHospitalId)
  }

  public createAppointment() {
    this.isSubmitting = true;
    console.log(this.selectedModality, '===============modality')
    // const isValidForm = this.validateCreateAppointment();
    // if (isValidForm === false) {
    //   this.isSubmitting = false;
    //   return false;
    // }
    // const payload = this.generatePayload(this.selectedModality, this.choosedPatient);
    // this.postAppointmentSubscription = this.modalityService.postAppointment(payload)
    //   .subscribe((response) => {
    //     if (isOk(response)) {
    //       response.data.local_mr_no = this.model.localMrNo;
    //       this.actionSuccess();
    //     }
    //     this.isSubmitting = false;
    //   }, (error: any) => {
    //     this.isSubmitting = false;
    //     this.alertService.error(error.message, false, 3000);
    //   });
    // console.log(this.postAppointmentSubscription, '======= this post appointment')
    // return;
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
}
