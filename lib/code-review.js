'use babel';

import ProjectManager from './project-manager'
import {
  CompositeDisposable,
  GitRepository
} from 'atom';

import os from 'os';

const CodeReviewRootFolder = "~/CodeReview/".replace('~', os.homedir())
const projectRootClassName = 'project-root'
export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'code-review:openCodeReviewInNewWindow': () => this.openCodeReviewInNewWindow()
    }));

    let topDirectory = atom.project.getDirectories()[0].getPath()
    if (topDirectory.startsWith(CodeReviewRootFolder)) {
      atom.packages.onDidActivateInitialPackages(this.prepareReview)
    }
  },

  prepareReview() {
    console.log("Preparing Review")
    // Load commit info
    let git = atom.project.getRepositories()[0]
    let crPm = new ProjectManager(CodeReviewRootFolder, git)
    crPm.prepareFolder()
    console.log("folder has been prepared")
    console.log(this.projectRootClassName)
    console.log(projectRootClassName)
    crPm.colorTree(projectRootClassName)
    setReadOnly()
  },

  setReadOnly() {
    for editor in atom.workspace.getTextEditors() {
        editor.setReadOnly(true)
    }
    console.log("Editor set to read only")
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  consumeTreeView(treeView) {
    const projectRootPath = atom.project.rootDirectories[0].path
    // validate our projectRootJqueryIdentifier exists in the project root
    if (!treeView.entryForPath(projectRootPath).classList.contains(projectRootClassName)) {
      atom.notifications.addWarning("our project root identifier is broken")
    }
    console.log("Treeview has been set")
    console.log(treeView.entryForPath(projectRootPath))
  },

  getBranch() {
    // remove this return once done debugging
    return 'testerBranch'
    if (editor = atom.workspace.getActiveTextEditor()) {
      return editor.getSelectedText()
    }
  },

  async openCodeReviewInNewWindow() {
    let git = atom.project.getRepositories()[0]
    let crPm = new ProjectManager(CodeReviewRootFolder, git)

    let selection = this.getBranch()
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
