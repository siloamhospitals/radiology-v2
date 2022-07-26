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

  nationalIdTypeName: any = nationalTypeIdNames;

  // Model Information
  contactId: string;
  contactData: any = {};

  // Input to Send AdmissionModel
  referralType: any = 1;
  patientType: any = 1;
  roomSelect: any = null;
  emailType: any = 1;
  txtEmail: any = null;
  txtNote: any = null;
  isAdmissionEmailDisabled: boolean = true;

  isLoadingFetch: boolean = false;
  isLoading: boolean = false;
  isError: boolean = false;
  isSuccess: boolean = false;

  errorMessage: any = null;

  modalCreateAdmissionLoading: any = null;
  doctorReferralList: any = [];
  selectedReferral: any = {
    external_doctor_referral_id: '',
  };

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

  processCreateAdmission () {
    // @todo: add editEmailAndNote
    const body: RadiologyAdmissionRequest = {
      modalitySlotId: this.model.modality_slot_id,
      organizationId: Number(this.hospital.orgId),
      patientTypeId: Number(this.patientType.value),
      admissionTypeId: '1', // Outpatient
      // ...this.generatePayerPayload(this.payerData),
      userId: this.user.id,
      source: sourceApps,
      userName: this.user.fullname,
      payerId: null,
      payerNo: null,
      payerEligibility: null
    }
    // const body = {}
    console.log('createAdmission', body)

    const isSuccess = (res: any) => {
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
    ])
  }

  async fetchReferralTypes () {
    this.referralTypes = await this.generalService.getReferralType().toPromise()
      .then((res: any) => {
        console.log(res.data, '============== res data')
        return res.data || []
      })
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

  async fetchData () {
    return Promise.all([
      this.fetchContactData()
    ])
  }

  async fetchContactData () {
    if (!this.contactId) { return }
    this.contactData = await this.patientService.getContact(this.contactId).toPromise()
      .then((res: any) => res.data || {})
  }

  setDefaultData () {
    this.changeEmailType()
    this.txtNote = this.model.note
  }

  changeEmailType () {
    const v = this.emailType
    switch (v.value) {
      case '1': this.txtEmail = this.contactData.email_address; this.isAdmissionEmailDisabled = true; break;
      case '2': this.txtEmail = this.contactData.email_address; this.isAdmissionEmailDisabled = true; break;
      case '3': this.txtEmail = null; this.isAdmissionEmailDisabled = false; break;
      case '4': this.txtEmail = 'noemail@email.com'; this.isAdmissionEmailDisabled = true;
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

  // @todo: referral-type functions
    async getReferralDoctor(event: any) {
      this.doctorReferralList = [];
      const val = event.target.value['0'];
      const selectedReferral = this.referralTypes[val];
      console.log(this.referralTypes[val], '========== this referral types')
      if (selectedReferral.value === '3') {
        this.doctorService.getExternalDoctor(this.hospital.orgId)
          .subscribe((res) => {
            if (res.status === 'OK' && res.data.length === 0) {
              this.alertService.success('No List Doctor in This Organization', false, 3000);
            }
            this.doctorReferralList = (res.data || []).map((val:any) => {
              val.label = `${val.code} - ${val.name}`
              return val;
            });
            console.log(this.doctorReferralList, '===========doctor referral list')
          }, (err) => {
            this.alertService.error(err.error.message, false, 3000);
            this.doctorReferralList = [];
          });
      } else if (val['0'] === '2') {
        this.doctorService.getExternalOrganization(this.hospital.orgId)
          .subscribe((res) => {
            if (res.status === 'OK' && res.data.length === 0) {
              this.alertService.success('No List Doctor in This Organization', false, 3000);
            }
            this.doctorReferralList = res.data;
          }, (err) => {
            this.alertService.error(err.error.message, false, 3000);
            return [];
          });
      } else if (val['0'] === '6') {
        this.doctorService.getOnlineAgreggator(this.hospital.orgId)
          .subscribe((res) => {
            console.log(res, '=====================res')
            if (res.status === 'OK' && res.data.length === 0) {
              this.alertService.success('No List Doctor in This Organization', false, 3000);
            }
            this.doctorReferralList = res.data;
          }, (err) => {
            console.log(err, '====== err')
            this.alertService.error(err.error.message, false, 3000);
            return [];
          });
    }

    // this.selectedReferred = {
    //   code: '',
    //   doctor_hope_id: '',
    //   externalDoctorId: '',
    //   externalOrganizationId: '',
    //   onlineAggregatorId: '',
    //   name: '',
    //   speciality_name: '',
    //   organization_name: '',
    //   admission_no: '',
    //   admission_hope_id: '',
    // };
  }

  changeReferralType (_event: any = null) {
    const val = this.referralType.value;
    console.log(val, '====================val')
    if (val === '2') {
      // this.selectedCheckIn.internal_doctor_referral_id = null;
      // this.selectedCheckIn.referral_admission_id = null;
    }
    else if (val === '3') {
      this.selectedReferral.external_doctor_referral_id = null;
    }
    else if (val === '4') {
      // this.selectedCheckIn.referral_name = null;
      // this.selectedCheckIn.referral_phone = null;
    }
    else if (val === '5') {
      // this.selectedCheckIn.external_organization_referral_id = null;
    }
    else if (val === '6') {
      // this.selectedCheckIn.referral_name = null;
      // this.selectedCheckIn.referral_phone = null;
    }
    else if (val === '7') {
      // this.selectedCheckIn.ishg_referral_id = null;
    }
    else if (val === '8') {
      // this.selectedCheckIn.onlineAggregatorId = null;
    }
  }
}
