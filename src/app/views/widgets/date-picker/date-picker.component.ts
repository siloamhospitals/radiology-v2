import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})

export class DatepickerComponent implements OnInit {
  public moment: any = moment;
  public today: any = moment().locale('id').format('dddd, DD-MM-YYYY')
  
  dateFormat: 'dd, DD-MM-YYYY'
  constructor() {
    moment.locale('id');
   }

  @Input() width : string = '94px'
  @Input() selected = moment()
  @Input() format = 'dddd, DD MMMM YYYY';
  @Input() hideIcon : boolean;
  locale: object;


  ngOnInit() {
    this.locale = {
      format: this.format
    }
  }

}
