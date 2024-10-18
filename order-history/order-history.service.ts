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

export interface ServiceOrderData {
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
  user: User; // Include the user information in the service order
}

export const GET_SERVICE_ORDERS = gql`
  query ServiceOrderByUserId($userId: ID!) {
  serviceOrderByUserId(userId: $userId) {
    id
    orderId
    serviceType
    title
    location
    dateRequested
    salary
    orderType
    duration
    status
    imageUrl
    specialNotes
    email
    user {
      firstName
      lastName
      id
      phoneNumber
      email
      image
    }
    assignedUser {
      firstName
      lastName
      id
      phoneNumber
      email
      image
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
