import Header from "../Components/Header.jsx"
import Loading from "./Loading"
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router"
import { useState, useEffect } from "react"
import { getQuiz } from "../api"
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
            setCurrentIndex(items.length - 1)
        }
    }

    useEffect(() => {
        x.set(0)
    }, [currentIndex])

    const handleDragEnd = () => {
        if (Math.abs(x.get()) > 100) {
            const direction = x.get() > 0 ? 1 : -1
            animate(x, direction * 400, {
                duration: 0.15,
                onComplete: () => {
                    handleNextIndex()
                    console.log(direction)
                }
            })
        }    
    }

    return (
        currentItem ? 
        <>
        <Header />
        <div className="min-h-[calc(100vh-48px)] mt-12 flex items-center justify-center">
            <div>
                <motion.div 
                    key={currentIndex}
                    drag="x"
                    dragConstraints={{left: 0, right: 0}}
                    dragElastic={1}
                    onDragEnd={() => handleDragEnd()}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        x,
                        opacity,
                        rotate,
                    }}
                    className="bg-surface-a10 rounded-2xl overflow-hidden border-2 border-surface-a20 hover:cursor-grab active:cursor-grabbing"
                >
                    <img src={currentItem.image} alt={currentItem.name} className="w-80 pointer-events-none"/>
                    <p className="text-center text-primary-a0 text-2xl font-bold py-6 mb-2">{currentItem.name}</p>
                </motion.div>
                <div className="text-center">
                    <button
                        className="text-white p-2 m-2 bg-surface-a10 rounded-md"
                        onClick={() => handlePrevIndex()}
                    >Prev</button> 
                    <button 
                        className="text-white p-2 m-2 bg-surface-a10 rounded-md"
                        onClick={() => handleNextIndex()}
                    >Next</button> 
                </div>
            </div>
        </div>
        </>
        :
        <Loading />
    )
}

export default Quiz
