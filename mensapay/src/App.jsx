import { useEffect, useState } from 'react'
import { styled, createGlobalStyle} from 'styled-components'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {  useNavigate } from 'react-router'

import Loading from './components/ui/Loading'
import { authService } from './services/authService'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Neutra';
    src: url(/fonts/neutra.otf) format('opentype');
  }

  * {
    margin: 0;
    padding: 0;
    font-family: 'Neutra';
  }

  body{
    width: 100vw;
    height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #0D0D0D;
  }
`

const Form = styled.form`
  position: relative;
  padding: 15px;

  height: 55%;
  width: 300px;

  display: inline-flex;
  justify-content: center;
  flex-direction: column;

  background-color: #1A1A1A;
  border-top: 5px solid #519872;
  border-radius: 3px;
  gap: 15px;
`

const FormHead = styled.div`
  margin: 5px;

  h2{
    color: #F5F5F5;
  }
  p{
    color: #9CA3AF;
  }
`

const FormBody = styled.div`
  margin: 5px;

  display: inline-flex;
  flex-direction: column;

  color: #9CA3AF;

  
`
const InputWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;

  input{
    padding: 10px;

    background-color: #1F1F1F;
    color: #9CA3AF;
    border: 1px solid ${props => props.hasError ? '#EF4444' : '#2E2E2E'};
    border-radius: 3px;
    outline: 0;
  }
  span{
    margin-bottom: 5px;

    color: ${props => props.hasError ? '#EF4444' : '#1F1F1F'};
  }
`

const Submit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  button{
    margin-top: 10px;
    padding: 10px 5px;

    width: 100%;

    background-color: #519872;
    color: #FFF;
    border: 0;
    border-radius: 5px;
    outline: 0;
    cursor: pointer;

    transition: 0.3s all ease;
    &:hover{
      background-color: #42795bff;
    }
  }
  span{
    margin-bottom: 5px;
    margin-top: 5px;

    color: #519872;
    cursor: pointer;
  }
`

const authSchema = z.object({
    email: z.string().email('Email inválido'),
    pass: z.string().min(6, 'Senha inválida')
})

function App() {
  const [toggle, setToggle] = useState(false)
  const navigate = useNavigate()

  const {
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    setError
  } = useForm({
    resolver: zodResolver(authSchema),
    mode: 'onSubmit',
    defaultValues: {email: '', pass: ''}
  })

  const onSubmit = async (data) => {
    if(!toggle){
      try{
        await authService.login(data)
        navigate('/home/planos')
      }catch (err){
        if(err.message.includes('404')){
          setError('email', { message: 'Email não encontrado'})
        }else if(err.message.includes('422')){
          setError('pass', { message: 'Senha inválida'})
        }
      }
    }else{
      try{
        await authService.register(data)
        setToggle(prev => !prev)
      }catch (err){
        if(err.message.includes('422')){
          setError('email', { message: 'Use outro email'})
        }
      }
    } 
  }
  
  useEffect(() => {   
    if(localStorage.getItem('token')){
      navigate('/home/planos')
    }
  }, [])

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <GlobalStyle/>
      {isSubmitting && <Loading/>}

      <FormHead>
        {( !toggle ? <h2>Login</h2> : <h2>Cadastro</h2> )}
        {( !toggle ? <p>Faça login para ter acesso ao site</p> : <p>Crie uma conta para ter acesso ao site</p>)}
      </FormHead>
      <FormBody>
        <InputWrapper  hasError={!!errors.email}>
          <label htmlFor="">Email</label>
          <input type="email" {...register('email')}/>
          <span>{errors.email?.message || 'as'}</span>
        </InputWrapper>
        <InputWrapper  hasError={!!errors.pass}>
          <label htmlFor="">Senha</label>
          <input type="password" {...register('pass')}/>
          <span>{errors.pass?.message || 'as'}</span>
        </InputWrapper>
        
        <Submit>
          {( !toggle ? <button type='submit'>Logar</button> : <button type='submit'>Cadastrar</button> )}
          <p>{ !toggle ?  ('Ainda não tem uma conta?') : ('Já tem uma conta? ') }
          <span onClick={() => setToggle(prev => !prev)}>Clique aqui.</span></p>       
        </Submit>
      </FormBody>
    </Form>
  )
}

export default App
