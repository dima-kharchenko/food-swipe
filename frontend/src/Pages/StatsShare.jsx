import { useParams } from 'react-router-dom'
import { useState, useEffect } from "react"
import { getStatsShare } from "../api"

function Stats() {
    const { share_id } = useParams()
    const [items, setItems] = useState([])
    const [currentSort, setCurrentSort] = useState('Recent')
    const [reverseSort, setReverseSort] = useState(false)
    const [category, setCategory] = useState('')
    
    useEffect(() => {
        (async () => {
            try {
                const res = await getStatsShare(share_id)
                setCategory(res.category)
                setItems(p => res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
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

    return (
        <>
        <div className="min-h-[calc(100vh-48px)] mt-12 w-full px-4 md:w-2/3 mx-auto">
            <div className="flex flex-col md:flex-row pt-10 gap-4 md:gap-0">
                <div>
                    <p className="text-primary-a0 text-3xl font-bold">Shared Collection</p>
                    <p className="uppercase text-primary-a0/50 text-sm tracking-wider">{category}</p>
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
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6 pb-8">
                {items.map((item, index) => (
                    <div key={index} className="relative aspect-2/3 rounded-lg overflow-hidden ring-2 ring-surface-a20 text-white/50 hover:text-white hover:ring-2 hover:ring-primary-a0 cursor-pointer transition">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-linear-to-t from-surface-a0/60 via-transparent hover:via-primary-a0/20 transition">
                            <div className="absolute bottom-0 px-4 py-3 flex w-full">
                                <p className="font-bold">{item.name}</p>
                                <i className={`ml-auto my-auto ${["fa-solid fa-xmark", "fa-regular fa-face-meh", "fa-solid fa-heart"][item.score + 1]}`}></i>
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
