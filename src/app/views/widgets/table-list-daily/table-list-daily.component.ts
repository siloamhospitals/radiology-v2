import { Component, Input, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDetailScheduleComponent } from '../modal-detail-schedule/modal-detail-schedule.component';
import { ScheduleStatus, ScheduleStatusIDN } from '../../../variables/common.variable';
import { ModalitySlot } from '../../../models/radiology/modality-slot';
import * as moment from 'moment'
import { ModalCreateAppointmentComponent } from '../modal-create-appointment/modal-create-appointment.component';
import * as _ from 'lodash'
import Swal from 'sweetalert2';
import { RadiologyService } from '../../../services/radiology/radiology.service';
import { ModalityHospital } from '../../../models/radiology/modality-hospital';
import { WebsocketService } from 'src/app/services/websocket.service';
@Component({
  selector: 'app-table-list-daily',
  templateUrl: './table-list-daily.component.html',
  styleUrls: ['./table-list-daily.component.css']
})
export class TableListDailyComponent {
  // Credential Information
  key: any = JSON.parse(localStorage.getItem('key') || '{}');
  hospital = this.key.hospital;
  user = this.key.user;

  modalitySlots: ModalitySlot[];
  @Input() dateSelected: moment.Moment;
  @Input() sectionSelected: ModalityHospital;
  @Input() fromTimeRange: string;
  @Input() toTimeRange: string;
  @Input() isBpjs: boolean;
  @Input() isNonBpjs: boolean;

  public scheduleStatus: any = ScheduleStatus
  public scheduleStatusIDN: any = ScheduleStatusIDN
  public scheduleList: any[] = []
  public scheduleListBk: any[] = []
  public isLoading: boolean;

  isLoadingSection: boolean = false
  debounceLoadData: any = null

  constructor(
    private modalService: NgbModal,
    private radiologyService : RadiologyService,
    private webSocketService : WebsocketService,
  ) { }

  async getModalitySlots() {
    if(this.sectionSelected.modality_hospital_id) {
      const modalityHospitalId = this.sectionSelected.modality_hospital_id
      const reserveDate = this.dateSelected.format('YYYY-MM-DD')
      const responseSlots = await this.radiologyService.getModalitySlots(modalityHospitalId, reserveDate).toPromise()
      this.modalitySlots = responseSlots.data || [];
    }


  }

  refreshData = async () => {
    this.isLoading = true
    this.scheduleList = []
    await this.getModalitySlots()
    await this.getSchedules()
    this.isLoading = false
  }

  createAppointment(schedule?: any) {
    const m = this.modalService.open(ModalCreateAppointmentComponent, { keyboard: false });
    const { modality_hospital_id: modalityHospitalId, modality_label, room_name, duration, operational_type } = this.sectionSelected;
    const { fromTime, toTime } = schedule;
    const payload = {
      fromTime,
      toTime,
      modalityHospitalId,
      reserveDate: this.dateSelected,
      modality_label,
      room_name,
      duration,
      operational_type
      // refreshTableDaily: this.refreshData
    }
    m.componentInstance.selectedAppointment = payload;
    m.result.then((_result: any) => {
      // console.log('modal is closed', {result})
      this.refresh()
    })
  }

