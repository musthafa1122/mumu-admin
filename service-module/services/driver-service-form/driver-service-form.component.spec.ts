import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverServiceFormComponent } from './driver-service-form.component';

describe('DriverServiceFormComponent', () => {
  let component: DriverServiceFormComponent;
  let fixture: ComponentFixture<DriverServiceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverServiceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
