import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MaterialModule} from "../../../material.module";
import {TablerIconsModule} from "angular-tabler-icons";
import {AvailableWorkersComponent} from "../available-workers/available-workers.component";
import {WorkersComponent} from "../available-workers/workers/workers.component";
import {ServiceStatus, UserCard, WORKERS} from "../available-workers/constants";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {OrderHistoryComponent} from "../order-history/order-history.component";
import {ActivatedRoute} from "@angular/router";
import {Apollo, gql} from 'apollo-angular';
import {FormsModule} from "@angular/forms";
import {JobProposalsComponent} from "../job-proposals/job-proposals.component";
import {ServiceStatusComponent} from "../../../components/service-status/service-status.component";
import {AppRecentTransactionsComponent} from "../../../components/recent-transactions/recent-transactions.component";
import {MatTabBody, MatTabHeader, MatTabsModule} from "@angular/material/tabs";
import {MatDialog} from "@angular/material/dialog";
import {WorkerProfileComponent} from "../available-workers/worker-profile/worker-profile.component";
import {ServiceOrderData} from "../order-history/order-history.service";
import {NotificationComponent} from "../../extra/ui-components/notification/notification.component";
import {MiniChatComponent} from "../../common-module/chat-application/mini-chat/mini-chat.component";

export const GET_SERVICE_ORDERS_BY_ID = gql`
  query ServiceOrderById($serviceOrderByIdId: ID!) {
  serviceOrderById(id: $serviceOrderByIdId) {
    acceptedPrice
    additionalNotes
    additionalNotesVoice
    assignedUser {
      firstName
      lastName
      id
    }
    bookingType
    businessHours
    createdAt
    distanceInKm
    dropOffLocation {
      latitude
      longitude
      placeName
      imageUrl
      locationUrl
    }
    duration
    fromDate
    fromTime
    genderPreferences
    id
    mumuSuggestedPrice
    pickupLocation {
      latitude
      longitude
      placeName
      imageUrl
      locationUrl
    }
    priorityLevels
    service {
      id
      imgSrc
      title
      description
      price
      negotiatedPrice
      parentServiceType
    }
    serviceOfferPrice
    serviceType
    specialRequirements
    status
    toDate
    toTime
    updatedAt
    user {
      id
    }
    userOfferedPrice
  }
}
`;

@Component({
  selector: 'app-service-order-details',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, AvailableWorkersComponent, WorkersComponent, NgIf, NgForOf, FormsModule, OrderHistoryComponent, JobProposalsComponent, ServiceStatusComponent, NgClass, AppRecentTransactionsComponent, MatTabsModule, MatTabHeader, MatTabBody, NotificationComponent, MiniChatComponent],
  templateUrl: './service-order-details.component.html',
  styleUrl: './service-order-details.component.scss',
  encapsulation: ViewEncapsulation.None

})
export class ServiceOrderDetailsComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  workers: UserCard[] = WORKERS;
  public serviceOrders!: ServiceOrderData;
  serviceStatus = ServiceStatus;
  private orderId!: string | null;

  constructor(private apollo: Apollo, private route: ActivatedRoute,) {
  }

  openDialog() {
    const dialogConfig = {
      width: '80%',  // Set the desired width
      height: '80%', // Set the desired height
    };

    this.dialog.open(WorkerProfileComponent, dialogConfig);

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
          serviceOrderByIdId: orderId
        }
      })
      .valueChanges.subscribe((result: any) => {
      this.serviceOrders = result?.data?.serviceOrderById;
    });
  }

}
