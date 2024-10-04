import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {NgApexchartsModule} from 'ng-apexcharts';
import {TablerIconsModule} from 'angular-tabler-icons';
import {CommonModule} from '@angular/common';
import {MaterialModule} from "../../material.module";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";

interface ServiceOrderData {
  orderId: number;
  serviceType: string;
  title: string; // Service name or title (e.g., Plumber, Hospital Bystander)
  location: string;
  dateRequested: string;
  salary: number; // For bystanders or drivers (can be 0 for errands if unpaid)
  orderType: string; // e.g., Contract, Part-time, etc.
  duration: string; // e.g., 1 Day, 2 Weeks, etc.
  status: string; // e.g., Available, Completed, In Progress
  imageUrl?: string; // Optional service image
  specialNotes?: string; // Optional additional info for each service
}

const ELEMENT_DATA: ServiceOrderData[] = [
  {
    orderId: 1,
    serviceType: 'Driver',
    title: 'Driver - SafeDrive Rentals',
    location: 'Bangalore, India',
    dateRequested: '2024-09-30',
    salary: 1200,
    orderType: 'Part-time',
    duration: '1 Week',
    status: 'Available',
    imageUrl: 'assets/images/products/s4.jpg',
  },
  {
    orderId: 2,
    serviceType: 'Bystander',
    title: 'Hospital Bystander - Elderly Care',
    location: 'New Delhi, India',
    dateRequested: '2024-10-01',
    salary: 1500,
    orderType: 'Contract',
    duration: '2 Days',
    status: 'Completed',
    imageUrl: 'assets/images/products/s5.jpg',
  },
  {
    orderId: 3,
    serviceType: 'Errands',
    title: 'Grocery Shopping',
    location: 'Mumbai, India',
    dateRequested: '2024-09-28',
    salary: 0, // Unpaid for errands
    orderType: 'One-time',
    duration: '1 Day',
    status: 'In Progress',
    imageUrl: 'assets/images/products/s6.jpg',
    specialNotes: 'Handle with care - Perishable items',
  },
  {
    orderId: 1,
    serviceType: 'Driver',
    title: 'Driver - SafeDrive Rentals',
    location: 'Bangalore, India',
    dateRequested: '2024-09-30',
    salary: 1200,
    orderType: 'Part-time',
    duration: '1 Week',
    status: 'Available',
    imageUrl: 'assets/images/products/s4.jpg',
  },
  {
    orderId: 2,
    serviceType: 'Bystander',
    title: 'Hospital Bystander - Elderly Care',
    location: 'New Delhi, India',
    dateRequested: '2024-10-01',
    salary: 1500,
    orderType: 'Contract',
    duration: '2 Days',
    status: 'Completed',
    imageUrl: 'assets/images/products/s5.jpg',
  },
  {
    orderId: 3,
    serviceType: 'Errands',
    title: 'Grocery Shopping',
    location: 'Mumbai, India',
    dateRequested: '2024-09-28',
    salary: 0, // Unpaid for errands
    orderType: 'One-time',
    duration: '1 Day',
    status: 'In Progress',
    imageUrl: 'assets/images/products/s6.jpg',
    specialNotes: 'Handle with care - Perishable items',
  },
  {
    orderId: 1,
    serviceType: 'Driver',
    title: 'Driver - SafeDrive Rentals',
    location: 'Bangalore, India',
    dateRequested: '2024-09-30',
    salary: 1200,
    orderType: 'Part-time',
    duration: '1 Week',
    status: 'Available',
    imageUrl: 'assets/images/products/s4.jpg',
  },
  {
    orderId: 2,
    serviceType: 'Bystander',
    title: 'Hospital Bystander - Elderly Care',
    location: 'New Delhi, India',
    dateRequested: '2024-10-01',
    salary: 1500,
    orderType: 'Contract',
    duration: '2 Days',
    status: 'Completed',
    imageUrl: 'assets/images/products/s5.jpg',
  },
  {
    orderId: 3,
    serviceType: 'Errands',
    title: 'Grocery Shopping',
    location: 'Mumbai, India',
    dateRequested: '2024-09-28',
    salary: 0, // Unpaid for errands
    orderType: 'One-time',
    duration: '1 Day',
    status: 'In Progress',
    imageUrl: 'assets/images/products/s6.jpg',
    specialNotes: 'Handle with care - Perishable items',
  },
  {
    orderId: 1,
    serviceType: 'Driver',
    title: 'Driver - SafeDrive Rentals',
    location: 'Bangalore, India',
    dateRequested: '2024-09-30',
    salary: 1200,
    orderType: 'Part-time',
    duration: '1 Week',
    status: 'Available',
    imageUrl: 'assets/images/products/s4.jpg',
  },
  {
    orderId: 2,
    serviceType: 'Bystander',
    title: 'Hospital Bystander - Elderly Care',
    location: 'New Delhi, India',
    dateRequested: '2024-10-01',
    salary: 1500,
    orderType: 'Contract',
    duration: '2 Days',
    status: 'Completed',
    imageUrl: 'assets/images/products/s5.jpg',
  },
  {
    orderId: 3,
    serviceType: 'Errands',
    title: 'Grocery Shopping',
    location: 'Mumbai, India',
    dateRequested: '2024-09-28',
    salary: 0, // Unpaid for errands
    orderType: 'One-time',
    duration: '1 Day',
    status: 'In Progress',
    imageUrl: 'assets/images/products/s6.jpg',
    specialNotes: 'Handle with care - Perishable items',
  }, {
    orderId: 1,
    serviceType: 'Driver',
    title: 'Driver - SafeDrive Rentals',
    location: 'Bangalore, India',
    dateRequested: '2024-09-30',
    salary: 1200,
    orderType: 'Part-time',
    duration: '1 Week',
    status: 'Available',
    imageUrl: 'assets/images/products/s4.jpg',
  },
  {
    orderId: 2,
    serviceType: 'Bystander',
    title: 'Hospital Bystander - Elderly Care',
    location: 'New Delhi, India',
    dateRequested: '2024-10-01',
    salary: 1500,
    orderType: 'Contract',
    duration: '2 Days',
    status: 'Completed',
    imageUrl: 'assets/images/products/s5.jpg',
  },
  {
    orderId: 3,
    serviceType: 'Errands',
    title: 'Grocery Shopping',
    location: 'Mumbai, India',
    dateRequested: '2024-09-28',
    salary: 0, // Unpaid for errands
    orderType: 'One-time',
    duration: '1 Day',
    status: 'In Progress',
    imageUrl: 'assets/images/products/s6.jpg',
    specialNotes: 'Handle with care - Perishable items',
  },

  // More data...
];

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    NgApexchartsModule,
    MaterialModule,
    TablerIconsModule,
    CommonModule,
    MatSortModule
  ],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'image',
    'serviceType',
    'location',
    'dateRequested',
    'salary',
    'orderType',
    'duration',
    'status',
    'action'
  ];

  dataSource = new MatTableDataSource<ServiceOrderData>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  applyFilter(event: any): void {
    this.dataSource.filter = event?.target?.value?.trim().toLowerCase();
  }

  applyForJob(jobId: number): void {
    console.log(`Applying for job with ID: ${jobId}`);
  }
}
