import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalityTabComponent } from './widget-modality-tab.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ModalityTabModule} from './widget-modality-tab.module';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


describe('ModalityTabComponent', () => {
  let component: ModalityTabComponent;
  let fixture: ComponentFixture<ModalityTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ModalityTabModule,
      ],
      providers: [
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalityTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
