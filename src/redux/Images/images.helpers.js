import { firestore } from "../../firebase/utils";

//create something in database(firebase)
export const handleAddImage = image => {
    return new Promise((resolve, reject) => {
        firestore
            .collection("images")
            .doc(image.imageId)
            .set(image, { merge: true })
            .then(() => {
                resolve()
            })
            .catch(err => {
                reject(err)
            })
    })
}

export const handleFetchImages = ({ filterType, filterTypeTag, pageSize ,startAfterDoc, persistImages=[] }) => {
    return new Promise((resolve, reject) => {
        // const pageSize = 6

        let ref = firestore.collection('images').orderBy('createdDate', 'desc').where("tier", "==", "").where("privacy", "==", "public").limit(pageSize)
        
        if (filterTypeTag) ref = ref.where('tags', 'array-contains', filterTypeTag);
        if (filterType) ref = ref.where('imageCategory', '==', filterType);
        if (startAfterDoc) ref = ref.startAfter(startAfterDoc);
        
        ref
            .get()
            .then(snapshot => {
                const totalCount = snapshot.size

                const data = [
                    ...persistImages,
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

export const handleDeleteImage = documentID => {
    return new Promise((resolve,reject) => {
        firestore
            .collection('images')
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

export const handleFetchImage = imageID => {
    return new Promise((resolve, reject) => {
        firestore
            .collection('images')
            .doc(imageID)
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