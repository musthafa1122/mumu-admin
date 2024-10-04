import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../../../material.module";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-driver-service-form',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './driver-service-form.component.html',
  styleUrl: './driver-service-form.component.scss'
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

  constructor(private fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
    this.createDriverForm();
  }

  createDriverForm() {
    this.driverForm = this.fb.group({
      serviceType: ['', Validators.required],
      vehicleType: ['', Validators.required],
      duration: ['', Validators.required],
      pickupLocation: ['', Validators.required],
      dropoffLocation: ['', Validators.required],
      additionalServices: [[]]
    });
  }

  submitDriverForm() {
    if (this.driverForm.valid) {
      const driverData = this.driverForm.value;
      console.log('Driver Service Request:', driverData);
      this.router.navigate(['/history']);
    }
  }
}
