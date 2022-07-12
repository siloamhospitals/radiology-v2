import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatepickerComponent implements OnInit {

  constructor() { }


  @Input() width : string = '94px'
  @Input() selected = moment()

  ngOnInit() {
  }

}
