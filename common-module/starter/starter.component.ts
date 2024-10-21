import {Component, ViewEncapsulation} from '@angular/core';
import {MaterialModule} from '../../../material.module';
import {AppRecentTransactionsComponent} from "../../../components/recent-transactions/recent-transactions.component";
import {AppSalesOverviewComponent} from "../../../components/sales-overview/sales-overview.component";
import {AppYearlyBreakupComponent} from "../../../components/yearly-breakup/yearly-breakup.component";
import {AppMonthlyEarningsComponent} from "../../../components/monthly-earnings/monthly-earnings.component";
import {AppProductPerformanceComponent} from "../../../components/product-performance/product-performance.component";
import {UserComponent} from "../../../components/user/user.component";
import {TablerIconsModule} from "angular-tabler-icons";
import {ServiceHomeComponent} from "../../../components/service-home/service-home.component";


@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    AppSalesOverviewComponent,
    AppYearlyBreakupComponent,
    AppMonthlyEarningsComponent,
    AppRecentTransactionsComponent,
    AppProductPerformanceComponent,
    UserComponent,
    TablerIconsModule,
    ServiceHomeComponent
  ],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`.home-service {
    display: flex;
    flex-direction: column;
    gap: 14px;
    align-items: flex-start;

  }`]
})
export class StarterComponent {
  applyFilter($event: KeyboardEvent) {

  }
}
