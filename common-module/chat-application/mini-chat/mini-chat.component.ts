import {Component, NgZone, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {MaterialModule} from "../../../../material.module";
import {NgScrollbar, NgScrollbarModule} from "ngx-scrollbar";
import {Subject} from "rxjs";

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
    NgClass,
    NgScrollbarModule,
    AsyncPipe
  ],
  templateUrl: './mini-chat.component.html',
  styleUrl: './mini-chat.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MiniChatComponent implements OnInit {
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
  // Stream that will update title font size on scroll down
  readonly size$ = new Subject();
  // Get NgScrollbar reference
  @ViewChild(NgScrollbar, {static: true}) scrollable: NgScrollbar | undefined;
  text: string = randomText;

  constructor(private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.scrollToBottom()
  }

  sendMessage() {
    this.messages.push({
      "text": this.newMessage,
      "sender": "me",
      "date": "2024-10-18T10:00:00Z"
    },);
  }

  public scrollToBottom(): void {
    setTimeout(() => {
      try {
        // @ts-ignore
        this.scrollable.scrollTo({bottom: 0})
      } catch (err) {
        console.error('Scroll error:', err);
      }
    }, 2000); // You can adjust the delay if necessary
  }

  // ngAfterViewInit() {
  //   // @ts-ignore
  //   this._scrollSubscription = this.scrollbarRef.verticalScrolled
  //     .pipe(
  //       map((e: any) => (e.target.scrollTop > 50 ? '0.75em' : '1em')),
  //       tap((size: string) => this.ngZone.run(() => this.size$.next(size)))
  //     )
  //     .subscribe();
  // }
  //
  // ngOnDestroy() {
  //   this._scrollSubscription.unsubscribe();
  // }
}

const randomText = `Most widely-used formats of colour codes: HTML, RGB, HEX, HSB/HSV, HSL, CMYK and Delphi.
Averaged colour sampling for easy handling of colour noise.
3x, 9x and 15x magnifier and keyboard control of the mouse cursor movements for greater precision.
Calculation of the pixel distance between points.
Colour list for saving and reusing the picked colour samples.
The ability to open, edit and save Adobe Photoshop .aco colour swatches (Adobe color files) and GIMP .gpl palette files.
Interaction with the standard Windows or Mac OS colour dialog.
User’s comments and notes for any picked colour.
Conversion of HTML/Hexadecimal and RGB colour codes into the corresponding colours.
Red-Green-Blue (RGB), Cyan-Magenta-Yellow (CMY) and Red-Yellow-Blue (RYB) colour wheels with marked triads and complementary colours.
Harmonious colour scheme generator.
RGB, HSV and HSL colour editors for adjusting and editing colours.
Gradient transition between the two colours for creating a wide range of in-between hues.
Text tool for evaluating the readability of the selected font and background colour combinations.
Optional stay-on-top behaviour.
User-defined hotkey for capturing colour values.
Copying the colour code to the clipboard with one mouse click or automatically.
CSS-compatible colour codes.
High-DPI awareness.
Multiple monitors support.
No installation required. Just Color Picker is a portable application and can be run directly from a USB stick.
Multilingual interface: Afrikaans, Arabic, Bulgarian, Catalan, Chinese (Simplified and Traditional), Croatian, Czech, Danish, Dutch, English, Finnish, French, German, Greek, Hungarian, Italian, Japanese, Korean, Norwegian, Polish, Portuguese, Romanian, Russian, Serbian, Slovak, Slovenian, Spanish, Swedish, Thai, Turkish, Ukrainian and Uyghur.`;

