import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { firestore } from '../../firebase/utils'
import HorizontalVideoCard from '../HorizontalVideoCard'
import "./style_displaysearch.scss"


import Image from "../../assets/16526305592141308214.png"
import AdOnTop from '../DisplayAd/AdOnTop';

function DisplaySearch() {
    const { searchTerm } = useParams()
    const [searchData, setSearchData] = useState([])
    const [searchDataTemp, setSearchDataTemp] = useState([])

    useEffect(() => {

        // var searchTermUpperCase = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)
        if(searchTerm){
            getData(searchTerm)
            
            // var searchTermThing = searchTerm.toLowerCase();
            // var strlength = searchTermThing.length;
            // var strFrontCode = searchTermThing.slice(0, strlength-1);
            // var strEndCode = searchTermThing.slice(strlength-1, searchTermThing.length);
            // // This is an important bit.. startAt(searchTerm).endAt(endCode + '~')
            // var endCode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
        
            // firestore.collection("videos")
            // .where("tier", "==" , "").where("privacy", "==", "public")
            // .where('titleForSearch', '>=', searchTerm).where('titleForSearch', '<', endCode + '~')
            
            // .onSnapshot((snapshot) => {
            //     setSearchData(snapshot.docs.map(doc => ({
            //         vid: doc.id, 
            //         title: doc.data().title,
            //         views: doc.data().views,
            //         privacy: doc.data().privacy,
            //         desc: doc.data().desc,
            //         category: doc.data().category,
            //         sourceLink: doc.data().sourceLink,
            //         thumbnail: doc.data().thumbnail,
            //         createdDate: doc.data().createdDate,
            //         videoAdminUID: doc.data().videoAdminUID,
            //         tier: doc.data().tier,
            //     })))
            // })
        }
       
      }, [searchTerm])

      useEffect(() => {
        if(searchDataTemp.length > 0){
            eliminateDuplicatesObject(searchDataTemp)
        }
      }, [searchDataTemp])

      const getData = async (term) => {
        const postRef = firestore.collection('videos')
        var arr1 = []
        var arr2 = []

        term = term.toLowerCase();
        // reverse term
        const termR = term.split("").reverse().join("");

        // define queries
        const titles = postRef.orderBy('titleForSearch').startAt(term).endAt(term + '~').get().then(
            snapshot => {
                arr1 = snapshot.docs.map(doc => ({
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
                }))
            }
        );
        const titlesR = postRef.orderBy('titleForSearchRev').startAt(termR).endAt(termR + '~').get().then(
            snapshot => {
                arr2 = snapshot.docs.map(doc => ({
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
                }))
            }
        );

        // get queries
        const [titleSnap, titlesRSnap] = await Promise.all([
            titles,
            titlesR
        ]);
        setSearchDataTemp(arr1.concat(arr2));

      }

    const eliminateDuplicatesObject = (arr) => {
        const uniqueObjects = [...new Map(arr.map(item => [item.vid, item])).values()]

        setSearchData(uniqueObjects)
    }

    return (
        <>
            <div className='displaySearch_ad'>
                <AdOnTop
                    Image={Image}
                    Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
                />
            </div>
            
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
        </>
    )
}

export default DisplaySearch
