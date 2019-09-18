import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-elalert',
  templateUrl: './elalert.component.html',
  styleUrls: ['./elalert.component.css']
})
export class ElalertComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  action = this.data.username;
  close = 'close';
  ngOnInit() {
  }

}
