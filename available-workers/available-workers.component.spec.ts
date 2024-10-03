import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableWorkersComponent } from './available-workers.component';

describe('AvailableWorkersComponent', () => {
  let component: AvailableWorkersComponent;
  let fixture: ComponentFixture<AvailableWorkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableWorkersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableWorkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
