import { Commit, Outcome } from './data'
import { getCommit } from './firestore/commit_store'
import { getOutcome } from './firestore/outcome_store'
import { getParams, sendDebug, sendError } from './github'
import { Git } from './git'
import { countReset } from 'console'


export function filterMyOutcomes(user: string, outcomes: Outcome[]): Outcome[] {
  sendDebug("filterMyOutcomes")
  return outcomes.filter((value, index, array) => {
    return value.task.user == user
  })
}

export function findCommits(outcome: Outcome, commits: Commit[]): Commit[] {
  sendDebug("findCommits")
  let filtered = []
  var parent = outcome.task.commit
  do {
    var children = commits.filter((value) => { return value.parent == parent})
    if (children.length > 0) {
      parent = children[0]
      filtered.push(parent)
    } else {
      break
    }
  } while (children.length > 0);
  return filtered
}

async function run(): Promise<void> {
  let git = new Git("bot", "mail@example.com")
  // try {
    const user = await (await getParams()).user
    const outcomes = await getOutcome()
    const commits = await getCommit()
    sendDebug(commits.toString())
    const myOutcomes = filterMyOutcomes(user, outcomes)
    sendDebug(myOutcomes.toString())
    myOutcomes.forEach((value) => {
      let pushes = findCommits(value, commits)
      sendDebug(pushes.toString())
      git.pushCommits(value.task.branch, pushes)
    })
  // } catch (error) {
  //   if (error instanceof Error) sendError(error)
  // }
}

run()
