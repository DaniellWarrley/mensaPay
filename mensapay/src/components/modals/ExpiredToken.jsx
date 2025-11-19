import { useNavigate } from "react-router"
import styled from "styled-components"
import { FiLogOut } from "react-icons/fi"

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;

    display: ${props => props.isTokenExpired ? 'flex' : 'none'};
    justify-content: center;
    align-items: center;

    height: 100vh;
    width: 100vw;

    background-color: #00000065;
    z-index: 999;
`

const Box = styled.div`
    background: #1a1a1a;
    padding: 20px 25px;
    border-radius: 8px;
    color: #fff;
    text-align: center;
    max-width: 320px;

    box-shadow: 0 0 10px #00000060;

    p {
        margin-bottom: 20px;
        line-height: 1.4;
    }
`

const LogoutButton = styled.div`
    padding: 5px;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

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
        flex-direction: column;
        padding: 5px;
        background-color: transparent;
        color: #ff4d4d;

        p {
            font-size: 12px;
        }
    }
`

const LogoutIcon = styled(FiLogOut)`
    color: #2E2E2E;
    transition: color 0.2s, transform 0.2s;
`

export default function ExpiredToken({ isTokenExpired }){

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    return(
        <Container isTokenExpired={isTokenExpired}>
            <Box>
                <p>Token inválido ou expirado. Por favor, entre novamente.</p>

                <LogoutButton onClick={handleLogout}>
                    <LogoutIcon size={28} />
                </LogoutButton>
            </Box>
        </Container>
    )
}
