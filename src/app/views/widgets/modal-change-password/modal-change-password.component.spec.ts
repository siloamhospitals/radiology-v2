import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { NgbAlertModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalChangePasswordComponent } from './modal-change-password.component';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ModalChangePasswordComponent', () => {
  let component: ModalChangePasswordComponent;
  let fixture: ComponentFixture<ModalChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalChangePasswordComponent ],
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
    fixture = TestBed.createComponent(ModalChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
