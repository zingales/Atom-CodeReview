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
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'code-review:openCodeReviewInNewWindow': () => this.openCodeReviewInNewWindow()
    }));

    if (atom.project.getDirectories().length > 1) {
      let topDirectory = atom.project.getDirectories()[0].getPath()
      if (topDirectory.startsWith(CodeReviewRootFolder)) {
        atom.packages.onDidActivateInitialPackages(this.prepareReview)
      }
    }
  },

  prepareReview() {
    console.log("Preparing Review")
    // Load commit info
    let git = atom.project.getRepositories()[0]
    let crPm = new ProjectManager(CodeReviewRootFolder, git)
    crPm.prepareFolder()
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  getComparionReference() {
    // remove this return once done debugging
    return 'f20b87b86257fdade584235e6474cd17138328da'
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