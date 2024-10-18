import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MaterialModule} from "../../material.module";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {WorkerProfileComponent} from "../available-workers/worker-profile/worker-profile.component";
import {RouterOutlet} from "@angular/router";
import {ChatService, Message} from "./chat.service";
import {Subscription} from "rxjs";

interface ChatContact {
  name: string;
  id: string;
  phoneNumber: number;
  email: string;
  imageUrl: string;
}

@Component({
  selector: 'app-chat-application',
  standalone: true,
  imports: [
    MaterialModule,
    NgClass,
    FormsModule,
    NgForOf,
    WorkerProfileComponent,
    RouterOutlet,
    NgIf,
    DatePipe
  ],
  templateUrl: './chat-application.component.html',
  styleUrls: ['./chat-application.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatApplicationComponent implements OnInit, OnDestroy {
  users: ChatContact[] = [];
  showDate = false;
  conversationId = '';
  loggedUserId = '';
  messages: { text: string; sender: string; date: Date }[] = [];
  newMessage = '';
  isProfileSectionVisible = false;
  selectedUser: ChatContact = this.getDefaultUser();
  messagesByChat: { [conversationId: string]: any[] } = {}; // Object to store messages for each chat
  subscriptions: Subscription[] = []; // Array to store subscriptions
  showFiller = false;
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.chatService.getCurrentUserId().subscribe(data => {
      this.loggedUserId = data;
      this.loadChatContacts();
    });
  }

  // Toggle profile section visibility
  toggleProfileSection() {
    this.isProfileSectionVisible = !this.isProfileSectionVisible;
  }

  closeProfileSection() {
    this.isProfileSectionVisible = false;
  }

  // Select a user and load the conversation
  selectUser(user: ChatContact) {
    this.selectedUser = user;
    this.messages = [];
    this.getConversationId(user.id, this.loggedUserId);
  }

  // Send a new message
  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.conversationId, this.loggedUserId, this.newMessage).subscribe({
        next: () => this.newMessage = '', // Clear input on successful send
        error: (error) => console.error('Error sending message:', error)
      });
    }
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions when the component is destroyed
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Load all chat contacts
  private loadChatContacts() {
    this.chatService.getChatContacts(this.loggedUserId).subscribe({
      next: (response: any) => {
        this.users = this.extractUniqueUsers(response);
        this.selectedUser = this.users[0]; // Default to the first user
        this.getConversationId(this.loggedUserId, this.selectedUser.id);
      },
      error: (error) => console.error('Error fetching chat contacts:', error)
    });
  }

  // Get conversation ID for the selected users
  private getConversationId(user1Id: string, user2Id: string) {
    this.chatService.getConversationId(user1Id, user2Id).subscribe({
      next: (data: any) => {
        this.conversationId = data;
        this.subscribeToMessages();
        this.getAllMessages();
      },
      error: (error: any) => {
        console.error('Error fetching conversation, trying to create one:', error);
        this.createConversation(user1Id, user2Id);
      }
    });
  }

  // Create a new conversation if it doesn't exist
  private createConversation(user1Id: string, user2Id: string) {
    this.chatService.createConversation(user1Id, user2Id).subscribe({
      next: (data: any) => {
        this.conversationId = data;
        this.subscribeToMessages();
      },
      error: (createError: any) => {
        console.error('Error creating conversation:', createError);
      }
    });
  }

  // Fetch all messages for the current conversation
  private getAllMessages() {
    this.chatService.getMessages(this.conversationId).subscribe({
      next: (data: Message[] | any) => {
        this.messages = this.mapMessages(data);
        this.scrollToBottom();
      },
      error: (error: any) => {
        console.error('Error fetching messages:', error);
      }
    });
  }

  // Map the messages to the desired format
  private mapMessages(messages: Message[]): any[] {
    return messages.map((message: Message) => ({
      text: message.content,
      sender: message.sender.id === this.loggedUserId ? 'me' : message.sender.firstName,
      date: new Date(message.createdAt)
    }));
  }

  // Subscribe to messages for the current conversation
  private subscribeToMessages() {
    const subscription = this.chatService.subscribeToMessages(this.conversationId).subscribe({
      next: (response: any) => this.handleNewMessage(response),
      error: (error) => console.error('Error subscribing to messages:', error)
    });
    this.subscriptions.push(subscription); // Track the subscription
  }

  // Handle incoming messages
  private handleNewMessage(response: any) {
    if (response?.data?.messageSent && response?.data?.messageSent.conversationId === this.conversationId) {
      const newMessage = response.data.messageSent;
      const mappedMessage = {
        text: newMessage.content,
        sender: newMessage.sender.id === this.loggedUserId ? 'me' : newMessage.sender.firstName,
        date: new Date(newMessage.createdAt)
      };

      // If the conversationId does not exist in messagesByChat, initialize it
      if (!this.messagesByChat[this.conversationId]) {
        this.messagesByChat[this.conversationId] = [];
      }

      // Push the new message to the corresponding conversation's message list
      this.messagesByChat[this.conversationId].push(newMessage);

      // Add the message to the currently active chat
      this.messages.push(mappedMessage);
      this.scrollToBottom();
    } else {
      console.error('Received empty response for messageSent:', response);
    }
  }

  // Scroll the message container to the bottom
  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  // Extract unique users from the response
  private extractUniqueUsers(response: any): ChatContact[] {
    const assignedUsers = response.data.serviceOrderByUserId.map((order: any) => {
      return order.assignedUser ? {
        name: `${order.assignedUser.firstName} ${order.assignedUser.lastName}`,
        id: order.assignedUser.id,
        phoneNumber: order.assignedUser.phoneNumber,
        email: order.assignedUser.email,
        imageUrl: order.assignedUser.image
      } : null;
    }).filter((user: ChatContact | null): user is ChatContact => user !== null);

    return this.getUniqueUsers(assignedUsers);
  }

  // Ensure users are unique by their IDs
  private getUniqueUsers(users: ChatContact[]): ChatContact[] {
    return users.filter((user, index, self) =>
      index === self.findIndex((u) => u.id === user.id)
    );
  }

  // Provide a default user
  private getDefaultUser(): ChatContact {
    return {
      name: 'Please add contact',
      id: '',
      imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      email: '',
      phoneNumber: 0
    };
  }
}
