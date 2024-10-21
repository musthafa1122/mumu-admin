import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {NgForOf} from "@angular/common";
import {UserCard} from "../constants";
import {MatIcon} from "@angular/material/icon";
import {JobProposalHelper} from "../../job-proposals/job-proposals.helper";

@Component({
  selector: 'app-workers',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatDivider,
    NgForOf,
    MatIcon,
  ],
  templateUrl: './workers.component.html',
  styleUrl: './workers.component.scss'
})
export class WorkersComponent implements OnChanges {
  @Input() data!: UserCard[];
  filteredCards!: UserCard[];

  constructor(private jobProposalHelper: JobProposalHelper) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.filteredCards = changes['data'].currentValue;
  }

  getStars(rating: number): string[] {
    return this.jobProposalHelper.getStars(rating);
  }

}
