import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {Apollo, gql} from 'apollo-angular';
import {Appearance, MatGoogleMapsAutocompleteModule} from '@angular-material-extensions/google-maps-autocomplete';
import {MaterialModule} from "../../material.module";
import {CommonModule} from '@angular/common';
import {TablerIconsModule} from 'angular-tabler-icons';
import {Router} from "@angular/router";
import {ServiceStatusComponent} from "../../components/service-status/service-status.component";
import {ServiceStatus} from "../available-workers/constants";

// GraphQL Query
export const GET_SERVICE_ORDERS = gql`
  query Query {
    serviceOrders {
    id
      dateRequested
      duration
      email
      imageUrl
      location
      orderId
      orderType
      salary
      serviceType
      specialNotes
      status
      title
      user {
      id
      firstName
      lastName
      email
      country
      phoneNumber
      state
      city
      dob
      gender
      password
      emailVerified
      phoneNumberVerified
    }
    }
  }
`;

// Service Order Data Interface
export interface ServiceOrderData {
  id: number;
  serviceType: string;
  title: string;
  location: string;
  dateRequested: string;
  salary: number;
  orderType: string;
  duration: string;
  status: ServiceStatus;
  imageUrl?: string;
  specialNotes?: string;
  email: string;

}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    CommonModule,
    MatSortModule,
    MatGoogleMapsAutocompleteModule,
    ServiceStatusComponent
  ],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements AfterViewInit, OnInit {
  public appearance = Appearance;

  displayedColumns: string[] = [
    'image',
    'serviceType',
    'location',
    'dateRequested',
    'salary',
    'orderType',
    'duration',
    'status',
    'action',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  serviceOrders: ServiceOrderData[] = [];
  dataSource!: MatTableDataSource<ServiceOrderData>;

  constructor(private apollo: Apollo, private router: Router,) {
  }

  ngOnInit(): void {
    // Fetch service orders via Apollo GraphQL query
    this.apollo
      .watchQuery<{ serviceOrders: ServiceOrderData[] }>({
        query: GET_SERVICE_ORDERS,
      })
      .valueChanges.subscribe((result) => {
      this.serviceOrders = result?.data?.serviceOrders || [];
      this.dataSource = new MatTableDataSource(this.serviceOrders);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit(): void {
    // Ensure that paginator and sort are assigned after view is initialized
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyForJob(orderID: number): void {
    console.log(`Applying for job with ID: ${orderID}`);
    this.router.navigate([`service-home/service-order-details/${orderID}`]);
  }
}
