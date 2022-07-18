import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as lodash from 'lodash'
import * as moment from 'moment'
import { SlotItemMonthly, SlotItemMonthlyProperties } from '../../../models/radiology/modality-slot';
import { RadiologyService } from '../../../services/radiology/radiology.service';

@Component({
  selector: 'app-table-list-monthly',
  templateUrl: './table-list-monthly.component.html',
  styleUrls: ['./table-list-monthly.component.css']
})
export class TableListMonthlyComponent implements OnInit {

  @Input() data: any[]
  @Input() dateSelected: Date
  @Input() sectionSelected: any = null

  @Output() itemClick = new EventEmitter<string>()
  
  itemModel = {
    date: {},
    dateIndex: 0,
    dateLabel: '01',
    isToday: false,
    currentDayInMonth: false,
    items: {
      availables: 99,
      appointments: 9,
      maintenences: 1,
    }
  }

  days: any[] = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
    'Minggu',
  ]

  scheduleList: any[] = []

  items: any[] = Array(42)

  fetchDataDebounce: any = null

  constructor(
    private radiologyService: RadiologyService,
  ) { }

  ngOnInit() {
    // this.generateCalendarItems()
    // this.refresh()
  }

  ngOnChanges (changes: any) {
    if (changes.dateSelected && changes.dateSelected.currentValue) {
      this.refresh()
    }
  }

  refresh () {
    if (this.fetchDataDebounce) { clearTimeout(this.fetchDataDebounce) }
    this.fetchDataDebounce = setTimeout(() => { this.generateCalendarItems() }, 800)
  }

  scheduleListGenerate () {
    this.scheduleList = this.data
  }

  toDaily (val: any) {
    this.itemClick.emit(val)
  }

  getFirstDay(theYear: any, theMonth: any){
    let firstDate = new Date(theYear,theMonth,1)
    return firstDate.getDay()
  }

  getMonthLen(theYear: any, theMonth: any) {
    let oneDay = 1000 * 60 * 60 * 24
    let thisMonth = new Date(theYear, theMonth, 1)
    let nextMonth = new Date(theYear, theMonth + 1, 1)
    let len = Math.ceil((nextMonth.getTime() - 
        thisMonth.getTime())/oneDay)
    return len
  }

  getY2KYear(today: any) {
    let yr = today.getYear()
    return ((yr < 1900) ? yr+1900 : yr)
  }

  async fetchData (sectionSelected: any, dateSelected: any) {
    if (sectionSelected && sectionSelected.modality_hospital_id) {
      const reserveDate = moment(dateSelected).format('YYYY-MM')
      const responseSlots = await this.radiologyService.getModalitySlotsMonthly(sectionSelected.modality_hospital_id, reserveDate).toPromise()
      return responseSlots.data || []
    }
    return []
  }

  async generateCalendarItems () {
    // const currentDate = new Date(2022, 6, 13)
    let currentDate = this.dateSelected
    if (moment.isMoment(currentDate)) { currentDate = moment(currentDate).toDate() }
    const theMonth = currentDate.getMonth()
    const theYear = currentDate.getFullYear()

    // fetch data
    const xdata = await this.fetchData(this.sectionSelected, currentDate)
      .catch(() => [])

    const firstDay = this.getFirstDay(theYear, theMonth) - 1
    const howMany = this.getMonthLen(theYear, theMonth)

    const today = new Date()
    today.setHours(0,0,0,0)

    const data = Array(42).fill({}).map((_item: any, i: number) => {
      let model: SlotItemMonthly = {
        date: new Date(),
        dateIndex: 0,
        dateLabel: '',
        isToday: false,
        currentDayInMonth: false,
        items: new SlotItemMonthlyProperties
      }
      if (xdata[i] && 'date' in xdata[i]) {
        model = {...model, ...xdata[i]}
      }
      const dayIndex = (i - firstDay + 1)
      const dateIndex = new Date(theYear, theMonth, dayIndex)
      
      // mapping data
      // model.items.appointments = 1
      // model.items.availables = 2
      // model.items.maintenences = 3

      if (i < firstDay) {
        // if past in month
        const mm = moment(dateIndex).format('MMMM DD')
        model.dateLabel = String(mm)
      } else if (i >= (howMany + firstDay)) {
        // if next in month
        const mm = moment(dateIndex).format('MMMM DD') 
        model.dateLabel = String(mm)
      } else {
        model.dateLabel = String((moment(dateIndex).format('DD')))
        model.currentDayInMonth = true
      }
      // if today
      if (moment(today).diff(moment(dateIndex), 'days') === 0) {
        model.isToday = true
      }
      model.dateIndex = dayIndex
      model.date = dateIndex
      return model
    })
    this.items = lodash.chunk(data, 7)
    // console.log('table monthly', this.items)
  }

}
