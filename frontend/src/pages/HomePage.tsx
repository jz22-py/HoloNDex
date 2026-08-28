import { SetList } from "../components/SetList"

function HomePage() {
    return (
        <div className="min-h-screen bg-[#121212] pb-16 text-[#f7f8f8]">
            <header className="mx-auto max-w-350 px-4 pt-10 pb-6 sm:px-8">
                <p className="text-[13px] font-medium tracking-[0.4px] text-[#b3b3b3]">Website Name</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-[-1px] text-[#f7f8f8] sm:text-4xl">Browse Sets</h1>
                <p className="mt-2 max-w-xl text-sm leading-normal text-[#b3b3b3]">
                    Live market prices across every Major Pokémon TCG set, grouped by series.
                </p>
            </header>
            <main className="mx-auto max-w-350 px-4 sm:px-8">
                <SetList />
            </main>
        </div>
    )
}

export default HomePage