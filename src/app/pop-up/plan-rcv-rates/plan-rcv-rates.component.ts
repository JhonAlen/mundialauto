import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlanServiceCoverageComponent } from '@app/pop-up/plan-service-coverage/plan-service-coverage.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-plan-rcv-rates',
  templateUrl: './plan-rcv-rates.component.html',
  styleUrls: ['./plan-rcv-rates.component.css']
})
export class PlanRcvRatesComponent implements OnInit {

  @Input() public rates;
  currentUser;
  popup_form: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  coverageList: any[] = [];
  serviceList: any[] = [];
  serviceTypeList: any[] = [];
  serviceDepletionTypeList: any[] = [];
  alert = { show : false, type : "", message : "" }
  coverageDeletedRowList: any[] = [];

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ctarifa: [''],
      xclase: [''],
      xtipo: [''],
      xgrupo: [''],
      mgrua: [''],
      mut_cosas_rc: [''],
      msuma_cosas_rc: [''],
      mut_personas_rc: [''],
      msuma_personas_rc: [''],
      mut_prima_rc: [''],
      mprima_rc: [''],
      mexceso_limite: [''],
      mgastos_cat: [''],
      mrecuperacion: [''],
      msuma_defensa_per: [''],
      mprima_defensa_per: [''],
      msuma_limite_ind: [''],
      mprima_limite_ind: [''],
      msuma_apov_mu: [''],
      mapov_mu: [''],
      msuma_apov_in: [''],
      mapov_in: [''],
      msuma_apov_ga: [''],
      mapov_ga: [''],
      msuma_apov_fu: [''],
      mapov_fu: [''],
    })
    if(this.rates){
      if(this.rates.type == 3){
        this.canSave = true;
      }else if(this.rates.type == 2){
        this.popup_form.get('xclase').setValue(this.rates.xclase);
        this.popup_form.get('xclase').disable();
        this.popup_form.get('xtipo').setValue(this.rates.xtipo);
        this.popup_form.get('xtipo').disable();
        this.popup_form.get('xgrupo').setValue(this.rates.xgrupo);
        this.popup_form.get('xgrupo').disable();
        this.popup_form.get('mgrua').setValue(this.rates.mgrua);
        this.popup_form.get('mgrua').disable();
        this.popup_form.get('mut_cosas_rc').setValue(this.rates.mut_cosas_rc);
        this.popup_form.get('mut_cosas_rc').disable();
        this.popup_form.get('msuma_cosas_rc').setValue(this.rates.msuma_cosas_rc);
        this.popup_form.get('msuma_cosas_rc').disable();
        this.popup_form.get('mut_personas_rc').setValue(this.rates.mut_personas_rc);
        this.popup_form.get('mut_personas_rc').disable();
        this.popup_form.get('msuma_personas_rc').setValue(this.rates.msuma_personas_rc);
        this.popup_form.get('msuma_personas_rc').disable();
        this.popup_form.get('mut_prima_rc').setValue(this.rates.mut_prima_rc);
        this.popup_form.get('mut_prima_rc').disable();
        this.popup_form.get('mprima_rc').setValue(this.rates.mprima_rc);
        this.popup_form.get('mprima_rc').disable();
        this.popup_form.get('mexceso_limite').setValue(this.rates.mexceso_limite);
        this.popup_form.get('mexceso_limite').disable();
        this.popup_form.get('mgastos_cat').setValue(this.rates.mgastos_cat);
        this.popup_form.get('mgastos_cat').disable();
        this.popup_form.get('mrecuperacion').setValue(this.rates.mrecuperacion);
        this.popup_form.get('mrecuperacion').disable();
        this.popup_form.get('msuma_defensa_per').setValue(this.rates.msuma_defensa_per);
        this.popup_form.get('msuma_defensa_per').disable();
        this.popup_form.get('mprima_defensa_per').setValue(this.rates.mprima_defensa_per);
        this.popup_form.get('mprima_defensa_per').disable();
        this.popup_form.get('msuma_limite_ind').setValue(this.rates.msuma_limite_ind);
        this.popup_form.get('msuma_limite_ind').disable();
        this.popup_form.get('mprima_limite_ind').setValue(this.rates.mprima_limite_ind);
        this.popup_form.get('mprima_limite_ind').disable();
        this.popup_form.get('msuma_apov_mu').setValue(this.rates.msuma_apov_mu);
        this.popup_form.get('msuma_apov_mu').disable();
        this.popup_form.get('mapov_mu').setValue(this.rates.mapov_mu);
        this.popup_form.get('mapov_mu').disable();
        this.popup_form.get('msuma_apov_in').setValue(this.rates.msuma_apov_in);
        this.popup_form.get('msuma_apov_in').disable();
        this.popup_form.get('mapov_in').setValue(this.rates.mapov_in);
        this.popup_form.get('mapov_in').disable();
        this.popup_form.get('msuma_apov_ga').setValue(this.rates.msuma_apov_ga);
        this.popup_form.get('msuma_apov_ga').disable();
        this.popup_form.get('mapov_ga').setValue(this.rates.mapov_ga);
        this.popup_form.get('mapov_ga').disable();
        this.popup_form.get('msuma_apov_fu').setValue(this.rates.msuma_apov_fu);
        this.popup_form.get('msuma_apov_fu').disable();
        this.popup_form.get('mapov_fu').setValue(this.rates.mapov_fu);
        this.popup_form.get('mapov_fu').disable();
        this.canSave = false;
      }else if(this.rates.type == 1){
        this.popup_form.get('xclase').setValue(this.rates.xclase);
        this.popup_form.get('xtipo').setValue(this.rates.xtipo);
        this.popup_form.get('xgrupo').setValue(this.rates.xgrupo);
        this.popup_form.get('mgrua').setValue(this.rates.mgrua);
        this.popup_form.get('mut_cosas_rc').setValue(this.rates.mut_cosas_rc);
        this.popup_form.get('msuma_cosas_rc').setValue(this.rates.msuma_cosas_rc);
        this.popup_form.get('mut_personas_rc').setValue(this.rates.mut_personas_rc);
        this.popup_form.get('msuma_personas_rc').setValue(this.rates.msuma_personas_rc);
        this.popup_form.get('mut_prima_rc').setValue(this.rates.mut_prima_rc);
        this.popup_form.get('mprima_rc').setValue(this.rates.mprima_rc);
        this.popup_form.get('mexceso_limite').setValue(this.rates.mexceso_limite);
        this.popup_form.get('mgastos_cat').setValue(this.rates.mgastos_cat);
        this.popup_form.get('mrecuperacion').setValue(this.rates.mrecuperacion);
        this.popup_form.get('msuma_defensa_per').setValue(this.rates.msuma_defensa_per);
        this.popup_form.get('mprima_defensa_per').setValue(this.rates.mprima_defensa_per);
        this.popup_form.get('msuma_limite_ind').setValue(this.rates.msuma_limite_ind);
        this.popup_form.get('mprima_limite_ind').setValue(this.rates.mprima_limite_ind);
        this.popup_form.get('msuma_apov_mu').setValue(this.rates.msuma_apov_mu);
        this.popup_form.get('mapov_mu').setValue(this.rates.mapov_mu);
        this.popup_form.get('msuma_apov_in').setValue(this.rates.msuma_apov_in);
        this.popup_form.get('mapov_in').setValue(this.rates.mapov_in);
        this.popup_form.get('msuma_apov_ga').setValue(this.rates.msuma_apov_ga);
        this.popup_form.get('mapov_ga').setValue(this.rates.mapov_ga);
        this.popup_form.get('msuma_apov_fu').setValue(this.rates.msuma_apov_fu);
        this.popup_form.get('mapov_fu').setValue(this.rates.mapov_fu);
        this.canSave = true;
        this.isEdit = true;
      }
    }
  }

  onSubmit(){

    let ratesList = [];

    ratesList.push({
      ctarifa: this.rates.ctarifa,
      xclase: this.popup_form.get('xclase').value,
      xtipo: this.popup_form.get('xtipo').value,
      xgrupo: this.popup_form.get('xgrupo').value,
      mgrua: this.popup_form.get('mgrua').value,
      mut_cosas_rc: this.popup_form.get('mut_cosas_rc').value,
      msuma_cosas_rc: this.popup_form.get('msuma_cosas_rc').value,
      mut_personas_rc: this.popup_form.get('mut_personas_rc').value,
      msuma_personas_rc: this.popup_form.get('msuma_personas_rc').value,
      mut_prima_rc: this.popup_form.get('mut_prima_rc').value,
      mprima_rc: this.popup_form.get('mprima_rc').value,
      mexceso_limite: this.popup_form.get('mexceso_limite').value,
      mgastos_cat: this.popup_form.get('mgastos_cat').value,
      mrecuperacion: this.popup_form.get('mrecuperacion').value,
      msuma_defensa_per: this.popup_form.get('msuma_defensa_per').value,
      mprima_defensa_per: this.popup_form.get('mprima_defensa_per').value,
      msuma_limite_ind: this.popup_form.get('msuma_limite_ind').value,
      mprima_limite_ind: this.popup_form.get('mprima_limite_ind').value,
      msuma_apov_mu: this.popup_form.get('msuma_apov_mu').value,
      mapov_mu: this.popup_form.get('mapov_mu').value,
      msuma_apov_in: this.popup_form.get('msuma_apov_in').value,
      mapov_in: this.popup_form.get('mapov_in').value,
      msuma_apov_ga: this.popup_form.get('msuma_apov_ga').value,
      mapov_ga: this.popup_form.get('mapov_ga').value,
      msuma_apov_fu: this.popup_form.get('msuma_apov_fu').value,
      mapov_fu: this.popup_form.get('mapov_fu').value,
    })

    this.rates = ratesList

    this.activeModal.close(this.rates);
  }

}
