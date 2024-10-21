import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
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
import {MatDatepicker, MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {
  NgxMatTimepickerComponent,
  NgxMatTimepickerDirective,
  NgxMatTimepickerToggleComponent
} from "ngx-mat-timepicker";
import {Subscription} from "rxjs";
import DirectionsService = google.maps.DirectionsService;

@Component({
  selector: 'app-driver-service-form',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    GoogleMapSearchBoxComponent,
    MatDatepicker,
    MatDatepickerModule,
    GoogleMapDrawingsComponent,
    MatNativeDateModule,
    NgxMatTimepickerComponent,
    NgxMatTimepickerToggleComponent,
    NgxMatTimepickerDirective
  ],
  providers: [DirectionsService],

  templateUrl: './driver-service-form.component.html',
  styleUrl: './driver-service-form.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DriverServiceFormComponent implements OnInit, OnDestroy {

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

  additionalServices = [
    {"label": "Luggage Assistance", "value": "luggageAssistance"},
    {"label": "Pet Transport", "value": "petTransport"},
    {"label": "Elderly Assistance", "value": "elderlyAssistance"},
    {"label": "Airport Transfer", "value": "airportTransfer"}
  ]
  serviceDetailsForm!: FormGroup;
  toAndFromCoordinates!: {
    pickupLatitude: number,
    pickupLongitude: number,
    dropOffLatitude: number,
    dropOffLongitude: number
  };
  dateDiff!: {
    days: number,
    hours: number
  }
  minTime!: string;
  minDate!: Date;
  minToDate!: Date;
  currentDate!: Date;
  currentLocation!: { lat: number, long: number }
  private fromDateSubscription: Subscription | null = null;
  private pickupLocationSubscription: Subscription | null = null;

  constructor(private router: Router,
              private fb: FormBuilder,) {
  }

  ngOnInit(): void {
    this.createForms();
    this.currentDate = new Date();
    this.minDate = this.currentDate; // Set today's date as the minimum date

    // Subscribe to changes on 'fromDate'
    this.fromDateSubscription = this.serviceDetailsForm.get('fromDate')?.valueChanges.subscribe((selectedDate) => {
      if (selectedDate) {
        this.minToDate = selectedDate;
        this.handleDateChange(selectedDate);
      }
    }) as Subscription; // Cast to Subscription

    // Subscribe to changes on 'pickupLocation'
    this.pickupLocationSubscription = this.serviceDetailsForm.get('pickupLocation')?.valueChanges.subscribe((location) => {
      if (location?.place?.latitude && location?.place?.longitude) {
        this.currentLocation = {lat: location.place.latitude, long: location.place.longitude};
      }
    }) as Subscription; // Cast to Subscription

  }

  ngOnDestroy() {
    if (this.fromDateSubscription) {
      this.fromDateSubscription.unsubscribe();
    }
    if (this.pickupLocationSubscription) {
      this.pickupLocationSubscription.unsubscribe();
    }
  }

  checkLocationValuesChanged() {
    const dropOffLatitude = this.serviceDetailsForm.get('dropOffLocation')?.value?.place?.latitude;
    const dropOffLongitude = this.serviceDetailsForm.get('dropOffLocation')?.value?.place?.longitude;
    const pickupLongitude = this.serviceDetailsForm.get('pickupLocation')?.value?.place?.longitude;
    const pickupLatitude = this.serviceDetailsForm.get('pickupLocation')?.value?.place?.latitude;
    if (dropOffLatitude && dropOffLongitude && pickupLongitude && pickupLatitude) {
      console.log('Pickup Location:', pickupLongitude, pickupLatitude);
      console.log('Dropoff Location:', dropOffLatitude, dropOffLongitude);
      this.driverValueChanges(pickupLatitude, pickupLongitude, dropOffLatitude, dropOffLongitude);
    }
  }

  handleDateChange(selectedDate: Date) {
    const now = new Date();
    const selected = new Date(selectedDate);

    // If the selected date is today, set minTime to the current time
    if (selected.toDateString() === now.toDateString()) {
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      this.minTime = `${hours}:${minutes}`;
    } else {
      // Reset minTime if the selected date is not today
      this.minTime = '00:00';
    }
  }

  createForms() {


    // Initialize service details form
    this.serviceDetailsForm = this.fb.group({
      serviceType: ['withoutCar', Validators.required],
      vehicleType: [''],
      bookingType: ['one_time', Validators.required],
      additionalServices: [[]],
      pickupLocation: this.fb.group({
        place: ['', Validators.required],
      }),
      dropOffLocation: this.fb.group({
        place: ['', Validators.required],
      }),
      fromDate: [new Date(), Validators.required],
      fromTime: ['10:00', Validators.required],
      toDate: [new Date(new Date().setDate(new Date().getDate() + 2)), Validators.required],
      toTime: ['18:00', Validators.required]
    });
  }

  submitDriverForm() {
    if (this.serviceDetailsForm.valid) {
      const driverData = {
        ...this.serviceDetailsForm.value
      };
    }
  }

  driverValueChanges(
    pickupLatitude: number,
    pickupLongitude: number,
    dropOffLatitude: number,
    dropOffLongitude: number
  ) {
    this.toAndFromCoordinates = {pickupLatitude, pickupLongitude, dropOffLatitude, dropOffLongitude};
  }

  calculateDays() {
    if (this.serviceDetailsForm.valid) {
      const fromDate = this.serviceDetailsForm.get('fromDate')?.value;  // Date object
      const toDate = this.serviceDetailsForm.get('toDate')?.value;      // Date object
      const fromTime = this.serviceDetailsForm.get('fromTime')?.value;  // Assuming it's in 'HH:mm AM/PM' format
      const toTime = this.serviceDetailsForm.get('toTime')?.value;      // Assuming it's in 'HH:mm AM/PM' format

      let completeFromDate: Date;
      let completeToDate: Date;

      // Handling the 'fromTime' conversion from 12-hour to 24-hour format
      if (fromTime) {
        const t1: string[] = fromTime.split(' ');  // Splitting time and period (AM/PM)
        const timeParts: string[] = t1[0].split(':'); // Splitting hours and minutes
        let hours = parseInt(timeParts[0], 10);  // Parsing hours
        const minutes = timeParts[1];  // Minutes remain unchanged

        // Converting hours based on AM/PM
        if (t1[1] === 'PM' && hours < 12) {
          hours += 12;  // PM times need to add 12 (except for 12 PM)
        } else if (t1[1] === 'AM' && hours === 12) {
          hours = 0;  // 12 AM is midnight (00:00 in 24-hour format)
        }

        completeFromDate = new Date(fromDate);
        completeFromDate.setHours(hours, parseInt(minutes, 10));
      }

      // Similarly, handle 'toTime' conversion from 12-hour to 24-hour format
      if (toTime) {
        const t2: string[] = toTime.split(' ');
        const timeParts2: string[] = t2[0].split(':');
        let hours2 = parseInt(timeParts2[0], 10);
        const minutes2 = timeParts2[1];

        if (t2[1] === 'PM' && hours2 < 12) {
          hours2 += 12;
        } else if (t2[1] === 'AM' && hours2 === 12) {
          hours2 = 0;
        }

        completeToDate = new Date(toDate);
        completeToDate.setHours(hours2, parseInt(minutes2, 10));
      }

      // Ensure we have valid dates to calculate
      // @ts-ignore
      if (completeFromDate && completeToDate) {
        // Calculate the difference in milliseconds
        const diffInMs = completeToDate.getTime() - completeFromDate.getTime();

        // Convert milliseconds to total hours
        const totalHours = diffInMs / (1000 * 60 * 60);

        // Calculate days and remaining hours
        const daysDifference = Math.floor(totalHours / 24);   // Total days
        const hoursDifference = Math.floor(totalHours % 24);   // Remaining hours
        this.dateDiff = {days: daysDifference, hours: hoursDifference}
        console.log(`Difference: ${daysDifference} days and ${hoursDifference} hours`);
        return {
          days: daysDifference,
          hours: hoursDifference
        };
      } else {
        console.error('Unable to calculate dates.');
        return null;
      }
    } else {
      console.error('Form is invalid');
      return null;
    }
  }
}
