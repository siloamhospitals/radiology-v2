import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { ModalityHospital } from 'src/app/models/radiology/radiology';
import { RadiologyService } from 'src/app/services/radiology/radiology.service';
import { ScheduleStatus } from 'src/app/variables/common.variable';
import { TableListDailyComponent } from '../table-list-daily/table-list-daily.component';

@Component({
  selector: 'app-table-filter-schedule',
  templateUrl: './table-filter-schedule.component.html',
  styleUrls: ['./table-filter-schedule.component.css']
})
export class TableFilterScheduleComponent implements OnInit {

  @Input() dateSelected: moment.Moment;
  @Input() sectionSelected: ModalityHospital;

  @Input() filter: any = { name: null, localMrNo: null }
  @Output() isFilterShow = new EventEmitter<boolean>()

  slotData: any[] = []
  filterList: any[] = []
  filterShow: boolean = false

  public scheduleStatus = ScheduleStatus

  constructor(
    private radiologyService: RadiologyService,
    private scheduleComponent: TableListDailyComponent,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(_changes: SimpleChanges) {
    console.log('filterischanges', _changes)
    this.refresh()
  }

  refresh() {
    this.setFilter(this.filter)
  }

  async fetchSlotData() {
    let reserveDate: any = this.dateSelected
    const sectionId: any = this.sectionSelected ? this.sectionSelected.modality_hospital_id : null
    if (reserveDate && sectionId) {
      reserveDate = moment(reserveDate).format('YYYY-MM-DD')
      const responseSlots = await this.radiologyService.getModalitySlots(sectionId, reserveDate).toPromise()
      this.slotData = responseSlots.data || [];
    }
  }

  async setFilter(obj: any) {
    const { localMrNo, name: patientName } = obj
    try {
      await this.fetchSlotData()
      this.filterList = (this.slotData || []).filter((item: any) => {
        if (obj.localMrNo && obj.localMrNo.length > 0) {
          return String(item.local_mr_no).toLowerCase().includes(localMrNo.toLowerCase())
        }
        return String(item.patient_name).toLowerCase().includes(patientName.toLowerCase())
      })
      this.filterShow = true
      if (this.filterList && this.filterList.length > 0) { this.filterShow = false }
      this.isFilterShow.emit(this.filterShow)
    } catch (e) { }
  }

  resetFilter() {
    this.filterShow = false
    this.filter = { name: null, localMrNo: null }
    this.isFilterShow.emit(this.filterShow)
  }

  itemSelected(item: any) {
    this.scheduleComponent.detailSchedule(item)
  }

}

// class TableFilterSchedule {
//   name: string = null;
//   localMrNo: string = null;
// }
