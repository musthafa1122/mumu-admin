import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {MaterialModule} from "../../../material.module";

@Component({
  selector: 'app-mini-chat',
  standalone: true,
  imports: [
    MatIcon,
    MaterialModule,
    FormsModule,
    DatePipe,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './mini-chat.component.html',
  styleUrl: './mini-chat.component.scss'
})
export class MiniChatComponent {
  newMessage: any;
  messages = [
    {
      "text": "Hello, how are you?",
      "sender": "John",
      "date": "2024-10-18T10:00:00Z"
    },
    {
      "text": "I'm doing well, thanks! How about you?",
      "sender": "me",
      "date": "2024-10-18T10:01:00Z"
    },
    {
      "text": "Did you finish the report?",
      "sender": "Alice",
      "date": "2024-10-18T10:02:00Z"
    },
    {
      "text": "Yes, I sent it yesterday.",
      "sender": "me",
      "date": "2024-10-18T10:03:00Z"
    },
    {
      "text": "Great! I'll check it out.",
      "sender": "Bob",
      "date": "2024-10-18T10:04:00Z"
    },
    {
      "text": "Are we still on for the meeting at 3 PM?",
      "sender": "me",
      "date": "2024-10-18T10:05:00Z"
    },
    {
      "text": "Yes, I'll be there.",
      "sender": "John",
      "date": "2024-10-18T10:06:00Z"
    },
    {
      "text": "Can you send me the meeting link?",
      "sender": "Alice",
      "date": "2024-10-18T10:07:00Z"
    },
    {
      "text": "Sure, I'll send it right now.",
      "sender": "me",
      "date": "2024-10-18T10:08:00Z"
    },
    {
      "text": "Thanks! Looking forward to it.",
      "sender": "Bob",
      "date": "2024-10-18T10:09:00Z"
    }
  ]

  sendMessage() {

  }
}
