import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { Config } from 'datatables.net-bs5';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-users',
  imports: [CommonModule, DataTablesModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, OnDestroy {
  users: any[] = [];
  //loading: boolean = true;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  min: any = 0;
  max: any = 5;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.users().subscribe((response: any) => {
      this.users = response;
      //this.loading = false;
      this.dtTrigger.next(this.users);

    }, error => {
      console.error('Error fetching users:', error);
      //this.loading = false;
    });

    $.fn.dataTable.ext.search.push((settings: any, data: string[], dataIndex: any) => {
      const id = parseFloat(data[0]) || 0; // use data for the id column
      return (Number.isNaN(this.min) && Number.isNaN(this.max)) ||
        (Number.isNaN(this.min) && id <= this.max) ||
        (this.min <= id && Number.isNaN(this.max)) ||
        (this.min <= id && id <= this.max);
    });

  }

  filterById(): void {
    this.datatableElement.dtInstance.then((dtInstance) => {
      dtInstance.draw();
    });
  }

  ngOnDestroy(): void {
    //this.dtTrigger.unsubscribe();
    $.fn.dataTable.ext.search.pop();
  }

}
