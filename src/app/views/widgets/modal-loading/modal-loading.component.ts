import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-modal-loading',
  templateUrl: './modal-loading.component.html',
  styleUrls: ['./modal-loading.component.css']
})
export class ModalLoadingComponent implements OnInit {

  @Input() modalTitle: string = 'Proses Loading'
  @Input() modalSuccess: TemplateRef<any>
  @Input() modalError: TemplateRef<any>
  @Input() postDelay: number = 500 // 500ms
  @Input() success: Function
  @Input() error: Function
  @Input() loadingText: string = 'Proses sedang berjalan... Mohon menunggu...'
  
  isLoading: boolean = false
  isError: boolean = false

  constructor(
    config: NgbModalConfig,
    private activeModal: NgbActiveModal
  ) {
    config.keyboard = false
  }

  ngOnInit() {
    this.open()
  }

  async open () {
    const awaitLike = () => {
      return new Promise((resolve: any) => {
        setTimeout(() => {
          resolve()
        }, this.postDelay || 0)
      })
    }
    this.isLoading = true
    await awaitLike()
    // this.isLoading = false
    if (this.success) this.success({isLoading: this.isLoading, isError: this.isError})
  }

  close () {
    this.activeModal.close()
  }

}
