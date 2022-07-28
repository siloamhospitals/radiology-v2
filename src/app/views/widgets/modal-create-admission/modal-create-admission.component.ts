import { AdmissionService } from './../../../services/admission.service';
import { AlertService } from './../../../services/alert.service';
import { DoctorService } from './../../../services/doctor.service';
import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { General } from '../../../models/generals/general';
import { RadiologyAdmissionRequest } from '../../../models/radiology/request/radiology-admission-request';
// import { AdmissionService } from '../../../services/admission.service';
import { GeneralService } from '../../../services/general.service';
import { PatientService } from '../../../services/patient.service';
import { RadiologyService } from '../../../services/radiology/radiology.service';
// import { ModalitySlot } from '../../../models/radiology/modality-slot';
import { nationalTypeIdNames, sourceApps } from '../../../variables/common.variable';
import { ModalQueueNumberComponent } from '../modal-queue-number/modal-queue-number.component';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-modal-create-admission',
  templateUrl: './modal-create-admission.component.html',
  styleUrls: ['./modal-create-admission.component.css']
})

export class ModalCreateAdmissionComponent implements OnInit, OnChanges {
  // User-System Define
  public key: any = JSON.parse(localStorage.getItem('key') || '{}');
  public hospital = this.key.hospital;
  public user = this.key.user;
  public readonly userPayload = {
    userId: this.user.id,
    source: sourceApps,
    userName: this.user.fullname,
  };

  public model: any = {};
  public selectedModel: any = {};
  public modelId: any = null;

  nationalTypes: General[] = [];
  patientTypes: General[] = [];
  referralTypes: General[] = [];
  emailTypes: General[] = [];
  roomOptions: General[] = [];
  payerList: any[] = [];

  nationalIdTypeName: any = nationalTypeIdNames;

  // Model Information
  contactId: string;
  contactData: any = {};
  contactHopeData: any = {};
  roomName: any = null;

  // Input to Send AdmissionModel
  referralType: any = 1;
  patientType: any = 1;
  roomSelect: any = null;
  emailType: any = 1;
  txtEmail: any = null;
  txtNote: any = null;
  txtIsSigned: boolean = false;
  isAdmissionEmailDisabled: boolean = true;

  // Payer Model
  payerName: any = null;
  payerNo: any = null;
  payerEligibilityNo: any = null;
  payerReferralSource: any = null;
  payerReferralNo: any = null;
  payerReferralDate: any = null;
  payerDiagnose: any = null;
  payerNote: any = null;

  // Utility Properties
  isNoEmail: boolean = false
  isLoadingFetch: boolean = false
  isLoading: boolean = false
  isError: boolean = false
  isSuccess: boolean = false

  errorMessage: any = null;
  successResponseModel: any = null;

  modalCreateAdmissionLoading: any = null;
  doctorReferralList: any = [];
  selectedReferral: any = {
    external_doctor_referral_id: null,
    external_organization_referral_id: null,
    referral_name: null,
    referral_phone: null,
    internal_doctor_referral_id: null,
    referral_admission_id: null,
    ishg_referral_id: null,
    online_aggregator_id: null,
  };
  isFromReferralRequest = false;
  admissionReferralList: any = [];
  referralAdmissionIdLoading: boolean = false;
  changeDebounce: any = null;
  textResult: any = 'In Progress';
  referralIshgLoading: boolean = false;

