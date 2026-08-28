/* Guards over the scroller.
 *
 * The full-screen snap format is the client's requirement (rule 1), so what
 * these watch is not the format but the ways it turns into something unusable.
 *
 * The first is nesting. The export makes every scene a scrolling container
 * inside the scrolling programme, and docs/vincoli-tecnici.md says why that
 * cannot be copied: with two scrollers one inside the other, neither a keyboard
 * nor a screen reader can tell which one the arrow keys are talking to, and the
 * inner one swallows the gesture that was meant to move to the next evening.
 * Nothing fails when it happens — the page renders, and scrolling simply stops
 * doing what it looks like it should.
 *
 * The second is motion that cannot be turned off. Under
 * `prefers-reduced-motion` global.css puts `scroll-behavior: auto` back with
 * `!important`, and that is what turns a snapping scroller into an ordinary
 * list for a reader who gets sick watching it move. A scroll asked for in
 * JavaScript with `behavior: 'smooth'` is not reached by that rule at all — the
 * argument of the call beats the property, by the specification and in every
 * engine — so the one setting those readers have goes unanswered. There is
 * nothing to see in dist/, nothing fails, and the people it fails for are
 * exactly the ones the setting exists for.
 */
import { innermostBlocks, stripComments } from './css.ts';
import { inComment, maskStrings } from './source.ts';
import { type Violation, lineNumber } from './types.ts';

/** A rule that makes a box scrollable: what it is called, where it is, and
 *  whether what it scrolls is the axis the programme uses. */
export type Scrolling = { selector: string; index: number; vertically: boolean };

/** `overflow: auto` and friends, in the forms that make a box scrollable. */
const SCROLLABLE = /(?:^|[;{])\s*overflow(-[xy])?\s*:\s*([^;}]+)/gi;

/**
 * Every rule that turns something into a scrolling container, with the selector
 * that does it.
 *
 * `hidden`, `clip` and `visible` are not scrolling: only `auto` and `scroll`
 * are, and `overlay` — deprecated, but still understood by some engines as a
 * scrolling box.
 */
export function scrollableRules(css: string): Scrolling[] {
  const clean = stripComments(css);
  const found: Scrolling[] = [];

  for (const { body, index } of innermostBlocks(clean)) {
    SCROLLABLE.lastIndex = 0;
    let declaration: RegExpExecArray | null;
    let scrolls = false;
    let vertically = false;

    while ((declaration = SCROLLABLE.exec(body)) !== null) {
      const axis = declaration[1] ?? '';
      const value = declaration[2] ?? '';
      if (!/\b(auto|scroll|overlay)\b/i.test(value)) continue;
      scrolls = true;

      /* Which axis, because one exception below turns on it. `overflow-x` never
         scrolls vertically; `overflow-y` always does; the shorthand takes one
         value for both or two, x first — so `overflow: hidden auto` is vertical
         and `overflow: auto hidden` is not. */
      if (axis === '-y') vertically = true;
      else if (axis === '-x') continue;
      else {
        const parts = value.trim().split(/\s+/);
        const y = parts.length > 1 ? (parts[1] ?? '') : (parts[0] ?? '');
        if (/^(auto|scroll|overlay)$/i.test(y)) vertically = true;
      }
    }
    if (!scrolls) continue;

    /* The selector is what comes between the previous block and this one — the
       whole prelude, so a rule listing three selectors is named by all three. */
    const before = clean.slice(0, index);
    const from = Math.max(before.lastIndexOf('}'), before.lastIndexOf('{')) + 1;
    found.push({
      selector: clean.slice(from, index).trim().replace(/\s+/g, ' '),
      index,
      vertically,
    });
  }

  return found;
}

/* A dialog is the one place a second scrolling box is not nested inside the
   first: while it is open the rest of the page is inert, so there is no
   question which one a gesture is driving — and its content can be longer than
   the screen with nowhere else to put it.

   Recognised from the selector, which means the exception has to be *written*:
   `dialog.modal .modal-panel`, not `.modal-panel`. A guard cannot see from the
   CSS that an element sits inside a dialog, so the rule says it out loud or it
   does not get the exception. */
