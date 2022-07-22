import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { General } from 'src/app/models/generals/general';
import { AdmissionService } from 'src/app/services/admission.service';
import { GeneralService } from 'src/app/services/general.service';
// import { RadiologyService } from 'src/app/services/radiology.service';
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

  // model to send
  referralType: any = 1
  patientType: any = 1
  roomSelect: any = null
  emailType: any = 1
  txtEmail: any = null
  txtNote: any = null

  constructor(
    private activeModal: NgbActiveModal,
    private generalService: GeneralService,
    private admissionService: AdmissionService,
  ) { }

  ngOnChanges(_changes: SimpleChanges) {
    console.log('changes', _changes)
  }

  async ngOnInit() {
    console.log('nginit selectedModel', this.selectedModel)
    await this.fetchInitialValues()
    this.setDefaultValues()
    this.refresh()
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
    console.log('createAdmission')
    // const body: RadiologyAdmissionRequest = {
    //   modalitySlotId: this.data.modalitySlot.modality_slot_id,
    //   organizationId: Number(this.hospital.orgId),
    //   patientTypeId: Number(this.patientType.value),
    //   admissionTypeId: this.selectedAdmissionType.value,
    //   ...this.generatePayerPayload(this.payerData),
    //   userId: this.user.id,
    //   source: sourceApps,
    //   userName: this.user.fullname,
    // };
    const body = {}

    const isSuccess = (res: any) => {
      console.log('ADMISSION_CREATE_SUCCESS', res)
    }

    const isError = (e: any) => {
      console.log('ADMISSION_CREATE_ERROR', e)
    }

    this.admissionService.createAdmission(body)
      .subscribe(isSuccess, isError)
  }

  setDefaultValues () {
    // this.nationalType = this.nationalTypes[0]
    this.patientType = this.patientTypes[0]
    this.emailType = this.emailTypes[0]
    this.referralType = this.referralTypes[0]
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
}
