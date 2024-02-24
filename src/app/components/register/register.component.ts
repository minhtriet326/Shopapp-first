import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';//chuyển màn hình
import { UserService } from '../../services/user.service';
import { RegisterDTO } from '../../dtos/user/register.dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;//dấu ! nghĩa là biết chắc trong thẻ html có thẻ registerForm
  //Khai báo các biến tương ứng với các trường dữ liệu trong form
  phoneNumber: string;
  password: string;
  retypePassword: string;
  fullName: string;
  address: string;
  isAccepted: boolean;
  dateOfBirth: Date;

  constructor(private router: Router, private userService: UserService){
    this.phoneNumber = '';
    this.password = '';
    this.retypePassword = '';
    this.fullName = '';
    this.address = '';
    this.isAccepted = true;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);//nếu không nhập thì cho ngày sinh đủ 18t
    //inject

  }

  onPhoneNumberChange(){
    console.log(`Phone typed: ${this.phoneNumber}`)
  }

  register(){
    const message = `phone: ${this.phoneNumber}`+
                    `password: ${this.password}`+
                    `retypePassword: ${this.retypePassword}`+
                    `fullName: ${this.fullName}`+
                    `dateOfBirth: ${this.dateOfBirth}`+
                    `address: ${this.address}`+
                    `isAccepted: ${this.isAccepted}`
    // alert(message);
    debugger
    
    const registerDTO:RegisterDTO = {
      "fullname": this.fullName,
      "phone_number": this.phoneNumber,
      "address": this.address,
      "password": this.password,
      "retype_password": this.retypePassword,
      "date_of_birth": this.dateOfBirth,
      "facebook_account_id": 0,
      "google_account_id": 0,
      "role_id": 1
    }
    
    this.userService.register(registerDTO).subscribe({//cs nacaisLaf promis, ví dụ như nó chạy dòng 61, xong chạy dòng 65 rồi nào có data nó quay lại chạy dòng 63
      next: (response: any) => {
        debugger
        //Xử lý kết quả trả về khi đăng ký thành công
        if(response && (response.status === 200 || response.status === 201)) {
          //Đăng ký thành công, chuyển sang màn hình login
          this.router.navigate(['/login']);
        } else {
          //xử lý TH đk ko thành công nếu cần
        }
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        alert(`Cannot register, error: ${error.error}`)
      }
    });
      
  }

  //how to check password match?
  checkPasswordsMatch(){//gọi ngay khi gõ xong mk nhập lại
    if (this.registerForm && this.registerForm.form) {
      if(this.password != this.retypePassword){
        this.registerForm.form.controls['retypePassword'].setErrors({'passwordMismatch': true});
      } else {
        this.registerForm.form.controls['retypePassword'].setErrors(null);
      }
    }
  }

  checkAge(){
    if(this.dateOfBirth){
      const today = new Date();
      const birthDay = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDay.getFullYear();
      const monthDiff = today.getMonth() - birthDay.getMonth();
      if(monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay.getDate())){
        age--;
      }

      if(age < 18){
        this.registerForm.form.controls['dateOfBirth'].setErrors({ 'invalidAge': true});
      } else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }
}
