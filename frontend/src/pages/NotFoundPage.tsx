import { Link } from "react-router-dom"

function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#121212] px-4 text-center text-[#f7f8f8]">
            <p className="text-sm font-medium tracking-[0.4px] text-[#b3b3b3]">404</p>
            <h1 className="text-3xl font-semibold tracking-[-1px]">Page not found</h1>
            <p className="max-w-sm text-sm text-[#b3b3b3]">
                The page you're looking for doesn't exist or may have been moved.
            </p>
            <Link
                to="/"
                className="mt-3 rounded-full bg-[#1f1f1f] px-4 py-2 text-xs font-bold tracking-[1.2px] text-[#f7f8f8] uppercase transition-colors duration-200 hover:bg-[#2a2a2a]"
            >
                Back to Sets
            </Link>
        </div>
    )
}

export default NotFoundPage
