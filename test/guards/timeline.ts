/* Guards over the Timeline.
 *
 * The rail is eighty-one ticks that lead somewhere, and both ways it can stop
 * doing that are silent.
 *
 * A tick that points at an id nothing carries is the modal's dead button in
 * another costume: it renders, it takes the tap, and the page does not move —
 * on a phone that is indistinguishable from a tap that never registered.
 *
 * A tick written as a `<button>` is the other one, and it is worse because the
 * page looks identical. The decision is that a tick is an `<a href>`: the
 * element for a thing that leads to a place in the document, which arrives with
 * the address, the back button, open-in-new-tab, the announcement a screen
 * reader makes for a link, and a jump the browser performs with no script at
 * all. A button has none of that until somebody writes it, and the day somebody
 * writes half of it nothing here fails.
 */
import { innermostBlocks, stripComments } from './css.ts';
import { attributeOf } from './document.ts';
import { stripMarkupComments } from './language.ts';
import { type Violation, lineNumber } from './types.ts';

/** Every element marked as a tick, with its opening tag.
 *
 *  Exported because the assertions in test/build/ ask the same question of
 *  dist/ — how many ticks are there, and what does each one carry — and three
 *  copies of this pattern is three places to rename `data-tick` and two to
 *  forget, each of which goes on passing over a list of nothing. */
export function tickTags(markup: string): { tag: string; index: number }[] {
  const pattern = /<([a-z][a-z0-9-]*)\b[^>]*?\sdata-tick\b[^>]*>/gi;
  return [...markup.matchAll(pattern)].map((match) => ({ tag: match[0], index: match.index }));
}

/**
 * A tick that is not a link.
 *
 * Reported on the tag rather than on the absence of an `href`, because both
 * halves are the same mistake: `<button data-tick>` is the export's own markup,
 * and `<a data-tick>` with no address is a link that is not one — not
 * focusable, not announced as a link, and inert with scripting off.
 */
export function checkTimelineLinks(markup: string, path = 'the page'): Violation[] {
  const clean = stripMarkupComments(markup);

  return tickTags(clean).flatMap(({ tag, index }) => {
    const name = (/^<([a-z][a-z0-9-]*)/i.exec(tag)?.[1] ?? '').toLowerCase();
    const href = attributeOf(tag, 'href');
    if (name === 'a' && href !== undefined && href.trim() !== '') return [];

    return [
      {
        rule: 'timeline',
        detail: `${path}: the tick on line ${lineNumber(clean, index)} is \`<${name}>\`${
          name === 'a' ? ' with no address' : ''
        } and not a link. A tick leads to an evening, so it is an \`<a href="#serata-N">\`: that is what carries the address, the back button, the announcement a screen reader makes, and a jump that happens with no script running. As a button it looks the same on screen and does nothing until somebody writes it`,
      },
    ];
  });
}

/**
 * A tick that leads nowhere.
 *
 * The fragment is resolved the way a browser resolves it — against the ids of
 * the same document, and not against those written inside a `<template>`, whose
 * contents are an inert document of their own.
 *
 * Only same-page fragments are examined: a tick pointing at `/81` is the evening
 * page of PR 9 and is somebody else's promise to keep.
 */
export function checkTimelineTargets(markup: string, path = 'the page'): Violation[] {
  const clean = stripMarkupComments(markup);

  const reachable = clean.replace(
    /(<template\b[^>]*>)([\s\S]*?)(<\/template>)/gi,
    (_whole, open: string, inside: string, close: string) =>
      open + inside.replace(/[^\n]/g, ' ') + close,
  );

  const ids = new Set(
    [...reachable.matchAll(/\sid\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)].map((match) =>
      (match[1] ?? match[2] ?? '').trim(),
    ),
  );

  const violations: Violation[] = [];
  const reported = new Set<string>();

  for (const { tag, index } of tickTags(clean)) {
    const href = (attributeOf(tag, 'href') ?? '').trim();
    if (!href.startsWith('#')) continue;

    /* A fragment that is not valid percent-encoding — `#%zz` — makes
       decodeURIComponent throw, and a guard that throws reports nothing at all
       about the rest of the page while looking like an infrastructure failure.
       Left as written: that is what getElementById would be handed too. */
    let id: string;
    try {
      id = decodeURIComponent(href.slice(1));
    } catch {
      id = href.slice(1);
    }

    if (id === '' || ids.has(id) || reported.has(id)) continue;
    reported.add(id);

    violations.push({
      rule: 'timeline',
      detail: `${path}: the tick on line ${lineNumber(clean, index)} leads to \`${href}\`, and nothing in this page has that id. The browser stays exactly where it is: the tick is pressed and the programme does not move, which on a phone reads as a tap that was not registered`,
    });
  }

  return violations;
}

