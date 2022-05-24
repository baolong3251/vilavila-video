import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { firestore } from '../../../firebase/utils'
import TrendingVideo from '../TrendingVideo'
import moment from "moment-timezone"
import 'moment/locale/vi';

function RankingTable() {
    const [dataTagLog, setDataTagLog] = useState([])

    useEffect(() => {
        firestore.collection('tagLog').orderBy("NumOfInteractions", "desc").where("contentType", "==", "video").get().then((snapshot) => {
            setDataTagLog(snapshot.docs.map(doc => ({
                id: doc.id, 
                tag: doc.data().tag, 
                NumOfInteractions: doc.data().NumOfInteractions, 
                lastUpdate: doc.data().lastUpdate,
              })
            ))
        })
    }, [])

    useEffect(() => {
        if(dataTagLog.length > 0) {
            var date = new Date();
            // var firstDayNextMonth = new Date(date.getFullYear(), date.getMonth()+1, 1);
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            dataTagLog.map(dat => {
                var time = moment(dat.lastUpdate.toDate()).locale('vi').fromNow()
                var time2 = moment(dat.lastUpdate.toDate()).locale('vi').format("M")
                var time3 = moment(date).locale('vi').format("M")
                
                if(time == "một tháng trước"){
                    firestore.collection('tagLog').doc(dat.id).set({
                        NumOfInteractions: 0,
                        lastUpdate: date,
                    }, {merge: true})
                }

                if(time2 !== time3){
                    firestore.collection('tagLog').doc(dat.id).set({
                        lastUpdate: firstDay,
                    }, {merge: true})
                }

            })
        }
    }, [dataTagLog])

    return (
        <>
            <div className='homepage_column'>
                <div className='homepage_columnTag'>
                    {dataTagLog.length > 0 ? 
                    <TrendingVideo dataTagLog={dataTagLog[0].tag} />
                    : null}
                </div>

                <div className='homepage_columnRanking'>
                    <h2 className='label_video_type'>Top trending</h2>
                    {dataTagLog.map(data => {
                        return(
                            <div>
                                <Link to={`/videos/tag/${data.tag}`}>
                                    {data.tag}
                                </Link> 
                                <p>{data.NumOfInteractions} lượt tương tác</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            {dataTagLog.length > 1 ? 
                <TrendingVideo dataTagLog={dataTagLog[1].tag} />
            : null}

            {dataTagLog.length > 2 ? 
                <TrendingVideo dataTagLog={dataTagLog[2].tag} />
            : null}
        </>
    )
}

export default RankingTable