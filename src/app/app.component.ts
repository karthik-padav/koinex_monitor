import { Component, ViewChild } from '@angular/core';
import { Nav, ToastController, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { Network } from '@ionic-native/network';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  isOnline:boolean;
  loading:any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private toastCtrl: ToastController,
              private admobFree: AdMobFree,
              public loadingCtrl: LoadingController,
              private network: Network) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.showAdmobBannerAds();
      
      // stop disconnect watch
      this.network.onDisconnect().subscribe(() => {
        // this.presentToast('network was disconnected :-(');
        this.presentLoadingDefault('Waiting for Network...');
      });
      // watch network for a connection
      this.network.onConnect().subscribe(() => {
        if (this.loading) {
          this.loading.dismiss();
        }
        this.presentToast('Network connected!');
        setTimeout(() => {
          if (this.network.type === 'wifi') {
            this.presentToast('We got a wifi connection, woohoo!');
          }
        }, 3000);
      });

      // Confirm exit
      let lastTimeBackPress = 0;
      let timePeriodToExit  = 2000;
      this.platform.registerBackButtonAction(() => {
        if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
          this.platform.exitApp(); //Exit from app
      } else {
          this.presentToast('Press back again to exit App?');
          lastTimeBackPress = new Date().getTime();
      }
      })
    });
  }

  // Show add
  showAdmobBannerAds(){
    const bannerConfig: AdMobFreeBannerConfig = {
        id: 'ca-app-pub-4098169854204453/1220464988',
        isTesting: false,
        autoShow: true
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare()
    .then(() => {
        // banner Ad is ready
        // if we set autoShow to false, then we will need to call the show method here
    })
    .catch(e => {console.log(e),this.presentToast(e)});    
    }      

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }
  
  presentLoadingDefault(msg) {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: msg
      });
      this.loading.present();
    }
  }
}
