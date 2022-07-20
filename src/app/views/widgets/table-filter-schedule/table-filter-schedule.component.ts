import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ModalityHospital } from 'src/app/models/radiology/radiology';
import { RadiologyService } from 'src/app/services/radiology/radiology.service';
import { ScheduleStatus } from 'src/app/variables/common.variable';
import { ModalDetailScheduleComponent } from '../modal-detail-schedule/modal-detail-schedule.component';

@Component({
  selector: 'app-table-filter-schedule',
  templateUrl: './table-filter-schedule.component.html',
  styleUrls: ['./table-filter-schedule.component.css']
})
export class TableFilterScheduleComponent implements OnInit, OnChanges {

  @Input() dateSelected: moment.Moment;
  @Input() sectionSelected: ModalityHospital;

  @Input() filter: any = { name: null, localMrNo: null }
  @Output() isFilterShow = new EventEmitter<boolean>()

  slotData: any[] = []
  filterList: any[] = []
  filterShow: boolean = false
  isLoading: boolean = false
  fetchDataDebounce: any = null

  public scheduleStatus = ScheduleStatus

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
    if (reserveDate && sectionId) {
      reserveDate = moment(reserveDate).format('YYYY-MM-DD')
      const responseSlots = await this.radiologyService.getModalitySlots(sectionId, reserveDate).toPromise()
      this.slotData = responseSlots.data || []
    }
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

  detailSchedule(item: any) {
    const payload = item;
    const m = this.modalService.open(ModalDetailScheduleComponent, { windowClass: 'modal_detail_schedule', backdrop: 'static', keyboard: false })
    m.componentInstance.data = payload;
    m.result.then((result: any) => {
      if (result) {
        // this.showSuccessAlert(`Success`);
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
