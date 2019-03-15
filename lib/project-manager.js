'use babel';

import fs from 'fs-extra';
import path from 'path';


const CommitInfoFileName = 'commitInfo.json'

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
        commitHash: commitHash.trim()
      })
    } catch (err) {
      console.error(err)
      atom.notifications.addWarning(err.reason)
    }
  }

  async prepareFolder() {
    try {
      const commitInfo = await fs.readJson(this.commitInfoPath)
      this.resetToHead()
      this.gitSourceRepo.getRepo().checkoutReference(commitInfo['commitHash'])

    } catch (err) {
      console.error(err)
      atom.notifications.addWarning(err.reason)
    }
  }

  resetToHead() {
    this.gitSourceRepo.checkoutHead('.gitignore')
    for (const [key, value] of Object.entries(this.gitSourceRepo.getRepo().getStatus())) {
      this.gitSourceRepo.checkoutHead(key)
    }
  }
}