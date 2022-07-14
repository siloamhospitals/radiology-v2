import { General } from './../../../models/generals/general';
import { ModalityService } from './../../../services/modality.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDetailScheduleComponent } from '../../widgets/modal-detail-schedule/modal-detail-schedule.component';
import { ModalHistoryComponent } from '../../widgets/modal-history/modal-history.component';
import { RadiologyService } from 'src/app/services/radiology/radiology.service';
import * as moment from 'moment';

@Component({
  selector: 'app-page-radiology-schedule',
  templateUrl: './page-radiology-schedule.component.html',
  styleUrls: ['./page-radiology-schedule.component.css']
})

export class PageRadiologyScheduleComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private modalityService: ModalityService,
    private radiologyService : RadiologyService
  ) { }

  public scheduleList: any[] = []

  protected indexNumber: number = 0

  public createAppointmentTabId: number = 1
  public selected: any = '';

  public key: any = JSON.parse(localStorage.getItem('key') || '{}');
  public hospital = this.key.hospital;
  public user = this.key.user;

  public modalitiesHospitalList: any = [];
  public selectedTimeSchedule: any;
  public categories: General[];

  // note to self (delete "rooms" later if this repo works just fine since it's dummy well at least for now )
  rooms: string[] = [
    "CT Scan - Room 1",
    "CT Scan - Room 2",
    "MAMMOGRAPHY - Room 1",
    "MRA 3T CONTRAST - Room 3",
    "RADIOLOGY CONVENTIONAL - Room 3",
    "USG - 3D & 4D - Room 5",
    "CT CARDIAC - Room 1",
  ]

  ngOnInit() {
    this.getCategories();
    this.getSchedules()
    //this.scheduleList()
    // console.log('list', this.scheduleList)
  }

  ngOnChanges(changes: any) {
    console.log(changes, '============ changes di parent')
  }

  async getSchedules() {
    const modalityHospitalId = 'd5b8dc5f-8cf6-4852-99a4-c207466d8ff9'
    const reserveDate = '2022-07-14'
    const responseSlots = await this.radiologyService.getModalitySlots(modalityHospitalId, reserveDate).toPromise()
    const slots =responseSlots.data || [];
    const setToHour2Digit = (time : number) => ('0' + time).slice(-2);
    let lastCaptureSlot : any = {};
    let rowSpan = 0;
    this.scheduleList = Array.from(Array(24).keys()).map(time => {
      const hour2digit = setToHour2Digit(time)
      const firstFromTime = hour2digit  + ':00'
      const firstToTime = hour2digit + ':30'
      const lastFromTime = hour2digit  + ':30'
      const lastToTime = setToHour2Digit(time+1) + ':00'

      const patientFirst : any = slots.find(s => 
          moment(firstFromTime, 'hh:mm').isSameOrAfter(moment(s.from_time, 'hh:mm')) &&
          moment(firstToTime, 'hh:mm').isSameOrBefore(moment(s.to_time, 'hh:mm'))
        ) || {};
      
      if(patientFirst.patient_name && patientFirst.patient_name === lastCaptureSlot.patient){
        lastCaptureSlot.rowSpan = Number(lastCaptureSlot.rowSpan) + 1;
      }else{
        rowSpan = 1
      }
           
      const firstSlot = {
          fromTime: firstFromTime,
          toTime:  firstToTime,
          patient: patientFirst.patient_name,
          dob: patientFirst.patient_dob,
          localMrNo: patientFirst.local_mr_no,
          examination: patientFirst.modality_examination_name,
          note: patientFirst.notes,
          status: patientFirst.status,
          rowSpan: lastCaptureSlot.patient && patientFirst.patient_name === lastCaptureSlot.patient ? null : rowSpan
      }  
      
      lastCaptureSlot = firstSlot

      const patientLast : any = slots.find(s => 
          moment(lastFromTime, 'hh:mm').isSameOrAfter(moment(s.from_time, 'hh:mm')) &&
          moment(lastToTime, 'hh:mm').isSameOrBefore(moment(s.to_time, 'hh:mm'))
        ) || {};
        
      if(patientLast.patient_name && patientLast.patient_name === lastCaptureSlot.patient){
        lastCaptureSlot.rowSpan = Number(lastCaptureSlot.rowSpan) + 1;       
      } else {
        rowSpan = 1;
      }

      
      const lastSlot = {
        fromTime: lastFromTime,
        toTime: lastToTime,
        patient: patientLast.patient_name,
        dob: patientLast.patient_dob,
        localMrNo: patientLast.local_mr_no,
        examination: patientLast.modality_examination_name,
        note: patientLast.notes,
        status: patientLast.status,
        rowSpan: lastCaptureSlot.patient && patientLast.patient_name === lastCaptureSlot.patient ? null : rowSpan
     }

     lastCaptureSlot = patientLast

      return [ firstSlot, lastSlot ]
    })

  }


  open (modalId: any) {
    const m = this.modalService.open(modalId, { windowClass: 'fo_modal_confirmation', backdrop: 'static', keyboard: false })
    m.result.then((result: any) => {
      console.log('modal is closed', {result})
    })
  }

  detailSchedule() {
    const m = this.modalService.open(ModalDetailScheduleComponent, { windowClass: 'modal_detail_schedule', backdrop: 'static', keyboard: false })
    m.result.then((result: any) => {
      console.log('modal is closed', {result})
    })
  }

  showHistoryModal() {
    const m = this.modalService.open(ModalHistoryComponent, { windowClass: 'modal_history', backdrop: 'static', keyboard: false })
    m.result.then((result: any) => {
      console.log('modal is closed', {result})
    })
  }

  getModalityHospitalList() {
    if(this.selected && this.selectedTimeSchedule) {
      this.modalityService.getModalityHospital(this.hospital.id, this.selected, this.selected)
        .subscribe(res => {
          const activeModalityHospital = res.data.map((eachModality: any) => {
              if (eachModality.status === '1') return eachModality;
            }
          );
          this.modalitiesHospitalList = activeModalityHospital;
        }, () => {
          this.modalitiesHospitalList = [];
        });
    } else {
      this.modalitiesHospitalList = [];
    }
  }

  addItem(event: any) {
    this.selected = event;
    this.getModalityHospitalList();
  }

  getCategories() {
    this.categories = [{
      value: '1',
      description: 'Day'
    }, {
      value: '2',
      description: 'Week'
    }, {
      value: '3',
      description: 'Month'
    }]
  }
}
