import { Component, OnInit, Input } from '@angular/core';
import { Alert } from '../../../models/alerts/alert';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { appInfo, AppointmentStatusEnum } from '../../../variables/common.variable';
import { RadiologyService } from '../../../services/radiology/radiology.service';
import { AppointmentRadiologyHistory } from '../../../models/appointments/appointment-radiology-history';

@Component({
  selector: 'app-modal-history',
  templateUrl: './modal-history.component.html',
  styleUrls: ['./modal-history.component.css']
})
export class ModalHistoryComponent implements OnInit {

  @Input() username: any;
  @Input() modalitySlotId: any
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
  public isLoading : boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private radiologyService: RadiologyService
  ) { }

  async ngOnInit() {
    await this.getAppRadiologyHistory()
  }

  async getAppRadiologyHistory() {
    this.isLoading = true;
    const response = await this.radiologyService.getAppRadiologyHistory(this.modalitySlotId).toPromise();
    this.history = response.data
    this.isLoading = false;
  }

  close() {
    this.activeModal.close();
  }


}
