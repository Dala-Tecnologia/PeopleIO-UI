import { SectionIntegration } from "../section/SectionIntegration";
import { SectionPeople } from "../section/SectionPeople";
import { SectionSystems } from "../section/SectionSystems";
import { PortalFooter } from "./PortalFooter";
import { PortalHeader } from "./PortalHeader";


export const PortalLayout = () => {

    return(
        <>
            <PortalHeader />
            <main className="pt-16">
                <SectionIntegration />
                <SectionPeople />
                <SectionSystems />
                <PortalFooter />
            </main>
        </>
    );
};
