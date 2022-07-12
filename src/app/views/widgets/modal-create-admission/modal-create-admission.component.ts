import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-create-admission',
  templateUrl: './modal-create-admission.component.html',
  styleUrls: ['./modal-create-admission.component.css']
})

export class ModalCreateAdmissionComponent implements OnInit {

  public examinationsList: any = [{
    value: '01',
    description: 'CT HEAD NON CONTRAST'
  },{
    value: '02',
    description: 'LOREM IPSUM'
  }]

  public patientTypesList: any = [{
    value: '01',
    description: 'Private'
  },{
    value: '02',
    description: 'Public'
  }]

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }

  changeExamination(e: any) {
    console.log(e.target.value);
  }
}
