import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirebaseProvider} from '../providers/firebase/firebase';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';

import { UsersPage } from '../pages/users/users';
import { LogoutPage } from '../pages/logout/logout';
import { ArtisthomePage } from '../pages/artisthome/artisthome';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  rootPage: any = LoginPage;


  pages: Array<{title: string, component: any}>;
  
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,private firebaseService:FirebaseProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [

      { title: 'Profile', component: ProfilePage },
      { title: 'Log-Out', component: LogoutPage },
      { title: 'List', component: ListPage },
    

    ];
if('Log-Out')
    this. firebaseService.getUserSatate().then( data =>{
      if (data == 1){
       this.rootPage =  HomePage ;
      }
      else{
       this.rootPage = LoginPage ;
      }
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

}
