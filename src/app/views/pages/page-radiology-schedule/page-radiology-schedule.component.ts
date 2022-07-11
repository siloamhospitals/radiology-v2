import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-radiology-schedule',
  templateUrl: './page-radiology-schedule.component.html',
  styleUrls: ['./page-radiology-schedule.component.css']
})
export class PageRadiologyScheduleComponent implements OnInit {

  public scheduleList: any[];

  constructor() { }

  ngOnInit() {
    this.generateScheduleList()

    console.log('list', this.scheduleList)
  }

  generateScheduleList () {
    const mainArr = Array(23).fill([]).map((m, i) => {
      m.index = i
      const model = {
        index: m.index,
        timeSlot: '00:00-00:30',
        patient: 'Patient A',
        dob: '01-01-1990',
        localMrNo: 'MR00000',
        examination: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fermentum risus, in odio id quis sed aliquet.',
        note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fermentum risus, in odio id quis sed aliquet.',
        status: 'status',
        isCanCreate: i > 20
      }
      model.examination = model.examination.slice(0, 30)
      model.note = model.note.slice(0, 30)
      return {
        ...m,
        ...Array(2).fill({}).map(() => {
          return model
        })
      }
    })
    this.scheduleList = mainArr.reduce((acc, item) => {
      acc.push(item[0])
      acc.push(item[1])
      return acc
    }, [])
  }

  openCreateApp () {
    console.log('modal is open')
  }

}
