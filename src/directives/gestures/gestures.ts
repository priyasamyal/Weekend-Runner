import {
  Directive,
  ElementRef,
  Input,
  Output,
  OnInit,
  OnDestroy,
  EventEmitter,
} from '@angular/core';
import {Gesture} from 'ionic-angular/gestures/gesture';
import {Events} from 'ionic-angular';
/**
 * Generated class for the GesturesDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[longPress]', // Attribute selector
})
export class GesturesDirective implements OnInit, OnDestroy {
  @Input() data;
  @Input() over;
  el: HTMLElement;
  pressGesture: Gesture;
  pressGesture1: Gesture;
  list:boolean=false;
  @Output() sendData: EventEmitter<string> = new EventEmitter();
  @Output() unselect: EventEmitter<string> = new EventEmitter();
  @Output() show: EventEmitter<string> = new EventEmitter();
  constructor(el: ElementRef,public events: Events) {
   
    this.el = el.nativeElement;
    console.log('directiver.................',this.el);
    events.subscribe('selectionStop', (user, time) => {
      console.log('Welcome', user, 'at', time);
      this.list=false;
    });

    events.subscribe('selectionStart', (user, time) => {
      console.log('Welcome', user, 'at', time);
      this.list=true;
    });
  }
  ngOnInit() {
   
    this.pressGesture = new Gesture(this.el);
    this.pressGesture1 = new Gesture(this.el);
    console.log('pressed!!', this.pressGesture);
    this.pressGesture.listen();
    this.pressGesture1.listen();
    
    this.pressGesture1.on('tap', e => {
    if(this.list==true){
      console.log('click when false!!', this.data);
      if (this.el.style.backgroundColor == 'lightgray') {
          this.el.style.backgroundColor = 'white';
          this.data.itemSelect = false;
          this.unselect.emit(this.data);
        } else {
          this.el.style.backgroundColor = 'lightgray';
          this.data.itemSelect = true;
          this.sendData.emit(this.data);
        }
     }else{
      console.log('click when true!!', this.data);
      this.show.emit(this.data);
     }
     
    });


    this.pressGesture.on('press', e => {
      if(this.list==false){
        this.events.publish('selectionStart', "user", Date.now());
      }
     console.log('pressed!!',this.data);
   
      if (this.el.style.backgroundColor == 'lightgray') {
        this.el.style.backgroundColor = 'white';
        this.data.itemSelect = false;
        this.unselect.emit(this.data);
      } else {
       
        console.log()
        this.el.style.backgroundColor = 'lightgray';
        this.data.itemSelect = true;
        this.sendData.emit(this.data);
      }
    });
  }

  ngOnDestroy() {
    console.log('destroy');
    this.pressGesture.destroy();
  }
}
