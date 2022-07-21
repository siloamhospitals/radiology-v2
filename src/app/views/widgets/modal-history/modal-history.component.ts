import { Component, OnInit, Input } from '@angular/core';
import { Alert } from '../../../models/alerts/alert';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { appInfo, AppointmentStatusEnum } from '../../../variables/common.variable';
import { RadiologyService } from 'src/app/services/radiology/radiology.service';
import { AppointmentRadiologyHistory } from 'src/app/models/appointments/appointment-radiology-history';

@Component({
  selector: 'app-modal-history',
  templateUrl: './modal-history.component.html',
  styleUrls: ['./modal-history.component.css']
})
export class ModalHistoryComponent implements OnInit {

  @Input() username: any;
  public key: { user: any; };
  public user: any;
  public applicationId = appInfo.APPLICATION_ID;
  public roleId = appInfo.ROLE_ID;
  public model: any = {};
  public fieldTextType = false;
  public alerts: Alert[] = [];
  public isSubmit = false;
  public alertText = '';
  public history: AppointmentRadiologyHistory[] = []
  public statusApps = AppointmentStatusEnum

  constructor(
    public activeModal: NgbActiveModal,
    private radiologyService: RadiologyService
  ) { }

  async ngOnInit() {
    await this.getAppRadiologyHistory()
  }

  async getAppRadiologyHistory() {
    const appointmentId = 'e5a39cb1-49ee-4b0f-8adc-78ad1cd26626'
    const response = await this.radiologyService.getAppRadiologyHistory(appointmentId).toPromise();
    this.history = response.data
  }

  close() {
    this.activeModal.close();
  }


}
