export default function NavBar() {
    return(
        <nav className="flex justify-between py-6 items-center">
            <div className="flex items-center gap-5">
                <img src={"/notImage.png"} alt="logo" className="w-36"/>
                <h1 className="text-3xl text-white-home font-semibold">
                    League
                    <span className="text-dark-green-home">App</span>
                </h1>
            </div>
            
            <button className="bg-dark-green-home px-4 py-3 rounded-lg">
                <span className="text-white-home font-semibold text-sm">INICIAR SESIÓN</span>
            </button>
        </nav>
    )
}