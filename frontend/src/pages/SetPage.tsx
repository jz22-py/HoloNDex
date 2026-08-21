import { useParams } from "react-router-dom"
import { CardList } from "../components/CardList"

function SetPage(){
    let params = useParams()

    return (
        <>
            <CardList setId={params.setId ?? ""}/>
        </>
    )
}

export default SetPage