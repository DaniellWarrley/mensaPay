import styled from "styled-components"
import {  FiAlertCircle, FiDollarSign } from "react-icons/fi"
import { clientService } from "../../services/clientService"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Loading from "./Loading"

const Container = styled.div`
    padding: 20px;
    

    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 16px;

    background-color: #1a1a1a;
    border-radius: 3px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
`

const CardHeader = styled.div`
    padding-bottom: 10px;

    display: flex;
    flex-direction: column;
    gap: 4px;

    border-bottom: 1px solid #2e2e2e;

    h2 {
        display: flex;
        align-items: center;
        gap: 8px;

        color: #f5f5f5;
        font-size: 1.4rem;
    }

    p {
        color: #9ca3af;
        font-size: 0.9rem;
    }
`

const CardInfoContainer = styled.div`
    margin-top: 12px;

    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
`

const CardInfoBox = styled.div`
    padding: 10px;

    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    background-color: #1f1f1f;
    border-radius: 3px;
    border-top: 3px solid #519872;
    transition: 0.3s ease all;

    &:hover {
        background-color: #222831;
    }

    p {
        margin-bottom: 4px;

        color: #9ca3af;
        font-size: 0.8rem;      
    }

    span {
        color: #f5f5f5;
        font-weight: bold;
        font-size: 1.1rem;
    }
`

const EditButton = styled.button`
    padding: 10px;

    background-color: transparent;
    border: none;
    color: white;
    font-weight: 600;
    border-radius: 3px;
    cursor: pointer;
    transition: 0.3s ease;

    &:hover {
        background-color: #478162ff;
    }
`

const SaveButton = styled.div`
    padding: 10px;

    background-color: #519872;
    border: none;
    color: white;
    font-weight: 600;
    border-radius: 3px;
    cursor: pointer;
    transition: 0.3s ease;

    &:hover {
        background-color: #478162ff;
    }
`
const Options = styled.div`
    display: flex;
    justify-content: space-between;
`
const LoadingWrapper = styled.div`
    position: absolute;
    inset: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    background: rgba(0,0,0,0.65);
    border-radius: 3px;

    z-index: 10;
`

function formatDateBR(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" })
}

function getClientState(dataVencimento){
    let hoje = new Date()
    let venc = new Date(dataVencimento)

    hoje.setHours(0, 0, 0, 0)
    venc.setHours(0, 0, 0, 0)

    if (hoje > venc) {
        return "Atrasado"
    } else if (hoje.getTime() === venc.getTime()) {
        return "Vence hoje"
    } else {
        return "Em dia"
    }
}
export default function ClientCard({ client, plans, handleModal }) {
    const queryClient = useQueryClient()

    const plano = plans.filter((plan) => plan._id == client.plano)

    const efetuarPagamento = useMutation({
        mutationFn: async() => {
            return await clientService.efetuarPagamento(client._id)
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['clients'], (oldData) => {
                return oldData.map(oldClient =>
                    oldClient._id === client._id
                        ? { ...oldClient, ...data }
                        : oldClient
                )
            })
        },
        onError: (err) => {
            console.log(err)
        }
    })
    
    return (
        <Container>
            {efetuarPagamento.isPending && (<Loading/>)}
            <CardHeader>
                <h2>
                    Cliente: {client.nome}
                </h2>
                <p>Contato: {client.contato}</p>
                <p>Estado: {getClientState(client.dataVencimento)}</p>
                <p>Plano: {plano[0].nome}</p>
            </CardHeader>
            <CardInfoContainer>
                <CardInfoBox>
                    <FiAlertCircle size={20} color="#FACC15" />
                    <p>Data de vencimento</p>
                    <span>{formatDateBR(client.dataVencimento)}</span>
                </CardInfoBox>

                <CardInfoBox>
                <FiDollarSign size={20} color="#3B82F6" />
                <p>Valor a ser pago</p>
                <span>R$ {plano[0].valor}</span>
                </CardInfoBox>
            </CardInfoContainer>

            <Options>
                <EditButton onClick={() =>handleModal()}>Editar</EditButton>
                <SaveButton onClick={() => efetuarPagamento.mutate()}>Pagamento feito</SaveButton>
            </Options>           
        </Container>
    )
}
