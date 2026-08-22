import { useParams } from "react-router-dom"
import { CardDetail } from "../components/CardDetail"
import { PriceChart } from "../components/PriceChart"

function CardPage(){
    let params = useParams()

    return (
        <>
            <CardDetail cardId={params.cardId ?? ""} />
            <PriceChart cardId={params.cardId ?? ""} />
        </>

    )
}

export default CardPage