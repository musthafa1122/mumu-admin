import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {UserCard} from "../../available-workers/constants";
import {CommonModule, DatePipe, DecimalPipe} from "@angular/common";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Appearance} from "@angular-material-extensions/google-maps-autocomplete";
import {Router} from "@angular/router";
import {MaterialModule} from "../../../material.module";
import {JobProposalHelper} from "../job-proposals.helper";
import {ServiceOrderData} from "../../order-history/order-history.service";

@Component({
  selector: 'app-job-proposals-table-view',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    CommonModule, MaterialModule],
  templateUrl: './job-proposals-table-view.component.html',
  styleUrl: './job-proposals-table-view.component.scss'
})
export class JobProposalsTableViewComponent implements OnInit, AfterViewInit {
  @Input() data!: UserCard[];
  public appearance = Appearance;
  displayedColumns: string[] = [
    'image',
    'name',
    'address',
    'phone',
    'rating',
    'action',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  serviceOrders: ServiceOrderData[] = [];
  dataSource!: MatTableDataSource<UserCard>;

  constructor(private router: Router, private jobProposalHelper: JobProposalHelper) {
  }

  ngOnInit(): void {
    console.log(this.data)
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit(): void {
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

  getStars(rating: number): string[] {
    return this.jobProposalHelper.getStars(rating);
  }
}
