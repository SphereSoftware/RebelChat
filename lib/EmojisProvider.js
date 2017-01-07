'use babel'

import fs from 'fs';
import path from 'path';
import fuzzaldrin from 'fuzzaldrin';

import emojiData from './emoji-mart/data'

export default {
  scopeSelector: '.source.gfm, .text.md, .text.html, .text.slim, .text.plain, .text.git-commit, .comment, .string, .source.emojicode',

  wordRegex: /::?[\w\d_\+-]+$/,
  keys: [],

  loadProperties() {
    const properties = emojiData.emojis
    this.keys = Object.keys(properties);
  },

  getSuggestions({editor, bufferPosition}) {
    const prefix = this.getPrefix(editor, bufferPosition);
    if (__guard__(prefix, x => x.length) < 2) { return []; }

    const words = fuzzaldrin.filter(this.keys, prefix.slice(1));
    return words.map((word) => (
      {
        text: `:${word}:`,
        replacementPrefix: prefix,
        rightLabel: word
      }));
  },

  getPrefix(editor, bufferPosition) {
    const line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
    return __guard__(line.match(this.wordRegex), x => x[0]) || '';
  },

  getTextEditorSelector() {
    return 'atom-text-editor.im-editor';
  }
};

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
