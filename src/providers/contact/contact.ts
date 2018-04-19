import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';

import { ApiProvider } from '../api/api';
import { UserProvider } from '../user/user';

declare var angular: any;

@Injectable()
export class ContactProvider {
    contactsfound: any = [];
    contactDuplicate: any = [];
    friendsContacts: any = [];
    constructor(
        private contact: Contacts,
        public apiProvider: ApiProvider,
        public userProvider: UserProvider
    ) {
       // console.log('Hello ContactsProvider Provider');
    }
    // fetch contacts from mobile
    fetchContactsFromMobile() {
        return new Promise((resolve, reject) => {
            this.friendsContacts = [];
        // fetch all contacts
        this.contact.find(['*'], { filter: "" }).then((contacts) => {
            let contactsfound = JSON.parse(JSON.stringify(contacts));
            let validContacts = contactsfound.filter(x1 => x1._objectInstance.phoneNumbers != null);
            
            // make array with elements name, phone number & photos with duplicates
            // also have removed special charaters and country code
            for (let c of validContacts) {
                if (c._objectInstance.phoneNumbers.length > 1)
                    for (let i = 0; i < c._objectInstance.phoneNumbers.length; i++) {
                        this.contactDuplicate.push({ displayName: c._objectInstance.displayName, phoneNumbers: this.removeCountryCode(c._objectInstance.phoneNumbers[i].value.replace(/ |-|\(|\)/g, '')), photos: c._objectInstance.photos, isCheck: 0 })
                    }
                else
                    this.contactDuplicate.push({ displayName: c._objectInstance.displayName, phoneNumbers: this.removeCountryCode(c._objectInstance.phoneNumbers[0].value.replace(/ |-|\(|\)/g, '')), photos: c._objectInstance.photos, isCheck: 0 })
            }
         //   console.log(this.contactDuplicate,"contact duplicate")

            let y = [];
            this.contactsfound = this.removeDuplicatePhoneNumbers(this.contactDuplicate);
           // console.log(this.contactsfound,"contact contactsfound")
            this.contactsfound.map(g1 => y.push(g1.phoneNumbers));
         ///   console.log(y,"y  found", this.userProvider.token,"token")
            
    
            this.fetchContactsFromServer({ 'mobile_number': y, 'token': this.userProvider.token }).subscribe(data => {
             //   console.log("success.........", data);
                for (let x in this.contactsfound) {
                    for (let y in data.data) {
                        if (this.contactsfound[x].phoneNumbers == data.data[y].mobile_number) {
                            this.friendsContacts.push({ displayName: this.contactsfound[x].displayName, phoneNumbers: this.contactsfound[x].phoneNumbers, photos: this.contactsfound[x].photos, contact_id: data.data[y].id })
                        }
                    }
                }
             //   console.log("friends contatcts......", this.friendsContacts);
                resolve(true);
            }, err => {
             //   console.log("error........", err);
                reject(true);
            });
        })
    });
    }

    removeCountryCode(phoneNumber) {
        if (phoneNumber.startsWith("+"))
            switch (phoneNumber.length) {
                case 12:
                    return phoneNumber.substring(2);
                case 13:
                    return phoneNumber.substring(3);
                case 14:
                    return phoneNumber.substring(4);
            }
        return phoneNumber;
    }

    removeDuplicatePhoneNumbers(new_contacts) { // remove duplicate phone numbers
        return new_contacts.reduce((accumulator, current) => {
            return checkIfAlreadyExist(current) ? accumulator : [...accumulator, current];
            function checkIfAlreadyExist(currentVal) {
                return accumulator.some(item => item.phoneNumbers === currentVal.phoneNumbers);
            }
        }, []);
    }

  // fetch friends  contacts from server
  fetchContactsFromServer(body: Object) {
    return this.apiProvider.post(this.apiProvider.apiUrl + 'get_friends_list ', body)
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || error));
  }

}
