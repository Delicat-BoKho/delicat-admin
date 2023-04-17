import { Component } from '@angular/core';
import {
  faBars,
  faXmark,
  faChartLine,
  faFileLines,
  faUsers,
  faBoxesPacking,
  faSquareRss,
  faGears,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  faBars = faBars;
  faCancel = faXmark;
  faChartLine = faChartLine;
  faOrders = faFileLines;
  faCustomers = faUsers;
  faProducts = faBoxesPacking;
  faContents = faSquareRss;
  faSettings = faGears;
  faLogOut = faRightFromBracket;
}
