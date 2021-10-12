import { Component, OnInit, VERSION, ViewEncapsulation } from '@angular/core';
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

  tags: HighlightTag[] = [];
  tagClicked: HighlightTag;

  ngOnInit(): void {
    this.addTags();
  }

  addTags() {
    this.tags = [];
    const matchMentions = /(@\w+) ?/g;
    let mention;

    while ((mention = matchMentions.exec(this.textValue.value))) {
      this.tags.push({
        indices: {
          start: mention.index,
          end: mention.index + mention[1].length,
        },
        data: mention[1],
      });
    }

    const matchHashtags = /({{\w+}}) ?/g;
    let hashtag;
    while ((hashtag = matchHashtags.exec(this.textValue.value))) {
      this.tags.push({
        indices: {
          start: hashtag.index,
          end: hashtag.index + hashtag[1].length,
        },
        cssClass: 'bg-pink',
        data: hashtag[1],
      });
    }
  }

  addDarkClass(elm: HTMLElement) {
    if (elm.classList.contains('bg-blue')) {
      elm.classList.add('bg-blue-dark');
    } else if (elm.classList.contains('bg-pink')) {
      elm.classList.add('bg-pink-dark');
    }
  }

  removeDarkClass(elm: HTMLElement) {
    elm.classList.remove('bg-blue-dark');
    elm.classList.remove('bg-pink-dark');
  }
}
