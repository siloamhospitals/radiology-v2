import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { General } from 'src/app/models/generals/general';
import { RadiologyAdmissionRequest } from 'src/app/models/radiology/request/radiology-admission-request';
// import { AdmissionService } from 'src/app/services/admission.service';
import { GeneralService } from 'src/app/services/general.service';
import { PatientService } from 'src/app/services/patient.service';
import { RadiologyService } from 'src/app/services/radiology/radiology.service';
// import { ModalitySlot } from 'src/app/models/radiology/modality-slot';
import { nationalTypeIdNames, sourceApps } from 'src/app/variables/common.variable';

@Component({
  selector: 'app-modal-create-admission',
  templateUrl: './modal-create-admission.component.html',
  styleUrls: ['./modal-create-admission.component.css']
})

export class ModalCreateAdmissionComponent implements OnInit, OnChanges {
  // User-System Define
  public key: any = JSON.parse(localStorage.getItem('key') || '{}');
  public hospital = this.key.hospital
  public user = this.key.user
  public readonly userPayload = {
    userId: this.user.id,
    source: sourceApps,
    userName: this.user.fullname,
  }

  public model: any = {}
  public selectedModel: any = {}
  public modelId: any = null
  
  nationalTypes: General[] = []
  patientTypes: General[] = []
  referralTypes: General[] = []
  emailTypes: General[] = []

  nationalIdTypeName: any = nationalTypeIdNames

  // Model Information
  contactId: string
  contactData: any = {}

  // Input to Send AdmissionModel
  referralType: any = 1
  patientType: any = 1
  roomSelect: any = null
  emailType: any = 1
  txtEmail: any = null
  txtNote: any = null
  isAdmissionEmailDisabled: boolean = true

  isLoading: boolean = false
  isError: boolean = false

  errorMessage: any = null

  @ViewChild('admissionDetail') modalAdmissionDetail: ElementRef
  @ViewChild('loadingIndicatorModal') modalLoadingIndicator: ElementRef

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private generalService: GeneralService,
    private radiologyService: RadiologyService,
    private patientService: PatientService,
  ) { }

  ngOnChanges(_changes: SimpleChanges) {
    console.log('changes', _changes)
  }

  async ngOnInit() {
    console.log('nginit selectedModel', this.selectedModel)
    this.refresh()
    await this.fetchInitialValues()
    this.setDefaultValues()
    await this.fetchData()
    this.setDefaultData()
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
      this.openAdmissionTicket()
      console.log('ADMISSION_CREATE_SUCCESS', res)
    }

    const isError = (e: any) => {
      this.isLoading = false
      this.isError = true
      this.errorMessage = e.error && e.error.message ? e.error.message : e.message
      console.log('ADMISSION_CREATE_ERROR', e)
    }

    this.isLoading = true
    this.isError = false
    this.errorMessage = null
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
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((_result) => {
    }, (_reason) => {
    })
  }

  openLoadingIndicator () {
    const content = this.modalLoadingIndicator
    this.modalService.open(content, {centered: true}).result.then((_result) => {
    }, (_reason) => {
    })
  }
}
