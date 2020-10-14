/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { range } from 'src/shared/utils/range.util';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux'
import { resolvePermission } from 'src/shared/utils/permissions.util';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import NumberFormat from 'react-number-format';

type Props = {
  loading: boolean,
  loadReport56Action: Function,
  report: any,
  divisionId: number,
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
        border: '1px solid rgba(0,0,0,0.02)',
        padding: '5px 10px;',
      },
      '& td': {
        border: 'solid 1px #fafafa',
        padding: '3px 10px',
      },
      '& tr:nth-child(odd)': {
        borderRigth: '1px solid rgba(0,0,0,0.02)',
        background: 'rgba(0,0,0,0.03)',
      },
    },
    tableWhole: {
      borderSpacing: '0px !important',
      border: 'solid 1px #fafafa',
      width: '100%',
    },
    titrow: {
      background: '#fff !important',
      boxShadow: '0 2px 15px 0 rgba(0,0,0,0.15)',
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

export const Report58 = (props: Props) => {
  const {
    report,
    // loading,
    loadReport56Action,
    divisionId,
  } = props;
  const [yearEnd, setYearEnd] = useState<any>('2020');
  const [yearIni, setYearIni] = useState<any>('2012');
  const permissions: any = useSelector((state: any) => state.authSlice);
  const isVisible = (app: string): boolean => resolvePermission(permissions?.claims?.authorities, app);
  const optionsFiscals = [
    { value: 'SFP',   label: 'SFP',   tk: 'SFPR' },
    { value: 'ASF',   label: 'ASF',   tk: 'ASFR' },
    { value: 'ASENL', label: 'ASENL', tk: 'ASER' },
    { value: 'CYTG',  label: 'CYTG',  tk: 'CYTR' },
  ].filter( option => isVisible( option.tk ));
  const [fiscal , setFiscal ] = useState<any>(optionsFiscals.length ? optionsFiscals[0].value : null );
  const [entidad , setEntidad ] = useState<any>(fiscal);
  useEffect(() => {
    if( divisionId || divisionId === 0 ){
      loadReport56Action({ ejercicio_fin: yearEnd, ejercicio_ini: yearIni, fiscal: fiscal, reporte_num: 'reporte58', division_id: divisionId });
    }
    setEntidad(fiscal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearEnd, yearIni, fiscal, divisionId]);
  const classes = useStyles();
  return (
    <div className={classes.Container}>
      <div>
        <span className={classes.titlereport}>Reporte Ejecutivo Concentrado de Observaciones por Clasificación de Observación CyTG</span>
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
        <div className={classes.selectYearContainer}>
          <InputLabel className={classes.labelSelectYear}>Ente Fiscalizador:</InputLabel>
          <Select
            labelId="fiscal"
            value={fiscal}
            onChange={(e)=> {setFiscal(e.target.value);}}
          >
            {optionsFiscals.map((item) => {
              return (
                <MenuItem
                  value={item.value}
                >
                  {item.label}
                </MenuItem>
              );
            })}
          </Select>
        </div>

      </div>

      <ReactHTMLTableToExcel
         id="downloadTableXlsButton"
         className="downloadTableXlsButton"
         table="table-to-xls"
         filename="Reporte"
         sheet="tablexls"
         buttonText="Descargar Reporte"
      />
      <table className={classes.tableWhole} id="table-to-xls"> 
        <tbody className={classes.tableReports} >
          <tr >    
            <th colSpan={4}> {entidad} </th> 
          </tr> 
          <tr className={classes.titrow}>    
            <th >Secretaría/Entidad/Municipio</th> 
            <th >Clasificación</th> 
            <th >Cantidad Obs.</th> 
            <th >Monto</th> 
          </tr> 
          {report && report.data_rows && report.data_rows.map((dep: any) =>
            <tr> 
              <td>{dep.dep}</td> 
              <td style={{textAlign: 'center'}} >{dep.clasif_name}</td>
              <td className={classes.cantObs} >{dep.c_obs}</td>
              <td className={classes.montos} >{ <NumberFormat value={dep.monto} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> }</td>
            </tr>
          )
          }   
          { report && report.sum_rows &&
            <tr> 
              <td style={{fontWeight: "bold"}} > Totales</td> 
              <td style={{fontWeight: "bold", textAlign: "center"}}></td>
              <td style={{fontWeight: "bold", textAlign: "center"}}> { report.sum_rows.c_obs }</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}> { <NumberFormat value={ report.sum_rows.monto.valueOf() } displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</td>
            </tr>
          }           
          
        </tbody>
      </table>
    </div>
  );
};
