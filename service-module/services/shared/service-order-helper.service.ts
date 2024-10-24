import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ServiceOrderService} from "../service-order.service";
import {OrderHistoryService} from "../../order-history/order-history.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {map, Observable, switchMap, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {ServiceStatus} from "../../available-workers/constants";

export interface Location {
  latitude: number;           // Required: Latitude of the location
  longitude: number;          // Required: Longitude of the location
  placeName: string;          // Required: Name of the place
  imageUrl?: string;          // Optional: URL of an image related to the location
  locationUrl?: string;       // Optional: URL for the location (e.g., a map link)
}

export interface ServiceOrderPatchPayload {
  id?: string | undefined;
  pickupLocation: any | Location;
  dropOffLocation: any | Location;
  fromDate: Date;
  fromTime: string;
  status: ServiceStatus;
  toDate: Date; // ISO string format
  toTime: string;
  user: string; // User ID
  service: any; // Service ID
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


  constructor(private fb: FormBuilder,
              private serviceOrderService: ServiceOrderService,
              private orderHistoryService: OrderHistoryService,
              private snackBar: MatSnackBar, private router: Router) {
  }

  createFormGroup() {
    return this.fb.group({
      id: undefined,
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

  patchServiceOrder(formValue: ServiceOrderPatchPayload, serviceId = '67085c2577bc64c98ab89f06', userId = '6708df417f34f8c4c3df65da', forSave = false): ServiceOrderPatchPayload {
    let pickupLocation = forSave ? formValue.pickupLocation.place : {place: formValue.pickupLocation};
    let dropOffLocation = forSave ? formValue.dropOffLocation.place : {place: formValue.dropOffLocation};
    console.log(pickupLocation)
    if (forSave) {
      pickupLocation = {
        latitude: formValue.pickupLocation.place.latitude,
        longitude: formValue.pickupLocation.place.longitude,
        placeName: formValue.pickupLocation.place.placeName,
        locationUrl: formValue.pickupLocation.place.locationUrl,
        imageUrl: formValue.pickupLocation.place.imageUrl
      }
      dropOffLocation = {
        latitude: formValue.dropOffLocation.place.latitude,
        longitude: formValue.dropOffLocation.place.longitude,
        placeName: formValue.dropOffLocation.place.placeName,
        locationUrl: formValue.dropOffLocation.place.locationUrl,
        imageUrl: formValue.dropOffLocation.place.imageUrl,
      }
    }

    return {
      id: formValue.id || undefined,
      pickupLocation: pickupLocation || null,
      dropOffLocation: dropOffLocation || null,
      fromDate: new Date(Number(formValue.fromDate)) || new Date(),
      fromTime: formValue.fromTime,
      toDate: new Date(Number(formValue.toDate)) || new Date(),
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
      status: formValue.status || 'Pending',  // Default to 'Pending' if not provided
      additionalNotes: formValue.additionalNotes,
      additionalNotesVoice: formValue.additionalNotesVoice ? formValue.additionalNotesVoice.toString() : null,
      additionalServices: formValue.additionalNotesVoice ? formValue.additionalServices.join(',') : null,
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
    if (new Date(selectedDate).toDateString() === new Date().toDateString()) {
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

  processServiceOrder(result: ServiceOrderPatchPayload, userId: string): Observable<any> {
    return this.serviceOrderService.saveServiceOrder(result).pipe(
      switchMap((response: any) => {
        // On successful save, get the service history
        return this.orderHistoryService.getServiceHistory(userId).pipe(
          map(data => {
            this.showSuccessSnackbar('Service Order successfully saved!');
            this.router.navigate([`service-home/service-order-details/${response.data.addServiceOrder.id}`]);
            return data; // Return the service history data
          })
        );
      }),
      catchError((error: any) => {
        this.handleError('Error saving Service Order:', error);
        return throwError(error); // Rethrow the error for further handling if needed
      })
    );
  }

  private showSuccessSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'right', // Position of the toast
      verticalPosition: 'top', // Position of the toast
      panelClass: ['success-snackbar'] // Optional: Custom CSS class for styling
    });
  }

  private handleError(message: string, error: any): void {
    this.snackBar.open('An error occurred while processing your request.', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'] // Optional: Custom CSS class for error styling
    });
  }

  private calculateToDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  }
}
