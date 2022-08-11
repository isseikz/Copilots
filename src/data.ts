export type Branch = {
    id: string
    name: string
}

export type Commit = {
    id: string
    diff: string
    parent?: string
}

export type Issue = {
    id: string
    title: string
    body: string
}

export type Outcome = {
    id: string
    task: string
}

export type Task = {
    id: string
    user: string
    branch: string
    commit: string
    issue: string
}
