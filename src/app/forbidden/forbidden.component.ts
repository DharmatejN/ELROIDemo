import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css']
})
export class ForbiddenComponent implements OnInit {

  erromsg: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.erromsg = params['msg'] === undefined ? '' : params['msg'];
    });
  }

  gotologin() {
    this.router.navigate(['/login']);
  }

}
