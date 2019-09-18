import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EldialogComponent } from './eldialog.component';

describe('EldialogComponent', () => {
  let component: EldialogComponent;
  let fixture: ComponentFixture<EldialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EldialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EldialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
