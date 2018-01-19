import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

import { MyDataService } from '../../app/dataService';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  ticker: any={
    prices:[],
    stats:{}
  };
  notify:any[]=[];
  originalData:any={};
  constructor(public navCtrl: NavController,
              private dataService: MyDataService,
              public alertCtrl: AlertController) {
    this.getTickerData();
  }

  getTickerData(){
    this.dataService.getTicker().subscribe((data) => {
      console.log(data);
      this.originalData = data;
      let temp = (<any>Object).entries(data.prices);
      console.log(temp);
      this.ticker.stats = data.stats;
       for(let i=0; i<temp.length; i++){
         let name = temp[i][0];
         let val = temp[i][1];
        this.ticker.prices.push({'name' :name,'val':val});
       }
       console.log(this.ticker);
    });
  }

  showPrompt(ticker) {
    console.log(ticker);
    let prompt = this.alertCtrl.create({
      title: 'Notify me',
      message: "Enter value to be notified",
      inputs: [
        {
          name: 'title',
          placeholder: 'asdasd'
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
            this.notify.push({ticker:true});
            console.log(this.notify);
          }
        }
      ]
    });
    prompt.present();
  }
}
