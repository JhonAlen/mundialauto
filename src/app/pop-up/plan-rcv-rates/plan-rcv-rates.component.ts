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
      msuma_cosas_rc: [''],
      msuma_personas_rc: [''],
      mprima_rc: [''],
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
        this.canSave = false;
      }else if(this.rates.type == 1){
        this.canSave = true;
        this.isEdit = true;
      }
    }
  }

  onSubmit(){

    let ratesList = [];

    ratesList.push({
      xclase: this.popup_form.get('xclase').value,
      xtipo: this.popup_form.get('xtipo').value,
      xgrupo: this.popup_form.get('xgrupo').value,
      msuma_cosas_rc: this.popup_form.get('msuma_cosas_rc').value,
      msuma_personas_rc: this.popup_form.get('msuma_personas_rc').value,
      mprima_rc: this.popup_form.get('mprima_rc').value,
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
