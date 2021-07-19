import { UserService } from './../../services/user.service';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Patient } from 'src/app/models/patient';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading: boolean = false;
  private sub: Subscription = new Subscription();
  patients: any[] = [];
  filteredPatients: any[] = [];
  untouchedPatients: any[] = [];
  displayedColumns: string[] = [
    'imgUrl',
    'name',
    'gender',
    'age',
    'phoneNo',
    'address',
    'viewProfile',
  ];
  dataSource = new MatTableDataSource<Patient>(this.patients);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private _users: UserService) {}
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  viewProfile(name: any) {
    alert(name);
  }
  ngOnInit(): void {
    this.getPatients();
  }
  getPatients() {
    this.isLoading = true;
    this.sub.add(
      this._users.getPatients().subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.patients = this.filteredPatients = this.untouchedPatients = res;
          console.log(res);
        },
        error: (e) => {
          this.isLoading = false;

          console.log(e);
        },
      })
    );
  }
  filterPatients(query: any) {
    // this.patients = query
    //   ? this.filteredPatients.filter((p: any) =>
    //       p.surName.toLowerCase().includes(query.toLowerCase())
    //     )
    //   : this.filterPatients;

    query
      ? (this.patients = this.filteredPatients.filter((p: any) =>
          p.surName.toLowerCase().includes(query.toLowerCase())
        ))
      : (this.patients = this.untouchedPatients);
  }
}
