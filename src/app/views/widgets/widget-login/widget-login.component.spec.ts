import { async, ComponentFixture,  TestBed } from '@angular/core/testing';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { WidgetLoginComponent } from './widget-login.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
// import { failedLoginResponse, successLoginResponse } from '../../../app/mocks/login';
import { failedLoginResponse, successLoginResponse } from '../../../mocks/login';
import { of } from 'rxjs';


describe('WidgetLoginComponent', () => {
  let component: WidgetLoginComponent;
  let fixture: ComponentFixture<WidgetLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetLoginComponent ],
      imports: [
        HttpClientModule,
        FormsModule,
        NgbModule,
        RouterTestingModule.withRoutes([])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetLoginComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`Should login successfully`, () => {

    component.model.username = 'albert.aswindra';
    component.model.password = 'Siloam2021';

    const login = spyOn(component.userService, 'signIn').and.returnValue(of(successLoginResponse));

    fixture.detectChanges();
    expect(login().value.message).toContain(`Success`);
  });


  it(`Should login failed`, () => {

    component.model.username = 'albert.aswindra';
    component.model.password = 'xxxxx';

    const login = spyOn(component.userService, 'signIn').and.returnValue(of(failedLoginResponse));

    fixture.detectChanges();
    expect(login().value.message).toContain(`incorrect`);
  });
});
