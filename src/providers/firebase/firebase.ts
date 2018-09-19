import { Injectable } from '@angular/core';
import {Camera,CameraOptions} from '@ionic-native/camera';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { LoadingController } from 'ionic-angular';
import moment from 'moment';
import { rendererTypeName } from '@angular/compiler';
declare var firebase;

@Injectable()
export class FirebaseProvider {

  database = firebase.database();
  authnticate  = firebase.auth();
  storageRef = firebase.storage();

  userIDl;
  dbRef;
  state;
  image;
  file;
  username;
  imgurl;
  currentUserID;

  profile =  new Array();
  comments =  new Array();
  videoArray = new Array();
  arr = new Array();
  arr2 = new Array();
  
  constructor(private camera:Camera, public loadingCtrl: LoadingController) {
  }

login(email, password){
  return new Promise((accept,reject) =>{
    this.authnticate.signInWithEmailAndPassword(email, password).then(()=>{
    accept("success")
    }, Error =>{
      reject(Error.message)
    })
  })

}

  registerUser(email,password, Username){

    return new Promise((accept,reject) =>{
      this.authnticate.createUserWithEmailAndPassword(email, password).then(()=>{
        var user = firebase.auth().currentUser;
        this.dbRef =  'users/' + Username + ":" + user.uid;
        this.database.ref(this.dbRef).push({
          Username:Username,
          userType: "normalPerson"
        })
      accept("user registred")
      }, Error =>{
        reject(Error.message)
      })
    })
  }
  
  registerTalentPerson(username,email,password, name, surname, gender, cellno, age){
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait',
      duration: 17000
    });
    loading.present();
      this.username =  username;
      return new Promise((accept,reject) =>{
      this.authnticate.createUserWithEmailAndPassword(email, password).then(()=>{
        var user = firebase.auth().currentUser;
        this.dbRef =  'users/' +  username + ":" + user.uid;
        this.database.ref(this.dbRef).push({
          name:name,
          surname:surname,
          gender:gender,
          cellno:cellno,
          age:age,
          userType: "talentPerson",
          imageURl:  this.imgurl
        })
        loading.dismiss();
        accept("success");
      }, Error =>{
        reject(Error.message);
        console.log(Error.message);
      })
    })
  }


  registerScoutPerson(email, password, name, surname, companyName, companyemail, companycellno){
    return new Promise((accept,reject) =>{
      this.authnticate.createUserWithEmailAndPassword(email, password).then(()=>{
      var user = firebase.auth().currentUser;
        this.dbRef =  'users/' + surname + ":" + user.uid;
        this.database.ref(this.dbRef).push({
          name:name,
          companyName:companyName,
          companyemail:companyemail,
          companycellno:companycellno,
          userType: "ScoutPerson"
        })
        accept("success");
      }, Error =>{
        reject(Error.message);
      })
    })
  }

  logout(){
    this.authnticate.signOut();
  }

  getUserSatate(){
    return new Promise ((accpt, rej) =>{ 
      this.authnticate.onAuthStateChanged(user =>{ 
        if (user != null){
          this.state = 1;
        }
        else{
        this.state = 0;
        }
        accpt(this.state);
       });
    })
  }

  forgotUserPassword(email:any){
    return this.authnticate.sendPasswordResetEmail(email);
  }

addImage(username){
  let loading = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Please wait',
    duration: 17000
  });
  loading.present();
  return new Promise ((accpt, rej) =>{
    this.storageRef.ref('pictures/' + username + ".jpg").putString(this.image, 'data_url');
    loading.dismiss();
    accpt("image added to storage")
  })

}

getimagepropicurl(username){
  let loading = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Please wait',
    duration: 5000
  });
  loading.present();
