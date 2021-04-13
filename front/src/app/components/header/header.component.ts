import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: string = ""
  constructor(private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("session") == "true") {
      this.user = sessionStorage.getItem("user");
    } else {
      this.user = sessionStorage.getItem("user");
    }
  }

  logout() {
    localStorage.clear()
    sessionStorage.clear()
    this.router.navigate(['/'])
    window.location.reload()
  }
}
