import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  faUser = faUser;
  constructor(private router: Router) {}
  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
