import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as lodash from 'lodash'
import * as moment from 'moment'
import { SlotItemMonthly, SlotItemMonthlyProperties } from 'src/app/models/radiology/modality-slot';

@Component({
  selector: 'app-table-list-monthly',
  templateUrl: './table-list-monthly.component.html',
  styleUrls: ['./table-list-monthly.component.css']
})
export class TableListMonthlyComponent implements OnInit {

  @Input() data: any[]
  @Input() dateSelected: Date
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

  constructor() { }

  ngOnInit() {
    // this.generateCalendarItems()
  }

  ngOnChanges (changes: any) {
    // console.log('changes', changes)
    if (changes.dateSelected.currentValue) { this.generateCalendarItems() }
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

  generateCalendarItems () {
    // const currentDate = new Date(2022, 6, 13)
    let currentDate = this.dateSelected
    if (moment.isMoment(currentDate)) { currentDate = moment(currentDate).toDate() }
    const theMonth = currentDate.getMonth()
    const theYear = currentDate.getFullYear()

    const firstDay = this.getFirstDay(theYear, theMonth) - 1
    const howMany = this.getMonthLen(theYear, theMonth)

    const today = new Date()
    today.setHours(0,0,0,0)

    const data = Array(42).fill({}).map((_item: any, i: number) => {
      const model: SlotItemMonthly = {
        date: new Date(),
        dateIndex: 0,
        dateLabel: '',
        isToday: false,
        currentDayInMonth: false,
        items: new SlotItemMonthlyProperties
      }
      const dayIndex = (i - firstDay + 1)
      const dateIndex = new Date(theYear, theMonth, dayIndex)
      
      // mapping data
      model.items.appointments = 1
      model.items.availables = 2
      model.items.maintenences = 3

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
        
        model.items.appointments = 10
        model.items.availables = 10
        model.items.maintenences = 1
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
