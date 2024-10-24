import {Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../../material.module';
import {CommonModule} from '@angular/common';
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
import {ServiceOrderHelperService} from "../shared/service-order-helper.service";

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
  vehicleTypes: any = [];
  additionalServices: any = [];
  serviceDetailsForm!: FormGroup;
  readonly dialog = inject(MatDialog);
  toAndFromCoordinates!: {
    pickupLatitude: number;
    pickupLongitude: number;
    dropOffLatitude: number;
    dropOffLongitude: number;
  };
  minTime!: string;
  minDate!: Date;
  minToDate!: Date;
  currentLocation!: { lat: number; long: number; };
  showProgress = false
  private fromDateSubscription: Subscription | null = null;
  private pickupLocationSubscription: Subscription | null = null;

  constructor(
    private serviceOrderHelper: ServiceOrderHelperService,
  ) {
  }

  ngOnInit(): void {
    this.serviceDetailsForm = this.serviceOrderHelper.createFormGroup();

    this.subscribeToFormChanges();
    this.minDate = new Date();

    this.vehicleTypes = this.serviceOrderHelper.getVehicleTypes()
    this.additionalServices = this.serviceOrderHelper.getAdditionalServices()
  }

  ngOnDestroy(): void {
    this.unsubscribeFromFormChanges();
  }

  submitDriverForm(): void {
    if (this.serviceDetailsForm.valid) {
      this.showProgress = true;
      this.openDialog(this.serviceOrderHelper.patchServiceOrder(this.serviceDetailsForm.value))
    } else {
      console.log('Form is invalid');
    }
  }

  checkLocationValuesChanged(): void {
    const dropOffLocation = this.serviceDetailsForm.get('dropOffLocation')?.value?.place;
    const pickupLocation = this.serviceDetailsForm.get('pickupLocation')?.value?.place;

    if (dropOffLocation && pickupLocation) {
      const {latitude: dropOffLatitude, longitude: dropOffLongitude} = dropOffLocation;
      const {latitude: pickupLatitude, longitude: pickupLongitude} = pickupLocation;
      this.toAndFromCoordinates = {pickupLatitude, pickupLongitude, dropOffLatitude, dropOffLongitude};
    }
  }

  openDialog(event: any) {
    this.showProgress = true;
    const dialogConfig = {
      width: '40%',  // Set the desired width
      data: event
    };
    const dialogRef = this.dialog.open(PriceConfirmationPopupComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

      if (result) {  // Check if result is valid
        this.serviceOrderHelper.processServiceOrder(result, '6708df417f34f8c4c3df65da')
          .subscribe(data => {
            this.showProgress = false
          });
      } else {
        this.showProgress = false
      }
    });
  }

  distanceChanges(event: DistanceChangeEvent) {
    this.serviceDetailsForm.patchValue({
      businessHours: event.businessHours,  // Set business hours
      distanceInKm: event.distance.text,  // Set distance text
      duration: event.duration.text,  // Set duration text
    });
    this.submitDriverForm()
  }

  private subscribeToFormChanges(): void {
    this.fromDateSubscription = this.serviceDetailsForm.get('fromDate')?.valueChanges.subscribe(selectedDate => {
      if (selectedDate) {
        this.minToDate = selectedDate;
        this.minTime = this.serviceOrderHelper.getMinTime(selectedDate)
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
}
