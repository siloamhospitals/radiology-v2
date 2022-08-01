import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-widget-patient-data',
  templateUrl: './widget-patient-data.component.html',
  styleUrls: ['./widget-patient-data.component.css']
})
export class WidgetPatientDataComponent implements OnInit {

  // Data List References
  titles: any[] = []
  nationalTypes: any[] = []
  religions: any[] = []
  mariageTypes: any[] = []

  cities: any[] = []
  districts: any[] = []
  subdistricts: any[] = []

  patientAttributeOrganizations: any = {
    patientOrganizations1: [],
    patientOrganizations2: [],
    patientOrganizations3: [],
    patientOrganizations4: [],
    patientOrganizations5: [],
  }


  // Data Modal
  model: any = {
    title: null,
    name: null,
    nationalIdTyoe: null,
    nationalIdNo: null,
    birthPlace: null,
    birthDay: null,
    gender: null,
    religion: null,
    mariagge: null,
    nationalIdName: null,
    spouse: null,
    fatherName: null,
    mothenName: null,
    allergy: null,
    note: null,
    phone1: null,
    phone2: null,
    phoneHome: null,
    phoneOffice: null,
    emailPrimary: null,
    emailSecondary: null,
    city: null,
    district: null,
    subDistrict: null,
    postCode: null,
    address: null,
    emergencyContactName: null,
    emergencyContactPhone1: null,
    emergencyContactPhone2: null,
    emergencyContactEmail: null,
    emergencyContactCity: null,
    emergencyContactAddress: null,
    payerName: null,
    payerNo: null,
    patientOrganizationAttribute1: null,
    patientOrganizationAttribute2: null,
    patientOrganizationAttribute3: null,
    patientOrganizationAttribute4: null,
    patientOrganizationAttribute5: null,
  }

  constructor() { }

  ngOnInit() {
  }

}
