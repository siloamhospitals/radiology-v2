import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { ModalModalityComponent } from '../../widgets/modal-modality/modal-modality.component';
import { RadiologyService2 } from '../../../services/radiology/radiology.service';
import RadiologyListResponse from '../../../models/radiology/responses/radiology-response';

@Component({
  selector: 'app-page-modality-master',
  templateUrl: './page-modality-master.component.html',
  styleUrls: ['./page-modality-master.component.css']
})
export class PageModalityMasterComponent implements OnInit {

  @Input() responseData;

  title = 'Select/ Unselect All Checkboxes in Angular - FreakyJolly.com';
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  clickedComponentList: boolean;

  public strKey: any = localStorage.getItem('key') || '{}';

  public operationals: RadiologyListResponse = {
    status: '',
    message: '',
    data: [],
    last_update: ''
  };

  constructor( 
    private modalService: NgbModal,
    private service: RadiologyService2,
    ) { 
   
    this.clickedComponentList = false;
    this.masterSelected = false;
      this.checklist = [
        {id:1,value:'Elenor Anderson',isSelected:false},
        {id:2,value:'Caden Kunze',isSelected:true},
        {id:3,value:'Ms. Hortense Zulauf',isSelected:true},
        {id:4,value:'Grady Reichert',isSelected:false},
        {id:5,value:'Dejon Olson',isSelected:false},
        {id:6,value:'Jamir Pfannerstill',isSelected:false},
        {id:7,value:'Aracely Renner DVM',isSelected:false},
        {id:8,value:'Genoveva Luettgen',isSelected:false}
      ];
      this.getCheckedItemList();
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.isSelected == true;
      })
    this.getCheckedItemList();
  }

  // Get List of Checked Items
  getCheckedItemList(){
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].isSelected)
      this.checkedList.push(this.checklist[i].value);
    }
    this.checkedList = JSON.stringify(this.checkedList.toString());
  }

  showListType(){
    
  }

  showModalityModal(val: any = null) {
    console.log(val, 'ini vall')
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
    this.fillOperationals();
  }

  public fillOperationals() {
    const key = JSON.parse(this.strKey)
    const hospitalId: any = key.hospital.id
    this.service.getOperational(hospitalId).subscribe((response) => {
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

}
