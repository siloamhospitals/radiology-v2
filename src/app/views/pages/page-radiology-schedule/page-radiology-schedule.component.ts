import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-radiology-schedule',
  templateUrl: './page-radiology-schedule.component.html',
  styleUrls: ['./page-radiology-schedule.component.css']
})
export class PageRadiologyScheduleComponent implements OnInit {

  constructor() { }
  rooms: string[] = [
    "CT Scan - Room 1",
    "CT Scan - Room 2",
    "MAMMOGRAPHY - Room 1",
    "MRA 3T CONTRAST - Room 3",
    "RADIOLOGY CONVENTIONAL - Room 3",
    "USG - 3D & 4D - Room 5",
    "CT CARDIAC - Room 1",
  ]

  ngOnInit() {
  }

}
