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

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, TablerIconsModule, MaterialModule],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
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
}

