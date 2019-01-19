import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import {Subscription} from 'rxjs';

import {AnnualFlow, Alert} from './../../../interfaces';
import {BusinessYearsService} from './../../../services';
import {Data as D} from './../../../../custom/libraries';

@Component({
  selector: 'app-table-results',
  templateUrl: './table-results.component.html',
  styleUrls: ['./table-results.component.css']
})
export class TableResultsComponent implements OnInit, OnDestroy {

  @Input() token: string;
  @Input() annual_flows: AnnualFlow[];
  @Input() rate: number;
  @Input() investment: number;
  @Input() show_panel: boolean;
  @Input() sign: string;

  @Output() resultsShow = new EventEmitter<boolean>();

  display_results = false;
  show_alert = true;

  van_plus_rate = '';
  van_minus_rate = '';

  afs: AnnualFlow[] = [];
  alert: Alert = {visible: false, message: '', button: ''};
  van = 0;
  van_plus?: number = null;
  van_minus?: number = null;
  tir = 0;

  af_subscription: Subscription;

  constructor(public by$: BusinessYearsService) { }

  ngOnInit() {
    this.af_subscription = this.by$.getAnnualFlowOnUpdateObservable().subscribe((af: AnnualFlow) => this.onAnnualFlowUpdate(af));
    this.afs = [...this.annual_flows];
  }

  displayResults() {
    if (this.show_alert) {
      this.alert = {
        visible: true,
        message: `Para hallar la Tasa Interna de Retorno ingrese una tasa que lance como resultado un VAN positivo, igual o proximo a cero.
        Asi tambien ingrese una tasa que de como resultado un VAN negativo, proximo a cero`,
        button: 'Cerrar'
      };
    } else {
      this._updateResults();
      if (!this.display_results) {
        this.display_results = true;
        this.resultsShow.emit(true);
      }
    }
  }

  hideResults() { this.display_results = false; this.resultsShow.emit(false); }

  onAnnualFlowUpdate(af: AnnualFlow) {
    const {year} = af;
    const afs: AnnualFlow[] = this.afs.map((p_af) => p_af.year === year ? {...af} : p_af);
    this.afs = [...afs];
  }

  getFlowProfit(year) {
    const af = this.afs[year];
    const base = undefined !== af ? af.amount : 0;
    return base / this.investment;
  }

  getFlowRecovery(year) {
    const profit = this.getFlowProfit(year);
    return profit * 100;
  }

  _updateResults() {
    const afs = [...this.afs];
    const di = this.investment;
    const r = D.truncate_decimals((this.rate / 100), 2);

    this.van = this._calculateVAN([...afs], di, r);
    this.tir = this._calculateTIR([...afs], di);

    const balances = afs.reduce((acc, af) => {
      acc.push(String(af.amount));
      return acc;
    }, []);

    const tir = D.is_numeric(this.tir) ? String(this.tir) : '0';
    const van_plus = D.is_numeric(this.van_plus) ? String(this.van_plus) : '0';
    const van_plus_rate = D.is_numeric(this.van_plus_rate) ? String(this.van_plus_rate) : '0';
    const van_minus = D.is_numeric(this.van_minus) ? String(this.van_minus) : '0';
    const van_minus_rate = D.is_numeric(this.van_minus_rate) ? String(this.van_minus_rate) : '0';

    const payload = {
      token: this.token,
      balances: balances,
      van: String(this.van),
      van_plus: van_plus,
      van_plus_rate: van_plus_rate,
      van_minus: van_minus,
      van_minus_rate: van_minus_rate,
      tir: tir
    };
  }

  _calculateTIR(afs: AnnualFlow[], inv: number) {
    const rate_plus = D.is_numeric(this.van_plus_rate) ? Number(this.van_plus_rate) : 0;
    const rate_minus = D.is_numeric(this.van_minus_rate) ? Number(this.van_minus_rate) : 0;

    if (rate_plus === 0 && rate_minus === 0) {
      this.van_plus = 0;
      this.van_minus = 0;
      return null;
    }

    const van_plus = this._calculateVAN(afs, inv, D.truncate_decimals(rate_plus / 100, 2));
    this.van_plus = van_plus;
    const van_minus = this._calculateVAN(afs, inv, D.truncate_decimals(rate_minus / 100, 2));
    this.van_minus = van_minus;

    const den = (van_plus - van_minus);
    if (den === 0) { return null; }

    const tir = rate_plus - ((van_plus * (rate_plus - rate_minus)) / den);
    return D.truncate_decimals(tir, 2);
  }

  _calculateVAN(afs: AnnualFlow[], inv: number, rate: number) {
    const van = afs.reduce((acc, af) => acc += (af.amount / Math.pow((1 + rate), (af.year + 1))), (-inv));
    return D.truncate_decimals(van, 2);
  }

  // SUPPORT
  onInputEnter = (element: HTMLElement) => { element.blur(); };
  onInputFocusOut() {
    this.displayResults();
  }
  currencyFormat(v: number, sign: string = '', dt: string = ',', ts: string = '.', d: number = 0 ) {
    return D.currency_format(v, sign, dt, ts, d);
  }
  closeAlert() { this.show_alert = false; this.alert = {visible: false, message: '', button: ''}; this.displayResults(); }
  ngOnDestroy() { this.af_subscription.unsubscribe(); }
}
