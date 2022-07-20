import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimepickerComponent implements OnInit {

  constructor() { }


  @Input() width : string = '74px'
  @Input() placeholder: string = '00:00'
  @Input() value : string = ''
  hours : string[];
  minutes : string[];
  isShow : boolean;
  @Input() useMinute : boolean;
  @Input() noBorder: boolean = false;
  @Input() isModalLarge: boolean = false;

  @Output() valueChange = new EventEmitter()

  ngOnInit() {
    if(this.useMinute) {
      this.hours = Array.from(Array(24).keys()).map( x => ('0' + x).slice(-2))
      this.minutes = Array.from(Array(60).keys()).map( x => ('0' + x).slice(-2))
    }else {
      this.hours = Array.from(Array(24).keys()).map(x => ('0' + x).slice(-2) + ':' +('00'))
    }
  }

  onShowSelect() {
    this.isShow = true
  }

  onHideSelect(ev : Event) {
    this.isShow = false
    ev.stopImmediatePropagation()
    ev.stopPropagation()
    ev.preventDefault()
  }

  onClickDropdown(ev: Event) {
    if (!this.isShow) {
      this.onShowSelect()
    } else {
      this.onHideSelect(ev)
    }
  }

  onSelectHour(hour : string) {
    if(this.useMinute) {
      const minute = this.value.split(':')[1] || '00'
      this.value = hour + ':' + minute
    }else{
      this.value = hour
    }

    this.valueChange.emit(this.value)
  }

  onSelectMinute(minute : string) {
    const hour = this.value.split(':')[0] || '00'
    this.value = hour + ':' + minute;

    this.valueChange.emit(this.value)
  }

}