const IN_A_DIALOG = /(^|[\s,>+~])dialog\b|\[data-modal\b/i;

/* The other exception, and it costs two conditions rather than one.
   The Timeline's bar on a phone scrolls sideways through eighty-one evenings:
   it is fixed, it sits outside the programme, and it moves along the axis the
   programme does not use — so it takes no gesture the scroller wanted, and none
   of the ambiguity above applies to it.
   Named in the selector for the same reason as the dialog — from the CSS you
   cannot see that a box is a horizontal bar — and **checked** on the axis
   rather than believed on the name: `[data-timeline] { overflow-y: auto }`
   would be a second vertical scroller wearing the right label, and that is the
   thing this guard exists for. */
const HORIZONTAL_BAR = /\[data-timeline\b/i;

/**
 * More than one scrolling container on a page that is a scroller.
 *
 * Written as a count rather than as a list of names on purpose: a guard keyed
 * on `.scene` stops watching the day somebody renames the class, and this
 * repository has been bitten by that shape of check before. What is true here
 * regardless of naming is that the programme is *one* scrolling box — anything
 * else on the page that scrolls is nested inside it, except what a dialog
 * carries.
 */
export function checkSingleScroller(css: string, path = 'the page'): Violation[] {
  const rules = scrollableRules(css).filter(
    (rule) =>
      !IN_A_DIALOG.test(rule.selector) &&
      !(HORIZONTAL_BAR.test(rule.selector) && !rule.vertically),
  );
  if (rules.length <= 1) return [];

  const clean = stripComments(css);
  return rules.slice(1).map((rule) => ({
    rule: 'scroller',
    detail: `${path}: \`${rule.selector}\` on line ${lineNumber(clean, rule.index)} is a second scrolling container on a page whose programme is already one. Nested scrollers make it ambiguous which box the arrow keys move — the export does this to every scene, and docs/vincoli-tecnici.md is where it was decided not to. Clip the overflow instead, or let the type shrink`,
  }));
}

/* Written with the quotes required *on the value*, which is what tells the two
   apart: `scroll-behavior: smooth` in a stylesheet is the correct way to ask
   for this and has no quotes around its value, while the argument of a scroll
   call always does. A guard that flagged the stylesheet would be flagging the
   fix.

   The key may carry quotes of its own — `{ 'behavior': 'smooth' }` is the same
   call — and both halves of this guard used to let that through: the pattern
   wanted the colon straight after the word, and the masking below blanks what
   is inside quotes, so the one form somebody would reach for to get past a
   linter was the one form nothing was looking at. The optional group is the
   key's own quote, and the backreference makes the two ends agree. */
const SMOOTH_ARGUMENT = /(?<![-\w])(['"])?behavior\1\s*:\s*(['"`])smooth\2/g;

/**
 * Smooth scrolling asked for as an argument instead of declared as a property.
 *
 * `element.scrollIntoView()` and `scrollTo({ top })` with no `behavior` resolve
 * to the computed value of `scroll-behavior`, which is how a stylesheet — and
 * with it `prefers-reduced-motion` — gets a say. Passing `'smooth'` takes that
 * say away.
 *
 * The mirror image is deliberately allowed: `behavior: 'instant'` forces a jump
 * to stay a jump, and forcing motion *off* can never be the thing a reader who
 * asked for less motion is complaining about.
 */
export function checkSmoothScrollArgument(source: string, path: string): Violation[] {
  const masked = maskStrings(source);
  const violations: Violation[] = [];
  SMOOTH_ARGUMENT.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = SMOOTH_ARGUMENT.exec(source)) !== null) {
    /* Inside a string literal, this is prose about the rule and not the rule
       being broken — the masked copy has the same offsets, so a blanked
       character here means the match was somebody's text. */
    if (masked[match.index] !== source[match.index]) continue;
    if (inComment(masked, match.index)) continue;

    violations.push({
      rule: 'scroller',
      detail: `${path}: \`${match[0]}\` on line ${lineNumber(source, match.index)} asks for smooth scrolling as an argument. The argument beats the CSS property, so \`scroll-behavior: auto !important\` — which is how global.css answers prefers-reduced-motion — cannot reach it, and a reader who asked for less movement gets the full snap-scrolling animation anyway. Declare \`scroll-behavior: smooth\` in the stylesheet and call the scroll with no behavior at all`,
    });
  }

  return violations;
}

/* A write straight to `scrollTop` or `scrollLeft`, which reads as a jump and is
   not one.
   Per CSSOM-View the setter scrolls the box with the behavior «auto», and
   «auto» means *the computed value of `scroll-behavior`* — so once the
   stylesheet declares `smooth`, an assignment animates like everything else.
   Measured at PR 20 in Firefox 154 and in Chromium 148, and it was believed
   otherwise long enough to be written down: docs/piano.md said an assignment
   was «istantanea per specifica, qualunque cosa dica il foglio di stile», and
   the plan of this very PR repeated it.

   What it costs is silent. A smooth scroll does not advance in a hidden tab, so
   the opening jump written this way sends `/85` opened in a background tab to
   the top of the archive; the reader switches to the tab and finds the wrong
   evening, with nothing failing anywhere.

   So a scroll says which one it is. Either it is a call with no `behavior` and
   the stylesheet decides — which is what `prefers-reduced-motion` needs — or it
   is instant, and the way to say *that* is the property set aside for the one
   scroll, right above it. Not `behavior: 'instant'`: `behavior` is a WebIDL
   enum, so a value an engine does not know throws a TypeError instead of
   falling back, and thrown from the opening jump it takes the jump with it. */
const SCROLL_WRITE = /(?<![-\w$])([\w$]+(?:\.[\w$]+)*)\.(scrollTop|scrollLeft)\s*(\+=|-=|=(?!=))/g;

/** How far above a write the property may have been set aside for it. Short on
 *  purpose: the two lines belong together, and a reader has to see that. */
const SET_ASIDE_WINDOW = 300;

export function checkBareScrollWrite(source: string, path: string): Violation[] {
  const masked = maskStrings(source);
  const violations: Violation[] = [];
  SCROLL_WRITE.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = SCROLL_WRITE.exec(source)) !== null) {
    // Prose about the rule rather than the rule being broken, told apart the
    // way checkSmoothScrollArgument tells them apart: the masked copy keeps the
    // offsets, so a blanked character here means this was somebody's text.
    if (masked[match.index] !== source[match.index]) continue;
    if (inComment(masked, match.index)) continue;

    const receiver = match[1] ?? '';
    const from = Math.max(0, match.index - SET_ASIDE_WINDOW);
    const before = source.slice(from, match.index);

    /* The last one in the window and not the first: two pairs written near each
       other are legitimate, and the one that belongs to this write is the one
       just above it. */
    const pattern = new RegExp(
      String.raw`${receiver.split('.').join(String.raw`\.`)}\.style\.scrollBehavior\s*=\s*(['"\`])auto\1`,
      'g',
    );
    let aside: RegExpExecArray | null = null;
    let candidate: RegExpExecArray | null;
    while ((candidate = pattern.exec(before)) !== null) aside = candidate;

    /* And it has to be *this* write's set-aside: between the two there may be
       only the semicolon that closes that line, whitespace and comments.
       Accepted anywhere in a window instead, a second write — animated, and
       open to the hidden-tab defect — passed by standing near a legitimate
       pair, which is exactly where somebody adding one would put it. */
    const between = aside
      ? before
          .slice(aside.index + aside[0].length)
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\/\/[^\n]*/g, '')
      : '';

    // Set aside inside a comment is the rule being described, not applied.
    if (aside && !inComment(masked, from + aside.index) && /^[\s;]*$/.test(between)) continue;

    violations.push({
      rule: 'scroller',
      detail: `${path}: \`${match[0]}\` on line ${lineNumber(source, match.index)} writes a scroll position straight. That is not the instant jump it reads as — the setter scrolls with the behavior "auto", which is the computed value of \`scroll-behavior\`, so it animates wherever the stylesheet says smooth. Either call \`scrollTo()\` with no behavior and let the stylesheet decide, or set the property aside for this one scroll — \`${receiver}.style.scrollBehavior = 'auto'\` immediately above, and put it back after`,
    });
  }

  return violations;
}

