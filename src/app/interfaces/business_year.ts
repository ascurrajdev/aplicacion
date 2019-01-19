import Month from './month';
import Income from './income';
import Egress from './egress';

export default interface BusinessYear {
  readonly year: number;
  readonly months: Month[];
  incomes: Income[];
  egresses: Egress[];
}
