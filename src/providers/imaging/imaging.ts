import { Injectable } from '@angular/core';
import { AlertController, Platform, ModalController,ActionSheetController } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import { CropImageModal } from '../../modals/crop-image/crop-image';

/*
  Generated class for the ImagingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImagingProvider {
  actionSheet;
  
  constructor(public platform: Platform, public alertCtrl: AlertController, public modalCtrl: ModalController,public actionSheetCtrl: ActionSheetController,
  ) {
    console.log('Hello ImagingProvider Provider');
  }
  getImage(width: number, height: number, quality: number, useCropperJS: boolean) {
    return Observable.create(observer => {
      //Set default options for taking an image with the camera
      let imageOptions: any = {
        quality: quality,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: 1,
        saveToPhotoAlbum: false,
        mediaType: Camera.MediaType.PICTURE,
        cameraDirection: 1
      };
       this.actionSheet = this.actionSheetCtrl.create({
      title: 'Choose Image From',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            console.log('Camera clicked');
           // this.actionSheet.dismiss();
          
          },
        },
        {
          text: 'Open Gallery',
          role: 'cancel',
          icon: 'image',
          handler: () => {
            console.log('gallery clicked');
            imageOptions.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
            //this.actionSheet.dismiss();
          },
        },
      ],
    });
    this.actionSheet.onDidDismiss(() => {
      this.getCameraImage(imageOptions).subscribe(image => {
        if (useCropperJS) {
          let cropModal = this.modalCtrl.create(CropImageModal, { "imageBase64": image, "width": width, "height": height });
          cropModal.onDidDismiss((croppedImage: any) => {
            if (!croppedImage)
              observer.error("Canceled while cropping.")
            else {
              observer.next(croppedImage);
              observer.complete();
            }
          });
          cropModal.present();
        }
        else {
          observer.next(image);
          observer.complete();
        }
      }, error => observer.error(error));
    });
    this.actionSheet.present();

      
    });
  }

  getCameraImage(options: any) {
    return Observable.create(observer => {
      this.platform.ready().then(() => {
        Camera.getPicture(options).then((imageData: any) => {
          // imageData is a base64 encoded string as per options set above
          let base64Image: string = "data:image/jpeg;base64," + imageData;
          observer.next(base64Image);
          observer.complete();
        }, error => {
          observer.error(error);
        });
      });
    });
  }
}
