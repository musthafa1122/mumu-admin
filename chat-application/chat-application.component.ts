import {Component, ViewEncapsulation} from '@angular/core';
import {MaterialModule} from "../../material.module";
import {TablerIconsModule} from "angular-tabler-icons";
import {NgScrollbarModule} from "ngx-scrollbar";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {WorkerProfileComponent} from "../available-workers/worker-profile/worker-profile.component";
import {AppNavItemComponent} from "../../layouts/full/sidebar/nav-item/nav-item.component";
import {HeaderComponent} from "../../layouts/full/header/header.component";
import {RouterOutlet} from "@angular/router";
import {SidebarComponent} from "../../layouts/full/sidebar/sidebar.component";

@Component({
  selector: 'app-chat-application',
  standalone: true,
  imports: [MaterialModule, NgScrollbarModule, TablerIconsModule, NgClass, FormsModule, NgForOf, WorkerProfileComponent, AppNavItemComponent, HeaderComponent, RouterOutlet, SidebarComponent, NgIf, DatePipe],
  templateUrl: './chat-application.component.html',
  styleUrl: './chat-application.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ChatApplicationComponent {
  menuItems = [
    {label: 'Home', icon: 'home'},
    {label: 'Chats', icon: 'chat'},
    {label: 'Profile', icon: 'account_circle'},
    {label: 'Settings', icon: 'settings'}
  ];

  users = [
    {profilePic: '/assets/images/profile/user-1.jpg', name: 'Roman', orderId: 'Order ID: 12345'},
    {profilePic: '/assets/images/profile/user-2.jpg', name: 'Salma', orderId: 'Order ID: 12346'},
    {profilePic: '/assets/images/profile/user-3.jpg', name: 'John', orderId: 'Order ID: 12347'},
    {profilePic: '/assets/images/profile/user-4.jpg', name: 'Jolly', orderId: 'Order ID: 12348'},
    {profilePic: '/assets/images/profile/user-1.jpg', name: 'Alex', orderId: 'Order ID: 12349'},
    {profilePic: '/assets/images/profile/user-2.jpg', name: 'Sophia', orderId: 'Order ID: 12350'},
    {profilePic: '/assets/images/profile/user-3.jpg', name: 'Michael', orderId: 'Order ID: 12351'},
    {profilePic: '/assets/images/profile/user-4.jpg', name: 'Isabella', orderId: 'Order ID: 12352'},
    {profilePic: '/assets/images/profile/user-1.jpg', name: 'David', orderId: 'Order ID: 12353'},
    {profilePic: '/assets/images/profile/user-2.jpg', name: 'Emily', orderId: 'Order ID: 12354'},
    {profilePic: '/assets/images/profile/user-3.jpg', name: 'Daniel', orderId: 'Order ID: 12355'},
    {profilePic: '/assets/images/profile/user-4.jpg', name: 'Olivia', orderId: 'Order ID: 12356'},
    {profilePic: '/assets/images/profile/user-1.jpg', name: 'James', orderId: 'Order ID: 12357'},
    {profilePic: '/assets/images/profile/user-2.jpg', name: 'Ava', orderId: 'Order ID: 12358'},
    {profilePic: '/assets/images/profile/user-3.jpg', name: 'William', orderId: 'Order ID: 12359'},
    {profilePic: '/assets/images/profile/user-4.jpg', name: 'Mia', orderId: 'Order ID: 12360'},
    {profilePic: '/assets/images/profile/user-1.jpg', name: 'Henry', orderId: 'Order ID: 12361'},
    {profilePic: '/assets/images/profile/user-2.jpg', name: 'Charlotte', orderId: 'Order ID: 12362'},
    {profilePic: '/assets/images/profile/user-3.jpg', name: 'Matthew', orderId: 'Order ID: 12363'},
    {profilePic: '/assets/images/profile/user-4.jpg', name: 'Amelia', orderId: 'Order ID: 12364'},
    {profilePic: '/assets/images/profile/user-1.jpg', name: 'Ethan', orderId: 'Order ID: 12365'},
    {profilePic: '/assets/images/profile/user-2.jpg', name: 'Harper', orderId: 'Order ID: 12366'},
    {profilePic: '/assets/images/profile/user-3.jpg', name: 'Lucas', orderId: 'Order ID: 12367'},
    {profilePic: '/assets/images/profile/user-4.jpg', name: 'Evelyn', orderId: 'Order ID: 12368'}
  ];
  selectedUser = this.users[0]; // Default selected user for chat

  messages = [
    {text: 'Hello!', sender: 'me', date: new Date('2024-10-15T10:15:00')},
    {text: 'Hi Roman!', sender: 'Roman', date: new Date('2024-10-15T10:16:00')},
    {text: 'How are you?', sender: 'me', date: new Date('2024-10-15T10:17:00')},
    {text: 'I am doing well, thanks!', sender: 'Roman', date: new Date('2024-10-15T10:18:00')},
    {text: 'What are you up to today?', sender: 'me', date: new Date('2024-10-15T10:19:00')},
    {text: 'Just working on some projects.', sender: 'Roman', date: new Date('2024-10-15T10:20:00')},
    {text: 'That sounds good! Need any help?', sender: 'me', date: new Date('2024-10-15T10:21:00')},
    {text: 'Not at the moment, but thanks!', sender: 'Roman', date: new Date('2024-10-15T10:22:00')},
    {text: 'Any plans for the weekend?', sender: 'me', date: new Date('2024-10-15T10:23:00')},
    {text: 'Thinking of going hiking.', sender: 'Roman', date: new Date('2024-10-15T10:24:00')},
    {text: 'That sounds fun! Where?', sender: 'me', date: new Date('2024-10-15T10:25:00')},
    {text: 'Probably in the mountains nearby.', sender: 'Roman', date: new Date('2024-10-15T10:26:00')},
    {text: 'Nice! I love hiking.', sender: 'me', date: new Date('2024-10-15T10:27:00')},
    {text: 'We should go together sometime.', sender: 'Roman', date: new Date('2024-10-15T10:28:00')},
    {text: 'Definitely! Let’s plan it.', sender: 'me', date: new Date('2024-10-15T10:29:00')},
    {text: 'Sounds good. I’ll check my schedule.', sender: 'Roman', date: new Date('2024-10-15T10:30:00')},
    {text: 'Let me know!', sender: 'me', date: new Date('2024-10-15T10:31:00')},
    {text: 'Will do! Any other updates from your side?', sender: 'Roman', date: new Date('2024-10-15T10:32:00')},
    {text: 'Not much, just busy with work.', sender: 'me', date: new Date('2024-10-15T10:33:00')},
    {text: 'I feel you. It’s been hectic lately.', sender: 'Roman', date: new Date('2024-10-15T10:34:00')},
    {text: 'Yeah, we need a break!', sender: 'me', date: new Date('2024-10-15T10:35:00')}
  ];


  newMessage = '';

  profile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    location: 'Munich, Germany',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg'
  };
  isProfileSectionVisible: boolean = false; // State to control profile section visibility
  // Function to close the profile section
  showDate = false;

  // Function to toggle the profile section visibility
  toggleProfileSection() {
    this.isProfileSectionVisible = !this.isProfileSectionVisible;
  }

  closeProfileSection() {
    this.isProfileSectionVisible = false;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({text: this.newMessage, sender: 'me', date: new Date()});
      this.newMessage = '';
    }
  }

  public selectUser(user: { orderId: string; profilePic: string; name: string }) {
    this.selectedUser = user;
    // this.toggleProfileSection()
  }
}
