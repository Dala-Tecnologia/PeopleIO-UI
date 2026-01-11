
export const PortalFooter = () => {
    let year = new Date().getFullYear();
    return (
        <footer className="bg-blue-950 p-12 text-center text-white">
            <p >PeopleIO ©{year}. Todos os direitos reservados.</p>

        </footer>
    );
}