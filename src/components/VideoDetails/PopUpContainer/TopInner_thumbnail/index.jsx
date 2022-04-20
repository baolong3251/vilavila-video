import React, { useEffect, useState } from 'react';
import VideoThumbnail from 'react-video-thumbnail';

function TopInner_thumbnail(props) {
    const [thumb, setThumb] = useState('')
    return (
        <div className="video-player-inner">
            {!props.arr.thumbnail ? <>
            {/* <ReactPlayer 
                className="react-player-inner"
                url={arr.sourceLink} 
                controls = {false}
                width="100%"
                height="100%"
                config={{ file: { 
                    attributes: {
                        controlsList: 'nodownload'
                }}}} 
            />  */}

            <div className='hideVideoThumbnail'>
                <VideoThumbnail
                    videoUrl={props.arr.sourceLink} 
                    thumbnailHandler={(thumbnail) => setThumb(thumbnail)}
                    // width={2000}
                    // height={1100}
                    // snapshotAtTime={5}
                    crossorigin
                />
            </div>

            <img src={thumb} />
            </> : <img src={props.arr.thumbnail} />
            }
        </div>
    )
}

export default TopInner_thumbnail