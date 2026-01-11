import portalBusinessImg from '@/assets/img/peopleio-portal_business_2.png';

export const SectionIntegration = () => {
    return(
        <section 
            className="flex items-center h-64 md:h-96 bg-right bg-no-repeat bg-cover"
            style={{ backgroundImage: `url(${portalBusinessImg})` }}
        >
            <div className="px-6 ml-5 rounded-2xl bg-blue-950">
                <h1 className="text-xl font-bold md:text-4xl leading-tight m-4 text-white">
                    A Integração perfeita <br/>entre pessoas e empresas.
                </h1>
            </div>
        </section>
    );
};
