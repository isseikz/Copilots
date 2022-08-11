import * as core from '@actions/core'
import * as github from '@actions/github'
import { Branch, Commit } from './data'

export async function getParams() {
    const user: string = core.getInput('user')
    return {
        user: user
    }
}
