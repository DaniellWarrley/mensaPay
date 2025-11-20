import { styled } from 'styled-components'
import { useState } from 'react'
import { useQuery } from "@tanstack/react-query"

import Card from '../components/ui/Card.jsx'
import PlanosModal from '../components/modals/PlanosModal.jsx'
import SearchBar from '../components/ui/SearchBar.jsx'
import Filter from '../components/ui/Filter.jsx'
import { planService } from '../services/planService.js'
import { clientService } from '../services/clientService.js'
import Loading from '../components/ui/Loading.jsx'
import ExpiredToken from '../components/modals/ExpiredToken.jsx'

const Container = styled.div`
    padding: 2% 5%;
    height: 100vh;

    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
        padding: 4% 5% 110px; 
    }
`
const ContainerHead = styled.div`
    display: flex;

    gap: 30px;
`
const CardContainer = styled.div`
    margin-top: 15px;
    padding-bottom: 120px; 

    display: grid;
    align-items: start;
    flex: 1;
    min-height: 60vh;

    grid-template-columns: 1fr 1fr 1fr; 
    gap: 30px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #333;
        border-radius: 4px;
    }

    @media (max-width: 1100px) {
        grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;  
        gap: 20px;
        padding-bottom: 150px; 
    }
`


const CardFooter = styled.div`
    margin: 10px;

    width: 100%;
    height: 50px;

    display: flex;
    justify-content: flex-end;
`
const FloatingButton = styled.button`
    padding: 15px 22px;

    position: fixed;
    bottom: 50px; 
    right: 40px;

    background-color: #1A1A1A;
    color: #F5F5F5;
    border: 1px solid #2E2E2E;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    transition: all ease 0.3s;

    &:hover {
        background-color: #2A2A2A;
    }

    @media (max-width: 768px) {
        right: 20px;
        bottom: 80px; 
        padding: 12px 18px;
    }
`

export default function Planos(){
    const [isOpen, setIsOpen] = useState(false)
    const [defaultPlan, setDefaultPlan] = useState(null)
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("todos")
    const [tokenExpired, setTokenExpired] = useState(false)


    const handleModal = (plan = null) => {
        setDefaultPlan(plan)
        setIsOpen(prev => !prev)
    }

    const handlTokenExpired = () => {
        setTokenExpired(true)
    }
    
    const { isLoading, data } = useQuery({
        queryKey: ["plans"],
        queryFn: async () => {
            try{
                const plans = await planService.getUserPlans()
                return plans
            }catch (err){
                if(err.status == 400 || err.status == 401){
                    handlTokenExpired()
                }
            }  
        },
        onError: (err) => {
            console.log(err)
        }
    })

    const {isLoading: clientsIsLoading, data: clientData} = useQuery({
        queryKey: ['clients'],
        queryFn: async () => {
            try{
                const clients = await clientService.getClients()
                return clients
            }catch (err){
                if(err.status == 400 || err.status == 401){
                    handlTokenExpired()
                }
            }
        },
        onError: (err) => {
            if (err.status === 401) {
                alert("Sua sessão expirou. Faça login novamente.");
                return
            }
            console.log(err)
        }

    })

    return(
        <Container>
            {(isLoading || clientsIsLoading) && (<Loading/>)}

            <ExpiredToken isTokenExpired={tokenExpired}/>
            <PlanosModal isOpen={isOpen} handleModal={handleModal} planData={defaultPlan}/>
            <ContainerHead>
                <SearchBar search={search} setSearch={setSearch}/>
                <Filter filter={filter} setFilter={setFilter}/>

            </ContainerHead>
            <CardContainer>
                {
                    (data || [])
                        ?.filter(plan => {
                            const clientesDoPlano = clientData?.filter(c => c.plano === plan._id) || []
                            const hoje = new Date()

                            const ativos = clientesDoPlano.some(c => new Date(c.dataVencimento) > hoje)
                            const pendentes = clientesDoPlano.some(c => new Date(c.dataVencimento) <= hoje)

                            if (filter === "ativos") return ativos
                            if (filter === "pendentes") return pendentes

                            return true
                        })
                        .filter(plan =>
                            plan.nome.toLowerCase().includes(search.toLowerCase())
                        )
                        .sort((a, b) => {
                            if (filter === "valor") {
                                const valorA = clientData
                                    ?.filter(c => c.plano === a._id)
                                    .reduce((acc, c) => acc + (a.valor || 0), 0)

                                const valorB = clientData
                                    ?.filter(c => c.plano === b._id)
                                    .reduce((acc, c) => acc + (b.valor || 0), 0)

                                return valorB - valorA
                            }
                            return 0
                        })
                        .map(plan => (
                            <Card 
                                key={plan._id}
                                planData={plan}
                                clientData={clientData}
                                handleModal={() => handleModal(plan)}
                            />
                        ))
                }
</CardContainer>

            <CardFooter>
                <FloatingButton onClick={() => handleModal()} >Criar plano</FloatingButton>
            </CardFooter>           
        </Container>
    )
}
