import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isEmpty } from 'lodash'
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import {  Modality } from '../../../models/radiology/radiology';
import { ModalModalityComponent } from '../../widgets/modal-modality/modal-modality.component';
import { RadiologyService } from '../../../services/radiology/radiology.service';
import RadiologyListResponse from '../../../models/radiology/responses/radiology-response';
import { RoomMappingService } from '../../../services/room-mapping.service';
import { RoomMapping } from '../../../models/room-mapping';


@Component({
  selector: 'app-page-modality-master',
  templateUrl: './page-modality-master.component.html',
  styleUrls: ['./page-modality-master.component.css']
})
export class PageModalityMasterComponent implements OnInit {

  @Input() responseData: any;
  public modalityOptions: Modality[];
  selectedItemsSchdule: any;
  selectedItemsFloor:any;
  selectedItemsStatus: any;
  selectedItemsModality: any;
  selectedModalityLabel: any;
  public strKey = localStorage.getItem('key') || '{}';
  public localKey = JSON.parse(this.strKey);
  public hospitalId = this.localKey.hospital.id;
  title = 'Select/ Unselect All Checkboxes in Angular - FreakyJolly.com';
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  dropdownListSchduleType: { operational_type: number; item_text: string; }[];
  dropdownListStatus: { status: number; item_text: string; }[];
  scheduleDropdownSetting: { singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string; itemsShowLimit: number; allowSearchFilter: boolean; };
  statusDropdownSetting: { singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string; itemsShowLimit: number; allowSearchFilter: boolean; };
  floorDropdownSettings: { singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string; itemsShowLimit: number; allowSearchFilter: boolean; };
  modalityDropdownSettings: { singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string; itemsShowLimit: number; allowSearchFilter: boolean; };

  public operationals: RadiologyListResponse = {
    status: '',
    message: '',
    data: [],
    last_update: ''
  };

  public roomOptions: RoomMapping[] = [];
  public filteredOptions: Observable<RoomMapping[]>;

  constructor( 
    private modalService: NgbModal,
    private service: RadiologyService,
    private roomMappingService: RoomMappingService
    ) {
      this.fillOperationals();
      this.getRooms();
      this.getModality();
    }

