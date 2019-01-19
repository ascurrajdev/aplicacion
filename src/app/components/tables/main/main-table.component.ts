import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Alert, Balance, BusinessYear, Egress, Income, Month, ConceptUpdateEvent, Tax } from './../../../interfaces';
import {Subscription} from 'rxjs';

import {BusinessYearsService} from './../../../services';

import {Data as D} from './../../../../custom/libraries';

interface MonthTotal { month: string; total: number; }

interface TableInput {
  month: string;
  amount: number;
  html_id: string;
  type_id: number;
}

interface TableRow {
  type: number; // -2 Fiscal, -1 Total, 0 - Header, 1 - Concept
  description: string;
  key?: number; // 0 Egresses, 1 Incomes
  cells?: string[];
  inputs?: TableInput[];
}

@Component({
  selector: 'app-main-table',
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.css']
})

export class MainTableComponent implements OnInit, OnDestroy {

  @Input() year: number;
  @Input() months: Month[];
  @Input() incomes: Income[];
  @Input() egresses: Egress[];
  @Input() sign: string;

  table_headers: string[] = [];
  table_rows: TableRow[] = [];

  total_incomes: MonthTotal[] = [];
  total_egresses: MonthTotal[] = [];

  fiscal_debit: Tax[] = [];
  fiscal_credit: Tax[] = [];
  ivas: Tax[] = [];
  taxes: Tax[] = [];
  monthlyBalance: Balance[] = [];
  accumalatedBalance: Balance[] = [];
  annual_tax = '';

  alerts = {};
  input_id_prefix = 'input_';
  input_rows = 0;
  by_subscription: Subscription;
  ai_subscription: Subscription;
  alert: Alert = {visible: false, message: '', button: ''};
  updated_incomes: Income[] = [];
  updated_egresses: Egress[] = [];

  constructor(public byService: BusinessYearsService) { }

  ngOnInit() {
    this.by_subscription = this.byService.getBusinessYearOnUpdateObservable().subscribe(by => this.businessYearDidUpdate(by));
    this._buildMonthTotals([...this.incomes], [...this.egresses]);
    this._updateFooter([...this.incomes], [...this.egresses]);
    this.updated_incomes = [...this.incomes];
    this.updated_egresses = [...this.egresses];

    const month_keys = this.months.map(m => m.key);
    this.table_headers = this.months.reduce((acc, m) => {
      acc.push(m.name);
      return acc;
    }, ['']);

    this.alerts = this.months.reduce((acc, m) => {
      acc[m.key] = true;
      return acc;
    }, {});

    const income_types: number[] = this.incomes.reduce((acc, i) => {
      const type_id = i.type.id;
      if (acc.indexOf(type_id) === -1) { acc.push(type_id); }
      return acc;
    }, []);

    const egress_categories: number[] = this.egresses.reduce((acc, e) => {
      const category_id = e.parent_type.id;
      if (acc.indexOf(category_id) === -1) { acc.push(category_id); }
      return acc;
    }, []);

    income_types.forEach((it, it_i) => {
      const incomes = this.incomes.filter((i) => i.type.id === it);
      if (it_i === 0) { this.table_rows.push({type: 0, description: 'Ingresos'}); }
      this.table_rows.push({
        type: 1,
        key: 1,
        description: incomes[0].type.name,
        inputs: incomes.reduce((acc: TableInput[], i) => {
          acc.push({month: i.month, amount: i.amount, type_id: it, html_id: this._getHTMLID(this.input_rows, i.month)});
          return acc;
        }, [])
      });
      this.input_rows++;
    });

    this.table_rows.push({type: -2, description: 'Débito Fiscal', cells: month_keys, key: 1});
    this.table_rows.push({type: -1, description: 'Total Ingresos', cells: month_keys, key: 1});
    this.table_rows.push({type: 0, description: ''});

    egress_categories.forEach((ec) => {
      const egresses = this.egresses.filter((e) => e.parent_type.id === ec);
      const types = egresses.reduce((acc, e) => {
        if (acc.indexOf(e.type.id) === -1) { acc.push(e.type.id); }
        return acc;
      }, []);

      types.forEach((t, t_i) => {
        const type_egresses = egresses.filter((e) => e.type.id === t);
        if (t_i === 0) { this.table_rows.push({type: 0, description: type_egresses[0].parent_type.name}); }
        this.table_rows.push({
          type: 1,
          key: 0,
          description: type_egresses[0].type.name,
          inputs: type_egresses.reduce((acc: TableInput[], te) => {
            acc.push({month: te.month, amount: te.amount, type_id: t, html_id: this._getHTMLID(this.input_rows, te.month)});
            return acc;
          }, [])
        });
        this.input_rows++;
      });
    });

    this.table_rows.push({type: -2, description: 'Crédito Fiscal', cells: month_keys, key: 0});
    this.table_rows.push({type: -1, description: 'Total Egresos', cells: month_keys, key: 0});
  }

  getFiscalDebit(month: string) {
    const debit: Tax = this.fiscal_debit.find((fd) => fd.month === month);
    return D.currency_format(debit ? debit.amount : 0, '', '', '.', 0);
  }

  getIncomeMonthTotal(month: string) {
    const total: MonthTotal = this.total_incomes.find((t) => t.month === month);
    return D.currency_format(total ? total.total : 0, '', '', '.', 0);
  }

  getFiscalCredit(month: string) {
    const credit: Tax = this.fiscal_credit.find((fc) => fc.month === month);
    return D.currency_format(credit ? credit.amount : 0, '', '', '.', 0);
  }

