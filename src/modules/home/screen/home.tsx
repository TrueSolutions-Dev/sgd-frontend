import { useSiteSettings } from "@/modules/settings/components/SiteSettingsProvider";


export default function Home() {
    const { siteName, siteLogo } = useSiteSettings();
    
    return (
        <main className="bg-black-home w-dvw h-dvh">
            <nav className="flex justify-between px-20 py-6 items-center">
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

            <div className="flex mt-10">
                <section className="w-1/2 flex justify-center items-center h-full">
                    <div className="w-[500px] relative">
                        <div className="bg-black-light-home rounded-t-2xl flex justify-between 
                                        items-center px-5 py-3">
                            <div className="flex items-center gap-3">
                                <div className="text-white-home">|</div>
                                <h2 className="text-white-home font-semibold">Nuevo anuncio</h2>
                            </div>
                            <span className="text-white-home text-sm">laliga@admin - 12/03/2025</span>
                        </div>
                        <div className="bg-dark-green-home rounded-b-2xl px-5 py-3">
                            <p className="text-white-home">
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate eaque quam 
                                debitis placeat vitae quia, ullam unde, porro, illum corporis deserunt 
                                voluptatibus facere reprehenderit nostrum. Laboriosam facilis ipsa corrupti 
                                cumque.
                            </p>
                        </div>
                        <img src="/football.png" alt="football image" className="absolute bottom-[-366px] w-[499px]"/>
                    </div>
                </section>

                <section className="w-1/2 flex justify-center">
                    <div>
                        <div>
                            <h2 className="text-white-home">Tabla de posiciones</h2>
                            <div>
                            </div>
                        </div>
                    </div>

                    <div>

                    </div>
                </section>
            </div>

        </main>
    )
}