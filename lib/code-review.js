'use babel';

import CodeReviewView from './code-review-view';
import {
  CompositeDisposable
} from 'atom';

export default {

  codeReviewView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.codeReviewView = new CodeReviewView(state.codeReviewViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.codeReviewView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'code-review:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.codeReviewView.destroy();
  },

  serialize() {
    return {
      codeReviewViewState: this.codeReviewView.serialize()
    };
  },

  toggle() {
    console.log('CodeReview was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};