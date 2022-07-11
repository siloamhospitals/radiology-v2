import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLoginComponent } from './page-login.component';
import { WidgetLoginComponent} from '../../widgets/widget-login/widget-login.component';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('PageLoginComponent', () => {
  let component: PageLoginComponent;
  let fixture: ComponentFixture<PageLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageLoginComponent, WidgetLoginComponent ],
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
    fixture = TestBed.createComponent(PageLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
