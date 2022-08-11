import { Commit, Outcome } from './data'
import { getCommit, getCommitBy } from './firestore/commit_store'
import { getOutcome } from './firestore/outcome_store'
import { getParams, sendDebug } from './github'
import { Git } from './git'
import { getTaskBy } from './firestore/task_store'
import { getBranchBy } from './firestore/branch_store'


export async function filterMyOutcomes(user: string, outcomes: Outcome[]): Promise<Outcome[]> {
  sendDebug("filterMyOutcomes")
  return outcomes.filter(async (value) => {
    let task = await getTaskBy(value.task)
    if (task == null) return false
    sendDebug(`${value.id} ${task.user}`)
    return task.user == user
  })
}

export async function findCommits(outcome: Outcome, commits: Commit[]): Promise<Commit[]> {
  sendDebug("findCommits")
  let filtered = [] 
  var outcomeTask = await getTaskBy(outcome.task)
  if (outcomeTask == null) return []

  let firstCommit = await getCommitBy(outcomeTask.commit)
  if (firstCommit == null) return []
  var parent = firstCommit

  do {
    var children = commits.filter((value) => { return value.parent == parent.id })
    if (children.length > 0) {
      let commit = await getCommitBy(children[0].id)
      if (commit == null) break
      parent = commit
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
    const myOutcomes = await filterMyOutcomes(user, outcomes)
    sendDebug(myOutcomes.toString())
    myOutcomes.forEach(async (value) => {
      let pushes = await findCommits(value, commits)
      let branch = await getBranchBy(value.task)
      if (branch != null && pushes.length > 0) {
        git.pushCommits(branch, pushes)
      }
    })
  // } catch (error) {
  //   if (error instanceof Error) sendError(error)
  // }
}

run()
