import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { firestore } from '../../firebase/utils'
import HorizontalVideoCard from '../HorizontalVideoCard'
import "./style_displaysearch.scss"

function DisplaySearch() {
    const { searchTerm } = useParams()
    const [searchData, setSearchData] = useState([])

    useEffect(() => {

        // var searchTermUpperCase = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)
        if(searchTerm){
        var searchTermThing = searchTerm.toLowerCase();
        var strlength = searchTermThing.length;
        var strFrontCode = searchTermThing.slice(0, strlength-1);
        var strEndCode = searchTermThing.slice(strlength-1, searchTermThing.length);
        // This is an important bit.. startAt(searchTerm).endAt(endCode + '~')
        var endCode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
    
        firestore.collection("videos")
        .where("tier", "==" , "").where("privacy", "==", "public")
        .where('titleForSearch', '>=', searchTerm).where('titleForSearch', '<', endCode + '~')
        .onSnapshot((snapshot) => {
            setSearchData(snapshot.docs.map(doc => ({
                vid: doc.id, 
                title: doc.data().title,
                views: doc.data().views,
                privacy: doc.data().privacy,
                desc: doc.data().desc,
                category: doc.data().category,
                sourceLink: doc.data().sourceLink,
                thumbnail: doc.data().thumbnail,
                createdDate: doc.data().createdDate,
                videoAdminUID: doc.data().videoAdminUID,
                tier: doc.data().tier,
            })))
        })
        }
       
      }, [searchTerm])

      console.log(searchData)

    return (
        <div className='displaySearch'>
            <h2 className='labelSearch'>
                Tìm kiếm
            </h2>

            {!searchTerm && [
                <div>
                    Không có gì ở đấy cả....
                </div>
            ]}
            
            {searchTerm && [
            <div className='horizontalVideo'>
                {
                    searchData.map(video => {
                        return(
                            <HorizontalVideoCard key={video.vid} video={video} />
                        )
                    })
                }
            </div>
            ]}
        </div>
    )
}

export default DisplaySearch
