import {Commit, Outcome} from '../src/data'
import { filterMyOutcomes, findCommits } from '../src/main'
import {expect, test} from '@jest/globals'


test('filterMyOutComes returns outcomes only for user', () => {
  let user = "user"
  let outcomes: Outcome[] = [
    { id: "outcome_0", task: {id: "task_0", user: user, branch: {id: "0", name: "name"}, commit: {id: "0", diff: ""}, issue: {id: "id", title: "", body: ""}}},
    { id: "outcome_0", task: {id: "task_0", user: "tom", branch: {id: "0", name: "name"}, commit: {id: "0", diff: ""}, issue: {id: "id", title: "", body: ""}}},
    { id: "outcome_0", task: {id: "task_0", user: user, branch: {id: "0", name: "name"}, commit: {id: "0", diff: ""}, issue: {id: "id", title: "", body: ""}}},
    { id: "outcome_0", task: {id: "task_0", user: "erika", branch: {id: "0", name: "name"}, commit: {id: "0", diff: ""}, issue: {id: "id", title: "", body: ""}}},
    { id: "outcome_0", task: {id: "task_0", user: user, branch: {id: "0", name: "name"}, commit: {id: "0", diff: ""}, issue: {id: "id", title: "", body: ""}}},
  ]
  expect(filterMyOutcomes(user, outcomes).length).toEqual(3)
})

test('findCommits returns commits linked to the outcome', () => {
  let parentCommit: Commit = {id: "outcome", diff: "diff"}
  let linkedCommit: Commit = {id: "id1", diff: "", parent: parentCommit}
  let finalCommit: Commit = {id: "id1", diff: "", parent: linkedCommit}
  let commits: Commit[] = [
    {id: "id0", diff: ""},
    linkedCommit,
    parentCommit,
    finalCommit
  ]
  let outcome: Outcome = 
    { id: "outcome_0", task: {id: "task_0", user: "user", branch: {id: "outcome", name: "name"}, commit: parentCommit, issue: {id: "id", title: "", body: ""}}}
  let actual = findCommits(outcome, commits)
  expect(actual.length).toEqual(2)
  expect(actual[0]).toEqual(linkedCommit)
  expect(actual[1]).toEqual(finalCommit)

  expect(findCommits(outcome, []).length).toEqual(0)
})


// shows how the runner will run a javascript action with env / stdout protocol
// test('test runs', () => {
//   process.env['INPUT_MILLISECONDS'] = '500'
//   const np = process.execPath
//   const ip = path.join(__dirname, '..', 'lib', 'main.js')
//   const options: cp.ExecFileSyncOptions = {
//     env: process.env
//   }
//   console.log(cp.execFileSync(np, [ip], options).toString())
// })
