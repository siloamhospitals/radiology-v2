import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './widget-loading.component.html',
  styleUrls: ['./widget-loading.component.css']
})

export class LoadingComponent implements OnInit {
  @Input() showLoad: boolean;
  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    // /setTimeout(this.setShowLoad, 5000)
  }

  public setShowLoad(){
    this.showLoad = false
  }

  public deleteData() {
    this.activeModal.close('OK');
  }

  public test() {
    this.activeModal.close('clear');
  }
}
