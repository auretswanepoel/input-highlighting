import {
  Component,
  ElementRef,
  OnInit,
  VERSION,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { HighlightTag } from '../input-highlight/model/highlight-tag.model';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;
  textValue = new FormControl(
    `Hello @auret how are you today?\n\nLook I have a #different {{requester_firstName}} color!\n\n{{date logEntry_decidedOn 'yyyy-MM-dd HH:mm'}} is pretty awesome!`
  );
  mentionConfig = {
    mentions: [
      {
        items: <string[]>[
          'requester_firstname',
          'requester_lasstname',
          'requester_email',
        ],
        triggerChar: '@',
        mentionSelect: this.formatInput,
      },
      {
        items: <string[]>['date', 'number', 'currency'],
        triggerChar: '#',
        mentionSelect: this.formatFunctionInput,
      },
    ],
  };
  tags: HighlightTag[] = [];
  tagClicked: HighlightTag;
  @ViewChild('textarea') textarea: ElementRef;

  ngOnInit(): void {
    this.addTags();
  }

  addTags() {
    this.tags = [];
    let mention;
    const matchObjectTags = /{{([\_\-a-zA-Z-9])*}}/g;
    while ((mention = matchObjectTags.exec(this.textValue.value))) {
      this.tags.push({
        indices: {
          start: mention.index,
          end: mention.index + mention[0].length,
        },
        data: mention[0],
        type: 'property',
      });
    }
    let functions;
    const matchFunctionTags =
      /{{(date?|currency?|number?)([\'\:\_a-zA-Z-9\s])*}}/g;

    while ((functions = matchFunctionTags.exec(this.textValue.value))) {
      this.tags.push({
        indices: {
          start: functions.index,
          end: functions.index + functions[0].length,
        },
        cssClass: 'bg-pink',
        data: functions[0],
        type: 'function',
      });

      console.log(
        functions,
        'functions',
        mention,
        this.tags.map((t) => t.type)
      );
    }
  }

  mentionClosed() {}

  addDarkClass(elm: HTMLElement) {
    if (elm.classList.contains('bg-blue')) {
      elm.classList.add('bg-blue-dark');
    } else if (elm.classList.contains('bg-pink')) {
      elm.classList.add('bg-pink-dark');
    }
  }

  formatInput(event) {
    return `{{${event.label}}}`;
  }

  formatFunctionInput(event) {
    return `{{${event.label} field_name 'yyyy-MM-dd'}}`;
  }

  removeDarkClass(elm: HTMLElement) {
    elm.classList.remove('bg-blue-dark');
    elm.classList.remove('bg-pink-dark');
  }
}