return new Promise ((accpt,rej) =>{
  var storageRef = firebase.storage().ref('pictures/' + username + ".jpg");
  storageRef.getDownloadURL().then(url => {
    this.storePictureUrl(url);
    loading.dismiss();
    accpt("image url found")
  })
})
}

  async uploadpic(){
    const options: CameraOptions= {
    quality : 100,
    targetWidth: 600,
    targetHeight: 600,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
    }
      const results = await this.camera.getPicture(options);
      this.image = `data:image/jpeg;base64,${results}`;
      console.log(this.image);
  }

  uploadvid(vid){
    var d = Date.now();
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait',
      duration: 17000
    });
    loading.present();
  return new Promise((accpt,rejc) =>{

    loading.present();
  this.storageRef.ref(d + ".mp4").putString(vid, 'data_url').then(() =>{
    loading.dismiss();
    accpt(d);
  }, Error =>{
    rejc(Error.message)
  })
  })
  }

storeToDB(name, category, vidname, vidDesc){

  var d = Date.now();
  let loading = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Please wait',
    duration: 9000
  });
  loading.present();
  return new Promise((accpt,rejc) =>{
    var today = moment().format("Do MMM");
    var storageRef = firebase.storage().ref(name + ".mp4");
    storageRef.getDownloadURL().then(url => {
      console.log(url)
      var user = firebase.auth().currentUser;
      var link =  url;
      this.database.ref('uploads/' + this.username).push({
            downloadurl :link,
            name : vidname,
            category: category,
            description: vidDesc,
            username : this.username,
            userImg : this.imgurl,
            date : today,
            likes : 0,
            comments : 0
          });
          accpt('success');
}, Error =>{
  rejc(Error.message);
  console.log(Error.message);
});
})
} 

getAllvideos(){
  return new Promise ((accpt, rej) =>{
    this.database.ref('uploads/').on('value', (data: any) => {
      var videos = data.val();
      this.videoArray.length = 0;
      var keys:any =  Object.keys(videos);
        for (var i = 0; i < keys.length; i++){
          var x = keys[i];
          var y  = 'uploads/' + x;
          var details;
          var colour;
          this.database.ref(y).on('value', (data2: any) => {
           details = data2.val();
            })
          var keys2:any = Object.keys(details);
          for (var a = 0; a < keys2.length; a++){
                var key = keys2[a];
            this.database.ref('likes/' + key).on('value', (data3: any) => {
              if (data3.val() != null || data3.val() != undefined)
              {
                var likes = data3.val();
                var likesKey:any = Object.keys(likes )
                console.log(likes[likesKey[0]].username)
              if (likes[likesKey[0]].username == this.currentUserID){
                colour = "primary";
              }
              else{
                colour = "grey";
              }
              
            }
            else{
              colour = "grey";
              
            }
            })
                let obj = {
                likes: details[key].likes,
                comments : details[key].comments,
                vidurl : details[key].downloadurl,
                vidDesc : details[key].description,
                vidname : details[key].name,
                name : details[key].username,
                img : details[key].userImg,
                date : details[key].date,
                color :colour,
                key: key
          }
          this.videoArray.push(obj);
          }
        }
       accpt(this.videoArray);
  }, Error =>{
    rej(Error.message)
  })
  })

} 

getuserType(){
return new Promise ((accpt, rej) =>{
  this.database.ref('users').on('value', (data: any) => {
    var users =  data.val();
    var user = firebase.auth().currentUser;
    var  userIDs = Object.keys(users);
    for (var x = 0; x < userIDs.length; x++){

      var str1 = new String( userIDs[x]); 
      var index = str1.indexOf( ":" ); 
      var currentUserID = userIDs[x].substr(index + 1);
      if (user.uid == currentUserID){
        this.storeUserName(userIDs[x].substr(0,index));
          this.database.ref('users/' + userIDs[x]).on('value', (data: any) => {
            var Userdetails;
            var Userdetails = data.val(); 
            this.storeuserid(userIDs[x])
            var keys2:any = Object.keys(Userdetails);
            var user = firebase.auth().currentUser;
            let storageRef =  firebase.storage().ref();
           var img = userIDs[x].substr(0,index) + ".jpg"
            let imgRef = storageRef.child('pictures/' + img);
            imgRef.getDownloadURL().then(function(url) {
            this.storePictureUrl(url);
            }.bind(this)).catch(function(error) {})
            accpt(Userdetails[keys2].userType)
           });
        break;
      }
    }
  })
})
}

