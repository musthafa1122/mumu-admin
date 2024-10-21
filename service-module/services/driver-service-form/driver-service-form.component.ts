import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../../../../material.module";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";
import {
  GoogleMapSearchBoxComponent
} from "../../../../components/google-map/google-map-search-box/google-map-search-box.component";
import {GoogleMap, MapInfoWindow, MapMarker} from "@angular/google-maps";
import {ToastrService} from "ngx-toastr";
import DirectionsService = google.maps.DirectionsService;
import DirectionsRenderer = google.maps.DirectionsRenderer;

@Component({
  selector: 'app-driver-service-form',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    GoogleMapSearchBoxComponent,
    GoogleMap,
    MapInfoWindow,
    MapMarker
  ],
  providers: [DirectionsService],

  templateUrl: './driver-service-form.component.html',
  styleUrl: './driver-service-form.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DriverServiceFormComponent implements OnInit {
  driverForm!: FormGroup;
  driverServiceTypes = [
    {"label": "Personal Driver", "value": "personalDriver"},
    {"label": "Chauffeur Service", "value": "chauffeurService"},
    {"label": "Delivery Driver", "value": "deliveryDriver"},
    {"label": "Long-Distance Driver", "value": "longDistanceDriver"},
    {"label": "Taxi Driver", "value": "taxiDriver"},
    {"label": "Rental Car with Driver", "value": "rentalCarWithDriver"}
  ]
  vehicleTypes = [
    {
      label: 'Sedan',
      value: 'sedan',
      image: 'https://img.freepik.com/free-vector/colorful-compact-car-vector-illustration_1308-163665.jpg?t=st=1728002402~exp=1728006002~hmac=4bfb2c1a1f8e3de217135d50d61211fe9a1fa7f87f80d87ebc444f3f88ad91c1&w=2000'
    },
    {
      label: 'SUV',
      value: 'suv',
    },
    {
      label: 'Motorbike',
      value: 'motorbike',
    },
    {
      label: 'Truck',
      value: 'truck',
    }
  ];
  durations = [
    {"label": "Hourly", "value": "hourly"},
    {"label": "Half-Day", "value": "halfDay"},
    {"label": "Full Day", "value": "fullDay"},
    {"label": "Multiple Days", "value": "multipleDays"}
  ];
  additionalServices = [
    {"label": "Luggage Assistance", "value": "luggageAssistance"},
    {"label": "Pet Transport", "value": "petTransport"},
    {"label": "Elderly Assistance", "value": "elderlyAssistance"},
    {"label": "Airport Transfer", "value": "airportTransfer"}
  ]
  loading = false;
  @ViewChild(GoogleMap, {static: false}) map!: GoogleMap;
  @ViewChild(MapInfoWindow, {static: false}) infoWindow!: MapInfoWindow;
  mapZoom = 17;
  mapCenter!: google.maps.LatLng;

  mapOptions: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 4,
    styles: [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#000000" // Black text for labels
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "rgba(146,236,132,0)" // White stroke for labels
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f0f0f0" // Light gray for landscape
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e0e0e0" // Light gray for points of interest
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#cccccc" // Light gray for roads
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#a4d8e1" // Light blue for water
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e8e8e8" // Light gray for transit
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#b0b0b0" // Darker gray for highways
          }
        ]
      }, {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },]
  };
  markerInfoContent = '';
  markerOptions: google.maps.MarkerOptions = {
    draggable: true,
    animation: google.maps.Animation.BOUNCE,
  };
  directionsRenderer: DirectionsRenderer = new google.maps.DirectionsRenderer(); // DirectionsRenderer added
  distanceInKm = 0
  pickupDropoffForm!: FormGroup;
  serviceDetailsForm!: FormGroup;

  constructor(private router: Router, private toastr: ToastrService,
              private directionsService: DirectionsService, private fb: FormBuilder,) {
  }

  ngOnInit(): void {
    this.createForms();
    this.getCurrentLocation();
  }

  createForms() {
    // Initialize pickup and dropoff form
    this.pickupDropoffForm = this.fb.group({
      pickupLocation: this.fb.group({
        place: ['', Validators.required],
      }),
      dropoffLocation: this.fb.group({
        place: ['', Validators.required],
      }),
    });

    // Initialize service details form
    this.serviceDetailsForm = this.fb.group({
      serviceType: ['', Validators.required],
      vehicleType: ['', Validators.required],
      duration: ['', Validators.required],
      additionalServices: [[]]
    });
  }

  submitDriverForm() {
    if (this.pickupDropoffForm.valid && this.serviceDetailsForm.valid) {
      const driverData = {
        ...this.pickupDropoffForm.value,
        ...this.serviceDetailsForm.value
      };
    }
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
        this.directionsRenderer.setOptions({
          polylineOptions: {
            strokeColor: '#4fda9f', // Change this to your desired color
            strokeWeight: 5, // Adjust the weight as needed
          }
        });
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


  driverValueChanges() {
    const $event = this.pickupDropoffForm.value
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
