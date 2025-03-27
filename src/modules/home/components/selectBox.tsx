import { useState } from "react";

export default function SelectBox() {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="w-[160px] h-[40px] bg-black-light-home flex justify-between items-center relative">
            <span className="text-white-home px-4">Fuerza</span>
            <button 
            className="h-full flex items-center px-4 bg-dark-green-home"
            onClick={() => setIsOpen(!isOpen)}
            >
                <img src="/ArrowDown.png" alt="arrowDown" className=" w-[20px]" />
            </button>

            {isOpen && (
                <div className="absolute bg-black-light-home w-full h-[200px] top-[100%] z-10">

                </div>
            )}
        </div>
    )
}