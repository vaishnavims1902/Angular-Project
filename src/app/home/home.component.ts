import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
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
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HttpClientModule,RouterLink,CommonModule,NavComponent,FooterComponent,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


  userEmail='';
  password='';
  phonePattern: string = "^((\\+91-?)|0)?[0-9]{10}$";
  namePattern:string="^[a-zA-Z]{1,20}$";
  emailPattern:string="^([awa-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$";
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

  
  constructor(private userService: UserdetailService, private router: Router) {
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
  onLogin() {
    if(this.userEmail == "admin" && this.password == "admin") {
      this.router.navigateByUrl('/show')

    } else {
      alert('Wrong Credentials')
    }
  }

  

  submitForm(): void {
    debugger;

    this.userService.saveData(this.inputObj);
    //this.router.navigateByUrl('/userShow');
    this.userService.addItem(this.inputObj).subscribe(response => {
      this.router.navigateByUrl('/userShow');
    });
  }
  

  onSliderChange(event: Event): void {
    // Update the slider value when it changes
    this.inputObj.age = (event.target as HTMLInputElement).valueAsNumber;
  }

    url="./assets/images/pic.jpg";
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
    
      

}
