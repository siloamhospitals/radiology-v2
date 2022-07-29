import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isEmpty } from 'lodash'
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import {  Modality } from '../../../models/radiology/radiology';
import { ModalMaintenanceComponent } from '../../widgets/modal-maintenance/modal-maintenance.component';
import { RadiologyService } from '../../../services/radiology/radiology.service';
//import RadiologyListResponse from '../../../models/radiology/responses/radiology-response';
import { RoomMappingService } from '../../../services/room-mapping.service';
import { RoomMapping } from '../../../models/room-mapping';
import * as moment from 'moment'

@Component({
  selector: 'app-page-modality-maintenance',
  templateUrl: './page-modality-maintenance.component.html',
  styleUrls: ['./page-modality-maintenance.component.css']
})
export class PageModalityMaintenanceComponent implements OnInit {

  @Input() responseData: any;
  public modalityOptions: Modality[];
  selectedItemsSchdule:any  = [];
  selectedItemsFloor:any = [];
  selectedItemsStatus: any = [];
  selectedItemsModality: any = [];
  selectedModalityLabel: any = [];
  public strKey = localStorage.getItem('key') || '{}';
  public localKey = JSON.parse(this.strKey);
  public hospitalId = this.localKey.hospital.id;
  dropdownListSchduleType: { operational_type: number; item_text: string; }[];
  dropdownListStatus: { status: number; item_text: string; }[];
  operationalsClose: any = []
  operationals: any = []
  moment: any = moment;
  formatter:any = moment().format('dddd, DD MMMM YYYY')
  

  public roomOptions: RoomMapping[] = [];
  public filteredOptions: Observable<RoomMapping[]>;
  public isLoading: boolean;

  constructor( 
    private modalService: NgbModal,
    private service: RadiologyService,
    private roomMappingService: RoomMappingService
    ) {
      this.fillOperationals();
      this.getRooms();
      this.getModality();
    }

  ngOnInit() {
    this.dropdownListSchduleType = [
      { operational_type: 1, item_text: 'FCFS' },
      { operational_type: 3, item_text: 'Fixed' },
    ];
    this.dropdownListStatus = [
      { status: 1, item_text: 'Active' },
      { status: 2, item_text: 'Inactive' },
    ];
  }

  refreshData = async () => {
    this.isLoading = true
    await this.fillOperationals()
    this.isLoading = false
  }

  showModalityModal(val: any = null, isUpdate: boolean = false) {
    const modalRef = this.modalService.open(ModalMaintenanceComponent, 
      { 
        windowClass: 'modal_modality', 
        keyboard: false,
        centered: true,
        size: 'lg'
      })
      const reduced = this.operationals.data.reduce((val:any, acc:any)=> {
        if (acc.status == 1) {
           acc
           val.push(acc);
        }
        return val;
      }, []);
      
    modalRef.componentInstance.maintenanceItem = reduced;
    modalRef.componentInstance.responseData = val
    modalRef.componentInstance.isUpdate = isUpdate;
    modalRef.result.then(() => {
      this.refreshData()
    })
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

  selectAll() {
    this.selectedItemsModality = this.modalityOptions.map(x => x.name);
  }

  unselectAll() {
    this.selectedItemsModality = [];
  }

  getRooms() {
    const key = JSON.parse(this.strKey);
    const hospitalId = key.hospital.id
    this.roomMappingService.getFloorActive(hospitalId)
      .subscribe(data => {
        this.roomOptions = data.data;
      }, () => {
        this.roomOptions = [];
      });
  }

  public fillOperationals(floor_id?: any, operational_type?: any, status?: any, modality_id?: any, modality_label?:any) {
    this.isLoading = true;
    const key = JSON.parse(this.strKey)
    const hospitalId: any = key.hospital.id
    this.service.getOperational(hospitalId, floor_id, operational_type, status, modality_id, modality_label).subscribe((response) => {
      let newdata =[]
      if (response.status === 'OK') {
        this.isLoading = false;
        for (let i = 0; i < response.data.length; i++) {
          if(response.data[i].modality_closes){
            for (let ii = 0; ii < response.data[i].modality_closes.length; ii++) {
              response.data[i].modality_closes[ii].modality_name = response.data[i].modality_name
              response.data[i].modality_closes[ii].room = response.data[i].room
              response.data[i].modality_closes[ii].floor_name = response.data[i].floor_name
              response.data[i].modality_closes[ii].modality_label  = response.data[i].modality_label 
              response.data[i].modality_closes[ii].modality_label  = response.data[i].modality_label 
              response.data[i].modality_closes[ii].from_date =  moment(new Date(response.data[i].modality_closes[ii].from_date))
              response.data[i].modality_closes[ii].from_time =  moment(response.data[i].modality_closes[ii].from_time, 'HH:mm').format('HH:mm')
              response.data[i].modality_closes[ii].to_time = moment(response.data[i].modality_closes[ii].to_time, 'HH:mm').format('HH:mm')
              newdata.push(response.data[i].modality_closes[ii])
            }
          }
        }
        const sortedActivities = newdata.slice().sort((a, b) =>  a.from_date - b.from_date)
        this.operationals = response
        this.operationalsClose.data = sortedActivities;

      } else {
        this.showErrorAlert(response.message);
      }
    }, (error => {
      this.showErrorAlert(error.message);
    }));
  }

  public showSuccessAlert(message: any) {
    Swal.fire({
      type: 'success',
      title: 'Delete',
      text: message,
      timer: 1500
    });
  }

  public showErrorAlert(message: any) {
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: message,
      timer: 1500
    });
  }

  async onItemSelect() {
    let selectedModalityLabelItem = null;
    selectedModalityLabelItem = !isEmpty(this.selectedModalityLabel) ? this.selectedModalityLabel : null;
    console.log(this.selectedItemsStatus)
    console.log(this.selectedItemsModality)
    console.log(this.selectedItemsFloor)
    console.log(this.selectedItemsSchdule)
    if (this.selectedItemsFloor || this.selectedItemsSchdule || this.selectedItemsStatus || this.selectedItemsModality || selectedModalityLabelItem) {
      this.operationalsClose.data = []
      this.isLoading = true
      this.fillOperationals(this.selectedItemsFloor, this.selectedItemsSchdule, this.selectedItemsStatus, this.selectedItemsModality, selectedModalityLabelItem);
    } else {
      this.fillOperationals();
    }
  }

}