  getEgressMonthTotal(month: string) {
    const total: MonthTotal = this.total_egresses.find((t) => t.month === month);
    return D.currency_format(total ? total.total : 0, '', '', '.', 0);
  }

  onIncomeUpdate(event: ConceptUpdateEvent) {
    const {amount, type_id, month} = event;
    this.byService.updateBusinessYearIncome(this.year, month, type_id, amount);
  }

  onEgressUpdate(event: ConceptUpdateEvent) {
    const {amount, type_id, month} = event;
    this.byService.updateBusinessYearEgress(this.year, month, type_id, amount);
  }

  businessYearDidUpdate(by: BusinessYear) {
    const {year, incomes, egresses} = by;
    if (year === this.year) {
      this.updated_incomes = [...incomes];
      this.updated_egresses = [...egresses];
      this._buildMonthTotals([...incomes], [...egresses]);
      this._updateFooter([...incomes], [...egresses]);
    }
  }

  onInputEnter(input: HTMLElement) {
    const id = input.id;
    const matches = /(?:[\d]+)\_([\d]+)\_(\w+)$/.exec(id.replace(this.input_id_prefix, ''));
    if (matches.length === 3) {
      const row: number = Number(matches[1]) + 1;
      const month: string = matches[2];

      const last_row = row >= this.input_rows;
      const focus_row = last_row ? 0 : row;

      const months_last_index = this.months.length - 1;
      const month_index = this.months.findIndex((m) => m.key === month);

      const focus_month_index = last_row ? (month_index === months_last_index ? 0 : (month_index + 1)) : month_index;
      const focus_month =  this.months[focus_month_index].key;

      const focused_id = this._getHTMLID(focus_row, focus_month);
      document.getElementById(focused_id).focus();
    }
  }

  onAnnualTaxEnter = (element: HTMLElement) => { element.blur(); };
  annualTaxFocusOut() { this._updateFooter([...this.updated_incomes], [...this.updated_egresses]); }

  _getHTMLID(row: number, month: string) {
    return this.input_id_prefix.concat(String(this.year), '_', String(row), '_', month);
  }

  _buildMonthTotals(incomes: Income[], egresses: Egress[]) {
    const new_total_incomes: MonthTotal[] = [];
    const new_total_egresses: MonthTotal[] = [];

    this.months.forEach((m) => {
      const month = m.key;
      new_total_incomes.push({month: month, total: incomes.filter((i) => i.month === month).reduce((acc, i) => acc + i.amount, 0)});
      new_total_egresses.push({month: month, total: egresses.filter((e) => e.month === month).reduce((acc, e) => acc + e.amount, 0)});
    });

    this.total_incomes = [...new_total_incomes];
    this.total_egresses = [...new_total_egresses];
  }

  _updateFooter(incomes: Income[], egresses: Egress[]) {
    let month_alert: string = null;

    const taxes: Tax[] = [];
    const ivas: Tax[] = [];
    const fiscal_debit: Tax[] = [];
    const fiscal_credit: Tax[] = [];
    const b_monthly: Balance[] = [];
    const b_acc: Balance[] = [];

    let accumulated_balance = 0;
    this.months.forEach((m) => {
      const month = m.key;
      taxes.push({month: month, amount: 0});
      const month_incomes = incomes.filter((i) => i.month === month);
      const month_egresses = egresses.filter((e) => e.month === month);

      const acc_incomes: number = month_incomes.reduce((acc, i) => acc + i.amount, 0);
      const acc_egresses: number = month_egresses.reduce((acc, e) => acc + e.amount, 0);
      const net = acc_incomes - acc_egresses;

      const fd = month_incomes.reduce((acc, i) => acc + (i.type.tax !== 0 ? (i.amount / i.type.tax) : 0), 0);
      const fc = month_egresses.reduce((acc, e) => acc + (e.type.tax !== 0 ? (e.amount / e.type.tax) : 0), 0);
      const iva = fd - fc;

      fiscal_debit.push({month: month, amount: fd});
      fiscal_credit.push({month: month, amount: fc});

      const accumulated = net >= 0 ? (net - Math.abs(iva)) : (net - iva);
      accumulated_balance = accumulated_balance + accumulated;

      if (net < 0 && null === month_alert && this.alerts[month]) { month_alert = month; }

      ivas.push({month: month, amount: iva});
      b_monthly.push({month: month, amount: net});
      b_acc.push({month: month, amount: accumulated_balance});
    });

    this.taxes = [...taxes];
    this.ivas = [...ivas];
    this.monthlyBalance = [...b_monthly];
    this.accumalatedBalance = [...b_acc];
    this.fiscal_debit = [...fiscal_debit];
    this.fiscal_credit = [...fiscal_credit];

    if (null !== month_alert) {
      this._showNegativeAmountAlert(month_alert, true);
    }

    const a_tax: number = !D.is_numeric(this.annual_tax) ? 0 : Number(this.annual_tax);
    const annual_flow: number = accumulated_balance - a_tax;

    this.byService.updateAnnualFlow(this.year, annual_flow);
  }

  absoluteNumber(num: number) { return Math.abs(num); }
  currencyFormat(amount: number) { return D.currency_format(amount, '', '', '.', 0); }

  _showNegativeAmountAlert(month: string, toggle_notifications: boolean = false) {
    this.alert = {visible: true, message: 'Verifique los ingresos insertados o considere solicitar un préstamo', button: 'Cerrar'};
    if (toggle_notifications) { this.alerts[month] = false; }
  }

  onAlertClose() { this.alert = {visible: false, message: '', button: ''}; }
  ngOnDestroy() { this.by_subscription.unsubscribe(); }
}
