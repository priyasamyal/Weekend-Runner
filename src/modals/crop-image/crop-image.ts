/*!
 * Demo of Cropper.js v1.0.0-Beta2 with Ionic v2.2.1
 * https://github.com/itsru/Ionic2-Camera-with-CropperJS
 *
 * Copyright (c) 2017 Ru Selvadurai
 * Released under the MIT license
 *
 * Date: 2017-03-13
 */

import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
//import Cropper from 'cropperjs';

@Component({
  selector: 'crop-image',
  templateUrl: 'crop-image.html'
})

export class CropImageModal {
 @ViewChild('image') input: ElementRef;
  imageBase64: any;
  width: number;
  height: number;
 //cropper: Cropper;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.imageBase64 = this.navParams.get("imageBase64");
    this.width = this.navParams.get("width");
    this.height = this.navParams.get("height");
   console.log(this.width,this.height,"params")
  }

  cropperLoad() {
    console.log("load crop")
    //Set your required cropperJS options as seen here https://github.com/fengyuanchen/cropperjs/blob/master/README.md#options
  //  this.cropper = new Cropper(this.input.nativeElement, {
  //     dragMode: 'crop',
  //     aspectRatio: this.width / this.height,
  //     modal: true,
  //     guides: true,
  //     highlight: true,
  //     center: true,
  //     background: false,
  //     autoCrop: true,
  //     movable: false,
  //     zoomable: true,
  //     autoCropArea: 1,
  //     responsive: true,
  //     cropBoxMovable: true,
  //     cropBoxResizable: true,
  //     scalable: false,
  //     crop: (e: Cropper.CropperCustomEvent) => {
      
  //     }
  //   });
  }

  cropperReset() {
//this.cropper.reset()
   }
  imageRotate() { 
    //this.cropper.rotate(90);
   }
  cancel() { this.viewCtrl.dismiss(); }
  finish() {
  // let croppedImgB64String: string = this.cropper.getCroppedCanvas({
  //     width: this.width,
  //     height: this.height
  //   }).toDataURL('image/jpeg', (100 / 100));
    // Split the base64 string in data and contentType
    let croppedImgB64String: string ="ll"
var block = croppedImgB64String.split(";");
// Get the content type
var dataType = block[0].split(":")[1];// In this case "image/png"
// get the real base64 content of the file
var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."

// The path where the file will be created
var folderpath = "file:///storage/emulated/0/Android/data/com.goespy.ameba/cache/";
// The name of your file, note that you need to know if is .png,.jpeg etc
var d = new Date(),
n = d.getTime(),
newFileName = n + '.jpg';
var filename =newFileName;
this.savebase64AsImageFile(folderpath,filename,realData,dataType).then((data)=>{
  console.log(data)
  this.viewCtrl.dismiss(data);
});
   // this.viewCtrl.dismiss(croppedImgB64String);
  }

  savebase64AsImageFile(folderpath,filename,content,contentType){
    // Convert the base64 string in a Blob
    return new Promise((resolve,reject)=>{
      var DataBlob = this.b64toBlob(content,contentType);
      console.log(DataBlob,"dataBlob")
      
      console.log("Starting to write the file :3");
      
      (<any>window).resolveLocalFileSystemURL(folderpath, function(dir) {
          console.log("Access to the directory granted succesfully");
      dir.getFile(filename, {create:true}, function(file) {
              console.log("File created succesfully.",file);
              file.createWriter(function(fileWriter) {
                  console.log("Writing content to file");
                  fileWriter.write(DataBlob);
                  resolve(file.nativeURL)
                
              }, function(){
                reject("Error")
                  alert('Unable to save file in path '+ folderpath);
              });
      });
      });
    })
  
}
b64toBlob(b64Data, contentType) {
  contentType = contentType || '';
 var sliceSize =  512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
  }

var blob = new Blob(byteArrays, {type: contentType});
return blob;
}
}
