import { Directive, ElementRef, Input,Output, OnInit, OnDestroy,EventEmitter } from '@angular/core';
import { Events, } from 'ionic-angular';
/**
 * Generated class for the HighlightDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[highlight]' // Attribute selector
})
export class HighlightDirective implements OnInit{
  @Input() data;
  el: HTMLElement;
  constructor(el: ElementRef) {
    this.el = el.nativeElement;
    //console.log('Hello HighlightDirective Directive',this.el,this.data);
    
  }
 ngOnInit(){
   //console.log(this.data,"data")
   var regex = new RegExp("^([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   if (regexp.test(this.data)) {
   // console.log("match")
   this.el.innerHTML = `<a href='${this.data}'>${this.data}</a>`;
   }
   else if (regex.test(this.data)){
   this.el.innerHTML = `<a href='http://${this.data}'>${this.data}</a>`;
   }
   else{
    this.el.innerHTML = this.data;
   //console.log("no match");
    }
  }
  
  

}
