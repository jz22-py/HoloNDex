import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getSetById } from "../api/client"
import type { Set as SetType } from "../types/set"
import { SetHeader } from "../components/SetHeader"
import { CardList } from "../components/CardList"
import NotFoundPage from "./NotFoundPage"

function SetPage() {
    const params = useParams()
    const setId = params.setId ?? ""
    const [set, setSet] = useState<SetType | null>(null)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        setSet(null)
        setNotFound(false)
        getSetById(setId)
            .then(data => setSet(data))
            .catch(() => setNotFound(true))
    }, [setId])

    if (notFound) {
        return <NotFoundPage />
    }

    return (
        <div className="min-h-screen bg-[#121212] pb-16 text-[#f7f8f8]">
            <div className="mx-auto max-w-350 px-4 pt-10 sm:px-8">
                <SetHeader set={set} />
                <main className="mt-8">
                    <CardList setId={setId} />
                </main>
            </div>
        </div>
    )
}

export default SetPage