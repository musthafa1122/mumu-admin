import {Component, Input} from '@angular/core';
import {MaterialModule} from "../../../material.module";
import {UserCard} from "../../available-workers/constants";
import {CommonModule} from "@angular/common";
import {JobProposalHelper} from "../job-proposals.helper";

@Component({
  selector: 'app-job-proposals-list-view',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './job-proposals-list-view.component.html',
  styleUrl: './job-proposals-list-view.component.scss'
})
export class JobProposalsListViewComponent {
  @Input() data!: UserCard[];

  constructor(private jobProposalHelper: JobProposalHelper) {
  }

  getStars(rating: number): string[] {
    return this.jobProposalHelper.getStars(rating);
  }
}
