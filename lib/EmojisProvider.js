'use babel'

import fuzzaldrin from 'fuzzaldrin'
import emojiData from './emoji-mart/data'

const guard = (value, transform) => {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}

export default {
  scopeSelector: '.source.gfm, .text.md, .text.html, .text.slim, .text.plain, .text.git-commit, .comment, .string, .source.emojicode',

  wordRegex: /::?[\w\d_+-]+$/,
  keys: [],

  loadProperties() {
    const properties = emojiData.emojis
    this.keys = Object.keys(properties);
  },

  getSuggestions({ editor, bufferPosition }) {
    const prefix = this.getPrefix(editor, bufferPosition);
    if (guard(prefix, x => x.length) < 2) { return []; }

    const words = fuzzaldrin.filter(this.keys, prefix.slice(1));
    return words.map(word => (
      {
        text: `:${word}:`,
        replacementPrefix: prefix,
        rightLabel: word,
      }));
  },

  getPrefix(editor, bufferPosition) {
    const line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
    return guard(line.match(this.wordRegex), x => x[0]) || '';
  },

  getTextEditorSelector() {
    return 'atom-text-editor.im-editor';
  },
};
