import { useParams } from "react-router-dom"
import { SetHeader } from "../components/SetHeader"
import { CardList } from "../components/CardList"

function SetPage() {
    const params = useParams()
    const setId = params.setId ?? ""

    return (
        <div className="min-h-screen bg-[#121212] pb-16 text-[#f7f8f8]">
            <div className="mx-auto max-w-350 px-4 pt-10 sm:px-8">
                <SetHeader setId={setId} />
                <main className="mt-8">
                    <CardList setId={setId} />
                </main>
            </div>
        </div>
    )
}

export default SetPage