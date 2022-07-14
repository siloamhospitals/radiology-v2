import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalConfirmDeleteComponent } from './modal-confirm-delete.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ModalConfirmDeleteModule} from './modal-confirm-delete.module';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


describe('ModalConfirmDeleteComponent', () => {
  let component: ModalConfirmDeleteComponent;
  let fixture: ComponentFixture<ModalConfirmDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ModalConfirmDeleteModule,
      ],
      providers: [
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
