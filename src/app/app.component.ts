import { Component, ViewChild } from '@angular/core';
import { Nav, ToastController, Platform } from 'ionic-angular';
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

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private toastCtrl: ToastController,
              private admobFree: AdMobFree,
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
      // this.showAdmobBannerAds();
      this.checkInternet();

    });
  }

  // Internet check
  checkInternet(){
    // Internet check
    console.log('Checking for internet');
      let disconnectSub = this.network.onDisconnect().subscribe(() => {
        this.presentToast('you are offline');
        console.log('network was disconnected :-(');
        this.isOnline = false;
      });
      
      let connectSub = this.network.onConnect().subscribe(()=> {
        this.presentToast('you are online');
        console.log('network connected :-)');
        this.isOnline = true;
      });
      console.log(this.isOnline);
  }

  // Show add
  showAdmobBannerAds(){
    const bannerConfig: AdMobFreeBannerConfig = {
        isTesting: true,
        autoShow: true
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare()
    .then(() => {
        // banner Ad is ready
        // if we set autoShow to false, then we will need to call the show method here
        this.presentToast('Banner is ready');
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
}
