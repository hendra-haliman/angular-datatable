import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { Config } from 'datatables.net-bs5';
import { DataTablesModule } from 'angular-datatables';


@Component({
  selector: 'app-users',
  imports: [CommonModule, DataTablesModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  //loading: boolean = true;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.usersService.users().subscribe((response: any) => {
      this.users = response;
      //this.loading = false;
      this.dtTrigger.next(this.users);
    }, error => {
      console.error('Error fetching users:', error);
      //this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
