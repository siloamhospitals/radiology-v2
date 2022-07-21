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
  @Input() fromTimeRange: string;
  @Input() toTimeRange: string;

  public scheduleStatus = ScheduleStatus
  public scheduleList: any[] = []
  public scheduleListBk: any[] = []

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

  createAppointment(schedule?: any) {
    const m = this.modalService.open(ModalCreateAppointmentComponent, { keyboard: false });
    const { modality_hospital_id: modalityHospitalId } = this.sectionSelected;
    const { fromTime, toTime } = schedule;
    const payload = {
      fromTime,
      toTime,
      modalityHospitalId,
      reserveDate: this.dateSelected,
    }
    console.log(payload, '========payload')
    m.componentInstance.selectedAppointment = payload;
    // m.result.then((result: any) => {
    //   console.log('modal is closed', {result})
    // })
  }

  detailSchedule(schedule?: any) {
    const payload =  {
      ...schedule,
      reserveDate: this.dateSelected,
    }
    payload.from_time = moment(payload.from_time, 'hh:mm').format('hh:mm')
    payload.to_time = moment(payload.to_time, 'hh:mm').format('hh:mm')
    const m = this.modalService.open(ModalDetailScheduleComponent, { windowClass: 'modal_detail_schedule', backdrop: 'static', keyboard: false })
    m.componentInstance.selectedAppointment = payload;
    m.result.then((result: any) => {
      if (result) {
        this.showSuccessAlert(`Success`);
      }
    })
  }

  setToTime2Digit = (time : number) => ('0' + time).slice(-2);

  async getSchedules() {
    const slots = this.modalitySlots

    let lastCaptureSlot : any = {};
    if(this.sectionSelected.duration > 60) {
      this.createTimeSlotInDurationHour(slots, lastCaptureSlot);
    }else {
      this.createTimeSlotInDurationMinute(slots, lastCaptureSlot);
    }

    this.scheduleListBk = this.scheduleList.slice()
  }

  private createTimeSlotInDurationHour(slots: ModalitySlot[], lastCaptureSlot: any) {
    const duration = this.sectionSelected.duration || 60;
    const numberSlotInDay =  Math.ceil(24*60/duration);
    const stepHour = Math.ceil(duration/60)

    this.scheduleList = Array.from(Array(numberSlotInDay).keys()).map(hour => {

      const multiplyHour = hour*stepHour;
      const hour2digit = this.setToTime2Digit(multiplyHour);
      const items = multiplyHour >= 24 ? [] : [0].map(() => {
        const fromTime =  hour2digit + ':00'
        const toTime = this.setToTime2Digit((hour+1)*stepHour) + ':00'

        const slot: any = slots.find(s => moment(fromTime, 'hh:mm').isSameOrAfter(moment(s.from_time, 'hh:mm')) &&
          moment(toTime, 'hh:mm').isSameOrBefore(moment(s.to_time, 'hh:mm'))
        ) || {};

        const patient = {
          fromTime: fromTime,
          toTime: toTime,
          patient: slot.patient_name,
          dob: slot.patient_dob,
          localMrNo: slot.local_mr_no,
          examination: slot.modality_examination_name,
          note: slot.notes,
          status: slot.status,
          modality_slot_id: slot.modality_slot_id,
          rowSpan: 1,
          ...slot
        }

        if (slot.modality_slot_id && slot.modality_slot_id === lastCaptureSlot.modality_slot_id) {
          lastCaptureSlot.rowSpan = Number(lastCaptureSlot.rowSpan) + 1;
          patient.rowSpan = 0;
        } else {
          lastCaptureSlot = patient;
        }

        return patient;

      });

      return {
        hour: hour2digit,
        rowSpan: 1,
        items
      };
    });
  }

  private createTimeSlotInDurationMinute(slots: ModalitySlot[], lastCaptureSlot: any) {
    const duration = this.sectionSelected.duration || 30;
    const numberSlotInHour = Math.ceil(60 / duration);

    this.scheduleList = Array.from(Array(24).keys()).map(hour => {

      const hour2digit = this.setToTime2Digit(hour);
      const items = Array.from(Array(numberSlotInHour).keys()).map(time => {
        const fromTime = hour2digit + ':' + this.setToTime2Digit(time * duration);
        const nextMinute = (time + 1) * duration;
        const toTime = nextMinute === 60 ? (this.setToTime2Digit(hour + 1) + ':00') : (hour2digit + ':' + this.setToTime2Digit(nextMinute));

        const slot: any = slots.find(s => moment(fromTime, 'hh:mm').isSameOrAfter(moment(s.from_time, 'hh:mm')) &&
          moment(toTime, 'hh:mm').isSameOrBefore(moment(s.to_time, 'hh:mm'))
        ) || {};

        const patient = {
          fromTime: fromTime,
          toTime: toTime,
          patient: slot.patient_name,
          dob: slot.patient_dob,
          localMrNo: slot.local_mr_no,
          examination: slot.modality_examination_name,
          note: slot.notes,
          status: slot.status,
          modality_slot_id: slot.modality_slot_id,
          rowSpan: 1,
          ...slot
        }

        if (slot.modality_slot_id && slot.modality_slot_id === lastCaptureSlot.modality_slot_id) {
          lastCaptureSlot.rowSpan = Number(lastCaptureSlot.rowSpan) + 1;
          patient.rowSpan = 0;
        } else {
          lastCaptureSlot = patient;
        }

        return patient;

      });

      return {
        hour: hour2digit,
        rowSpan: numberSlotInHour,
        items
      };
    });

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

    if((changes.fromTimeRange && changes.fromTimeRange.currentValue)
      || (changes.toTimeRange && changes.toTimeRange.currentValue)) {
        if(this.fromTimeRange === '00:00' && this.toTimeRange === '00:00') {
          this.scheduleList = this.scheduleListBk.slice()
        }else {
          const momentFromTime = moment(this.fromTimeRange, 'hh:mm')
          const momentToTime = moment(this.toTimeRange, 'hh:mm')
          this.scheduleList = this.scheduleListBk.filter(sc => {
            return sc.items.find((item : any) => momentFromTime.isSameOrBefore(moment(item.fromTime, 'hh:mm'))
                && momentToTime.isSameOrAfter(moment(item.toTime, 'hh:mm')) )
          })
        }
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
