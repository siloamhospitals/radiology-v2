import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as lodash from 'lodash'

@Component({
  selector: 'app-table-list-monthly',
  templateUrl: './table-list-monthly.component.html',
  styleUrls: ['./table-list-monthly.component.css']
})
export class TableListMonthlyComponent implements OnInit {

  @Input() data: any[]
  @Output() itemClick = new EventEmitter<string>()

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
    this.generateCalendarItems()
  }

  scheduleListGenerate () {
    this.scheduleList = this.data
  }

  toDaily (val: any) {
    this.itemClick.emit(val)
  }

  generateCalendarItems () {
    this.items = lodash.chunk(this.items, 7)
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

}
