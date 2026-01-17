import { useState } from "react"
import { useNavigate } from "react-router"
import { createStatsShare } from "../api.jsx"
import Header from "../Components/Header.jsx"
import { useCopyToClipboard } from "../Components/useCopyToClipboard.jsx"


function Home() {
    const [activeCategory, setActiveCategory] = useState(null)
    const navigate = useNavigate()
    const { copy, isCopied } = useCopyToClipboard()

    const handleShare = async () => {
        const data = await createStatsShare(activeCategory)
        const copyText = `${window.location.origin}${data['share_url']}`
	    copy(copyText)
    }


    return(
        <>
        <Header />
        <div className="min-h-[calc(100vh-48px)] mt-12 flex items-center justify-center">
            <div>
                <div className="text-center mb-10">
                    <h1 className="text-primary-a0 text-3xl font-bold mb-2">Choose Category</h1>
                    <p className="text-surface-a40">Start a quiz or explore more details</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {["Products", "Dishes", "Drinks"].map((category, index) => (
                    <div
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className="bg-surface-a10 p-4 rounded-xl border-2 border-primary-a0 hover:scale-[1.02] hover:bg-surface-a20 transition cursor-pointer"
                    >
                        <div className="text-primary-a0/40 text-4xl font-bold mb-4">{`0${index + 1}`}</div>
                        <h1 className="text-primary-a0 text-xl font-bold">{category}</h1>
                        <p className="text-surface-a40">
                        {["Basic ingridients, separate products", "Recipes, origins and cousines", "Soft drinks, alcohol and everything in between"][index]}</p>
                    </div>
                    ))}
                </div>
            </div>
        </div>

        {activeCategory && (
            <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center"
                onClick={() => setActiveCategory(null)}
            >
                <div
                    className="bg-surface-a10 border-2 border-primary-a0 p-4 rounded-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="font-bold mb-3 text-xl flex">
                        <p className="text-primary-a0/40 pr-1">0{["Products", "Dishes", "Drinks"].indexOf(activeCategory) + 1}</p>
                        <p className="text-primary-a0">{activeCategory}</p>
                    </div>
                    {[
                        {text: "Start Quiz", onClick: () => navigate(`/quiz/${activeCategory.toLowerCase()}`)}, 
                        {text: "Statistics", onClick: () => navigate(`/stats/${activeCategory.toLowerCase()}`)}, 
                        {text: "Share", onClick: () => handleShare()}
                    ].map((button, index) => (
                    <button 
                        key={index} 
                        className={`w-full py-2 mb-2 rounded-lg font-medium cursor-pointer ${isCopied && button.text === "Share" ? "text-white bg-primary-a0" : "text-surface-a50 hover:text-white bg-surface-a20 hover:bg-surface-a30 ring ring-surface-a30"} transition `}
                        onClick={button.onClick}
                    >
                        {button.text} 
                    </button>
                    ))}
                </div>
            </div>
        )}
        </>
    )
}

export default Home
