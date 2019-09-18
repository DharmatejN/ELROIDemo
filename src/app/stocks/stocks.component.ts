import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { SpinnerService } from '../services/spinner/spinner.service';
import { ElroiapiService } from '../services/http/elroiapi.service';
import * as XLSX from 'xlsx';
import { EmailComponent } from '../email/email.component';
import { EmailHTMLContent } from '../model/mail';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = [
  'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
  'aqua', 'blue', 'navy', 'black', 'gray'
];
const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('divPrintSection') divPrintSection: ElementRef;
  @ViewChild('divCanvasGraph') divCanvasGraph: ElementRef;

  displayedColumns: string[] = ['id', 'name', 'progress', 'color'];
  dataSource: MatTableDataSource<UserData>;
  pageSize: number;
  pageIndex: number;
  lblHeader: string;
  lblCreatedBy: string;
  lblCreatedOn: string;
  chkShowAll: boolean;

  constructor(
    private spinnerSvc: SpinnerService,
    private apiSvc: ElroiapiService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.spinnerSvc.open();
    this.chkShowAll = false;
    this.lblHeader = 'Records';
    // Create 100 users
    const users = Array.from({ length: 1000 }, (_, k) => this.createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.spinnerSvc.close();
    this.apiSvc.getElements().subscribe(data => {
      // console.log(data);
    });

   
  }

  createNewUser(id: number): UserData {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
      id: id.toString(),
      name: name,
      progress: Math.round(Math.random() * 100).toString(),
      color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
    };
  }

  showAll() {
    this.spinnerSvc.open();
    this.chkShowAll = !this.chkShowAll;
    if (this.chkShowAll) {
      this.pageSize = +this.paginator.pageSize.toString();
      this.pageIndex = +this.paginator.pageIndex.toString();
      if (this.dataSource.paginator) {
        if (this.paginator.pageSize) {
          this.paginator.pageSize = this.dataSource.data.length;
          this.dataSource.paginator = this.paginator;
        }
        this.dataSource.paginator.firstPage();
      }
    } else {
      if (this.dataSource.paginator) {
        if (this.paginator.pageSize) {
          this.paginator.pageSize = +this.pageSize.toString();
          this.paginator.pageIndex = +this.pageIndex.toString();
          this.dataSource.paginator = this.paginator;
        }
      }
    }
    this.spinnerSvc.close();

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportAsXLSX() {
    // this.exportService.exportToExcel(this.dataSource.data, 'Records');
    // this.exportService.exportToExcel(this.dataSource.filteredData, 'Records_Filtered');

    // const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    // // this.exportService.exportToExcel(this.dataSource.data.splice(startIndex, this.paginator.pageSize), 'Records_Single');
    // this.exportService.exportToExcel(this.dataSource.filteredData.splice(startIndex, this.paginator.pageSize), 'Records_Filtered_Single');

    // this.exportService.exportToExcel(this.dataSource._filterData, 'Records');
    // // this.exportService.exportToExcel(this.dataSource._orderDataData, 'Records');
    // this.exportService.exportToExcel(this.dataSource._pageData, 'Records');

    // console.log(this.ExportTable.nativeElement);
    // this.exportService.exportToExcel(this.dataSource.data, 'Records');
    // console.log(this.paginator.pageIndex);
    // console.log(this.paginator.pageSize);
    // const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    // return this.dataSource.data.splice(startIndex, this.paginator.pageSize);

    // this.exportService.exportToExcel(this.dataSource.data.splice(startIndex, this.paginator.pageSize), 'Records');
    // this.exportService.exportToExcel(this.ExportTable.nativeElement, 'Records_Complete');

    this.ExportTOExcel();
  }

  ExportTOExcel() {

    this.spinnerSvc.open();

    let HeaderHTML: string;
    HeaderHTML = '<table><tr><td>' + this.lblHeader + '</td></tr></table>';
    this.lblCreatedBy = 'EBIX';
    this.lblCreatedOn = (new Date()).getDate().toString();
    let FooterHTML: string;
    FooterHTML = '<table><tr><td>Created By</td><td>' + this.lblCreatedBy + '</td></tr><tr><td>Created On</td><td>' + this.lblCreatedOn + '</td></tr></table>';

    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(HeaderHTML + MainTableElement.innerHTML + FooterHTML);
    let MainTableElement: any;
    MainTableElement = this.divPrintSection.nativeElement;
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(MainTableElement);

    // this.lblCreatedBy = null;
    // this.lblCreatedOn = null;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
    this.spinnerSvc.close();
  }

  EmailContent() {
    if (this.divPrintSection) {
      let _EmailTestHTMLContent: EmailHTMLContent;
      _EmailTestHTMLContent = {};
      _EmailTestHTMLContent.HTMLContent = this.divPrintSection.nativeElement.innerHTML;
      // this.apiSvc.EmailByType(_EmailTestHTMLContent).
      //   subscribe(dataEmail => {
      //     console.log(dataEmail);
      //   });




      const dialogRef = this.dialog.open(EmailComponent, {
        width: '550px',
        height: 'auto',
        disableClose: true,
        data: _EmailTestHTMLContent,
        panelClass: 'elpopup'
      });


      // dialogRef.afterClosed().subscribe(result => {
      //   console.log('The dialog was closed');
      //   console.log(result);
      //   // this.apiSvc.EmailByType(_EmailTestHTMLContent).
      //   //   subscribe(dataEmail => {
      //   //     console.log(dataEmail);
      //   //   });
      // });
    }
  }

}
