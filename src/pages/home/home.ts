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
  notify: any = {};
  notified: any;
  notifyVal: any;
  dataSetInterval:any;
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
    if(this.dataSetInterval){
      clearInterval(this.dataSetInterval);
    }
    this.getData();
    this.dataSetInterval = setInterval(() => {
      this.getData();
    }, 30000);

    this.platform.ready().then(() => {
      this.localNotifications.on('click', (notification, state) => {
        let json = JSON.parse(notification.data);
        this.presentToast(json.myData);
      })

      this.platform.pause.subscribe(() => {
        this.appInBackground = true;
      });
    })
  }

  getData() {
    if(this.ticker.prices.length == 0){
      this.presentLoadingDefault();
    }
    this.dataService.getTicker().subscribe((data) => {
      if (data) {
        this.originalData = data;
        let temp = (<any>Object).entries(data.prices);
        this.ticker.stats = data.stats;
        for (let i = 0; i < temp.length; i++) {
          let name = temp[i][0];
          let val = temp[i][1];
          this.storage.get(name).then((notify) => {
            if (notify) {
              this.notified = notify.notify;
              this.notifyVal = notify.val;
              this.ticker.prices[i] = { 'id': i + 1, 'name': name, 'val': val, 'notified': this.notified, notifyVal: this.notifyVal };
              if (((Math.round(this.ticker.prices[i].val) == Math.round(this.ticker.prices[i].notifyVal) + 1)
                ||
                (Math.round(this.ticker.prices[i].val) == Math.round(this.ticker.prices[i].notifyVal) - 1))
                &&
                this.ticker.prices[i].notified) {
                // this.presentToast(this.ticker.prices[i].name + ' Close Match found');
                this.scheduleLocationNotification(this.ticker.prices[i], this.ticker.prices[i].name + ' Close Match found');
              } else if ((Math.round(this.ticker.prices[i].val) == Math.round(this.ticker.prices[i].notifyVal)) && this.ticker.prices[i].notified) {
                // this.presentToast(this.ticker.prices[i].name + ' Match found');
                this.scheduleLocationNotification(this.ticker.prices[i], this.ticker.prices[i].name + ' Match found');
              }
            } else {
              this.notified = false;
              this.ticker.prices[i] = { 'id': i + 1, 'name': name, 'val': val, 'notified': this.notified, notifyVal: null };
            }
          });
        }
        console.log(this.ticker);
        this.notifyMatchCheck();
        if (this.loading) {
          this.loading.dismiss();
        }
      }
    });
  }

  notifyMatchCheck() {
    for (let temp = 0; temp < this.ticker.prices.length; temp++) {
      // if(this.ticker.prices[temp].notifyVal){}
      this.ticker.prices[temp] = ~~this.ticker.prices[temp];
    }
  }

  notifyData(ticker) {
    let notifyData = {
      'notify': ticker.notified,
      'val': ticker.notifyVal
    }
    this.storage.set(ticker.name, notifyData);
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
              this.saveNotification(ticker);
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

  saveNotification(ticker) {
    this.storage.get(ticker.name).then((notify) => {
      if (notify) {
        let notifyData = {
          'notify': notify.notify,
          'val': ticker.notifyVal
        }
        this.storage.set(ticker.name, notifyData);
      } else {
        let notifyData = {
          'notify': false,
          'val': ticker.notifyVal
        }
        this.storage.set(ticker.name, notifyData);
      }
    });
  }

  presentToast(msg) {
    // if(!this.appInBackground){
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'bottom'
      });
  
      toast.present();
    // }
  }

  presentLoadingDefault() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
    }
  }

  scheduleLocationNotification(data, msg){
    // Schedule a single notification
    this.presentToast('Notification');
    this.localNotifications.schedule({
      id: 1,
      text: msg,
      sound: 'res://platform_default',
      icon: 'file://assets/img/logo.png',
      data: { myData: 'Disable ' + data.name + ' to stop notification' }
    });
  }
}
