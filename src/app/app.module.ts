import {BrowserModule} from '@angular/platform-browser';
import {
  ErrorHandler,
  NgModule,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import {Http} from '@angular/http';
import {
  IonicApp,
  IonicErrorHandler,
  IonicModule,
  NavController,
  ViewController,
} from 'ionic-angular';
import {MyApp} from './app.component';
//****List of plugins***//
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Contacts} from '@ionic-native/contacts';
import {Crop} from '@ionic-native/crop';
import {DatePicker} from '@ionic-native/date-picker';
//import { Diagnostic } from '@ionic-native/diagnostic';
import {EmojiPickerModule} from '@ionic-tools/emoji-picker';
import {Facebook} from '@ionic-native/facebook';
import {File} from '@ionic-native/file';
import {FilePath} from '@ionic-native/file-path';
import {FileChooser} from '@ionic-native/file-chooser';
import {Geolocation} from '@ionic-native/geolocation';
import {GooglePlus} from '@ionic-native/google-plus';
import {HttpModule} from '@angular/http';
import {NativeStorage} from '@ionic-native/native-storage';
import {Network} from 'ionic-native';
import {PhotoViewer} from '@ionic-native/photo-viewer';

import {SocialSharing} from '@ionic-native/social-sharing';
import {SplashScreen} from '@ionic-native/splash-screen';
import {SQLite} from '@ionic-native/sqlite';
import {StatusBar} from '@ionic-native/status-bar';
import {Transfer} from '@ionic-native/transfer';
import {Push} from '@ionic-native/push';
import {HaversineService} from 'ng2-haversine';

//****List of Pages***//
import {AddGroupMembersPage} from '../pages/add-group-members/add-group-members';
import {GroupchatPage} from '../pages/groupchat/groupchat';
import {ContactsPage} from '../pages/contacts/contacts';
import {ChangePasswordPage} from '../pages/change-password/change-password';
import {EditProfilePage} from '../pages/edit-profile/edit-profile';
import {EventsPage} from '../pages/events/events';
import {EventDetailPage} from '../pages/event-detail/event-detail';
import {ForgotPasswordPage} from '../pages/forgot-password/forgot-password';
import {LoginPage} from '../pages/login/login';
import {morePopover} from '../pages/events/morePopover';
import {ProfilePage} from '../pages/profile/profile';
import {PopoverPage} from '../pages/popover/popover';
import {PageTwo} from '../pages/events/page-two';
import {ShowOption} from '../pages/add-group-members/showOption';
import {SignupPage} from '../pages/signup/signup';
import {TabsPage} from '../pages/tabs/tabs';
import {MapPage} from '../pages/map/map';

//****List of Providers***//
import {AlertProvider} from '../providers/alert/alert';
import {ApiProvider} from '../providers/api/api';
import {ConnectivityProvider} from '../providers/connectivity/connectivity';
import {ContactProvider} from '../providers/contact/contact';
import {GoogleProvider} from '../providers/google/google';
import {GroupProvider} from '../providers/group/group';
import {ImagingProvider} from '../providers/imaging/imaging';
import {LocationProvider} from '../providers/location/location';
import {SqliteDatabaseProvider} from '../providers/sqlite-database/sqlite-database';
import {ToastProvider} from '../providers/toast/toast';
import {UserProvider} from '../providers/user/user';
import {MapProvider} from '../providers/map/map';
//****List of Components***//
import {DistanceMeasureComponent} from '../components/discard/discard';
import {GoogleMap} from '../components/google-map/google-map';
//****List of Directives***//
import {GesturesDirective} from '../directives/gestures/gestures';
import {HighlightDirective} from '../directives/highlight/highlight';
import {KeyboardEnterDirective} from '../directives/keyboard-enter/keyboard-enter';

//modals
import {CropImageModal} from '../modals/crop-image/crop-image';
@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ProfilePage,
    SignupPage,
    ForgotPasswordPage,
    EditProfilePage,
    ChangePasswordPage,
    TabsPage,
    GroupchatPage,
    ContactsPage,
    ShowOption,
    AddGroupMembersPage,
    MapPage,
    GoogleMap,
    DistanceMeasureComponent,
    EventsPage,
    PageTwo,
    EventDetailPage,
    morePopover,
    GesturesDirective,
    KeyboardEnterDirective,
    HighlightDirective,
    CropImageModal,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      //    'backButtonText': '',
      // backButtonIcon: 'ios-arrow-back',
      pageTransition: 'ios',
    }),
    EmojiPickerModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MapPage,
    MyApp,
    LoginPage,
    ContactsPage,
    ProfilePage,
    ShowOption,
    SignupPage,
    ForgotPasswordPage,
    EditProfilePage,
    ChangePasswordPage,
    TabsPage,
    GroupchatPage,
    AddGroupMembersPage,
    DistanceMeasureComponent,
    EventsPage,
    PageTwo,
    morePopover,
    EventDetailPage,
    CropImageModal,
  ],
  providers: [
    Crop,
    //Diagnostic,
    Facebook,
    MapProvider,
    StatusBar,
    SplashScreen,
    SQLite,
    Contacts,
    NativeStorage,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler,
    },
    UserProvider,
    ToastProvider,
    ApiProvider,
    GooglePlus,
    GoogleProvider,
    AlertProvider,
    Camera,
    FilePath,
    File,
    Geolocation,
    FileChooser,
    LocationProvider,
    Network,
    DatePicker,
    SocialSharing,
    Transfer,
    Push,
    PhotoViewer,
    GroupProvider,
    ContactProvider,
    ConnectivityProvider,
    SqliteDatabaseProvider,
    HaversineService,
    ImagingProvider,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
  @ViewChild(NavController) nav: NavController;
  @ViewChild(ViewController) viewCtrl: ViewController;
}
