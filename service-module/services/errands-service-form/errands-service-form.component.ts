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

@Component({
  selector: 'app-errands-service-form',
  standalone: true,
  imports: [MaterialModule,
    ReactiveFormsModule,
    CommonModule, GoogleMapDrawingsComponent, GoogleMapSearchBoxComponent, NgxMatTimepickerComponent, NgxMatTimepickerDirective],
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

  durations = [
    {label: "Hourly", value: "hourly"},
    {label: "Daily", value: "daily"},
    {label: "Weekly", value: "weekly"}
  ];

  additionalNotes = [
    {label: "Fragile Items", value: "fragileItems"},
    {label: "Perishable Items", value: "perishableItems"},
    {label: "Special Handling Required", value: "specialHandlingRequired"}
  ];
  currentLocation!: { lat: number; long: number; };
  // Define the form
  errandForm: FormGroup;
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
  private recordingInterval: any;
  private startTime: number = 0;

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

  deleteVoiceNote() {
    this.audioUrl = null;
    this.voiceNoteFileName = '';
    // Additional logic to remove the voice note from storage, if applicable.
  }

  submitErrandForm() {
    if (this.errandForm.valid) {
      const errandData = this.errandForm.value;
      console.log('Errand Service Request:', errandData);
      // Handle errand service request submission
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
