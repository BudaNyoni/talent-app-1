import { Component } from '@angular/core';
import { NavController, ViewController, AlertController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import {LoginPage} from '../login/login';

// import { SecondPage } from '../second/second';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  users;

  url;
  vidd;


  // splash = true;
  // secomndPage = SecondPage;
 

  constructor(public navCtrl: NavController,private firebaseService:FirebaseProvider,public alertCtrl:AlertController) {
  }

     // ionviewDidLoad(){
    // setTimeout(()=> this.splash = false , 3000);
<<<<<<< HEAD
    // }

    insertvid(event:any){
=======

    insertpic(event:any){
>>>>>>> 32f163ec9149b1f001ffa5cd65832184fc121354
      if (event.target.files && event.target.files[0]){
        let reader = new FileReader();
    
        reader.onload = (event:any) =>{
          this.url = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);

      }
    
    }
    show(){
      this.firebaseService.uploadvid(this.url).then(data =>{
        console.log(data);
         this.firebaseService.storeToDB(data).then(() =>{
           console.log('added to db');
         },
        Error =>{
          console.log(Error)
        })
      }, Error =>{
        console.log(Error )
      })
      
    }

<<<<<<< HEAD
    


=======
>>>>>>> 32f163ec9149b1f001ffa5cd65832184fc121354
}