  detailSchedule(schedule?: any) {
    const payload =  {
      ...schedule,
      reserveDate: this.dateSelected,
      refreshTableDaily: this.refreshData()
    }
    payload.from_time = moment(payload.from_time, 'hh:mm').format('HH:mm')
    payload.to_time = moment(payload.to_time, 'hh:mm').format('HH:mm')
    const m = this.modalService.open(ModalDetailScheduleComponent, { windowClass: 'modal_detail_schedule', backdrop: 'static', keyboard: false })
    m.componentInstance.selectedAppointment = payload;
    m.result.then((result: any) => {
      if (result) {
        this.refresh()
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
          dob: slot.patient_dob ? moment(slot.patient_dob, 'YYYY-MM-DD').format('DD MMM YYYY') : '',
          localMrNo: slot.local_mr_no,
          examination: slot.modality_examination_name,
          note: slot.notes,
          status: slot.status,
          modality_slot_id: slot.modality_slot_id,
          rowSpan: 1,
          patient_visit_number: slot.patient_visit_number,
          isBpjs: slot.is_bpjs,
          isPast: moment().isAfter(moment(this.dateSelected), 'days'),
          isMaintenance: slot.is_maintenance,
          duration,
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
          dob: slot.patient_dob ? moment(slot.patient_dob, 'YYYY-MM-DD').format('DD MMM YYYY') : '',
          localMrNo: slot.local_mr_no,
          examination: slot.modality_examination_name,
          note: slot.notes,
          status: slot.status,
          modality_slot_id: slot.modality_slot_id,
          rowSpan: 1,
          patient_visit_number: slot.patient_visit_number,
          isBpjs: slot.is_bpjs,
          isPast: moment().isAfter(moment(this.dateSelected), 'days'),
          isMaintenance: slot.is_maintenance,
          duration,
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
    if((!_.isEmpty((changes.sectionSelected && changes.sectionSelected.currentValue))
      || !_.isEmpty((changes.dateSelected && changes.dateSelected.currentValue)))
      && this.sectionSelected.modality_hospital_id) {
      this.refresh(true)
      // await this.refreshData()
    }


    if((changes.fromTimeRange && changes.fromTimeRange.currentValue)
      || (changes.toTimeRange && changes.toTimeRange.currentValue)) {
        if(this.fromTimeRange === '00:00' && this.toTimeRange === '00:00') {
          this.scheduleList = this.scheduleListBk.slice()
        }else {
          const momentFromTime = moment(this.fromTimeRange, 'hh:mm')
          const momentToTime = moment(this.toTimeRange, 'hh:mm');
          const onTimeRange = (item : any) => momentFromTime.isSameOrBefore(moment(item.fromTime, 'hh:mm'))
                && momentToTime.isSameOrAfter(moment(item.toTime, 'hh:mm')); 
                     
          this.reducingSchedulList(onTimeRange);
        }
      }
    
    if((changes.isBpjs && changes.isBpjs.currentValue) !== undefined
      || (changes.isNonBpjs && changes.isNonBpjs.currentValue) !== undefined) {

        if((this.isBpjs === false && this.isNonBpjs === false) 
            || this.isBpjs === true && this.isNonBpjs === true) {
          this.scheduleList = this.scheduleListBk.slice()
        }else {
          const onIsBpjs = (item : any) => this.isBpjs ? item.is_bpjs : item.is_bpjs === false; 
          this.reducingSchedulList(onIsBpjs);
        }
      }
  }

  private reducingSchedulList(onTimeRange: (item: any) => boolean) {
    this.scheduleList = this.scheduleListBk.reduce((acc, sc) => {
      const copySc = Object.assign({}, sc);
      const items = copySc.items.filter(onTimeRange);

      if (items.length) {
        copySc.items = items.slice();
        copySc.rowSpan = items.length;
        acc.push(copySc);
      }
      return acc;
    }, []);
  }

  public showSuccessAlert(message: string) {
    Swal.fire({
      type: 'success',
      title: 'Success',
      text: message,
      timer: 1500
    });
  }

  async refresh (reinit: boolean = false) {
    if (this.debounceLoadData) { clearTimeout(this.debounceLoadData) }
    this.debounceLoadData = setTimeout(async () => {
      if (reinit) { this.isLoadingSection = true }
      await this.getModalitySlots()
      await this.getSchedules()
      if (reinit) { this.isLoadingSection = false }
    }, 800)
  }

  clickTableData = (schedule : any) => {
    if(schedule.isPast && !schedule.patient) {
      return
    }
    if (schedule.isMaintenance) { return }

    if(this.isRowScheduled(schedule)){
      this.detailSchedule(schedule)
    } else {
      this.createAppointment(schedule)
    }
  }

  rowClass (item: any, isFirstColumn: boolean = false) {
    let cl = ''
    if (item.is_maintenance) {
      cl = 'table-td table-td-note '
    } else if (!item.is_maintenance && item.rowSpan && item.patient) {
      cl = 'table-td table-td-scheduled '
    }
    if (isFirstColumn) {
      cl += 'item-indicator-primary'
    }
    return cl
  }

  socketEvents () {
    this.webSocketService.radiologySocket(`APPOINTMENT__CREATE/${this.hospital.id}`).subscribe((res: any) => {
      console.log('res', res);
    });
  }

}
