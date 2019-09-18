
import { Component, Inject, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete, } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ElalertComponent } from '../customized/elalert/elalert.component';
import { ElconfirmComponent } from '../customized/elconfirm/elconfirm.component';
import { emailId, EmailHTMLContent } from '../model/mail';
import { ElroiapiService } from '../services/http/elroiapi.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  @ViewChild('emailinput') emailinput: ElementRef<HTMLInputElement>;
  @ViewChild('ccemailinput') ccemailinput: ElementRef<HTMLInputElement>;
  @ViewChild('Bccemailinput') Bccemailinput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') ToAutocomplete: MatAutocomplete;
  @ViewChild('ccauto') ccAutocomplete: MatAutocomplete;

  // CHIP CONTROLS
  checked = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER];

  //Validation Email
  ToContainsInvalidMail: boolean = false;

  // FormControls Declarations
  frmEmail = new FormGroup({});

  emailTo = new FormControl('', [
    Validators.required

  ]);
  emailCc = new FormControl('', [
    // Validators.required
    //Validators.email,
  ]);
  emailBcc = new FormControl('', [
    // Validators.required,
    //Validators.email,
  ]);
  emailAddBccToAddressBook = new FormControl('', [
    // Validators.required,
    //Validators.email,
  ]);
  emailSubject = new FormControl('', [
    Validators.required,
    //Validators.email,
  ]);
  emailComments = new FormControl('', [
    //Validators.required,
    //Validators.email,
  ]);
  emailSignature = new FormControl('', [
    Validators.required,
    //Validators.email,
  ]);


  // Object Declarations
  emails: emailId[] = [];
  allemails: emailId[] = [

    { mailId: 'RajuTo@gmail.com', IsValid: true },
    { mailId: 'SethuTo@gmail.com', IsValid: true }
  ]

  CCemails: emailId[] = [];
  allCCemails: emailId[] = [

    { mailId: 'RajuCc@gmail.com', IsValid: true },
    { mailId: 'SethuCc@gmail.com', IsValid: true }
  ]


  BCCemails: emailId[] = [];

  filteredEmails: Observable<emailId[]>;
  filteredccEmails: Observable<emailId[]>;

  constructor(
    public dialogRef: MatDialogRef<EmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmailHTMLContent,
    private dialog: MatDialog,
    private apiSvc: ElroiapiService,
  ) {
    this.filteredEmails = this.emailTo.valueChanges.pipe(
      startWith(null),
      map((email: emailId | null) => email ? this._filter(email) : this.allemails.slice()));

    this.filteredccEmails = this.emailCc.valueChanges.pipe(
      startWith(null),
      map((email: emailId | null) => email ? this._filtercc(email) : this.allCCemails.slice()));
  }


  ngOnInit(): void {
    this.BuildControls();
  }

  BuildControls() {
    this.frmEmail.addControl('emailTo', this.emailTo);
    this.frmEmail.addControl('emailCc', this.emailCc);
    this.frmEmail.addControl('emailBcc', this.emailBcc);
    this.frmEmail.addControl('emailAddBccToAddressBook', this.emailAddBccToAddressBook);
    this.frmEmail.addControl('emailSubject', this.emailSubject);
    this.frmEmail.addControl('emailComments', this.emailComments);
    this.frmEmail.addControl('emailSignature', this.emailSignature);
  }

  ValidateEmail(mail: any): boolean {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test(mail);
  }

  addSender(event: MatChipInputEvent, emailType: string) {
    let gotoLogic: boolean = true;
    switch (emailType) {
      case 'TO':
        gotoLogic = !this.ToAutocomplete.isOpen;
        break;
      case 'CC':
        gotoLogic = !this.ccAutocomplete.isOpen;
        break;
      default:
        break;
    }

    if (gotoLogic) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        if (!this.ValidateEmail(value)) {
          if (this.checkIsDuplicate(value.trim())) {
            switch (emailType) {
              case 'TO':
                this.emails.push({ mailId: value.trim(), IsValid: false });
                break;
              case 'CC':
                this.CCemails.push({ mailId: value.trim(), IsValid: false });
                break;
              default:
                this.BCCemails.push({ mailId: value.trim(), IsValid: false });
                break;
            }
          }
        }
        else {
          if (this.checkIsDuplicate(value.trim())) {
            switch (emailType) {
              case 'TO':
                this.emails.push({ mailId: value.trim(), IsValid: true });
                break;
              case 'CC':
                this.CCemails.push({ mailId: value.trim(), IsValid: true });
                break;
              default:
                this.BCCemails.push({ mailId: value.trim(), IsValid: true });
                break;
            }
          }
          else {
            this.AlertDialogErrorMsg("Email: " + value.trim() + " is already in sender list", false);
          }
        }
        if (input) {
          input.value = '';
        }

        switch (emailType) {
          case 'TO':
            this.emailTo.setValue(this.emails);
            break;
          case 'CC':
            this.emailCc.setValue(this.CCemails);
            break;
          default:
            this.emailBcc.setValue(this.BCCemails);
            break;
        }
      }
    }
  }

  removeSender(email: emailId, emailType: string) {
    let index = -1;
    switch (emailType) {
      case 'TO':
        index = this.emails.indexOf(email);
        if (index >= 0) {
          this.emails.splice(index, 1);
        }
        break;
      case 'CC':
        index = this.CCemails.indexOf(email);
        if (index >= 0) {
          this.CCemails.splice(index, 1);
        }
        break;
      default:
        index = this.BCCemails.indexOf(email);
        if (index >= 0) {
          this.BCCemails.splice(index, 1);
        }
        break;
    }
  }


  onSelection(event: MatAutocompleteSelectedEvent, emailType: string): void {
    if (this.checkIsDuplicate(event.option.viewValue.trim())) {
      switch (emailType) {
        case 'CC':
          this.CCemails.push({
            mailId: event.option.viewValue.trim(),
            IsValid: event.option.value['IsValid']
          });
          break;
        default:
          this.emails.push({
            mailId: event.option.viewValue.trim(),
            IsValid: event.option.value['IsValid']
          });
          break;
      }
    }
    else {
      let alertmsg = "Email: " + event.option.viewValue.trim() + " is already in sender list";
      this.AlertDialogErrorMsg(alertmsg, false);
    }
    switch (emailType) {
      case 'CC':
        this.ccemailinput.nativeElement.value = '';
        this.emailCc.setValue(this.CCemails);
        break;
      default:
        this.emailinput.nativeElement.value = '';
        this.emailTo.setValue(this.emails);
        break;
    }
  }

  public AlertDialogErrorMsg(alertMsg: any, IsDialogClose: boolean) {
    const dialogClose = this.dialog.open(ElalertComponent, {
      disableClose: true,
      data: {
        Label: alertMsg,
        ok: 'Ok'
      },
      panelClass: 'elalert'
    });
    dialogClose.afterClosed().subscribe(result => {
      if (IsDialogClose)
        this.dialogRef.close();
    });
  }

  private _filter(email: any): emailId[] {
    let filterValue = '';
    if (email.mailId === undefined)
      filterValue = email;
    else
      filterValue = email.mailId.toLowerCase();
    return this.allemails.filter(m => m.mailId.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filtercc(email: any): emailId[] {
    let filterValue = '';
    if (email.mailId === undefined)
      filterValue = email;
    else
      filterValue = email.mailId.toLowerCase();
    return this.allCCemails.filter(m => m.mailId.toLowerCase().indexOf(filterValue) === 0);
  }


  checkIsDuplicate(email: any): boolean {
    let count = 0;
    if (this.CheckEmail(this.CCemails, email))
      count++;
    if (this.CheckEmail(this.BCCemails, email))
      count++;
    if (this.CheckEmail(this.emails, email))
      count++;
    return count++ >= 1 ? false : true;
  }

  CheckEmail(emailobj: emailId[], mailid: any): boolean {
    return (emailobj.filter(m => m.mailId.toLowerCase().indexOf(mailid.toLowerCase()) === 0)).length > 0 ? true : false;
  }

  checkIsValid(): boolean {
    let InvalidMailscount = 0;
    if (this.CheckValidMails(this.CCemails, false))
      InvalidMailscount++;
    if (this.CheckValidMails(this.BCCemails, false))
      InvalidMailscount++;
    if (this.CheckValidMails(this.emails, false)) {
      this.ToContainsInvalidMail = true;
      InvalidMailscount++;
    }
    else {
      this.ToContainsInvalidMail = false;
    }
    return InvalidMailscount++ >= 1 ? true : false;
  }


  CheckValidMails(emailobj: emailId[], invalid: boolean): boolean {
    return (emailobj.filter(m => m.IsValid == invalid)).length > 0 ? true : false;
  }


  onCancel(): void {
    this.resetForm();
    this.dialogRef.close();
  }

  onSend(): void {
    let TocontainValid = false;
    TocontainValid = this.CheckValidMails(this.emails, true);
    if (this.checkIsValid()) {
      if (this.ToContainsInvalidMail && !TocontainValid) {
        this.AlertDialogErrorMsg("To contains invalid Mail.", false);
      }
      else {
        this.ConfirmDialogMsg();
      }
    }
    else {
      this.sendMail();
    }
  }


  public ConfirmDialogMsg() {
    const dialogClose = this.dialog.open(ElconfirmComponent, {
      disableClose: true,
      data: {
        Header: 'Confirm',
        Label: '<b>Sender list contains invalid mail</b>, </br>Do you want to send it ?',
      },
      panelClass: 'elconfirm'
    });
    dialogClose.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.sendMail();
      }
    });
  }

  resetForm() {
    this.frmEmail.markAsPristine();
    this.frmEmail.markAsUntouched();
    this.frmEmail.updateValueAndValidity();
    this.frmEmail.reset();
  }


  sendMail() {
    this.data.Subject = this.frmEmail.controls['emailSubject'].value.toString().trim();
    this.data.Comments = this.frmEmail.controls['emailComments'].value.toString().trim();
    this.data.Signature = this.frmEmail.controls['emailSignature'].value.toString().trim();
    this.data.AddBccToAddressBook = this.frmEmail.controls['emailAddBccToAddressBook'].value.toString().trim();
    this.data.To = this.emails.filter(m => m.IsValid === true).map(m => m.mailId).join(';').toString();
    this.data.Cc = this.CCemails.filter(m => m.IsValid === true).map(m => m.mailId).join(';').toString();
    this.data.Bcc = this.BCCemails.filter(m => m.IsValid === true).map(m => m.mailId).join(';').toString();
    this.apiSvc.EmailByType(this.data).
      subscribe(dataEmail => {
        this.AlertDialogErrorMsg("Mail Sent Successfully.", true);
      });
  }

}
