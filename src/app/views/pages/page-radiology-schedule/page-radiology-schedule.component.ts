import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCancelAppointmentComponent } from '../../widgets/modal-cancel-appointment/modal-cancel-appointment.component';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment'

@Component({
  selector: 'app-page-radiology-schedule',
  templateUrl: './page-radiology-schedule.component.html',
  styleUrls: ['./page-radiology-schedule.component.css']
})
export class PageRadiologyScheduleComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
  ) { }

  public scheduleList: any[]
  protected indexNumber: number = 0

  public createAppointmentTabId: number = 1


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
    this.scheduleListGenerate()
    this.scheduleListSquash()

    // console.log('list', this.scheduleList)
  }

  scheduleListGenerate () {
    const mainArr = Array(24).fill([]).map((m, i) => {
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
    const lblStatus = ['scheduled', 'arrived', 'process', 'completed', 'note']
    const spanType = [null, 'full']
    let baseData = (this.scheduleList || [])
    console.log('default basedata', baseData)
    let data = [
      {
        fromTime: '01:00',
        toTime: '01:59',
        patient: 'Patient 1',
        dob: '01-01-1990',
        localMrNo: '00001',
        examination: 'tes1.',
        note: 'tes1.',
        status: lblStatus[0],
      },
      {
        fromTime: '03:00',
        toTime: '03:29',
        patient: 'Patient 2',
        dob: '01-01-1990',
        localMrNo: '00010',
        examination: 'tes1.',
        note: 'tes1.',
        status: lblStatus[1],
      },
      {
        fromTime: '05:00',
        toTime: '06:59',
        patient: 'Patient 3',
        dob: '01-01-1990',
        localMrNo: '00020',
        examination: 'tes1.',
        note: 'tes1.',
        status: lblStatus[2],
      },
      {
        fromTime: '13:00',
        toTime: '14:40',
        patient: 'Patient 4',
        dob: '01-01-1990',
        localMrNo: '00030',
        examination: 'tes1.',
        note: 'tes1.',
        status: lblStatus[3],
      },
      {
        fromTime: '08:00',
        toTime: '10:10',
        note: 'Checking for maintenence purpose.',
        spanType: spanType[1],
        status: lblStatus[4],
      }
    ]
    data = data.map((x: any) => {
      x.isCanCreate = false
      x.spanType = x.spanType ? x.spanType : spanType[0]
      return x
    })

    // Assign data to list from att from and to
    const squashData  = data.map((x: any) => {
      x.rowmerge = []
      x.rows = baseData.filter((y: any, yi: number) => {
        const rangeCond =
          Math.min(hourToDate(x.fromTime).getTime(), hourToDate(x.toTime).getTime()) <= Math.max(hourToDate(y.timeSlotFrom).getTime(), hourToDate(y.timeSlotTo).getTime())
          && Math.max(hourToDate(x.fromTime).getTime(), hourToDate(x.toTime).getTime()) >= Math.min(hourToDate(y.timeSlotFrom).getTime(), hourToDate(y.timeSlotTo).getTime())
        // console.log('dateRangeFrom', rangeCond,
        // // x.timeSlotFrom, '>=', y.fromTime, '<=', x.timeSlotTo,
        // y.fromTime, '>=', x.timeSlotFrom, '&&', y.fromTime, '<=', x.timeSlotTo,
        // '||', y.toTime, '>=', x.timeSlotFrom, '&&', y.toTime, '<=', x.timeSlotTo,
        // // hourToDate(x.timeSlotFrom), '>=', y.fromTime, '<=', hourToDate(x.timeSlotTo),
        // )
        if (rangeCond) {
          x.rowmerge.push(yi)
          // console.log('ONLIST', x.timeSlotFrom, '>=', y.fromTime, '<=', x.timeSlotTo,)
          return true
        }
        return false
      })
      x.rowspan = (x.rows || []).length
      return x
    })

    // map to baseData
    squashData.forEach((item) => {
      if (item.rowmerge.length > 0) {
        item.rowmerge.forEach((y: any, yi: number) => {
          if (yi === 0) {
            baseData[y] = {...baseData[y], ...item}
          } else {
            baseData[y] = {...baseData[y], ...item, ...{isSpan: true}}
            // console.log(baseData[y])
            // baseData.splice(y, 1)
          }
        })
      }
    })

    // console.log('nmix', squashData.filter(x => x.row >= 0))
    console.log('appdata', squashData.length, squashData)
    console.log('baseData', baseData.length, baseData)

    this.scheduleList = baseData
  }

  open (modalId: any) {
    const m = this.modalService.open(modalId, { windowClass: 'fo_modal_confirmation', backdrop: 'static', keyboard: false })
    m.result.then((result: any) => {
      console.log('modal is closed', {result})
    })
  }

  cancelAppointment() {
    this.modalService.open(ModalCancelAppointmentComponent, { size: 'lg' });
  }

}
