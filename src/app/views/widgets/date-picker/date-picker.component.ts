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
  @Input() selected: any = moment().format('YYYY-MM-DD');
  @Input() format = 'MMMM YYYY';
  @Input() hideIcon: boolean;

  @Output() newItemEvent = new EventEmitter<string>();

  locale: object;

  addNewItem(value: string) {
    value = this.selected.startDate ? this.selected.startDate.format('YYYY-MM-DD') : '';
    this.newItemEvent.emit(value);
  }

  ngOnInit() {
    this.locale = {
      format: this.format
    }
  }
}
