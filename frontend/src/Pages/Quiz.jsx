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
                {currentItem && <p className="text-primary-a0 text-3xl font-bold text-center mb-2">{category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}</p>}
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
                    className={`bg-surface-a10 rounded-2xl overflow-hidden border-2 border-primary-a0 ${currentItem && 'hover:cursor-grab active:cursor-grabbing'} mb-2`}
                >
                    {currentItem ? 
                    <>
                    <img src={currentItem.image} alt={currentItem.name} className="w-full h-100 object-cover pointer-events-none"/>
                    <p className="text-center text-primary-a0 text-2xl font-bold py-6">{currentItem.name}</p>
                    </>
                    :
                    <div className="px-8 py-12 text-center">
                        <div className="text-primary-a0/50 text-5xl font-bold mb-4">✓</div>
                        <p className="text-primary-a0 text-3xl font-bold mb-2">Quiz Complete!</p>
                        <p className="text-surface-a40 mb-6">You've rated all items in {category}</p>
                        <div className="space-y-3">
                            <button 
                                onClick={() => navigate('/')}
                                className="w-full py-3 bg-surface-a20 rounded-lg text-surface-a50 font-medium border-1 border-surface-a30 hover:bg-surface-a30 hover:text-white cursor-pointer transition"
                            >
                                <i className="fa-solid fa-home mr-2"></i>
                                Back to Home
                            </button>
                            <button 
                                onClick={() => window.location.reload()}
                                className="w-full py-3 bg-surface-a20 rounded-lg text-surface-a50 font-medium border-1 border-surface-a30 hover:bg-surface-a30 hover:text-white cursor-pointer transition"
                            >
                                <i className="fa-solid fa-rotate-right mr-2"></i>
                                Start Over
                            </button>
                            {/* TODO: share button */}
                        </div>
                    </div>
                    }
                </motion.div>
                {currentItem && <p className="text-primary-a0/50 text-2xl text-center font-bold mb-2">{`${currentIndex + 1}/${items.length}`}</p>}
                <div className="text-center">
                    {currentItem ? [
                        { onClick: () => handlePrevIndex(), icon: "fa-solid fa-angle-left" },
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
                        { onClick: () => handleNextIndex(), icon: "fa-solid fa-angle-right" }
                    ].map((b, index) => (
                    <button
                        key={index}
                        className="text-white text-lg w-14 py-3 m-2 bg-surface-a10 rounded-md border-2 border-primary-a0 active:bg-surface-a20 hover:bg-surface-a20 transition"
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
