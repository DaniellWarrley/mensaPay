import { styled } from 'styled-components'

import ClientModal from '../components/modals/ClientModal.jsx'
import SearchBar from '../components/ui/SearchBar.jsx'
import Filter from '../components/ui/Filter.jsx'
import { useState } from 'react'
import ClientCard from '../components/ui/ClientCard.jsx'
import { useQuery } from "@tanstack/react-query"
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
        bottom: 90px; 
        padding: 12px 18px;
    }
`


export default function Clientes(){
    const [isOpen, setIsOpen] = useState(false)
    const [defaultClient, setDefaultClient] = useState(null)
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("todos")  
    const [tokenExpired, setTokenExpired] = useState(false)

    const handleModal = (client = null) => {
        setDefaultClient(client)
        setIsOpen(prev => !prev)
    }

    const handlTokenExpired = () => {
        setTokenExpired(true)
    }

    const { isLoading, data  } = useQuery({
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
        onError: (err) => console.log(err)
    })

    const {isLoading: clientsIsLoading, data: clientData, error: clientError} = useQuery({
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
            if(err.status == 401 || err.status == 400){
                setTokenExpired(true)
            }
        }
    })

    return(
        <Container>
            {(isLoading || clientsIsLoading) && <Loading/>}
            <ClientModal isOpen={isOpen} handleModal={handleModal} plans={data} clientData={defaultClient} setDefaultClient={setDefaultClient}/>
            <ExpiredToken isTokenExpired={tokenExpired}/>
            <ContainerHead>
                <SearchBar search={search} setSearch={setSearch}/>
                <Filter filter={filter} setFilter={setFilter}/>
            </ContainerHead>
            
            <CardContainer>
                {
                    (clientData || [])
                        ?.filter(client => {
                            const venc = new Date(client.dataVencimento)
                            const hoje = new Date()

                            if (filter === "ativos") return venc > hoje
                            if (filter === "pendentes") return venc <= hoje
                            return true
                        })
                        .filter(client =>
                            client.nome.toLowerCase().includes(search.toLowerCase())
                        )
                        .map(client => (
                            <ClientCard 
                                key={client._id} 
                                client={client} 
                                plans={data} 
                                handleModal={() => handleModal(client)} 
                            />
                        ))
                }
            </CardContainer>

            <CardFooter>
                <FloatingButton onClick={() => handleModal()} >Criar cliente</FloatingButton>
            </CardFooter>            
        </Container>
    )
}
