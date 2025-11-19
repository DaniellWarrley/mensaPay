import styled from "styled-components"

const Select = styled.select`
    background-color: #1A1A1A;
    color: #F5F5F5;
    border: 1px solid #2E2E2E;
    border-radius: 3px;
    outline: 0;

    cursor: pointer;
`
export default function Filter({ filter, setFilter }) {
    return (
        <Select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="ativos">Clientes ativos</option>
            <option value="pendentes">Clientes pendentes</option>
            <option value="valor">Valor arrecadado</option>
        </Select>
    )
}
