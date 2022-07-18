import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDetailScheduleComponent } from '../modal-detail-schedule/modal-detail-schedule.component';
import { ScheduleStatus } from 'src/app/variables/common.variable';
import { ModalitySlot } from 'src/app/models/radiology/modality-slot';
import * as moment from 'moment'
import { ModalCreateAppointmentComponent } from '../modal-create-appointment/modal-create-appointment.component';
import * as _ from 'lodash'
import { RadiologyService } from 'src/app/services/radiology/radiology.service';
import { ModalityHospital } from 'src/app/models/radiology/modality-hospital';
@Component({
  selector: 'app-table-list-daily',
  templateUrl: './table-list-daily.component.html',
  styleUrls: ['./table-list-daily.component.css']
})
export class TableListDailyComponent implements OnInit {

  modalitySlots: ModalitySlot[];
  @Input() dateSelected: moment.Moment;
  @Input() sectionSelected: ModalityHospital;
  public scheduleStatus = ScheduleStatus
  public scheduleList: any[] = []

  constructor(
    private modalService: NgbModal,
    private radiologyService : RadiologyService,
  ) { }

  ngOnInit(): void {

  }

  async getModalitySlots() {
    if(this.sectionSelected.modality_hospital_id) {
      const modalityHospitalId = this.sectionSelected.modality_hospital_id  // 'd5b8dc5f-8cf6-4852-99a4-c207466d8ff9'
      const reserveDate = this.dateSelected.format('YYYY-MM-DD')
      const responseSlots = await this.radiologyService.getModalitySlots(modalityHospitalId, reserveDate).toPromise()
      this.modalitySlots = responseSlots.data || [];
    }
  }

  createAppointment() {
    const m = this.modalService.open(ModalCreateAppointmentComponent, { windowClass: 'fo_modal_confirmation', centered: true, size: 'lg'})
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

  async getSchedules() {
    const slots = this.modalitySlots
    const setToTime2Digit = (time : number) => ('0' + time).slice(-2);
    let lastCaptureSlot : any = {};
    const duration = this.sectionSelected.duration
    const numberSlotInHour = 60/duration;

    this.scheduleList = Array.from(Array(24).keys()).map(hour => {

      const hour2digit = setToTime2Digit(hour)
      const items =  Array.from(Array(numberSlotInHour).keys()).map(time => {
        const fromTime = hour2digit  + ':' + setToTime2Digit(time * duration)
        const nextMinute = (time + 1)*duration
        const toTime = nextMinute === 60 ? (setToTime2Digit(hour+1) + ':00') : (hour2digit + ':' + setToTime2Digit(nextMinute))

        const slot : any = slots.find(s =>
                moment(fromTime, 'hh:mm').isSameOrAfter(moment(s.from_time, 'hh:mm')) &&
                moment(toTime, 'hh:mm').isSameOrBefore(moment(s.to_time, 'hh:mm'))
              ) || {};                

        const patient = {
          fromTime: fromTime,
          toTime:  toTime,
          patient: slot.patient_name,
          dob: slot.patient_dob,
          localMrNo: slot.local_mr_no,
          examination: slot.modality_examination_name,
          note: slot.notes,
          status: slot.status,
          rowSpan: 1
        }

        if(slot.patient_name && slot.patient_name === lastCaptureSlot.patient){
          lastCaptureSlot.rowSpan = Number(lastCaptureSlot.rowSpan) + 1;
          patient.rowSpan = 0
        }else {
          lastCaptureSlot = patient
        }

        return patient
      
      })

      return {
        rowSpan: numberSlotInHour,
        items
      }
    })
  }

  isRowScheduled(schedule : any) {
    return schedule.rowSpan && schedule.patient
  }

  async ngOnChanges(changes: SimpleChanges) {
    if( !_.isEmpty((changes.sectionSelected && changes.sectionSelected.currentValue)) 
      || this.sectionSelected.modality_hospital_id) {
      await this.getModalitySlots()
      await this.getSchedules()
    }
  }

}
