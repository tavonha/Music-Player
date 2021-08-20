import React, {useState, useRef, useEffect} from 'react'
import styles from '../styles/AudioPlayer.module.css'
import { BsArrowLeftShort } from "react-icons/bs"
import { BsArrowRightShort } from "react-icons/bs"
import {FaPlay} from "react-icons/fa"
import {FaPause} from "react-icons/fa"
import {Song} from "../media/song.mp3"
const AudioPlayer = () => {
    //state
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    //references
    const audioPlayer = useRef(); //reference our audio component
    const progressBar = useRef(); //reference our progress bar
    const animationRef = useRef(); //reference our animation


    useEffect( () => {
        const seconds = Math.floor(audioPlayer.current.duration);
        setDuration(seconds);
        progressBar.current.max = seconds;
    }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

    const calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${returnedMinutes}:${returnedSeconds}`;
    }

    const togglePlayPause = () => {
        const prevValue = isPlaying;
        setIsPlaying(!prevValue);
        if (!prevValue) {
            audioPlayer.current.play();
            animationRef.current = requestAnimationFrame(whilePlaying)
        } else {
            audioPlayer.current.pause();
            cancelAnimationFrame(animationRef.current)
        }
    }

    const whilePlaying = () => {
        progressBar.current.value = audioPlayer.current.currentTime;
        changePlayerTime();
        animationRef.current = requestAnimationFrame(whilePlaying)
    }

    const changeRange = () => {
        audioPlayer.current.currentTime = progressBar.current.value;
        changePlayerTime();
    }

    const changePlayerTime = () => {
        progressBar.current.style.setProperty('--seek-before-width', `$(progressBar.current.value / duration * 100)%`);
        setCurrentTime(progressBar.current.value);
    }

    return (
        <div className={styles.audioPlayer}>
            <audio ref={audioPlayer} src={Song} type="audio/mp3" preload="metadata"></audio>
            <button className={styles.fowardBackward}><BsArrowLeftShort /> 30</button>

            <button onClick={togglePlayPause} className={styles.playPause}>
                { isPlaying ? <FaPause /> : <FaPlay className={styles.play} />}
            </button>

            <button className={styles.fowardBackward}><BsArrowRightShort /> 30</button>

            {/*current time */}
            <div className={styles.currentTime}>{calculateTime(currentTime)}</div>

            {/* progress bar */}
            <div>
                <input type="range" className={styles.progressBar} defaultValue="0" ref={progressBar} onChange={changeRange}/>
            </div>

            {/* duration */}
            <div className={styles.duration}>{(duration && !isNaN(duration)) && calculateTime(duration)}</div>
        </div>
    )
}

export {AudioPlayer}
