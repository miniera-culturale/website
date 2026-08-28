/* Negative tests for the guards over the Timeline.
 *
 * Both defects publish a rail that looks finished. A tick that points at
 * nothing takes the tap and leaves the page where it was; a tick written as a
 * button is pixel for pixel the same thing and does nothing at all until
 * somebody writes the script for it — and on the day somebody writes half of
 * it, nothing else here fails.
 */
import { describe, expect, it } from 'vitest';
import {
  checkRailHoldsTheArchive,
  checkTimelineLinks,
  checkTimelineTargets,
} from '../guards/timeline.ts';

const SCENES = `
  <section id="serata-81" data-scene data-number="81"></section>
  <section id="serata-82" data-scene data-number="82"></section>
`;

function rail(...ticks: string[]): string {
  return `${SCENES}<nav data-timeline>${ticks.join('\n')}</nav>`;
}

describe('checkTimelineLinks', () => {
  it('accepts the ticks as links', () => {
    const markup = rail(
      '<a class="timeline-tick" href="#serata-81" data-tick data-index="0">24 set 26</a>',
      '<a class="timeline-tick" href="#serata-82" data-tick data-index="1">8 ott 26</a>',
    );
    expect(checkTimelineLinks(markup, 'dist/index.html')).toEqual([]);
  });

  it('reports the button the export writes', () => {
    // `<button onClick={vai}>` is the export's own tick, and it is the shape
    // this decision gets undone in: identical on screen, and with scripting off
    // — or before the script has run — it is furniture.
    const markup = rail('<button type="button" data-tick data-index="0">24 set 26</button>');
    const violations = checkTimelineLinks(markup, 'dist/index.html');
    expect(violations).toHaveLength(1);
    expect(violations[0]!.detail).toContain('<button>');
    expect(violations[0]!.detail).toContain('dist/index.html');
  });

  it('reports an anchor with no address', () => {
    // Not a link at all: no focus stop, no announcement, nothing to press.
    const violations = checkTimelineLinks(rail('<a data-tick data-index="0">24 set 26</a>'));
    expect(violations).toHaveLength(1);
    expect(violations[0]!.detail).toContain('no address');

    expect(checkTimelineLinks(rail('<a href="" data-tick>24 set 26</a>'))).toHaveLength(1);
  });

  it('names every tick that is wrong, not only the first', () => {
    const markup = rail(
      '<button data-tick data-index="0">a</button>',
      '<button data-tick data-index="1">b</button>',
    );
    expect(checkTimelineLinks(markup)).toHaveLength(2);
  });

  it('ignores a tick that is only in a comment', () => {
    expect(checkTimelineLinks(rail('<!-- <button data-tick>24 set</button> -->'))).toEqual([]);
  });

  it('says nothing about a page with no rail', () => {
    expect(checkTimelineLinks('<main><h1>Chi siamo</h1></main>')).toEqual([]);
  });
});

describe('checkTimelineTargets', () => {
  it('accepts ticks that land on the scenes of the page', () => {
    const markup = rail(
      '<a href="#serata-81" data-tick>24 set 26</a>',
      '<a href="#serata-82" data-tick>8 ott 26</a>',
    );
    expect(checkTimelineTargets(markup, 'dist/index.html')).toEqual([]);
  });

  it('reports a tick that leads nowhere', () => {
    // What a renamed id, or an evening removed from the content, looks like.
    const violations = checkTimelineTargets(rail('<a href="#serata-99" data-tick>1 gen 27</a>'));
    expect(violations).toHaveLength(1);
    expect(violations[0]!.detail).toContain('#serata-99');
  });

  it('does not accept an id shut inside a template', () => {
    // `getElementById` does not reach into a template: its contents are an inert
    // document of their own, so this is a tick that resolves on paper and moves
    // nothing in a browser.
    const markup = `<template><section id="serata-99"></section></template>${rail(
      '<a href="#serata-99" data-tick>1 gen 27</a>',
    )}`;
    expect(checkTimelineTargets(markup)).toHaveLength(1);
  });

  it('is not satisfied by an id that merely looks like the one asked for', () => {
    const markup = `<section id="serata-810"></section><nav data-timeline><a href="#serata-81" data-tick>x</a></nav>`;
    expect(checkTimelineTargets(markup)).toHaveLength(1);
  });

  it('leaves an address that is not a fragment alone', () => {
    // `/81` is the evening page of PR 9 — a different promise, kept elsewhere.
    expect(checkTimelineTargets(rail('<a href="/81" data-tick>24 set 26</a>'))).toEqual([]);
  });

  it('reports a missing target once, however many ticks point at it', () => {
    const markup = rail(
      '<a href="#serata-99" data-tick>a</a>',
      '<a href="#serata-99" data-tick>b</a>',
    );
    expect(checkTimelineTargets(markup)).toHaveLength(1);
  });

  it('says nothing about a page with no rail', () => {
    expect(checkTimelineTargets('<main><h1>Chi siamo</h1></main>')).toEqual([]);
  });
});


