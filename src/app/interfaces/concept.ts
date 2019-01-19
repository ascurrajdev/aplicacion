export default interface Concept {
  id: number;
  name: string;
  parent_id?: number; // Optional
  tax?: number;
}
