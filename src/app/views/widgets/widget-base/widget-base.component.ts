import {environment} from '../../../../environments/environment';
import {AlertService} from '../../../services/alert.service';
import {OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {Alert} from '../../../models/alerts/alert';
import {HttpErrorResponse} from '@angular/common/http';

export abstract class WidgetBaseComponent implements OnDestroy {
  public alertMap: {[key: string]: Alert[]} = {};
  public readonly assetPath = environment.ASSET_PATH;
  private alertSubscription: Subscription;
  public isLoading = false;
  public readonly defaultAlertKey: string;
  public readonly maskDateOfBirth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  protected constructor(
    protected alertService: AlertService,
    alertKey: string,
  ) {
    this.getCollectionAlert();
    this.defaultAlertKey = alertKey;
  }

  ngOnDestroy(): void {
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }
  }

  removeAlert(alert: Alert) {
    if (this.alertMap[alert.destination] && this.alertMap[alert.destination].length > 0) {
      this.alertMap[alert.destination] = this.alertMap[alert.destination].filter(e => e !== alert);
    }
  }

  getCollectionAlert() {
    this.alertSubscription = this.alertService.getAlert().subscribe((alert: Alert) => {
      if (!alert) {
        // clear alerts when an empty alert is received
        this.alertMap = {};
        return;
      }

      // add alert to array
      if (!this.alertMap[alert.destination]) {
        this.alertMap[alert.destination] = [];
      }
      this.alertMap[alert.destination].push(alert);
    });
  }

  showSuccessAlert(message: string, duration: number = 3000) {
    this.alertService.baseSuccess(message, this.defaultAlertKey, duration);
  }

  showInfoAlert(message: string, duration: number = 3000) {
    this.alertService.baseInfo(message, this.defaultAlertKey, duration);
  }

  showWarnAlert(message: string, duration: number = 3000) {
    this.alertService.baseWarn(message, this.defaultAlertKey, duration);
  }

  showErrorAlert(data: string | HttpErrorResponse, duration: number = 3000) {
    let message;
    if (data instanceof HttpErrorResponse) {
      console.log(data, '=======data')
      message = `${data.error.message}`;
    } else {
      message = data;
    }
    this.alertService.baseError(message, this.defaultAlertKey, duration);
  }


  resetFor(key: string): void {
    if (this.alertMap[key]) {
      this.alertMap[key] = [];
    }
  }

  showLoading() {
    this.isLoading = true;
  }

  hideLoading() {
    this.isLoading = false;
  }

}
