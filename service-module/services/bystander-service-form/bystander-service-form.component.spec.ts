import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BystanderServiceFormComponent } from './bystander-service-form.component';

describe('BystanderServiceFormComponent', () => {
  let component: BystanderServiceFormComponent;
  let fixture: ComponentFixture<BystanderServiceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BystanderServiceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BystanderServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
