import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Alert} from './../../../interfaces';

@Component({
  selector: 'app-alert-confirm',
  templateUrl: './alert-confirm.component.html',
  styleUrls: ['./alert-confirm.component.css']
})
export class AlertConfirmComponent implements OnInit {

  @Input() alert: Alert;
  @Output() accept = new EventEmitter();
  @Output() cancel = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  onAccept() { this.accept.emit(); }
  onCancel() { this.cancel.emit(); }
}
