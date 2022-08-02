import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-page-doctor-schedule',
  templateUrl: './page-doctor-schedule.component.html',
  styleUrls: ['./page-doctor-schedule.component.css']
})
export class PageDoctorScheduleComponent implements OnInit {

  constructor() { }
  tabActive = 0;  
  today = moment()
  todayString = moment().format('dddd, DD-MM-YYYY')
  
  ngOnInit() {
    this.createDays()
  }

  toPageDoctor = () => this.tabActive = 0;
  toPageSpecialist = () => this.tabActive = 1;

  public continents = [{
    id: 1,
    name: 'Asia',
    population: '4,157,300,000'
  }, {
    id: 2,
    name: 'Africa',
    population: '1,030,400,000'
  }, {
    id: 3,
    name: 'Europe',
    population: '738,600, 000'
  }, {
    id: 4,
    name: 'North America',
    population: '461,114,000'
  }, {
    id: 5,
    name: 'South America',
    population: '390,700,000'
  }, {
    id: 6,
    name: 'Australia',
    population: '36,700,000'
  }, {
    id: 7,
    name: 'Antartica',
    population: 0
  }
  ];

public textEndered: string = '';

public days : string[] = []

private createDays = () => {  
  const today = this.today
  const format = 'dddd, DD-MM-YYYY'
  this.days = [
    today.format(format),
    today.add(1, 'day').format(format),
    today.add(1, 'day').format(format),
    today.add(1, 'day').format(format),
    today.add(1, 'day').format(format),
    today.add(1, 'day').format(format),
    today.add(1, 'day').format(format)
  ]
}

}
