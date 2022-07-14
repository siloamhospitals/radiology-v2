import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { NgbAlertModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalModalityComponent } from './modal-modality.component';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ModalModalityComponent', () => {
  let component: ModalModalityComponent;
  let fixture: ComponentFixture<ModalModalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalModalityComponent ],
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
    fixture = TestBed.createComponent(ModalModalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
