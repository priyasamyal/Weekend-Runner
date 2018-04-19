import {Injectable} from '@angular/core';
import {Events} from 'ionic-angular';

import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {ApiProvider} from '../api/api';
import {NativeStorage} from '@ionic-native/native-storage';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import {ToastProvider} from '../../providers/toast/toast';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {UserProvider} from '../user/user';
/*
  Generated class for the GroupProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GroupProvider {

  mygroups : Array < any > = [];
  updateGroups : Array < any > = [];
  groupbuddy : any;
  buddymessages;
  constructor(public transfer : Transfer, public events : Events, public api : ApiProvider, private nativeStorage : NativeStorage, public http : Http, public toast : ToastProvider, public userProvider : UserProvider) {
    // console.log('Hello GroupProvider Provider');
  }

  initializebuddy(buddy) {
    this.groupbuddy = buddy;
    //console.log(this.groupbuddy)
  }

  //Used to change the profile image or update it
  createGroupWithImage(groupData) {
    // console.log("with Image") console.log(groupData);
    let groupInfo = {
      group_name: groupData.groupName,
      token: this.userProvider.token,
      user_id: this.userProvider.user.id

    }
    console.log('create group with image', groupInfo);

    return new Promise((resolve, reject) => {
      const fileTransfer : TransferObject = this
        .transfer
        .create();
      var filename = groupData
        .groupPic
        .split('/')
        .pop();
      var changeScope = this;
      var options = {
        fileKey: 'group_image', // this equal to <input type="file" id="upl">
        fileName: filename,
        mimeType: 'image/jpg',
        chunkedMode: false,
        params: {
          group_name: groupData.groupName,
          user_id: this.userProvider.user.id
        },
        headers: {
          'x-access-token': this.userProvider.token
        }
      };
      console.log('params', JSON.stringify(options));
      //  console.log(this.api.apiUrl + // 'upload_profile_image')
      fileTransfer
        .upload(groupData.groupPic, this.api.apiUrl + 'create_group', options)
        .then(result => {
          //   console.log('fileTransfer upload SUCCESS:');   console.log(result);

          var res = JSON.parse(result.response);
          if (res.status) {
            this
              .toast
              .showToast(res.msg);
            //   console.log('no erro', res); this.setUser(res.data);
            resolve(result.response);
          } else 
            reject(res.msg);
          }
        , err => {
          //   console.log('errrrrrr' + JSON.stringify(err));
          reject(err);
        });
    });
  }
  createGroupWithoutImage(groupData) {
    let groupInfo = {
      group_name: groupData.groupName,
      token: this.userProvider.token,
      user_id: this.userProvider.user.id,
      fileName: "filename"
    }
    //  console.log('updateGroupImage', groupInfo);

    return new Promise((resolve, reject) => {

      this
        .api
        .post(this.api.apiUrl + 'create_group', groupInfo)
        .map(res => res.json())
        .subscribe(res => {
          //  console.log('group result');  console.log(groupInfo);   console.log(res);
          if (res.status) {
            resolve(res.data);
          } else if (res.msg.errno == undefined) 
            reject(res.msg);
          else 
            reject('Please enter vaild inputs');
          }
        , err => {
          //   console.log(err.msg);
          if (err.msg) 
            reject(err.msg);
          else 
            reject('Server not responding');
          }
        );
    });

  }
  updateGroupWithoutImage(groupData) {
    let groupInfo = {
      group_name: groupData.group_name,
      token: this.userProvider.token,
      // user_id: this.userProvider.user.id,
      group_id: groupData.group_id
    }
    console.log('updateGroupImage', groupInfo);

    return new Promise((resolve, reject) => {

      this
        .api
        .post(this.api.apiUrl + 'edit_group', groupInfo)
        .map(res => res.json())
        .subscribe(res => {
          // console.log('group result'); console.log(groupInfo); console.log(res);
          if (res.status) {
            resolve(res.data);
          } else if (res.msg.errno == undefined) 
            reject(res.msg);
          else 
            reject('Please enter vaild inputs');
          }
        , err => {
          console.log(err.msg);
          if (err.msg) 
            reject(err.msg);
          else 
            reject('Server not responding');
          }
        );
    });

  }

  updateGroupWithImage(groupData) {
    console.log("with Image", groupData)
    console.log(groupData);
    let groupInfo = {
      group_name: groupData.group_name,
      token: this.userProvider.token,
      group_id: groupData.group_id
    }
    console.log('updateProfileImage', groupInfo);

    return new Promise((resolve, reject) => {
      const fileTransfer : TransferObject = this
        .transfer
        .create();
      var filename = groupData
        .group_image
        .split('/')
        .pop();
      var changeScope = this;
      var options = {
        fileKey: 'group_image', // this equal to <input type="file" id="upl">
        fileName: filename,
        mimeType: 'image/jpg',
        chunkedMode: false,
        params: {
          group_name: groupData.group_name,
          group_id: groupData.group_id
        },
        headers: {
          'x-access-token': this.userProvider.token
        }
      };
      console.log('params', JSON.stringify(options));
      //console.log(this.api.apiUrl + 'upload_profile_image')
      fileTransfer
        .upload(groupData.group_image, this.api.apiUrl + 'edit_group', options)
        .then(result => {
          console.log('fileTransfer upload SUCCESS:');
          console.log(result);

          var res = JSON.parse(result.response);
          if (res.status) {
            this
              .toast
              .showToast(res.msg);
            // console.log('no erro', res); this.setUser(res.data);
            resolve(result.response);
          } else 
            reject(res.msg);
          }
        , err => {
          // console.log('errrrrrr' + JSON.stringify(err));
          reject(err);
        });
    });
  }
  viewGroup(groupInfo) {
    // console.log("view Group api",groupInfo);

    return new Promise((resolve, reject) => {
      this
        .api
        .post(this.api.apiUrl + 'get_groups_by_user_id', groupInfo)
        .map(res => res.json())
        .subscribe(res => {
          // console.log('group res'); console.log(groupInfo); console.log(res);
          if (res.status) {
            resolve(res.data);
          } else if (res.msg.errno == undefined) 
            reject(res.msg);
          else 
            reject('Please enter vaild inputs');
          }
        , err => {
          console.log(err.msg);
          if (err.msg) 
            reject(err.msg);
          else 
            reject('Server not responding');
          }
        );
    });
  }

  makeGroupAdmin(groupInfo) {
    return new Promise((resolve, reject) => {
      this
        .api
        .post(this.api.apiUrl + 'make_group_admin  ', groupInfo)
        .map(res => res.json())
        .subscribe(res => {
          // console.log('group res', groupInfo); console.log(res);
          if (res.status) {
            resolve(res.status);

          } else if (res.msg.errno == undefined) 
            reject(res.msg);
          else 
            reject('Please enter vaild inputs');
          }
        , err => {
          // console.log(err.msg);
          if (err.msg) 
            reject(err.msg);
          else 
            reject('Server not responding');
          }
        );

    });
  }
  removeGroupAdmin(groupInfo) {
    return new Promise((resolve, reject) => {
      this
        .api
        .post(this.api.apiUrl + 'remove_group_admin  ', groupInfo)
        .map(res => res.json())
        .subscribe(res => {
          // console.log('group res', groupInfo); console.log(res);
          if (res.status) {
            resolve(res.status);
          } else if (res.msg.errno == undefined) 
            reject(res.msg);
          else 
            reject('Please enter vaild inputs');
          }
        , err => {
          //   console.log(err.msg);
          if (err.msg) 
            reject(err.msg);
          else 
            reject('Server not responding');
          }
        );
    });

  }

  deleteGroup(groupdata) {
    let groupInfo = {
      group_id: groupdata.group_id,
      admin_id: this.userProvider.user.id,
      token: this.userProvider.token
    }
    return new Promise((resolve, reject) => {
      this
        .api
        .post(this.api.apiUrl + 'delete_group ', groupInfo)
        .map(res => res.json())
        .subscribe(res => {
          //  console.log('group res');  console.log(groupInfo);   console.log(res);
          this.updateGroups = res.data
          if (res.status) {
            resolve(res.data);
            this
              .toast
              .showToast(res.msg);
            // this.events.publish('updategroup');
          } else if (res.msg.errno == undefined) 
            reject(res.msg);
          else 
            reject('Please enter vaild inputs');
          }
        , err => {
          //  console.log(err.msg);
          if (err.msg) 
            reject(err.msg);
          else 
            reject('Server not responding');
          }
        );

    });

  }

  deleteGroupMember(userInfo, groupId) {
    let groupInfo = {
      group_id: groupId,
      user_id: userInfo.user_id,
      token: this.userProvider.token
    }
    //  console.log(groupInfo);
    return new Promise((resolve, reject) => {
      this
        .api
        .post(this.api.apiUrl + 'delete_group_member ', groupInfo)
        .map(res => res.json())
        .subscribe(res => {
          //     console.log('group res',groupInfo);     console.log(res);
          if (res.status) {
            resolve(res.data);
            this
              .toast
              .showToast(res.msg);
          } else if (res.msg.errno == undefined) 
            reject(res.msg);
          else 
            reject('Please enter vaild inputs');
          }
        , err => {
          //    console.log(err.msg);
          if (err.msg) 
            reject(err.msg);
          else 
            reject('Server not responding');
          }
        );

    });
  }

  exitGroup(groupId) {
    let groupInfo = {
      group_id: groupId,
      user_id: this.userProvider.user.id,
      token: this.userProvider.token
    }
    // console.log(groupInfo);
    return new Promise((resolve, reject) => {
      this
        .api
        .post(this.api.apiUrl + 'delete_group_member ', groupInfo)
        .map(res => res.json())
        .subscribe(res => {
          //  console.log('group res',groupInfo);   console.log(res);
          if (res.status) {
            resolve(res);
            this
              .toast
              .showToast("You exit from group successfuly");
          } else if (res.msg.errno == undefined) 
            reject(res.msg);
          else 
            reject('Please enter vaild inputs');
          }
        , err => {
          //    console.log(err.msg);
          if (err.msg) 
            reject(err.msg);
          else 
            reject('Server not responding');
          }
        );

    });
  }

  addGroupMember(members) { // add group member inn particular group
    members.admin_id = this.userProvider.user.id;
    //console.log("params.......", members);

    return new Promise((resolve, reject) => {
      this
        .api
        .post(this.api.apiUrl + 'add_group_member ', members)
        .map(res => res.json())
        .subscribe(res => {
          //  console.log('group res');   console.log(res);
          if (res.status) {
            resolve(res.status);
          } else if (res.msg.errno == undefined) 
            reject(res.msg);
          else 
            reject('Please enter vaild inputs');
          }
        , err => {
          console.log(err.msg);
          if (err.msg) 
            reject(err.msg);
          else 
            reject('Server not responding');
          }
        );
    });
  }

  getGroupMember(members) { // get group member inn particular group
    //  console.log("params.......", members);
    return new Promise((resolve, reject) => {
      this
        .api
        .post(this.api.apiUrl + 'get_group_user_by_id', members)
        .map(res => res.json())
        .subscribe(res => {
          //  console.log('group res');  console.log(res);
          if (res.status) {
            resolve(res.data);
          } else if (res.msg.errno == undefined) 
            reject(res.msg);
          else 
            reject('Please enter vaild inputs');
          }
        , err => {
          //  console.log(err.msg);
          if (err.msg) 
            reject(err.msg);
          else 
            reject('Server not responding');
          }
        );
    });
  }
  createEvent(eventdata) {
    eventdata.date = eventdata
      .date
      .split('T')[0];
    // console.log(this.userProvider.token,this.userProvider.user.id,"id")
    eventdata.photo = "no photo"
    eventdata.user_id = this.userProvider.user.id;
    eventdata.token = this.userProvider.token;
    //  console.log(eventdata);
    return new Promise((resolve, reject) => {
      this
        .api
        .post(this.api.apiUrl + 'create_event  ', eventdata)
        .map(res => res.json())
        .subscribe(res => {
          //  console.log('group res',eventdata);  console.log(res);
          if (res.status) {
            resolve(true);
            this
              .toast
              .showToast("Event Created successfuly");
          } else if (res.msg.errno == undefined) 
            reject(res.msg);
          else {
            this
              .toast
              .showToast('Please enter vaild inputs');
            reject('Please enter vaild inputs');
          }
        }, err => {
          //     console.log(err.msg);
          if (err.msg) {
            reject(err.msg);
            this
              .toast
              .showToast(err.msg);
          } else 
            reject('Server not responding');
          }
        );
    });
  }
  updateEvent(eventdata, img_path) {
    eventdata.date = eventdata
      .date
      .split('T')[0];
    // console.log(this.userProvider.token,this.userProvider.user.id,"id")
    // eventdata.photo=img_path
    eventdata.user_id = this.userProvider.user.id;
    eventdata.token = this.userProvider.token;
    console.log(eventdata);
    return new Promise((resolve, reject) => {
      this
        .api
        .post(this.api.apiUrl + 'edit_event  ', eventdata)
        .map(res => res.json())
        .subscribe(res => {
          // console.log('group res',eventdata); console.log(res);
          if (res.status) {
            resolve(true);
            this
              .toast
              .showToast("Event updatesd successfuly");
          } else if (res.msg.errno == undefined) 
            reject(res.msg);
          else {
            this
              .toast
              .showToast('Please enter vaild inputs');
            reject('Please enter vaild inputs');
          }
        }, err => {
          // console.log(err.msg);
          if (err.msg) {
            reject(err.msg);
            this
              .toast
              .showToast(err.msg);
          } else 
            reject('Server not responding');
          }
        );
    });
  }
  CreateEventWithPhoto(eventdata, image) {
    // console.log(image);
    eventdata.date = eventdata
      .date
      .split('T')[0];
    // console.log("with Image") console.log(eventdata);
    eventdata.user_id = this.userProvider.user.id;
    // console.log('updateProfileImage', eventdata);
    return new Promise((resolve, reject) => {
      const fileTransfer : TransferObject = this
        .transfer
        .create();
      var filename = image
        .split('/')
        .pop();
      var changeScope = this;
      var options = {
        fileKey: 'photo', // this equal to <input type="file" id="upl">
        fileName: filename,
        mimeType: 'image/jpg',
        chunkedMode: false,
        params: eventdata,
        headers: {
          'x-access-token': this.userProvider.token
        }
      };
      // console.log('params', JSON.stringify(options));  console.log(this.api.apiUrl
      // + 'upload_profile_image')
      fileTransfer
        .upload(image, this.api.apiUrl + 'create_event', options)
        .then(result => {
          // console.log('fileTransfer upload SUCCESS:');  console.log(result);
          var res = JSON.parse(result.response);
          if (res.status) {
            this
              .toast
              .showToast(res.msg);
            //  console.log('no erro', res);
            resolve(true);
          } else {
            reject(res.msg);
            this
              .toast
              .showToast(res.msg.sqlMessage);
          }
        }, err => {
          //  console.log('errrrrrr' + JSON.stringify(err));
          let data = JSON.stringify(err)
          this
            .toast
            .showToast(err.msg);
          reject(err);
        });
    });
  }

  updateEventWithPhoto(eventdata, image) {
    console.log(image);
    eventdata.date = eventdata
      .date
      .split('T')[0];
    //  console.log("with Image") console.log(eventdata);
    eventdata.user_id = this.userProvider.user.id;
    console.log('updateProfileImage', eventdata);
    return new Promise((resolve, reject) => {
      const fileTransfer : TransferObject = this
        .transfer
        .create();
      var filename = image
        .split('/')
        .pop();
      var changeScope = this;
      var options = {
        fileKey: 'photo', // this equal to <input type="file" id="upl">
        fileName: filename,
        mimeType: 'image/jpg',
        chunkedMode: false,
        params: eventdata,
        headers: {
          'x-access-token': this.userProvider.token
        }
      };
      console.log('params', options);
      // console.log(this.api.apiUrl + 'upload_profile_image')
      fileTransfer
        .upload(image, this.api.apiUrl + 'edit_event', options)
        .then(result => {
          console.log('fileTransfer upload SUCCESS:');
          console.log(result);
          var res = JSON.parse(result.response);
          if (res.status) {
            this
              .toast
              .showToast(res.msg);
            //   console.log('no erro', res);
            resolve(true);
          } else {
            reject(res.msg);
            this
              .toast
              .showToast(res.msg.sqlMessage);
          }
        }, err => {
          // console.log('errrrrrr' + JSON.stringify(err));
          let data = JSON.stringify(err)
          this
            .toast
            .showToast(err.msg);
          reject(err);
        });
    });
  }

  getEventsByGroup_id(groupId) {
    let eventdata = {
      token: this.userProvider.token,
      user_id: this.userProvider.user.id,
      group_id: groupId
    }
    //  console.log(eventdata);
    return new Promise((resolve, reject) => {
      this
        .api
        .post(this.api.apiUrl + 'get_events_by_group_id', eventdata)
        .map(res => res.json())
        .subscribe(res => {
          //  console.log('group List',eventdata);  console.log(res);
          if (res.status) {
            resolve(res.data);
            // this.toast.showToast("Event Created successfuly");
          } else if (res.msg.errno == undefined) 
            reject(res.msg);
          else 
            reject('Please enter vaild inputs');
          }
        , err => {
          // console.log(err.msg);
          if (err.msg) 
            reject(err.msg);
          else 
            reject('Server not responding');
          }
        );
    });
  }

  OnEventSelectionAction(data, index) {
    let eventdata = {
      token: this.userProvider.token,
      user_id: this.userProvider.user.id,
      event_id: data.id,
      meta_name: "user_status",
      meta_value: index
    }
    return new Promise((resolve, reject) => {
      this
        .api
        .post(this.api.apiUrl + 'create_event_meta ', eventdata)
        .map(res => res.json())
        .subscribe(res => {
          // console.log(' selection',eventdata); console.log(res);
          if (res.status) {
            resolve(res.data);
            // this.toast.showToast("Event Created successfuly");
          } else if (res.msg.errno == undefined) 
            reject(res.msg);
          else 
            reject('Please enter vaild inputs');
          }
        , err => {
          //          console.log(err.msg);
          if (err.msg) 
            reject(err.msg);
          else 
            reject('Server not responding');
          }
        );
    });
  }

  getEventMeta(data) {
    // console.log(data,"ddaata")
    let eventdata = {
      token: this.userProvider.token,
      event_id: data.id,
      meta_name: "user_status"
    }
    return new Promise((resolve, reject) => {
      this
        .api
        .post(this.api.apiUrl + 'get_event_meta  ', eventdata)
        .map(res => res.json())
        .subscribe(res => {
          // console.log(' get_event_meta',eventdata); console.log(res);
          if (res.status) {
            resolve(res.data);
            // this.toast.showToast("Event Created successfuly");
          } else if (res.msg.errno == undefined) 
            reject(res.msg);
          else 
            reject('Please enter vaild inputs');
          }
        , err => {
          //   console.log(err.msg);
          if (err.msg) 
            reject(err.msg);
          else 
            reject('Server not responding');
          }
        );
    });
  }

}
