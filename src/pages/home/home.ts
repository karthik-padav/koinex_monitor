import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController, Platform, AlertController, LoadingController } from 'ionic-angular';
// import { Push } from '@ionic-native/push';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

import { MyDataService } from '../../app/dataService';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  sentNotification: any = {};
  ticker: any = {
    prices: [],
    stats: {}
  };
  localStorageData: any;
  notify: any = {};
  notified: any;
  notifyVal: any;
  dataSetInterval: any;
  loading: any;
  originalData: any = {};
  appInBackground: boolean;
  apiCall: boolean = false;
  constructor(public navCtrl: NavController,
    private dataService: MyDataService,
    public alertCtrl: AlertController,
    public platform: Platform,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private localNotifications: LocalNotifications,
    private storage: Storage) {
    if (this.dataSetInterval) {
      clearInterval(this.dataSetInterval);
      console.log('setInterval cleared');
    }
    this.getData();
    this.dataSetInterval = setInterval(() => {
      this.getData();
    }, 30000);

    this.platform.ready().then(() => {
      this.localNotifications.on('click', (notification, state) => {
        let json = JSON.parse(notification.data);
        let toast = this.toastCtrl.create({
          message: 'Notification shows up for every 30 seconds',
          // duration: 3000,
          dismissOnPageChange: true,
          showCloseButton: true,
          closeButtonText: "Ok",
          position: 'bottom'
        });

        toast.present();
      })

      this.platform.pause.subscribe(() => {
        this.appInBackground = true;
      });
    })
  }

  getData() {
    this.apiCall = true;
    if (this.ticker.prices.length == 0) {
      this.presentLoadingDefault();
    }
    this.dataService.getTicker().subscribe((data) => {
      if (data) {
        this.apiCall = false;
        this.originalData = data;
        let temp = (<any>Object).entries(data.prices);
        this.ticker.stats = data.stats;
        let count = 0
        this.storage.get('ticker').then((data) => {
          this.localStorageData = data;
          for (let i = 0; i < temp.length; i++) {
            count++;
            let data = {
              'id': i + 1,
              'name': temp[i][0],
              'val': temp[i][1],
              'notified': this.localStorageData ? this.localStorageData.prices[i].notified : null,
              'notifyVal': this.localStorageData ? this.localStorageData.prices[i].notifyVal : null
            };
            this.ticker.prices[i] = data;
            if (count == temp.length) {
              this.storage.set('ticker', this.ticker);
            }
            this.notifyMatchCheck(data);
          }
        })
        if (this.loading) {
          this.loading.dismiss();
        }
      }
    }, (err) => {
      console.log('Api Error');
      if (this.loading) {
        this.loading.dismiss();
      }
      this.storage.get('ticker').then((localStorageData) => {
        if (localStorageData) {
          this.ticker = localStorageData;
        } else {
          this.presentLoadingDefault();
        }
      });
    })
  }

  notifyMatchCheck(data) {
    if (((Math.round(data.val) == Math.round(data.notifyVal) + 1)
      ||
      (Math.round(data.val) == Math.round(data.notifyVal) - 1))
      &&
      data.notified) {
      this.scheduleLocalNotification(data, data.name + ' Close Match found');
    } else if ((Math.round(data.val) == Math.round(data.notifyVal)) && data.notified) {
      this.scheduleLocalNotification(data, data.name + ' Match found');
    }
  }

  notifyData(ticker) {
    this.storage.get('ticker').then((localStorageData) => {
      localStorageData.prices[ticker.id - 1] = ticker;
      this.ticker.prices[ticker.id - 1] = ticker;
      this.storage.set('ticker', localStorageData);
    });
  }

  showPrompt(ticker) {
    let prompt = this.alertCtrl.create({
      title: 'Notify me',
      message: "Enter value to be notified",
      inputs: [
        {
          name: 'title',
          type: 'number',
          placeholder: ticker.val,
          value: ticker.notifyVal
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (data.title) {
              ticker.notifyVal = data.title;
              ticker.notified = true;
              this.storage.get('ticker').then((localStorageData) => {
                localStorageData.prices[ticker.id - 1] = ticker;
                this.ticker.prices[ticker.id - 1] = ticker;
                this.storage.set('ticker', localStorageData);
              });
            } else {
              this.presentToast('Enter value to be notified');
              return false;
            }
          }
        }
      ]
    });
    prompt.present();
  }

  presentToast(msg) {
    if (!this.appInBackground) {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
    }
  }

  presentLoadingDefault() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
    }
  }

  scheduleLocalNotification(data, msg) {
    // Schedule a single notification
    this.localNotifications.schedule({
      id: 1,
      text: msg,
      sound: 'res://platform_default',
      smallIcon: 'res://logo',
      icon: 'file://assets/imgs/icon.png',
      data: { myData: 'Disable ' + data.name + ' to stop notification' }
    });
  }
}
