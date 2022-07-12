import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimepickerComponent implements OnInit {

  constructor() { }


  @Input() width : string = '74px'
  @Input() placeholder: string = '00:00'
  hours : number[] = Array.from(Array(24).keys())
  minutes : number[] = Array.from(Array(60).keys())
  isShow : boolean;

  ngOnInit() {
  }

  onShowSelect() {
    this.isShow = true
  }

  onHideSelect() {
    this.isShow = false
  }

}
