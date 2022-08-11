import { Commit, Outcome } from './data'
import { getCommit } from './firestore/commit_store'
import { getOutcome } from './firestore/outcome_store'
import { getParams } from './github'
import { Git } from './git'


export function filterMyOutcomes(user: string, outcomes: Outcome[]): Outcome[] {
  return outcomes.filter((value, index, array) => {
    return value.task.user == user
  })
}

export function findCommits(outcome: Outcome, commits: Commit[]): Commit[] {
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
  try {
    const user = await (await getParams()).user
    const outcomes = await getOutcome()
    const commits = await getCommit()
    const myOutcomes = filterMyOutcomes(user, outcomes)
    myOutcomes.forEach((value) => {
      let pushes = findCommits(value, commits)
      git.pushCommits(value.task.branch, pushes)
    })
  } catch (error) {
    if (error instanceof Error) console.error(error)
  }
}

run()
