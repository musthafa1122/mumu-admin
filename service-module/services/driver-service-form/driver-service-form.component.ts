import {Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MaterialModule} from '../../../../material.module';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {
  GoogleMapSearchBoxComponent
} from '../../../../components/google-map/google-map-search-box/google-map-search-box.component';
import {
  DistanceChangeEvent,
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
import {MatDialog} from "@angular/material/dialog";
import {PriceConfirmationPopupComponent} from "../price-confirmation-popup/price-confirmation-popup.component";
import {ServiceOrderService} from "../service-order.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OrderHistoryService} from "../../order-history/order-history.service";

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
  readonly dialog = inject(MatDialog);
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
  showProgress = false
  private fromDateSubscription: Subscription | null = null;
  private pickupLocationSubscription: Subscription | null = null;
  private dropOffLocationSubscription: Subscription | null = null;

  constructor(private router: Router,
              private fb: FormBuilder,
              private serviceOrderService: ServiceOrderService,
              private snackBar: MatSnackBar,
              private orderHistoryService: OrderHistoryService
  ) {
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
      this.showProgress = true;

      const formValue = this.serviceDetailsForm.value;  // Get values from the form

      const variables = {
        pickupLocation: formValue.pickupLocation.place,
        dropOffLocation: formValue.dropOffLocation.place,
        fromDate: formValue.fromDate.toISOString(),  // Convert to ISO string
        fromTime: formValue.fromTime,
        toDate: formValue.toDate.toISOString(),
        toTime: formValue.toTime,
        user: '6708df417f34f8c4c3df65da',  // Replace with actual user ID
        service: '67085c2577bc64c98ab89f06',  // Replace with actual service ID
        genderPreferences: formValue.genderPreferences,
        serviceType: formValue.serviceType,
        specialRequirements: formValue.specialRequirements,
        bookingType: formValue.bookingType,
        duration: formValue.duration,
        mumuSuggestedPrice: formValue.mumuSuggestedPrice,  // Pricing
        serviceOfferPrice: formValue.serviceOfferPrice,  // Pricing
        userOfferedPrice: formValue.userOfferedPrice,  // Pricing
        acceptedPrice: formValue.acceptedPrice,  // Pricing
        businessHours: formValue.businessHours,  // Business hours
        distanceInKm: formValue.distanceInKm,  // Distance in km
        priorityLevels: formValue.priorityLevels,  // Priority levels
        additionalNotes: formValue.additionalNotes,  // Additional notes
        additionalNotesVoice: formValue.additionalNotesVoice ? formValue.additionalNotesVoice.toString() : null,  // Voice notes
        additionalServices: formValue.additionalServices.join(','),  // Additional services
      };
      console.log('Submitting Driver Service Request:', variables);
      this.openDialog(variables)
      // Call the service order save function (GraphQL mutation)
      // this.serviceOrderService.saveServiceOrder(variables).subscribe(
      //   (response: any) => {
      //     // Handle successful service order save
      //     console.log('Service Order successfully saved:', response);
      //     this.showProgress = false;
      //   },
      //   (error: any) => {
      //     // Handle error when saving service order
      //     console.error('Error saving Service Order:', error);
      //     this.showProgress = false;
      //   }
      // );
    } else {
      console.log('Form is invalid');
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

  openDialog(event: any) {
    const dialogConfig = {
      width: '40%',  // Set the desired width
      data: event
    };

    this.dialog.open(PriceConfirmationPopupComponent, dialogConfig);
    const dialogRef = this.dialog.open(PriceConfirmationPopupComponent, dialogConfig);

    // Subscribe to afterClosed() to get the response
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog closed with response:', result);
        this.serviceOrderService.saveServiceOrder(result).subscribe(
          (response: any) => {
            this.orderHistoryService.getServiceHistory('6708df417f34f8c4c3df65da').subscribe(data => {
              console.log(data);
            })
            this.snackBar.open('Service Order successfully saved!', 'Close', {
              duration: 3000, // Duration in milliseconds
              horizontalPosition: 'right', // Position of the toast
              verticalPosition: 'top', // Position of the toast
              panelClass: ['success-snackbar'] // Optional: Custom CSS class for styling
            });
            this.router.navigateByUrl("/service-home/history");
            this.showProgress = false;
          },
          (error: any) => {
            // Handle error when saving service order
            console.error('Error saving Service Order:', error);
            this.showProgress = false;
          }
        );
      }
    });
  }

  distanceChanges(event: DistanceChangeEvent) {
    console.log('Distance changes:', event);

    // Update form group fields with data from the event
    this.serviceDetailsForm.patchValue({
      businessHours: event.businessHours,  // Set business hours
      distanceInKm: event.distance.text,  // Set distance text
      duration: event.duration.text,  // Set duration text
    });
    this.submitDriverForm()
  }

  private createForms() {
    this.serviceDetailsForm = this.fb.group({
      serviceType: ['withoutCar', Validators.required],
      vehicleType: [''],  // This may be optional, depending on the service
      bookingType: ['one_time', Validators.required],
      additionalServices: [[]],  // Array of additional services
      duration: [''],
      // Location FormGroup
      pickupLocation: this.fb.group({
        place: ['', Validators.required],  // Location data
      }),
      dropOffLocation: this.fb.group({
        place: ['', Validators.required],  // Location data
      }),

      // Date and Time
      fromDate: [new Date(), Validators.required],  // Start date
      fromTime: ['10:00', Validators.required],  // Start time
      toDate: [this.calculateToDate(), Validators.required],  // End date
      toTime: ['18:00', Validators.required],  // End time

      // Additional Fields
      specialRequirements: [''],  // Text input for special requirements
      genderPreferences: ['any'],  // Optional gender preferences
      priorityLevels: ['normal'],  // Optional priority levels
      additionalNotes: [''],  // Any additional notes
      additionalNotesVoice: [''],  // Voice notes, can be optional

      // Pricing Fields (added here)
      mumuSuggestedPrice: [0],  // Default value set to 0
      serviceOfferPrice: [0],  // Default value set to 0
      userOfferedPrice: [0],  // Default value set to 0
      acceptedPrice: [0],  // Default value set to 0

      // Business Hours and Distance
      businessHours: [''],  // Default empty string
      distanceInKm: [''],  // Default empty string
    });
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
    // this.dropOffLocationSubscription = this.serviceDetailsForm.get('dropOffLocation')?.valueChanges.subscribe(location => {
    //
    //   if (location?.place?.latitude && location?.place?.longitude) {
    //     console.log(location)
    //     this.checkLocationValuesChanged();
    //     this.cdr.markForCheck();
    //   }
    // }) as Subscription;
  }

  private unsubscribeFromFormChanges(): void {
    this.fromDateSubscription?.unsubscribe();
    this.pickupLocationSubscription?.unsubscribe();
    this.dropOffLocationSubscription?.unsubscribe();

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