  showModalityModal(val: any = null) {
    const modalRef = this.modalService.open(ModalModalityComponent, 
      { 
        windowClass: 'modal_modality', 
        keyboard: false,
        centered: true,
        size: 'lg'
      })
    modalRef.componentInstance.responseData = val
    modalRef.result.then((result: any) => {
      console.log('modal is closed', {result})
    })
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
   
    this.scheduleDropdownSetting = {
      singleSelection: false,
      idField: 'operational_type',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.statusDropdownSetting = {
      singleSelection: false,
      idField: 'status',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.floorDropdownSettings = {
      singleSelection: false,
      idField: 'floor_id',
      textField: 'floor_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.modalityDropdownSettings = {
      singleSelection: false,
      idField: 'modality_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
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
    const key = JSON.parse(this.strKey)
    const hospitalId: any = key.hospital.id
    this.service.getOperational(hospitalId, floor_id, operational_type, status, modality_id, modality_label).subscribe((response) => {
      if (response.status === 'OK') {
        this.operationals = response;
        if (this.operationals.data) {
          const latest = [...this.operationals.data]
          .sort((e1, e2) => moment(e2.modified_date).valueOf() - moment(e1.modified_date).valueOf());
          if (latest && latest[0]) {
            this.operationals.last_update = moment(latest[0].modified_date).format('YYYY-MM-DD hh:mm:ss');
          }
        }
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

  async onItemSelect(items?: any, searchAll?: boolean, query?: any) {
    let selectedFloor = null;
    let selectedSchedule = null;
    let selectedStatus = null;
    let selectedModality = null;
    let selectedModalityLabelItem = null;

    selectedFloor = !isEmpty(this.selectedItemsFloor) ? 
    this.selectedItemsFloor.map((item: any) => item['floor_id']) : null;

    selectedModalityLabelItem = !isEmpty(this.selectedModalityLabel) ? this.selectedModalityLabel : null;

    const allSelectedFloor = searchAll === true && query == 'floor' ? 
    items.map((item: any) => item['floor_id']) : ''
    
    selectedSchedule = !isEmpty(this.selectedItemsSchdule) ? 
    this.selectedItemsSchdule.map((item: any) => item['operational_type']) : null;

    const allSelectedSchedule = searchAll === true && query == 'operational_type' ? 
    items.map((item: any) => item['operational_type']) : ''
    
    selectedStatus = !isEmpty(this.selectedItemsStatus) ? 
    this.selectedItemsStatus.map((item: any) => item['status']) : null;

    const allSelectedStatus = searchAll === true && query == 'status' ? 
    items.map((item: any) => item['status']) : ''
    
    selectedModality = !isEmpty(this.selectedItemsModality) ? 
    this.selectedItemsModality.map((item: any) => item['modality_id']) : null;

    const allSelectedModality = searchAll === true && query == 'modality' ? 
    items.map((item: any) => item['modality_id']) : ''

    if(!isEmpty(allSelectedFloor)){
      selectedFloor = allSelectedFloor
    }
    if(!isEmpty(allSelectedSchedule)){
      selectedSchedule = allSelectedSchedule
    }
    if(!isEmpty(allSelectedStatus)){
      selectedStatus = allSelectedStatus
    }
    if(!isEmpty(allSelectedModality)){
      selectedModality = allSelectedModality
    }

    if (selectedFloor || selectedSchedule || selectedStatus || selectedModality || selectedModalityLabelItem) {
      this.fillOperationals(selectedFloor, selectedSchedule, selectedStatus, selectedModality, selectedModalityLabelItem);
    } else {
      this.fillOperationals();
    }
  }

  onItemDeSelect(items: any, searchAll?: boolean, query?: any){
    let deSelectedFloor = null;
    let deSelectedSchedule = null;
    let deSelectedStatus = null;
    let deSelectedModality = null;;

    deSelectedFloor = !isEmpty(this.selectedItemsFloor) ? 
    this.selectedItemsFloor.map((item: any) => item['floor_id']) : null;

    deSelectedSchedule = !isEmpty(this.selectedItemsSchdule) ? 
    this.selectedItemsSchdule.map((item: any) => item['operational_type']) : null;

    deSelectedStatus = !isEmpty(this.selectedItemsStatus) ? 
    this.selectedItemsStatus.map((item: any) => item['status']) : null;

    deSelectedModality = !isEmpty(this.selectedItemsModality) ? 
    this.selectedItemsModality.map((item: any) => item['modality_id']) : null;

    let allDeSelectedFloor = isEmpty(items) && searchAll == true && query == 'floor' ? items : deSelectedFloor
    let allDeSelectedSchedule = isEmpty(items) && searchAll == true && query == 'operational_type' ? items : deSelectedSchedule
    let allDeSelectedStatus = isEmpty(items) && searchAll == true && query == 'status' ? items : deSelectedStatus
    let allDeSelectedModality = isEmpty(items) && searchAll == true && query == 'modality' ? items : deSelectedModality
    if(isEmpty(allDeSelectedFloor) && searchAll == true && query == 'floor'){
      deSelectedFloor = items
    }
    if(!isEmpty(allDeSelectedSchedule) && searchAll == true && query == 'operational_type'){
      deSelectedSchedule = allDeSelectedSchedule
    }
    if(!isEmpty(allDeSelectedStatus) && searchAll == true && query == 'status'){
      deSelectedStatus = allDeSelectedStatus
    }
    if(!isEmpty(allDeSelectedModality) && searchAll == true && query == 'modality'){
      deSelectedModality = allDeSelectedModality
    }
    console.log(allDeSelectedFloor, allDeSelectedSchedule, allDeSelectedStatus, allDeSelectedModality, 'oi')
    console.log(deSelectedFloor,
      deSelectedSchedule,
      deSelectedStatus,
      deSelectedModality)

    if (deSelectedFloor|| deSelectedSchedule || deSelectedStatus || deSelectedModality) {
      this.fillOperationals(deSelectedFloor, deSelectedSchedule, deSelectedStatus, deSelectedModality);
    } else {
      this.fillOperationals();
    }
  }

}
