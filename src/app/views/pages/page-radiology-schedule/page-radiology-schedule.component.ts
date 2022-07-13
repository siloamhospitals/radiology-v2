import { General } from './../../../models/generals/general';
import { ModalityService } from './../../../services/modality.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDetailScheduleComponent } from '../../widgets/modal-detail-schedule/modal-detail-schedule.component';
import { ModalHistoryComponent } from '../../widgets/modal-history/modal-history.component';
import * as moment from 'moment';

// import * as moment from 'moment';

@Component({
  selector: 'app-page-radiology-schedule',
  templateUrl: './page-radiology-schedule.component.html',
  styleUrls: ['./page-radiology-schedule.component.css']
})

export class PageRadiologyScheduleComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private modalityService: ModalityService,
  ) { }

  public tableViewCurrentDate: any = new Date()
  public tableViewCurrentDateLabel: String = '(not selected date)'
  public tableViewActive: any = 2
  public tableViewSelect: any[] = [
    {key: 0, text: 'Day'},
    {key: 1, text: 'Week'},
    {key: 2, text: 'Month'},
  ]
  public scheduleList: any[]
  protected indexNumber: number = 0

  public createAppointmentTabId: number = 1

  public key: any = JSON.parse(localStorage.getItem('key') || '{}');
  public hospital = this.key.hospital;
  public user = this.key.user;

  public modalitiesHospitalList: any = [];
  public selectedTimeSchedule: any;
  public categories: General[];

  // note to self (delete "rooms" later if this repo works just fine since it's dummy well at least for now )
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
    this.initTodayView();
    this.scheduleListGenerate();
    this.scheduleListSquash();
    //this.scheduleList()
    // console.log('list', this.scheduleList)
  }

  ngOnChanges(changes: any) {
    console.log(changes, '============ changes di parent')
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
    // note to self ( delete console.log later )
    // console.log('default basedata', baseData)
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
          }
        })
      }
    })

    console.log('appdata', squashData.length, squashData)
    console.log('baseData', baseData.length, baseData)

    // this.scheduleList = baseData
  }

  open (modalId: any) {
    const m = this.modalService.open(modalId, { windowClass: 'fo_modal_confirmation', backdrop: 'static', keyboard: false })
    m.result.then((result: any) => {
      console.log('modal is closed', {result})
    })
  }

  detailSchedule() {
    const m = this.modalService.open(ModalDetailScheduleComponent, { windowClass: 'modal_detail_schedule', backdrop: 'static', keyboard: false })
    m.result.then((result: any) => {
      console.log('modal is closed', {result})
    })
  }

  showHistoryModal() {
    const m = this.modalService.open(ModalHistoryComponent, { windowClass: 'modal_history', backdrop: 'static', keyboard: false })
    m.result.then((result: any) => {
      console.log('modal is closed', {result})
    })
  }

  getModalityHospitalList(val?: any) {
    if(val && this.selectedTimeSchedule) {
      this.modalityService.getModalityHospital(this.hospital.id, val, val)
        .subscribe(res => {
          const activeModalityHospital = res.data.map((eachModality: any) => {
              if (eachModality.status === '1') return eachModality;
            }
          );
          this.modalitiesHospitalList = activeModalityHospital;
        }, () => {
          this.modalitiesHospitalList = [];
        });
    } else {
      this.modalitiesHospitalList = [];
    }
  }

  changeTableDate (date: Date) {
    this.tableViewCurrentDate = date ? date : this.tableViewCurrentDate
    console.log('current Date', date, this.tableViewCurrentDate)
    let formatDate = `DD MMMM YYYY`
    if (this.tableViewActive === 1) { formatDate = '[Minggu ke-]WW MMMM YYYY' } // weekly
    if (this.tableViewActive === 2) { formatDate = 'MMMM YYYY' } // monthly
    this.tableViewCurrentDateLabel = moment(this.tableViewCurrentDate).format(formatDate)
  }

  changeTableDateSelected (date: any) {
    this.changeTableDate(moment(date, 'YYYY-MM-DD').toDate())
    this.getModalityHospitalList(date)
  }

  initTodayView () {
    this.changeTableDate(new Date())
  }

  changeTableView (val?: any) {
    console.log('view table is changed', val)
    this.changeTableDate(new Date())
  }

  toDaily (val?: any) {
    if (val) {}
    this.tableViewActive = 0
    this.changeTableView()
  }
}
