import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {map, Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {OrderHistoryService, ServiceOrderData} from "../../service-module/order-history/order-history.service";
import {ApolloQueryResult} from "@apollo/client";

// Define the message type
interface Sender {
  id: string;
  firstName: string;
}

export interface Message {
  id: string;
  content: string;
  sender: Sender;
  createdAt: string;
}

interface Sender {
  id: string;
  firstName: string;
}

export interface Conversation {
  participants: {
    id: string;
    firstName: string;
    lastName: string;
  }[],
  messages: Message[],
}

const GET_ALL_MESSAGES = gql`query Query($conversationId: ID!) {
  getMessages(conversationId: $conversationId) {
    content
    conversationId
    createdAt
    sender {
      lastName
      firstName
      id
    }
  }
}`

const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription messageSent($conversationId: ID!) {
    messageSent(conversationId: $conversationId) {
      id
      content
      conversationId
      sender {
        id
        firstName
        lastName
      }
      createdAt
    }
  }
`;

const GET_CURRENT_USER_ID = gql`query Query($email: String!, $phoneNumber: String!) {
  getUserByEmailOrPhone(email: $email, phoneNumber: $phoneNumber) {
    id
    email
  }
}`

const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($conversationId: ID!, $senderId: ID!, $content: String!) {
    sendMessage(conversationId: $conversationId, senderId: $senderId, content: $content) {
      id
      content
      sender {
        id
        firstName
        lastName
      }
      createdAt
    }
  }
`;

const GET_CONVERSATION_ID = gql`query GetConversationByUserIds($user1Id: ID!, $user2Id: ID!) {
  getConversationByUserIds(user1Id: $user1Id, user2Id: $user2Id) {
    id
  }
}`

const CREATE_CONVERSATION = gql`mutation CreateConversation($participants: [ID!]!) {
  createConversation(participants: $participants) {
    id
  }
}`

const GET_CONVERSATION = gql`query GetConversations($userId: ID!) {
 query getConversations(userId: $userId) {
    id
    participants {
      id
      firstName
      lastName
    }
    messages {
      id
      content
      sender {
        id
        firstName
        lastName
      }
      createdAt
      conversationId
    }
  }
}`

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  constructor(private apollo: Apollo, private orderHistoryService: OrderHistoryService) {
  }

  subscribeToMessages(conversationId: string): Observable<Message[]> {
    // @ts-ignore
    return this.apollo.subscribe({
      query: NEW_MESSAGE_SUBSCRIPTION,
      variables: {conversationId},
    }).pipe(
      catchError(error => {
        console.error('Subscription error:', error);
        return throwError(error);
      })
    );
  }

  sendMessage(conversationId: string, senderId: string, content: string): Observable<Message> {
    // @ts-ignore
    return this.apollo.mutate({
      mutation: SEND_MESSAGE_MUTATION,
      variables: {conversationId, senderId, content},
    }).pipe(
      catchError(error => {
        console.error('Mutation error:', error);
        return throwError(error);
      })
    );
  }

  getConversation(userId: string): Observable<Conversation[]> {
    // @ts-ignore
    return this.apollo
      .watchQuery({
        query: GET_CONVERSATION,
        variables: {
          id: userId
        }
      })
      .valueChanges.subscribe((result: any) => {
      });
  }

  getChatContacts(userId: string): Observable<ApolloQueryResult<{ serviceOrders: ServiceOrderData[] }>> {
    return this.orderHistoryService.getServiceHistory(userId)
  }

  getMessages(conversationId: string): Observable<Conversation[]> {
    return this.apollo.watchQuery({
      query: GET_ALL_MESSAGES,
      variables: {
        conversationId: conversationId
      }
    }).valueChanges.pipe(
      map((result: any) => result.data.getMessages) // Adjust the path according to your query structure
    );
  }

  getConversationId(user1: string, user2: string): Observable<Conversation[]> {
    return this.apollo.watchQuery({
      query: GET_CONVERSATION_ID,
      variables: {
        user1Id: user1,
        user2Id: user2
      }
    }).valueChanges.pipe(
      map((result: any) => result.data?.getConversationByUserIds?.id) // Adjust the path according to your query structure
    );
  }

  getCurrentUserId(): Observable<string> {
    return this.apollo.watchQuery({
      query: GET_CURRENT_USER_ID,
      variables: {
        email: sessionStorage.getItem('email') || 'mhdmusthafa500@gmail.com',
        phoneNumber: ''
      }
    }).valueChanges.pipe(
      map((result: any) => result.data?.getUserByEmailOrPhone?.id) // Adjust the path according to your query structure
    );
  }

  createConversation(user1: string, user2: string): Observable<Conversation> {
    return this.apollo.mutate<{ createConversation: Conversation }>({
      mutation: CREATE_CONVERSATION,
      variables: {participants: [user1, user2]}
    }).pipe(
      map((response): any => response.data?.createConversation), // Extract the conversation from the response
      catchError(error => {
        console.error('Mutation error:', error);
        return throwError(() => error); // Throw the error properly for further handling
      })
    );
  }

}
