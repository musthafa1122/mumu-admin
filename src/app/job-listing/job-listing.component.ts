import {Component, OnInit} from '@angular/core';
import {NgScrollbarModule} from "ngx-scrollbar";
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {Apollo, gql} from "apollo-angular";
import {ActivatedRoute} from "@angular/router";
import {ServiceOrderData} from "../../../order-history/order-history.service";
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardFooter} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";

export const GET_SERVICE_ORDERS = gql`
  query Query {
  serviceOrders {
    id
    orderId
    serviceType
    title
    location
    dateRequested
    salary
    orderType
    duration
    status
    imageUrl
    specialNotes
    email
  }
}
`;

@Component({
  selector: 'app-job-listing',
  standalone: true,
  imports: [
    NgScrollbarModule,
    MatDrawerContainer,
    MatIcon,
    MatDrawer,
    NgForOf,
    NgIf,
    CurrencyPipe,
    NgClass,
    DatePipe,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatFormField,
    MatInput,
    MatLabel,
    FormsModule,
  ],
  templateUrl: './job-listing.component.html',
  styleUrl: './job-listing.component.scss'
})
export class JobListingComponent implements OnInit {
  public serviceOrders!: ServiceOrderData[];
  public selectedJob: ServiceOrderData | null = null;
  public filteredServiceOrders: ServiceOrderData[] = []; // Add filtered orders
  public searchQuery: string = '';

  constructor(private apollo: Apollo, private route: ActivatedRoute,) {
  }

  filterServiceOrders(): void {
    this.filteredServiceOrders = this.serviceOrders.filter(job =>
      job.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      job.serviceType.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  applyJob(): void {
    // Logic to apply for the job
    console.log('Applying for the job:', this.selectedJob);
  }

  cancel(): void {
    // Logic to cancel the action
    console.log('Cancelled the job application');
  }

  selectJob(job: ServiceOrderData): void {
    this.selectedJob = job; // Set the selected job
  }

  ngOnInit(): void {
    this.fetchOrderDetails()
  }

  fetchOrderDetails(): void {
    this.apollo
      .watchQuery({
        query: GET_SERVICE_ORDERS,
      })
      .valueChanges.subscribe((result: any) => {
      this.serviceOrders = result?.data?.serviceOrders;
      this.filteredServiceOrders = this.serviceOrders; // Initialize filtered list
      this.selectedJob = this.serviceOrders[0]
    });
  }
}
