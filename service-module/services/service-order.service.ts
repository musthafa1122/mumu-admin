import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {catchError, tap} from "rxjs/operators";
import {map, Observable, throwError} from "rxjs";
import {ServiceOrderPatchPayload} from "./shared/service-order-helper.service";

export const MUTATE_SERVICE_ORDERS = gql`
mutation Mutation($pickupLocation: LocationInput!, $fromDate: String!, $mumuSuggestedPrice: Float!, $serviceOfferPrice: Float!, $fromTime: String!, $user: ID!, $service: ID!, $serviceType: String, $genderPreferences: String, $duration: String, $specialRequirements: [String], $bookingType: String, $priorityLevels: String, $additionalNotes: [String], $additionalNotesVoice: String, $dropOffLocation: LocationInput, $userOfferedPrice: Float, $acceptedPrice: Float, $toDate: String, $toTime: String, $assignedUser: ID, $distanceInKm: String, $businessHours: String) {
  addServiceOrder(pickupLocation: $pickupLocation, fromDate: $fromDate, mumuSuggestedPrice: $mumuSuggestedPrice, serviceOfferPrice: $serviceOfferPrice, fromTime: $fromTime, user: $user, service: $service, serviceType: $serviceType, genderPreferences: $genderPreferences, duration: $duration, specialRequirements: $specialRequirements, bookingType: $bookingType, priorityLevels: $priorityLevels, additionalNotes: $additionalNotes, additionalNotesVoice: $additionalNotesVoice, dropOffLocation: $dropOffLocation, userOfferedPrice: $userOfferedPrice, acceptedPrice: $acceptedPrice, toDate: $toDate, toTime: $toTime, assignedUser: $assignedUser, distanceInKm: $distanceInKm, businessHours: $businessHours) {
    id
    status
  }
}
`;

export const GET_SERVICE_ORDERS_BY_ID = gql`
  query ServiceOrderById($serviceOrderByIdId: ID!) {
  serviceOrderById(id: $serviceOrderByIdId) {
    acceptedPrice
    additionalNotes
    additionalNotesVoice
    assignedUser {
      firstName
      lastName
      id
    }
    bookingType
    businessHours
    createdAt
    distanceInKm
    dropOffLocation {
      latitude
      longitude
      placeName
      imageUrl
      locationUrl
    }
    duration
    fromDate
    fromTime
    genderPreferences
    id
    mumuSuggestedPrice
    pickupLocation {
      latitude
      longitude
      placeName
      imageUrl
      locationUrl
    }
    priorityLevels
    service {
      id
      imgSrc
      title
      description
      price
      negotiatedPrice
      parentServiceType
    }
    serviceOfferPrice
    serviceType
    specialRequirements
    status
    toDate
    toTime
    updatedAt
    user {
      id
    }
    userOfferedPrice
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

  fetchOrderDetails(orderId: string): Observable<ServiceOrderPatchPayload> {
    return this.apollo
      .watchQuery({
        query: GET_SERVICE_ORDERS_BY_ID,
        variables: {
          serviceOrderByIdId: orderId
        }
      })
      .valueChanges.pipe(
        map((result: any) => result?.data?.serviceOrderById) // Use RxJS operators to transform the result
      );
  }
}
