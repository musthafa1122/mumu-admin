import {Component, OnInit} from '@angular/core';
import {UserComponent} from "../../components/user/user.component";
import {ErrandsServiceFormComponent} from "../services/errands-service-form/errands-service-form.component";
import {DriverServiceFormComponent} from "../services/driver-service-form/driver-service-form.component";
import {BystanderServiceFormComponent} from "../services/bystander-service-form/bystander-service-form.component";
import {ParentServiceType} from "../../components/blog-card/blog-card.component";
import {MaterialModule} from "../../material.module";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";

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
  styleUrl: './service-details.component.scss',
})
export class ServiceDetailsComponent implements OnInit {
  readonly parentServiceType = ParentServiceType;  // Expose enum to the template
  selectedServiceType: ParentServiceType = ParentServiceType.Drivers; // Variable to store selected service

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    // Get the serviceType from route parameters
    this.route.paramMap.subscribe(params => {
      const serviceTypeParam = params.get('serviceType');

      // Check if the serviceTypeParam is a valid ParentServiceType
      if (serviceTypeParam && Object.values(ParentServiceType).includes(serviceTypeParam as ParentServiceType)) {
        this.selectedServiceType = serviceTypeParam as ParentServiceType;
      } else {
        // Redirect or handle invalid serviceType (optional)
        this.router.navigate(['/404']); // For example, redirect to a 404 page
      }
    });
  }
}
