import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../../services/general.service';

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
    title: '1',
    name: null,
    nationalIdType: '1',
    nationalIdNo: null,
    birthPlace: null,
    birthDay: null,
    gender: null,
    religion: null,
    mariage: null,
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

  constructor(
    private generalService: GeneralService,
  ) { }

  ngOnInit() {
    this.fetchInit()
  }

  async fetchInit () {
    await this.fetchTitles()
    await this.fetchNationalTypes()
    await this.fetchReligions()
    await this.fetchMariageTypes()
    await this.fetchCities()
  }

  async fetchTitles () {
    return this.generalService.getTitle().toPromise().then((res: any) => {
      this.titles = res.data
      return res.data
    })
  }
  async fetchNationalTypes () {
    return this.generalService.getNationalityIdType().toPromise().then((res: any) => {
      this.nationalTypes = res.data
      return res.data
    })
  }
  async fetchReligions () {
    return this.generalService.getReligion().toPromise().then((res: any) => {
      this.religions = res.data
      return res.data
    })
  }
  async fetchMariageTypes () {
    return this.generalService.getMaritalStatus().toPromise().then((res: any) => {
      this.mariageTypes = res.data
      return res.data
    })
  }
  async fetchCities () {
    return this.generalService.getCity().toPromise().then((res: any) => {
      this.cities = res.data
      return res.data
    })
  }
  async fetchDistrict (_cityId: any = null) {}
  async fetchSubDistrict (_districtId: any = null) {}


  scrollToSection (ev: any) {
    const target = ev.target.getAttribute('fragment')
    const element = document.querySelector(`#${target}`)
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

}
