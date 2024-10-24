import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

export interface Location {
  latitude: number;           // Required: Latitude of the location
  longitude: number;          // Required: Longitude of the location
  placeName: string;          // Required: Name of the place
  imageUrl?: string;          // Optional: URL of an image related to the location
  locationUrl?: string;       // Optional: URL for the location (e.g., a map link)
}

export interface ServiceOrderPatchPayload {
  pickupLocation: any | Location;
  dropOffLocation: any | Location;
  fromDate: string;
  fromTime: string;
  toDate: string; // ISO string format
  toTime: string;
  user: string; // User ID
  service: string; // Service ID
  genderPreferences: string;
  serviceType: string;
  specialRequirements: string[];
  bookingType: string;
  duration: string;
  mumuSuggestedPrice: number;
  serviceOfferPrice: number;
  vehicleType: 'string';
  userOfferedPrice: number;
  acceptedPrice: number;
  businessHours: string;
  distanceInKm: string;
  priorityLevels: string;
  additionalNotes: string[];
  additionalNotesVoice?: string | null; // Optional, can be null
  additionalServices?: string | any; // Comma-separated values
}

@Injectable({
  providedIn: 'root',
})
export class ServiceOrderHelperService {
  constructor(private fb: FormBuilder) {
  }

  createFormGroup() {
    return this.fb.group({
      serviceType: ['withoutCar', Validators.required],
      bookingType: ['one_time', Validators.required],
      duration: [''],
      additionalNotes: [[]],
      additionalNotesVoice: [''],
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
      specialRequirements: [''],
      genderPreferences: ['any'],
      priorityLevels: ['normal'],
      mumuSuggestedPrice: [0],
      serviceOfferPrice: [0],
      userOfferedPrice: [0],
      acceptedPrice: [0],
      vehicleType: ['Sedan'],
      bystanderGenderPreference: ['male', Validators.required],
      errandType: [['groceryShopping'], Validators.required],
      businessHours: [''],
      distanceInKm: [''],
      additionalServices: ['']
    });
  }

  patchServiceOrder(formValue: ServiceOrderPatchPayload, serviceId = '67085c2577bc64c98ab89f06', userId = '6708df417f34f8c4c3df65da'): ServiceOrderPatchPayload {
    return {
      pickupLocation: formValue.pickupLocation.place || null,
      dropOffLocation: formValue.dropOffLocation.place || null,
      fromDate: formValue.fromDate,
      fromTime: formValue.fromTime,
      toDate: formValue.toDate,
      toTime: formValue.toTime,
      user: userId,  // Replace with actual user ID
      service: serviceId,  // Replace with actual service ID
      genderPreferences: formValue.genderPreferences,
      serviceType: formValue.serviceType,
      specialRequirements: formValue.specialRequirements,
      bookingType: formValue.bookingType,
      duration: formValue.duration,
      vehicleType: formValue.vehicleType || 'Sedan',
      mumuSuggestedPrice: formValue.mumuSuggestedPrice,
      serviceOfferPrice: formValue.serviceOfferPrice,
      userOfferedPrice: formValue.userOfferedPrice,
      acceptedPrice: formValue.acceptedPrice,
      businessHours: formValue.businessHours,
      distanceInKm: formValue.distanceInKm,
      priorityLevels: formValue.priorityLevels,
      additionalNotes: formValue.additionalNotes,
      additionalNotesVoice: formValue.additionalNotesVoice ? formValue.additionalNotesVoice.toString() : null,
      additionalServices: formValue.additionalServices.join(','),
    }
  }

  getVehicleTypes() {
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

  getAdditionalServices() {
    return [
      {label: 'Luggage Assistance', value: 'luggageAssistance'},
      {label: 'Pet Transport', value: 'petTransport'},
      {label: 'Elderly Assistance', value: 'elderlyAssistance'},
      {label: 'Airport Transfer', value: 'airportTransfer'},
    ];
  }

  getMinTime(selectedDate: Date): string {
    let minTime: string = ''
    if (selectedDate.toDateString() === new Date().toDateString()) {
      const hours = new Date().getHours().toString().padStart(2, '0');
      const minutes = new Date().getMinutes().toString().padStart(2, '0');
      minTime = `${hours}:${minutes}`;
    } else {
      minTime = '00:00';
    }

    return minTime
  }

  constructCompleteDate(date: Date, time: string): Date {
    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);

    let adjustedHours = period === 'PM' && hours < 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours);
    const completeDate = new Date(date);
    completeDate.setHours(adjustedHours, minutes);
    return completeDate;
  }

  calculateDays(formGroup: FormGroup): { days: number; hours: number } | null {
    if (formGroup.valid) {
      const fromDate = formGroup.get('fromDate')?.value;
      const toDate = formGroup.get('toDate')?.value;
      const fromTime = formGroup.get('fromTime')?.value;
      const toTime = formGroup.get('toTime')?.value;

      const completeFromDate = this.constructCompleteDate(fromDate, fromTime);
      const completeToDate = this.constructCompleteDate(toDate, toTime);

      if (completeFromDate && completeToDate) {
        const diffInMs = completeToDate.getTime() - completeFromDate.getTime();
        const totalHours = diffInMs / (1000 * 60 * 60);

        const daysDifference = Math.floor(totalHours / 24);
        const hoursDifference = Math.floor(totalHours % 24);
        return {days: daysDifference, hours: hoursDifference};
      } else {
        console.error('Unable to calculate dates.');
        return null;
      }
    } else {
      console.error('Form is invalid');
      return null;
    }
  }

  private calculateToDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  }

}
