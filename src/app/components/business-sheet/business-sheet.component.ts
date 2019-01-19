import { Component, OnInit, Input } from '@angular/core';

import {BusinessYear, Month, Income, Egress} from './../../interfaces';

@Component({
  selector: 'app-business-sheet',
  templateUrl: './business-sheet.component.html',
  styleUrls: ['./business-sheet.component.css']
})
export class BusinessSheetComponent implements OnInit {

  @Input() business_year: BusinessYear;
  @Input() sign: string;

  incomes: Income[] = [];
  egresses: Egress[] = [];
  months: Month[] = [];
  year: number;

  constructor() { }

  ngOnInit() {
    const {year, months, incomes, egresses} = this.business_year;
    this.year = year;
    this.months = months;
    this.incomes = incomes;
    this.egresses = egresses;
  }
}
