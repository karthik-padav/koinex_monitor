import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController, AlertController } from 'ionic-angular';

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
  originalData: any = {};
  constructor(public navCtrl: NavController,
    private dataService: MyDataService,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private storage: Storage) {
    this.getTickerData();
  }

  getTickerData() {
    this.dataService.getTicker().subscribe((data) => {
      console.log(data);
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
            let notifyVal = notify.val;
            this.ticker.prices.push({ 'name': name, 'val': val, 'notified': this.notified, notifyVal: notifyVal });
          } else {
            this.notified = false;
            this.ticker.prices.push({ 'name': name, 'val': val, 'notified': this.notified, notifyVal: null });
          }
        });
      }
      console.log(this.ticker);
    });
  }

  notifyData(ticker) {
    console.log(ticker);
    let notifyData = {
      'notify':ticker.notified,
      'val':ticker.notifyVal
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
          placeholder: ticker.val
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
            console.log('Saved clicked');
            ticker.notifyVal = data.title;
            if(data.title){
              this.saveNotification(ticker);
            } else {
              console.log('enter value');
              this.presentToast('enter value');
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
              'notify':notify.notify,
              'val':ticker.notifyVal
            }
            this.storage.set(ticker.name, notifyData);
          } else {
            let notifyData = {
              'notify':false,
              'val':ticker.notifyVal
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
}
