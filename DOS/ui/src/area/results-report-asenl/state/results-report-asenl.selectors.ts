import { createSelector } from 'reselect';
import { FISCALS } from 'src/shared/constants/observations.constants';
import { range } from 'src/shared/utils/range.util';
import {
  resultsReportASENLReducer,
  ResultsReportASENL,
} from './results-report-asenl.reducer';

const sliceSelector = (state: any) =>
  state[resultsReportASENLReducer.sliceName];

export const reportsSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.reports
);

export const catalogSelector = createSelector(sliceSelector, (slice: any) => {
  const audits =
    slice && slice.catalog && slice.catalog.audits
      ? slice.catalog.audits.sort((a: any, b: any) => b.id - a.id)
      : [];
  return {
    ...slice.catalog,
    audits,
  };
});

export const reportSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: any): ResultsReportASENL | null => {
    const { report } = slice;
    if (!report) {
      return null;
    }
    return report;
  }
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.loading
);

export const reportsCatalogSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: any, catalog: any) =>
    catalog &&
    catalog.divisions &&
    slice.reports &&
    Array.isArray(slice.reports) &&
    slice.reports.map((report: ResultsReportASENL) => {
      const dependencies =
        catalog &&
        catalog.audits &&
        report.auditoria_id &&
        catalog.audits.find((item: any) => item.id === report.auditoria_id)
          ? (
              catalog.audits.find(
                (item: any) => item.id === report.auditoria_id
              ) || {}
            ).dependency_ids
              .map((dependency: number) =>
                catalog.dependencies.find((item: any) => item.id === dependency)
              )
              .map((item: any) => item.title)
              .join(', ')
          : '';
      let direccion_id_title: any = catalog.divisions.find(
        (item: any) => item.id === report.direccion_id
      );
      let auditoria_id_title: any = catalog.audits.find(
        (item: any) => item.id === report.auditoria_id
      );
      direccion_id_title = direccion_id_title ? direccion_id_title.title : null;
      auditoria_id_title = auditoria_id_title ? auditoria_id_title.title : null;
      return {
        ...report,
        direccion_id_title,
        auditoria_id_title,
        dependencies,
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.paging
);

export const observationPreAuditIdSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.observacion_pre.auditoria_id
);

export const pagingPreObsSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.observacion_pre.paging
);

export const preObservationsSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: any, catalog: any) => {
    const { observations } = slice.observacion_pre;
    return observations && catalog.audits && catalog.audits.length
      ? observations.map((item: any) => {
          const audit = catalog.audits.find(
            (audit_item: any) => audit_item.id === item.auditoria_id
          );
          return {
            id: item.id,
            observation: `Observación ID: ${item.id} - Auditoría ${item.auditoria_id} : ${audit.title} - Clave Observación: ${item.num_observacion}`,
            direccion_id: item.direccion_id,
            programa_social_id: item.programa_social_id,
            auditoria_id: item.auditoria_id,
            observacion: item.observacion,
            monto_observado: item.monto_observado,
          };
        })
      : [];
  }
);

export const isLoadingPreSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.observacion_pre.loading
);

export const canLoadMoreSelector = createSelector(
  sliceSelector,
  (slice: any) => {
    const { page, per_page, pages, count } = slice.observacion_pre.paging;
    return !(count && page === pages && per_page * pages >= count);
  }
);

export const auditIdSelector = createSelector(sliceSelector, (slice: any) => {
  const { auditoria_id } = slice.observacion_pre;
  return auditoria_id;
});

export const filterOptionsSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.filters
);

export const filterSelector = createSelector(
  sliceSelector,
  (slice: any) => {
    const { catalog } = slice;
    return [
      {
        abbr: 'DIR',
        type: 'dropdown',
        param: 'direccion_id',
        name: '(DIR) Dirección',
        options: catalog && catalog.divisions ? [...catalog.divisions.map((item: any) => { return { id: item.id, value: item.title } })] : [],
      },
      {
        abbr: 'AUD',
        type: 'dropdown',
        param: 'auditoria_id',
        name: '(AUD) Auditoría',
        options: catalog && catalog.audits ? [...catalog.audits.filter((audit: any) => audit.org_fiscal_id === FISCALS.ASENL).map((item: any) => { return { id: item.id, value: item.title } })] : [],
      },
      {
        abbr: 'CLO',
        type: 'text',
        param: 'num_observacion',
        name: '(CLO) Clave o Num. de observacion',
      },
      {
        abbr: 'ACP',
        type: 'dropdown',
        param: 'anio_cuenta_pub',
        name: '(ACP) Año de la cuenta pública',
        options: range(2000, new Date().getFullYear()).map((year: number) => { return { id: year, value: year } }),
      },
      {
        abbr: 'DEP',
        type: 'dropdown',
        param: 'dependencia_id',
        name: '(DEP) Dependencia',
        options: catalog && catalog.dependencies ? [...catalog.dependencies.map((item: any) => { return { id: item.id, value: item.title } })] : [],
      },
      {
        abbr: 'TO',
        type: 'dropdown',
        param: 'tipo_observacion_id',
        name: '(TO) Tipo de observación preliminar',
        options: catalog && catalog.observation_types ? [...catalog.observation_types.map((item: any) => { return { id: item.id, value: item.title } })] : [],
      },
      {
        abbr: 'O',
        type: 'text',
        param: 'observacion_final',
        name: '(O) Observación final (análisis)',
      },
    ];
  }
);
