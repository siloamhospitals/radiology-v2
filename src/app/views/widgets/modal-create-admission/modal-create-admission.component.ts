import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
// import { ModalitySlot } from 'src/app/models/radiology/modality-slot';
import { nationalTypeIdNames } from 'src/app/variables/common.variable';

@Component({
  selector: 'app-modal-create-admission',
  templateUrl: './modal-create-admission.component.html',
  styleUrls: ['./modal-create-admission.component.css']
})

export class ModalCreateAdmissionComponent implements OnInit, OnChanges {
  public model: any = {}
  public selectedModel: any = {}
  public modelId: any = null

  // note to self those are dummy data, erase them after integration with API
  public examinationsList: any = [{
    value: '01',
    description: 'CT HEAD NON CONTRAST'
  },{
    value: '02',
    description: 'LOREM IPSUM'
  }]

  public payerTypesList: any = [{
    value: '01',
    description: 'Private'
  },{
    value: '02',
    description: 'Public'
  }]

  public status: string = 'Scheduled';

  public nationalTypeIds: any = [
    {
      value: '01',
      key: 'KTP',
    },{
      value: '02',
      key: 'PASSPORT',
    }
  ];

  referralTypes: any[] = [
    {value: '1', description: 'Self Referral'},
  ]

  emailTypes: any[] = [
    {value: '1', description: 'Primary'},
  ]

  nationalIdTypeName: any = nationalTypeIdNames

  // model to send
  referralType: any = null
  patientType: any = null
    roomSelect: any = null
  emailType: any = null
  txtEmail: any = null
  txtNote: any = null

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnChanges(_changes: SimpleChanges) {
    console.log('changes', _changes)
  }

  ngOnInit() {
    console.log('nginit selectedModel', this.selectedModel)
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

  createAdmission () {
    console.log('WIP')
  }
}
