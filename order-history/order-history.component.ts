import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {Apollo} from 'apollo-angular';
import {Appearance, MatGoogleMapsAutocompleteModule} from '@angular-material-extensions/google-maps-autocomplete';
import {MaterialModule} from "../../material.module";
import {CommonModule} from '@angular/common';
import {TablerIconsModule} from 'angular-tabler-icons';
import {Router} from "@angular/router";
import {ServiceStatusComponent} from "../../components/service-status/service-status.component";
import {OrderHistoryService, ServiceOrderData} from "./order-history.service";


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

  constructor(private apollo: Apollo, private router: Router, private orderHistoryService: OrderHistoryService,) {
  }

  ngOnInit(): void {
    this.orderHistoryService.getServiceHistory('6708df417f34f8c4c3df65da').subscribe((result: any) => {
      console.log(result);
      this.serviceOrders = result?.data?.serviceOrderByUserId || [];
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
