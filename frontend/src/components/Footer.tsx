export function Footer() {
    return (
        <footer className="px-4 py-8 sm:px-8">
            <div className="mx-auto flex max-w-350 flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[#b3b3b3] sm:flex-row sm:items-center sm:justify-between">
                <span>HoloNDex is an unofficial Pokémon TCG market tracker.</span>
                <a
                    href="https://github.com/jz22-py/HoloNDex"
                    target="_blank"
                    className="-ml-3 inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 font-bold tracking-[1.2px] uppercase transition-colors duration-200 hover:bg-[#1f1f1f] hover:text-[#1ed760] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ed760] sm:ml-0"
                >
                    GitHub
                </a>
            </div>
        </footer>
    )
}
