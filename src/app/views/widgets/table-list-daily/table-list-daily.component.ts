import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDetailScheduleComponent } from '../modal-detail-schedule/modal-detail-schedule.component';
import { ScheduleStatus } from 'src/app/variables/common.variable';
import { ModalitySlot } from 'src/app/models/radiology/modality-slot';
import * as moment from 'moment'
import { ModalCreateAppointmentComponent } from '../modal-create-appointment/modal-create-appointment.component';
@Component({
  selector: 'app-table-list-daily',
  templateUrl: './table-list-daily.component.html',
  styleUrls: ['./table-list-daily.component.css']
})
export class TableListDailyComponent implements OnInit {

  @Input() modalitySlots: ModalitySlot[];
  @Input() dateSelected: Date
  public scheduleStatus = ScheduleStatus
  public scheduleList: any[] = []

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {

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
    const setToHour2Digit = (time : number) => ('0' + time).slice(-2);
    let lastCaptureSlot : any = {};
    let rowSpan = 0;
    this.scheduleList = Array.from(Array(24).keys()).map(time => {
      const hour2digit = setToHour2Digit(time)
      const firstFromTime = hour2digit  + ':00'
      const firstToTime = hour2digit + ':30'
      const lastFromTime = hour2digit  + ':30'
      const lastToTime = setToHour2Digit(time+1) + ':00'

      const patientFirst : any = slots.find(s =>
          moment(firstFromTime, 'hh:mm').isSameOrAfter(moment(s.from_time, 'hh:mm')) &&
          moment(firstToTime, 'hh:mm').isSameOrBefore(moment(s.to_time, 'hh:mm'))
        ) || {};

      if(patientFirst.patient_name && patientFirst.patient_name === lastCaptureSlot.patient){
        lastCaptureSlot.rowSpan = Number(lastCaptureSlot.rowSpan) + 1;
      }else{
        rowSpan = 1
      }

      const firstSlot = {
          fromTime: firstFromTime,
          toTime:  firstToTime,
          patient: patientFirst.patient_name,
          dob: patientFirst.patient_dob,
          localMrNo: patientFirst.local_mr_no,
          examination: patientFirst.modality_examination_name,
          note: patientFirst.notes,
          status: patientFirst.status,
          rowSpan: lastCaptureSlot.patient && patientFirst.patient_name === lastCaptureSlot.patient ? null : rowSpan
      }

      lastCaptureSlot = firstSlot

      const patientLast : any = slots.find(s =>
          moment(lastFromTime, 'hh:mm').isSameOrAfter(moment(s.from_time, 'hh:mm')) &&
          moment(lastToTime, 'hh:mm').isSameOrBefore(moment(s.to_time, 'hh:mm'))
        ) || {};

      if(patientLast.patient_name && patientLast.patient_name === lastCaptureSlot.patient){
        lastCaptureSlot.rowSpan = Number(lastCaptureSlot.rowSpan) + 1;
      } else {
        rowSpan = 1;
      }


      const lastSlot = {
        fromTime: lastFromTime,
        toTime: lastToTime,
        patient: patientLast.patient_name,
        dob: patientLast.patient_dob,
        localMrNo: patientLast.local_mr_no,
        examination: patientLast.modality_examination_name,
        note: patientLast.notes,
        status: patientLast.status,
        rowSpan: lastCaptureSlot.patient && patientLast.patient_name === lastCaptureSlot.patient ? null : rowSpan
     }

     lastCaptureSlot = patientLast

      return [ firstSlot, lastSlot ]
    })
  }

  isRowScheduled(schedule : any) {
    return schedule.rowSpan && schedule.patient
  }

  async ngOnChanges(changes: SimpleChanges) {
    if(changes.modalitySlots) {
      await this.getSchedules()
    }
  }

}
