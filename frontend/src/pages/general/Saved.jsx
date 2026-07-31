import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import axios from 'axios'
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

const Saved = () => {
    const [ videos, setVideos ] = useState([])

    useEffect(() => {
        const storedState = readStoredReelState()

        axios.get(`${import.meta.env.VITE_API_URL}/api/food/save`, { withCredentials: true })
            .then(response => {
                const savedFoods = response.data.savedFoods.map((item) => {
                    const storedItem = storedState[item.food._id] || {}
                    return {
                        _id: item.food._id,
                        video: item.food.video,
                        description: item.food.description,
                        likeCount: item.food.likeCount,
                        savesCount: item.food.savesCount,
                        commentsCount: item.food.commentCount ?? item.food.commentsCount ?? 0,
                        commentCount: item.food.commentCount ?? item.food.commentsCount ?? 0,
                        foodPartner: item.food.foodPartner,
                        isLiked: Boolean(storedItem.isLiked),
                        isSaved: true
                    }
                })
                setVideos(savedFoods)
            })
    }, [])

    const removeSaved = async (item) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/food/save`, { foodId: item._id }, { withCredentials: true })
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 1) - 1) } : v))

            if (typeof window !== 'undefined') {
                const storedState = readStoredReelState()
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    ...storedState,
                    [item._id]: {
                        ...(storedState[item._id] || {}),
                        isSaved: false
                    }
                }))
            }
        } catch {
            // noop
        }
    }

    const handleCommentAdded = (foodId) => {
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
            onSave={removeSaved}
            onCommentAdded={handleCommentAdded}
            emptyMessage="No saved videos yet."
        />
    )
}

export default Saved