import { firestore } from "../../firebase/utils";

//create something in database(firebase)
export const handleAddVideo = video => {
    return new Promise((resolve, reject) => {
        firestore
            .collection("videos")
            .doc(video.vId)
            .set(video, { merge: true })
            .then(() => {
                resolve()
            })
            .catch(err => {
                reject(err)
            })
    })
}

export const handleFetchVideos = ({ filterType, startAfterDoc, persistVideos=[] }) => {
    return new Promise((resolve, reject) => {
        const pageSize = 6

        let ref = firestore.collection('videos').orderBy('createdDate', 'desc').where("tier", "==", "").limit(pageSize)
        
        if (filterType) ref = ref.where('category', '==', filterType);
        if (startAfterDoc) ref = ref.startAfter(startAfterDoc);
        
        ref
            .get()
            .then(snapshot => {
                const totalCount = snapshot.size

                const data = [
                    ...persistVideos,
                    ...snapshot.docs.map(doc => {
                        return {
                            ...doc.data(),
                            documentID: doc.id
                        }
                    })
                ]
                resolve({ 
                    data,
                    queryDoc: snapshot.docs[totalCount - 1],
                    isLastPage: totalCount < 1 
                })
            })
            .catch(err => {
                reject(err)
            })
    })
}

export const handleDeleteVideo = documentID => {
    return new Promise((resolve,reject) => {
        firestore
            .collection('videos')
            .doc(documentID)
            .delete()
            .then(() => {
                resolve();
            })
            .catch(err => {
                reject(err);
            })
    })
}

export const handleFetchVideo = videoID => {
    return new Promise((resolve, reject) => {
        firestore
            .collection('videos')
            .doc(videoID)
            .get()
            .then(snapshot => {
                if (snapshot.exists) {
                    resolve(
                        snapshot.data()
                    )
                }
            })
            .catch(err => {
                reject(err)
            })
    })
}