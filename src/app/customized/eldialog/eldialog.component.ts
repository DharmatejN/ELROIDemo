import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-eldialog',
  templateUrl: './eldialog.component.html',
  styleUrls: ['./eldialog.component.css']
})
export class EldialogComponent implements OnInit {

  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EldialogComponent>,
    private fb: FormBuilder
  ) { }
  action = this.data.username;
  close = 'close';
  charts = [{ label: 'Bar', value: '0' }, { label: 'Pie', value: '1' }, { label: 'Line', value: '2' }];
  description: string;
  ngOnInit() {
    this.form = this.fb.group({
      chartName: 'Test',
      chartType: '0',
    });
  }

}
