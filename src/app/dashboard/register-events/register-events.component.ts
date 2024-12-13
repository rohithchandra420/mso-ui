import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MsoEvent } from 'src/app/models/mso-event.model';
import { RegisterEventsService } from './register-events.service';

@Component({
  selector: 'app-register-events',
  templateUrl: './register-events.component.html',
  styleUrls: ['./register-events.component.css']
})
export class RegisterEventsComponent implements OnInit {

  @Output() titleChange = new EventEmitter<string>();
  registerForm: FormGroup;
  imageFile;
  eventList: MsoEvent[] = [];

  constructor(private registerEventsService: RegisterEventsService) {

  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'eventName': new FormControl(null, Validators.required),
      'description': new FormControl(null, [Validators.required]),
      'imgFile': new FormControl(null, [Validators.required])
    });

    this.getAllEvents();
    this.titleChange.emit('Create Events');
  }

  getAllEvents() {
    this.registerEventsService.getAllEvents().subscribe((res) => {
      this.eventList = res;
      this.eventList = res.map(event => {
        const blob = new Blob([new Uint8Array(event.imageFile.data)], { type: 'image/jpeg' });
        return { ...event, imageUrl: URL.createObjectURL(blob) };
      });
    }, (error) => {
      console.log(error);
    })
  }

  onFileSelected(event) {
    console.log(event.target.files[0]);
    this.imageFile = event.target.files[0];
    console.log(this.imageFile);
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.registerForm.controls.eventName.value);
    formData.append('description', this.registerForm.controls.description.value);
    if (this.imageFile) {
      formData.append('imageFile', this.imageFile, this.imageFile.name);
    }

    this.registerEventsService.addEvent(formData).subscribe((res) => {
      const blob = new Blob([new Uint8Array(res.imageFile.data)], { type: 'image/jpeg' });
      const newEvent = { ...res, imageUrl: URL.createObjectURL(blob) };
      this.eventList.push(newEvent);
    }, (error) => {
      console.log("Upload Failed");
    })
  }

  createImageFromBlob(imageData): string {
    imageData = new Uint8Array(imageData.data)
    const blob = new Blob([imageData], { type: 'image/jpeg' }); // Adjust the MIME type as necessary
    return URL.createObjectURL(blob); // Create a URL for the blob
  }

  // Convert image data array to Base64 string
  getImageBase64(imageFile: { type: string; data: number[] }): string {
    const byteArray = new Uint8Array(imageFile.data);
    const base64String = btoa(String.fromCharCode(...byteArray));
    return `data:image/png;base64,${base64String}`;
  }

  onDelete(id) {
    this.registerEventsService.deleteEventById(id)
      .subscribe(res => {
        this.getAllEvents();
    }, (error) => {
      console.log("Deletion Error: ", error)
    })
  }

}
