import {Component, OnInit, ViewChild} from '@angular/core';
import {UserComponent} from "../../components/user/user.component";
import {ErrandsServiceFormComponent} from "../services/errands-service-form/errands-service-form.component";
import {DriverServiceFormComponent} from "../services/driver-service-form/driver-service-form.component";
import {BystanderServiceFormComponent} from "../services/bystander-service-form/bystander-service-form.component";
import {ParentServiceType} from "../../components/blog-card/blog-card.component";
import {MaterialModule} from "../../material.module";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {GoogleMap, MapInfoWindow, MapMarker} from "@angular/google-maps";
import {ToastrService} from "ngx-toastr";

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
    GoogleMap,
    MapMarker,
    MapInfoWindow,
  ],
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.scss',
})
export class ServiceDetailsComponent implements OnInit {

  loading = false;

  @ViewChild(GoogleMap, {static: false}) map!: GoogleMap;
  @ViewChild(MapInfoWindow, {static: false}) infoWindow!: MapInfoWindow;

  mapZoom = 17;
  mapCenter!: google.maps.LatLng;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 4,
  };

  markerInfoContent = '';
  markerOptions: google.maps.MarkerOptions = {
    draggable: true,
    animation: google.maps.Animation.DROP,
  };


  readonly parentServiceType = ParentServiceType;  // Expose enum to the template
  selectedServiceType: ParentServiceType = ParentServiceType.Drivers; // Variable to store selected service

  constructor(private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {
  }


  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }


  getCurrentLocation() {
    this.loading = true;

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        this.loading = false;

        const point: google.maps.LatLngLiteral = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.mapCenter = new google.maps.LatLng(point);
        this.map.panTo(point);

        this.markerInfoContent = "I'm here!";

        this.markerOptions = {
          draggable: false,
          animation: google.maps.Animation.DROP,
        };
      },
      (error) => {
        this.loading = false;

        if (error.PERMISSION_DENIED) {
          this.toastr.error("Couldn't get your location", 'Permission denied');
        } else if (error.POSITION_UNAVAILABLE) {
          this.toastr.error(
            "Couldn't get your location",
            'Position unavailable'
          );
        } else if (error.TIMEOUT) {
          this.toastr.error("Couldn't get your location", 'Timed out');
        } else {
          this.toastr.error(error.message, `Error: ${error.code}`);
        }
      },
      {enableHighAccuracy: true}
    );
  }

  ngOnInit(): void {
    // Get the serviceType from route parameters
    this.getCurrentLocation();

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
