import styled from "styled-components"
import { AiOutlineCreditCard } from "react-icons/ai"
import { FiUsers, FiAlertCircle, FiDollarSign } from "react-icons/fi"

const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
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

    flex: 1;
    display: flex;
    text-align: center;
    align-items: center;
    flex-direction: column;

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
    padding: 10px 0;
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
function isClientPending(client) {
    const today = new Date()
    const due = new Date(client)
    
    today.setHours(0,0,0,0)
    due.setHours(0,0,0,0)

    return due < today
}


export default function Card({ planData, handleModal, clientData }) {
    const clientPlan = (clientData || []).filter(
        (client) => client.plano === planData._id
    )

    const pendingClient = clientPlan.filter(
        (client) => isClientPending(client.dataVencimento)
    )

    return (
        <Container>
        <CardHeader>
            <h2>
                <AiOutlineCreditCard size={24} /> Plano {planData.nome}
            </h2>
            <p>Valor: R$ {planData.valor}</p>
            <p>Duração: {planData.duracao} {planData.duracao == 1 ? "mês" : "meses"}</p>
        </CardHeader>

        <CardInfoContainer>
            <CardInfoBox>
                <FiUsers size={20} color="#10B981" />
                <p>Clientes ativos</p>
                <span>{clientPlan.length - pendingClient.length}</span>
            </CardInfoBox>

            <CardInfoBox>
                <FiAlertCircle size={20} color="#FACC15" />
                <p>Clientes pendentes</p>
                <span>{pendingClient.length}</span>
            </CardInfoBox>

            <CardInfoBox>
                <FiDollarSign size={20} color="#3B82F6" />
                <p>Valor arrecadado</p>
                <span>R$ {(clientPlan.length - pendingClient.length) * planData.valor}</span>
            </CardInfoBox>
        </CardInfoContainer>

        <EditButton onClick={() => handleModal()}>Editar</EditButton>
        </Container>
    )
}
