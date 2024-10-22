import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MaterialModule} from "../../../../material.module";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {
  GoogleMapDrawingsComponent
} from "../../../../components/google-map/google-map-drawings/google-map-drawings.component";
import {
  GoogleMapSearchBoxComponent
} from "../../../../components/google-map/google-map-search-box/google-map-search-box.component";
import {NgxMatTimepickerComponent, NgxMatTimepickerDirective} from "ngx-mat-timepicker";
import {AudioRecordingComponent} from "../../../../components/audio-recording/audio-recording.component";

@Component({
  selector: 'app-errands-service-form',
  standalone: true,
  imports: [MaterialModule,
    ReactiveFormsModule,
    CommonModule, GoogleMapDrawingsComponent, GoogleMapSearchBoxComponent, NgxMatTimepickerComponent, NgxMatTimepickerDirective, AudioRecordingComponent],
  templateUrl: './errands-service-form.component.html',
  styleUrl: './errands-service-form.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ErrandsServiceFormComponent implements OnInit {
  errandServiceTypes = [
    {label: "Grocery Shopping", value: "groceryShopping"},
    {label: "Package Pickup", value: "packagePickup"},
    {label: "Bill Payment", value: "billPayment"},
    {label: "Other", value: "other"}
  ];

  priorityLevels = [
    {label: "Low", value: "low"},
    {label: "Medium", value: "medium"},
    {label: "High", value: "high"}
  ];

  currentLocation!: { lat: number; long: number; };
  errandForm: FormGroup;
  minTime!: string;
  minDate!: Date;
  minToDate!: Date;
  showProgress = false;
  toAndFromCoordinates!: {
    pickupLatitude: number;
    pickupLongitude: number;
    dropOffLatitude: number;
    dropOffLongitude: number;
  };

  constructor(private fb: FormBuilder) {
    this.errandForm = this.fb.group({
      serviceType: [['groceryShopping'], Validators.required],
      bookingType: ['one_time', Validators.required],
      priorityLevels: ['high', Validators.required],
      duration: ['2', Validators.required],
      additionalNotes: [[]],
      pickupLocation: this.fb.group({
        place: ['', Validators.required],
      }),
      dropOffLocation: this.fb.group({
        place: [''],
      }),
      fromDate: [new Date(), Validators.required],
      fromTime: ['10:00', Validators.required],
      toDate: [this.calculateToDate(), Validators.required],
      toTime: ['18:00', Validators.required],
    });
  }

  ngOnInit(): void {
    this.errandForm.get('fromDate')?.valueChanges.subscribe(selectedDate => {
      if (selectedDate) {
        this.minToDate = selectedDate;
        this.handleDateChange(selectedDate);
      }
    })

    this.errandForm.get('pickupLocation')?.valueChanges.subscribe(location => {
      if (location?.place?.latitude && location?.place?.longitude) {
        this.currentLocation = {lat: location.place.latitude, long: location.place.longitude};
      }
    })
  }


  submitErrandForm() {
    if (this.errandForm.valid) {
      const errandData = this.errandForm.value;
      console.log('Errand Service Request:', errandData);
      // Handle errand service request submission
    }
  }

  checkLocationValuesChanged(): void {
    const dropOffLocation = this.errandForm.get('dropOffLocation')?.value?.place;
    const pickupLocation = this.errandForm.get('pickupLocation')?.value?.place;

    if (dropOffLocation && pickupLocation) {
      const {latitude: dropOffLatitude, longitude: dropOffLongitude} = dropOffLocation;
      const {latitude: pickupLatitude, longitude: pickupLongitude} = pickupLocation;

      console.log('Pickup Location:', pickupLongitude, pickupLatitude);
      console.log('Dropoff Location:', dropOffLatitude, dropOffLongitude);
      this.driverValueChanges(pickupLatitude, pickupLongitude, dropOffLatitude, dropOffLongitude);
    }
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

  private calculateToDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  }

  private driverValueChanges(pickupLatitude: number, pickupLongitude: number, dropOffLatitude: number, dropOffLongitude: number): void {
    this.toAndFromCoordinates = {pickupLatitude, pickupLongitude, dropOffLatitude, dropOffLongitude};
  }
}
