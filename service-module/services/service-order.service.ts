import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {catchError, tap} from "rxjs/operators";
import {throwError} from "rxjs";

export const MUTATE_SERVICE_ORDERS = gql`
mutation Mutation($pickupLocation: LocationInput!, $fromDate: String!, $mumuSuggestedPrice: Float!, $serviceOfferPrice: Float!, $fromTime: String!, $user: ID!, $service: ID!, $serviceType: String, $genderPreferences: String, $duration: String, $specialRequirements: [String], $bookingType: String, $priorityLevels: String, $additionalNotes: [String], $additionalNotesVoice: String, $dropOffLocation: LocationInput, $userOfferedPrice: Float, $acceptedPrice: Float, $toDate: String, $toTime: String, $assignedUser: ID, $distanceInKm: String, $businessHours: String) {
  addServiceOrder(pickupLocation: $pickupLocation, fromDate: $fromDate, mumuSuggestedPrice: $mumuSuggestedPrice, serviceOfferPrice: $serviceOfferPrice, fromTime: $fromTime, user: $user, service: $service, serviceType: $serviceType, genderPreferences: $genderPreferences, duration: $duration, specialRequirements: $specialRequirements, bookingType: $bookingType, priorityLevels: $priorityLevels, additionalNotes: $additionalNotes, additionalNotesVoice: $additionalNotesVoice, dropOffLocation: $dropOffLocation, userOfferedPrice: $userOfferedPrice, acceptedPrice: $acceptedPrice, toDate: $toDate, toTime: $toTime, assignedUser: $assignedUser, distanceInKm: $distanceInKm, businessHours: $businessHours) {
    id
    status
  }
}
`;

@Injectable({
  providedIn: 'root',
})
export class ServiceOrderService {
  constructor(private apollo: Apollo) {
  }

  saveServiceOrder(variables: any) {
    return this.apollo
      .mutate({
        mutation: MUTATE_SERVICE_ORDERS,
        variables: variables,
      })
      .pipe(
        tap((data) => {
          console.log('Service order saved:', data);  // Log message for success
        }),
        catchError((error) => {
          console.error('Error saving service order:', error);  // Log message for error
          return throwError(error);  // Re-throw the error for further handling if necessary
        })
      );
  }
}
