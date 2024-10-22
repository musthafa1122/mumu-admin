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
    NgxMatTimepickerDirective
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

  // Define the form
  bystanderForm: FormGroup;
  isRecording = false;
  audioUrl: string | null = null;
  audioBlob: Blob | null = null;
  mediaRecorder: MediaRecorder | null = null;
  chunks: any[] = [];
  voiceNoteFileName: string = '';
  recordingTime: string = '00:00';
  audioChunks: any[] = [];
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
  currentLocation!: { lat: number; long: number; };
  private recordingInterval: any;
  private startTime: number = 0;

  constructor(private fb: FormBuilder) {
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
      fromTime: ['10:00', Validators.required],
      toDate: [this.calculateToDate(), Validators.required],
      toTime: ['18:00', Validators.required],
    });
  }

  deleteVoiceNote() {
    this.audioUrl = null;
    this.voiceNoteFileName = '';
    // Additional logic to remove the voice note from storage, if applicable.
  }

  submitBystanderForm() {
    if (this.bystanderForm.valid) {
      const bystanderData = this.bystanderForm.value;
      console.log('Bystander Service Request:', bystanderData);
      // Handle bystander service request submission
    }
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    this.isRecording = true;
    this.startTime = Date.now();
    this.updateRecordingTime();

    navigator.mediaDevices.getUserMedia({audio: true})
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();

        this.mediaRecorder.addEventListener('dataavailable', event => {
          this.audioChunks.push(event.data);
        });

        this.mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(this.audioChunks, {type: 'audio/wav'});
          this.audioUrl = URL.createObjectURL(audioBlob);
          this.voiceNoteFileName = `voice_note_${Date.now()}.wav`;
        });
      })
      .catch(error => {
        console.error('Error accessing microphone', error);
      });
  }

  stopRecording() {
    this.isRecording = false;
    clearInterval(this.recordingInterval);
    // @ts-ignore
    this.mediaRecorder.stop();
    this.audioChunks = [];  // Reset chunks after recording
    this.recordingTime = '00:00';  // Reset the timer after recording
  }

  updateRecordingTime() {
    this.recordingInterval = setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);

      // Update the recording time in mm:ss format
      this.recordingTime = `${this.padTime(minutes)}:${this.padTime(seconds)}`;
    }, 1000);
  }

  padTime(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  playVoiceNote() {
    if (this.audioUrl) {
      const audio = new Audio(this.audioUrl);
      audio.play();
    }
  }

  private calculateToDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  }
}
