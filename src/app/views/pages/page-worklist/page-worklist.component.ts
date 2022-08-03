import { Component, OnInit } from '@angular/core';
import { ModalityService } from '../../../services/modality.service';
import * as moment from 'moment'
import { RadiologyService } from '../../../services/radiology/radiology.service';
import { ModalitySlot } from 'src/app/models/radiology/modality-slot';

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
   
    const modalitySlots = res.data.rows.sort((a : ModalitySlot ,b : ModalitySlot) => {
      if(a.from_time === b.from_time) {
        return 0
      }
      const isGreater = moment(a.from_time , 'HH:mm').isAfter(moment(b.from_time, 'HH:mm'))
      return isGreater ? 1 : -1;
    }).reduce((acc : any, prevVal : ModalitySlot ) => {

      const hour = prevVal.from_time.slice(0,2)
      const slot = acc[hour]
      if(slot) {
        slot.push(prevVal)
      }else {
        acc[hour] = [prevVal]
      }

      return acc
    }, {} )

    console.log(modalitySlots,  Object.entries(modalitySlots))
    
  }

}
