'use babel';

import fs from 'fs-extra';
import path from 'path';


const CommitInfoFileName = 'codeReviewInfo.json'
const BranchKeyName = 'BranchName'

export default class ProjectManager {



  constructor(crRootFolder, gitRepo) {
    this.gitSourceRepo = gitRepo
    this.codeReviewPath = path.join(crRootFolder, path.basename(path.dirname(path.normalize(this.gitSourceRepo.getPath()))))
    this.commitInfoPath = path.join(this.codeReviewPath, CommitInfoFileName)
  }

  async setupFolderForNewWindow(commitHash) {
    try {
      await fs.ensureDir(this.codeReviewPath)
      await fs.copy(this.gitSourceRepo.getPath(), path.join(this.codeReviewPath, '.git'), {
        overwrite: true,
        dereference: false
      })
      await fs.writeJson(this.commitInfoPath, {
        [BranchKeyName]: commitHash.trim()
      })
    } catch (err) {
      console.error(err)
      atom.notifications.addWarning(err.reason)
    }
  }

  async prepareFolder() {
    try {
      const commitInfo = await fs.readJson(this.commitInfoPath)
      await fs.remove(this.commitInfoPath)
      this.gitSourceRepo.getRepo().checkoutReference(commitInfo[BranchKeyName])
      this.resetToHead()

    } catch (err) {
      console.error(err)
      atom.notifications.addWarning(err.reason)
    }
  }

  colorTree(jqueryIdentifier) {
    let $projectRoot = $(jqueryIdentifier)
    console.log($projectRoot.classList)
  }

  resetToHead() {
    this.gitSourceRepo.checkoutHead('.gitignore')
    for (const [key, value] of Object.entries(this.gitSourceRepo.getRepo().getStatus())) {
      this.gitSourceRepo.checkoutHead(key)
    }
  }
}
