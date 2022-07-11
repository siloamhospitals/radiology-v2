import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHeaderComponent } from './section-header.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('SectionHeaderComponent', () => {
  let component: SectionHeaderComponent;
  let fixture: ComponentFixture<SectionHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionHeaderComponent ],
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // tslint:disable-next-line:max-line-length
    spyOn(window.localStorage, 'getItem').and.returnValue(`{"user":{"id":"da8a3656-5eeb-4f87-80c8-f9ea9d6c3acd","username":"albert.aswindra","fullname":"albert aswindra"},"hospital":{"id":"39764039-37b9-4176-a025-ef7b2e124ba4","orgId":2,"name":"Siloam Hospitals Lippo Village","alias":"SHLV","zone":7,"isBpjs":true,"isBridging":true},"collection":[{"id":"39764039-37b9-4176-a025-ef7b2e124ba4","orgId":2,"name":"Siloam Hospitals Lippo Village","alias":"SHLV","zone":7,"isBpjs":true,"isBridging":true}]}`);
    fixture = TestBed.createComponent(SectionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
