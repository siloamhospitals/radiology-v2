import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-radiology-schedule',
  templateUrl: './page-radiology-schedule.component.html',
  styleUrls: ['./page-radiology-schedule.component.css']
})
export class PageRadiologyScheduleComponent implements OnInit {

  public scheduleList: any[]
  protected indexNumber: number = 0;

  constructor() { }

  ngOnInit() {
    this.scheduleListGenerate()
    this.scheduleListSquash()

    // console.log('list', this.scheduleList)
  }

  scheduleListGenerate () {
    const mainArr = Array(23).fill([]).map((m, i) => {
      // In Custom Functions
      const createTimeSlot = (i: number, isEven: boolean = false) => {
        const hourWith = (v: number) => String(v).padStart(2, '0')
        return {
          timeSlotFrom: isEven ? `${hourWith(i)}:30` : `${hourWith(i)}:00`,
          timeSlotTo: isEven ? `${hourWith(i)}:59` : `${hourWith(i)}:29`,
        }
      }
      // Define Vars
      m.rowIndex = i
      const model = {
        rowIndex: m.rowIndex,
        ...createTimeSlot(i),
        patient: 'Patient A',
        dob: '01-01-1990',
        localMrNo: 'MR00000',
        examination: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fermentum risus, in odio id quis sed aliquet.',
        note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fermentum risus, in odio id quis sed aliquet.',
        status: 'Status',
        isCanCreate: true
      }
      model.examination = model.examination.slice(0, 30)
      model.note = model.note.slice(0, 30)
      let {...modelEven} = model
      modelEven = {...modelEven, ...createTimeSlot(i, true)}
      return [model, modelEven]
    })
    this.scheduleList = mainArr.reduce((acc, item) => {
      acc.push(item[0])
      acc.push(item[1])
      return acc
    }, [])
  }

  scheduleListSquash () {
    // Function in Function
    const hourToDate = (stringHour: string) => {
      const d = new Date()
      const [h, m] = stringHour.split(':')
      d.setHours(Number(h))
      d.setMinutes(Number(m))
      d.setSeconds(0)
      return d
    }

    // Define Vars
    const lblStatus = ['Scheduled', 'Arrived', 'Process', 'Completed', 'note']
    const spanType = [null, 'full']
    const baseData = (this.scheduleList || [])
    let data = [
      {
        fromTime: '01:00',
        toTime: '02:00',
        patient: 'Patient A',
        dob: '01-01-1990',
        localMrNo: '00000',
        examination: 'tes1.',
        note: 'tes1.',
        status: lblStatus[0],
      },
      {
        fromTime: '03:00',
        toTime: '03:30',
        patient: 'Patient A',
        dob: '01-01-1990',
        localMrNo: '00000',
        examination: 'tes1.',
        note: 'tes1.',
        status: lblStatus[1],
      },
      {
        fromTime: '05:00',
        toTime: '07:00',
        patient: 'Patient A',
        dob: '01-01-1990',
        localMrNo: '00000',
        examination: 'tes1.',
        note: 'tes1.',
        status: lblStatus[2],
      },
      // {
      //   fromTime: '07:00',
      //   toTime: '07:40',
      //   patient: 'Patient A',
      //   dob: '01-01-1990',
      //   localMrNo: '00000',
      //   examination: 'tes1.',
      //   note: 'tes1.',
      //   status: lblStatus[3],
      // },
      // {
      //   fromTime: '08:00',
      //   toTime: '10:10',
      //   note: 'Checking for maintenence purpose.',
      //   spanType: spanType[1],
      //   status: lblStatus[4],
      // }
    ]
    data = data.map((x: any) => {
      x.isCanCreate = false
      x.spanType = x.spanType ? x.spanType : spanType[0]
      return x
    })

    // Assign data to list from att from and to
    const squashData  = baseData.map((x: any) => {
      x.row = data.findIndex((y: any) => {
        const rangeCond = 
          (hourToDate(x.timeSlotFrom) <= hourToDate(y.fromTime) && hourToDate(y.fromTime) <= hourToDate(x.timeSlotTo))
          || (hourToDate(x.timeSlotFrom) <= hourToDate(y.toTime) && hourToDate(y.toTime) <= hourToDate(x.timeSlotTo))
        console.log('dateRangeFrom', rangeCond,
        // x.timeSlotFrom, '>=', y.fromTime, '<=', x.timeSlotTo,
        y.fromTime, '>=', x.timeSlotFrom, '&&', y.fromTime, '<=', x.timeSlotTo,
        '||', y.toTime, '>=', x.timeSlotFrom, '&&', y.toTime, '<=', x.timeSlotTo,
        // hourToDate(x.timeSlotFrom), '>=', y.fromTime, '<=', hourToDate(x.timeSlotTo),
        )
        if (rangeCond) {
          // console.log('ONLIST', x.timeSlotFrom, '>=', y.fromTime, '<=', x.timeSlotTo,)
          return true
        }
        return false
      })
      if (x.row >= 0) {
        x = {...x, ...data[x.row]}
      }
      return x
    })

    console.log('nmix', squashData.filter(x => x.row >= 0))
    // console.log({squashData, data})

    this.scheduleList = squashData
  }

  openCreateApp () {
    console.log('modal is open')
  }

}
