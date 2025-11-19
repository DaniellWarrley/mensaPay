import styled from 'styled-components'
import { FiSearch } from "react-icons/fi";

const SearchBarContainer = styled.div`
    padding: 7px 10px;

    width: 320px;

    display: flex;
    justify-content: space-between;

    background-color: #1A1A1A;
    border: 1px solid #2E2E2E;
    border-radius: 3px;

    input{
        width: 70%;
        background-color: transparent;
        color: #F5F5F5;
        outline: 0;
        border: 0;
    }
`
const Icon = styled.div`
    padding: 5px 10px;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #2E2E2E;
    color: #F5F5F5;
    border-radius: 3px;
    transition: color 0.2s, transform 0.2s;
`
export default function SearchBar({ search, setSearch }){
    return(
        <SearchBarContainer>
            <input
                type="text"
                placeholder="Pesquisar cliente..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <Icon>
                <FiSearch/>
            </Icon>
        </SearchBarContainer>
    )
}
