import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-brand-model-version-detail',
  templateUrl: './brand-model-version-detail.component.html',
  styleUrls: ['./brand-model-version-detail.component.css']
})
export class BrandModelVersionDetailComponent implements OnInit {

  showSaveButton: boolean = false;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  sub;
  currentUser;
  detail_form: FormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  cmarca;
  cmodelo;
  cversion;
  createBrand: boolean = false;
  createModel: boolean = false;
  createVersion: boolean = false;
  alert = { show: false, type: "", message: "" };

  constructor(private formBuilder: FormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) {    
              if (this.router.getCurrentNavigation().extras.state == null) {
                // this.router.navigate([`tables/brand-model-version-index`]);
                console.log('pasa tranquilo rey')
              } else {
                this.cmarca = this.router.getCurrentNavigation().extras.state.cmarca;
                this.cmodelo = this.router.getCurrentNavigation().extras.state.cmodelo; 
                this.cversion = this.router.getCurrentNavigation().extras.state.cversion;  
              } 
            }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      mtasa_cambio: [''],
      fingreso: ['']
    })
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 113
      };
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.canEdit = response.data.beditar;
          this.canDelete = response.data.beliminar;
          this.initializeDetailModule();
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 401){ 
          let condition = err.error.data.condition;
          if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
        }else if(code == 500){ message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){

  }

}
