import { styled, createGlobalStyle } from 'styled-components'
import { AiFillCreditCard, AiOutlineUser } from "react-icons/ai"
import { FiLogOut } from "react-icons/fi"
import { Outlet, Link, useNavigate } from 'react-router-dom'

const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'Neutra';
        src: url(/fonts/neutra.otf) format('opentype');
    }

    * {
        margin: 0;
        padding: 0;
        font-family: 'Neutra';
        box-sizing: border-box;
    }

    body {
        width: 100vw;
        height: 100vh;
        background-color: #0D0D0D;
    }
`

const Container = styled.div`
    display: flex;
    height: 100vh;
    overflow: hidden;

    @media (max-width: 768px) {
        flex-direction: column; 
    }
`;

const MenuLateral = styled.div`
    height: 100vh;
    width: 18vw;
    background-color: #1A1A1A;

    h2 {
        padding: 15px;
        color: #F5F5F5;

        span {
            color: #519872;
        }
    }

    @media (max-width: 768px) {
        width: 100vw;
        height: 70px;

        display: flex;
        justify-content: space-around;
        align-items: center;

        position: fixed;
        bottom: 0;
        left: 0;

        h2 {
            display: none; 
        }
    }
`

const PageOptionWrapper = styled(Link)`
    margin: 10px;
    padding: 8px 12px;

    display: flex;
    align-items: center;
    gap: 10px;

    background-color: #1F1F1F;
    color: #9CA3AF;
    cursor: pointer;
    border-radius: 3px;
    text-decoration: none;

    transition: all 0.2s ease;

    &:hover {
        background-color: #2A2A2A;
        color: #F5F5F5;

        svg {
            color: #519872;
        }
    }

    @media (max-width: 768px) {
        margin: 0;
        flex-direction: column;
        padding: 5px;
        background-color: transparent;
        color: #F5F5F5;

        p {
            font-size: 12px;
        }
    }
`

const LogoutButton = styled.div`
    margin: 10px;
    padding: 8px 12px;

    display: flex;
    align-items: center;
    gap: 10px;

    background-color: #1F1F1F;
    color: #e06666;
    cursor: pointer;
    border-radius: 3px;

    transition: 0.2s;

    &:hover {
        background-color: #2A2A2A;
        color: #ff4d4d;

        svg {
            color: #ff4d4d;
        }
    }

    @media (max-width: 768px) {
        margin: 0;
        flex-direction: column;
        padding: 5px;
        background-color: transparent;
        color: #ff4d4d;

        p {
            font-size: 12px;
        }
    }
`

const CardIcon = styled(AiFillCreditCard)`
    color: #2E2E2E;
    transition: color 0.2s, transform 0.2s;
`

const ClientIcon = styled(AiOutlineUser)`
    color: #2E2E2E;
    transition: color 0.2s, transform 0.2s;
`

const LogoutIcon = styled(FiLogOut)`
    color: #2E2E2E;
    transition: color 0.2s, transform 0.2s;
`

const Main = styled.div`
    width: 100%;
    flex: 1;

    @media (max-width: 768px) {
        margin-bottom: 70px; 
    }
`

export default function Home() {
    const navigate = useNavigate()


    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    return (
        <Container>
            <GlobalStyle />
            <MenuLateral>
                <h2>Mensa<span>Pay</span></h2>

                <PageOptionWrapper to={'planos'}>
                    <CardIcon size={30} />
                    <p>Planos</p>
                </PageOptionWrapper>

                <PageOptionWrapper to={'clientes'}>
                    <ClientIcon size={30} />
                    <p>Clientes</p>
                </PageOptionWrapper>

                <LogoutButton onClick={handleLogout}>
                    <LogoutIcon size={28} />
                    <p>Sair</p>
                </LogoutButton>
            </MenuLateral>

            <Main>
                <Outlet />
            </Main>
        </Container>
    )
}
