import { Component, ViewChild, ElementRef } from '@angular/core';
import { ApiRequestService } from '../Services/api-request.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';
interface messageInterface {
  content : string,
  user : string,
};

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent {
  messages : messageInterface[] = [];
  messageSent : boolean = false;
  inputForm : FormGroup
  @ViewChild('chatWindow') pageBottom : ElementRef;

  constructor(private apiService : ApiRequestService) { }

  ngOnInit() {
    this.inputForm = new FormGroup({
      inputText : new FormControl(null, [Validators.required])
    });
  }


  onSubmit() {
    if (this.inputForm.invalid)
      return;
    const question = this.inputForm.value['inputText'];
    this.messages.push({ content : question, user : 'user' });
    this.messageSent = true;
    console.log('something started');
    // chrome.tabs.query({ active : true, currentWindow : true }, function (tabs) {
      this.apiService.sendMessage(question, 'https://exposnitc.github.io/expos-docs/roadmap/stage-04/').subscribe({
        next : (data) => {
          this.messages.push({ content : data['answer'], user : 'bot' });
          this.messageSent = false; 
        },
        error : (error) => {
          this.messages.push({ content : "random output", user : 'bot'});
          this.messageSent = false;
        }
      })
    // })
  this.inputForm.reset();
  }

  scrollDown() {
    this.pageBottom.nativeElement.scrollTo(0, this.pageBottom.nativeElement.scrollHeight);
  }


  ngAfterViewChecked(): void {
    this.scrollDown();
  }
}
