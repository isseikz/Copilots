import * as core from '@actions/core'
import * as github from '@actions/github'
import { Branch, Commit } from './data'

export async function getParams() {
    const user: string = core.getInput('user')
    return {
        user: user
    }
}

export function sendDebug(message: string) {
    core.debug(message)
}

export function sendError(message: Error) {
    core.error(message)
}