/* The space a sideways bar needs at its two ends, and why no amount of correct
   arithmetic replaces it.
   The Timeline's bar starts at the first evening and stops at the last, so to
   put either of them in the middle the browser would have to scroll past its
   own content, and it will not: it truncates. The evenings in the middle centre
   and the ones at the ends do not — and the evening this site opens on is the
   next one still to come, which is almost always the last. Measured on the
   preview of PR 19 at 390px: the first tick 184px off centre, the last 188px
   the other way.

   Read on the published CSS, because a length is exactly what a minifier
   rewrites, and half a viewport written as `calc()` is what it likes least.

   What this cannot do is prove the padding belongs to *that* box: from the text
   of a stylesheet nothing says which rule dresses which element. It asks the
   narrower question that catches what actually happens — the day somebody
   deletes the line, or tidies it into a comfortable-looking `8px`. */
const INLINE_PADDING =
  /(?:^|[;{])\s*padding(-inline(-start|-end)?|-left|-right)?\s*:\s*([^;}]+)/gi;

/** The share of a box or of the viewport a length asks for, or null if it asks
 *  for something fixed. `50%`, `50vw` and `calc(50vw - var(--space-3))` all
 *  answer 50; `8px` answers nothing. */
function share(value: string): number | null {
  const match = /(\d+(?:\.\d+)?)\s*(%|vw)/i.exec(value);
  return match ? Number(match[1]) : null;
}

