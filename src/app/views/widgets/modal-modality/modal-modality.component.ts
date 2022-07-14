import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { appInfo, sourceApps } from '../../../variables/common.variable';
import { FixedList, Modality, ModalityHospital, ModalityHospitalRequest } from '../../../models/radiology/radiology';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { RoomMappingService } from '../../../services/room-mapping.service';
import { RoomMapping } from '../../../models/room-mapping';
import { RadiologyService } from 'src/app/services/radiology.service';
import { RadiologyService2 } from 'src/app/services/radiology/radiology.service';
import RadiologyItem from '../../../models/radiology/radiology-item';
import { ModalConfirmDeleteComponent } from '../modal-confirm-delete/modal-confirm-delete.component';
import RadiologyListResponse from '../../../models/radiology/responses/radiology-response';

@Component({
  selector: 'app-modal-modality',
  templateUrl: './modal-modality.component.html',
  styleUrls: ['./modal-modality.component.css']
})
export class ModalModalityComponent implements OnInit {

  @Input() username: any;
  @Input() responseData: any

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
  public modalityHospitalId: string = null;
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
  public modalityHospital: ModalityHospital;
  public modalityOptions: Modality[];
  public modalityHospitalRequest: ModalityHospitalRequest;
  public loading = false;
  public autocomplete: string = null;
  public modalRef: NgbModalRef;
  public operationals: RadiologyListResponse = {
    status: '',
    message: '',
    data: [],
    last_update: ''
  };

  roomMapingFormat(row: RoomMapping): string {
    return `Floor ${row.floor_name} - ${row.wing_name} - Room ${row.room_name}`;
  }

  getRoomDetail(room_mapping_id: string) {
    const temp: RoomMapping = this.roomOptions.find(x => x.room_mapping_id == room_mapping_id);
    if (temp != null) {
      return this.roomMapingFormat(temp);
    }
    return null;
  }

  private _filter(value: string): RoomMapping[] {
    if (value == null || value == '') {
      return this.roomOptions.filter((row, index) => index < 30 || row);
    }
    return this.roomOptions.filter(row => {
      const option: string = this.roomMapingFormat(row);
      return option.toLowerCase().includes(value.toLowerCase());
    });
  }

  constructor(
    public modalService: NgbModal,
    private service2: RadiologyService2,
    private service: RadiologyService,
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
    private userService: UserService,
    private _fb: FormBuilder,
    private roomMappingService: RoomMappingService
  ) { }

  ngOnInit() {
    this.modalityForm = this._fb.group({
      roomId: [{value: '', disabled: false}, [Validators.required]],
      roomName: [{value: '', disabled: false}, [Validators.required]],
      status: [{value: '1', disabled: false}, [Validators.required]],
      duration: [{value: 0, disabled: false}, [Validators.required, Validators.min(0)]],
      operationalType: [{value: '3', disabled: false}, [Validators.required]],
      modalityId: [{value: '', disabled: false}, [Validators.required]],
      modalityLabel: [{value: '', disabled: false}, [Validators.required]],
      from_to_date: [{}, []],
      notes: [{value: '', disabled: false}, []],
      search: [{value: '', disabled: false}, []],
    });
    this.getCollectionAlert();
    this.checkUserLogin();
    this.getRooms();
    this.getModality();
    if (this.responseData) {
      this.modalityHospitalId = this.responseData.modality_hospital_id
      this.getModalityHospitalById();
    }
  }

  getModalityHospitalById() {
    this.service.getModalityHospitalById(this.modalityHospitalId)
      .subscribe(data => {
        this.modalityHospital = data.data;
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
          // eslint-disable-next-line
          map(val => this._filter(val))
        );
        console.log('🚀 ~ filteredOptions', this.filteredOptions);
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
      from_to_date: null,
      notes: this.modalityHospital.notes
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
    console.log(this.modalityHospital.notes)
    this.modalityForm.patchValue({
      modalityId: this.modalityHospital.modality_id,
      modalityLabel: this.modalityHospital.modality_label,
      hospitalId: this.modalityHospital.hospital_id,
      roomId: this.modalityHospital.room_id,
      roomName: this.roomMapingFormat(this.modalityHospital.tx_room_mapping),
      duration: this.modalityHospital.operational_type != '3' ? 0 : this.modalityHospital.duration,
      operationalType: this.modalityHospital.operational_type,
      status: this.modalityHospital.status == '3' && this.modalityHospital.tx_modality_closes.length == 0 ? '1' : this.modalityHospital.status,
      notes: this.modalityHospital.notes,
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
      document.getElementById(value).focus();
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

  async changePassword() {
    const valid = this.checkingPass();
    if (valid) {
      this.isSubmit = true;
      const username = this.model.username;
      const oldPassword = btoa(this.model.oldPassword);
      const newPassword = btoa(this.model.newPassword);
      const applicationId = this.applicationId;
      const modifiedBy = this.model.username;
      const source = sourceApps;
      const body = {
        username,
        oldPassword,
        newPassword,
        applicationId,
        modifiedBy,
        source
      };
      await this.userService.changePassword(body)
        .toPromise().then(res => {
          this.alertService.success(res.message, false, 2000);
          this.closeModal();
        }).catch(err => {
          this.isSubmit = false;
          this.alertService.error(err.error.message, false, 3000);
        });
    }
  }

  close() {
    this.activeModal.close();
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
    console.log(value)
    if(value != true){
      this.modalityForm.get('status').setValue('2');
    }else{
      this.modalityForm.get('status').setValue('1');
    }
  }

  submit() {
    if (this.loading) {
      return;
    }
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
    let closeModalityHospital = {
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
      notes: this.modalityForm.controls.notes.value,
    };
    if(this.modalityHospitalId != null){
      this.updateModalityHospital()
    }else{
      this.storeModalityHospital()
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
      location.reload();
      this.loading = false;
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
        timer: 1500
      });
      this.loading = false;
      location.reload();
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
  
  public deleteModality(item: RadiologyItem) {
    console.log(item)
    this.modalRef = this.modalService.open(ModalConfirmDeleteComponent);
    this.modalRef.componentInstance.itemId = item.modality_hospital_id;
    this.modalRef.componentInstance.msg = `modality: '${item.modality_label}'`;
    this.modalRef.componentInstance.service = this.service;
    this.modalRef.result.then((result) => {
      if (result === 'OK') {
        this.sendDeleteRequest(item);
      }
    }, (_) => {});
  }

  public sendDeleteRequest(item: RadiologyItem) {
    this.service2.deleteModalityHospital(item.modality_hospital_id).subscribe((res: any) => {
        if (res.status === 'OK') {
          this.showSuccessAlert('Successfully deleted');
          this.deleteModalityBy(item.modality_hospital_id);
        } else {
          this.showErrorAlert('Delete failed');
        }
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

  public showSuccessAlert(message) {
    Swal.fire({
      type: 'success',
      title: 'Delete',
      text: message,
      timer: 1500
    });
  }

  public showErrorAlert(message) {
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: message,
      timer: 1500
    });
  }
  
}
