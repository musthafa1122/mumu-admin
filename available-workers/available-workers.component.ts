import {Component, OnInit} from '@angular/core';
import {MaterialModule} from "../../material.module";
import {TablerIconsModule} from "angular-tabler-icons";
import {CommonModule} from "@angular/common";

interface UserCard {
  id: number;
  imgSrc: string;
  name: string;
  profession: string;
  address: string;
  phone: string;
  serviceType: 'driver' | 'errands' | 'bystander';
}

@Component({
  selector: 'app-available-workers',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, CommonModule],
  templateUrl: './available-workers.component.html',
  styleUrl: './available-workers.component.scss'
})

export class AvailableWorkersComponent implements OnInit {
  public driversCount = 0
  public errandsCount = 0
  public bystandersCount = 0
  public userCards: UserCard[] = [
    {
      id: 1,
      imgSrc: 'assets/images/profile/user-2.jpg',
      name: 'Johnathan Doe',
      profession: 'Driver',
      address: '795 Folsom Ave, NY, 10003',
      phone: '(123) 456-7890',
      serviceType: 'driver',
    },
    {
      id: 2,
      imgSrc: 'assets/images/profile/user-4.jpg',
      name: 'George Johnson',
      profession: 'Errand Runner',
      address: '36 W 138th St, NY, 10037',
      phone: '(212) 234-0783',
      serviceType: 'errands',
    },
    {
      id: 3,
      imgSrc: 'assets/images/profile/user-2.jpg',
      name: 'Sarah Connor',
      profession: 'Bystander for Patient',
      address: '123 Main St, San Francisco, CA, 94105',
      phone: '(415) 987-6543',
      serviceType: 'bystander',
    },
    {
      id: 4,
      imgSrc: 'assets/images/profile/user-4.jpg',
      name: 'Michael Scott',
      profession: 'Driver',
      address: '1725 Slough Ave, Scranton, PA, 18505',
      phone: '(570) 555-0000',
      serviceType: 'driver',
    },
    {
      id: 5,
      imgSrc: 'assets/images/profile/user-2.jpg',
      name: 'Dwight Schrute',
      profession: 'Errand Runner',
      address: '1855 Beet Farm Rd, Scranton, PA, 18505',
      phone: '(570) 555-5555',
      serviceType: 'errands',
    },
    {
      id: 6,
      imgSrc: 'assets/images/profile/user-4.jpg',
      name: 'Pam Beesly',
      profession: 'Bystander for Elderly',
      address: '1725 Slough Ave, Scranton, PA, 18505',
      phone: '(570) 555-1212',
      serviceType: 'bystander',
    },
    {
      id: 7,
      imgSrc: 'assets/images/profile/user-2.jpg',
      name: 'Jim Halpert',
      profession: 'Driver',
      address: '1725 Slough Ave, Scranton, PA, 18505',
      phone: '(570) 555-2222',
      serviceType: 'driver',
    },
    {
      id: 8,
      imgSrc: 'assets/images/profile/user-4.jpg',
      name: 'Stanley Hudson',
      profession: 'Errand Runner',
      address: '1725 Slough Ave, Scranton, PA, 18505',
      phone: '(570) 555-3333',
      serviceType: 'errands',
    },
    {
      id: 9,
      imgSrc: 'assets/images/profile/user-2.jpg',
      name: 'Phyllis Vance',
      profession: 'Bystander for Elderly',
      address: '1725 Slough Ave, Scranton, PA, 18505',
      phone: '(570) 555-4444',
      serviceType: 'bystander',
    },
    {
      id: 10,
      imgSrc: 'assets/images/profile/user-4.jpg',
      name: 'Angela Martin',
      profession: 'Driver',
      address: '1725 Slough Ave, Scranton, PA, 18505',
      phone: '(570) 555-5550',
      serviceType: 'driver',
    },
    {
      id: 11,
      imgSrc: 'assets/images/profile/user-2.jpg',
      name: 'Kevin Malone',
      profession: 'Errand Runner',
      address: '1725 Slough Ave, Scranton, PA, 18505',
      phone: '(570) 555-6666',
      serviceType: 'errands',
    },
  ];
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
