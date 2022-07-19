import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDetailScheduleComponent } from '../modal-detail-schedule/modal-detail-schedule.component';
import { ScheduleStatus } from 'src/app/variables/common.variable';
import { ModalitySlot } from 'src/app/models/radiology/modality-slot';
import * as moment from 'moment'
import { ModalCreateAppointmentComponent } from '../modal-create-appointment/modal-create-appointment.component';
import * as _ from 'lodash'
import Swal from 'sweetalert2';
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

  detailSchedule(item: any) {
    const payload = item;
    const m = this.modalService.open(ModalDetailScheduleComponent, { windowClass: 'modal_detail_schedule', backdrop: 'static', keyboard: false })
    m.componentInstance.data = payload;
    m.result.then((result: any) => {
      if (result) {
        this.showSuccessAlert(`Success`);
      }
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
          examination_id: slot.modality_examination_id,
          note: slot.notes,
          status: slot.status,
          rowSpan: 1,
          modality_slot_id: slot.modality_slot_id,
          reserve_date: slot.reserve_date,
          email: slot.email,
          identity_type_id: slot.identity_type_id,
          identity_number: slot.identity_number,
          is_bpjs: slot.is_bpjs,
          is_anesthesia: slot.is_anesthesia,
          modality_hospital_id: slot.modality_hospital_id,
          modality_name: slot.modality_name,
          modality_operational_id: slot.modality_operational_id,
          modality_queue_id: slot.modality_queue_id,
          mapping_room_id: slot.mapping_room_id,
          contact_id: slot.contact_id,
          room_id: slot.room_id,
          room_name: slot.room_name,
          admission_no: slot.admission_no,
          patient_phone_number_1: slot.patient_phone_number_1,
          patient_phone_number_2: slot.patient_phone_number_2,
          operational_type: slot.operational_type
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

  public showSuccessAlert(message: string) {
    Swal.fire({
      type: 'success',
      title: 'Success',
      text: message,
      timer: 1500
    });
  }

}
