import React, { useEffect, useState } from 'react'
import { firestore } from '../../../firebase/utils'
import RequestUser from '../RequestUser'

function ShowRequestUser() {
    const [user, setUser] = useState([])

    useEffect(() => {
        firestore.collection('users').where("point", ">=", 100).limit(3).get().then((snapshot) => {
            setUser(snapshot.docs.map(doc => ({
                id: doc.id, 
                displayName: doc.data().displayName, 
                avatar: doc.data().avatar,
              })
            ))
        })
    }, [])

    return (
        <>

            {user.length > 0 ? 
                <RequestUser user={user[0]} />
            : null}

            {user.length > 1 ? 
                <RequestUser user={user[1]} />
            : null}

            {user.length > 2 ? 
                <RequestUser user={user[2]} />
            : null}
        </>
    )
}

export default ShowRequestUser