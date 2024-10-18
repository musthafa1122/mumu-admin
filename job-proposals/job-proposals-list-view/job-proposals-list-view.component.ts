import {Component, inject, Input} from '@angular/core';
import {MaterialModule} from "../../../material.module";
import {UserCard} from "../../available-workers/constants";
import {CommonModule} from "@angular/common";
import {JobProposalHelper} from "../job-proposals.helper";
import {MiniChatComponent} from "../../chat-application/mini-chat/mini-chat.component";
import {TablerIconsModule} from "angular-tabler-icons";
import {WorkerProfileComponent} from "../../available-workers/worker-profile/worker-profile.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-job-proposals-list-view',
  standalone: true,
  imports: [MaterialModule, CommonModule, MiniChatComponent, TablerIconsModule],
  templateUrl: './job-proposals-list-view.component.html',
  styleUrl: './job-proposals-list-view.component.scss'
})
export class JobProposalsListViewComponent {
  @Input() data!: UserCard[];
  readonly dialog = inject(MatDialog);

  constructor(private jobProposalHelper: JobProposalHelper) {
  }

  getStars(rating: number): string[] {
    return this.jobProposalHelper.getStars(rating);
  }

  openDialog() {
    const dialogConfig = {
      width: '80%',  // Set the desired width
      height: '80%', // Set the desired height
    };

    this.dialog.open(WorkerProfileComponent, dialogConfig);

  }
}
