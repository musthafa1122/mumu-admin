import {Component} from '@angular/core';
import {WORKERS} from "../available-workers/constants";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {NgIf} from "@angular/common";
import {OrderHistoryComponent} from "../order-history/order-history.component";
import {WorkersComponent} from "../available-workers/workers/workers.component";
import {FormsModule} from "@angular/forms";
import {JobProposalsListViewComponent} from "./job-proposals-list-view/job-proposals-list-view.component";
import {JobProposalsTableViewComponent} from "./job-proposals-table-view/job-proposals-table-view.component";

@Component({
  selector: 'app-job-proposals',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatSlideToggle,
    NgIf,
    OrderHistoryComponent,
    WorkersComponent,
    FormsModule,
    JobProposalsListViewComponent,
    JobProposalsTableViewComponent
  ],
  templateUrl: './job-proposals.component.html',
  styleUrl: './job-proposals.component.scss'
})
export class JobProposalsComponent {

  isTableView: any;
  protected readonly workers = WORKERS;
}
