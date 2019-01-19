import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {BusinessYear, AnnualFlow} from './../interfaces';

@Injectable({providedIn: 'root'})
export class BusinessYearsService {
  private business_years: BusinessYear[] = [];
  private anual_flows: AnnualFlow[] = [];

  updateSubject = new Subject<BusinessYear>();
  updateAnnualFlowSubject = new Subject<AnnualFlow>();

  addBusinessYear(by: BusinessYear) { this.business_years.push(by); }
  addAnnualFlow (af: AnnualFlow) { this.anual_flows.push(af); }

  updateBusinessYearIncome(year: number, month: string, type_id: number, amount: number) {
    const by: BusinessYear = this.business_years[year];

    if (by) {
      const new_by: BusinessYear = {...by, incomes: by.incomes.map((i) => i.month === month && i.type.id === type_id ? {...i, amount} : i)};
      this.business_years[year] = {...new_by};
      this.onUpdateBusinessYear({...new_by});
    }
  }

  updateBusinessYearEgress(year: number, month: string, type_id: number, amount: number) {
    const by: BusinessYear = this.business_years[year];

    if (by) {
      const new_by: BusinessYear = {
        ...by,
        egresses: by.egresses.map((e) => e.month === month && e.type.id === type_id ? {...e, amount} : e)
      };
      this.business_years[year] = {...new_by};
      this.onUpdateBusinessYear({...new_by});
    }
  }

  updateAnnualFlow(year: number, amount: number) {
    const af = this.anual_flows[year];

    if (af) {
      const new_af: AnnualFlow = {...af, amount: amount};
      this.anual_flows[year] = {...new_af};
      this.updateAnnualFlowSubject.next({...new_af});
    }
  }

  getAnnualFlowOnUpdateObservable() { return this.updateAnnualFlowSubject.asObservable(); }
  getBusinessYearOnUpdateObservable() { return this.updateSubject.asObservable(); }

  onUpdateBusinessYear(by: BusinessYear) { this.updateSubject.next(by); }
}
