import AnnouncementCard from "../components/announcementCard";
import NavBar from "../components/navBar";
import SelectBox from "../components/selectBox";
import Table from "../components/table";


export default function Home() {
    
    return (
        <main className="bg-black-home w-dvw h-dvh px-20">
            <NavBar/>

            <div className="flex mt-6">
                <section className="w-1/2 flex justify-start items-center h-full">
                    <AnnouncementCard/>
                </section>

                <section className="w-1/2 flex items-center flex-col">
                    <div className="w-full">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white-home font-bold text-2xl tracking-widest">
                                Tabla de posiciones
                            </h2>
                            
                            <SelectBox/>
                        </div>
                    </div>

                    <Table/>
                </section>
            </div>

        </main>
    )
}