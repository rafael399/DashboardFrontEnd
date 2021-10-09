import { IPedido } from "./Pedido";

export interface IRetornoApi {
    quantidadeDePedidos: number;
    pedidos: IPedido[];
}