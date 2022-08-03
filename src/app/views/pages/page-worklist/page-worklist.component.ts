import { Component, OnInit } from '@angular/core';
import { ModalityService } from '../../../services/modality.service';
import * as moment from 'moment'
import { RadiologyService } from '../../../services/radiology/radiology.service';
import { ModalitySlot } from '../../../models/radiology/modality-slot';
import { ScheduleStatusIDN } from '../../../variables/common.variable';

interface SelectModel {
  name : string
  value: string | number
}

interface AntrianModel {
  waktu : string;
  modalitySlots : ModalitySlot []
}
@Component({
  selector: 'app-page-worklist',
  templateUrl: './page-worklist.component.html',
  styleUrls: ['./page-worklist.component.css']
})
export class PageWorklistComponent implements OnInit {

  constructor(
    private modalityService: ModalityService,
    private radiologyService: RadiologyService,
  ) { }


  modalitySlots : AntrianModel[] = []
  modalities : SelectModel[] = []
  isErrorTimer : boolean;
  statuses : SelectModel[] = [
    { name: 'Aktif', value: 0 }, 
    { name: 'Dibatalkan', value: 1 },
    { name: 'Telah diubah', value: 2 }
  ]

  key: any = JSON.parse(localStorage.getItem('key') || '{}');
  hospital = this.key.hospital;
  user = this.key.user;

  numberOfCheckin : string = '00'
  numberOfProcessed : string = '00'
  numberOfFinished : string = '00'
  numberOfSkipped : string = '00'

  scheduleStatus = ScheduleStatusIDN
  
  ngOnInit() {
    this.getModalities()
    this.getModalitySlots()
  }

  async getModalities() {
    const dateString = moment().format('YYYY-MM-DD')
    const res = await this.modalityService.getModalityHospital(this.hospital.id, dateString, dateString).toPromise()
    this.modalities = res.data    
  }

  async getModalitySlots() {
    const today = moment().toISOString()
    const res = await this.radiologyService.getDataModalitySlotsList(today, today, this.hospital.id, 1, 9999).toPromise()
   
    let modalitySlots = res.data.rows.reduce((acc : any, prevVal : ModalitySlot ) => {
      const hour = prevVal.from_time.slice(0,2)
      const slot = acc[hour]
      if(slot) {
        slot.push(prevVal)
      }else {
        acc[hour] = [prevVal]
      }

      return acc
    }, {} );

    modalitySlots = Object.entries(modalitySlots).sort((a,b) => this.sortingSlot(a[0], b[0]))
    .map(([ hour, slots ] : any[] ) => ({
      hour,
      slots: slots.sort((a: ModalitySlot, b : ModalitySlot) => this.sortingSlot(a.from_time, b.from_time))
    }))

   this.modalitySlots = modalitySlots
   console.log(modalitySlots)
    
  }

  private sortingSlot = (a : any , b : any) => {
    if(a === b) {
      return 0
    }
    const isLess = moment(a , 'HH:mm').isAfter(moment(b, 'HH:mm'))
    return isLess ? 1 : -1;
  }

}
