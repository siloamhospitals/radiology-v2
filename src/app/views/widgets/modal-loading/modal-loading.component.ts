import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-modal-loading',
  templateUrl: './modal-loading.component.html',
  styleUrls: ['./modal-loading.component.css']
})
export class ModalLoadingComponent implements OnInit {

  @Input() modalTitle: string = 'Proses Loading'
  @Input() modalSuccess: TemplateRef<any>
  @Input() modalError: TemplateRef<any>
  @Input() loadingText: string = 'Proses sedang berjalan... Mohon menunggu...'
  
  isLoading: boolean = false
  isError: boolean = false

  constructor() { }

  ngOnInit() {
    this.isLoading = true
  }

}
