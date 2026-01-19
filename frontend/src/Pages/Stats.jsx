import { useParams } from 'react-router-dom'
import { useState, useEffect } from "react"
import { getStats, createStatsShare, rateItem } from "../api"
import Header from "../Components/Header.jsx"
import { useCopyToClipboard } from "../Components/useCopyToClipboard.jsx"

function Stats() {
    const { category } = useParams()
    const [items, setItems] = useState([])
    const [currentSort, setCurrentSort] = useState('Recent')
    const [reverseSort, setReverseSort] = useState(false)
    const { copy, isCopied } = useCopyToClipboard()
    
    useEffect(() => {
        (async () => {
            try {
                const data = await getStats(category)
                setItems(p => data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
            } catch(err) {
                console.log(err)
            }
        })()
    }, [])
    
    const handleSort = (newSort) => {
        let newReverse = reverseSort
        if (currentSort === newSort) {
            newReverse = !reverseSort
            setReverseSort(p => !p)
        } else {
            setCurrentSort(p => newSort)
            newReverse = false 
            setReverseSort(false)
        }
        setItems(p => {
            let res
            switch(newSort.toLowerCase()) {
                case "recent":
                    res = p.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    break
                case "name":
                    res = p.sort((a, b) => a.name.localeCompare(b.name))
                    break
                case "rating":
                    res =  p.sort((a, b) => b.score - a.score)
                    break
                default:
                    res = p 
            }
            return newReverse ? res.reverse() : res
        })
    }

    const handleShare = async () => {
        const data = await createStatsShare(category)
        const copyText = `${window.location.origin}${data['share_url']}`
	copy(copyText)
    }

    const updateScore = async (id, newScore) => {
        setItems(items =>
            items.map(i =>
                i.id === id ? { ...i, score: newScore } : i
            )
        )
        await rateItem(id, newScore)
    }

    const nextScore = (score) => {
        switch(score) {
            case -1: return 0
            case 0: return 1
            case 1: return -1
            default: return 0 
        }
    }
    
    return (
        <>
        <Header />
        <div className="min-h-[calc(100vh-48px)] mt-12 w-full px-4 md:w-2/3 mx-auto">
            <div className="flex flex-col md:flex-row pt-10 gap-4 md:gap-0">
                <div>
                    <p className="text-primary-a0 text-3xl font-bold">{category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}</p>
                    <p className="uppercase text-primary-a0/50 text-sm tracking-wider">Your Collection</p>
                </div>
                <div className="flex flex-wrap gap-3 md:gap-4 md:ml-auto md:my-auto">
                    {[
                        { count: items.length, label: 'rated' },
                        { count: items.filter(i => i.score === 1).length, label: 'liked' },
                        { count: items.filter(i => i.score === 0).length, label: 'neutral' },
                        { count: items.filter(i => i.score === -1).length, label: 'disliked' },
                    ].map((stat, index) => (
                        <div key={index} className="flex gap-1">
                            <p className="text-primary-a0 font-medium">{stat.count}</p>
                            <p className="text-surface-a30 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))} 
                </div>
            </div>
            <div className="flex mt-6 gap-2 flex-wrap">
                {["Recent", "Name", "Rating"].map((label, index) => (
                    <button
                        key={index}
                        className={`px-3 py-1 rounded-lg cursor-pointer font-medium transition ${currentSort === label ? 'text-white bg-primary-a0' : 'text-surface-a50 hover:text-white bg-surface-a10 hover:bg-surface-a20 ring-1 ring-surface-a20'}`}
                        onClick={() => handleSort(label)}
                    >{label}{currentSort === label && (reverseSort ? <i className="fa-solid fa-angle-up ml-2"></i> : <i className="fa-solid fa-angle-down ml-2"></i>)}</button>
                ))}
                <button 
                    type="button"
                    className={`ml-auto px-3 py-1 rounded-lg cursor-pointer transition ${isCopied ? 'text-white bg-primary-a0' : 'text-surface-a50 hover:text-white bg-surface-a10 hover:bg-surface-a20 ring-1 ring-surface-a20'}`}
                    onClick={() => handleShare()}
                >{isCopied ? "Copied" : "Share"}</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6 pb-8">
                {items.map((item, index) => (
                    <div key={index} className="relative aspect-2/3 rounded-lg overflow-hidden ring-2 ring-surface-a20 text-white/50 hover:text-white hover:ring-2 hover:ring-primary-a0 cursor-pointer transition group">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-linear-to-t from-primary-a0/80 via-transparent hover:via-primary-a0/20 transition">
                            <div className="absolute bottom-0 px-4 py-3 flex w-full">
                                <p className="font-bold">{item.name}</p>
                                <button 
                                onClick={() => {
                                    const newScore = nextScore(item.score)
                                    updateScore(item.id, newScore)
                                }}
                                className="ml-auto my-auto z-10"
                                >
                                    <i className={`${["fa-solid fa-xmark", "fa-regular fa-face-meh", "fa-solid fa-heart"][item.score + 1]}`}></i>
                                </button>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <div className="flex gap-3 bg-surface-a0 px-3 py-2 rounded-xl">
                            {[-1, 0, 1].map(score => (
                                <button
                                    key={score}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        updateScore(item.id, score)
                                    }}
                                    className={`text-lg cursor-pointer ${item.score === score ? "text-primary-a0" : "text-surface-a50 hover:text-white" }`}
                                >
                                    <i className={["fa-solid fa-xmark","fa-regular fa-face-meh","fa-solid fa-heart"][score + 1]} />
                                </button>
                            ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}

export default Stats
