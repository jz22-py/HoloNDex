import { SetList } from "../components/SetList"
import logo from "../assets/logo.png"
import { Footer } from "../components/Footer"

function HomePage() {
    return (
        <div className="min-h-screen bg-[#121212] pb-16 text-[#f7f8f8]">
            <div className="flex items-center justify-center pt-10">
                <img src={logo} alt="" className="h-24 w-24 object-contain sm:h-32 sm:w-32" />
                <span className="text-4xl font-extrabold tracking-[-1px] sm:text-5xl">
                    <span className="text-[#f7f8f8]">Holo</span>
                    <span className="text-[#1ed760]">N</span>
                    <span className="text-[#f7f8f8]">Dex</span>
                </span>
            </div>
            <header className="mx-auto max-w-350 px-4 pt-8 pb-6 sm:px-8">
                <h1 className="text-3xl font-semibold tracking-[-1px] text-[#f7f8f8] sm:text-4xl">Browse Sets</h1>
                <p className="mt-2 max-w-xl text-sm leading-normal text-[#b3b3b3]">
                    Live market prices across every Major Pokémon TCG set, grouped by series.
                </p>
            </header>
            <main className="mx-auto max-w-350 px-4 sm:px-8">
                <SetList />
            </main>
            <Footer />
        </div>
    )
}

export default HomePage