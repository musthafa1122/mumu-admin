import {Component, OnInit} from '@angular/core';
import {UserComponent} from "../../../components/user/user.component";
import {ErrandsServiceFormComponent} from "../services/errands-service-form/errands-service-form.component";
import {DriverServiceFormComponent} from "../services/driver-service-form/driver-service-form.component";
import {BystanderServiceFormComponent} from "../services/bystander-service-form/bystander-service-form.component";
import {MaterialModule} from "../../../material.module";
import {CommonModule} from "@angular/common";
import {ParentServiceType} from "../../../components/service-home/service-home.component";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [
    UserComponent,
    ErrandsServiceFormComponent,
    DriverServiceFormComponent,
    BystanderServiceFormComponent,
    MaterialModule,
    CommonModule,
  ],
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'], // Corrected to styleUrls
})
export class ServiceDetailsComponent implements OnInit {
  selectedServiceType: ParentServiceType = ParentServiceType.Drivers; // Variable to store selected service
  readonly parentServiceType = ParentServiceType; // Expose enum to the template

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const serviceTypeParam = params.get('serviceType')?.toLowerCase();

      if (serviceTypeParam && Object.values(ParentServiceType).includes(serviceTypeParam as ParentServiceType)) {
        this.selectedServiceType = serviceTypeParam as ParentServiceType;
      }
    });
  }

}
