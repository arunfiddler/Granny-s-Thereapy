import { Component ,NgZone,ViewChild} from '@angular/core';
import { NavController,Content } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
declare var window;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  

  messages: any[] = [];
  text: string = "";
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public ngZone : NgZone, public tts: TextToSpeech) {

    this.messages.push({
      text: "Hi, how can I help you?",
      sender: "api"
    })

    
  }

  image()
  { 
    var options = {
      databaseXmlFile: 'PluginTest.xml',
      targetList: [ 'logo', 'iceland', 'canterbury-grass', 'brick-lane' ],
      overlayMessage: 'Point your camera at a test image...',
      
      vuforiaLicense: 'ARXwIxP/////AAAAmYO7aX1spUGgvqNe0VAvqyIyrcDF4aeVZ4xO4D9Sg1/7Z9XnKCROqzQgmzAt7z6vA6nQ8C4+3aZ31RiBOPmkN5QY/LjxRUJ/1N0h9B/xPDwe89QGxaCDC+aUMF9Xz1Pi4KoVS8QXrBplGqqgjaFKblEYuQ45vbHTaJE1UCKDYJAzycvaJFgRFANoRIStvRxnNE3LKwaUlElVCX0Cz5RgOESMNGKFQ7x0aSpbHVPjy3TitJw36tJW7KTycLGA0nlhr1ZQ7NqeS1thna6ZEOUO9fl2ByyJh6AG68r0Z/EFHE7nBHPnAicyq/rSmLL68qDPzO+MVNZ7fPUrr9aTdLmDRkEzkfAPX4oXuDqC7GcDLNPf'
    };
     
    window["navigator"].VuforiaPlugin.startVuforia(
      options, 
      function(data) {
        // To see exactly what `data` can return, see 'Success callback `data` API' within the plugin's documentation. 
       
        
        if(data.status.imageFound) {
          var v:string =(" "+ data.result.imageName);
          alert(v);
            }
        else if (data.status.manuallyClosed) {
          alert("Image Session was closed forcefully!");
        }
      },
      function(data) {
        alert("Error: " + data);
      }
    );
    alert("okay"); 
  }
  sendText()
  {
    let message = this.text;

    this.messages.push({

    text: message,
    sender: 'me'
    });
    this.content.scrollToBottom(200);

    this.text="";
    window["ApiAIPlugin"].requestText({

      query: message
    },(response)=>{

      this.ngZone.run(()=>{
        this.messages.push({
          text: response.result.fulfillment.speech,
          sender: 'api'
        }); 
        this.content.scrollToBottom(200);
      })
      
    },(error)=>
    {
     alert(JSON.stringify(error))
    }

    )}
    sendVoice(){
      window["ApiAIPlugin"].requestVoice({},
      (response)=>{
        this.tts.speak({
          text: response.result.fulfillment.speech,
          locale: "en-IN",
          rate:1})
      },
      )
      }
}
