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

  @Output() changeValue = new EventEmitter<string>();

  locale: object;

  changeSelected(value: string) {
    value = this.selected.startDate ? this.selected.startDate.format('YYYY-MM-DD') : '';
    this.changeValue.emit(value);
  }

  ngOnInit() {
    this.locale = {
      format: this.format
    }
  }

  ngOnChanges (changes: any) {
    if (changes.selected) {
      this.selected = moment(changes.selected.currentValue).format('YYYY-MM-DD');
      // console.log('selected change', changes.selected.currentValue)
    }
  }
}
