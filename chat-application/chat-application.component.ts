import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MaterialModule} from "../../material.module";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {WorkerProfileComponent} from "../available-workers/worker-profile/worker-profile.component";
import {RouterOutlet} from "@angular/router";
import {ChatService, Message} from "./chat.service";

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
export class ChatApplicationComponent implements OnInit {
  users: ChatContact[] = [];
  conversationId = '671108f393262517c74a555f';
  userId = '6708df417f34f8c4c3df65da';
  messages = [{text: 'Hello!', sender: 'me', date: new Date('2024-10-15T10:15:00')}];
  newMessage = '';
  isProfileSectionVisible = false;
  showDate = false;
  selectedUser: ChatContact = {
    name: 'Please add contact',
    id: '',
    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    email: '',
    phoneNumber: 0
  };
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.loadChatContacts();
    this.subscribeToMessages();
    this.getAllMessages();
  }

  toggleProfileSection() {
    this.isProfileSectionVisible = !this.isProfileSectionVisible;
  }

  closeProfileSection() {
    this.isProfileSectionVisible = false;
  }

  getAllMessages() {
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

  mapMessages(messages: Message[]): any[] {
    return messages.map((message: Message) => ({
      text: message.content,
      sender: message.sender.id === this.userId ? 'me' : message.sender.firstName,
      date: new Date(message.createdAt)
    }));
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.conversationId, this.userId, this.newMessage).subscribe({
        next: () => this.newMessage = '', // Clear input on successful send
        error: (error) => console.error('Error sending message:', error)
      });
    }
  }

  selectUser(user: ChatContact) {
    this.selectedUser = user;
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  private loadChatContacts() {
    this.chatService.getChatContacts().subscribe({
      next: (response: any) => {
        const assignedUsers = this.extractAssignedUsers(response);
        this.users = this.getUniqueUsers(assignedUsers);
        this.selectedUser = this.users[0]; // Default to the first user
      },
      error: (error) => {
        console.error('Error fetching chat contacts:', error);
      }
    });
  }

  private extractAssignedUsers(response: any): ChatContact[] {
    return response.data.serviceOrderByUserId
      .map((order: any) => order.assignedUser ? {
        name: `${order.assignedUser.firstName} ${order.assignedUser.lastName}`,
        id: order.assignedUser.id,
        phoneNumber: order.assignedUser.phoneNumber,
        email: order.assignedUser.email,
        imageUrl: order.assignedUser.image
      } : null)
      .filter((user: ChatContact | null): user is ChatContact => user !== null); // Type guard for non-null users
  }

  private getUniqueUsers(users: ChatContact[]): ChatContact[] {
    return users.filter((user, index, self) =>
      index === self.findIndex((u) => u.id === user.id)
    );
  }

  private subscribeToMessages() {
    this.chatService.subscribeToMessages(this.conversationId).subscribe({
      next: (response: any) => this.handleNewMessage(response),
      error: (error) => console.error('Error subscribing to messages:', error)
    });
  }

  private handleNewMessage(response: any) {
    if (response?.data?.messageSent) {
      const newMessage = response.data.messageSent;
      const mappedMessage = {
        text: newMessage.content,
        sender: newMessage.sender.id === this.userId ? 'me' : newMessage.sender.firstName,
        date: new Date(newMessage.createdAt)
      };
      this.messages.push(mappedMessage);
      this.scrollToBottom();
      console.log('New message received:', newMessage);
    } else {
      console.error('Received empty response for messageSent:', response);
    }
  }
}
