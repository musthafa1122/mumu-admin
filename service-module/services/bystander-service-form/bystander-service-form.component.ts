import {Component, ViewEncapsulation} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../../../../material.module";
import {
  GoogleMapDrawingsComponent
} from "../../../../components/google-map/google-map-drawings/google-map-drawings.component";
import {
  GoogleMapSearchBoxComponent
} from "../../../../components/google-map/google-map-search-box/google-map-search-box.component";
import {NgxMatTimepickerComponent, NgxMatTimepickerDirective} from "ngx-mat-timepicker";
import {AudioRecordingComponent} from "../../../../components/audio-recording/audio-recording.component";
import {ServiceOrderService} from "../service-order.service";

@Component({
  selector: 'app-bystander-service-form',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    GoogleMapDrawingsComponent,
    GoogleMapSearchBoxComponent,
    NgxMatTimepickerComponent,
    NgxMatTimepickerDirective,
    AudioRecordingComponent
  ],
  templateUrl: './bystander-service-form.component.html',
  styleUrl: './bystander-service-form.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BystanderServiceFormComponent {
  bystanderServiceTypes = [
    {label: "Hospital Bystander", value: "hospitalBystander"},
    {label: "Home Care Bystander", value: "homeCareBystander"},
    {label: "Elderly Caregiver", value: "elderlyCaregiver"},
    {label: "Disabled Caregiver", value: "disabledCaregiver"},
    {label: "Child Care Bystander", value: "childCareBystander"},
    {label: "Post-Surgery Care", value: "postSurgeryCare"}
  ];

  genderPreferences = [
    {label: "Male", value: "male"},
    {label: "Female", value: "female"},
  ];

  durations = [
    {label: "Hourly", value: "hourly"},
    {label: "Daily", value: "daily"},
    {label: "Weekly", value: "weekly"},
    {label: "Monthly", value: "monthly"}
  ];

  specialRequirements = [
    {label: "CPR Certified", value: "cprCertified"},
    {label: "Lifting Assistance", value: "liftingAssistance"},
    {label: "Medication Administration", value: "medicationAdministration"},
    {label: "Dementia Care", value: "dementiaCare"}
  ];

  bystanderForm: FormGroup;
  minTime!: string;
  minDate!: Date;
  showProgress = false;
  toAndFromCoordinates!: {
    pickupLatitude: number;
    pickupLongitude: number;
    dropOffLatitude: number;
    dropOffLongitude: number;
  };
  currentLocation!: { lat: number; long: number; };

  constructor(private fb: FormBuilder, private serviceOrderService: ServiceOrderService) {
    this.bystanderForm = this.fb.group({
      serviceType: [['hospitalBystander'], Validators.required],
      genderPreferences: ['male', Validators.required],
      duration: [''],
      specialRequirements: [[]],
      bookingType: ['one_time', Validators.required],
      priorityLevels: ['high', Validators.required],
      additionalNotes: [[]],
      pickupLocation: this.fb.group({
        place: ['', Validators.required],
      }),
      fromDate: [new Date(), Validators.required],
      additionalNotesVoice: [],
      fromTime: ['10:00', Validators.required],
      toDate: [this.calculateToDate(), Validators.required],
      toTime: ['18:00', Validators.required],
    });
  }

  submitBystanderForm() {
    if (this.bystanderForm.valid) {
      const bystanderData = this.bystanderForm.value;

      // Convert the form data to the format required for the GraphQL mutation
      const variables = {
        pickupLocation: bystanderData.pickupLocation.place,
        fromDate: bystanderData.fromDate.toISOString(),
        fromTime: bystanderData.fromTime,
        toDate: bystanderData.toDate.toISOString(),
        toTime: bystanderData.toTime,
        user: '6708df417f34f8c4c3df65da',  // Replace with the logged-in user ID
        service: '67085c2577bc64c98ab89f06',  // Replace with the service ID
        genderPreferences: bystanderData.genderPreferences,
        serviceType: bystanderData.serviceType.join(','),
        specialRequirements: bystanderData.specialRequirements,
        bookingType: bystanderData.bookingType,
        priorityLevels: bystanderData.priorityLevels,
        additionalNotes: bystanderData.additionalNotes,
        mumuSuggestedPrice: 0,
        serviceOfferPrice: 0,
        userOfferedPrice: 0,
        acceptedPrice: 0,
        additionalNotesVoice: bystanderData.additionalNotesVoice ? bystanderData.additionalNotesVoice.toString() : null,
      };
      console.log('Submitting Bystander Service Request:', variables);
      this.serviceOrderService.saveServiceOrder(variables);
    } else {
      console.log('Form is invalid');
    }
  }


  private calculateToDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  }
}
