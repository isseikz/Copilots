import firebase from "firebase/app"
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
    Query,
    QuerySnapshot,
    getDoc
} from 'firebase/firestore'
import { Commit } from '../data'
import { sendDebug, sendError } from "../github"
import { app } from "./firebase_app"

const commitConverter: FirestoreDataConverter<Commit> = {
    toFirestore(data: Commit): DocumentData {
        return {
            diff: data.diff,
            parent: data.parent
        }
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Commit {
        const data = snapshot.data(options)
        // Book オブジェクトの id プロパティには Firestore ドキュメントの id を入れる。
        return {
            id: snapshot.id,
            diff: data.diff,
            parent: data.parent
        }
    },
}

export async function addCommit(data: Commit) {
    const db = getFirestore(app)
    const docRef = doc(db, 'commites', data.id).withConverter(commitConverter)
    await setDoc(docRef, data)
}

export async function getCommitBy(id: string): Promise<Commit | null> {
    sendDebug("getTask")
    const db = getFirestore()
    const docRef = doc(db, `/commits/${id}`)
    const document = await getDoc(docRef)

    if (!document.exists()) {
        sendError(Error(`Failed to resolve task with ${id}`));
        return null
    }
    return {
        id: document.id,
        diff: document.data().diff,
        parent: document.data().parent
    }
}

export async function getCommit(): Promise<Commit[]> {
    sendDebug("getCommit")
    const db = getFirestore(app)
    const collRef = collection(db, '/commits')//.withConverter(commitConverter)
    const snapshot = await getDocs(collRef)
    return snapshot.docs.map((doc) => {
        return {
            id: doc.id,
            diff: doc.data().diff,
            parent: doc.data().parent
        }
    })
}