  @ViewChild('admissionDetail') modalAdmissionDetail: ElementRef
  @ViewChild('loadingIndicatorModal') modalLoadingIndicator: ElementRef

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private generalService: GeneralService,
    private radiologyService: RadiologyService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private alertService: AlertService,
    private admissionService: AdmissionService
  ) { }

  ngOnChanges(_changes: SimpleChanges) {
    console.log('changes', _changes)
  }

  async ngOnInit() {
    // console.log('nginit selectedModel', this.selectedModel)
    this.isLoadingFetch = true
    this.refresh()
    await this.fetchInitialValues()
    this.setDefaultValues()
    await this.fetchData()
    this.setDefaultData()
    this.isLoadingFetch = false
  }

  refresh () {
    if (this.selectedModel && this.selectedModel.modality_slot_id) {
      this.model = {...this.model, ...this.selectedModel}
      this.model.patient_dob = moment(this.model.patient_dob, 'YYYY-MM-DD').format('DD MMMM YYYY')
      // this.model.identity_type_id = this.model.identity_type_id in nationalTypeIdNames ? nationalTypeIdNames[this.model.identity_type_id] : this.model.identity_type_id
    }
  }

  close() {
    this.activeModal.close();
  }

  changeExamination(e: any) {
    console.log(e.target.value);
  }

  createAdmission (evt: any = null) {
    evt.preventDefault()
    this.processCreateAdmission()
  }

  inputQueueNumber() {
    this.close();
    const m = this.modalService.open(ModalQueueNumberComponent, { windowClass: 'modal_queue_number', centered: true })
    m.componentInstance.data = this.model;
    m.result.then((_result: any) => {
      this.activeModal.close()
      this.refresh();
    })
  }

  processCreateAdmission () {
    // Emit Edit Email or Note
    this.editNotesAndEmail(this.model.contact_id)

    // Payer Data
    const isSelectedPayer = this.payerName && this.payerName.payer_id

    // Create Admission Purpose
    const body: RadiologyAdmissionRequest = {
      modalitySlotId: this.model.modality_slot_id,
      organizationId: Number(this.hospital.orgId),
      patientTypeId: Number(this.patientType.value),
      admissionTypeId: '1', // Outpatient
      userId: this.user.id,
      source: sourceApps,
      userName: this.user.fullname,
      payerId: isSelectedPayer ? this.payerName.payer_id : null,
      payerNo: isSelectedPayer ? this.payerNo : null,
      payerEligibility: isSelectedPayer ? this.payerEligibilityNo : null
    }
    // const body = {}
    console.log('createAdmission', body)

    const isSuccess = (res: any) => {
      this.successResponseModel = res.data
      this.model.admission_id = this.successResponseModel.admission_id
      this.model.admission_no = this.successResponseModel.admission_no
      this.isLoading = false
      this.isSuccess = true
      this.activeModal.close()
      // this.modalCreateAdmissionLoading.close()
      setTimeout(() => { this.openAdmissionTicket() }, 500)
      console.log('ADMISSION_CREATE_SUCCESS', res)
    }

    const isError = (e: any) => {
      this.isLoading = false
      this.isError = true
      this.isSuccess = false
      this.errorMessage = e.error && e.error.message ? e.error.message : e.message
      setTimeout(() => { this.isError = false }, 8000)
      console.log('ADMISSION_CREATE_ERROR', e)
    }

    this.isLoading = true
    this.isError = false
    this.errorMessage = null
    this.openLoadingIndicator()
    this.radiologyService.createAdmission(body)
      .subscribe(isSuccess, isError)
  }

  setDefaultValues () {
    // this.nationalType = this.nationalTypes[0]
    this.patientType = this.patientTypes.find((x: General) => x.value === '1')
    this.emailType = this.emailTypes.find((x: General) => x.value === '1')
    this.referralType = this.referralTypes.find((x: General) => x.value === '1')

    // to Model
    if (this.model && this.model.modality_slot_id) {
      this.contactId = this.model.contact_id
    }
  }

  fetchInitialValues () {
    return Promise.all([
      this.fetchNationalTypes(),
      this.fetchReferralTypes(),
      this.fetchPatientTypes(),
      this.fetchEmailTypes(),
      this.fetchPayers(),
    ])
  }

  async fetchReferralTypes () {
    this.referralTypes = await this.generalService.getReferralType().toPromise()
      .then((res: any) => res.data || [])
  }

  async fetchPatientTypes () {
    this.patientTypes = await this.generalService.getPatientType().toPromise()
      .then((res: any) => res.data || [])
  }

  async fetchEmailTypes () {
    this.emailTypes = await this.generalService.getAdmissionEmailType().toPromise()
      .then((res: any) => res.data || [])
  }

  async fetchNationalTypes () {
    this.nationalTypes = await this.generalService.getNationalityIdType().toPromise()
      .then((res: any) => res.data || [])
  }

  async fetchPayers () {
    if (!(this.hospital && this.hospital.orgId)) { return }
    this.payerList = await this.generalService.getPayer(this.hospital.orgId).toPromise()
      .then((res: any) => res.data || [])
  }

  async fetchData () {
    return Promise.all([
      this.fetchContactData(),
      this.fetchLocationRoom(),
    ])
  }

  async fetchContactData () {
    if (!this.contactId) { return }
    this.contactData = await this.patientService.getContact(this.contactId).toPromise()
      .then((res: any) => res.data || {})
    await this.fetchContactHopeData()
  }

  async fetchContactHopeData () {
    const patientId = this.contactData.patient_hope_id
    const orgId = this.hospital.orgId
    if (!patientId) { return }
    this.contactHopeData = await this.patientService.getPatientHopeDetailTwo(patientId, orgId).toPromise()
      .then((res: any) => res.data || {})
  }

  async fetchLocationRoom () {
    if (!this.model.modality_hospital_id) { return }
    const modalityHospitalDetail = await this.radiologyService
      .getModalityHospitalById(this.model.modality_hospital_id).toPromise()
      .then((res: any) => res.data || {})
    const {floor_name, wing_name, room_name} = modalityHospitalDetail.tx_room_mapping
    this.roomName = `Lantai ${room_name} - Wing ${wing_name} - Ruang ${floor_name}`
  }

  setDefaultData () {
    this.changeEmailType()
    this.txtNote = this.contactData ? this.contactData.notes : null
    this.txtIsSigned = this.contactData ? this.contactData.is_signed : null
  }

  changeEmailType () {
    const v = this.emailType
    this.isNoEmail = false
    switch (v.value) {
      case '1': this.txtEmail = this.contactData.email_address; this.isAdmissionEmailDisabled = true; break;
      case '2': this.txtEmail = this.contactHopeData && this.contactHopeData.secondaryEmailAddress ? this.contactHopeData.secondaryEmailAddress : null; this.isAdmissionEmailDisabled = true; break;
      case '3': this.txtEmail = null; this.isAdmissionEmailDisabled = false; break;
      case '4': this.txtEmail = null; this.isAdmissionEmailDisabled = true; this.isNoEmail = true
      default: break;
    }
  }

  openAdmissionTicket () {
    const content = this.modalAdmissionDetail
    const m = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
    m.result.then((_result) => {
      // if modal check admission ticket is close
    }).catch((e) => {
      console.log('MODAL_ERR', e)
    })
  }

  openLoadingIndicator () {
    const content = this.modalLoadingIndicator
    this.modalCreateAdmissionLoading = this.modalService.open(content, {centered: true}).result.then((_result) => {
    }, (_reason) => {
    })
  }

  async editNotesAndEmail(contactId?: any) {
    if (this.contactData.notes !== this.txtNote
      || this.model.email !== this.txtEmail
      || this.contactData.is_signed !== this.txtIsSigned) {
      const modifyNotesEmail = {
        patientOrganizationId: this.model.patient_organization_id,
        organizationId: Number(this.hospital.orgId),
        // emailAddress: this.txtEmail,
        notes: this.txtNote,
        isSigned: this.txtIsSigned,
        source: sourceApps,
        userName: this.user.fullname,
        userId: this.user.id
      }
      this.patientService.editNotesAndEmailPatient(modifyNotesEmail, contactId).toPromise()
        .then(res => {
          return res.data;
        }).catch((e: any) => {
          console.log('EDIT_EMAIL_NOTE_SIGNED_ERROR', e)
          return null;
        })
    }
  }

  async getReferralDoctor(_event: any) {
    this.doctorReferralList = [];
    const selectedReferral = this.referralType;
    if (selectedReferral.value === '2') {
      this.doctorService.getInternalDoctor(this.hospital.id)
        .subscribe((res) => {
          if (res.status === 'OK' && res.data.length === 0) {
            this.alertService.success('No List Doctor in This Organization', false, 3000);
          }
          this.doctorReferralList = (res.data || []);
        }, (err) => {
          this.alertService.error(err.error.message, false, 3000);
          this.doctorReferralList = [];
        });
    } else if (selectedReferral.value === '3') {
      this.doctorService.getExternalDoctor(this.hospital.orgId)
        .subscribe((res) => {
          if (res.status === 'OK' && res.data.length === 0) {
            this.alertService.success('No List Doctor in This Organization', false, 3000);
          }
          this.doctorReferralList = (res.data || []).map((val:any) => {
            val.label = `${val.code} - ${val.name}`
            return val;
          });
        }, (err) => {
          this.alertService.error(err.error.message, false, 3000);
          this.doctorReferralList = [];
        });
    } else if (selectedReferral.value === '5') {
      this.doctorService.getExternalOrganization(this.hospital.orgId)
        .subscribe((res) => {
          if (res.status === 'OK' && res.data.length === 0) {
            this.alertService.success('No List Doctor in This Organization', false, 3000);
          }
          this.doctorReferralList = (res.data || []).map((val:any) => {
            val.label = `${val.code} - ${val.name}`
            return val;
          });
        }, (err) => {
          this.alertService.error(err.error.message, false, 3000);
          return [];
        });
    } else if (selectedReferral.value === '8') {
      this.doctorService.getOnlineAgreggator(this.hospital.orgId)
        .subscribe((res) => {
          if (res.status === 'OK' && res.data.length === 0) {
            this.alertService.success('No List Doctor in This Organization', false, 3000);
          }
          this.doctorReferralList = (res.data || []).map((val:any) => {
            val.label = `${val.code} - ${val.name}`
            return val;
          });
        }, (err) => {
          this.alertService.error(err.error.message, false, 3000);
          return [];
        });
    }
  }

  changeReferralType (_event: any = null) {
    const val = this.referralType.value;
    if (val === '2') {
      this.selectedReferral.internal_doctor_referral_id = null;
      this.selectedReferral.referral_admission_id = null;
    }
    else if (val === '3') {
      this.selectedReferral.external_doctor_referral_id = null;
    }
    else if (val === '4') {
      this.selectedReferral.referral_name = null;
      this.selectedReferral.referral_phone = null;
    }
    else if (val === '5') {
      this.selectedReferral.external_organization_referral_id = null;
    }
    else if (val === '6') {
      this.selectedReferral.referral_name = null;
      this.selectedReferral.referral_phone = null;
    }
    else if (val === '7') {
      this.selectedReferral.ishg_referral_id = null;
    }
    else if (val === '8') {
      this.selectedReferral.online_aggregator_id = null;
    }
  }

  async getReferralAdmission(event: any){
    this.admissionReferralList = [];
    const value = event;
    const contactId = this.contactId;
    if (value.length < 4) { return event }
    this.referralAdmissionIdLoading = true;
    if (this.changeDebounce) { clearTimeout(this.changeDebounce) }
      this.changeDebounce = setTimeout(async () => {
        this.admissionReferralList = await this.admissionService.getAdmissions(value, contactId)
        .toPromise().then((res: any) => {
          if(isEmpty(res.data)) {this.textResult = 'No Result Found'}
          return res.data;
        }).catch((err: any) => {
          this.alertService.error(err.error.message, false, 3000);
          return [];
        }).finally(() => {
          this.referralAdmissionIdLoading = false;
        })
    }, 1000)
  }

  async getReferralIshg(event: any){
    this.doctorReferralList = [];
    const value = event;
    if (value.length < 3) { return event }
    if (this.changeDebounce) { clearTimeout(this.changeDebounce) }
    this.referralIshgLoading = true;
    this.changeDebounce = setTimeout(async () => {
      this.doctorReferralList = await this.doctorService.getIshg(this.hospital.id, value)
      .toPromise().then(res => {
        if (res.status === 'OK' && res.data.length === 0) {
          this.alertService.warn('No List Doctor in This Organization', false, 3000);
        }
        return (res.data || []).map((x: any) => {
          x.label = `${x.organization_name} - ${x.speciality_name} - ${x.name}`;
          return x;
        });
      }).catch(err => {
        this.alertService.error(err.error.message, false, 3000);
        return [];
      }).finally(() => {
        this.referralIshgLoading = false;
      });
    }, 1000)
  }
}