/* The rail that stops holding the archive.
 *
 * Measured at PR 21 with eighty-one simulated evenings: the strip came to 696px
 * against 558px of rail on a window 650px tall, and twenty-two ticks fell
 * outside — clipped by `overflow: hidden`, present in the markup, invisible and
 * unclickable. It is the defect PR 11 exists to have fixed, arriving on the
 * desktop with the real archive rather than with the seven evenings there are
 * today, which is why nothing has ever shown it.
 */
describe('checkRailHoldsTheArchive', () => {
  const CONSTRAINED = '.timeline-strip { display: flex; max-height: 100%; }';
  const SHRINKABLE = '.timeline-tick:not([data-near]) { flex: 0 1 6px; min-height: 0; }';

  it('accepts a rail whose strip is constrained and whose far ticks give way', () => {
    expect(checkRailHoldsTheArchive(`${CONSTRAINED}
${SHRINKABLE}`)).toEqual([]);
  });

  it('reports the pitch written as padding, which cannot shrink', () => {
    // What the CSS looked like from PR 11 to PR 21, and it reads perfectly.
    const padded = `${CONSTRAINED}
.timeline-tick:not([data-near]) { margin-block: 0; padding-block: 2px; }`;
    const violations = checkRailHoldsTheArchive(padded, 'dist/index.html');
    expect(violations).toHaveLength(1);
    expect(violations[0]!.detail).toContain('dist/index.html');
    expect(violations[0]!.detail).toContain('flex: 0 1 6px');
  });

  it('reports a strip with nothing to shrink against', () => {
    const loose = `.timeline-strip { display: flex; }
${SHRINKABLE}`;
    const violations = checkRailHoldsTheArchive(loose);
    expect(violations).toHaveLength(1);
    expect(violations[0]!.detail).toContain('max-height: 100%');
  });

  it('does not take a flex that refuses to shrink for one that does', () => {
    for (const declaration of ['flex: none', 'flex: 0 0 6px', 'flex-shrink: 0']) {
      const refuses = `${CONSTRAINED}
.timeline-tick:not([data-near]) { ${declaration}; }`;
      expect(checkRailHoldsTheArchive(refuses), declaration).toHaveLength(1);
    }
  });

  it('reads the shorthand the way the cascade does', () => {
    // `flex: 1` leaves the shrink factor at 1, and `flex: 0 6px` too: one
    // number is the grow factor, and only a second one is the shrink.
    for (const declaration of ['flex: 1', 'flex: 0 6px', 'flex: 0 1 6px', 'flex: auto']) {
      const gives = `${CONSTRAINED}
.timeline-tick:not([data-near]) { ${declaration}; }`;
      expect(checkRailHoldsTheArchive(gives), declaration).toEqual([]);
    }
  });

  it('says nothing about a page that carries no rail', () => {
    expect(checkRailHoldsTheArchive('.scene { color: red; }')).toEqual([]);
    expect(checkRailHoldsTheArchive('')).toEqual([]);
  });
});
