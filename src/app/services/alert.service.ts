import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Alert, AlertType} from '../models/alerts/alert';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<Alert>();
  private keepAfterRouteChange = false;
  private duration = new Subject<number>();

  constructor(router: Router) {
      // clear alert messages on route change unless 'keepAfterRouteChange' flag is true

      router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          if (this.keepAfterRouteChange) {
            // only keep for a single route change
            this.keepAfterRouteChange = false;
          } else {
            // clear alert messages
            this.clear();
          }
        }
      });

      this.duration.subscribe(d => {
        if (d) {
          this.subject.pipe(
            debounceTime(d)
          ).subscribe((_) => this.clear());
        }
      });
  }

  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }

  success(message: string, keepAfterRouteChange = false, duration?: number) {
    this.alert(AlertType.Success, message, keepAfterRouteChange, duration);
  }

  error(message: string, keepAfterRouteChange = false, duration?: number) {
    this.alert(AlertType.Error, message, keepAfterRouteChange, duration);
  }

  info(message: string, keepAfterRouteChange = false, duration?: number) {
    this.alert(AlertType.Info, message, keepAfterRouteChange, duration);
  }

  warn(message: string, keepAfterRouteChange = false, duration?: number) {
    this.alert(AlertType.Warning, message, keepAfterRouteChange, duration);
  }

  alert(type: AlertType, message: string, keepAfterRouteChange = false, duration?: number) {
    if (duration) {
      this.duration.next(duration);
    }
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({ type, message } as Alert);
  }

  baseSuccess(message: string, destination: string = '', duration: number = 2000) {
    this.baseAlert({
      type: AlertType.Success,
      message,
      destination,
      duration,
      keepAfterRouteChange: false,
    });
  }

  baseInfo(message: string, destination: string = '', duration: number = 2000) {
    this.baseAlert({
      type: AlertType.Info,
      message,
      destination,
      duration,
      keepAfterRouteChange: false,
    });
  }

  baseWarn(message: string, destination: string = '', duration: number = 2000) {
    this.baseAlert({
      type: AlertType.Warning,
      message,
      destination,
      duration,
      keepAfterRouteChange: false,
    });
  }

  baseError(message: string, destination: string = '', duration: number = 2000) {
    this.baseAlert({
      type: AlertType.Error,
      message,
      destination,
      duration,
      keepAfterRouteChange: false,
    });
  }

  baseAlert(alert: Alert) {
    if (alert.duration) {
      this.duration.next(alert.duration);
    }
    this.keepAfterRouteChange = alert.keepAfterRouteChange;
    this.subject.next({
      ...alert,
      typeName: this.cssAlertType(alert),
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

  clear() {
    // clear alerts
    this.subject.next();
  }
}
