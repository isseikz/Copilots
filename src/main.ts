import { Commit, Outcome } from './data'
import { getCommit } from './firestore/commit_store'
import { getOutcome } from './firestore/outcome_store'
import { getParams, pushCommits } from './github'


function filterMyOutcomes(user: string, outcomes: Outcome[]) {
  return outcomes.filter((value, index, array) => {
    value.task.user == user
  })
}

function findCommits(outcome: Outcome, commits: Commit[]) {
  let filtered = []
  var parent = outcome.task.commit
  do {
    var children = commits.filter((value) => value.parent == parent)
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
  try {
    const user = await (await getParams()).user
    const outcomes = await getOutcome()
    const commits = await getCommit()
    const myOutcomes = filterMyOutcomes(user, outcomes)
    myOutcomes.forEach((value) => {
      let pushes = findCommits(value, commits)
      pushCommits(value.task.branch, pushes)
    })
  } catch (error) {
    if (error instanceof Error) console.error(error)
  }
}

run()
