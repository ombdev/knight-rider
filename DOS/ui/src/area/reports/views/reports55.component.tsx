/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { range } from 'src/shared/utils/range.util';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { TokenStorage } from 'src/shared/utils/token-storage.util';

type Props = {
  loading: boolean,
  loadReport55Action: Function,
  report: any,
};

const useStyles = makeStyles(() =>
  createStyles({
    Container: {
      background: 'white',
      padding: '17px 10px',
      border: 'none',
      borderRadius: '4px',
      boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);',
    },
    tableReports: {
      border: 'solid 1px #fafafa',
      '& th': {
        border: 'solid 1px #fafafa',
        padding: '5px 10px;',
        borderTopLeftRadius: '6px;',
        borderTopRightRadius: '6px;',
        background: '#374fc0;',
        color: 'white;',
      },
      '& td': {
        border: 'solid 1px #fafafa',
        padding: '3px 10px',
      },
      '& tr:nth-child(odd)': {
        border: 'solid 1px #fafafa',
        background: '#f4f4f4',
      },
    },
    tableWhole: {
      borderSpacing: '0px !important',
      border: 'solid 1px #fafafa',
      width: '100%',
    },
    titrow: {
      background: '#fff !important',
    },
    titlereport: {
      fontSize: '1.25rem',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      lineHeight: '1.6',
      letterSpacing: '0.0075em',
    },
    filters: {
      margin: '20px',
    },
    labelSelectYear:{
      display: 'inline',
      marginRight: '10px',
    },
    selectYearContainer: {
      display: 'inline-block',
      margin: '0 10px',
    },
    buttonTodos: {
      fontSize: '1rem',
      padding: '5px 10px',
      marginLeft: '25px',
      background: '#ffffff',
      color: '#128aba',
      borderRadius: '5px',
      border: 'solid #128aba 1px',
    },
    montos: {
      textAlign: 'right',
    },
    cantObs: {
      textAlign: 'center',
    },
  })
);

