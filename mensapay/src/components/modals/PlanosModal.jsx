import styled from "styled-components"

import z, { set } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { planService } from "../../services/planService"
import Loading from "../ui/Loading"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;

    display: ${props => props.isOpen ? 'block' : 'none'};

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
        outline: 0;
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
        outline: 0;
        cursor: pointer;

        transition: 0.3s all ease;
        &:hover{
            background-color: #EF4444;
        }
    }
`

const planosSchema = z.object({
    nome: z.string().min(1, 'Digite um nome válido'),
    valor: z.coerce.number().min(1, 'Digite um valor válido'),
    duracao: z.coerce.number().int().min(1, 'Digite uma duração válida'),
})

export default function PlanosModal({ isOpen, handleModal, planData }){
    const queryClient = useQueryClient()

    const closeModal = () => {
        handleModal()
        reset({nome: '', valor: '', duracao: ''})
    }

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
        setError
    } = useForm({
        resolver: zodResolver(planosSchema),
        mode: 'onSubmit',
        defaultValues: {nome: '', valor: '', duracao: ''}
    })

    const { isPending, mutate} = useMutation({
        mutationFn: async (data) => {
            if(planData){
                return await planService.editPlan(data, planData._id)
            }else{
                return await planService.newPlan(data)
            }
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['plans'], (oldData) => {
                if (planData) {
                    return oldData.map(plan =>
                        plan._id === planData._id ? { ...plan, ...data } : plan
                    )
                }
                if (!oldData) return [data]

                return [...oldData, data]
            })
            handleModal()
        },
        onError: (err) =>{
            if(err.status == 422){
                setError('nome', {message: 'Já existe um plano com esse nome '})
            }
        }
    })

    const deletePlan = useMutation({
        mutationFn: async () => {
            return await planService.deletePlan(planData._id)
        },
        onSuccess: () => {
            queryClient.setQueryData(['plans'], (oldData) =>
                oldData.filter(plan => plan._id !== planData._id)
            )
            handleModal()
        },
        onError: (err) => {
            console.log(err)
        }
    })

    useEffect(() => {
        if(planData){
            reset({
                nome: planData.nome,
                valor: planData.valor,
                duracao: planData.duracao,
            })
        }else{
            reset({nome: '', valor: '', duracao: ''})
        }
    }, [planData])

    const onSubmit = (data) => mutate(data)

    return(
        <Container isOpen = {isOpen}>
            <Form onSubmit={handleSubmit(onSubmit)}>
                {(isSubmitting || isPending || deletePlan.isPending) && (<Loading/>)}
                <div>
                    <h1>Plano</h1>
                    <p>Crie ou modifique um plano</p>
                </div>
                <InputWrapper hasError={!!errors.nome}>
                    <label htmlFor="">Nome do plano</label>
                    <input type="text" placeholder="Digite o nome do plano" {...register('nome')}/>
                    <span>{errors.nome?.message || 'as'}</span>
                </InputWrapper>
                <InputWrapper hasError={!!errors.valor}>
                    <label htmlFor="">Valor do plano</label>
                    <input type="number" placeholder="Digite o valor do plano" {...register('valor')}/>                 
                    <span>{errors.valor?.message || 'as'}</span>
                </InputWrapper>
                <InputWrapper hasError={!!errors.duracao}>
                    <label htmlFor="">Duração do plano (meses)</label>
                    <input type="number" placeholder="Digite a duração do plano" {...register('duracao')}/>
                    <span>{errors.duracao?.message || 'as'}</span>
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