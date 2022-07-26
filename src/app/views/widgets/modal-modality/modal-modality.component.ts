/* eslint no-use-before-define: 0 */  //
import { Component, OnInit, Input } from '@angular/core';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { appInfo } from '../../../variables/common.variable';
import { FixedList, Modality, ModalityHospital, ModalityHospitalRequest } from '../../../models/radiology/radiology';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { RoomMappingService } from '../../../services/room-mapping.service';
import { RoomMapping } from '../../../models/room-mapping';
import { RadiologyService } from '../../../services/radiology/radiology.service';
import RadiologyItem from '../../../models/radiology/radiology-item';
import { ModalConfirmDeleteComponent } from '../modal-confirm-delete/modal-confirm-delete.component';
import RadiologyListResponse from '../../../models/radiology/responses/radiology-response';
import { ModalitySlot } from '../../../models/radiology/modality-slot';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-modal-modality',
  templateUrl: './modal-modality.component.html',
  styleUrls: ['./modal-modality.component.css']
})
export class ModalModalityComponent implements OnInit {

  @Input() username: any;
  @Input() responseData: any

  modalitySlots: ModalitySlot[];
  public temp: any = RoomMapping
  public filteredOptions: Observable<RoomMapping[]>;
  public key: { user: any; };
  public user: any;
  public applicationId = appInfo.APPLICATION_ID;
  public roleId = appInfo.ROLE_ID;
  public model: any = {};
  public fieldTextType = false;
  public alerts: Alert[] = [];
  public isSubmit = false;
  public alertText = '';
  public modalityForm:any = FormGroup;
  public modalityHospitalId: any = null;
  public operationalTypeList: FixedList[] = [
    {id: '1', name: 'FCFS'},
    {id: '3', name: 'Fixed'},
  ];
  public modifiedDate: any = null;
  public strKey = localStorage.getItem('key') || '{}';
  public localKey = JSON.parse(this.strKey);
  public hospitalId = this.localKey.hospital.id;
  public userId: string = this.localKey.user.username;
  public userName: string = this.localKey.hospital.id;
  public dummyMACAddress = 'OPAdmin';
  public roomOptions: RoomMapping[] = [];
  public modalityHospital:any = ModalityHospital;
  public modalityOptions: Modality[];
  public modalityHospitalRequest:any = ModalityHospitalRequest;
  public loading = false;
  public autocomplete: any = null;
  public modalRef: NgbModalRef;
  public operationals: RadiologyListResponse = {
    status: '',
    message: '',
    data: [],
    last_update: ''
  };

  private _filter(value: string): RoomMapping[] {
    if (value == null || value == '') {
      return this.roomOptions.filter((row, index) => index < 30 || row);
    }
    return this.roomOptions.filter(row => {
      const option: string = this.roomMapingFormat(row);
      return option.toLowerCase().includes(value.toLowerCase());
    });
  }
  public statusTextArea: boolean = false  

  constructor(
    public modalService: NgbModal,
    private service: RadiologyService,
    public activeModal: NgbActiveModal,
    public alertService: AlertService,
    private _fb: FormBuilder,
    private roomMappingService: RoomMappingService
  ) { }

  ngOnInit() {
    this.modalityForm = this._fb.group({
      roomId: [{value: '', disabled: false}, [Validators.required]],
      roomName: [{value: '', disabled: false}, [Validators.required]],
      status: [{value: '1', disabled: false}, [Validators.required]],
      duration: this.responseData == null ? [{value: '', disabled: false}, [Validators.required, Validators.min(0)]]
      : [{value: '', disabled: true}] ,
      operationalType: this.responseData == null ? [{value: '3', disabled: false}, [Validators.required]] : 
      [{value: '3', disabled: true}]
      ,
      modalityId: this.responseData == null ? [{value: '', disabled: false}, [Validators.required]]
      : [{value: '', disabled: true}],
      modalityLabel: [{value: '', disabled: false}, [Validators.required]],
      from_to_date: [{}, []],
      modality_notes: [{value: '', disabled: false}],
      search: [{value: '', disabled: false}, []],
    });
    this.getCollectionAlert();
    this.checkUserLogin();
    this.getRooms();
    this.getModality();
    if (this.responseData) {
      this.modalityHospitalId = this.responseData.modality_hospital_id
      this.getModalityHospitalById();
      if (this.responseData.status == 2) {
        this.statusTextArea = true;
      }
    }
  }

