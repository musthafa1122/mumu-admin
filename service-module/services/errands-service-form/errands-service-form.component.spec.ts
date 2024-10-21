import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrandsServiceFormComponent } from './errands-service-form.component';

describe('ErrandsServiceFormComponent', () => {
  let component: ErrandsServiceFormComponent;
  let fixture: ComponentFixture<ErrandsServiceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrandsServiceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrandsServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
