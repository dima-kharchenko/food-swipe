import Header from "../Components/Header.jsx"
import Loading from "./Loading"
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router"
import { useState, useEffect } from "react"
import { getQuiz, rateItem } from "../api"
import { motion, useMotionValue, useTransform, animate } from "motion/react"


function Quiz() {
    const { category } = useParams()
    const navigate = useNavigate()

    const [items, setItems] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const currentItem = items[currentIndex]

    const x = useMotionValue(0)
    const opacity = useTransform(x, [-400, 0, 400], [0, 1, 0])
    const rotate = useTransform(x, [-300, 300], [-30, 30])

    useEffect(() => {
        (async () => {
            try {
                const data = await getQuiz(category)
                setItems(p => data)
            } catch(err) {
                console.log(err)
            }
        })()
    }, [])

    useEffect(() => {
        x.set(0)
    }, [currentIndex])

    const handlePrevIndex = () => {
        if (currentIndex > 0) {
            setCurrentIndex(p => p - 1)
        }
        else {
            setCurrentIndex(0)
        }
    }

    const handleNextIndex = () => {
        if (currentIndex < items.length - 1) {
            setCurrentIndex(p => p + 1)
        } else {
            setCurrentIndex(items.length)
        }
    }

    const handleDragEnd = (id) => {
        if (Math.abs(x.get()) > 100) {
            const direction = x.get() > 0 ? 1 : -1
            animate(x, direction * 400, {
                duration: 0.15,
                onComplete: async () => {
                    handleNextIndex()
                    await rateItem(id, direction)
                }
            })
        }    
    }

    return (
        items ? 
        <>
        <Header />
        <div className="min-h-[calc(100vh-48px)] mt-12 flex items-center justify-center">
            <div>
                {currentItem && (
                    <div className="flex items-center justify-between mb-6 px-2">
                        <div>
                            <p className="text-primary-a0/40 text-sm uppercase tracking-wider">
                                {category}
                            </p>
                            <p className="text-primary-a0 text-xl font-bold">
                                {currentItem.name}
                            </p>
                        </div>
                        <div className="text-primary-a0/50 text-2xl font-bold">
                            {currentIndex + 1}/{items.length}
                        </div>
                    </div>
                )}
                <motion.div 
                    key={currentIndex}
                    drag={currentItem && "x"}
                    dragConstraints={{left: 0, right: 0}}
                    dragElastic={1}
                    onDragEnd={() => currentItem ? handleDragEnd(currentItem.id) : null}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        x,
                        opacity,
                        rotate,
                    }}
                    className={`relative bg-surface-a10 rounded-2xl overflow-hidden border-1 border-surface-a30 ${currentItem && 'w-90 aspect-[2/3] hover:cursor-grab active:cursor-grabbing'} mb-8`}
                >
                    {currentItem ? 
                    <img src={currentItem.image} alt={currentItem.name} className="w-full h-full object-cover pointer-events-none"/>
                    :
                    <div className="px-8 py-12 text-center">
                        <div className="text-primary-a0/50 text-5xl font-bold mb-4">✓</div>
                        <p className="text-primary-a0 text-3xl font-bold mb-2">Quiz Complete!</p>
                        <p className="text-surface-a40 mb-6">You've rated all items in {category}</p>
                        <div className="space-y-3">
                            <button 
                                onClick={() => navigate('/')}
                                className="w-full py-3 bg-surface-a20 rounded-lg text-surface-a50 font-medium border-1 border-surface-a30 hover:bg-surface-a30 active:text-white hover:text-white cursor-pointer transition"
                            >
                                <i className="fa-solid fa-home mr-2"></i>
                                Back to Home
                            </button>
                            <button 
                                onClick={() => navigate(`/stats/${category}`)}
                                className="w-full py-3 bg-surface-a20 rounded-lg text-surface-a50 font-medium border-1 border-surface-a30 hover:bg-surface-a30 active:text-white hover:text-white cursor-pointer transition"
                            >
                                <i className="fa-solid fa-chart-simple mr-2"></i>
                                View Stats
                            </button>
                            {/* TODO: share button */}
                        </div>
                    </div>
                    }
                </motion.div>
                <div className="text-center justify-center flex gap-3">
                    {currentItem ? [
                        { onClick: () => handlePrevIndex(), icon: "fa-solid fa-angle-left", disabled: currentIndex === 0 },
                        { onClick: async () => {
                            handleNextIndex()
                            await rateItem(currentItem.id, -1) 
                        }, icon: "fa-solid fa-xmark" },
                        { onClick: async () => {
                            handleNextIndex()     
                            await rateItem(currentItem.id, 0)
                        }, icon: "fa-regular fa-face-meh" },
                        { onClick: async () => {
                            handleNextIndex()
                            await rateItem(currentItem.id, 1)
                        }, icon: "fa-solid fa-heart" },
                        { onClick: () => handleNextIndex(), icon: "fa-solid fa-angle-right", disabled: currentIndex === items.length - 1 }
                    ].map((b, index) => (
                    <button
                        key={index}
                        disabled={b.disabled}
                        className="text-surface-a50 text-lg w-14 py-3 bg-surface-a10 rounded-md border-1 border-surface-a30 cursor-pointer active:text-white hover:text-white active:bg-surface-a20 hover:bg-surface-a20 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        onClick={b.onClick}
                    ><i className={b.icon}></i></button> 
                    ))
                    :
                    <></>} 
                </div>
            </div>
        </div>
        </>
        :
        <Loading />
    )
}

export default Quiz
