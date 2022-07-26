import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { NgbAlertModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMaintenanceComponent } from './modal-maintenance.component';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ModalMaintenanceComponent', () => {
  let component: ModalMaintenanceComponent;
  let fixture: ComponentFixture<ModalMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMaintenanceComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbAlertModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ],
      providers: [
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
