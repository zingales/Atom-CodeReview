'use babel';

import CodeReviewView from './code-review-view';
import ProjectManager from './project-manager'
import {
  CompositeDisposable,
  GitRepository
} from 'atom';


const CodeReviewRootFolder = "~/CodeReview/"

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

  myCodeReviewFolder(projectPath) {
    return `~/CodeReview/${projectPath}/`
  },

  async toggle() {
    let git = atom.project.getRepositories()[0]
    let crPm = new ProjectManager(CodeReviewRootFolder, git.getPath())
    let message = `CodeReview was toggled!, ${crPm.codeReviewPath}`
    await crPm.prepareFolder()
    console.log(message);
    return (
      atom.open({
        pathsToOpen: [crPm.codeReviewPath],
        newWindow: true
      })
    );
  }

};