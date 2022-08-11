import {
    DocumentData,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
    doc,
    getFirestore,
    setDoc,
    collection,
    getDocs,
    getDoc
} from 'firebase/firestore'
import { Task } from '../data'
import { sendDebug, sendError } from '../github'

const taskConverter: FirestoreDataConverter<Task> = {
    toFirestore(data: Task): DocumentData {
        return {
            branch: data.branch,
            commit: data.commit,
            issue: data.issue,
            user: data.user,
        }
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Task {
        const data = snapshot.data(options)
        // Book オブジェクトの id プロパティには Firestore ドキュメントの id を入れる。
        return {
            id: snapshot.id,
            branch: data.branch,
            commit: data.commit,
            issue: data.issue,
            user: data.user,
        }
    },
}

export async function addTask(data: Task) {
    const db = getFirestore()
    const docRef = doc(db, 'tasks', data.id).withConverter(taskConverter)
    await setDoc(docRef, data)
}

export async function getTaskBy(taskId: string): Promise<Task | null> {
    sendDebug("getTask")
    const db = getFirestore()
    const docRef = doc(db, `/tasks/${taskId}`)
    const task = await getDoc(docRef)

    if (!task.exists()) {
        sendError(Error(`Failed to resolve task with ${taskId}`));
        return null
    }
    return {
        id: task.id,
        user: task.data().user,
        branch: task.data().branch,
        commit: task.data().commit,
        issue: task.data().issue,
    }
}

export async function getTask(): Promise<Task[]> {
    sendDebug("getTask")
    const db = getFirestore()
    const collRef = collection(db, '/tasks')//.withConverter(taskConverter)
    const snapshot = await getDocs(collRef)
    return snapshot.docs.map((doc) => {
        return {
            id: doc.id,
            user: doc.data().user,
            branch: doc.data().branch,
            commit: doc.data().commit,
            issue: doc.data().issue
        }
    })
}
