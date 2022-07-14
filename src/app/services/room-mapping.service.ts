import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { httpOptions } from '../../app/utils/http.util';
import { RoomMapping } from '../models/room-mapping';

@Injectable({
  providedIn: 'root'
})
export class RoomMappingService {

  constructor(
    private http: HttpClient
  ) { }

  private getRoomActiveUrl = environment.OPADMIN_SERVICE+'/room-mappings/hospital';
  private getDoctorAssignedByDayUrl = environment.OPADMIN_SERVICE+'/schedules/hospital';
  private editRoomMappingUrl = environment.OPADMIN_SERVICE+'/room-mappings';

  editRoomMapping(hospital: string, roomMapping: string, isian: string): Observable<any> {
    let url = this.editRoomMappingUrl;
    let body = JSON.stringify(isian);
    url = `${url}/${roomMapping}/hospital/${hospital}`;
    return this.http.put(url, body, httpOptions);
  }

  getRoomsActive(hospital: string): Observable<any> {
    let url = this.getRoomActiveUrl;
    url = `${url}/${hospital}`;
    return this.http.get<RoomMapping[]>(url, httpOptions);
  }

  getRooms(hospital: string): Observable<any> {
    let url = this.getRoomActiveUrl;
    url = `${url}/${hospital}?all=true`;
    return this.http.get<RoomMapping[]>(url, httpOptions);
  }

  postRoomMapping(hospital: string, isian: string): Observable<any> {
    let url = this.getRoomActiveUrl;
    let body = JSON.stringify(isian);
    url = `${url}/${hospital}`;
    return this.http.post(url, body, httpOptions);
  }

  getRoomsFilter(hospital: string, floor?: string, wing?: string, room?: string): Observable<any> {
    let url = this.getRoomActiveUrl;
    url = `${url}/${hospital}?`;
    url = floor ? `${url}floorId=${floor}&` : url;
    url = wing ? `${url}wingId=${wing}&` : url;
    url = room ? `${url}roomId=${room}` : url;
    return this.http.get<RoomMapping[]>(url, httpOptions);
  }

  getDoctorScheduleAssignedByDay(hospital: string, day: number, floor: string, _?: string): Observable<any> {
    let url = this.getDoctorAssignedByDayUrl;
    url = `${url}/${hospital}?`;
    url = floor ? `${url}floorId=${floor}&` : url;
    url = day ? `${url}day=${day}` : url;
    return this.http.get<RoomMapping[]>(url, httpOptions);
  }
}
