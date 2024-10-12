import {Component, OnInit} from '@angular/core';
import {MaterialModule} from "../../material.module";
import {TablerIconsModule} from "angular-tabler-icons";
import {CommonModule} from "@angular/common";
import {WorkersComponent} from "./workers/workers.component";
import {UserCard, WORKERS} from "./constants";

@Component({
  selector: 'app-available-workers',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, CommonModule, WorkersComponent],
  templateUrl: './available-workers.component.html',
  styleUrl: './available-workers.component.scss'
})

export class AvailableWorkersComponent implements OnInit {
  public driversCount = 0
  public errandsCount = 0
  public bystandersCount = 0
  public userCards = WORKERS
  filteredCards!: UserCard[];

  ngOnInit(): void {
    this.filteredCards = this.userCards;
    this.bystandersCount = this.userCards.filter(data => data.serviceType === 'bystander').length;
    this.driversCount = this.userCards.filter(data => data.serviceType === 'driver').length;
    this.errandsCount = this.userCards.filter(data => data.serviceType === 'errands').length;
  }


  // Function to filter user cards based on the search term
  applyFilter(event: KeyboardEvent) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();

    this.filteredCards = this.userCards.filter(userCard =>
      userCard.name.toLowerCase().includes(searchTerm) ||
      userCard.profession.toLowerCase().includes(searchTerm) ||
      userCard.address.toLowerCase().includes(searchTerm)
    );
  }

  clickFilter(serviceType: 'driver' | 'errands' | 'bystander' | null) {
    if (serviceType !== null) {
      this.filteredCards = this.userCards.filter(card => card.serviceType === serviceType);
    } else {
      this.filteredCards = this.userCards;
    }

  }
}
