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

export const handleFetchVideos = ({ filterType, currentUserId, filterTypeTag, pageSize, startAfterDoc, persistVideos=[] }) => {
    return new Promise((resolve, reject) => {
        // const pageSize = 8

        let ref = firestore.collection('videos').orderBy('createdDate', 'desc').where("tier", "==", "").where("privacy", "==", "public").limit(pageSize)
        
        if (filterTypeTag) ref = ref.where('tags', 'array-contains', filterTypeTag);
        if (filterType) ref = ref.where('category', '==', filterType);
        if (currentUserId) ref = ref.where('videoAdminUID', 'in', currentUserId)
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

export const handleFetchFollowingVideos = ({ filterType, currentUserId, filterTypeTag, pageSize, startAfterDoc, persistVideos=[] }) => {
    return new Promise((resolve, reject) => {
        // const pageSize = 8

        let ref = firestore.collection('videos').orderBy('createdDate', 'desc').where("tier", "==", "").where("privacy", "==", "public").limit(pageSize)
        
        if (filterTypeTag) ref = ref.where('tags', 'array-contains', filterTypeTag);
        if (filterType) ref = ref.where('category', '==', filterType);
        if (currentUserId) ref = ref.where('videoAdminUID', 'in', currentUserId)
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