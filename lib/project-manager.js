'use babel';

import fs from 'fs-extra';
import path from 'path';
const os = require('os')


export default class ProjectManager {

  constructor(crRootFolder, projectPath) {
    this.codeReviewPath = path.join(crRootFolder.replace("~", os.homedir()), path.basename(path.dirname(path.normalize(projectPath))))
  }

  async prepareFolder() {
    try {
      await fs.ensureDir(this.codeReviewPath)
    } catch (err) {
      console.error(err)
    }
  }

}