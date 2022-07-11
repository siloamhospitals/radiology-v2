import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../../services/appointment.service';
import { CheckupService } from '../../../services/checkup.service';
import { DoctorService } from '../../../services/doctor.service';
import { GeneralService } from '../../../services/general.service';

import { dateFormatter } from '../../../utils/helpers.util';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { queueType, appointmentStatusId, channelId, delaySubmit } from '../../../variables/common.variable';

import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
import { checkupResultPayload } from '../../../payloads/checkup-result.payload';
import { IMyDrpOptions } from 'mydaterangepicker';


@Component({
  selector: 'app-widget-swab-list',
  templateUrl: './widget-swab-list.component.html',
  styleUrls: ['./widget-swab-list.component.css']
})
export class WidgetSwabListComponent implements OnInit {

  public assetPath = environment.ASSET_PATH;
  public key: any = JSON.parse(localStorage.getItem('key') || '{}');
  public hospital = this.key.hospital;
  public isBridging = this.key.hospital.isBridging;
  public user = this.key.user;
  public now = new Date();
  public appStatusId = appointmentStatusId;
  public qType = queueType;
  public isSubmitting = false;
  public userId: string = this.user.id;
  private userName: string = this.user.fullname;
  public addCheckupResultPayload: checkupResultPayload;
  public loading = false;
  private listFunction: {[k: string]: any} = {};

  public dateAppointment: any = {
    date: {
      year: this.now.getFullYear(),
      month: this.now.getMonth() + 1,
      day: this.now.getDate(),
    }
  };

  public summarySwab: any = {
    total: 0,
    done: 0,
    undone: 0
  };

  public dateAdmission: any = {
    beginDate: {
      year: this.now.getFullYear(),
      month: this.now.getMonth() + 1,
      day: this.now.getDate(),
    },
    endDate: {
      year: this.now.getFullYear(),
      month: this.now.getMonth() + 1,
      day: this.now.getDate(),
    }
  };

