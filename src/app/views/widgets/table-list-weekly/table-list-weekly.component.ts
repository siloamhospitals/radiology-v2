import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ModalitySlot } from '../../../models/radiology/modality-slot';

import * as moment from 'moment';
import { RadiologyService } from '../../../services/radiology/radiology.service';
import { ModalCreateAppointmentComponent } from '../modal-create-appointment/modal-create-appointment.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDetailScheduleComponent } from '../modal-detail-schedule/modal-detail-schedule.component';
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

  @Input() slotConfigDuration = 30
  slotConfigIntervalBlock = 2

  @Output() itemClick = new EventEmitter<any>()

  @Input() fromTimeRange: string;
  @Input() toTimeRange: string;
  @Input() isBpjs: boolean;
  @Input() isNonBpjs: boolean;

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
  fetchDataDebounce: any = null
  isLoading: boolean = false
  listBk: any[] = []

  mockData = [
    [
      {
        fromTime: '00:00',
        toTime: '01:30',
        patientName: 'Patient 01',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
      {
        fromTime: '05:00',
        toTime: '07:30',
        patientName: 'Patient 02',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
      {
        fromTime: '10:00',
        toTime: '10:30',
        patientName: 'Patient 03',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
    ],
    [
      {
        fromTime: '03:00',
        toTime: '06:00',
        patientName: 'Patient 11',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
      {
        fromTime: '07:00',
        toTime: '08:00',
        patientName: 'Patient 12',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
    ],
    [
      {
        fromTime: '05:00',
        toTime: '06:00',
        patientName: 'Patient 31',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
      {
        fromTime: '10:00',
        toTime: '12:00',
        patientName: 'Patient 32',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
    ],
    [
      {
        fromTime: '08:00',
        toTime: '10:00',
        patientName: 'Patient 41',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
      {
        fromTime: '10:30',
        toTime: '11:00',
        patientName: 'Patient 42',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
    ],
    [],
    [
      {
        fromTime: '03:00',
        toTime: '05:59',
        patientName: 'Patient 61',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
      {
        fromTime: '07:00',
        toTime: '08:00',
        patientName: 'Patient 62',
        patientDob: '2002-01-01',
        patientLocalMrNo: '0123456'
      },
    ],
    []
  ]

  constructor(
    private radiologyService : RadiologyService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    // this.refresh()
  }

  ngOnChanges(changes: SimpleChanges) {
    if((changes.dateSelected && changes.dateSelected.currentValue)
      || (changes.sectionSelected && changes.sectionSelected.currentValue)) {
        this.refresh()
      }

    if((changes.fromTimeRange && changes.fromTimeRange.currentValue)
      || (changes.toTimeRange && changes.toTimeRange.currentValue)) {
        if(this.fromTimeRange === '00:00' && this.toTimeRange === '00:00') {
          this.list = this.listBk.slice()
        }else {
          const momentFromTime = moment(this.fromTimeRange, 'hh:mm')
          const momentToTime = moment(this.toTimeRange, 'hh:mm');
          const onTimeRange = (item : any) => momentFromTime.isSameOrBefore(moment(item.fromTime, 'hh:mm'))
                && momentToTime.isSameOrAfter(moment(item.toTime, 'hh:mm')); 
          
          this.list = this.listBk.filter(onTimeRange)
        }
      }
    
  }

  refresh () {
    if (this.fetchDataDebounce) { clearTimeout(this.fetchDataDebounce) }
    this.fetchDataDebounce = setTimeout(() => { this.generateDayLabel() }, 800)
  }

  generateDayLabel () {
    const now = moment(this.dateSelected)
    let minDay = now.clone().weekday(0)
    // Adjusttment if today is Sunday, back to one week
    if (now.format('E') === '7') {
      minDay = now.clone().subtract(1, 'weeks').weekday(0)
    }
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
    // const setToHour2Digit = (time : number) => ('0' + time).slice(-2);
    // const data = this.mockData
    let data = this.slotData
    data = (data||[]).map((x: any) => {
      return x.map((y: any) => {
        return {
          fromTime: y.from_time,
          toTime: y.to_time,
          modalitySlotId: y.modality_slot_id,
          patientName: y.patient_name,
          patientDob: y.patient_dob,
          patientLocalMrNo: y.local_mr_no,
          slot: y,
          isBpjs: y.is_bpjs
        }
      })
    })

    let temp: any[] = []
    let startIndex = 0
    const perBlock = this.sectionSelected && this.sectionSelected.duration
      ? this.sectionSelected.duration
      : this.slotConfigDuration
    this.slotConfigIntervalBlock = Math.ceil(60 / perBlock)
    let block = Math.ceil(24*60/perBlock)
    if (block < 24) {
      this.slotConfigIntervalBlock = Math.ceil(perBlock / 60)
    }
    let lastTime: any = null
    // let dayTemp: any = null
    // atas-bawah
    const list = Array(block).fill({}).map((_m: any, i: number) => {
      const model = new SlotWeeklyRow()
      model.viewIndex = i%2 === 0 ? startIndex++ : startIndex
      const startTime = lastTime ? lastTime : moment(`${('0' + model.viewIndex).slice(-2)}:${'00'}`, 'HH:mm')
      const endTime = startTime.clone().add(perBlock, 'minutes')
      lastTime = endTime
      model.fromTime = startTime.format('HH:mm')
      model.toTime = endTime.format('HH:mm')
      if (model.toTime == '00:00') { model.toTime = '24:00' }
      // kiri-kanan
      model.days = this.days.map((_n: any, j: number) => {
        let day = new SlotWeeklyItem
        day.fromTime = model.fromTime
        day.toTime = model.toTime
        day.date = _n.date
        day.isPast = moment().isAfter(_n.date, 'days')
        day.dateTitle = `${moment(day.date).format('dddd, DD-MM-YYYY')} / ${day.fromTime} - ${day.toTime}`
        day.rowSpan = 1
        const seekForItem = data[j].find((_k: any) => {
          return (
            moment(day.fromTime, 'HH:mm').isSameOrAfter(moment(_k.fromTime, 'HH:mm')) &&
            moment(day.toTime, 'HH:mm').isSameOrBefore(moment(_k.toTime, 'HH:mm'))
          )
        })
        if (seekForItem) {
          day = {...day, ...seekForItem}
          day.fromTime = moment(day.fromTime, 'HH:mm').format('HH:mm')
          day.toTime = moment(day.toTime, 'HH:mm').format('HH:mm')
          day.slot = seekForItem.slot
        }
        const dayTemp = temp.find(x=> day.modalitySlotId && x.modalitySlotId === day.modalitySlotId)
        if (dayTemp) {
          dayTemp.rowSpan += 1
          day.rowSpan = 0
        }
        temp.push(day)
        return day
      })
      return model
    })
    // console.log('list', list)
    this.list = list
    this.listBk = list.slice()
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
    this.isLoading = true
    for (let item of this.days) {
      const d = await this.getModalitySlots(item.date, this.sectionSelected.modality_hospital_id)
        .catch(() => [])
      list.push(d)
    }
    this.isLoading = false
    this.slotData = list
    this.getSchedules()
  }


  createAppointment(schedule?: any) {
    const m = this.modalService.open(ModalCreateAppointmentComponent, { keyboard: false });
    const { modality_hospital_id: modalityHospitalId, modality_label, room_name, duration } = this.sectionSelected;
    const { fromTime, toTime } = schedule;
    const payload = {
      fromTime,
      toTime,
      modalityHospitalId,
      reserveDate: this.dateSelected,
      modality_label,
      room_name,
      duration
    }
    m.componentInstance.selectedAppointment = payload;
    m.result.then((_result: any) => {
      // console.log('modal is closed', {result})
      this.refresh()
    })
  }

  detailSchedule(schedule?: any) {
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
        this.refresh()
      }
    })
  }

  isClassBpjs = (isBpjs : boolean) => {
    if((isBpjs && this.isBpjs === true) || (!isBpjs  && this.isNonBpjs === true) 
      || (!this.isBpjs && !this.isNonBpjs)){
      return ''
    }else {
      return 'bg-blur';
    }
  }
} 

class SlotWeeklyItem {
  modalitySlotId: any
  fromTime: any
  toTime: any
  date: Date
  isPast: boolean
  dateTitle: string
  patientName: any
  patientDob: any
  patientLocalMrNo: any
  rowSpan: number = 0
  slot: any = null
  isBpjs: boolean
}
class SlotWeeklyRow {
  viewIndex: number
  fromTime: any
  toTime: any
  days: SlotWeeklyItem[]
}