storeUserName(name){
this.username = name;
}

storePictureUrl(url){
this.imgurl =  url;
}

storeuserid(uid){
this.currentUserID = uid;
}

getProfile(){
  return new Promise ((accpt, rej) =>{
    this.database.ref('users/' + this.currentUserID).on('value', (data2: any) => {
      var details = data2.val();
      console.log(details);
      var keys = Object.keys(details)

      for (var x = 0; x< keys.length; x++){
        var key = keys[x];
        let obj = {
          age : details[key].age,
          cellno : details[key].cellno,
          gender: details[key].gender,
          imageURl: details[key].imageURl,
          name : details[key].name,
          surname : details[key].surname
        }
        this.profile.push(obj)
      }
      console.log(this.profile);
      accpt(this.profile);
       })
  })
}

viewArtistProfile(user){
  return new Promise ((accpt, rej) =>{
    this.arr2.length = 0;
    this.database.ref('users/').on('value', (data: any) => {
      var users =  data.val();
      var  userIDs = Object.keys(users);
      for(var x = 0; x < userIDs.length; x++){
        var str1 = new String( userIDs[x]);
        var index = str1.indexOf( ":" );
        var username = userIDs[x].substr(0,index);
        if (user == username){
          this.database.ref('users/' + userIDs[x]).on('value', (data2: any) => {
            var userFound = data2.val();
            var keys:any = Object.keys(userFound);
            for(var b = 0; b <keys.length;b++){
              var k =  keys[b];
              let obj = {
              age: userFound[k].age,
              cellno: userFound[k].cellno,
              gender: userFound[k].gender,
              name: userFound[k].name,
              surname: userFound[k].surname,
              img : this.imgurl
              }
              this.arr2.push(obj);
              accpt(this.arr2);
            };
           })
          break;
        }
      }
  }, Error =>{
    rej(Error.message)
  })
  })
}

comment(key,text){
  return new Promise ((accpt, rej) =>{
    var today = moment().format('l');  
    this.database.ref('comments/' + key).push({
      text:text,
      username: this.username,
      date : today,
      img : this.imgurl
    })
    accpt("comment added")
  })
}
getcomments(key){
  return new Promise ((pass,fail) =>{
    this.database.ref('comments/' + key).on('value', (data2: any) => {
      var details = data2.val();
      if (details != null ||  details != undefined){
        this.comments.length = 0;
        var keys = Object.keys(details) 
        for (var x =0; x < keys.length; x++){
          var key = keys[x];
          let obj = {
            date : details[key].date,
            text :  details[key].text,
            name : details[key].username,
            img :  details[key].img
          }
          this.comments.push(obj)
        }
          pass(this.comments);
      }
      })
  })
}

addNumComments(key, numComments, user){
  var num =  numComments  + 1;
  this.database.ref('uploads/' + user+ "/"+ key).update({comments: num});
  console.log("comment number added")
}

likeVideo(key){
  return new Promise ((accpt, rej) =>{
    this.database.ref('likes/' + key).push({
      username : this.currentUserID
    })
    accpt('liked')
  })

}

addNumOfLikes(username, key, num){
  num =  num  + 1;
  return new Promise ((accpt, rej) =>{
    this.database.ref('uploads/' + username + '/' + key).update({likes: num});
    accpt('like added')
  })
}

removeLike(username, key, num){
  num =  num  - 1;
  return new Promise ((accpt, rej) =>{
    this.database.ref('uploads/' + username + '/' + key).update({likes: num});
    this.database.ref('likes/' + key).remove();
    accpt('like removed')
  })
}

sendMessage(username, text){
  return new Promise ((accpt, rej) =>{
    var today = moment().format("Do MMM");
    this.database.ref('message/' + this.username + ":"  + username).push({
      message : text,
      date : today
    })
    accpt('message sent')
  })
}

getMessages(username){
return new Promise ((accpt, rej) =>{
  this.database.ref('message/' + this.username + ":"  + username).on('value', (data: any) => {
    var messages =  data.val();
    console.log(messages);
  })
})
}
}
