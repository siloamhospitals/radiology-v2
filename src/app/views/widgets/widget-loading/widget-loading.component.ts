import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './widget-loading.component.html',
  styleUrls: ['./widget-loading.component.css']
})

export class LoadingComponent {
  @Input() showLoad: boolean;
  @Input() width: number = 80;
  @Input() class: string = '';
}
