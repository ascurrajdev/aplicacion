import Concept from './concept';

export default interface Egress {
  month: string;
  amount: number;
  type: Concept;
  parent_type: Concept;
}
