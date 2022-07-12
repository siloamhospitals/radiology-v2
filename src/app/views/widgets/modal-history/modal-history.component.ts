import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { appInfo, sourceApps } from '../../../variables/common.variable';

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

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.getCollectionAlert();
    this.checkUserLogin();
  }

  checkUserLogin() {
    const strKey = localStorage.getItem('key') || '{}';
    if (JSON.parse(strKey) > 0) {
      this.key = JSON.parse(strKey);
      this.user = this.key.user;
      this.model.username = this.user.username;
    } else {
      this.model.username = this.username ? this.username : null;
    }
  }

  validationPass(value: any) {
    const minLength = 8;
    const pattern = /[^A-Za-z0-9]/;
    const hasNumber = /\d/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    if (value.length < minLength) {
      this.alertText = 'Your password must have min 8 character.';
      return false;
    } else if (!hasNumber || !hasUpper || !hasLower) {
      this.alertText = 'Your password must have upper case, lower case, and number.';
      return false;
    } else if (!value.match(pattern)) {
      this.alertText = 'Your password must have special character.';
      return false;
    } else {
      this.alertText = '';
      return true;
    }
  }

  checkingPass() {
    if (this.model.oldPassword === this.model.newPassword) {
      this.alertText = 'Create a new password you haven\'t used before';
      return false;
    } else if (this.model.newPassword !== this.model.confirmNewPassword) {
      this.alertText = 'Please make sure both passwords match';
      return false;
    } else if (this.validationPass(this.model.newPassword) === false) {
      return false;
    } else {
      return true;
    }
  }

  async changePassword() {
    const valid = this.checkingPass();
    if (valid) {
      this.isSubmit = true;
      const username = this.model.username;
      const oldPassword = btoa(this.model.oldPassword);
      const newPassword = btoa(this.model.newPassword);
      const applicationId = this.applicationId;
      const modifiedBy = this.model.username;
      const source = sourceApps;
      const body = {
        username,
        oldPassword,
        newPassword,
        applicationId,
        modifiedBy,
        source
      };
      await this.userService.changePassword(body)
        .toPromise().then(res => {
          this.alertService.success(res.message, false, 2000);
          this.closeModal();
        }).catch(err => {
          this.isSubmit = false;
          this.alertService.error(err.error.message, false, 3000);
        });
    }
  }

  close() {
    this.activeModal.close();
  }

  closeModal() {
    setTimeout(() => {
      this.close();
      this.isSubmit = false;
    }, 2000);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
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
