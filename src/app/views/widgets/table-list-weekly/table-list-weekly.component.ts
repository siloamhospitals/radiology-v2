import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-table-list-weekly',
  templateUrl: './table-list-weekly.component.html',
  styleUrls: ['./table-list-weekly.component.css']
})
export class TableListWeeklyComponent implements OnInit {

  @Input() data: any[]
  @Input() dateSelected: Date

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
    // console.log('chanes', changes)
    this.generateDayLabel()
  }

  scheduleListGenerate () {
    this.scheduleList = this.data
  }

  generateDayLabel () {
    const now = moment(this.dateSelected)
    // console.log('now', now)
    const minDay = now.clone().weekday(0)
    // const maxDay = minDay.clone().weekday(6)
    const weeks = []
    for(let d = Number(minDay.format('d')); d<7; d++) {
      const current = minDay.clone().add(d, 'days')
      weeks.push({
        date: current.toDate(),
        label: current.format('dddd'),
        value: current.format('DD'),
      })
    }
    this.days = weeks
    return this.days
  }

}
