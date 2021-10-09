import React, { useCallback, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

import { api, AUTH_TOKEN } from './services/api';
import { IRetornoApi } from './interfaces/RetornoApi';

import './App.css';

interface IDataSet {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderWidth: number;
}

interface ChartProps {
  labels: string[];
  datasets: IDataSet[]
}

export function App() {
  const registrosPorPagina = 20;
  const [pedidos, setPedidos] = useState<IRetornoApi>({} as IRetornoApi);
  const [chartData, setChartData] = useState<ChartProps>({} as ChartProps);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [paginaAnteriorBtnDesabilitado, setPaginaAnteriorBtnDesabilitado] = useState(true);
  const [proximaPaginaBtnDesabilitado, setProximaPaginaBtnDesabilitado] = useState(false);

  useEffect(() => {
    async function getPedidos() {
      try {
        const { data }: { data: IRetornoApi } = await api.get(`pedido?pagina=${paginaAtual}&quantidadePorPagina=${registrosPorPagina}`, {
          headers: { Authorization: AUTH_TOKEN }
        })

        setPedidos(data);

        const encomendasRealizadas = data.pedidos.filter(pedido => pedido.dataEntregaFormatada).length
        const encomendasEmEspera = data.pedidos.filter(pedido => !pedido.dataEntregaFormatada).length

        const tmpChartData: ChartProps = {
          labels: ['Realizadas', 'Em espera'],
          datasets: [{
            label: 'Encomendas',
            data: [encomendasRealizadas, encomendasEmEspera],
            backgroundColor: [
                '#06d429',
                '#fcba03'
            ],
            borderWidth: 0
          }]
        }

        setChartData(tmpChartData)

        const ultimaPagina = (registrosPorPagina * paginaAtual) > data.quantidadeDePedidos
        setProximaPaginaBtnDesabilitado(ultimaPagina)
        
        const primeiraPagina = paginaAtual <= 1;
        setPaginaAnteriorBtnDesabilitado(primeiraPagina)
      } catch (error) {
        console.error(error);
      }
    };

    getPedidos();
  }, [paginaAtual, registrosPorPagina]);

  const handlePaginaAnteriorClick = useCallback(() => {
    setPaginaAtual(oldstate => oldstate - 1);
  }, []);

  const handleProximaPaginaClick = useCallback(() => {
    setPaginaAtual(oldstate => oldstate + 1);
  }, []);

  return (
    <div className="app">
      <div className="dashboard">
        <div className="cardEncomendas">
          <div className="legenda">
            <p>Encomendas</p>
          </div>
          <div>
            <Doughnut data={chartData} className="grafico" color="red"/>
          </div>
        </div>
        <div className="tabelaRegistros">
          <h2>Detalhes dos pedidos</h2>
          <div className="scrollTabela">
            <table>
              <thead>
                <tr>
                  <th>IdPedido</th>
                  <th>Equipe Responsável</th>
                  <th>Data Criação</th>
                  <th>Data Entrega</th>
                  <th>Lista de Produtos</th>
                  <th>Endereço</th>
                  <th>Total do Pedido</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.pedidos?.map(pedido => (
                  <tr key={String(pedido.id)}>
                    <td>{pedido.id}</td>
                    <td>{pedido.equipe?.nome}</td>
                    <td>{pedido.dataCriacaoFormatada}</td>
                    <td>{pedido.dataEntregaFormatada}</td>
                    <td>{pedido.listaProdutosFormatada}</td>
                    <td>{pedido.endereco}</td>
                    <td>{pedido.totalDoPedidoFormatado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <section className="paginacao">
            <button
              className="btnPaginacao"
              disabled={paginaAnteriorBtnDesabilitado}
              onClick={handlePaginaAnteriorClick}
            >
              <FaChevronLeft size={25} />
            </button>
            <p>Página {paginaAtual}</p>
            <button
              className="btnPaginacao"
              disabled={proximaPaginaBtnDesabilitado}
              onClick={handleProximaPaginaClick}
            >
              <FaChevronRight size={25} />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
