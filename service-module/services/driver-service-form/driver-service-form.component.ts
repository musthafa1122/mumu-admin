import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MaterialModule} from '../../../../material.module';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {
  GoogleMapSearchBoxComponent
} from '../../../../components/google-map/google-map-search-box/google-map-search-box.component';
import {
  GoogleMapDrawingsComponent
} from '../../../../components/google-map/google-map-drawings/google-map-drawings.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {
  NgxMatTimepickerComponent,
  NgxMatTimepickerDirective,
  NgxMatTimepickerToggleComponent
} from 'ngx-mat-timepicker';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-driver-service-form',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    GoogleMapSearchBoxComponent,
    GoogleMapDrawingsComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatTimepickerComponent,
    NgxMatTimepickerToggleComponent,
    NgxMatTimepickerDirective,
    ReactiveFormsModule
  ],
  templateUrl: './driver-service-form.component.html',
  styleUrls: ['./driver-service-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DriverServiceFormComponent implements OnInit, OnDestroy {
  vehicleTypes = this.getVehicleTypes();
  additionalServices = this.getAdditionalServices();
  serviceDetailsForm!: FormGroup;

  toAndFromCoordinates!: {
    pickupLatitude: number;
    pickupLongitude: number;
    dropOffLatitude: number;
    dropOffLongitude: number;
  };
  dateDiff!: { days: number; hours: number; };
  minTime!: string;
  minDate!: Date;
  minToDate!: Date;
  currentLocation!: { lat: number; long: number; };

  private fromDateSubscription: Subscription | null = null;
  private pickupLocationSubscription: Subscription | null = null;

  constructor(private router: Router, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.createForms();
    this.setupDateAndTimeConstraints();
    this.subscribeToFormChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromFormChanges();
  }

  submitDriverForm(): void {
    if (this.serviceDetailsForm.valid) {
      const driverData = {...this.serviceDetailsForm.value};
      console.log(driverData); // Log or process the driver data as needed
    }
  }

  calculateDays(): { days: number; hours: number } | null {
    if (this.serviceDetailsForm.valid) {
      const fromDate = this.serviceDetailsForm.get('fromDate')?.value;
      const toDate = this.serviceDetailsForm.get('toDate')?.value;
      const fromTime = this.serviceDetailsForm.get('fromTime')?.value;
      const toTime = this.serviceDetailsForm.get('toTime')?.value;

      const completeFromDate = this.constructCompleteDate(fromDate, fromTime);
      const completeToDate = this.constructCompleteDate(toDate, toTime);

      if (completeFromDate && completeToDate) {
        const diffInMs = completeToDate.getTime() - completeFromDate.getTime();
        const totalHours = diffInMs / (1000 * 60 * 60);

        const daysDifference = Math.floor(totalHours / 24);
        const hoursDifference = Math.floor(totalHours % 24);
        this.dateDiff = {days: daysDifference, hours: hoursDifference};
        console.log(`Difference: ${daysDifference} days and ${hoursDifference} hours`);
        return this.dateDiff;
      } else {
        console.error('Unable to calculate dates.');
        return null;
      }
    } else {
      console.error('Form is invalid');
      return null;
    }
  }

  checkLocationValuesChanged(): void {
    const dropOffLocation = this.serviceDetailsForm.get('dropOffLocation')?.value?.place;
    const pickupLocation = this.serviceDetailsForm.get('pickupLocation')?.value?.place;

    if (dropOffLocation && pickupLocation) {
      const {latitude: dropOffLatitude, longitude: dropOffLongitude} = dropOffLocation;
      const {latitude: pickupLatitude, longitude: pickupLongitude} = pickupLocation;

      console.log('Pickup Location:', pickupLongitude, pickupLatitude);
      console.log('Dropoff Location:', dropOffLatitude, dropOffLongitude);
      this.driverValueChanges(pickupLatitude, pickupLongitude, dropOffLatitude, dropOffLongitude);
    }
  }


  private getVehicleTypes() {
    return [
      {
        label: 'Sedan',
        value: 'sedan',
        image: 'https://img.freepik.com/free-vector/colorful-compact-car-vector-illustration_1308-163665.jpg?t=st=1728002402~exp=1728006002~hmac=4bfb2c1a1f8e3de217135d50d61211fe9a1fa7f87f80d87ebc444f3f88ad91c1&w=2000'
      },
      {label: 'SUV', value: 'suv'},
      {label: 'Motorbike', value: 'motorbike'},
      {label: 'Truck', value: 'truck'},
    ];
  }

  private getAdditionalServices() {
    return [
      {label: 'Luggage Assistance', value: 'luggageAssistance'},
      {label: 'Pet Transport', value: 'petTransport'},
      {label: 'Elderly Assistance', value: 'elderlyAssistance'},
      {label: 'Airport Transfer', value: 'airportTransfer'},
    ];
  }

  private createForms() {
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
      toDate: [this.calculateToDate(), Validators.required],
      toTime: ['18:00', Validators.required],
    });
  }

  private calculateToDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  }

  private setupDateAndTimeConstraints(): void {
    this.minDate = new Date();
  }

  private subscribeToFormChanges(): void {
    this.fromDateSubscription = this.serviceDetailsForm.get('fromDate')?.valueChanges.subscribe(selectedDate => {
      if (selectedDate) {
        this.minToDate = selectedDate;
        this.handleDateChange(selectedDate);
      }
    }) as Subscription;

    this.pickupLocationSubscription = this.serviceDetailsForm.get('pickupLocation')?.valueChanges.subscribe(location => {
      if (location?.place?.latitude && location?.place?.longitude) {
        this.currentLocation = {lat: location.place.latitude, long: location.place.longitude};
      }
    }) as Subscription;
  }

  private unsubscribeFromFormChanges(): void {
    this.fromDateSubscription?.unsubscribe();
    this.pickupLocationSubscription?.unsubscribe();
  }

  private handleDateChange(selectedDate: Date): void {
    const now = new Date();
    if (selectedDate.toDateString() === now.toDateString()) {
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      this.minTime = `${hours}:${minutes}`;
    } else {
      this.minTime = '00:00';
    }
  }

  private driverValueChanges(pickupLatitude: number, pickupLongitude: number, dropOffLatitude: number, dropOffLongitude: number): void {
    this.toAndFromCoordinates = {pickupLatitude, pickupLongitude, dropOffLatitude, dropOffLongitude};
  }

  private constructCompleteDate(date: Date, time: string): Date {
    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);

    let adjustedHours = period === 'PM' && hours < 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours);
    const completeDate = new Date(date);
    completeDate.setHours(adjustedHours, minutes);
    return completeDate;
  }
}
