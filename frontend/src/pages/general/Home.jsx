import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const STORAGE_KEY = 'reel-state'

const readStoredReelState = () => {
    if (typeof window === 'undefined') return {}

    try {
        return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
    } catch {
        return {}
    }
}

const persistReelState = (items) => {
    if (typeof window === 'undefined') return

    const state = items.reduce((acc, item) => {
        acc[item._id] = {
            isLiked: Boolean(item.isLiked),
            isSaved: Boolean(item.isSaved)
        }
        return acc
    }, {})

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const Home = () => {
    const [ videos, setVideos ] = useState([])
    // Autoplay behavior is handled inside ReelFeed

    useEffect(() => {
        const storedState = readStoredReelState()

        axios.get(`${import.meta.env.VITE_API_URL}/api/food`, { withCredentials: true })
            .then(response => {
                const foodItems = (response.data.foodItems || []).map((item) => {
                    const storedItem = storedState[item._id] || {}
                    return {
                        ...item,
                        isLiked: storedItem.isLiked ?? Boolean(item.isLiked),
                        isSaved: storedItem.isSaved ?? Boolean(item.isSaved),
                        commentsCount: item.commentCount ?? item.commentsCount ?? 0,
                        commentCount: item.commentCount ?? item.commentsCount ?? 0
                    }
                })

                setVideos(foodItems)
                persistReelState(foodItems)
            })
            .catch(() => { /* noop: optionally handle error */ })
    }, [])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/food/like`, { foodId: item._id }, {withCredentials: true})

        setVideos((prev) => {
            const nextVideos = prev.map((v) => {
                if (v._id !== item._id) return v

                const nextLiked = response.data.isLiked ?? !v.isLiked
                return {
                    ...v,
                    isLiked: nextLiked,
                    likeCount: Math.max(0, v.likeCount + (nextLiked === v.isLiked ? 0 : nextLiked ? 1 : -1))
                }
            })

            persistReelState(nextVideos)
            return nextVideos
        })
    }

    async function saveVideo(item) {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/food/save`, { foodId: item._id }, { withCredentials: true })

        setVideos((prev) => {
            const nextVideos = prev.map((v) => {
                if (v._id !== item._id) return v

                const nextSaved = response.data.isSaved ?? !v.isSaved
                return {
                    ...v,
                    isSaved: nextSaved,
                    savesCount: Math.max(0, v.savesCount + (nextSaved === v.isSaved ? 0 : nextSaved ? 1 : -1))
                }
            })

            persistReelState(nextVideos)
            return nextVideos
        })
    }

    function handleCommentAdded(foodId) {
        setVideos((prev) => prev.map((video) => {
            if (video._id !== foodId) return video

            return {
                ...video,
                commentsCount: (video.commentsCount ?? video.commentCount ?? 0) + 1,
                commentCount: (video.commentCount ?? video.commentsCount ?? 0) + 1
            }
        }))
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            onCommentAdded={handleCommentAdded}
            emptyMessage="No videos available."
        />
    )
}

export default Home