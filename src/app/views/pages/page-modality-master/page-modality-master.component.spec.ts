import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageModalityMasterComponent } from './page-modality-master.component';

describe('PageModalityMasterComponent', () => {
  let component: PageModalityMasterComponent;
  let fixture: ComponentFixture<PageModalityMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageModalityMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageModalityMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
