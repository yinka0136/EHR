import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import {
  trigger,
  state,
  style,
  transition,
  animate,
  group,
  query,
} from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger('step', [
      transition('stepOne => stepTwo', [
        group([
          query(
            ':enter',
            [
              style({ transform: 'translateX(calc((100vw + 335px)))' }),
              animate('0.3s ease-in-out', style({ transform: 'none' })),
            ],
            { optional: true }
          ),
        ]),
      ]),
      transition('stepTwo => stepOne', [
        group([
          query(
            ':enter',
            [
              style({ transform: 'translateX(calc((-100vw + 335px)))' }),
              animate('0.35s ease-in-out', style({ transform: 'none' })),
            ],
            { optional: true }
          ),
        ]),
      ]),
      transition('stepTwo => stepThree', [
        group([
          query(
            ':enter',
            [
              style({ transform: 'translateX(calc((-100vw + 335px)))' }),
              animate('0.35s ease-in-out', style({ transform: 'none' })),
            ],
            { optional: true }
          ),
        ]),
      ]),
      transition('stepThree => stepTwo', [
        group([
          query(
            ':enter',
            [
              style({ transform: 'translateX(calc((-100vw + 335px)))' }),
              animate('0.35s ease-in-out', style({ transform: 'none' })),
            ],
            { optional: true }
          ),
        ]),
      ]),
      transition('stepThree => stepFour', [
        group([
          query(
            ':enter',
            [
              style({ transform: 'translateX(calc((-100vw + 335px)))' }),
              animate('0.35s ease-in-out', style({ transform: 'none' })),
            ],
            { optional: true }
          ),
        ]),
      ]),
      transition('stepFour => stepThree', [
        group([
          query(
            ':enter',
            [
              style({ transform: 'translateX(calc((-100vw + 335px)))' }),
              animate('0.35s ease-in-out', style({ transform: 'none' })),
            ],
            { optional: true }
          ),
        ]),
      ]),
    ]),
  ],
})
export class RegisterComponent implements OnInit {
  private sub: Subscription = new Subscription();
  isLoading: boolean = false;
  @ViewChild('closeModal', { static: false }) closeModal:
    | ElementRef
    | undefined;
  @ViewChild('successModal', { static: false }) successModal:
    | ElementRef
    | undefined;
  patientDetailsFormSubmitted: boolean = false;
  nextOfKinForm!: FormGroup;
  patientDetailsForm!: FormGroup;
  otherForm!: FormGroup;
  HMOForm!: FormGroup;
  currentStep: string = 'stepOne';
  selectedImage: any;
  titles: any[] = [
    { name: 'Mr' },
    { name: 'Mrs' },
    { name: 'Miss' },
    { name: 'Master' },
  ];
  files: any[] = [];
  gender: any[] = [{ name: 'Male' }, { name: 'Female' }];
  step = 1;
  constructor(
    private fb: FormBuilder,
    private _sanitizer: DomSanitizer,
    private _users: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initPatientDetailsForm();
    this.initOtherForm();
    this.initNextOfKinForm();
    this, this.initHMOForm();
  }
  initNextOfKinForm() {
    this.nextOfKinForm = this.fb.group({
      nokFullName: ['', Validators.required],
      relationship: ['', Validators.required],
      nokPhoneNo: ['', Validators.required],
      nokAddress: ['', Validators.required],
    });
  }
  initOtherForm() {
    this.otherForm = this.fb.group({
      ethnicity: ['', Validators.required],
      religion: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      patientType: ['', Validators.required],
      nationality: ['', Validators.required],
      stateOfOrigin: ['', Validators.required],
      localGovernment: ['', Validators.required],
      stateOfResidence: ['', Validators.required],
      occupation: [''],
    });
  }
  initHMOForm() {
    this.HMOForm = this.fb.group({
      billing: ['', Validators.required],
    });
  }
  initPatientDetailsForm() {
    this.patientDetailsForm = this.fb.group({
      title: ['Mr', Validators.required],
      surName: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      phoneNo: ['', Validators.required],
      email: ['', Validators.required],
      gender: ['Male', Validators.required],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      imgUrl: [''],
    });
  }

  nextStep(step: string) {
    if (step == 'stepTwo' && !this.patientDetailsForm.valid) {
      this.patientDetailsFormSubmitted = true;
      this.currentStep = this.currentStep;
    } else {
      this.currentStep = step;
    }
  }

  previousStep(step: string) {
    this.currentStep = step;
  }
  addImg(target: any) {
    let image = target.files[0];
    let unsafeUrl = URL.createObjectURL(image);
    this.selectedImage = this._sanitizer.bypassSecurityTrustUrl(unsafeUrl);
    this.patientDetailsForm.get('imgUrl')!.setValue(this.selectedImage);
  }
  submit() {
    this.patientDetailsFormSubmitted = true;
    console.log(
      this.patientDetailsForm.value,
      this.otherForm.value,
      this.HMOForm.value,
      this.nextOfKinForm.value
    );
    if (this.patientDetailsForm.valid) {
      this.isLoading = true;
      const payload = this.patientDetailsForm.value;
      this.sub.add(
        this._users.addPatient(payload).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.successModal?.nativeElement.click();
            console.log(res);
          },
          error: (e) => {
            this.isLoading = false;
            console.log(e);
          },
        })
      );
    } else {
      alert('Please complete all fields before you move forward.');
    }
  }
  onFileDropped($event: any) {
    let image = $event;
    let unsafeUrl = URL.createObjectURL(image);
    this.selectedImage = this._sanitizer.bypassSecurityTrustUrl(unsafeUrl);
    this.patientDetailsForm.get('imgUrl')!.setValue(this.selectedImage);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }
}
