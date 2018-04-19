import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ViewController} from 'ionic-angular';
import {Events} from 'ionic-angular';
/**
 * Generated class for the DistanceMeasureComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({selector: 'discard', templateUrl: 'discard.html'})
export class DistanceMeasureComponent {

  text : string;

  constructor(public view : ViewController, public navParams : NavParams, public navCtrl : NavController, public events : Events) {
    console.log('Hello DistanceMeasureComponent Component');
    this.text = 'Hello World';
  }
  cancel()
  {
    this.closeModal();

  }
  discard()
  {
    console.log("discard")
    this
      .events
      .publish('discardPage', "true");
    this.closeModal();
  }
  closeModal()
  {
    console.log("call close");
    this
      .view
      .dismiss(true);
  }

}
