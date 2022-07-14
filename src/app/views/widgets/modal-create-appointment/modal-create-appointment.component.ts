import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-create-appointment',
  templateUrl: './modal-create-appointment.component.html',
  styleUrls: ['./modal-create-appointment.component.css']
})
export class ModalCreateAppointmentComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  public model: any = {};
  public patientsList: any[] = [{
    name: 'Fitria Palastri',
    birthDate: '28 Des 1999',
    localMr: '0819538',
    identityNumber: 'KTP - 1234567890123456',
    phoneNo: '081234567890',
    address: 'Jakarta Barat',
  }, {
    name: 'Mila Suhartini',
    birthDate: '23 Mar, 1994',
    localMr: '8350970',
    identityNumber: 'KTP - 1234567890123456',
    phoneNo: '081817892091',
    address: 'Jakarta Pusat',
  }, {
    name: 'Tami Usamah',
    birthDate: '09 Sep, 1991',
    localMr: '1197254',
    identityNumber: 'KTP - 1234567890123456',
    phoneNo: '081917692019',
    address: 'Karawaci',
  }]
  public nationalTypeIds: any = [
    {
      value: '01',
      key: 'KTP',
    },{
      value: '02',
      key: 'PASSPORT',
    }
  ];
  public examinationsList: any = [{
    value: '01',
    description: 'CT HEAD NON CONTRAST'
  },{
    value: '02',
    description: 'LOREM IPSUM'
  }]

  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }
}
