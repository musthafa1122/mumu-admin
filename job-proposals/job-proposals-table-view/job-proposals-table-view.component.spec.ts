import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobProposalsTableViewComponent } from './job-proposals-table-view.component';

describe('JobProposalsTableViewComponent', () => {
  let component: JobProposalsTableViewComponent;
  let fixture: ComponentFixture<JobProposalsTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobProposalsTableViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobProposalsTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
