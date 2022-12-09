import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CssGeneratorService } from '@app/_services/css-generator.service';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { InicioComponent } from '@app/club/pages-statics/inicio/inicio.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})

export class ToolbarComponent implements OnInit {

  auth : boolean = false;
  currentUser;
  lang_form : UntypedFormGroup;
  groupList: any[] = [];
  css1;
  theme: string = 'light';
  brand: string = "Mundialauto";

  constructor(public translate : TranslateService, 
              private formBuilder : UntypedFormBuilder, 
              private modalService : NgbModal, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private cssGenerator: CssGeneratorService) {
    
    translate.addLangs(['es', 'en']);
    translate.setDefaultLang('es');
  }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      this.auth = true;
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario
      }
      this.http.post(`${environment.apiUrl}/api/security/get-user-modules`, params, options).subscribe((response : any) => {
        if(response.data.status){
          let nameArray = [];
          for(let i = 0; i < response.data.list.length; i++){
            if(!nameArray.includes(response.data.list[i].xgrupo)){ nameArray.push(response.data.list[i].xgrupo); }
          }
          for(let i = 0; i < nameArray.length; i++){
            let testObjectFilter = response.data.list.filter(function(group) {
              return group.xgrupo == nameArray[i];
            });
            this.groupList.push({ xgrupo: nameArray[i], modules: testObjectFilter });
          }
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.TOOLBAR.MODULESNOTFOUND"; }
        else if(code == 500){ message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      });
      this.cssGenerator.setStyle('.company-bg-navbar', 'background-image', 'linear-gradient(to right, #3c00c7, #6538ca, #835dcc, #9c80cd, #b3a3cd);');
      this.theme = this.currentUser.data.xtemanav;
      this.brand = this.currentUser.data.xcompania;
      this.cssGenerator.setStyle(".company-card-header", "background-color", this.currentUser.data.xcolorprimario);
      this.cssGenerator.setStyle(".company-detail-button", "background-color", this.currentUser.data.xcolorsegundario);
      this.cssGenerator.setStyle(".company-detail-button", "border-color", this.currentUser.data.xcolorsegundario);
      this.cssGenerator.setStyle(".company-detail-button", "color", this.currentUser.data.xcolortexto);
      this.cssGenerator.setStyle(".company-detail-button:hover", "background-color", this.currentUser.data.xcolorterciario);
      this.cssGenerator.setStyle(".company-detail-button:hover", "border-color", this.currentUser.data.xcolorterciario);
      this.cssGenerator.setStyle(".company-detail-button:hover", "color", this.currentUser.data.xcolortexto);
    }else{
      this.cssGenerator.setStyle('.company-bg-navbar', 'background-color', 'linear-gradient(to right, #3c00c7, #6538ca, #835dcc, #9c80cd, #b3a3cd);');
    }
    this.lang_form = this.formBuilder.group({
      langselect: ['']
    });
    if(localStorage.getItem('lang') != null){
      this.translate.use(localStorage.getItem('lang'));
      this.lang_form.get('langselect').setValue(localStorage.getItem('lang'));
    }else{
      this.translate.use('es');
      localStorage.setItem('lang', 'es');
      this.lang_form.get('langselect').setValue('es');
    }
  }

  changeLanguage(lang){
    this.translate.use(lang.langselect);
    localStorage.setItem('lang', lang.langselect);
  }

  // openSignInModal(){ this.modalService.open(SignInComponent); }

  logOut(){ this.authenticationService.logout();}

}


function responsive() {
  var x = document.getElementById("navbar");
  if (x.className === "navbar") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}