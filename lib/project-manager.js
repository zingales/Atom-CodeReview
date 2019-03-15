'use babel';

import fs from 'fs-extra';
import path from 'path';


export default class ProjectManager {

  constructor(crRootFolder, gitRepo) {
    this.gitSourceRepo = gitRepo
    this.codeReviewPath = path.join(crRootFolder, path.basename(path.dirname(path.normalize(this.gitSourceRepo.getPath()))))
  }

  async setupFolderForNewWindow(commitHash) {
    try {
      await fs.ensureDir(this.codeReviewPath)
      await fs.copy(this.gitSourceRepo.getPath(), path.join(this.codeReviewPath, '.git'), {
        overwrite: true,
        dereference: false
      })
      await fs.writeJson(path.join(this.codeReviewPath, 'commitInfo.json'), {
        commitHash: commitHash
      })
    } catch (err) {
      console.error(err)
      atom.notifications.addWarning(err.reason)
    }
  }

}