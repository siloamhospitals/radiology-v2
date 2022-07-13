import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-list-weekly',
  templateUrl: './table-list-weekly.component.html',
  styleUrls: ['./table-list-weekly.component.css']
})
export class TableListWeeklyComponent implements OnInit {

  @Input() data: any[]
  @Input() dateSelected: Date

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

  constructor() { }

  ngOnInit() {
    this.scheduleListGenerate()
  }

  scheduleListGenerate () {
    this.scheduleList = this.data
  }

}
