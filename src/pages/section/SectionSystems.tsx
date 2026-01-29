import systemImg from '@/assets/img/integration_background_white.png';

export const SectionSystems = () => {
    return(
        <section 
            className="flex flex-col md:flex-row h-auto md:h-96 items-center justify-between px-12 py-10 md:py-0 gap-8 md:gap-0"
        >
            <div className="rounded-lg shadow-lg overflow-hidden bg-zinc-50">
                <img src={systemImg} alt="Ilustração de integração de sistemas" className='h-86 w-120 object-contain rounded-lg'/>
            </div>
            <div className="px-6 ml-5">
                <h1 className="text-xl font-bold md:text-4xl leading-tight m-4 text-blue-950">
                    Trabalhamos para entegra a melhor <br/><span className="text-green-500">experiência de integração</span> com os ERPs.
                </h1>
            </div>
        </section>
    );
};
