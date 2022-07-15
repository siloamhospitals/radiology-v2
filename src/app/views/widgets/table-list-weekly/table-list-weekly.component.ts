import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalitySlot } from 'src/app/models/radiology/modality-slot';

import * as moment from 'moment';
import * as lodash from 'lodash'

@Component({
  selector: 'app-table-list-weekly',
  templateUrl: './table-list-weekly.component.html',
  styleUrls: ['./table-list-weekly.component.css']
})
export class TableListWeeklyComponent implements OnInit {

  @Input() data: any[]
  @Input() dateSelected: Date
  @Input() modalitySlots: ModalitySlot[];

  @Output() itemClick = new EventEmitter<any>()

  days: any[] = [
    {date: null, label: 'Senin', value: '01'},
    {date: null, label: 'Selasa', value: '02'},
    {date: null, label: 'Rabu', value: '03'},
    {date: null, label: 'Kamis', value: '04'},
    {date: null, label: 'Jumat', value: '05'},
    {date: null, label: 'Sabtu', value: '06'},
    {date: null, label: 'Minggu', value: '06'},
  ]

  scheduleList: any[] = []

  constructor() { }

  ngOnInit() {
    this.scheduleListGenerate()
  }

  ngOnChanges(changes: any) {
    // console.log('weekly changes', changes)
    this.generateDayLabel()
  }

  scheduleListGenerate () {
    // this.scheduleList = this.data
    this.getSchedules()
  }

  generateDayLabel () {
    const now = moment(this.dateSelected)
    const minDay = now.clone().weekday(0)
    const weeks = []
    for(let d = Number(minDay.format('d')); d<8; d++) {
      const current = minDay.clone().add(d, 'days')
      weeks.push({
        date: current.toDate(),
        label: current.format('dddd'),
        value: current.format('DD'),
        isToday: moment().isSame(current, 'days'),
      })
    }
    weeks.shift()
    this.days = weeks
    return this.days
  }

  async getSchedules() {
    const slots = this.modalitySlots
    console.log('slots', slots)
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

    console.log('this.scheduleList', this.scheduleList)

    this.scheduleList = lodash.flatten(this.scheduleList)
  }

  toDaily (val: any) {
    this.itemClick.emit(val)
  }

}
