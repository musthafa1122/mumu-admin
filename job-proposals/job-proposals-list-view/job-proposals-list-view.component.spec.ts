import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobProposalsListViewComponent } from './job-proposals-list-view.component';

describe('JobProposalsListViewComponent', () => {
  let component: JobProposalsListViewComponent;
  let fixture: ComponentFixture<JobProposalsListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobProposalsListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobProposalsListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