/** The values of a shorthand, keeping every `calc()` and `var()` whole. */
function topLevelParts(value: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';

  for (const character of value) {
    if (character === '(') depth += 1;
    if (character === ')') depth -= 1;
    if (depth === 0 && /\s/.test(character)) {
      if (current) parts.push(current);
      current = '';
      continue;
    }
    current += character;
  }
  if (current) parts.push(current);
  return parts;
}

/** What a rule declares at the two inline ends, in shares. */
function inlineEnds(body: string): { start: number | null; end: number | null } {
  const ends: { start: number | null; end: number | null } = { start: null, end: null };
  INLINE_PADDING.lastIndex = 0;

  let declaration: RegExpExecArray | null;
  while ((declaration = INLINE_PADDING.exec(body)) !== null) {
    const which = (declaration[1] ?? '').toLowerCase();
    const value = (declaration[3] ?? '').trim();
    /* Split at the top level only: `calc(50vw - var(--space-3))` is one value
       with spaces in it, and cut anywhere inside it stops meaning anything. */
    const parts = topLevelParts(value);

    if (which === '-inline-start' || which === '-left') ends.start = share(value);
    else if (which === '-inline-end' || which === '-right') ends.end = share(value);
    else if (which === '-inline') {
      ends.start = share(parts[0] ?? '');
      ends.end = share(parts[1] ?? parts[0] ?? '');
    } else if (which === '') {
      // The shorthand: one value for all, two for block then inline, three with
      // the inline pair in the middle, four clockwise from the top.
      const inline =
        parts.length >= 4
          ? { start: parts[3], end: parts[1] }
          : parts.length >= 2
            ? { start: parts[1], end: parts[1] }
            : { start: parts[0], end: parts[0] };
      ends.start = share(inline.start ?? '');
      ends.end = share(inline.end ?? '');
    }
  }

  return ends;
}

/**
 * A bar that scrolls sideways with no room to bring its first and last item to
 * the middle.
 */
export function checkCentringSpace(css: string, path = 'the page'): Violation[] {
  const sideways = scrollableRules(css).filter((rule) => !rule.vertically);
  if (sideways.length === 0) return [];

  const clean = stripComments(css);
  const roomy = innermostBlocks(clean).some(({ body }) => {
    const ends = inlineEnds(body);
    return ends.start !== null && ends.start >= 50 && ends.end !== null && ends.end >= 50;
  });
  if (roomy) return [];

  return sideways.map((rule) => ({
    rule: 'scroller',
    detail: `${path}: \`${rule.selector}\` on line ${lineNumber(clean, rule.index)} scrolls sideways, and nothing in this stylesheet gives its strip half a box of space at each end. Without it the first and the last item cannot reach the middle — past the edge there is nothing to scroll onto, so the browser truncates a position that was worked out correctly. The evening the programme opens on is the next one still to come, which is almost always the last: the case that fails is the ordinary one`,
  }));
}
