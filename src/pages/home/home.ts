import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from './../../app/auth/auth.service';
import { AuthHttp } from 'angular2-jwt';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var responsiveVoice: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 public switcher:any;
 public currentMessage: string;
 public selectedVoice: string;
 public messages: any;
 public channels: any;
 public voices: any;
 public enabledChannels: any[] = [];
 public user: any;
 API_URL = 'http://slackplayer.com/conversation/';
 SLACK_TOKEN = 'xoxp-6730903766-89598566801-247255349857-46aeee42f8f1cec7224f37eedb66bbf1';

  constructor(public navCtrl: NavController, public auth: AuthService,  public http: Http, public authHttp: AuthHttp) {
    auth.handleAuthentication();
    this.switcher = 'player';
  }

  ngOnInit() {
    this.getChannels();
    this.getMessages();
    this.voices = responsiveVoice.getVoices();
    this.selectedVoice = 'UK English Female';
  }

  public playMessage(): void {
    responsiveVoice.speak(this.currentMessage, this.selectedVoice);
  }

  public setCurrentMessage(msg): void {
    if (msg.event.text && msg.user_info.user && msg.channel_info) {
      this.switcher = 'player';
      this.currentMessage = this.composeMessage(msg);
      this.playMessage(); 
    }
  }

  public composeMessage(msg) {
    let user = msg.user_info.user.real_name;
    let channel = msg.channel_info.channel.name;
    
    //TODO:  Need to add message parsing
    //let messageText = this.parseMessageText(msg.event.text);
    
    let messageText = msg.event.text;
    return user + " wrote in the " + channel + " channel: " + messageText;
  }

  public parseMessageText(msgText) {
    var msgArray = msgText.split("");
    var userArray = [];
    var userStartIndex;
    var userEndIndex;

    for (let i = 0; i <= msgArray.length; i++) {
      if (msgArray[i] === "<" && msgArray[i+1] === "@") {
        userStartIndex = i + 2;
      }
      if (msgArray[i] === ">") {
        userEndIndex = i - 1;
        var userId = msgArray.slice(userStartIndex, userEndIndex).join("");
        userArray.push(userId);
      }
    } 

    console.log(userArray);

    let realUserName = this.getUser(userArray[0]);

    //TODO: need to get the user.real_name from the Slack API for each of the users mentioned 
    //in the message and do a search and replace on the @mention with the userId

    return '';
  }

  public playLatest(): void {
    if (this.messages) {
      this.setCurrentMessage(this.messages[0]);
    }
  }

  public getMessages(): void {
    this.http.get(`${this.API_URL}`)
      .map(res => res.json())
      .subscribe(
        data => this.messages = data.reverse(),
        error => this.currentMessage = error
      );
    }

  public toggleChannel(channelName, channelChecked): void {
    if (channelChecked) {
      this.enabledChannels.push(channelName);
    } else {
      let channelIndex = this.enabledChannels.indexOf(channelName);
      this.enabledChannels.splice(channelIndex);
    }
    // console.log(this.enabledChannels);
  }

  public getUser(userId) {
    return this.http.get(`https://slack.com/api/user.info?token=${this.SLACK_TOKEN}&user=${userId}`)
    .map(res => res.json())
    .subscribe(
      data => data.user.real_name
    );
  }

  public getChannels(): void {
    this.http.get(`https://slack.com/api/channels.list?token=${this.SLACK_TOKEN}&limit=100`)
    .map(res => res.json())
    .subscribe(
      data => {
        this.channels = data.channels
        this.channels.forEach(element => {
          element.checked = true;
          this.toggleChannel(element.name, element.checked);
        });
        // this.channels.map(channels => this.enabledChannels = channels.name);
      }
    );
  }


}
