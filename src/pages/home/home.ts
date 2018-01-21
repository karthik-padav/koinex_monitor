import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

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
  BTCnotify: any = {};
  ETHnotify: any = {};
  XRPnotify: any = {};
  BCHnotify: any = {};
  LTCnotify: any = {};
  MIOTAnotify: any = {};
  OMGnotify: any = {};
  GNTnotify: any = {};

  originalData: any = {};
  constructor(public navCtrl: NavController,
    private dataService: MyDataService,
    public alertCtrl: AlertController,
    private storage: Storage) {
    this.getTickerData();
    this.getNotifyValue();
    // this.refreshTickerData();
  }

  refreshTickerData(){
    setInterval(() => {
      this.getTickerData();
    }, 20000);
  }

  getNotifyValue() {
    this.storage.get('BTC').then((val) => {
      console.log(val);
      if(val == null){
        this.BTCnotify.notified = false;
      } else {
        this.BTCnotify = val;
      }
    });
    this.storage.get('ETH').then((val) => {
      console.log(val);
      if(val == null){
        this.ETHnotify.notified = false;
      } else {
        this.ETHnotify = val;
      }
    });
    this.storage.get('BCH').then((val) => {
      console.log(val);
      if(val == null){
        this.BCHnotify.notified = false;
      } else {
        this.BCHnotify = val;
      }
    });
    this.storage.get('GNT').then((val) => {
      console.log(val);
      if(val == null){
        this.GNTnotify.notified = false;
      } else {
        this.GNTnotify = val;
      }
    });
    this.storage.get('LTC').then((val) => {
      console.log(val);
      if(val == null){
        this.LTCnotify.notified = false;
      } else {
        this.LTCnotify = val;
      }
    });
    this.storage.get('MIOTA').then((val) => {
      console.log(val);
      if(val == null){
        this.MIOTAnotify.notified = false;
      } else {
        this.MIOTAnotify = val;
      }
    });
    this.storage.get('OMG').then((val) => {
      console.log(val);
      if(val == null){
        this.OMGnotify.notified = false;
      } else {
        this.OMGnotify = val;
      }
    });
    this.storage.get('XRP').then((val) => {
      console.log(val);
      if(val == null){
        this.XRPnotify.notified = false;
      } else {
        this.XRPnotify = val;
      }
    });
  }
  getTickerData() {
    this.dataService.getTicker().subscribe((data) => {
      this.ticker = data;
      console.log(this.ticker);
    });
  }

  showPrompt(ticker, val) {
    console.log(ticker);
    console.log(val);
    let prompt = this.alertCtrl.create({
      title: 'Notify me',
      message: "Enter value to be notified",
      inputs: [
        {
          name: 'title',
          placeholder: val
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
            this.saveNotify(ticker, data.title);
          }
        }
      ]
    });
    prompt.present();
  }

  saveNotify(ticker, notifyVal) {
    console.log(ticker);
    console.log(notifyVal);
    if (ticker == 'BTC') {
      this.BTCnotify = {
        'name': ticker,
        'notified': true,
        'notifyVal': notifyVal
      }
      this.storage.set('BTC', this.BTCnotify);
    } else if (ticker == 'ETH') {
      this.ETHnotify = {
        'name': ticker,
        'notified': true,
        'notifyVal': notifyVal
      }
      this.storage.set('ETH', this.ETHnotify);
    } else if (ticker == 'BCH') {
      this.BCHnotify = {
        'name': ticker,
        'notified': true,
        'notifyVal': notifyVal
      }
      this.storage.set('BCH', this.BCHnotify);
    } else if (ticker == 'GNT') {
      this.GNTnotify = {
        'name': ticker,
        'notified': true,
        'notifyVal': notifyVal
      }
      this.storage.set('GNT', this.GNTnotify);
    } else if (ticker == 'LTC') {
      this.LTCnotify = {
        'name': ticker,
        'notified': true,
        'notifyVal': notifyVal
      }
      this.storage.set('LTC', this.LTCnotify);
    } else if (ticker == 'MIOTA') {
      this.MIOTAnotify = {
        'name': ticker,
        'notified': true,
        'notifyVal': notifyVal
      }
      this.storage.set('MIOTA', this.MIOTAnotify);
    } else if (ticker == 'OMG') {
      this.OMGnotify = {
        'name': ticker,
        'notified': true,
        'notifyVal': notifyVal
      }
      this.storage.set('OMG', this.OMGnotify);
    } else if (ticker == 'XRP') {
      this.XRPnotify = {
        'name': ticker,
        'notified': true,
        'notifyVal': notifyVal
      }
      this.storage.set('XRP', this.XRPnotify);
    }
  }
  
  Change_Toggle(ticker, flag, tickerVal){
    console.log(ticker);
    if (ticker == 'BTC') {
    this.storage.get('BTC').then((val) => {
      this.BTCnotify = val;
      this.BTCnotify.notified = flag;
    });
      this.storage.set('BTC', this.BTCnotify);
    } else if (ticker == 'ETH') {
      this.storage.get('ETH').then((val) => {
        this.ETHnotify = val;
        this.ETHnotify.notified = flag;
      });
      this.storage.set('ETH', this.ETHnotify);
    } else if (ticker == 'BCH') {
      this.storage.get('BCH').then((val) => {
        this.BCHnotify = val;
        this.BCHnotify.notified = flag;
      });
      this.storage.set('BCH', this.BCHnotify);
    } else if (ticker == 'GNT') {
      this.storage.get('GNT').then((val) => {
        this.GNTnotify = val;
        this.GNTnotify.notified = flag;
      });
      this.storage.set('GNT', this.GNTnotify);
    } else if (ticker == 'LTC') {
      this.storage.get('LTC').then((val) => {
        if(val){
          this.LTCnotify = val;
          this.LTCnotify.notified = flag;
          this.storage.set('LTC', this.LTCnotify);
        } else {
          this.showPrompt(ticker, tickerVal);
        }
      });
    } else if (ticker == 'MIOTA') {
      this.storage.get('MIOTA').then((val) => {
        this.MIOTAnotify = val;
        this.MIOTAnotify.notified = flag;
      });
      this.storage.set('MIOTA', this.MIOTAnotify);
    } else if (ticker == 'OMG') {
      this.storage.get('OMG').then((val) => {
        this.OMGnotify = val;
        this.OMGnotify.notified = flag;
      });
      this.storage.set('OMG', this.OMGnotify);
    } else if (ticker == 'XRP') {
      this.storage.get('XRP').then((val) => {
        this.XRPnotify = val;
        this.XRPnotify.notified = flag;
      });
      this.storage.set('XRP', this.XRPnotify);
    }
  }
}
