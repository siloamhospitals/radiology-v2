import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-detail-schedule',
  templateUrl: './modal-detail-schedule.component.html',
  styleUrls: ['./modal-detail-schedule.component.css']
})
export class ModalDetailScheduleComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }
}
