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
    QuerySnapshot
} from 'firebase/firestore'
import { Commit } from '../data'
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

export async function getCommit(): Promise<Commit[]> {
    const db = getFirestore(app)
    const collRef = collection(db, '/commites')//.withConverter(commitConverter)
    const snapshot = await getDocs(collRef)
    return snapshot.docs.map((doc) => {
        return {
            id: doc.id,
            diff: doc.data().diff,
            parent: doc.data().parent
        }
    })
}
