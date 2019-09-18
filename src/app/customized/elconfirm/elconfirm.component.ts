import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-elconfirm',
  templateUrl: './elconfirm.component.html',
  styleUrls: ['./elconfirm.component.css']
})
export class ElconfirmComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  action = this.data.username;
  close = 'close';
  ngOnInit() {
  }

}
