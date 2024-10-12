import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {NgForOf} from "@angular/common";
import {UserCard} from "../constants";

@Component({
  selector: 'app-workers',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatDivider,
    NgForOf
  ],
  templateUrl: './workers.component.html',
  styleUrl: './workers.component.scss'
})
export class WorkersComponent implements OnChanges {
  @Input() data!: UserCard[];
  filteredCards!: UserCard[];

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.filteredCards = changes['data'].currentValue;
  }


}
