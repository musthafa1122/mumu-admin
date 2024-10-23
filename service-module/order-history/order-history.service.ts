import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators'; // Import catchError from rxjs/operators
import {ServiceStatus} from "../available-workers/constants";
import {ApolloQueryResult} from "@apollo/client";

export interface User {
  id: string; // Ensure the type matches your backend's user ID type
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phoneNumber: string;
  state: string;
  city: string;
  dob: string;
  gender: string;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
}

export interface Location {
  latitude: number;        // Number type for latitude
  longitude: number;       // Number type for longitude
  placeName: string;       // String type for placeName
  imageUrl?: string;       // Optional string field (use ? to make it optional)
  locationUrl?: string;    // Optional string field
}


export interface Service {
  id: string;
  imgSrc: string,
  title: string,
  description: string,
  price: number, // Use Number as the price is a number in your data
  negotiatedPrice: number, // Use Number as well
  parentServiceType: string
}

export interface ServiceOrderData {
  bookingType: string;
  fromDate: Date;
  pickupLocation: Location;
  dropOffLocation?: Location;
  service: Service;
  id: number;
  serviceType: string;
  title: string;
  location: string;
  dateRequested: string;
  salary: number;
  orderType: string;
  duration: string;
  status: ServiceStatus;
  imageUrl?: string;
  specialNotes?: string;
  email: string;
  user: User;
  assignedUser: User;// Include the user information in the service order
}

export const GET_SERVICE_ORDERS = gql`
  query Query($userId: ID!) {
  serviceOrderByUserId(userId: $userId) {
    id
    serviceType
    duration
    bookingType
    pickupLocation {
      latitude
      longitude
      placeName
      imageUrl
      locationUrl
    }
    fromDate
    fromTime
    toDate
    toTime
    status
    service {
      imgSrc
      title
      description
      price
      negotiatedPrice
      parentServiceType
    }
    assignedUser {
      firstName
      lastName
    }
    createdAt
    updatedAt
    dropOffLocation {
      latitude
      longitude
      placeName
      imageUrl
      locationUrl
    }
  }
}
`;

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  constructor(private apollo: Apollo) {
  }

  public getServiceHistory(userId: string
  ): Observable<ApolloQueryResult<{
    serviceOrders: ServiceOrderData[]
  }>> {
    return this.apollo
      .watchQuery<{ serviceOrders: ServiceOrderData[] }>({
        query: GET_SERVICE_ORDERS,
        variables: {
          userId: userId
        }
      })
      .valueChanges.pipe(
        catchError(error => {
          console.error('Query error:', error); // Corrected log message
          return throwError(error); // Ensure throwError is imported
        })
      );
  }
}
