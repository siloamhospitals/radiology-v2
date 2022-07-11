import { Component, OnInit } from '@angular/core';
import { BpjsService } from '../../../services/bpjs.service';
import { AppointmentService } from '../../../services/appointment.service';
import { hospitalId } from '../../../variables/common.variable';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-section-sidebar',
  templateUrl: './section-sidebar.component.html',
  styleUrls: ['./section-sidebar.component.css']
})
export class SectionSidebarComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  public countReqList = 0;
  public countAidoList = 0;
  public key: any = JSON.parse(localStorage.getItem('key') || '{}');
  public hospital = this.key.hospital;
  public yogyaHospitalId = hospitalId.yogyakarta;
  public isBpjs = this.key.hospital.isBpjs;
  public dateNow: any = moment().format('YYYY-MM-DD');

  constructor(
    private bpjsService: BpjsService,
    private appointmentService: AppointmentService,
  ) {
    this.countRechedule();
    this.countAido();
  }

  ngOnInit() {}

  countRechedule() {
    this.bpjsService.getCountReqList(this.hospital.id).subscribe(
      data => {
        this.countReqList = data.data;
      }
    );
  }

  countAido() {
    this.appointmentService.countAidoAppointment(this.hospital.id, this.dateNow, this.dateNow).subscribe(
      data => {
        this.countAidoList = data.data;
      }
    );
  }

}
