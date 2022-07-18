import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalitySlot } from 'src/app/models/radiology/modality-slot';

import * as moment from 'moment';
import { RadiologyService } from 'src/app/services/radiology/radiology.service';
// import * as lodash from 'lodash'

@Component({
  selector: 'app-table-list-weekly',
  templateUrl: './table-list-weekly.component.html',
  styleUrls: ['./table-list-weekly.component.css']
})
export class TableListWeeklyComponent implements OnInit {

  @Input() data: any[]
  @Input() dateSelected: Date
  @Input() sectionSelected: any
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

  list: any[] = []
  slotData: any[] = []

  mockData = [
    [
      {
        fromTime: '00:00',
        toTime: '01:30',
        patientName: 'Patient 1',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
      {
        fromTime: '05:00',
        toTime: '07:30',
        patientName: 'Patient 2',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
      {
        fromTime: '10:00',
        toTime: '10:30',
        patientName: 'Patient 3',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
    ],
    [
      {
        fromTime: '03:00',
        toTime: '06:00',
        patientName: 'Patient 1',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
      {
        fromTime: '07:00',
        toTime: '08:00',
        patientName: 'Patient 2',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
    ],
    [
      {
        fromTime: '05:00',
        toTime: '06:00',
        patientName: 'Patient 1',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
      {
        fromTime: '10:00',
        toTime: '12:00',
        patientName: 'Patient 2',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
    ],
    [
      {
        fromTime: '08:00',
        toTime: '10:00',
        patientName: 'Patient 1',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
      {
        fromTime: '10:30',
        toTime: '11:00',
        patientName: 'Patient 2',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
    ],
    [],
    [
      {
        fromTime: '03:00',
        toTime: '05:59',
        patientName: 'Patient 1',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
      {
        fromTime: '07:00',
        toTime: '08:00',
        patientName: 'Patient 2',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
    ],
    []
  ]

  constructor(
    private radiologyService : RadiologyService,
  ) { }

  ngOnInit() {
    this.scheduleListGenerate()
  }

  ngOnChanges(_changes: any) {
    // console.log('weekly changes', changes)
    this.generateDayLabel()
  }

  scheduleListGenerate () {
    // this.scheduleList = this.data
    // this.getSchedules()
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
    this.fetchSlotData()
    return this.days
  }

  async getSchedules() {
    const setToHour2Digit = (time : number) => ('0' + time).slice(-2);
    // const data = this.mockData
    let data = this.slotData
    data = data.map((x: any) => {
      return x.map((y: any) => {
        return {
          fromTime: y.from_time,
          toTime: y.to_time,
          patientName: y.patient_name,
          patientDob: y.patient_dob,
          patientLocalMrNo: y.local_mr_no
        }
      })
    })

    const seeks: any = {}
    const list = Array(24).fill({}).map((_m: any, i: number) => {
      const model = new SlotWeeklyRow()
      model.viewIndex = i
      model.fromTime = setToHour2Digit(i) + ':00'
      model.toTime = setToHour2Digit(i) + ':29'
      model.days = this.days.map((_n: any, j: number) => {
        let day = new SlotWeeklyItem
        day.fromTime = model.fromTime
        day.toTime = model.toTime
        day.date = _n.date
        day.rowSpan = 1
        const seekForItem = data[j].find((_k: any) => {
          return (
            moment(day.fromTime, 'hh:mm').isSameOrAfter(moment(_k.fromTime, 'hh:mm')) &&
            moment(day.toTime, 'hh:mm').isSameOrBefore(moment(_k.toTime, 'hh:mm'))
          )
        })
        if (seekForItem) {
          day = {...day, ...seekForItem}
          const key = `${j}_${seekForItem.patientName}`
          if (!seeks[key]) { seeks[key] = 0 }
          seeks[key] += 1
        }
        return day
      })
      // console.log('rowSnap', {seeks})
      return model
    })
    // console.log('list', list)
    this.list = list
  }

  toDaily (val: any) {
    this.itemClick.emit(val)
  }

  async getModalitySlots(reserveDate: any, sectionId: any) {
    if (reserveDate && sectionId) {
      reserveDate = moment(reserveDate).format('YYYY-MM-DD')
      const responseSlots = await this.radiologyService.getModalitySlots(sectionId, reserveDate).toPromise()
      return responseSlots.data || [];
    }
    return []
  }

  async fetchSlotData () {
    const list: any = []
    for (let item of this.days) {
      const d = await this.getModalitySlots(item.date, this.sectionSelected.modality_hospital_id)
      list.push(d)
    }
    this.slotData = list
    // console.log('fetch list', list)
    this.getSchedules()
  }

}

class SlotWeeklyItem {
  fromTime: any;
  toTime: any;
  date: Date;
  patientName: any
  patientDob: any
  patientLocalMrNo: any
  rowSpan: number = 0
}
class SlotWeeklyRow {
  viewIndex: number;
  fromTime: any;
  toTime: any;
  days: SlotWeeklyItem[];
}
