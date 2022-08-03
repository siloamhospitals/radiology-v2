import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// @ts-ignore
import Security from 'msm-kadapat';
// @ts-ignore
import * as io from 'socket.io-client';

import {
  SecretKey,
  Jwt,
  keySocket,
} from '../variables/common.variable';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  radSocket: any;

  readonly url = new URL(environment.WEB_SOCKET_SERVICE);

  constructor() {
    this.radSocket = this.setConfigSocket(keySocket.RADIOLOGY, environment.CALL_CENTER_SERVICE);
  }

  setConfigSocket(namespace: any, source: any) {
    return io(`${this.url.origin}${namespace}`, {
      transports: ['websocket'],
      path: `${this.url.pathname === '/' ? '' : this.url.pathname}/socket.io`,
      query: `data=${Security.encrypt({ secretKey: SecretKey },
      Jwt)}&url=${source}`});
  }

  radiologySocket(eventName: string): Observable<any> {
    return new Observable((subcriber) => {
      this.radSocket.on(eventName, (data: any) => {
        subcriber.next(data);
      });
    });
  }

  radiologySockets(eventNames: string[]): Observable<any> {
    return new Observable((subcriber) => {
      for (let event of eventNames) {
        this.radSocket.on(event, (data: any) => {
          subcriber.next(data);
        });
      }
    });
  }
}
