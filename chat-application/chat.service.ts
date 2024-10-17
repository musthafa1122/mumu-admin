import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

// Define the message type
interface Sender {
  id: string;
  firstName: string;
}

interface Message {
  id: string;
  content: string;
  sender: Sender;
  createdAt: string;
}

const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription messageSent($conversationId: ID!) {
    messageSent(conversationId: $conversationId) {
      id
      content
      sender {
        id
        firstName
      }
      createdAt
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($conversationId: ID!, $senderId: ID!, $content: String!) {
    sendMessage(conversationId: $conversationId, senderId: $senderId, content: $content) {
      id
      content
      sender {
        id
        firstName
      }
      createdAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private apollo: Apollo) {
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
}
