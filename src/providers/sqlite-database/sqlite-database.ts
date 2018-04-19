import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {SQLite} from 'ionic-native';

/*
  Generated class for the SqliteDatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class SqliteDatabaseProvider {
  public database: SQLite;
  constructor(public http: Http) {
 //   console.log('Hello SqliteDatabaseProvider Provider');
  }

  public openDatabase(name, location) {
    return new Promise((resolve, reject) => {
      this.database = new SQLite();
      this.database.openDatabase({name: name, location: location}).then(
        () => {
       //   console.log("database open")
            resolve(true);
        },
        error => {
          console.log('ERROR: ', error);
          reject(false);
        }
      );
    });
  }
/*******Save user Chats in groups**********/
  saveChatByGroupId(chatMessages) {
    return new Promise((resolve, reject) => {
      this.database.executeSql( 'CREATE TABLE IF NOT EXISTS messages ( group_id INTEGER,first_name TEXT , last_name TEXT, msg TEXT, reciever_id Integer, sender_id Integer, thread_id TEXT)',{})
      .then(() => {
        // console.log('Created messages table');
        // console.log("messeg lenght",chatMessages.length)
        // console.log("chats get", chatMessages);
        let done = 0;
        for (let chat in chatMessages) {
          this.database.executeSql("INSERT INTO messages (group_id , first_name, last_name , msg, sender_id , reciever_id, thread_id) VALUES (?,?,?,?,?,?,?)",
          [chatMessages[chat].group_id,
          chatMessages[chat].first_name,
          chatMessages[chat].last_name,
          chatMessages[chat].msg,
          chatMessages[chat].sender_id,
          chatMessages[chat].reciever_id,
          chatMessages[chat].thread_id,]).then((data) => {
            console.log("INSERTED: " + JSON.stringify(data));
          }, (error) => {
            console.log("ERROR: " + JSON.stringify(error.err));
          }).then(()=>{
            ++done;
            if(done == chatMessages.length)
              resolve(true);
          });
        }
      })
      .catch(e => {
        console.log(e)
        reject(e);
      });
    });
  }
  ///*******Get  User Chats in groups**********///
  getChatByGroupId(){
    return new Promise((resolve, reject) => {
      this.database.executeSql('SELECT * FROM messages WHERE group_id="96"', []).then(
        data => {
          let messages = [];
          if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
              messages.push({
                group_id: data.rows.item(i).group_id,
                first_name: data.rows.item(i).first_name,
                last_name: data.rows.item(i).last_name,
                msg: data.rows.item(i).msg,
                sender_id: data.rows.item(i).sender_id,
                reciever_id: data.rows.item(i).reciever_id,
                thread_id: data.rows.item(i).thread_id,
              });
            }
            console.log("messeg lenght",messages.length)
            resolve(messages);
          } else {
            console.log("messeg lenght",messages.length)
            
            resolve(messages);
          }
        },
        error => {
          reject(JSON.stringify(error));
        }
      );
    });
 }
/*******Save user groups**********/
 saveUsersGroups(groupData) {
  return new Promise((resolve, reject) => {
    this.database.executeSql( 'CREATE TABLE IF NOT EXISTS groups ( group_id INTEGER PRIMARY KEY ,date_added TEXT,group_image TEXT , group_name TEXT, is_superadmin TEXT, thread_id INTEGER)',{})
    .then(() => {
      console.log('Created messages table');
      console.log("messeg lenght",groupData.length)
      console.log("group get", groupData);
      let done = 0;
      for (let group in groupData) {
        this.database.executeSql("INSERT INTO groups (group_id,date_added, group_image , group_name, is_superadmin,thread_id) VALUES (?,?,?,?,?,?)",
       [groupData[group].group_id,
        groupData[group].date_added,
        groupData[group].group_image,
        groupData[group].group_name,
        groupData[group].is_superadmin,
        groupData[group].thread_id,
        ]).then((data) => {
          console.log("INSERTED: " + JSON.stringify(data));
        }, (error) => {
          console.log("ERROR: " + JSON.stringify(error));
        }).then(()=>{
          ++done;
          if(done == groupData.length)
            resolve(true);
        });
      }
    })
    .catch(e => {
      console.log(e)
      reject(e);
    });
  });
}


getGroup(){
  return new Promise((resolve, reject) => {
    this.database.executeSql('SELECT * FROM groups ', []).then(
      data => {
        let groups = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            groups.push({
              group_id: data.rows.item(i).group_id,
              date_added: data.rows.item(i).date_added,
              group_image: data.rows.item(i).group_image,
              group_name: data.rows.item(i).group_name,
              is_superadmin: data.rows.item(i).is_superadmin,
              thread_id: data.rows.item(i).thread_id,
             });
          }
          console.log("groups lenght",groups.length)
          resolve(groups);
        } else {
          console.log("groups lenght",groups.length)
          resolve(groups);
        }
      },
      error => {
        reject(JSON.stringify(error));
      }
    );
  });
}

  deleteGroup(group) {
    console.log(group,"delete group from database");
   this.database.executeSql("DELETE FROM groups  WHERE group_id ='" + group.group_id + "'", [])
        .then(
          data => {
            console.log(JSON.stringify(data));
          },
          error => {
            console.log(JSON.stringify(error.err));
          }
        );
  }

  update(user) {
    console.log(user);
    var query = 'UPDATE people SET firstname=?,lastname=?  WHERE id=?';
    return new Promise((resolve, reject) => {
      this.database
        .executeSql(query, [user.firstname, user.lastname, user.id])
        .then(
          data => {
            resolve(JSON.stringify(data));
          },
          error => {
            reject(JSON.stringify(error.err));
          }
        );
    });
  }
}
