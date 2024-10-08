import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastComponent, NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss'],
})
export class CreateRegistrationComponent implements OnInit {
  public packages: string[] = ['Monthly', 'Quaterly', 'Yearly'];
  public importantList: string[] = [
    'Toxic Fat reduction',
    'Energy and Endurance',
    'Building Lean Muscle',
    'Healthier Digestive System',
    'Sugar Craving Body',
    'Fitness',
  ];

  public registrationForm!: FormGroup;
  public UserIdToUpdate!: string;
  public isUpdateActive: boolean = false;
  public trainervalues: any;
  public gendervalues: any;
  public gymbeforevalues: any;

  constructor(
    private fb: FormBuilder,
    private Api: ApiService,
    private router: Router,
    private toastService: NgToastService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      weight: ['', Validators.required],
      height: ['', Validators.required],
      bmi: ['', Validators.required],
      bmiResult: ['', Validators.required],
      gender: ['', Validators.required],
      requireTrainer: ['', Validators.required],
      package: ['', Validators.required],
      important: ['', Validators.required],
      haveGymBefore: ['', Validators.required],
      enquiryDate: ['', Validators.required],
    });

    this.registrationForm.controls['height'].valueChanges.subscribe((res) => {
      this.calculateBmi(res);
    });

    this.activatedRoute.params.subscribe((val) => {
      if (val['id']) {
        this.UserIdToUpdate = val['id'];
        this.Api.getRegisteredUserId(this.UserIdToUpdate).subscribe(
          (result) => {
            this.isUpdateActive = true;
            this.fillFormToUpdate(result);
          }
        );
      }
    });
  }

  submit() {
    console.log(this.registrationForm.value);
    this.Api.postRegistration(this.registrationForm.value).subscribe(
      (result) => {
        this.toastService.success({
          detail: 'Sucess',
          summary: 'Registration Sucessfully',
          duration: 3000,
        });
        this.registrationForm.reset();
      }
    );
  }

  submiterror() {
    this.toastService.error({
      detail: 'ERROR',
      summary: 'Please fill all details',
      duration: 3000,
    });
  }

  update() {
    this.Api.updateRegisterUser(
      this.registrationForm.value,
      this.UserIdToUpdate
    ).subscribe((res) => {
      this.toastService.success({
        detail: 'SUCCESS',
        summary: 'User Details Updated Successful',
        duration: 3000,
      });
      this.router.navigate(['list']);
      this.registrationForm.reset();
    });
  }

  calculateBmi(value: number) {
    const weight = this.registrationForm.value.weight; // weight in kilograms
    const height = value; // height in meters
    const bmi = weight / (height * height);
    this.registrationForm.controls['bmi'].patchValue(bmi);
    switch (true) {
      case bmi < 18.5:
        this.registrationForm.controls['bmiResult'].patchValue('Underweight');
        break;
      case bmi >= 18.5 && bmi < 25:
        this.registrationForm.controls['bmiResult'].patchValue('Normal');
        break;
      case bmi >= 25 && bmi < 30:
        this.registrationForm.controls['bmiResult'].patchValue('Overweight');
        break;

      default:
        this.registrationForm.controls['bmiResult'].patchValue('Obese');
        break;
    }
  }

  trainervalue(value: any) {
    this.trainervalues = value;
  }

  gendervalue(value: any) {
    this.gendervalues = value;
  }

  gymbeforevalue(value: any) {
    this.gymbeforevalues = value;
  }

  fillFormToUpdate(user: User) {
    this.registrationForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate,
    });
  }
}
