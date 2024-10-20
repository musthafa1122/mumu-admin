import {Component, OnInit, ViewChild} from '@angular/core';
import {UserComponent} from "../../components/user/user.component";
import {ErrandsServiceFormComponent} from "../services/errands-service-form/errands-service-form.component";
import {DriverServiceFormComponent} from "../services/driver-service-form/driver-service-form.component";
import {BystanderServiceFormComponent} from "../services/bystander-service-form/bystander-service-form.component";
import {ParentServiceType} from "../../components/service-home/service-home.component";
import {MaterialModule} from "../../material.module";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {GoogleMap, MapInfoWindow, MapMarker} from "@angular/google-maps";
import {ToastrService} from "ngx-toastr";
import DirectionsService = google.maps.DirectionsService;
import DirectionsRenderer = google.maps.DirectionsRenderer;


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
  providers: [DirectionsService],
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'], // Corrected to styleUrls
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

  readonly parentServiceType = ParentServiceType; // Expose enum to the template
  selectedServiceType: ParentServiceType = ParentServiceType.Drivers; // Variable to store selected service

  directionsRenderer: DirectionsRenderer = new google.maps.DirectionsRenderer(); // DirectionsRenderer added
  distanceInKm = 0

  constructor(private route: ActivatedRoute, private router: Router, private toastr: ToastrService,
              private directionsService: DirectionsService) {
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }

  calcRoute(from: { lat: number | string, long: number | string }, to: {
    lat: number | string,
    long: number | string
  }) {
    const start = new google.maps.LatLng(from.lat as number, from.long as number);
    const end = new google.maps.LatLng(to.lat as number, to.long as number);

    const request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(response);
        // @ts-ignore
        this.directionsRenderer.setMap(this.map.googleMap); // Use this.map.googleMap
      } else {
        alert(`Directions Request from ${start.toUrlValue(6)} to ${end.toUrlValue(6)} failed: ${status}`);
      }
    });
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
          this.toastr.error("Couldn't get your location", 'Position unavailable');
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
    this.getCurrentLocation();
    this.route.queryParamMap.subscribe(params => {
      const serviceTypeParam = params.get('serviceType')?.toLowerCase();

      if (serviceTypeParam && Object.values(ParentServiceType).includes(serviceTypeParam as ParentServiceType)) {
        this.selectedServiceType = serviceTypeParam as ParentServiceType;
      }
    });
  }

  driverValueChanges($event: any) {
    console.log('Driver Value Changes', $event);

    const from: { lat: number | string, long: number | string } = {
      lat: $event.pickupLocation.place.latitude as number,
      long: $event.pickupLocation.place.longitude as number // Use 'long'
    };

    const to: { lat: number | string, long: number | string } = {
      lat: $event.dropoffLocation.place.latitude as number,
      long: $event.dropoffLocation.place.longitude as number
    };

    // Convert 'long' to 'lng' when interacting with Google Maps API
    const googleFrom: google.maps.LatLngLiteral = {
      lat: Number(from.lat),
      lng: Number(from.long), // Manually map 'long' to 'lng'
    };

    const googleTo: google.maps.LatLngLiteral = {
      lat: Number(to.lat),
      lng: Number(to.long), // Manually map 'long' to 'lng'
    };

    this.calcRoute(from, to);

    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [googleFrom],
        destinations: [googleTo],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status !== 'ZERO_RESULTS') {
          const distanceInMeters = response.rows[0].elements[0].distance.value;
          this.distanceInKm = distanceInMeters / 1000; // Convert meters to kilometers
        } else {
          console.error('Distance calculation failed due to:', status);
        }
      }
    );
  }
}
