import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  showAlert = false;
  alertMsg = 'Please wait!';
  alertColor = 'blue';
  inSubmission = false;

  credentials = {
    email: '',
    password: '',
  };

  constructor(private auth: AngularFireAuth) {}

  ngOnInit(): void {}

  async login() {
    this.inSubmission = true;
    this.alertMsg = 'Please wait, Login in progress!';
    this.alertColor = 'blue';
    this.showAlert = true;

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
    } catch (error) {
      this.alertMsg = 'Incorrect username/password!';
      this.alertColor = 'red';
      this.inSubmission = false;

      return;
    }

    this.alertMsg = 'Login Successfully!';
    this.alertColor = 'green';
  }
}
