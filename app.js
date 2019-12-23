'use strict';

const SCALE_VALUES = {
  MAJOR: [2, 2, 1, 2, 2, 2, 1],
  MINOR: [2, 1, 2, 2, 1, 2, 2],
  MINOR_HARMONIC: [2, 1, 2, 2, 1, 3, 1],
  MINOR_MELODIC: [2, 1, 2, 2, 2, 2, 1],
  PENTATONIC_MAJOR: [2, 2, 3, 2, 3],
  PENTATONIC_MINOR: [3, 2, 2, 3, 2],
  BLUES: [3, 2, 1, 1, 3, 2],
  NONE: [1, 1]
};

class App {
  constructor() {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.stop.bind(this));
    document.addEventListener('visibilitychange', this.stop.bind(this));

    this.notes = this.getScaleNotes(SCALE_VALUES.MAJOR, 220, 26);

    this.currentSound = null;
  }

  /**
   * Calculate note frequency from base frequency and interval
   * @param {Number} base Base frequency
   * @param {Number} interval Distance of note from base frequency
   * @return {Number} Calculated frequency of note
   */
  calcNote(base, interval) {
    return Math.round(base * Math.pow(2, interval / 12) * 100) / 100;
  }

  /**
   * Returns an array of note in a scale
   */
  getScaleNotes(scale, base, max) {
    let interval = 0,
      note = null,
      ni = 0,
      notes = [];

    for (let n = 0; n < max; n++) {
      note = this.calcNote(base, interval);
      interval = interval + scale[ni];
      notes[n] = note;
      ni++;
      if (ni >= scale.length) ni = 0;
    }

    return notes;
  }

  onKeyDown(event) {
    // If Esc key is press, stop sound
    if (event.key === 'Escape') {
      this.stop();
      return;
    }

    // If anything that a letter key is pressed, ignore
    if (!/^[a-z]{1}$/.test(event.key)) {
      return;
    }

    // Else, play sound according to key pressed
    var noteNum = event.keyCode - 65;
    this.play(noteNum);
  }

  play(noteNum) {
    // Stop current sound if any
    this.stop();

    // Create new sound
    this.currentSound = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sine',
        frequency: this.notes[noteNum],
        volume: 1,
        release: 1,
        attack: 0.75,
      },
    });

    // Play sound
    this.currentSound.play();
  }

  stop() {
    if (this.currentSound) {
      this.currentSound.stop();
      this.currentSound = undefined;
    }
  }
}

const app = new App();
