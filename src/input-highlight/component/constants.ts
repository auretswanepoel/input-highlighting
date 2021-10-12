import { HighlightTag } from '../model/highlight-tag.model';

export const styleProperties = Object.freeze([
  'direction', // RTL support
  'boxSizing',
  'width', // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
  'height',
  'overflowX',
  'overflowY', // copy the scrollbar for IE

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',

  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/font
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',

  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration', // might not make a difference, but better be safe

  'letterSpacing',
  'wordSpacing',

  'tabSize',
  'MozTabSize',
]);

export const tagIndexIdPrefix = 'text-highlight-tag-id-';

export function indexIsInsideTag(index: number, tag: HighlightTag) {
  return tag.indices.start < index && index < tag.indices.end;
}

export function overlaps(tagA: HighlightTag, tagB: HighlightTag) {
  return (
    indexIsInsideTag(tagB.indices.start, tagA) ||
    indexIsInsideTag(tagB.indices.end, tagA)
  );
}

export function isCoordinateWithinRect(rect: ClientRect, x: number, y: number) {
  return rect.left < x && x < rect.right && rect.top < y && y < rect.bottom;
}

export function escapeHtml(str: string): string {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export interface TagMouseEvent {
  tag: HighlightTag;
  target: HTMLElement;
  event: MouseEvent;
}
