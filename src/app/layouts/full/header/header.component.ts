import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {TablerIconsModule} from 'angular-tabler-icons';
import {Router, RouterModule} from '@angular/router';
import {CommonModule, NgForOf} from '@angular/common';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {MaterialModule} from "../../../material.module";
import {BrandingComponent} from "../sidebar/branding.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, TablerIconsModule, MaterialModule, BrandingComponent],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .typewriter h4 {
      font-size: 12px;
      overflow: hidden; /* Ensures the content is not revealed until the animation */
      border-right: .15em solid #4fda9f; /* The typwriter cursor */
      white-space: nowrap; /* Keeps the content on a single line */
      margin: 0 auto; /* Gives that scrolling effect as the typing happens */
      letter-spacing: .15em; /* Adjust as needed */
      animation: typing 4.5s steps(30, end),
      blink-caret .5s step-end infinite;
    }

    /* The typing effect */
    @keyframes typing {
      from {
        width: 0
      }
      to {
        width: 100%
      }
    }

    /* The typewriter cursor effect */
    @keyframes blink-caret {
      from, to {
        border-color: transparent
      }
      50% {
        border-color: #4fda9f
      }
    }
  `],
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  constructor(private router: Router,) {

  }


  onItemSelected() {
    this.router.navigate(['/user']);
  }

  goHome() {
    window.location.href = 'https://memu-landing-page.web.app/';
  }
}

