import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageQueueManagementComponent } from './page-queue-management.component';

describe('PageQueueManagementComponent', () => {
  let component: PageQueueManagementComponent;
  let fixture: ComponentFixture<PageQueueManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageQueueManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageQueueManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
