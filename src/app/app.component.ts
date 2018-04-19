import {Component, ViewChild} from '@angular/core';
import {
  Nav,
  Platform,
  MenuController,
  App,
  ViewController,
  NavController
} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
//****List of plugins***//
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {NativeStorage} from '@ionic-native/native-storage';
import {Push, PushObject, PushOptions} from '@ionic-native/push';
import {SQLite} from 'ionic-native';

//****List of Pages***//
import {AddGroupMembersPage} from '../pages/add-group-members/add-group-members';
import {ChangePasswordPage} from '../pages/change-password/change-password';
import {EditProfilePage} from '../pages/edit-profile/edit-profile';
import {EventDetailPage} from '../pages/event-detail/event-detail';
import {EventsPage} from '../pages/events/events';
import {ForgotPasswordPage} from '../pages/forgot-password/forgot-password';
import {LoginPage} from '../pages/login/login';
import {ProfilePage} from '../pages/profile/profile';
import {SignupPage} from '../pages/signup/signup';
import {TabsPage} from '../pages/tabs/tabs';
//****List of Providers***//
import {AlertProvider} from '../providers/alert/alert';
import {ContactProvider} from '../providers/contact/contact';
import {GroupProvider} from '../providers/group/group';
import {ConnectivityProvider} from '../providers/connectivity/connectivity';
import {SqliteDatabaseProvider} from '../providers/sqlite-database/sqlite-database';
import {ToastProvider} from '../providers/toast/toast';
import {UserProvider} from '../providers/user/user';
//****List of Components***//
import {DistanceMeasureComponent} from '../components/discard/discard'
@Component({templateUrl: 'app.html'})
export class MyApp {
  @ViewChild(Nav)nav : Nav;
  @ViewChild(ViewController)viewCtrl : ViewController;
  rootPage : any;

  constructor(public platform : Platform, statusBar : StatusBar, splashScreen : SplashScreen, private nativeStorage : NativeStorage, private push : Push, public menu : MenuController, private alertCtrl : AlertController, public groupservice : GroupProvider, public contactProvider : ContactProvider, public userProvider : UserProvider, public toast : ToastProvider, public app : App, public alertProvider : AlertProvider, public connectivity : ConnectivityProvider, public sqliteProvider : SqliteDatabaseProvider) {

    platform
      .ready()
      .then(() => {

        statusBar.styleDefault();

        if (this.connectivity.noConnection()) {
          console.log(" no internet")
          this
            .toast
            .showToast("No Internet Connection");
          // this.rootPage = TabsPage;
        }
        //this.contactProvider.fetchContactsFromMobile(); else{
        //
        // } this.createDatabase(); this.fetchContacts();
        this.checkUserLogin();
        this.pushsetup()
        splashScreen.hide();
        // Confirm exit
        var lastTimeBackPress = 0;
        var timePeriodToExit = 2000;
        this
          .platform
          .registerBackButtonAction(() => {
            //  console.log("backcall") console.log(this.app.getActiveNav().getViews())
            let view = this
              .app
              .getActiveNav()
              .getViews()
              .length;
            //  console.log(view, "lenght")
            if (view == 1) {
              if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                this
                  .platform
                  .exitApp(); //Exit from app
                if (this.menu.isOpen()) 
                  this.menu.close()
                else if (this.nav.canGoBack()) 
                  this.nav.pop({});
                }
              else {
                this
                  .toast
                  .showToastBack("Press back again to exit App?");
                lastTimeBackPress = new Date().getTime();
              }
            } else if (view != 1) {
              let nav = app.getActiveNav();
              let activeView : ViewController = nav.getActive();
              //  console.log(activeView)
              if (activeView != null) {
                if (nav.canGoBack()) 
                  nav.pop();
                else 
                  nav
                    .parent
                    .select(0); // goes to the first tab
                }
              }
          });

      });
  }

  createDatabase() {
    this
      .sqliteProvider
      .openDatabase('data.db', 'default')
      .then(data => {
        console.log(data, 'data');
      }, err => {
        console.log(err, 'error');
      });
  }

  checkUserLogin() {
    console.log("checkUserLogin");
    this
      .nativeStorage
      .getItem('token')
      .then(token => {
        this
          .nativeStorage
          .getItem('user')
          .then(user => {
            if (user != undefined && user.id != undefined) 
              this.groupservice.viewGroup({token: token, admin_id: user.id}).then(res => {
                console.log(res)
                this.userProvider.user = user;
                this.userProvider.token = token;
                // this.contactProvider.fetchContactsFromMobile();
                if (!user.mobile_number || !user.gender) 
                  this.nav.setRoot(EditProfilePage, {'profile_data': user});
                else 
                  this.rootPage = TabsPage;
                }
              , error => this.error(error));
            else 
              this.error("")
          }, error => this.error(error));
      }, error => this.error(error));
  }

  error(err) {
    console.error(err, "err")
    this
      .nativeStorage
      .clear();
    this.rootPage = LoginPage;
    //this.rootPage = "AddSubscriptionPage";

  }

  pushsetup() {
    this
      .push
      .hasPermission()
      .then((res : any) => {

        if (res.isEnabled) {

          console.log('We have permission to send push notifications');
        } else {

          console.log('We do not have permission to send push notifications');
        }

      });
    const options : PushOptions = {
      android: {
        sound: true
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };
    const pushObject : PushObject = this
      .push
      .init(options);
    pushObject
      .on('notification')
      .subscribe((notification : any) => {
        console.log('Received a notification', notification)
      });
    pushObject
      .on('registration')
      .subscribe((registration : any) => {
        console.log('Device registered', registration)
        this.userProvider.registrationId = registration.registrationId;
        console.log("registrtion id is" + this.userProvider.registrationId);
      });

    pushObject
      .on('error')
      .subscribe(error => console.error('Error with Push plugin', error));

  }
}
