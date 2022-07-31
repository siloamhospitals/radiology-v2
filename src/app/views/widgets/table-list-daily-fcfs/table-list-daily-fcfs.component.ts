import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { ModalityHospital } from '../../../models/radiology/radiology';
import { ScheduleStatus, ScheduleStatusIDN } from '../../../variables/common.variable';
import { RadiologyService } from '../../../services/radiology/radiology.service';
import { ModalitySlot } from '../../../models/radiology/modality-slot';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCreateAppointmentComponent } from '../modal-create-appointment/modal-create-appointment.component';
import { ModalDetailScheduleComponent } from '../modal-detail-schedule/modal-detail-schedule.component';

interface FilterModal {
  name: string
  localMrNo: string
}
@Component({
  selector: 'app-table-list-daily-fcfs',
  templateUrl: './table-list-daily-fcfs.component.html',
  styleUrls: ['./table-list-daily-fcfs.component.css']
})
export class TableListDailyFcfsComponent implements OnInit {

  @Input() dateSelected: moment.Moment
  @Input() sectionSelected: ModalityHospital
  @Input() filter: FilterModal
  @Output() isFilterShow = new EventEmitter<boolean>()
  @Input() isBpjs: boolean;
  @Input() isNonBpjs: boolean;
  
  modalitySlots: ModalitySlot[] = []
  isLoading: boolean
  modalitySlotsBk: ModalitySlot[] = []

  public scheduleStatus: any = ScheduleStatus
  public scheduleStatusIDN: any = ScheduleStatusIDN

  constructor(
    private modalService: NgbModal,
    private radiologyService : RadiologyService
  ) { }

  ngOnInit() {
    this.getModalitySlots()
  }

  async getModalitySlots() {
    if(this.sectionSelected && this.sectionSelected.modality_hospital_id) {
      const modalityHospitalId = this.sectionSelected.modality_hospital_id
      const reserveDate = this.dateSelected.format('YYYY-MM-DD')
      const responseSlots = await this.radiologyService.getModalitySlots(modalityHospitalId, reserveDate).toPromise()
      this.modalitySlots = (responseSlots.data || []).map((slot : any ) => {
        slot.dob = moment(slot.patient_dob, 'YYYY-MM-DD').format('DD MMM YYYY')
        return slot
      });
      this.modalitySlotsBk = this.modalitySlots.slice()
    }
  }

   private async onRefresh() {
    this.isLoading = true
    await this.getModalitySlots()
    this.isLoading = false
  }

  async ngOnChanges(changes: SimpleChanges) {
    
    if((changes.sectionSelected && changes.sectionSelected.currentValue) 
      || changes.dateSelected && changes.dateSelected.currentValue) {
        setTimeout(async () => {          
          await this.onRefresh()
        }, 500);
    }

    if(changes.filter && changes.filter.currentValue) {
      if(this.filter.name || this.filter.localMrNo) {
        setTimeout(() => {
          const { name, localMrNo } = this.filter
          this.modalitySlots = this.modalitySlotsBk.filter(ms => {
            if(this.filter.name && this.filter.localMrNo) {
              return this.toLowerCase(ms.patient_name).includes(this.toLowerCase(name)) 
                    && this.toLowerCase(ms.local_mr_no).includes(this.toLowerCase(localMrNo)) 
            }else {
              return this.toLowerCase(ms.patient_name).includes(this.toLowerCase(name)) 
                    || this.toLowerCase(ms.local_mr_no).includes(this.toLowerCase(localMrNo)) 
            }
          })        
        }, 1000)
      }else{
        this.modalitySlots = this.modalitySlotsBk.slice()
      }
    }

    if((changes.isBpjs && changes.isBpjs.currentValue) !== undefined
      || (changes.isNonBpjs && changes.isNonBpjs.currentValue) !== undefined) {

        if((this.isBpjs === false && this.isNonBpjs === false) 
            || this.isBpjs === true && this.isNonBpjs === true) {
          this.modalitySlots = this.modalitySlotsBk.slice()
        }else {
          const onIsBpjs = (item : any) => this.isBpjs ? item.is_bpjs : !item.is_bpjs; 
          this.modalitySlots = this.modalitySlotsBk.filter(onIsBpjs)
        }
      }
  }

  resetFilter() {
    this.isFilterShow.emit(false)
  }

  private toLowerCase(value : any) {
    return String(value).toLowerCase()
  }

  createAppointment() {
    const m = this.modalService.open(ModalCreateAppointmentComponent, { keyboard: false });
    const { modality_hospital_id: modalityHospitalId, modality_label, room_name, duration, operational_type } = this.sectionSelected;
    const payload = {
      fromTime: '00:00',
      toTime: '00:00',
      modalityHospitalId,
      reserveDate: this.dateSelected,
      modality_label,
      room_name,
      duration,
      operational_type
    }
    m.componentInstance.selectedAppointment = payload;
    m.result.then((_result: any) => {
      this.onRefresh()
    })
  }

  detailSchedule(schedule: any) {
    const payload =  {
      ...schedule,
      reserveDate: this.dateSelected,
    }
    payload.from_time = moment(payload.from_time, 'hh:mm').format('HH:mm')
    payload.to_time = moment(payload.to_time, 'hh:mm').format('HH:mm')
    const m = this.modalService.open(ModalDetailScheduleComponent, { windowClass: 'modal_detail_schedule', backdrop: 'static', keyboard: false })
    m.componentInstance.selectedAppointment = payload;
    m.result.then((result: any) => {
      if (result) {
        this.onRefresh()
      }
    })
  }


}
