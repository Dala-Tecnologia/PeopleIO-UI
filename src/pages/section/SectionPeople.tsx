import businessImg from '@/assets/img/peopleio-portal_business_3.png';
export const SectionPeople = () => {
    return(
        <section 
            className="flex flex-col md:flex-row h-auto md:h-96 items-center justify-between px-12 py-10 md:py-0 gap-8 md:gap-0">
            <div >
                <h1 className="text-xl font-bold md:text-4xl leading-tight text-blue-950">
                    Seja <span className="text-green-500">encontrado</span> pelas empresas.
                </h1>
            </div>
            <div className="rounded-lg shadow-lg overflow-hidden">
                <img src={businessImg} alt="Ilustração de integração de sistemas" className='h-64 w-114 object-contain'/>
            </div>
        </section>
    );
};
