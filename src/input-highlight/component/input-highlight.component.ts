import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { HighlightTag } from '../model/highlight-tag.model';

import {
  TagMouseEvent,
  escapeHtml,
  indexIsInsideTag,
  isCoordinateWithinRect,
  overlaps,
  styleProperties,
  tagIndexIdPrefix,
} from './constants';

@Component({
  selector: 'input-highlight',
  templateUrl: './input-highlight.component.html',
  styleUrls: ['./input-highlight.component.scss'],
})
export class InputHighlightComponent implements OnChanges, OnDestroy {
  @Input() textInputElement: HTMLTextAreaElement;
  @Input() textInputValue: string;
  @Input() tags: HighlightTag[] = [];
  @Input() tagCssClass: string = '';

  @Output() tagClick = new EventEmitter<TagMouseEvent>();
  @Output() tagMouseEnter = new EventEmitter<TagMouseEvent>();
  @Output() tagMouseLeave = new EventEmitter<TagMouseEvent>();
  @ViewChild('highlightElement') private highlightElement: ElementRef;

  highlightElementContainerStyle: { [key: string]: string } = {};
  highlightedText: string;

  private mouseHoveredTag: TagMouseEvent | undefined;
  private isDestroyed = false;
  private textareaEventListeners: Array<() => void> = [];
  private highlightTagElements: Array<{
    element: HTMLElement;
    clientRect: ClientRect;
  }>;

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.textareaEventListeners.forEach((unregister) => unregister());
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.textInputElement) {
      this.textInputElementChanged();
    }

    if (changes.tags || changes.tagCssClass || changes.textInputValue) {
      this.addTags();
    }
  }

  textInputElementChanged() {
    const elementType = this.textInputElement.tagName.toLowerCase();
    if (elementType !== 'textarea') {
      throw new Error(
        'The angular-text-input-highlight component must be passed ' +
          'a textarea to the `textInputElement` input. Instead received a ' +
          elementType
      );
    }

    setTimeout(() => {
      if (!this.isDestroyed) {
        this.refresh();
        this.textareaEventListeners.forEach((unregister) => unregister());
        this.textareaEventListeners = [
          this.renderer.listen(this.textInputElement, 'input', () => {
            this.addTags();
          }),
          this.renderer.listen(this.textInputElement, 'scroll', () => {
            this.highlightElement.nativeElement.scrollTop =
              this.textInputElement.scrollTop;
            this.highlightTagElements = this.highlightTagElements.map((tag) => {
              tag.clientRect = tag.element.getBoundingClientRect();
              return tag;
            });
          }),
          this.renderer.listen(this.textInputElement, 'mouseup', () => {
            this.refresh();
          }),
        ];

        if (this.tagClick.observed) {
          const onClick = this.renderer.listen(
            this.textInputElement,
            'click',
            (event) => {
              this.handleTextareaMouseEvent(event, 'click');
            }
          );
          this.textareaEventListeners.push(onClick);
        }

        if (this.tagMouseEnter.observed) {
          const onMouseMove = this.renderer.listen(
            this.textInputElement,
            'mousemove',
            (event) => {
              this.handleTextareaMouseEvent(event, 'mousemove');
            }
          );
          const onMouseLeave = this.renderer.listen(
            this.textInputElement,
            'mouseleave',
            (event) => {
              if (this.mouseHoveredTag) {
                this.tagMouseLeave.emit(this.mouseHoveredTag);
                this.mouseHoveredTag = undefined;
              }
            }
          );
          this.textareaEventListeners.push(onMouseMove);
          this.textareaEventListeners.push(onMouseLeave);
        }
        this.addTags();
      }
    });
  }

  addTags() {
    const textInputValue =
      typeof this.textInputValue !== 'undefined'
        ? this.textInputValue
        : this.textInputElement.value;

    const prevTags: HighlightTag[] = [];
    const parts: string[] = [];

    [...this.tags]
      .sort((tagA, tagB) => {
        return tagA.indices.start - tagB.indices.start;
      })
      .forEach((tag) => {
        if (tag.indices.start > tag.indices.end) {
          throw new Error(
            `Highlight tag with indices [${tag.indices.start}, ${tag.indices.end}] cannot start after it ends.`
          );
        }
        prevTags.forEach((prevTag) => {
          if (overlaps(prevTag, tag)) {
            throw new Error(
              `Highlight tag with indices [${tag.indices.start}, ${tag.indices.end}] overlaps with tag [${prevTag.indices.start}, ${prevTag.indices.end}]`
            );
          }
        });
        const expectedTagLength = tag.indices.end - tag.indices.start;
        const tagContents = textInputValue.slice(
          tag.indices.start,
          tag.indices.end
        );
        if (tagContents.length === expectedTagLength) {
          const previousIndex =
            prevTags.length > 0 ? prevTags[prevTags.length - 1].indices.end : 0;
          const before = textInputValue.slice(previousIndex, tag.indices.start);
          parts.push(escapeHtml(before));
          const cssClass = tag.cssClass || this.tagCssClass;
          const tagId = tagIndexIdPrefix + this.tags.indexOf(tag);
          // text-highlight-tag-id-${id} is used instead of a data attribute to prevent an angular sanitization warning
          parts.push(
            `<span class="text-highlight-tag ${tagId} ${cssClass}">${escapeHtml(
              tagContents
            )}</span>`
          );
          prevTags.push(tag);
        }
      });
    const remainingIndex =
      prevTags.length > 0 ? prevTags[prevTags.length - 1].indices.end : 0;
    const remaining = textInputValue.slice(remainingIndex);
    parts.push(escapeHtml(remaining));
    parts.push('&nbsp;');
    this.highlightedText = parts.join('');
    this.cdr.detectChanges();
    this.highlightTagElements = Array.from(
      this.highlightElement.nativeElement.getElementsByTagName('span')
    ).map((element: HTMLElement) => {
      return { element, clientRect: element.getBoundingClientRect() };
    });
  }

  handleTextareaMouseEvent(
    event: MouseEvent,
    eventName: 'click' | 'mousemove'
  ) {
    const matchingTagIndex = this.highlightTagElements.findIndex((elm) =>
      isCoordinateWithinRect(elm.clientRect, event.clientX, event.clientY)
    );
    if (matchingTagIndex > -1) {
      const target = this.highlightTagElements[matchingTagIndex].element;
      const tagClass = Array.from(target.classList).find((className) =>
        className.startsWith(tagIndexIdPrefix)
      );
      if (tagClass) {
        const tagId = tagClass.replace(tagIndexIdPrefix, '');
        const tag: HighlightTag = this.tags[+tagId];
        const tagMouseEvent = { tag, target, event };
        if (eventName === 'click') {
          this.tagClick.emit(tagMouseEvent);
        } else if (!this.mouseHoveredTag) {
          this.mouseHoveredTag = tagMouseEvent;
          this.tagMouseEnter.emit(tagMouseEvent);
        }
      }
    } else if (eventName === 'mousemove' && this.mouseHoveredTag) {
      this.mouseHoveredTag.event = event;
      this.tagMouseLeave.emit(this.mouseHoveredTag);
      this.mouseHoveredTag = undefined;
    }
  }

  refresh() {
    const computed: any = getComputedStyle(this.textInputElement);
    styleProperties.forEach((prop) => {
      this.highlightElementContainerStyle[prop] = computed[prop];
    });
  }
}
