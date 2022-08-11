import { execSync } from "child_process";
import { Branch, Commit } from "./data";
import * as fs from "fs"
import { sendDebug } from "./github";

export class Git {
    constructor(user: string, email: string) {
        sendDebug("Git.()")
        execSync(`git config --global user.name ${user}`)
        execSync(`git config --global user.name ${email}`)
    }

    fetch(branch: string, depth: number) {
        sendDebug("git.fetch")
        execSync(`git fetch origin ${branch} --depth ${depth}`)
    }

    checkout(branch: string) {
        sendDebug("git.checkout")
        execSync(`git checkout ${branch}`)
    }

    add(path: string = ".") {
        sendDebug("git.add")
        execSync(`git add ${path}`)
    }

    commit(message: string) {
        sendDebug("git.commit")
        execSync(`git commit -m ${message}`)
    }

    push(isForce: boolean = false) {
        sendDebug("git.push")
        execSync(`git push ${isForce? "-f" : ""}`)
    }    

    pushCommits(branch: Branch, commits: Commit[]) {
        sendDebug("git.pushCommits")
        this.fetch(branch.name, 1)
        this.checkout(branch.name)
        commits.forEach((value) => {
            fs.writeFileSync("../diff.patch", value.diff)
            execSync(`patch -p1 < ../diff.patch`)
            this.add()
            this.commit(value.id)
        })
        this.push()
    }
}
