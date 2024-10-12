import {Component, ViewEncapsulation} from '@angular/core';
import {MaterialModule} from "../../material.module";
import {TablerIconsModule} from "angular-tabler-icons";
import {AvailableWorkersComponent} from "../available-workers/available-workers.component";
import {WorkersComponent} from "../available-workers/workers/workers.component";
import {UserCard, WORKERS} from "../available-workers/constants";

@Component({
  selector: 'app-service-order-details',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, AvailableWorkersComponent, WorkersComponent],
  templateUrl: './service-order-details.component.html',
  styleUrl: './service-order-details.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ServiceOrderDetailsComponent {
  workers: UserCard[] = WORKERS;
}
