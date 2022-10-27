import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators , FormBuilder} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-receipt-generation',
  templateUrl: './receipt-generation.component.html',
  styleUrls: ['./receipt-generation.component.css']
})
export class ReceiptGenerationComponent implements OnInit {

    currentUser;
    search_form : UntypedFormGroup;
    loading: boolean = false;
    submitted: boolean = false;
    alert = { show: false, type: "", message: "" };
    marcaList: any[] = [];
    modeloList: any[] = [];
    coberturaList: any[] = [];
    tipoList: any[] = [];
    versionList: any[] = [];
    corredorList: any[] = [];
    planList: any[] = [];
    usoList:any[] = [];
    colorList:any[] = [];
    metodologiaList:any[] = [];
    canCreate: boolean = false;
    canDetail: boolean = false;
    canEdit: boolean = false;
    canDelete: boolean = false;
    status: boolean = true;
  
    constructor(private formBuilder: UntypedFormBuilder, 
                private _formBuilder: FormBuilder,
                private authenticationService : AuthenticationService,
                private router: Router,
                private http: HttpClient,
                private translate: TranslateService,
                private webService: WebServiceConnectionService) { }
  
    async ngOnInit(): Promise<void>{
      this.currentUser = this.authenticationService.currentUserValue;
      if(this.currentUser){
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        let params = {
          cusuario: this.currentUser.data.cusuario,
        
        }
        this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
          if(response.data.status){
            this.canCreate = response.data.bcrear;
            this.canDetail = response.data.bdetalle;
            this.canEdit = response.data.beditar;
            this.canDelete = response.data.beliminar;
          
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
      }}}
  