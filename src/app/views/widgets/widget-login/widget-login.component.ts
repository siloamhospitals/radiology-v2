
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HospitalService } from '../../../services/hospital.service';
import { UserService } from '../../../services/user.service';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { HospitalSSO } from '../../../models/hospitals/sso.hospital';
import { appInfo, sourceApps } from '../../../variables/common.variable';
import { environment } from '../../../../environments/environment';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalChangePasswordComponent } from '../modal-change-password/modal-change-password.component';

@Component({
  selector: 'app-widget-login',
  templateUrl: './widget-login.component.html',
  styleUrls: ['./widget-login.component.css']
})
export class WidgetLoginComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  public model: any = {};
  public loading = false;
  public returnUrl: string;
  public toggleBox = true;
  public hospitalList: HospitalSSO[];
  public isSuccessSubmit = false;
  public applicationId = appInfo.APPLICATION_ID;
  public roleId = appInfo.ROLE_ID;
  public validation: any = {
    username: true,
    password: true
  };

  public alerts: Alert[] = [];
  public timer: any = 0;
  public checkCountDown: any = JSON.parse(localStorage.getItem('key') || '{}');
  public closeResult: string;

  constructor(
    private hospitalService: HospitalService,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private modalService: NgbModal,
    modalSetting: NgbModalConfig,
  ) {
    modalSetting.backdrop = 'static';
    modalSetting.keyboard = false;
   }

  ngOnInit() {

    document.body.className = 'body-login';
    this.userService.deleteLocalStorage();
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    this.getListHopital();
    this.getCollectionAlert();
    if (this.checkCountDown > 0) {
      this.startCountdown(this.checkCountDown);
    }
  }

  async startCountdown(seconds: any) {
    this.timer = seconds;
    const interval = setInterval(() => {
      if (this.timer === 1) {
        clearInterval(interval);
        localStorage.setItem('countdown', JSON.stringify(0));
      }
      this.timer--;
      localStorage.setItem('countdown', JSON.stringify(this.timer));
    }, 1000);
  }

  async getListHopital() {
    this.hospitalList = await this.hospitalService.getSSOHospital()
      .toPromise().then(res => {
        return res.data;
      });
  }

  changePasswordModal(css = 'change-password-modal') {
    const modalRef = this.modalService.open(ModalChangePasswordComponent, { windowClass: css, size: 'lg' });
    if (this.model.username) { modalRef.componentInstance.username = this.model.username; }
  }


  showToggleBox(source: string) {
    if (source === 'login') {
      this.toggleBox = true;
    } else {
      this.toggleBox = false;
    }
    this.alerts = [];
  }

  async login() {
    this.alerts = [];
    const username = btoa(this.model.username);
    const password = btoa(this.model.password);
    const applicationId = this.applicationId;
    const source = sourceApps;

    this.validation.username = true;
    this.validation.password = true;

    const body = {
      username,
      password,
      applicationId,
      source,
      isEncrypted: true
    };

    if (username === '') {
      this.alertService.error(`Username is Required`);
      this.validation.username = false;
      return;
    } else if (password === '') {
      this.alertService.error(`Password is Required`);
      this.validation.password = true;
      return;
    }

    this.loading = true;
    await this.userService.signIn(body)
      .toPromise().then(res => {

        if (res.status === 'OK') {

          const collections = res.data.map((val: any) => {
            return {
              id: val.hospital_id,
              orgId: val.hospital_hope_id,
              name: val.name,
              alias: val.alias,
              zone: val.time_zone,
              isBpjs: val.is_bpjs,
              isBridging: val.is_bridging
            };
          });

          const key = {
            user: {
              id: res.data[0].user_id,
              username: res.data[0].user_name,
              fullname: res.data[0].full_name,
              role_id: res.data[0].role_id,
              role_name: res.data[0].role_name,
            },
            hospital: {
              id: res.data[0].hospital_id,
              orgId: res.data[0].hospital_hope_id,
              name: res.data[0].name,
              alias: res.data[0].alias,
              zone: res.data[0].time_zone,
              isBpjs: res.data[0].is_bpjs,
              isBridging: res.data[0].is_bridging,
            },
            collection: collections,
          };

          localStorage.setItem('key', JSON.stringify(key));
          this.userService.emitMsgSignIn(res.message);
          this.router.navigate([this.returnUrl]);
        } else {
          if (res.message) {
            this.alertService.error(res.message, false, 3000);
          } else {
            this.alertService.error('Failed to login', false, 3000);
          }
        }
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        this.alertService.error(err.error.message, false, 3000);
        if (err.status === 401 || err.status === 403) { // the password is expired or change password default
          setTimeout(() => {
            this.changePasswordModal();
          }, 1500);
        }
      });
  }

  async getCollectionAlert() {
    this.alertService.getAlert().subscribe((alert: Alert) => {
      if (!alert) {
        // clear alerts when an empty alert is received
        this.alerts = [];
        return;
      }
      // add alert to array
      this.alerts.push(alert);
    });
  }

  cssAlertType(alert: Alert) {
    if (!alert) {
      return;
    }

    switch (alert.type) {
      case AlertType.Success:
        return 'success';
      case AlertType.Error:
        return 'danger';
      case AlertType.Info:
        return 'info';
      case AlertType.Warning:
        return 'warning';
    }
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }

}
