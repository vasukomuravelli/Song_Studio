import React from "react";
import axios from "axios";
import { ImPlay3, ImNext2, ImPrevious2 } from "react-icons/im"
import { IoIosPause } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Select } from 'antd';
const { Option } = Select;

export const HomePage = () => {
    const [songsdata, setSongsdata] = React.useState([]);
    const [sorted, setSorted] = React.useState([]);
    const [current, setCurrent] = React.useState({});
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isLoading, setLoading] = React.useState("");
    const audio = React.useRef();
    React.useEffect(() => {
        getData()
    }, []);
    const getData = () => {
        axios.get("https://s3-ap-southeast-1.amazonaws.com/he-public-data/studiod9c0baf.json").then((response) => {
            setSongsdata(response.data);
        })
    }
    React.useEffect(() => {
        console.log(isLoading);
    },[isLoading]);
    async function afterload(song) {
        setCurrent(song);
        if (audio.current) {
            setLoading(true);
            await audio.current.load();
            await audio.current.play();
            // await audio.current.pause();
            setLoading(false);
        }
        setIsPlaying(true);        
    }
    const handleSong = (song) => {
        afterload(song);
    }
    const handlePause = (value) => {
        if (value==="true") {
            setIsPlaying(false);
            audio.current.pause();
        } else {
            setIsPlaying(true);
            audio.current.play();
        }
    }
    const handleSort = (value) => {
        if (value === "a2z") {
            let afterSort = [...songsdata];
            afterSort.sort((a, b) => a.song.localeCompare(b.song))
            setSorted(afterSort);            
        } else if (value === "z2a") {
            let afterSort = [...songsdata];
            afterSort.sort((a, b) => b.song.localeCompare(a.song))
            setSorted(afterSort);
        } else {
            getData();
        }
    }
    React.useEffect(() => {
        if (sorted.length > 0) {
            setSongsdata(sorted);
        }
    },[sorted])
    return (
        <div>
            <div className="heading">
                <h1>Song Studio</h1>
                <div>
                    <Select placeholder="Select sort" onChange={handleSort} >
                        <Option value="default">Default</Option>
                        <Option value="a2z">Sort A - Z</Option>
                        <Option value="z2a">Sort Z - A</Option>
                    </Select>
                </div>
            </div>
            <div className="gallery">
                {songsdata.map((s) => (
                    <div key = {s.song} onClick={()=>handleSong(s)}>
                        <img src={s.cover_image} alt={s.song} />
                        <h1>{s.song}</h1>
                        <p>{s.artists}</p>
                    </div>))}
            </div>
            {current.song ? <div className="player">
                <div>
                    <img src={current?.cover_image} alt={current?.song} />
                </div>
                <audio ref = {audio} autoPlay>
                    <source src={current.url} type="audio/mpeg" />
                </audio>
                <div>
                    <p>{current.song}</p>
                    <p>{current.artists}</p>
                </div>
                <div id="contols">
                    <ImPrevious2 onClick={() => handleSong(songsdata[songsdata.indexOf(current) - 1 < 0 ? songsdata.length - 1 : songsdata.indexOf(current) - 1])} style={{fontSize:"30px",cursor:"pointer"}}/>
                    {isLoading ? <AiOutlineLoading3Quarters style={{ fontSize: "25px" }} className="loader"/> :isPlaying ? <IoIosPause onClick={()=>handlePause("true")} style={{fontSize:"30px",cursor:"pointer"}}/> : <ImPlay3 onClick={()=>handlePause("false")} style={{fontSize:"30px",cursor:"pointer"}}/>}
                    <ImNext2 onClick={()=>handleSong(songsdata[songsdata.indexOf(current)+1 > songsdata.length-1 ? 0 : songsdata.indexOf(current)+1])} style={{fontSize:"30px",cursor:"pointer"}}/>
                </div>
                <div>
                    {!audio.current?.paused ? <img src="https://i.gifer.com/YdBO.gif" alt="song playing"/> : null}
                </div>
            </div> : null}
        </div>
    )
}