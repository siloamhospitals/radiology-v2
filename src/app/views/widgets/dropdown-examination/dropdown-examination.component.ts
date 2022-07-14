import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdown-examination',
  templateUrl: './dropdown-examination.component.html',
  styleUrls: ['./dropdown-examination.component.css']
})
export class DropdownExaminationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  keyword = 'name';
  data = [
     {
       id: 1,
       name: 'Usa'
     },
     {
       id: 2,
       name: 'England'
     }
  ];
 
 
  selectEvent(item: any) {
    // do something with selected item
    console.log('DropdownExaminationComponent', item)
  }
 
  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log('DropdownExaminationComponent', val)
  }
  
  onFocused(e: any){
    // do something when input is focused
    console.log('DropdownExaminationComponent', e)
  }


}
