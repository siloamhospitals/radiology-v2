import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modality-tab',
  templateUrl: './widget-modality-tab.component.html',
  styleUrls: ['./widget-modality-tab.component.css']
})

export class ModalityTabComponent implements OnInit  {
  @Input() showLoad: boolean;
  @Input() width: number = 80;
  @Input() class: string = '';
  router: any;


  constructor(route:Router) {
    this.router = route.url;
  }

  ngOnInit() {
    console.log(this.router )
  }

}


