import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ModalityHospital } from '../../../models/radiology/radiology';
import { RadiologyService } from '../../../services/radiology/radiology.service';
import { ScheduleStatus, ScheduleStatusIDN } from '../../../variables/common.variable';
import { ModalDetailScheduleComponent } from '../modal-detail-schedule/modal-detail-schedule.component';

@Component({
  selector: 'app-table-filter-schedule',
  templateUrl: './table-filter-schedule.component.html',
  styleUrls: ['./table-filter-schedule.component.css']
})
export class TableFilterScheduleComponent implements OnInit, OnChanges {

  @Input() dateSelected: moment.Moment
  @Input() sectionSelected: ModalityHospital
  @Input() tableViewActive: number = 0

  @Input() filter: any = { name: null, localMrNo: null }
  @Output() isFilterShow = new EventEmitter<boolean>()

  slotData: any[] = []
  filterList: any[] = []
  filterShow: boolean = false
  isLoading: boolean = false
  fetchDataDebounce: any = null

  public scheduleStatus: any = ScheduleStatus
  public scheduleStatusIDN: any = ScheduleStatusIDN

  constructor(
    private radiologyService: RadiologyService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.refresh()
  }

  refresh() {
    if (this.fetchDataDebounce) { clearTimeout(this.fetchDataDebounce) }
    this.fetchDataDebounce = setTimeout(() => { this.setFilter(this.filter) }, 500)
  }

  async fetchSlotData() {
    let reserveDate: any = this.dateSelected
    const sectionId: any = this.sectionSelected ? this.sectionSelected.modality_hospital_id : null
    const viewId = this.tableViewActive
    if (reserveDate && sectionId) {
      reserveDate = moment(reserveDate).format('YYYY-MM-DD')
      if (viewId === 1) {
        let list = []
        for (let item of this.generateDayLabel()) {
          const d = await this.radiologyService.getModalitySlots(sectionId, moment(item.date).format('YYYY-MM-DD')).toPromise()
            .then(res => res.data).catch(() => [])
          list.push(d || [])
        }
        list = (list||[]).filter((x: any) => x.length > 0).reduce((acc, x) => acc.concat(x), [])
        this.slotData = list
      } else {
        const responseSlots = await this.radiologyService.getModalitySlots(sectionId, reserveDate).toPromise()
        this.slotData = responseSlots.data || []
      }
    }
  }

  generateDayLabel () {
    const now = moment(this.dateSelected)
    const minDay = now.clone().weekday(0)
    const weeks = []
    for(let d = Number(minDay.format('d')); d<8; d++) {
      const current = minDay.clone().add(d, 'days')
      weeks.push({
        date: current.toDate(),
        label: current.format('dddd'),
        value: current.format('DD'),
        isToday: moment().isSame(current, 'days'),
      })
    }
    weeks.shift()
    return weeks
  }

  async setFilter(obj: any) {
    const { localMrNo, name: patientName } = obj
    try {
      this.isLoading = true
      await this.fetchSlotData()
      this.filterList = (this.slotData || []).filter((item: any) => {
        if (obj.localMrNo && obj.localMrNo.length > 0) {
          return String(item.local_mr_no).toLowerCase().includes(localMrNo.toLowerCase())
        }
        return String(item.patient_name).toLowerCase().includes(patientName.toLowerCase())
      })
      this.filterShow = this.filterList && this.filterList.length > 0
      // this.isFilterShow.emit(this.filterShow)
    } catch (e) {
      console.log('FILTER_DATA_ERROR', e)
    } finally {
      this.isLoading = false
    }
  }

  resetFilter() {
    this.filterShow = false
    this.filter = { name: null, localMrNo: null }
    this.isFilterShow.emit(this.filterShow)
  }

  detailSchedule(schedule?: any) {
    const payload =  {
      ...schedule,
      reserveDate: this.dateSelected,
      // refreshTableDaily: this.refreshData
    }
    payload.from_time = moment(payload.from_time, 'hh:mm').format('HH:mm')
    payload.to_time = moment(payload.to_time, 'hh:mm').format('HH:mm')
    const m = this.modalService.open(ModalDetailScheduleComponent, { windowClass: 'modal_detail_schedule', backdrop: 'static', keyboard: false })
    m.componentInstance.selectedAppointment = payload;
    m.result.then((result: any) => {
      if (result) {
        // this.refresh()
      }
    })
  }

  itemSelected(item: any) {
    this.detailSchedule(item)
  }

}

// class TableFilterSchedule {
//   name: string = null;
//   localMrNo: string = null;
// }
