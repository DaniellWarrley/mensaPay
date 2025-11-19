import styled from "styled-components"

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #0D0D0D;

  z-index: 9999; 
`


const Spinner = styled.div`
  border: 4px solid #1A1A1A;
  border-top: 4px solid #519872;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
export default function Loading(){
    return(
        <LoadingContainer>
            <Spinner/>
        </LoadingContainer>
    )
}