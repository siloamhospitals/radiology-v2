import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-list-monthly',
  templateUrl: './table-list-monthly.component.html',
  styleUrls: ['./table-list-monthly.component.css']
})
export class TableListMonthlyComponent implements OnInit {

  @Input() data: any[]

  scheduleList: any[] = []

  constructor() { }

  ngOnInit() {
  }

  scheduleListGenerate () {
    this.scheduleList = this.data
  }

}
