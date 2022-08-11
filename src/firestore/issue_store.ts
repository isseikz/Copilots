import {
    DocumentData,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
    doc,
    getFirestore,
    setDoc,
    collection,
    getDocs
} from 'firebase/firestore'
import { Issue } from '../data'

const issueConverter: FirestoreDataConverter<Issue> = {
    toFirestore(data: Issue): DocumentData {
        return {
            title: data.title,
            body: data.body,
        }
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Issue {
        const data = snapshot.data(options)
        return {
            id: snapshot.id,
            title: data.title,
            body: data.body,
        }
    },
}

export async function addIssue(data: Issue) {
    const db = getFirestore()
    const docRef = doc(db, 'issues', data.id).withConverter(issueConverter)
    await setDoc(docRef, data)
}

export async function getIssue(): Promise<Issue[]> {
    const db = getFirestore()
    const collRef = collection(db, '/issues')//.withConverter(issueConverter)
    const snapshot = await getDocs(collRef)
    return snapshot.docs.map((doc) => {
        return {
            id: doc.id,
            title: doc.data().title,
            body: doc.data().body
        }
    })
}