  public myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd/mm/yyyy',
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    height: '35px',
    width: '240px',
  };

  // Input mask
  public maskBirth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskIdentity = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/,];
  public maskNumber:any = (rawString: any) => {
    const mask = /[1-9]/;
    const temp: RegExp[] = [];
    rawString = rawString.replace(/\D/g,'');
    rawString = rawString.replace(/\s/g, "")
    for (let i = 1; i <= rawString.length; i++) {
      temp.push(mask)
    }
    return temp;
  };
  
  public model: any = { hospital_id: '', name: '', birth: '', mr: '', identityNumber: '', admissionDate: '',
  category: '', modifiedName: '', checkupResult: undefined };

  public categoryList: any[];
  public doctorList: any[];
  public pathologistHospitalList: any[] = [];
  public appList: any[];
  public appListLoading: {[k: string]: any} = {};
  public selectedSwab: any;

  public limit = 20;
  public offset = 0;
  private page = 0;
  public isCanPrevPage = false;
  public isCanNextPage = false;

  public alerts: Alert[] = [];
  public showWaitMsg = false;
  public showNotFoundMsg = false;
  public closeResult: string;

  public isError = false;

  public checkupResult: any = '';

  constructor(
    public alertService: AlertService,
    public appointmentService: AppointmentService,
    public checkupService: CheckupService,
    public doctorService: DoctorService,
    public generalService: GeneralService,
    public modalService: NgbModal,
  ) {}

  async ngOnInit() {

    await this.getListCategories();
    await this.getListDoctor();
    await this.getPathologistHopsital();
    await this.listAppointment();
    await this.getCollectionAlert();
  }

  nextPage() {
    this.page += 1;
    this.offset = this.page * 20;
    this.isCanPrevPage = this.offset === 0 ? false : true;
    this.searchAppointment(false);
  }

  prevPage() {
    this.page -= 1;
    this.offset = this.page * 20;
    this.isCanPrevPage = this.offset === 0 ? false : true;
    this.searchAppointment(false);
  }

  refreshPage() {
    this.isError = false;
  }

  clearSearch() {
    this.model.name = '';
    this.model.mr = '';
    this.model.birth = '';
    this.model.identityNumber = '';
    this.model.category = '';
    this.model.admissionDate = '';
    this.model.modifiedName = '';
    this.model.checkupResult = undefined;
  }

  async getListCategories() {
    this.categoryList = await this.checkupService.getCategory()
    .toPromise().then(res => {
      if (res.status === 'OK' && res.data.length === 0) {
        this.alertService.success('No List Category in This Hospital', false, 3000);
      }

      return res.data;
    }).catch(err => {
      this.alertService.error(err.error.message, false, 3000);
      return [];
    });
  }

  async listAppointment(name = '', birth = '',  mr = '', identityNumber = '', admissionDate = '', category = '', modifiedName = '',
                        checkupResult = '') {
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;

    const strBeginDate = `${this.dateAdmission.beginDate.year}-${this.dateAdmission.beginDate.month}-${this.dateAdmission.beginDate.day}`;
    const beginDate = dateFormatter(strBeginDate, false);

    const strEndDate = `${this.dateAdmission.endDate.year}-${this.dateAdmission.endDate.month}-${this.dateAdmission.endDate.day}`;
    const endDate = dateFormatter(strEndDate, false);

    const hospital = this.hospital.id;

    const limit = this.limit;
    const offset = this.offset;
    this.appList = await this.appointmentService.getListAppointmentSwab(beginDate, endDate, hospital, name, birth, mr, identityNumber,
      admissionDate, category, modifiedName, checkupResult, limit, offset, channelId.BPJS, true).toPromise().then(res => {

        if (res.status === 'OK') {

          if (res.data.length > 0) {

            this.isCanNextPage = res.data.length >= 20 ? true : false;

            for (let i = 0, { length } = res.data; i < length; i += 1) {

              const checkup_result_created_date = res.data[i].checkup_result_created_date;

              res.data[i].custome_birth_date = dateFormatter(res.data[i].birth_date, true);
              res.data[i].custome_appointment_date = dateFormatter(res.data[i].appointment_date, true);
              res.data[i].custome_checkup_result_created_date = (checkup_result_created_date === null) ? '' :
                moment(checkup_result_created_date).utc().add(res.data[i].hospital_time_zone, 'hours').format('YYYY MM DD HH:mm:ss');
              res.data[i].custome_admission_date = (res.data[i].admission_date === null) ? '' :
                dateFormatter(res.data[i].admission_date, true);
              res.data[i].custome_from_time = res.data[i].from_time.substring(0, 5);
              res.data[i].custome_to_time = res.data[i].to_time.substring(0, 5);
              res.data[i].custome_identity_image_url = (res.data[i].registration_form_id) ? res.data[i].registration_identity_image_url :
                res.data[i].identity_image_url;
              res.data[i].custome_checkup_result_status_temporary = '';
            }

            this.summarySwab.total = res.data.length;
            this.summarySwab.done = res.data.filter((val: any) => val.checkup_result !== null).length;
            this.summarySwab.undone = res.data.filter((val: any) => val.checkup_result === null).length;

            this.showWaitMsg = false;
            this.showNotFoundMsg = false;
          } else {
            this.showWaitMsg = false;
            this.showNotFoundMsg = true;
          }
        } else {
          this.showWaitMsg = false;
          this.showNotFoundMsg = true;
        }
        return res.data;
      }).catch(err => {
        this.showWaitMsg = false;
        this.showNotFoundMsg = true;
        this.alertService.error(err.error.message, false, 3000);
        return [];
      });
  }

  async searchAppointment(search?: boolean) {

    this.offset = search ? 0 : this.offset;

    const {identityNumber, category, checkupResult} = await this.model;
    let { name, birth, mr, admissionDate,  modifiedName } = await this.model;

    const categoryId = category ? category.checkup_id : '';
    const arrBirth = birth ? birth.split('-') : '';
    const arrAdmissionDate = admissionDate ? admissionDate.split('-') : '';

    name = name ? name.toLowerCase() : '';
    mr = mr ? mr.toLowerCase() : '';
    modifiedName = modifiedName ? modifiedName.toLowerCase() : '';
    birth = arrBirth ? arrBirth[2] + '-' + arrBirth[1] + '-' + arrBirth[0] : '';
    admissionDate = arrAdmissionDate ? arrAdmissionDate[2] + '-' + arrAdmissionDate[1] + '-' + arrAdmissionDate[0] : '';

    if (name || birth || mr || identityNumber || admissionDate || category || modifiedName || checkupResult) {
      this.listAppointment(name, birth, mr, identityNumber, admissionDate, categoryId, modifiedName, checkupResult);
    } else {
      this.listAppointment();
    }
  }

  onDateChange(val: any) {

    const { year, month, day } = val.date;

    if (year === 0 && month === 0 && day === 0) {
      this.clearSearch();
      this.refreshPage();
      this.appList = [];
      this.alertService.error('Please Input Date', false, 3000);
    } else {
      this.dateAppointment = {
        date: {
          year,
          month,
          day,
        }
      };
      this.offset = 0;
      this.clearSearch();
      this.refreshPage();
      this.searchAppointment(false);
    }
  }

  onDateChangeRange(val: any) {
    
    if ((val.beginDate.year === 0 && val.beginDate.month === 0 && val.beginDate.day === 0) &&
      (val.endDate.year === 0 && val.endDate.month === 0 && val.endDate.day === 0)) {
      this.clearSearch();
      this.refreshPage();
      this.appList = [];
      this.alertService.error('Please Input Date', false, 3000);
    } else {
      this.dateAdmission = {
        beginDate: {
          year: val.beginDate.year,
          month: val.beginDate.month,
          day: val.beginDate.day,
        },
        endDate: {
          year: val.endDate.year,
          month: val.endDate.month,
          day: val.endDate.day,
        }
      };
      this.offset = 0;
      this.clearSearch();
      this.refreshPage();
      this.searchAppointment(false);
    }
  }

  async getCollectionAlert() {
    this.alertService.getAlert().subscribe((alert: Alert) => {
      if (!alert) {
        // clear alerts when an empty alert is received
        this.alerts = [];
        return;
      }
      // add alert to array
      this.alerts.push(alert);
    });
  }

  cssAlertType(alert: Alert) {
    if (!alert) {
      return;
    }

    switch (alert.type) {
      case AlertType.Success:
        return 'success';
      case AlertType.Error:
        return 'danger';
      case AlertType.Info:
        return 'info';
      case AlertType.Warning:
        return 'warning';
    }
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }

  open(content: any) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openconfirmation(content: any) {
    this.modalService.open(content, { windowClass: 'fo_modal_confirmation', backdrop: 'static', keyboard: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getMaxDate() {
    const currentDate = new Date();
    const maxDate = {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: currentDate.getDate()
      };
    return maxDate;
  }

  private getDismissReason(reason: any): string {

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async openChekupResultModal(val: any, content: any) {

    this.selectedSwab = val;
    this.selectedSwab.custome_birth_date = dateFormatter(this.selectedSwab.birth_date, true);

    this.openconfirmation(content);
  }

  async onChangeCheckupResult(event: any) {
    this.checkupResult = event.target.value;
  }

  setMaxRangeOfDate(val: any) {

    const {type, date} = val;

    if (type === 1) {

      const stringMaxDate = date.year + '/' + date.month + '/' + date.day;
      const maxAdmissionDate = moment(stringMaxDate);
      maxAdmissionDate.add(7, 'days');

      this.myDateRangePickerOptions = {
        dateFormat: 'dd/mm/yyyy',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        height: '35px',
        width: '240px',
        disableSince: {
          year: +(maxAdmissionDate.format('YYYY')),
          month: +(maxAdmissionDate.format('M')),
          day: +(maxAdmissionDate.format('D')),
        }
      };
    }
  }

  async print(val: any) {

    window.open(val.swab_result_pdf, '_blank');
  }

  async openConfirmationModal(content: any) {

    if (this.checkupResult === '') {
      alert(`Please select Test Result`);
      return;
    }

    this.openconfirmation(content);
  }

  async delayCheckupResult() {

    const appointment = this.selectedSwab;
    const checkupResult = (this.checkupResult === 'true');

    this.appListLoading[appointment.appointment_id] = 'Undo';

    const indexAppointment = this.appList.findIndex((val: any) => val.appointment_id === appointment.appointment_id);
    this.appList[indexAppointment].custome_checkup_result_status_temporary = (checkupResult) ? 'Positive...' : 'Negative...';

    this.listFunction[appointment.appointment_id] = setTimeout(async () => {

      await this.createCheckupResult(false, appointment, checkupResult);
    }, delaySubmit);

    this.modalService.dismissAll();
    this.checkupResult = '';
  }

  async createCheckupResult(isResend= false, appointment: any, checkupResult: any) {

    const indexAppointment = this.appList.findIndex((val: any) => val.appointment_id === appointment.appointment_id);

    try {
      this.appListLoading[appointment.appointment_id] = 'Process';

      if (isResend === false) {
        await this.generateSwabAttachment(appointment, checkupResult);
      }

      // Send Email
      const emailPayload = {
        appointmentId: appointment.appointment_id,
        checkupResult,
        emailPatient: appointment.registration_email,
      };

      const sendEmail = await this.appointmentService.emailCheckupResult(emailPayload).toPromise().then(res => {
        return (res.status === 'OK');
      }).catch((_err: any) => {
        this.alertService.error('Failed to send email. Please try again', false);
        this.appListLoading[appointment.appointment_id] = 'Failed';

        throw new Error(`Failed to send email`);
      });

      // Create Checkup Result
      this.addCheckupResultPayload = {
        appointmentId: appointment.appointment_id,
        checkupResult,
        emailPatient: appointment.registration_email,
        emailStatus: sendEmail,
        userId: this.userId,
        userName: this.userName,
      };

      await this.appointmentService.addCheckupResult(this.addCheckupResultPayload).toPromise().then((_res: any) => {
        this.alertService.success(`Email send to ${appointment.registration_email}`, false);
      }).catch(_err => {
        this.alertService.error('Failed to save antigen result', false);
        this.appListLoading[appointment.appointment_id] = 'Failed';

        throw new Error('Failed to save antigen result');
      });

      this.appList[indexAppointment].checkup_result = checkupResult;
      this.appList[indexAppointment].checkup_result_created_name = this.userName;
      this.appList[indexAppointment].custome_checkup_result_created_date = moment().utc().format('YYYY MM DD HH:mm:ss');
      this.appListLoading[appointment.appointment_id] = 'Success';

      this.searchAppointment(false);
    } catch (error) {
      this.appListLoading[appointment.appointment_id] = 'Failed';
      throw new Error(`Failed to create checkup result`);
    }
  }

  async generateSwabAttachment(appointment: any, checkupResult: any) {

    // Generate PDF
    const pdfPayload = {
      appointmentId: appointment.appointment_id,
      checkupResult,
      authorizedBy: this.user.fullname,
      authorizedDate: moment().utc(),
    };

    const resGenerateSwab = await this.appointmentService.generateSwabPdf(pdfPayload).toPromise().then(res => {
      return res;
    }).catch((_err: any) => {
      this.alertService.error('Failed on generate swab pdf', false);
      this.appListLoading[appointment.appointment_id] = 'Failed';

      throw new Error(`Failed on generate swab pdf`);
    });

    // Upload PDF ke storage online
    const uploadPayload = {
      filePath: resGenerateSwab.data.pdf_path
    };

    const uploadedFile = await this.appointmentService.uploadSwabPdf(uploadPayload).toPromise().then(res => {
      return res.data;
    }).catch((_err: any) => {
      this.alertService.error('Failed on upload swab pdf', false);
      this.appListLoading[appointment.appointment_id] = 'Failed';

      throw new Error(`Failed on upload swab pdf`);
    });

    // Update swab result pdf field
    const updatePayload = {
      appointmentId: appointment.appointment_id,
      fileName: uploadedFile[0].uri_ext
    };

    await this.appointmentService.updateSwabResult(updatePayload).toPromise().then(res => {
      return (res.status === 'OK');
    }).catch((_err: any) => {
      this.alertService.error('Failed on update swab file pdf', false);
      this.appListLoading[appointment.appointment_id] = 'Failed';

      throw new Error(`Failed on update swab file pdf`);
    });

    // Hapus file
    await this.appointmentService.deletePDFTemplate(appointment.appointment_id).toPromise().then(res => {
      return (res.status === 'OK');
    }).catch((_err: any) => {
      this.alertService.error('Failed on delete swab pdf', false);
      this.appListLoading[appointment.appointment_id] = 'Failed';

      throw new Error('Failed on delete swab pdf');
    });
  }

  async resendCheckupResult() {

    await this.createCheckupResult(true, this.selectedSwab, this.selectedSwab.checkup_result);
    this.modalService.dismissAll();
  }

  async cancelCheckupResult(val: any) {

    clearTimeout(this.listFunction[val.appointment_id]);
    this.alertService.success(`Success undoing for ${val.contact_name} - ${val.identity_number}`, false);
    this.appListLoading[val.appointment_id] = '';

    const indexAppointment = this.appList.findIndex((data: any) => data.appointment_id === val.appointment_id);
    this.appList[indexAppointment].custome_checkup_result_status_temporary = '';
  }

  async specimentReceived(val: any) {
    try {

      const appointmentId = val.appointment_id;
      const specimentReceived = moment().utc();

      const payload = {
        appointmentId,
        specimentReceived
      };

      const resUpdateSpecimentReceived = await this.appointmentService.updateSpecimentReceived(payload).toPromise().then(res => {
        return (res.status === 'OK');
      }).catch((_err: any) => {
        throw new Error(`Failed on update speciment received time`);
      });

      if (resUpdateSpecimentReceived) {

        this.alertService.success(`Success update speciment received for ${val.contact_name} - ${val.identity_number}`, false);

        const indexAppointment = this.appList.findIndex((data: any) => data.appointment_id === appointmentId);
        this.appList[indexAppointment].speciment_received_date = specimentReceived;
      } else {
        this.alertService.error(`Failed on update speciment received time for ${val.contact_name} - ${val.identity_number}`, false);
        throw new Error(`Failed on update speciment received time`);
      }
    } catch (error) {
      throw new Error(`Failed to update speciment received time`);
    }
  }

  async getListDoctor() {

    this.doctorList =  await this.doctorService.getInternalDoctor(this.hospital.id)
    .toPromise().then(res => {
      if (res.status === 'OK' && res.data.length === 0) {
        this.alertService.success('No Doctor in This Hospital', false, 3000);
      }
      return res.data;
    }).catch(err => {
      this.alertService.error(err.error.message, false, 3000);
      return [];
    });
  }

  trackByIdx(index: number): any {
    return index;
  }

  pathologistHospitalButton(type: string, index: number = 0) {

    if (type === 'Add') {
      this.pathologistHospitalList.push('');
    } else {
      this.pathologistHospitalList.splice(index, 1);
    }
  }

  async savePathologistHospital() {

    const payload = {
      hospitalId: this.hospital.id,
      doctorId : this.pathologistHospitalList,
      userId: this.userId,
      userName: this.userName,
    };

    await this.generalService.savePathologistHospital(payload).toPromise().then(res => {
      return res.data;
    }).catch((_err: any) => {
      throw new Error(`Failed to save Clinical Pathologist Hospital`);
    });

    this.modalService.dismissAll();
  }

  async getPathologistHopsital() {

    const dataPathologistHospital = await this.generalService.getPathologistHospital(this.hospital.id)
      .toPromise().then(res => {
        if (res.status === 'OK' && res.data.length === 0) {
          this.alertService.success('No Doctor in This Hospital', false, 3000);
        }
        return res.data;
      }).catch(err => {
        this.alertService.error(err.error.message, false, 3000);
        return [];
    });

    if (dataPathologistHospital.length === 0) {
      dataPathologistHospital.push('');
    }

    this.pathologistHospitalList = dataPathologistHospital;
  }

  exportData() {

    const strBeginDate = `${this.dateAdmission.beginDate.year}-${this.dateAdmission.beginDate.month}-${this.dateAdmission.beginDate.day}`;
    const beginDate = dateFormatter(strBeginDate, false);

    const strEndDate = `${this.dateAdmission.endDate.year}-${this.dateAdmission.endDate.month}-${this.dateAdmission.endDate.day}`;
    const endDate = dateFormatter(strEndDate, false);

    const hospitalId = this.hospital.id;
    const hospitalAlias = this.hospital.alias;

    const uri = `&hospitalAlias=${hospitalAlias}&hospitalId=${hospitalId}&beginDate=${beginDate}&checkupTypeId=1&endDate=${endDate}`;

    const url = environment.FRONT_OFFICE_SERVICE + '/appointments/covid/swab-report?' + uri;
    window.open(url, '_blank');
  }
}
