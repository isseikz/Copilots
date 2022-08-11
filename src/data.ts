export type Branch = {
    id: string
    name: string
}

export type Commit = {
    id: string
    diff: string
    parent?: Commit
}

export type Issue = {
    id: string
    title: string
    body: string
}

export type Outcome = {
    id: string
    task: Task
}

export type Task = {
    id: string
    user: string
    branch: Branch
    commit: Commit
    issue: Issue
}
