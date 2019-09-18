import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElconfirmComponent } from './elconfirm.component';

describe('ElconfirmComponent', () => {
  let component: ElconfirmComponent;
  let fixture: ComponentFixture<ElconfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElconfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElconfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
