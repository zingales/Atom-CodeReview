'use babel';

import ProjectManager from './project-manager'
import {
  CompositeDisposable,
  GitRepository
} from 'atom';

import os from 'os';


const CodeReviewRootFolder = "~/CodeReview/".replace('~', os.homedir())

export default {

  subscriptions: null,

  activate(state) {
    let topDirectory = atom.project.getDirectories()[0].getPath()
    if (topDirectory.startsWith(CodeReviewRootFolder)) {
      console.log("we're in")
    }

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'code-review:openCodeReviewInNewWindow': () => this.openCodeReviewInNewWindow()
    }));
  },


  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  getComparionReference() {
    if (editor = atom.workspace.getActiveTextEditor()) {
      return editor.getSelectedText()
    }
  },

  async openCodeReviewInNewWindow() {
    let git = atom.project.getRepositories()[0]
    let crPm = new ProjectManager(CodeReviewRootFolder, git)

    let selection = this.getComparionReference()
    console.log(`selected text <${selection}>`)
    await crPm.setupFolderForNewWindow(selection)
    console.log(`Preparing folder in ${crPm.codeReviewPath}`);
    atom.open({
      pathsToOpen: [crPm.codeReviewPath],
      newWindow: true
    })
    return
  }

};