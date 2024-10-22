import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceConfirmationPopupComponent } from './price-confirmation-popup.component';

describe('PriceConfirmationPopupComponent', () => {
  let component: PriceConfirmationPopupComponent;
  let fixture: ComponentFixture<PriceConfirmationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceConfirmationPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceConfirmationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
