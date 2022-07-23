import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

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
  hours : string[] = [];
  minutes : string[];
  isShow : boolean;
  @Input() useMinute : boolean;
  @Input() noBorder: boolean = false;
  @Input() isModalLarge: boolean = false;
  @Input() readonly: boolean = false;
  @Input() duration: number;
  @Input() onChange : Function;

  @Output() valueChange = new EventEmitter()

  ngOnInit() {
    if(this.useMinute) {
      this.hours = Array.from(Array(24).keys()).map( x => this.slice2Digit(x))
      this.minutes = Array.from(Array(60).keys()).map( x => this.slice2Digit(x))
    }else {
      if(this.duration) {
        if(this.duration >= 60) {
          this.createSlotTimeInHour();
        }else {
          this.createSlotTimeMinute();
        }
      }else {
        this.hours = Array.from(Array(24).keys()).map(x => this.slice2Digit(x) + ':' +('00'))
      }
    }
  }

  private createSlotTimeMinute() {
    const stepMinute = Math.ceil(60 / this.duration);
    this.hours = []
    Array.from(Array(24 + 1).keys()).map((hour: number) => {
      const hours = hour === 24 ? ['24:00'] : Array.from(Array(stepMinute).keys()).map(x => {
        const minute = this.duration * x;
        return this.slice2Digit(hour) + ':' + this.slice2Digit((minute > 59 ? 0 : minute));
      });
      this.hours = this.hours.concat(hours);
    });
  }

  private createSlotTimeInHour() {
    const minuteInDay = 1440;
    const slotInDay = Math.ceil(minuteInDay / this.duration);
    const stepHour = Math.ceil(this.duration / 60);
    this.hours = Array.from(Array(slotInDay + 1).keys()).reduce((acc: string[], val) => {
      if ((val * stepHour) <= 24) {
        const hour = this.slice2Digit(val * stepHour) + ':00';
        acc.push(hour);
      }

      return acc;
    }, []);
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
    this.onChange && this.onChange()
  }

  onSelectMinute(minute : string) {
    const hour = this.value.split(':')[0] || '00'
    this.value = hour + ':' + minute;

    this.valueChange.emit(this.value)
    this.onChange && this.onChange()
  }

  slice2Digit = (num : number) => ('0' + num).slice(-2);

  async ngOnChanges(changes: SimpleChanges) {
    if(changes.duration && changes.duration.currentValue) {
      console.log('this.duration', this.duration)
      this.ngOnInit()
    }
  }
  
}
