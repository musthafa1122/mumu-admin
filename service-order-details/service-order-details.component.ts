import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MaterialModule} from "../../material.module";
import {TablerIconsModule} from "angular-tabler-icons";
import {AvailableWorkersComponent} from "../available-workers/available-workers.component";
import {WorkersComponent} from "../available-workers/workers/workers.component";
import {UserCard, WORKERS} from "../available-workers/constants";
import {NgIf} from "@angular/common";
import {ServiceOrderData} from "../order-history/order-history.component";
import {ActivatedRoute} from "@angular/router";
import {Apollo, gql} from 'apollo-angular';

export const GET_SERVICE_ORDERS_BY_ID = gql`
  query serviceOrderById($id: ID!) {
    serviceOrderById(id: $id) {
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
    }
  }
`;

@Component({
  selector: 'app-service-order-details',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, AvailableWorkersComponent, WorkersComponent, NgIf],
  templateUrl: './service-order-details.component.html',
  styleUrl: './service-order-details.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ServiceOrderDetailsComponent implements OnInit {
  workers: UserCard[] = WORKERS;
  element = {status: "In Progress"}
  public serviceOrders!: ServiceOrderData;
  private orderId!: string | null;

  constructor(private apollo: Apollo, private route: ActivatedRoute,) {
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.orderId = params.get('orderId');
      if (this.orderId) {
        this.fetchOrderDetails(this.orderId);
      }
    });
  }

  fetchOrderDetails(orderId: string): void {
    this.apollo
      .watchQuery({
        query: GET_SERVICE_ORDERS_BY_ID,
        variables: {
          id: orderId
        }
      })
      .valueChanges.subscribe((result: any) => {
      this.serviceOrders = result?.data?.serviceOrderById;
    });
  }

}