export const Report55 = (props: Props) => {
  const {
    report,
    // loading,
    loadReport55Action,
  } = props;
  const [yearEnd, setYearEnd] = useState<any>('2020');
  const [yearIni, setYearIni] = useState<any>('2012');
  const { sub: userId } = TokenStorage.getTokenClaims() || {};
  useEffect(() => {
    loadReport55Action({ ejercicio_fin: yearEnd, ejercicio_ini: yearIni, user_id: userId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearEnd, yearIni ]);
  const classes = useStyles();
  const formatMoney = ( monto: number): string =>  {
    let valueStringFixed2 = monto.toFixed(2);
    let valueArray = valueStringFixed2.split('');
    let arrayReverse = valueArray.reverse();
    let valueString = '';
    for(let i in arrayReverse ) {
      let st:number = Number(i);
      valueString = arrayReverse[i] + valueString;
      let sti:number;
      sti = (st - 2);
      if( (sti%3)===0 && st !== 2 && st !== (arrayReverse.length - 1) ){
        valueString = ',' + valueString
      }
    }
    return valueString;
  };
  return (
    <div className={classes.Container} style={{overflow:'auto'}}>
      <div>
        <span className={classes.titlereport}>Reporte Ejecutivo Concentrado de Observaciones por Ente Fiscalizador Atendidas y por Atender</span>
      </div>

      <div className={classes.filters}>
        <div className={classes.selectYearContainer}>
          <InputLabel className={classes.labelSelectYear}>Desde:</InputLabel>
          <Select
            labelId="desde"
            value={yearIni}
            onChange={(e)=> {setYearIni(e.target.value);}}
          >
            {range(2000, new Date().getFullYear()).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className={classes.selectYearContainer}>
          <InputLabel className={classes.labelSelectYear}>Hasta:</InputLabel>
          <Select
            labelId="hasta"
            value={yearEnd}
            onChange={(e)=> {setYearEnd(e.target.value);}}
          >
            {range(2000, new Date().getFullYear()).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </div>

      </div>


      <table className={classes.tableWhole}> 
        <tbody className={classes.tableReports} >
          <tr className={classes.titrow}>    
            <th rowSpan={2} style={{background:'#ffffff', color: '#333333',}} >Secretaría/Entidad/Municipio</th> 
            <th colSpan={2}>ASF</th>
            <th colSpan={2} style={{background:'rgb(100,100,100,0.1)', color: '#888888',}} >TOTAL ATENDIDAS</th> 
            <th colSpan={2} style={{background:'rgb(100,100,100,0.1)', color: '#888888',}} >POR ATENDER</th> 
            <th colSpan={2}>ASENL</th>
            <th colSpan={2} style={{background:'rgb(100,100,100,0.1)', color: '#888888',}} >TOTAL ATENDIDAS</th> 
            <th colSpan={2} style={{background:'rgb(100,100,100,0.1)', color: '#888888',}} >POR ATENDER</th> 
            <th colSpan={2}>CyTG</th>
            <th colSpan={2} style={{background:'rgb(100,100,100,0.1)', color: '#888888',}} >TOTAL ATENDIDAS</th> 
            <th colSpan={2} style={{background:'rgb(100,100,100,0.1)', color: '#888888',}} >POR ATENDER</th> 
            <th colSpan={2} style={{background:'#2763be', color: '#ffffff',}} >TOTAL ATENDIDAS</th> 
            <th colSpan={2} style={{background:'#2763be', color: '#ffffff',}} >POR ATENDER</th> 
          </tr> 
          <tr style={{ fontWeight: "bold"}}> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto</td> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto</td> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto</td> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto</td> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto</td> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto</td> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto</td> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto</td> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto</td> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto</td> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto</td> 
          </tr> 
           {report && report.data_rows && report.data_rows.map((dep: any) =>
             <tr> 
               <td>{dep.dep}</td> 

               <td className={classes.cantObs} >{dep.c_asf}</td>
               <td className={classes.montos}  >{formatMoney(dep.m_asf)} </td>
               <td className={classes.cantObs} >{dep.c_a_asf}</td>
               <td className={classes.montos}  >{formatMoney(dep.m_a_asf)}</td>
               <td className={classes.cantObs} >{dep.c_na_asf}</td>
               <td className={classes.montos}  >{formatMoney(dep.m_na_asf)}</td>

               <td className={classes.cantObs} >{dep.c_asenl}</td>
               <td className={classes.montos}  >{formatMoney(dep.m_asenl)}</td>
               <td className={classes.cantObs} >{dep.c_a_asenl}</td>
               <td className={classes.montos}  >{formatMoney(dep.m_a_asenl)}</td>
               <td className={classes.cantObs} >{dep.c_na_asenl}</td>
               <td className={classes.montos}  >{formatMoney(dep.m_na_asenl)}</td>

               <td className={classes.cantObs} >{dep.c_cytg}</td>
               <td className={classes.montos}  >{formatMoney(dep.m_cytg)}</td>
               <td className={classes.cantObs} >{dep.c_a_cytg}</td>
               <td className={classes.montos}  >{formatMoney(dep.m_a_cytg)}</td>
               <td className={classes.cantObs} >{dep.c_na_cytg}</td>
               <td className={classes.montos}  >{formatMoney(dep.m_na_cytg)}</td>

               <td className={classes.cantObs} >{dep.c_a_total}</td>
               <td className={classes.montos}  >{formatMoney(dep.m_a_total)}</td>
               <td className={classes.cantObs} >{dep.c_na_total}</td>
               <td className={classes.montos}  >{formatMoney(dep.m_na_total)}</td>
             </tr>
          )
          }   
          { report && report.sum_rows &&
            <tr> 
              <td style={{fontWeight: "bold"}}> Totales</td> 
              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_asf}</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ formatMoney(report.sum_rows.m_asf)}</td>
              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_a_asf }</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ formatMoney(report.sum_rows.m_a_asf )}</td>
              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_na_asf }</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ formatMoney(report.sum_rows.m_na_asf )}</td>

              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_asenl}</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ formatMoney(report.sum_rows.m_asenl)}</td>
              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_a_asenl }</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ formatMoney(report.sum_rows.m_a_asenl )}</td>
              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_na_asenl }</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ formatMoney(report.sum_rows.m_na_asenl )}</td>

              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_cytg}</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ formatMoney(report.sum_rows.m_cytg)}</td>
              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_a_cytg }</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ formatMoney(report.sum_rows.m_a_cytg )}</td>
              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_na_cytg }</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ formatMoney(report.sum_rows.m_na_cytg )}</td>
              
              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_a_total }</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ formatMoney(report.sum_rows.m_a_total )}</td>
              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_na_total }</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ formatMoney(report.sum_rows.m_na_total )}</td>
            </tr>
          }          
          
        </tbody>
      </table>
    </div>
  );
};