  roomMapingFormat(row: RoomMapping): string {
    return `Floor ${row.floor_name} - ${row.wing_name} - Room ${row.room_name}`;
  }

  getRoomDetail(room_mapping_id: string) {
    this.temp = this.roomOptions.find(x => x.room_mapping_id == room_mapping_id);
    if (this.temp != null) {
      return this.roomMapingFormat(this.temp);
    }
    return null;
  }

  getModalityHospitalById() {
    this.service.getModalityHospitalById(this.modalityHospitalId)
      .subscribe(data => {
        this.modalityHospital = data.data;
        console.log(this.modalityHospital, 'modality')
        if (this.modalityHospital != null) {
          this.setData();
        } else {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Data not found',
            timer: 1500
          });
        }
      }, () => {
        this.modalityHospital = null;
      });
  }

  getRooms() {
    const key = JSON.parse(this.strKey);
    const hospitalId = key.hospital.id
    this.roomMappingService.getRoomsActive(hospitalId)
      .subscribe(data => {
        this.roomOptions = data.data;
        this.filteredOptions = this.modalityForm.get('search').valueChanges.pipe(
          startWith(''),
          map((val: any) => this._filter(val))
        );
      }, () => {
        this.roomOptions = [];
      });
  }

  getModality() {
    this.service.getModality({
      hospitalId: this.hospitalId,
    })
      .subscribe(data => {
        console.log(data)
        this.modalityOptions = data.data;
      }, () => {
        this.modalityOptions = [];
      });
  }

  setData() {
    let closeModality = {
      from_to_date: {},
      notes: null
    };
    if (this.modalityHospital.tx_modality_closes.length > 0) {
      const {from_date, to_date, notes} = this.modalityHospital.tx_modality_closes[0];
      closeModality = {
        from_to_date: {
          beginDate: {year: moment(from_date).format('YYYY'), month: moment(from_date).format('MM'), day: moment(from_date).format('DD')},
          endDate: {year: moment(to_date).format('YYYY'), month: moment(to_date).format('MM'), day: moment(to_date).format('DD')}
        },
        notes
      };
    }
    console.log(this.modalityHospital.modality_notes, 'ss')
    this.modalityForm.patchValue({
      modalityId: this.modalityHospital.modality_id,
      modalityLabel: this.modalityHospital.modality_label,
      hospitalId: this.modalityHospital.hospital_id,
      roomId: this.modalityHospital.room_id,
      roomName: this.roomMapingFormat(this.modalityHospital.tx_room_mapping),
      duration: this.modalityHospital.operational_type != '3' ? 0 : this.modalityHospital.duration,
      operationalType: this.modalityHospital.operational_type,
      status: this.modalityHospital.status == '3' && this.modalityHospital.tx_modality_closes.length == 0 ? '1' : this.modalityHospital.status,
      modality_notes: this.modalityHospital.modality_notes,
      ...closeModality
    });
    this.modifiedDate = moment(this.modalityHospital.modified_date).format('DD MMM YYYY, HH:mm');
  }

  showAutoComplete(value: string) {
    if (value != null) {
      const roomName = this.modalityForm.get('roomName').value;
      this.modalityForm.get('search').setValue(roomName);
    }
    this.autocomplete = value == this.autocomplete ? null : value;
    setTimeout(() => {
      document.getElementById(value)!.focus();
    }, 100);
  }

  setToItem(room: RoomMapping) {
    this.modalityForm.get('roomId').setValue(room.room_mapping_id);
    this.modalityForm.get('roomName').setValue(this.getRoomDetail(room.room_mapping_id));
    this.autocomplete = null;
  }

  checkUserLogin() {
    const strKey = localStorage.getItem('key') || '{}';
    if (JSON.parse(strKey) > 0) {
      this.key = JSON.parse(strKey);
      this.user = this.key.user;
      this.model.username = this.user.username;
    } else {
      this.model.username = this.username ? this.username : null;
    }
  }

  validationPass(value: any) {
    const minLength = 8;
    const pattern = /[^A-Za-z0-9]/;
    const hasNumber = /\d/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    if (value.length < minLength) {
      this.alertText = 'Your password must have min 8 character.';
      return false;
    } else if (!hasNumber || !hasUpper || !hasLower) {
      this.alertText = 'Your password must have upper case, lower case, and number.';
      return false;
    } else if (!value.match(pattern)) {
      this.alertText = 'Your password must have special character.';
      return false;
    } else {
      this.alertText = '';
      return true;
    }
  }

  checkingPass() {
    if (this.model.oldPassword === this.model.newPassword) {
      this.alertText = 'Create a new password you haven\'t used before';
      return false;
    } else if (this.model.newPassword !== this.model.confirmNewPassword) {
      this.alertText = 'Please make sure both passwords match';
      return false;
    } else if (this.validationPass(this.model.newPassword) === false) {
      return false;
    } else {
      return true;
    }
  }

  close() {
    console.log(this.responseData)
    if(isEmpty(this.responseData))
    {
      this.activeModal.close();
    }else{
      this.responseData.refreshData
      this.activeModal.close();
    }
  }

  closeModal() {
    setTimeout(() => {
      this.close();
      this.isSubmit = false;
    }, 2000);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
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

  changeStatus(event: any){
    const value = event.target.checked;
    if(value != true){
      this.modalityForm.get('status').setValue('2');
    }else{
      this.modalityForm.get('status').setValue('1');
      this.statusTextArea = false;
    }
  }

  async submit(item: RadiologyItem) {
    if (this.loading) {
      return;
    }
    let modalityHospitalId;
    let reserveDate;
    let responseSlots;
    this.loading = true;
    if (this.modalityForm.status == 'INVALID') {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'All fields are required!',
        timer: 1500
      });
      this.loading = false;
      return;
    }
    const from_to_date = this.modalityForm.controls.from_to_date.value;
    const status = this.modalityForm.controls.status.value;
    let closeModalityHospital: any = {
      fromDate: null,
      toDate: null,
      fromTime: null,
      toTime: null
    };
    if (status == '3') {
      if (from_to_date != null) {
        const {beginJsDate, endJsDate} = from_to_date;
        closeModalityHospital = {
          fromDate: moment(beginJsDate).format('YYYY-MM-DD'),
          toDate: moment(endJsDate).format('YYYY-MM-DD'),
          fromTime: '00:00',
          toTime: '23:59'
        };
      } else {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Date range required!',
          timer: 1500
        });
        this.loading = false;
        return;
      }
    }
    this.modalityHospitalRequest = {
      modalityId: this.modalityForm.controls.modalityId.value,
      modalityLabel: this.modalityForm.controls.modalityLabel.value,
      roomId: this.modalityForm.controls.roomId.value,
      duration: this.modalityForm.controls.duration.value,
      operationalType: this.modalityForm.controls.operationalType.value,
      status: status,
      hospitalId: this.hospitalId,
      userId: this.userId,
      source: this.dummyMACAddress,
      userName: this.userName,
      ...closeModalityHospital,
      modality_notes: this.modalityForm.controls.modality_notes.value,
    };
    console.log(this.modalityHospitalRequest.status)
    if (this.modalityHospitalId != null && this.modalityHospitalRequest.status == 2){
      modalityHospitalId = item.modality_hospital_id;
      reserveDate = moment().format('YYYY-MM-DD')
      responseSlots = await this.service.getModalitySlots(modalityHospitalId, reserveDate).toPromise()
      this.modalitySlots = responseSlots.data || [];
      await this.confirmUpdate(this.modalityHospitalRequest);
    }
    else if(this.modalityHospitalId != null && this.modalityHospitalRequest.status == 1){
      this.updateModalityHospital();
    }else{
      this.storeModalityHospital();
    }
  }

  storeModalityHospital(){
    this.service.postModalityHospital(this.modalityHospitalRequest).subscribe(data => {
      Swal.fire({
        type: 'success',
        text: 'The data has been successfully created',
        showConfirmButton: false,
        timer: 1500
      });
      this.responseData = data;
      this.loading = false;
      this.close();
    }, err => {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: err.error.message,
        timer: 1500
      });
      this.loading = false;
    });
  }

  updateModalityHospital(){
    this.service.putModalityHospital(this.modalityHospitalRequest, this.modalityHospitalId).subscribe(() => {
      Swal.fire({
        type: 'success',
        text: 'The data has been successfully updated',
        showConfirmButton: false,
        timer: 3000
      });
      this.close();
    }, err => {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: err.error.message,
        timer: 1500
      });
      this.loading = false;
    });
  }

  public async confirmUpdate(item: RadiologyItem) {
  
    this.modalRef = this.modalService.open(ModalConfirmDeleteComponent, { windowClass: 'modal_cancel_appointment' })
    this.modalRef.componentInstance.itemId = item.modality_hospital_id;
    this.modalRef.componentInstance.msg = `modality: '${item.modality_label}'`;
    this.modalRef.componentInstance.headerMsg = `Rubah menjadi inactive`;
    this.modalRef.componentInstance.service = this.service;
    this.modalRef.componentInstance.modalitySlot = this.modalitySlots
    this.modalRef.result.then((result) => {
      if (result === 'OK') {
        this.updateModalityHospital();
      }
    }, (_) => {});
  }
  
  public async deleteModality(item: RadiologyItem) {
    const modalityHospitalId = item.modality_hospital_id;
    const reserveDate = moment().format('YYYY-MM-DD')
    const responseSlots = await this.service.getModalitySlots(modalityHospitalId, reserveDate).toPromise()
    this.modalitySlots = responseSlots.data || [];
    this.modalRef = this.modalService.open(ModalConfirmDeleteComponent, { windowClass: 'modal_cancel_appointment' })
    this.modalRef.componentInstance.itemId = item.modality_hospital_id;
    this.modalRef.componentInstance.msg = `modality: '${item.modality_label}'`;
    this.modalRef.componentInstance.service = this.service;
    this.modalRef.componentInstance.modalitySlot = this.modalitySlots
    this.modalRef.result.then((result) => {
      if (result === 'OK') {
        console.log(result)
        this.sendDeleteRequest(item);
      }
    }, (_) => {});
  }

  public sendDeleteRequest(item: RadiologyItem) {
    this.service.deleteModalityHospital(item.modality_hospital_id).toPromise().then(res => {
      this.deleteModalityBy(item.modality_hospital_id);
      this.alertService.success(res.message, false, 3000);
      this.close();
    }).catch(err => {
      this.showErrorAlert(err.error.message);
      this.alertService.error(err.error.message, false, 3000);
    });
  }

  public deleteModalityBy(itemId: string) {
    this.operationals = {
      message: this.operationals.message,
      status: this.operationals.status,
      data: this.operationals.data
        .filter(e => e.modality_hospital_id !== itemId),
      last_update: this.operationals.last_update
    };
  }

  public showSuccessAlert(message: any) {
    Swal.fire({
      type: 'success',
      title: 'Delete',
      text: message,
      timer: 3000
    });
  }

  public showErrorAlert(message: any) {
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: message,
      timer: 3000
    });
  }
  
}
