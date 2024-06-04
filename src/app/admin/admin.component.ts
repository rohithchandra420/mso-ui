import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Workshop } from '../core/workshop.model';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
  addWorkshopForm: FormGroup;  
  formData = new FormData();
  file: File = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.addWorkshopForm = new FormGroup({
      'workshopName': new FormControl(null, Validators.required),
      'workshopVenue': new FormControl(null, [Validators.required]),
      'startsAt': new FormControl(null, [Validators.required, Validators.email]),
      'registrationTime': new FormControl(null, Validators.required),
      'workshopImage' : new FormControl(null)
    });
  }

  onSubmit() {
    let workshopDetails: Workshop = {
      workshopName: this.addWorkshopForm.controls.workshopName.value,
      workshopVenue: this.addWorkshopForm.controls.workshopVenue.value,
      startsAt: this.addWorkshopForm.controls.startsAt.value,
      registrationTime: this.addWorkshopForm.controls.registrationTime.value,
    };

    this.adminService.addWorkshop(workshopDetails).subscribe(res=> {
      console.log(res);
    }, error=> {

    })   
  }

  uploadWorkshopImage() {
    this.adminService.addWorkshopImage(this.formData).subscribe(res=> {

    }, error => {

    });
  }

  onChange(event) { 
    let file = event.target.files[0]; 
    this.formData.append("workshop", file);
    console.log(this.formData);
  }

}
