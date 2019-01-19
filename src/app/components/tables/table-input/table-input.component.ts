import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {ConceptUpdateEvent} from './../../../interfaces';
import {Data as D} from './../../../../custom/libraries';

@Component({
  selector: 'app-table-input',
  templateUrl: './table-input.component.html',
  styleUrls: ['./table-input.css']
})
export class TableInputComponent implements OnInit {

  @Input() type_id: number;
  @Input() month: string;
  @Input() html_id: string;
  @Input() sign: string;

  amount = '';
  @Output() returnPushed = new EventEmitter<HTMLElement>();
  @Output() didUpdate = new EventEmitter<ConceptUpdateEvent>();

  constructor() { }

  ngOnInit() {}

  focusOut(event: FocusEvent) {
    this._emitUpdate(this.amount.trim());
  }

  onEnter = (element: HTMLElement) => {
    element.blur();
    this.returnPushed.emit(element);
  }

  private _emitUpdate(v: string) {
    if (v === '' || !D.is_numeric(v)) { return; }
    const value: number = Number(v);
    this.didUpdate.emit({type_id: this.type_id, month: this.month, amount: value});
  }
}
