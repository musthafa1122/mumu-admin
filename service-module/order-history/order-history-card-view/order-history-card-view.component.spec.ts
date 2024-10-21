import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoryCardViewComponent } from './order-history-card-view.component';

describe('OrderHistoryCardViewComponent', () => {
  let component: OrderHistoryCardViewComponent;
  let fixture: ComponentFixture<OrderHistoryCardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderHistoryCardViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderHistoryCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
