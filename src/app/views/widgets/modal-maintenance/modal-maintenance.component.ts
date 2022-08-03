/* eslint no-use-before-define: 0 */  //
import { Component, OnInit, Input } from '@angular/core';
import { AlertService } from '../../../services/alert.service';
import { Alert } from '../../../models/alerts/alert';
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
import { isEmpty } from "lodash";

@Component({
  selector: 'app-modal-maintenance',
  templateUrl: './modal-maintenance.component.html',
  styleUrls: ['./modal-maintenance.component.css']
})
export class ModalMaintenanceComponent implements OnInit {

  @Input() responseData: any;
  @Input() maintenanceItem: any;
  @Input() isUpdate: boolean = false;

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
  public roomName: any
  public errorTimer: boolean = false;
  public errorMsg: string;
  public statusTextArea: boolean = false;
  public retrievedModality: boolean = false;
  public newDate = moment()
  public newFromTime: any = moment("00:00", "HH:mm").format('HH:mm');
  public newToTime: any = '24:00';
  public defaultStartDate: any = moment()
  public defaultEndDate: any = moment()
  public operationals: RadiologyListResponse = {
    status: '',
    message: '',
    data: [],
    last_update: ''
  };
  public operationalMaintenance: any
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
    private service: RadiologyService,
    public activeModal: NgbActiveModal,
    public alertService: AlertService,
    private _fb: FormBuilder,
    private roomMappingService: RoomMappingService
    ) {}

    ngOnInit() {
    this.modalityForm = this._fb.group({
      modalityHospitalId: [{value: this.modalityHospitalId? this.modalityHospitalId : '', disabled: false}, [Validators.required]],
      roomId: [{value: this.modalityHospital.room_id, disabled: false}, [Validators.required]],
      roomName: [{value: '', disabled: false}, [Validators.required]],
      status: [{value: '3', disabled: false}, [Validators.required]],
      duration: [{value: this.modalityHospital.duration, disabled: false}, [Validators.required, Validators.min(0)]],
      operationalType: [{value: this.modalityHospital.operational_type, disabled: false}, [Validators.required]],
      modalityId: [{value: this.modalityHospital.modality_id, disabled: false}, [Validators.required]],
      from_to_date: [{}, []],
      notes: [{value: this.responseData == null ? '' : this.responseData.notes, disabled: false}, []],
      search: [{value: '', disabled: false}, []],
    });
    this.getRooms();
    this.getModality();
    this.fillDefaultOperationals();
    if (this.responseData != null) {
      this.modalityHospitalId = this.responseData.modality_hospital_id
      this.getModalityHospitalById(this.modalityHospitalId);
      this.retrievedModality = true
      this.newFromTime = moment(this.responseData.from_time, 'HH:mm').format('HH:mm');
      this.newToTime = this.responseData.to_time
      this.newDate =  moment(this.responseData.from_date);
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

  async getModalityHospitalById(evt?: any) {
    let modalityHospitalId = null
    if(this.responseData != null){
      modalityHospitalId = this.responseData.modality_hospital_id
    }else{
      modalityHospitalId = evt.target.value
    }

    this.modalityHospitalId = modalityHospitalId
    await this.service.getModalityHospitalById(modalityHospitalId)
      .subscribe(data => {
        this.modalityHospital = data.data;
        this.retrievedModality = true;
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
        this.modalityOptions = data.data;
      }, () => {
        this.modalityOptions = [];
      });
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
  close(updated: boolean = false) {
    let msg = 'closed'
    if(updated){
      msg = 'refresh'
    }
    this.activeModal.close(msg);

  }
  
  async submit() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    if (this.modalityForm.controls.notes.value == null) {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Tambahkan Catatan!',
        timer: 1500
      });
      this.loading = false;
      return;
    }
    const status = this.modalityForm.controls.status.value;
   
    
    this.modalityHospitalRequest = {
      modalityId: this.modalityHospital.modality_id,
      modalityLabel: this.modalityHospital.modality_label,
      roomId: this.modalityHospital.room_id,
      duration: this.modalityHospital.duration,
      operationalType: this.modalityHospital.operational_type,
      status: status,
      hospitalId: this.hospitalId,
      userId: this.userId,
      source: this.dummyMACAddress,
      userName: this.userName,
      fromDate: moment(this.newDate).format('YYYY-MM-DD'),
      toDate: moment(this.newDate).format('YYYY-MM-DD'),
      fromTime: this.newFromTime,
      toTime: this.newToTime,
      notes: this.modalityForm.controls.notes.value,
    };
      const slot = await this.service.getModalitySlots(this.modalityHospitalId, this.modalityHospitalRequest.fromDate).toPromise()

      if(!isEmpty(this.responseData)){
        console.log('masuk sini')
        if(isEmpty(slot.data)){
          this.updateModalityHospital();
        }else if(!isEmpty(slot.data) && !slot.data[0].is_maintenance){
          this.modalitySlots = slot.data;
          await this.confirmUpdate(this.modalitySlots, true);
          this.close(true);
        }else{
          this.updateModalityHospital();
        }
      }else{
        console.log('eh kesini')
        if(isEmpty(slot.data)){
          console.log('eh terus kesini')
          this.storeModalityHospital();
        }else if(!isEmpty(slot.data) && !slot.data[0].is_maintenance){
          console.log('eh bukan deng terus kesini')
          this.modalitySlots = slot.data;
          await this.confirmUpdate(this.modalitySlots, false);
          this.close(true);
        }else{
          this.storeModalityHospital();
        }
      }
  }

  public async confirmUpdate(item: any, update: boolean) {
    this.modalRef = this.modalService.open(ModalConfirmDeleteComponent, { windowClass: 'modal_cancel_appointment' })
    this.modalRef.componentInstance.itemId = item.modality_hospital_id;
    this.modalRef.componentInstance.msg = `modality: '${item.modality_label}'`;
    this.modalRef.componentInstance.msgUpadte = `ada appointment untuk modality ini di jam ${item[0].from_time} - ${item[0].to_time}, silahkan cari jadwal lain untuk maintenance'`;
    this.modalRef.componentInstance.confirmMaintenance = true;
    this.modalRef.componentInstance.headerMsg = `Jadwalkan untuk perawatan`;
    this.modalRef.componentInstance.service = this.service;
    this.modalRef.componentInstance.modalitySlot = this.modalitySlots
    this.modalRef.result.then((result) => {
      if (result === 'OK') {
          if(update){
          this.updateModalityHospital();
        }else{
          this.storeModalityHospital();
        }
      }
    }, (_) => {});
  }

  storeModalityHospital(){
    this.service.putModalityHospital(this.modalityHospitalRequest, this.modalityHospitalId).subscribe(() => {
      Swal.fire({
        type: 'success',
        text: 'The data has been successfully updated',
        showConfirmButton: false,
        timer: 3000
      });
      this.close(true);
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
    this.service.putModalityClose(this.modalityHospitalRequest, this.modalityHospitalId, this.responseData.modality_close_id).subscribe(() => {
      Swal.fire({
        type: 'success',
        text: 'The data has been successfully updated',
        showConfirmButton: false,
        timer: 3000
      });
      this.close(true);
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

  public async deleteModality(item: RadiologyItem) {
    const modalityHospitalId = item.modality_hospital_id;
    const reserveDate = moment().format('YYYY-MM-DD')
    const responseSlots = await this.service.getModalitySlots(modalityHospitalId, reserveDate).toPromise()
    this.modalitySlots = responseSlots.data || [];
    this.modalRef = this.modalService.open(ModalConfirmDeleteComponent, { windowClass: 'modal_cancel_appointment', centered: true })
    this.modalRef.componentInstance.itemId = item.modality_hospital_id;
    this.modalRef.componentInstance.headerMsg = 'Batalkan Jadwal'
    this.modalRef.componentInstance.maintenance = true;
    this.modalRef.componentInstance.msg = `modality: '${item.modality_label}'`;
    this.modalRef.componentInstance.service = this.service;
    this.modalRef.componentInstance.modalitySlot = this.modalitySlots
    this.modalRef.result.then((result) => {
      if (result === 'OK') {
        this.sendDeleteRequest(item);
      }
    }, (_) => {});
  }

  public sendDeleteRequest(item: RadiologyItem) {
    console.log(item)
    this.service.deleteModalityHospitalClose(item.modality_close_id).toPromise().then(res => {
      if (res.status == 'OK') {
        this.showSuccessAlert('Pembatalan Jadwal Berhasil');
      }
      this.close(true);
    }).catch(err => {
      this.showErrorAlert(err.error.message);
      this.alertService.error(err.error.message, false, 3000);
    });
  }

  onChangeDate = () => {
    const date = moment(this.newDate)
    const today = moment().format('YYYY-MM-DD')
    if(date.isBefore(today)){
      this.errorTimer = true
      this.errorMsg = 'Tidak bisa input tanggal sebelum hari ini'
    }else {
      this.errorTimer = false
    }
  }

  onChangeTimer = () => {
    console.log('🚀 ~ his.closeModalityHospital.toTime', this.newFromTime);
    console.log('🚀 ~ his.closeModalityHospital.toTime', this.newToTime);
    // console.log('🚀 ~ this.closeModalityHospital.fromTime', this.closeModalityHospital);
    let toTime = moment(this.newToTime, 'HH:mm')
    let fromTime =  moment(this.newFromTime, 'HH:mm')
    if(toTime.isSameOrBefore(fromTime)){
      this.errorTimer = true
      this.errorMsg = 'Jam selesai harus lebih besar dari pada jam mulai'
    }else if(fromTime.isSameOrAfter(toTime)){
      this.errorTimer = true
      this.errorMsg = 'Jam mulai harus lebih kecil dari pada jam selesai'
    }else {
      this.errorTimer = false
    }
      
    console.log(this.errorTimer)
  }

  reset(){
    this.modalityForm.reset();
    this.modalityForm.controls['modalityHospitalId'].reset()
    this.modalityForm.controls['notes'].reset()
    this.retrievedModality = false;
  }

  public validateForm = () => {
    let status
    if(!this.retrievedModality){
      status = true
    }else if(this.errorTimer){
      status = true
    }else{
      status = false;
    }
    return status
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

  public fillDefaultOperationals(floor_id?: any, operational_type?: any, status: any = 1, modality_id?: any, modality_label?:any) {
    const key = JSON.parse(this.strKey)
    const hospitalId: any = key.hospital.id
    this.service.getOperational(hospitalId, floor_id, operational_type, status, modality_id, modality_label).subscribe((response) => {
      if (response.status === 'OK') {
        this.operationalMaintenance = response.data;
      } else {
        this.showErrorAlert(response.message);
      }
    }, (error => {
      this.showErrorAlert(error.message);
    }));
  }
  
}
