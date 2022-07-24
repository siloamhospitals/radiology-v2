import { General } from './../../../models/generals/general';
import { ModalityService } from './../../../services/modality.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalDetailScheduleComponent } from '../../widgets/modal-detail-schedule/modal-detail-schedule.component';
import { ModalHistoryComponent } from '../../widgets/modal-history/modal-history.component';
import * as moment from 'moment';
import { ModalitySlot } from '../../../models/radiology/modality-slot';
import { ModalityHospital } from '../../../models/radiology/modality-hospital';

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
    // this.route.queryParams.subscribe(p => {
    //   this.initView(p.view, p.value, p.section)
    // })
  }

  public tableViewCurrentDate: moment.Moment = moment();
  public tableViewCurrentDateLabel: String = '(not selected date)';
  public tableViewCurrentIsToday: Boolean = false;
  public tableViewActive: number = 2;
  public tableViewSelect: any[] = [
    {key: 0, text: 'Day'},
    {key: 1, text: 'Week'},
    {key: 2, text: 'Month'},
  ];
  public scheduleList: any[];
  protected indexNumber: number = 0;

  public createAppointmentTabId: number = 1;

  public key: any = JSON.parse(localStorage.getItem('key') || '{}');
  public hospital = this.key.hospital;
  public user = this.key.user;

  public modalitiesHospitalList: any = [];
  public selectedTimeSchedule: any;
  public categories: General[];
  public modalitySlots : ModalitySlot[] = [];

  sections: any = [];
  sectionSelected: ModalityHospital = new ModalityHospital();
  sectionSelectedCanMultiple: Boolean = false

  showFilterTable: boolean = false
  filterName: any = null
  filterLocalMrNo: any = null
  filter: any = {name: null, localMrNo: null, showFilter: false}

  fromTimeRange: string = "00:00";
  toTimeRange: string = "00:00";

  isLoadingSection: boolean = false
  // changeTableViewDebounce: any = null

  ngOnInit() {
    // this.getModalitySlots()
    this.getModalityHospitalList()
      .then(() => {
        this.route.queryParams.subscribe(p => {
          this.initView(p.view, p.value, p.section)
        })
      })
    this.initTodayView()
  }


 

  onChangeDate = async () => {
    await this.getModalityHospitalList()
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
    return new Promise((resolve: any) => {
      if(this.tableViewCurrentDate) {
        const dateString = this.tableViewCurrentDate.format('YYYY-MM-DD')
        this.isLoadingSection = true
        this.modalityService.getModalityHospital(this.hospital.id, dateString, dateString)
          .subscribe(res => {
            const activeModalityHospital = res.data.map((eachModality: any) => {
                if (eachModality.status === '1') return eachModality;
              }
            );
            this.sections = activeModalityHospital;
          }, () => {
            this.sections = [];
          }, () => {
            this.isLoadingSection = false
            resolve(this.sections)
          });
      } else {
        this.sections = [];
      }
    })
  }

  changeTableDate (date: Date) {
    if (!(date && date instanceof Date && date.getTime())) { return }
    this.tableViewCurrentDate = date ? moment(date) : this.tableViewCurrentDate
    // if today date
    this.tableViewCurrentIsToday = moment().isSame(moment(date), 'days')
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
    this.getModalityHospitalList()
  }

  initTodayView () {
    this.changeTableDate(new Date())
  }

  changeTableView (val?: any) {
    // console.log('view table is changed', val)\
    // if (this.changeTableViewDebounce) { clearTimeout(this.changeTableViewDebounce) }
    // this.changeTableViewDebounce = setTimeout(() => {
    if (!(val && val instanceof Date && val.getTime())) {
      val = this.tableViewCurrentDate
    }
    this.setRouterViewValue({
      view: this.tableViewActive,
      value: val ? val.toISOString().split('T')[0] : undefined,
      section: this.sectionSelected ? this.sectionSelected.modality_hospital_id : undefined
    })
    this.changeTableDate(val || new Date())
    // }, 800)
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

  async initView (viewId: number, dateVal: Date, sectionId: any = null) {
    dateVal = new Date(dateVal)
    this.tableViewActive = !isNaN(Number(viewId)) ? Number(viewId) : 0
    this.changeTableDate(dateVal)
    if (sectionId && this.sections && this.sections.length > 0) {
      const seekSection = this.sections.find((x: any) => x.modality_hospital_id === sectionId)
      this.sectionSelected = seekSection ? seekSection : new ModalityHospital
    }
  }

  async setSelectedSection (modalityHospital: ModalityHospital) {
    this.sectionSelected = modalityHospital
    this.changeTableView(this.tableViewCurrentDate.toDate())
  }


  setFilter (obj: any) {
    this.filter = {...obj}
    this.showFilterTable = true
  }

  setFilterName (v: any) {
    this.filterLocalMrNo = null
    const value = v.target.value
    if (((v.type === 'keyup' && v.which === 13) || v.type === 'blur') && value && value.length > 2) {
      this.setFilter({name: value, localMrNo: null})
    }
  }

  setFilterLocalMrNo (v: any) {
    this.filterName = null
    const value = v.target.value
    if (((v.type === 'keyup' && v.which === 13) || v.type === 'blur') && value && value.length > 2) {
      this.setFilter({name: null, localMrNo: value})
    }
  }

  resetFilter (isReset: boolean = false, _isResetField: boolean = false) {
    this.showFilterTable = isReset
    if (isReset) { return }
    this.filterName = null
    this.filterLocalMrNo = null
  }
}
