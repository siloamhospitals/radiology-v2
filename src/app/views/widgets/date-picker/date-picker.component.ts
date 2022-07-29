import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as moment from 'moment'
import { Output, EventEmitter } from '@angular/core';

interface ValueDatePicker{
  startDate: moment.Moment
  endDate: moment.Moment
}
@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatepickerComponent implements OnInit {

  constructor() { }

  @Input() width: string = '94px';
  @Input() value: moment.Moment = moment();
  @Input() format = 'MMMM YYYY';
  @Input() hideIcon: boolean;
  @Input() isModalLarge: boolean = false;
  @Input() noBorder: boolean = false;
  @Input() onChange : Function;
  @Input() readonly: boolean = false;
  @Input() class: string = '';
  selected: ValueDatePicker = {
    startDate: moment(), endDate: moment()
  }

  @Output() valueChange = new EventEmitter();

  locale: object;

  changeSelected(value: any) {
    if(value.startDate) {
      this.valueChange.emit(value.startDate);
      this.onChange && this.onChange()
    }
  }

  ngOnInit() {
    this.locale = {
      format: this.format,
      firstDay: 1      
    }
  }

  ngOnChanges(changes : SimpleChanges){
    if(changes.format && changes.format.currentValue){
      this.locale = {
        format: this.format,
        firstDay: 1      
      }
    }

    if(changes.value && changes.value.currentValue) {
      this.selected = {
        startDate: this.value.startOf('day'),
        endDate: this.value.endOf('day')
      }

    }
  }

}
