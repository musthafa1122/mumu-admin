import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../../../../material.module";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";
import {
  GoogleMapSearchBoxComponent
} from "../../../../components/google-map/google-map-search-box/google-map-search-box.component";
import {
  GoogleMapDrawingsComponent
} from "../../../../components/google-map/google-map-drawings/google-map-drawings.component";
import DirectionsService = google.maps.DirectionsService;

@Component({
  selector: 'app-driver-service-form',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    GoogleMapSearchBoxComponent,

    GoogleMapDrawingsComponent
  ],
  providers: [DirectionsService],

  templateUrl: './driver-service-form.component.html',
  styleUrl: './driver-service-form.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DriverServiceFormComponent implements OnInit {

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
  pickupDropOffForm!: FormGroup;
  serviceDetailsForm!: FormGroup;
  fromToLocation!: FormGroup;

  constructor(private router: Router,
              private fb: FormBuilder,) {
  }

  ngOnInit(): void {
    this.createForms();
  }

  createForms() {
    // Initialize pickup and dropoff form
    this.pickupDropOffForm = this.fb.group({
      pickupLocation: this.fb.group({
        place: ['', Validators.required],
      }),
      dropOffLocation: this.fb.group({
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
    if (this.pickupDropOffForm.valid && this.serviceDetailsForm.valid) {
      const driverData = {
        ...this.pickupDropOffForm.value,
        ...this.serviceDetailsForm.value
      };
    }
  }

  driverValueChanges() {
    this.fromToLocation = this.pickupDropOffForm.value;
  }
}
