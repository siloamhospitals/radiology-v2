import { General } from './../../../models/generals/general';
import { ModalityService } from './../../../services/modality.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalDetailScheduleComponent } from '../../widgets/modal-detail-schedule/modal-detail-schedule.component';
import { ModalHistoryComponent } from '../../widgets/modal-history/modal-history.component';
import { RadiologyService } from 'src/app/services/radiology/radiology.service';
import * as moment from 'moment';
import { ModalitySlot } from 'src/app/models/radiology/modality-slot';

// import * as moment from 'moment';

@Component({
  selector: 'app-page-radiology-schedule',
  templateUrl: './page-radiology-schedule.component.html',
  styleUrls: ['./page-radiology-schedule.component.css']
})

export class PageRadiologyScheduleComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private modalityService: ModalityService,
    private radiologyService : RadiologyService,
    private modalSetting : NgbModalConfig
  )  {
    this.modalSetting.backdrop = true;
    this.modalSetting.keyboard = false;
    // modalSetting.centered = true;

    // router.events.subscribe((val: any) => {
    //   if(val instanceof NavigationEnd) {
    //     console.log(location.pathname);
    //     console.log('router', val)
    //   }
    // })
    this.route.queryParams.subscribe(p => {
      this.initView(p.view, p.value)
    })
  }

  public tableViewCurrentDate: any = moment()
  public tableViewCurrentDateLabel: String = '(not selected date)'
  public tableViewCurrentIsToday: Boolean = false
  public tableViewActive: number = 2
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
  public modalitySlots : ModalitySlot[] = [];

  // note to self (delete "rooms" later if this repo works just fine since it's dummy well at least for now )
  sections: any = [];
  sectionSelected: any = [];
  sectionSelectedCanMultiple: Boolean = false

  ngOnInit() {
    this.getModalitySlots()
    // this.initTodayView();

  }


  async getModalitySlots() {
    const modalityHospitalId = 'd5b8dc5f-8cf6-4852-99a4-c207466d8ff9'
    const reserveDate = this.tableViewCurrentDate.format('YYYY-MM-DD')
    const responseSlots = await this.radiologyService.getModalitySlots(modalityHospitalId, reserveDate).toPromise()
    this.modalitySlots = responseSlots.data || [];
  }

  onChangeDate = async (val?:any) => {
    await this.getModalitySlots()
    await this.getModalityHospitalList(val)
    // note to self (ntar aku ubah getModalitynya sesuai dengan tableViewCurrentDateLabel)
    this.tableViewCurrentDateLabel = this.tableViewCurrentDate.format('DD MMMM YYYY')
    this.tableViewActive = 0
  }



  open (modalId: any) {
    const m = this.modalService.open(modalId, { windowClass: 'fo_modal_confirmation' })
    m.result.then((result: any) => {
      console.log('modal is closed', {result})
    })
  }

  detailSchedule() {
    const m = this.modalService.open(ModalDetailScheduleComponent, {})
    m.result.then((result: any) => {
      console.log('modal is closed', {result})
    })
  }

  showHistoryModal() {
    const m = this.modalService.open(ModalHistoryComponent, {  })
    m.result.then((result: any) => {
      console.log('modal is closed', {result})
    })
  }

  getModalityHospitalList() {
    if(this.tableViewCurrentDate) {
      const dateString = this.tableViewCurrentDate.format('YYYY-MM-DD')
      this.modalityService.getModalityHospital(this.hospital.id, dateString, dateString)
        .subscribe(res => {
          const activeModalityHospital = res.data.map((eachModality: any) => {
              if (eachModality.status === '1') return eachModality;
            }
          );
          this.sections = activeModalityHospital;
        }, () => {
          this.sections = [];
        });
    } else {
      this.sections = [];
    }
  }

  changeTableDate (date: Date) {
    if (!(date && date instanceof Date && date.getTime())) { return }
    this.tableViewCurrentDate = date ? moment(date) : this.tableViewCurrentDate
    // if today date
    this.tableViewCurrentIsToday = moment().isSame(moment(date), 'days')
    console.log('current date 2', date, this.tableViewCurrentDate)
    let formatDate = `DD MMMM YYYY`
    if (this.tableViewActive === 2) { formatDate = 'MMMM YYYY' } // monthly
    this.tableViewCurrentDateLabel = this.tableViewCurrentDate.format(formatDate)
    // weekly sets
    if (this.tableViewActive === 1) {
      const now = this.tableViewCurrentDate
      const minDay = now.clone().weekday(1)
      const maxDay = now.clone().weekday(7)
      this.tableViewCurrentDateLabel = `${minDay.format('DD MMMM YYYY')} - ${maxDay.format('DD MMMM YYYY')}`
    }
  }

  changeTableDateSelected (date: any) {
    this.changeTableView(moment(date, 'YYYY-MM-DD').toDate())
    this.getModalityHospitalList(date)
  }

  initTodayView () {
    this.changeTableDate(new Date())
  }

  changeTableView (val?: any) {
    // console.log('view table is changed', val)
    if (!(val && val instanceof Date && val.getTime())) {
      val = this.tableViewCurrentDate
    }
    this.setRouterViewValue({view: this.tableViewActive, value: val.toISOString()})
    this.changeTableDate(val || new Date())
  }

  toDaily (val?: any) {
    if (val instanceof Date && val.getTime()) {
      this.tableViewActive = 0
      this.changeTableView(val)
    }
    // console.log(val, val instanceof Date && val.getTime())
  }

  toToday () {
    this.changeTableView(new Date())
  }

  toActionDate (backward: Boolean = false) {
    const dtp = this.tableViewActive
    let t: moment.unitOfTime.DurationConstructor = dtp === 1 ? 'weeks' : dtp === 2 ? 'months' : 'days'
    if(backward) {
      this.tableViewCurrentDate = this.tableViewCurrentDate.subtract(1, t)
    }else{
      this.tableViewCurrentDate = this.tableViewCurrentDate.add(1, t)
    }

    this.changeTableView(this.tableViewCurrentDate.toDate())
  }
  setRouterViewValue (item: Object) {

    this.router.navigate(
      ['.'],
      {relativeTo: this.route, queryParams: {...item}}
    )
  }

  async initView (viewId: number, dateVal: Date) {
    dateVal = new Date(dateVal)
    this.tableViewActive = !isNaN(Number(viewId)) ? Number(viewId) : 0
    this.changeTableDate(dateVal)
    await this.getModalitySlots()
  }

  setSelectedSection (v: any) {
    const modality =  this.modalitiesHospitalList.find( (md : any) => md.modality_hospital_id === v.modality_hospital_id) || {}
    modality.active = !modality.active
  }
}
