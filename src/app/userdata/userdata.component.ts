import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { UserdetailService } from '../service/userdetail.service';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { Observable, map, startWith } from 'rxjs';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {LiveAnnouncer} from '@angular/cdk/a11y';

@Component({
  selector: 'app-userdata',
  standalone: true,
  imports: [FormsModule,CommonModule,NavComponent,FooterComponent,MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,],
  templateUrl: './userdata.component.html',
  styleUrl: './userdata.component.css'
})
export class UserdataComponent {

  //listarray:any[]=[];

  states: string[] = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Delhi', 'Puducherry'
  ];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  interestCtrl = new FormControl('');
  filteredinterest: Observable<string[]>;
  allinterest: string[] = ['Drawing', 'Reading', 'Dancing', 'Painting', 'Writting'];
  interests:string[]=[];
  @ViewChild('interestInput') interestInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  inputObj: any={
    profilePic:null,
    name:"",
    lname:"",
    email:"",
    age:21,
    contact: "",
    addressType: '',
    address: {
      address1: '',
      address2: '',
      companyAddress1: '',
      companyAddress2: ''
    },
    interest : this.interests,
    state:""
    
  };
  updatedUserData:any={
    profilePic:null,
    name:"",
    lname:"",
    email:"",
    age:21,
    contact: "",
    addressType: '',
    address: {
      address1: '',
      address2: '',
      companyAddress1: '',
      companyAddress2: ''
    },
    interest :this.interests,
    state:""
  };
  useremail:any;

  constructor(private dataservice:UserdetailService) {
    this.inputObj=this.dataservice.getData();
    this.useremail=this.inputObj.email;
    this.interests=this.inputObj.interest;

    this.filteredinterest = this.interestCtrl.valueChanges.pipe(
      startWith(null),
      map((interest: string | null) => (interest ? this._filter(interest) : this.allinterest.slice())),
    );
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.inputObj.interest.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.interestCtrl.setValue(null);
  }

  remove(interest: string): void {
    const index = this.inputObj.interest.indexOf(interest);

    if (index >= 0) {
      this.inputObj.interest.splice(index, 1);

      this.announcer.announce(`Removed ${interest}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.inputObj.interest.push(event.option.viewValue);
    this.interestInput.nativeElement.value = '';
    this.interestCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.inputObj.interest.filter((interest: string)=> interest.toLowerCase().includes(filterValue));
  }

    editData(item:any){
      this.inputObj=item;
      this.interests=item.interest;
      this.updatedUserData=item;
      
    }
  
    onSliderChange(event: Event): void {
      // Update the slider value when it changes
      this.inputObj.age = (event.target as HTMLInputElement).valueAsNumber;
    }

  
    url="./assets/images/pic.jpg"
  
    onselectFile(e:any ,profilePic: NgModel)
    {

      debugger;
      const file = e.target.files[0];
      const img = new Image();
        img.onload = () => {
            if (img.width !== 310 || img.height !== 325) {
                // Set invalid size error
                profilePic.control.setErrors({ 'invalidSize': true });
                // Clear the file input field
                e.target.value = '';
                // Clear the preview image
                //this.url="#";
            } else {
              
              if (file) {
                profilePic.control.setErrors(null);
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                // Set up event listener for when file reading is done
                fileReader.onload = (event:any) => {
                  // Once reading is complete, convert the image to base64
                  const base64Image = fileReader.result as string;
        
                  // Update the profilePic property in inputObj with the base64 encoded image
                  this.inputObj.profilePic = base64Image;
                  this.url=event.target.result;
                };
        
                
              } else {
                // Handle the case where no file is selected
                console.error('No file selected.');
              }
            }
          };
          img.src = window.URL.createObjectURL(file);
        }
    

    // getUser(){
    //   this.dataservice.getItem(this.useremail).subscribe(data => {
    //     this.inputObj = data;
    //     this.updatedUserData=data;
    //   });
    // }
    updateUser() {
      this.dataservice.updateUserOnServer(this.updatedUserData.email, this.updatedUserData).subscribe(response => {
        console.log('User updated successfully:', response);
  
        // Optionally, update the local user data if needed
        this.inputObj = response;
        this.inputObj.interest = this.interests;
      });
    }
    
  }
