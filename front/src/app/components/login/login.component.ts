import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username: string = null;
  public rememberme: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  login(){
    if(this.username){
      if(this.rememberme == true){
        console.log("SAVING TO LOCAL")
        localStorage.setItem("user", this.username)
      }else{ 
        sessionStorage.setItem("user", this.username)
      }
      localStorage.setItem("session", this.rememberme.toString())
      window.location.reload();
    }else{
      Swal.fire('Oops...', 'Please enter a username!', 'error')
    }
  }
}
