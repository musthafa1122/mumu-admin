import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {TablerIconsModule} from "angular-tabler-icons";
import {CommonModule} from "@angular/common";
import {ServiceOrderData} from "../order-history.service";
import {NgScrollbarModule} from "ngx-scrollbar";
import {MatBadge} from "@angular/material/badge";
import {MatIconButton} from "@angular/material/button";
import {Router} from "@angular/router";
import {MatCardTitle} from "@angular/material/card";
import {MatTooltip} from "@angular/material/tooltip";

interface ServiceOrder {
  status: string;
  serviceType: string;
  title: string;
  location: string;
  dateRequested: string;
  salary: number;
  id: number;
  assignedUser: any;
}

interface StatusMapItem {
  items: ServiceOrder[];
  key: string;
  headingBgColor: string;
  taskBgColor: string;
}

@Component({
  selector: 'app-order-history-card-view',
  standalone: true,
  imports: [
    MatIcon,
    TablerIconsModule,
    CommonModule,
    NgScrollbarModule,
    MatBadge,
    MatIconButton,
    MatCardTitle,
    MatTooltip,
  ],
  templateUrl: './order-history-card-view.component.html',
  styleUrl: './order-history-card-view.component.scss'
})
export class OrderHistoryCardViewComponent implements OnChanges {
  serviceOrderData: ServiceOrder[] = [];
  statusMap: StatusMapItem[] = [
    {
      items: [],
      key: "Pending",
      headingBgColor: 'rgb(112 153 227)',
      taskBgColor: '#ecf2ff',
    },
    {
      items: [],
      key: "In Progress",
      headingBgColor: 'rgb(240 189 95)',
      taskBgColor: '#fef5e5',
    },
    {
      items: [],
      key: "Completed",
      headingBgColor: 'rgb(112 236 213)',
      taskBgColor: '#e6fffa',
    },

    {
      items: [],
      key: "Cancelled",
      headingBgColor: 'rgb(255 181 162)',
      taskBgColor: '#fdede8',
    },
  ];
  @Input() data!: ServiceOrderData[];

  constructor(private router: Router) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"]) {
      this.serviceOrderData = changes["data"].currentValue.map((data: ServiceOrderData) => {
        return {
          status: data.status,
          serviceType: data.serviceType,
          title: data.title,
          location: data.location,
          dateRequested: data.dateRequested,
          salary: data.salary,
          id: data.id,
          assignedUser: data.assignedUser
        };
      });

      this.serviceOrderData.forEach((item: ServiceOrder) => {
        const statusEntry: any = this.statusMap.find(status => status.key === item.status);
        if (statusEntry) {
          statusEntry.items.push(item);
        }
      });

      console.log(this.serviceOrderData)
    }
  }

  openServiceDetails(orderID: number): void {
    console.log(`Applying for job with ID: ${orderID}`);
    this.router.navigate([`service-home/service-order-details/${orderID}`]);
  }
}
