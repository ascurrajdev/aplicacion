import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';

import {Income, Egress, Balance, Month, Tax, BusinessYear} from './../../../interfaces';
import {BusinessYearsService} from './../../../services';

import {Data as D} from './../../../../custom/libraries';

@Component({
  selector: 'app-table-total',
  templateUrl: './table-total.component.html',
  styleUrls: ['./table-total.component.css']
})
export class TableTotalComponent implements OnInit, OnDestroy {

  @Input() year: number;
  @Input() months: Month[];
  @Input() egresses: Egress[];
  @Input() incomes: Income[];

  ivas: Tax[] = [];
  taxes: Tax[] = [];
  monthlyBalance: Balance[] = [];
  accumalatedBalance: Balance[] = [];
  alerts = {};

  table_headers: string[] = [''];

  by_subscription: Subscription;

  constructor(public byService: BusinessYearsService) { }

  ngOnInit() {
    this.by_subscription = this.byService.getBusinessYearOnUpdateObservable().subscribe(by => this.businessYearDidUpdate(by));

    this.months.forEach((m) => {
      this.table_headers.push(m.name);
      this.alerts[m.key] = true;
    });

    this._updateTotals([...this.months], [...this.incomes], [...this.egresses]);
  }

  businessYearDidUpdate(by: BusinessYear) {
    const {year} = by;
    if (year === this.year) {
      const {incomes, egresses} = by;
      this._updateTotals([...this.months], [...incomes], [...egresses]);
    }
  }

  _updateTotals(months: Month[], incomes: Income[], egresses: Egress[]) {
    let month_alert: string = null;

    const taxes: Tax[] = [];
    const ivas: Tax[] = [];
    const b_monthly: Balance[] = [];
    const b_acc: Balance[] = [];

    let accumulated_balance = 0;
    months.forEach((m) => {
      const month = m.key;
      taxes.push({month: month, amount: 0});
      const acc_incomes: number = incomes.filter((i) => i.month === month).reduce((acc, i) => acc + i.amount, 0);
      const acc_egresses: number = egresses.filter((e) => e.month === month).reduce((acc, e) => acc + e.amount, 0);
      const net = acc_incomes - acc_egresses;
      const iva = net <= 0 ? 0 : (net * .10);
      const accumulated = accumulated_balance + (net - iva);
      accumulated_balance = accumulated;

      if (net < 0 && null === month_alert && this.alerts[month]) { month_alert = month; }

      ivas.push({month: month, amount: iva});
      b_monthly.push({month: month, amount: net});
      b_acc.push({month: month, amount: accumulated});
    });

    this.taxes = [...taxes];
    this.ivas = [...ivas];
    this.monthlyBalance = [...b_monthly];
    this.accumalatedBalance = [...b_acc];

    if (null !== month_alert) {
      this._showNegativeAmountAlert(month_alert, true);
    }
  }

  currencyFormat(amount: number) { return D.currency_format(amount); }

  _showNegativeAmountAlert(month: string, toggle_notifications: boolean = false) {
    if (toggle_notifications) { this.alerts[month] = false; }
  }

  ngOnDestroy() {
    this.by_subscription.unsubscribe(); // Avoid Memory Leak
  }
}
