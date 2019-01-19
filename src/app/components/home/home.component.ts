import { Component, OnInit, ViewChild } from '@angular/core';
import {MatAccordion} from '@angular/material';
import { TableResultsComponent } from './../tables/table-results/table-results.component';

import {Alert, BusinessYear, Concept, Income, Egress, Month, AnnualFlow} from './../../interfaces';
import {BusinessYearsService} from './../../services';

import {Data as D} from './../../../custom/libraries';
import Constants from './../../../custom/Constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private show_alert = true;
  private alert_num = 0;

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(TableResultsComponent) tableResults: TableResultsComponent;

  business_years: BusinessYear[] = [];
  annual_flows: AnnualFlow[] = [];

  investment = 0;
  project = '';
  rate = 0;
  sign = '';
  currency_id = 0;
  token = '';
  years = 0;

  months: Month[] = Constants.getMonths();
  income_types: Concept[] = Constants.getIncomeTypes();
  egress_types: Concept[] = Constants.getEgressTypes();
  egress_categories: Concept[] = Constants.getEgressCategories();

  accordion_multiple = false;
  alert: Alert = {visible: false, message: '', button: ''};
  alert_logout: Alert = {visible: false, message: '¿Desea cerrar su sesión?', button: 'Aceptar'};

  constructor(public by$: BusinessYearsService) { }

  ngOnInit() {
    const prod = Constants.getEnvironment() === 'production';
    const initial_data = localStorage.getItem('payload');
    if (prod && typeof initial_data !== 'string') { window.location.href = '/login'; }
    const payload = JSON.parse(initial_data);

    this.investment = payload.investment || 0;
    this.project = payload.project;
    this.currency_id = payload.currency_id;
    this.sign = payload.sign;
    this.token = payload.token || '';
    this.rate = payload.rate || 12;
    this.years = payload.years || 1;

    for (let i = 0; i < this.years; i++) {
      let b_incomes: Income[] = [];
      let b_egresses: Egress[] = [];
      const b_months: Month[] = [...this.months];

      b_months.forEach((m, m_i) => {
        const incomes: Income[] = this.income_types.reduce((acc, it, it_i) => {
          const amount = 0;
          acc.push({month: m.key, type: it, amount: amount});
          return acc;
        }, []);

        const egresses: Egress[] = this.egress_types.reduce((acc, e) => {
          const egress: Egress = {
            month: m.key,
            type: e,
            amount: 0,
            parent_type: this.egress_categories.find((et) => et.id === e.parent_id)
          };
          acc.push(egress);
          return acc;
        }, []);

        b_incomes = [...b_incomes, ...incomes];
        b_egresses = [...b_egresses, ...egresses];
      });

      const business_year = {year: i, incomes: b_incomes, egresses: b_egresses, months: b_months};
      const annual_flow = {year: i, amount: 0};
      this.business_years.push(business_year);
      this.annual_flows.push(annual_flow);

      this.by$.addAnnualFlow(annual_flow);
      this.by$.addBusinessYear(business_year);
    }
  }

  onExpansion() {
    if (this.show_alert) {
      this.alert = {visible: true, message: 'Recuerde generar sus resultados en la parte inferior', button: 'Siguiente'};
      this.show_alert = false;
    }
    this.tableResults.hideResults();
  }

  resultsShow(show: boolean) {
    if (show) {
      this.accordion_multiple = true;
      setTimeout(() => {
        this.accordion.closeAll();
        setTimeout(() => {
          this.accordion_multiple = false;
        }, 100);
      }, 100);
    }
  }

  alertClose() {
    this.alert_num++;

    if (this.alert_num === 3) {
      this.alert = {visible: false, message: '', button: ''};
    } else {
      let message = ''; let button = '';

      switch (this.alert_num) {
        case 1:
          message = 'Todos los registros tienen IVA incluido';
          button = 'Siguiente';
          break;
        case 2:
          message = `El cálculo del impuesto se realiza en base a los gastos deducibles.
          Asegúrese de calcular de forma correcta en base a las leyes y normas de su país.`;
          button = 'Cerrar';
      }
      this.alert = {visible: true, message, button};
    }
  }

  titleCurrencyFormat(v) { return D.currency_format(v, '', '', '.', 0); }

  logoutRequest() { this.alert_logout.visible = true; }
  onCancelLogout() { this.alert_logout.visible = false; }

  onLogout() {
    localStorage.removeItem('payload');
    window.location.href = '/login';
  }
}
