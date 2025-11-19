import styled from "styled-components"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { clientService } from "../../services/clientService.js"
import Loading from "../ui/Loading"
import { useEffect, useMemo } from "react"

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;

    display: ${props => props.isOpen ? 'block' : 'none'};display: ${props => props.isOpen ? 'block' : 'none'};

    height: 100vh;
    width: 100vw;

    background-color: #00000065;
    z-index: 999;
`

const Form = styled.form`
    position: absolute; 
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    padding: 15px;
    width: 350px;

    display: flex;
    flex-direction: column;
    gap: 15px;

    background-color: #1A1A1A;
    border-radius: 3px;

    h1, label {
        color: #F5F5F5;
    }
    p {
        color: #9CA3AF;
    }
    input {
        padding: 7px;
        width: 100%;
        background-color: #1F1F1F;
        color: #9CA3AF;
        border: 1px solid #2E2E2E;
        border-radius: 3px;
    }
`

const Select = styled.select`
    padding: 5px;
    background-color: #1A1A1A;
    color: #F5F5F5;
    border: 1px solid #2E2E2E;
    border-radius: 3px;
    outline: 0;
    cursor: pointer;
`

const InputWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;

    span{
        color: ${props => props.hasError ? '#EF4444' : '#1A1A1A'};
    }
`

const Options = styled.div`
    display: flex;
    justify-content: space-between;

    #saveButton{
        padding: 10px;
        background-color: #519872;
        color: #FFF;
        border: 0;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.3s all ease;

        &:hover{
            background-color: #42795bff;
        }
    }

    #cancelButton{
        margin-left: 5px;
        padding: 10px;
        background-color: transparent;
        color: #FFF;
        border: 0;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.3s all ease;

        &:hover{
            background-color: #EF4444;
        }
    }
`

export default function ClientModal({ isOpen, handleModal, plans = [], clientData }){
    const ClientSchema = z.object({
        nome: z.string().min(1, 'Digite um nome válido'),
        contato: z.string().min(11 ,'Digite um contato válido').max(11, 'Digite um contato válido'),
        plano: z.string().min(1, "Selecione ou crie um plano"),
    })

    const queryClient = useQueryClient()

    const closeModal = () => {
        handleModal()
        reset({nome: '', contato: '', plano: ''})
    }

    const planOptions = useMemo(() => {
        return plans.length > 0
            ? plans
            : [{ _id: "none", nome: "Sem planos definidos" }]
    }, [plans])


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setError
    } = useForm({
        resolver: zodResolver(ClientSchema),
        mode: 'onSubmit',
        defaultValues: {
            nome: '',
            contato: '',
            plano: planOptions[0]._id
        }
    })

    const { isPending, mutate } = useMutation({
        mutationKey: ['clients'],
        mutationFn: async (data) => {
            if(clientData){
                return await clientService.editClient(data, clientData._id)
            }else{                
                return await clientService.newClient(data)
            }
        },
        onSuccess: (data) =>{
            queryClient.setQueryData(['clients'], (oldData) => {
                if(clientData){
                    return oldData.map(client => 
                        client._id == clientData._id ? {...client, ...data} : client
                    )
                }
                if (!oldData) return [data]
                return [...oldData, data]
            })
            handleModal()
        },
        onError: (err) => {
            setError('contato', {message: 'Um cliente já foi cadastrado com esse número'})
        }
    })

    const deletePlan = useMutation({
        mutationFn: async () =>{
            return await clientService.deleteClient(clientData._id)
        },
        onSuccess: () => {
            queryClient.setQueryData(['clients'], (oldData) =>
                oldData.filter(client => client._id !== clientData._id)
            )
            handleModal()
        },
        onError: (err) => {
            console.log(err)
        }
    })
    useEffect(() => {
        if(clientData){
            reset({
                nome: clientData.nome,
                contato: clientData.contato,
                plano: clientData.plano
            })
        }
    }, [clientData, reset])

    return(
        <Container isOpen={isOpen}>
            <Form onSubmit={handleSubmit(mutate)}>
                {(isSubmitting || isPending || deletePlan.isPending) && <Loading/>}

                <div>
                    <h1>Cliente</h1>
                    <p>Adicione ou edite um cliente</p>
                </div>

                <InputWrapper hasError={!!errors.nome}>
                    <label>Nome do cliente</label>
                    <input type="text" placeholder="Digite o nome do cliente" {...register('nome')}/>
                    <span>{errors.nome?.message || 'as'}</span>
                </InputWrapper>

                <InputWrapper hasError={!!errors.contato}>
                    <label>Contato do cliente</label>
                    <input type="text" placeholder="Digite o contato do cliente" {...register('contato')}/>                 
                    <span>{errors.contato?.message || 'as'}</span>
                </InputWrapper>

                <InputWrapper hasError={!!errors.plano}>
                    <label>Plano</label>
                    <Select {...register("plano")} disabled={plans.length === 0}>
                        {planOptions.map((plan, i) => (
                            <option key={i} value={plan._id}>
                                {plan.nome}
                            </option>
                        ))}
                    </Select>
                    <span>{errors.plano?.message || 'as'}</span>
                </InputWrapper>

                <Options>
                    <div>
                        <button id="cancelButton" onClick={closeModal} type="button">Cancelar</button>
                        <button id="cancelButton" onClick={() => deletePlan.mutate()} type="button">Apagar</button>
                    </div>
                    
                    <button id="saveButton" type="submit">Salvar</button>
                </Options>
            </Form>
        </Container>
    )
}
