import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import {Alert} from './../../../interfaces';

@Component({
  selector: 'app-alert-info',
  templateUrl: './alert-info.component.html',
  styleUrls: ['./alert-info.component.css']
})
export class AlertInfoComponent implements OnInit {

  @Input() alert: Alert;
  @Output() close = new EventEmitter();

  constructor() { }
  ngOnInit() { }

  closeAlert() {
    this.close.emit();
  }
}
