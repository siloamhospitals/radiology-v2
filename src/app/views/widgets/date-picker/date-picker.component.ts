import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment'
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatepickerComponent implements OnInit {

  constructor() { }

  @Input() width: string = '94px';
  @Input() value: any = moment();
  @Input() format = 'MMMM YYYY';
  @Input() hideIcon: boolean;
  @Input() hideIconTwo: boolean;
  @Input() noBorder: boolean = false;
  @Input() onChange : Function;

  @Output() valueChange = new EventEmitter();

  locale: object;

  changeSelected(value: any) {
    this.valueChange.emit(value.startDate);
    this.onChange && this.onChange()
  }

  ngOnInit() {
    this.locale = {
      format: this.format
    }
  }

}
