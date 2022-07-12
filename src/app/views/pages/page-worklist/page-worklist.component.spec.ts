import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageWorklistComponent } from './page-worklist.component';

describe('PageWorklistComponent', () => {
  let component: PageWorklistComponent;
  let fixture: ComponentFixture<PageWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