/* The rail holds the whole archive, at every height a window can have.
 *
 * All eighty-one evenings are on the rail — PR 11 decided that, because a rail
 * that shows eleven ticks and no way to reach the twelfth is a «previous /
 * next» wearing the costume of an archive. What PR 11 could not see is that the
 * site had five evenings: the strip only became taller than the rail with the
 * real archive, and a strip taller than the rail is not scrolled, it is cut —
 * `overflow: hidden`, and the ends of the archive vanish.
 *
 * Measured at PR 21 with eighty-one simulated evenings, on Firefox 154: at a
 * window 800px tall the strip fitted with twelve pixels to spare; at 650px it
 * came to 696px against 558px of rail and **22 ticks fell outside**; at 460px,
 * 54. Nothing failed anywhere — the page renders, and a quarter of the archive
 * is unreachable with a mouse.
 *
 * Two halves make it hold, and neither is any use alone: the strip has to be
 * *constrained* by the rail — under a grid whose row is sized to its content it
 * is not, and a `max-height: 100%` there resolves against nothing — and the far
 * ticks have to be able to *give*, which a pitch written as padding cannot do.
 *
 * What this reads is the mechanism and not the outcome: how tall a box comes to
 * be is not in the text of a stylesheet, and no guard here can measure it. It
 * fires the day somebody tidies the flex declaration back into a padding, which
 * is what the CSS looked like for three PRs and reads perfectly well.
 */
const FAR_TICK = /:not\(\[data-near\]\)/;

/** `flex: 0 1 6px`, `flex: 1`, `flex-shrink: 1` — anything that says «this may
 *  give way». `flex: none`, `flex: 0 0 6px` and `flex-shrink: 0` say it may
 *  not, and a rule with no flex at all says nothing. */
function mayShrink(body: string): boolean {
  const shrink = /(?:^|[;{])\s*flex-shrink\s*:\s*([^;}]+)/i.exec(body);
  if (shrink) return Number.parseFloat(shrink[1]!.trim()) !== 0;

  const flex = /(?:^|[;{])\s*flex\s*:\s*([^;}]+)/i.exec(body);
  if (!flex) return false;

  const value = flex[1]!.trim().toLowerCase();
  if (value === 'none') return false;
  if (value === 'auto' || value === 'initial') return true; // both shrink by 1

  /* The shorthand: one number is the grow factor and the shrink stays 1; two
     numbers are grow then shrink; a length among them is the basis. */
  const numbers = value.split(/\s+/).filter((part) => /^[\d.]+$/.test(part));
  if (numbers.length >= 2) return Number.parseFloat(numbers[1]!) !== 0;
  return numbers.length === 1; // `flex: 0 6px` still shrinks
}

export function checkRailHoldsTheArchive(css: string, path = 'the page'): Violation[] {
  const clean = stripComments(css);
  const blocks = innermostBlocks(clean);

  const selectorAt = (index: number): string => {
    const before = clean.slice(0, index);
    const from = Math.max(before.lastIndexOf('}'), before.lastIndexOf('{')) + 1;
    return clean.slice(from, index).trim().replace(/\s+/g, ' ');
  };

  const far = blocks.filter(({ index }) => FAR_TICK.test(selectorAt(index)));
  if (far.length === 0) return []; // a page with no rail on it

  const violations: Violation[] = [];

  if (!far.some(({ body }) => mayShrink(body))) {
    violations.push({
      rule: 'timeline',
      detail: `${path}: the ticks outside the labelled window declare no flex that can give way, so the strip keeps its natural height whatever the rail's is. With eighty-one evenings on a window 650px tall that was 696px of strip in 558px of rail and twenty-two ticks cut off by \`overflow: hidden\` — present in the markup, invisible and unclickable. Give the far ticks their pitch as a shrinkable flex basis, \`flex: 0 1 6px\`, rather than as padding, which does not shrink`,
    });
  }

  const constrained = blocks.some(
    ({ body, index }) =>
      /(?:^|[;{])\s*max-height\s*:\s*100%/i.test(body) && /timeline-strip/.test(selectorAt(index)),
  );
  if (!constrained) {
    violations.push({
      rule: 'timeline',
      detail: `${path}: nothing constrains the rail's strip to the height of the rail, so the ticks have nothing to shrink *against* and the flex above never comes into play. The strip declares \`max-height: 100%\` — and the rail has to be a box that gives that percentage something to resolve against, which a grid whose row is sized to its content does not`,
    });
  }

  return violations;
}
