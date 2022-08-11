import { execSync } from "child_process";
import { Branch, Commit } from "./data";
import * as fs from "fs"

export class Git {
    constructor(user: string, email: string) {
        execSync(`git config --global user.name ${user}`)
        execSync(`git config --global user.name ${email}`)
    }

    fetch(branch: string, depth: number) {
        execSync(`git fetch origin ${branch} --depth ${depth}`)
    }

    checkout(branch: string) {
        execSync(`git checkout ${branch}`)
    }

    add(path: string = ".") {
        execSync(`git add ${path}`)
    }

    commit(message: string) {
        execSync(`git commit -m ${message}`)
    }

    push(isForce: boolean = false) {
        execSync(`git push ${isForce? "-f" : ""}`)
    }    

    pushCommits(branch: Branch, commits: Commit[]) {
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
