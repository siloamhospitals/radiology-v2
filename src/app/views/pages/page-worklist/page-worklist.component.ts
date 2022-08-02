import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-worklist',
  templateUrl: './page-worklist.component.html',
  styleUrls: ['./page-worklist.component.css']
})
export class PageWorklistComponent implements OnInit {

  constructor() { }
  modalities = []
  isErrorTimer : boolean;
  
  ngOnInit() {
  }

}
