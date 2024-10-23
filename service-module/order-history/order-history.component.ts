import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Apollo} from 'apollo-angular';
import {Router} from '@angular/router';
import {OrderHistoryService, ServiceOrderData} from './order-history.service';
import {WORKERS} from '../available-workers/constants';

// Angular Material and other imports
import {MaterialModule} from '../../../material.module';
import {CommonModule} from '@angular/common';
import {TablerIconsModule} from 'angular-tabler-icons';
import {ServiceStatusComponent} from '../../../components/service-status/service-status.component';
import {
  JobProposalsListViewComponent
} from '../job-proposals/job-proposals-list-view/job-proposals-list-view.component';
import {
  JobProposalsTableViewComponent
} from '../job-proposals/job-proposals-table-view/job-proposals-table-view.component';
import {OrderHistoryCardViewComponent} from './order-history-card-view/order-history-card-view.component';
import {FormsModule} from '@angular/forms';
import {Appearance, MatGoogleMapsAutocompleteModule} from '@angular-material-extensions/google-maps-autocomplete';

// Interface for map service orders
interface MapServiceOrders {
  image: string;
  serviceType: string;
  location: string;
  dateRequested: Date | string;
  salary: string | number;
  orderType: string;
  duration: string;
  status: string;
  action: string;
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    CommonModule,
    MatSort,
    MatGoogleMapsAutocompleteModule,
    ServiceStatusComponent,
    JobProposalsListViewComponent,
    JobProposalsTableViewComponent,
    OrderHistoryCardViewComponent,
    FormsModule
  ],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements AfterViewInit, OnInit {
  public appearance = Appearance;

  displayedColumns: string[] = [
    'image',
    'serviceType',
    'dateRequested',
    'salary',
    'orderType',
    'duration',
    'status',
    'action'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<MapServiceOrders>;

  mapServiceOrders: MapServiceOrders[] = [];
  serviceOrders: ServiceOrderData[] = [];
  isCardView = false;
  protected readonly workers = WORKERS;

  constructor(
    private apollo: Apollo,
    private router: Router,
    private orderHistoryService: OrderHistoryService
  ) {
  }

  ngOnInit(): void {
    this.loadServiceOrders();
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  // Filter the table data
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Navigate to the job details page
  applyForJob(orderID: number): void {
    this.router.navigate([`service-home/service-order-details/${orderID}`]);
  }

  // Load service orders and map to the table structure
  private loadServiceOrders(): void {
    this.orderHistoryService.getServiceHistory('6708df417f34f8c4c3df65da').subscribe((result: any) => {
      this.serviceOrders = result?.data?.serviceOrderByUserId || [];
      this.mapServiceOrders = this.mapOrdersToTableData(this.serviceOrders);
      this.dataSource = new MatTableDataSource(this.mapServiceOrders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  // Helper method to map service orders to table data
  private mapOrdersToTableData(orders: ServiceOrderData[]): MapServiceOrders[] {
    return orders.map(order => ({
      image: order.service?.imgSrc || 'default-image.jpg',
      serviceType: order.service?.title || 'Unknown Service',
      location: order.pickupLocation?.placeName || 'Not specified',
      dateRequested: order.fromDate || 'N/A',
      salary: order.service?.negotiatedPrice || order.service?.price || 'N/A',
      orderType: order.bookingType || 'N/A',
      duration: order.duration || 'N/A',
      status: order.status || 'N/A',
      action: 'View',
    }));
  }
}
