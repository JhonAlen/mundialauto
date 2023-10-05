import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-financing-management-index',
  templateUrl: './financing-management-index.component.html',
  styleUrls: ['./financing-management-index.component.css']
})
export class FinancingManagementIndexComponent implements OnInit {

  currentUser;
  search_form: UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  financingList: any[] = [];
  beneficiaryList: any[] = [];
  keyword = 'value';

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      cpropietario: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 123
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          if(!response.data.bindice){
            this.router.navigate([`/permission-error`]);
          }else{

          }
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 401){
          let condition = err.error.data.condition;
          if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
    this.keyword;
    let params;
    this.http.post(`${environment.apiUrl}/api/valrep/beneficiary-financing`, params).subscribe((response : any) => {
      if(response.data.list){
        this.beneficiaryList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.beneficiaryList.push({ 
            id: response.data.list[i].cpropietario,
            value: response.data.list[i].xnombre,
          });
        }
      }
    },)
  }

  onSubmit(){
    this.submitted = true;
    this.loading = true;

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpropietario: this.search_form.get('cpropietario').value.id
    };
    this.http.post(`${environment.apiUrl}/api/financing/search`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.financingList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.financingList.push({ 
            cfinanciamiento: response.data.list[i].cfinanciamiento,
            xnombre: response.data.list[i].xnombre,
            xvehiculo: response.data.list[i].xvehiculo,
            ncuotas: response.data.list[i].ncuotas,
            mmonto: response.data.list[i].mmonto,
          });
        }
      }
      this.loading = false;
    },(err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontraron Financiamientos pendientes"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
      this.loading = false;
    });
  }

  goToDetail(){
    this.router.navigate([`administration/financing-management-detail`]);
  }

  rowClicked(event: any){
    this.router.navigate([`administration/financing-management-detail/${event.data.cfinanciamiento}`]);
  }

}
