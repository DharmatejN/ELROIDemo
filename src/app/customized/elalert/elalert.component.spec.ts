import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElalertComponent } from './elalert.component';

describe('ElalertComponent', () => {
  let component: ElalertComponent;
  let fixture: ComponentFixture<ElalertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElalertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElalertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
