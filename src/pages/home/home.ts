import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController, AlertController, LoadingController } from 'ionic-angular';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

import { MyDataService } from '../../app/dataService';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  ticker: any = {
    prices: [],
    stats: {}
  };
  notify: any = {};
  notified: any;
  notifyVal: any;
  loading: any;
  originalData: any = {};
  apiCall: boolean = false;
  constructor(public navCtrl: NavController,
    private dataService: MyDataService,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage) {
    this.init();
    this.refreshData();
  }

  refreshData() {
    this.presentLoadingDefault();
    setInterval(() => {
      this.apiCall = true;
      this.dataService.getTicker().subscribe((data) => {
        console.log(data);
        if (data) {
          this.ticker = {
            prices: [],
            stats: {}
          };
          this.originalData = data;
          let temp = (<any>Object).entries(data.prices);
          console.log(temp);
          this.ticker.stats = data.stats;
          for (let i = 0; i < temp.length; i++) {
            let name = temp[i][0];
            let val = temp[i][1];
            this.storage.get(name).then((notify) => {
              // console.log(notify);
              if (notify) {
                this.notified = notify.notify;
                this.notifyVal = notify.val;
                this.ticker.prices.push({ 'name': name, 'val': val, 'notified': this.notified, notifyVal: this.notifyVal });
                if (((Math.round(this.ticker.prices[i].val) == Math.round(this.ticker.prices[i].notifyVal) + 1)
                  ||
                  (Math.round(this.ticker.prices[i].val) == Math.round(this.ticker.prices[i].notifyVal) - 1))
                  &&
                  this.ticker.prices[i].notified) {
                    this.presentToast(this.ticker.prices[i].name + ' Close Match found');
                } else if ((Math.round(this.ticker.prices[i].val) == Math.round(this.ticker.prices[i].notifyVal)) && this.ticker.prices[i].notified) {
                  this.presentToast(this.ticker.prices[i].name + ' Match found');
                }
              } else {
                this.notified = false;
                this.ticker.prices.push({ 'name': name, 'val': val, 'notified': this.notified, notifyVal: null });
              }
            });
          }
          console.log(this.ticker);
          this.apiCall = false;
          if (this.loading) {
            this.loading.dismiss();
          }
        }
      });
    }, 30000)
  }

  init() {
    this.presentLoadingDefault();
    this.dataService.getTicker().subscribe((data) => {
      console.log(data);
      if (data) {
        this.originalData = data;
        let temp = (<any>Object).entries(data.prices);
        console.log(temp);
        this.ticker.stats = data.stats;
        for (let i = 0; i < temp.length; i++) {
          let name = temp[i][0];
          let val = temp[i][1];
          this.storage.get(name).then((notify) => {
            console.log(notify);
            if (notify) {
              this.notified = notify.notify;
              this.notifyVal = notify.val;
              this.ticker.prices.push({ 'name': name, 'val': val, 'notified': this.notified, notifyVal: this.notifyVal });
              if (((Math.round(this.ticker.prices[i].val) == Math.round(this.ticker.prices[i].notifyVal) + 1)
                ||
                (Math.round(this.ticker.prices[i].val) == Math.round(this.ticker.prices[i].notifyVal) - 1))
                &&
                this.ticker.prices[i].notified) {
                  this.presentToast(this.ticker.prices[i].name + ' Close Match found');
              } else if ((Math.round(this.ticker.prices[i].val) == Math.round(this.ticker.prices[i].notifyVal)) && this.ticker.prices[i].notified) {
                this.presentToast(this.ticker.prices[i].name + ' Match found');
              }
            } else {
              this.notified = false;
              this.ticker.prices.push({ 'name': name, 'val': val, 'notified': this.notified, notifyVal: null });
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
    console.log('notify match check');
    console.log(this.ticker);
    for (let temp = 0; temp < this.ticker.prices.length; temp++) {
      // if(this.ticker.prices[temp].notifyVal){}
      this.ticker.prices[temp] = ~~this.ticker.prices[temp];
      console.log(this.ticker.prices[temp])
    }
  }

  notifyData(ticker) {
    console.log(ticker);
    let notifyData = {
      'notify': ticker.notified,
      'val': ticker.notifyVal
    }
    this.storage.set(ticker.name, notifyData);
  }

  showPrompt(ticker) {
    console.log(ticker);
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
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data);
            console.log((data.title).match(/^\d+$/));
            if (data.title) {
              ticker.notifyVal = data.title;
              this.saveNotification(ticker);
              console.log('Saved clicked');
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
    console.log(ticker);
    this.storage.get(ticker.name).then((notify) => {
      console.log(notify);
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
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  presentLoadingDefault() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
    }
  }
}
