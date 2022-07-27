import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { ModalityHospital } from '../../../models/radiology/radiology';
import { ScheduleStatus } from '../../../variables/common.variable';
import { RadiologyService } from '../../../services/radiology/radiology.service';
import { ModalitySlot } from '../../../models/radiology/modality-slot';

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
  
  modalitySlots: ModalitySlot[] = []
  isLoading: boolean
  modalitySlotsBk: ModalitySlot[] = []

  public scheduleStatus: any = ScheduleStatus

  constructor(
    private radiologyService : RadiologyService
  ) { }

  ngOnInit() {
    this.getModalitySlots()
  }

  async getModalitySlots() {
    if(this.sectionSelected && this.sectionSelected.modality_hospital_id) {
      const modalityHospitalId = 'd5b8dc5f-8cf6-4852-99a4-c207466d8ff9' // this.sectionSelected.modality_hospital_id
      const reserveDate = '2022-07-24' // this.dateSelected.format('YYYY-MM-DD')
      const responseSlots = await this.radiologyService.getModalitySlots(modalityHospitalId, reserveDate).toPromise()
      this.modalitySlots = (responseSlots.data || []).map(slot => {
        slot.patient_dob = moment(slot.patient_dob, 'YYYY-MM-DD').format('DD MMM YYYY')
        return slot
      });
      this.modalitySlotsBk = this.modalitySlots.slice()
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    
    if(changes.sectionSelected && changes.sectionSelected.currentValue) {
      this.isLoading = true
      await this.getModalitySlots()
      this.isLoading = false
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
  }

  resetFilter() {
    this.isFilterShow.emit(false)
  }

  toLowerCase(value : any) {
    return String(value).toLowerCase()
  }

}
