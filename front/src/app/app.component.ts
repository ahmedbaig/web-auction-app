import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public logged: string = null;
  constructor(private router:Router){}
  ngOnInit(){
    if(localStorage.getItem("session")==null){
      localStorage.clear();
      localStorage.setItem("session", "false");
    }else{ 
      if(localStorage.getItem("session")=="true"){
        this.logged = sessionStorage.getItem("user");
      }else{
        this.logged = sessionStorage.getItem("user");
      }
      this.router.navigate([`/items`])
    }
    
  }
}
