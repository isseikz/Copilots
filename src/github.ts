import * as core from '@actions/core'
import * as github from '@actions/github'
import * as octokit from '@octokit/rest'
import { Branch, Commit } from './data'

export async function getParams() {
    const user: string = core.getInput('user')
    return {
        user: user
    }
}

export async function pushCommits(branch: Branch, commits: Commit[]) {

}

async function pushCommit(branch: Branch, commit: Commit) {
    let token = core.getInput('github-token')
    github.getOctokit(token)
}