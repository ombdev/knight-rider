/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import MaterialTable, { MTableToolbar } from 'material-table';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { PERMISSIONS } from 'src/shared/constants/permissions.contants';
import { Audit } from '../state/audits.reducer';

type Props = {
  audits: Array<Audit>,
  loadAuditsAction: Function,
  removeAuditAction: Function,
  loading: boolean,
  paging: any,
  isAllowed: Function,
};

export const AuditTable = (props: Props) => {
  const {
    audits,
    loadAuditsAction,
    removeAuditAction,
    loading,
    paging,
    isAllowed,
  } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  const customSort = () => 0;
  const draggable: boolean = false;
  const sorting: boolean = false;
  useEffect(() => {
    loadAuditsAction({ per_page: paging.per_page, order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <MaterialTable
      title="Auditorías"
      onOrderChange={(orderBy: number, orderDirection: 'asc' | 'desc') => {
        loadAuditsAction({
          ...paging,
          order: orderDirection,
          order_by: 'id',
        });
      }}
      columns={[
        {
          title: 'ID',
          field: 'id',
          defaultSort: order,
          customSort,
          sorting: !sorting,
        },
        {
          title: 'Clave de Auditoría',
          field: 'title',
          sorting,
        },
        {
          title: 'Órgano Fiscalizador',
          field: 'fiscal',
          sorting,
        },
        {
          title: 'Dirección',
          field: 'division',
          sorting,
        },
        {
          title: 'Dependencia(s)',
          field: 'dependencies',
          sorting,
          customSort,
        },
        {
          title: 'Año(s)',
          field: 'years',
          sorting,
        },
      ]}
      data={audits || []}
      options={{
        draggable,
        initialPage: 1, // @todo include this settings value in a CONSTANTS file
        paging: true,
        pageSize: per_page,
        thirdSortClick: false,
        actionsColumnIndex: 5, // @todo this shouldn't be hardcoded, calculate using columns.lenght
        emptyRowsWhenPaging: false,
        maxBodyHeight: 500,
        rowStyle: (_data: any, index: number, _level: number) => {
          return index % 2
            ? { backgroundColor: 'rgb(204,204,204,0.3)' }
            : {};
        }
      }}
      components={{
        Pagination: (componentProps) => {
          return (
            <TablePagination
              {...componentProps}
              count={count}
              page={page - 1 || 0}
              rowsPerPage={per_page}
              rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
              onChangePage={(event, currentPage: number) => {
                loadAuditsAction({
                  per_page,
                  page: currentPage + 1,
                  order,
                  // offset: nextPage * 1,
                });
              }}
              onChangeRowsPerPage={(event: any) => {
                componentProps.onChangeRowsPerPage(event);
                loadAuditsAction({
                  per_page: event.target.value,
                });
              }}
            />
          );
        },
        Toolbar: (componentProps) => {
          return (
            <div>
              <MTableToolbar {...componentProps} />
              <div style={{ padding: '0px 10px', textAlign: 'right' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PostAddIcon />}
                  size="medium"
                  onClick={() => history.push('/audit/create')}
                  disabled={!isAllowed('AUD', PERMISSIONS.CREATE)}
                >
                  Agregar Auditoría
                </Button>
              </div>
            </div>
          );
        },
      }}
      actions={[
        {
          icon: 'edit',
          tooltip: 'Editar Auditoría',
          onClick: (event, rowData: any) =>
            history.push(`/audit/${rowData.id}/edit`),
          disabled: !isAllowed('AUD', PERMISSIONS.UPDATE),
        },
        {
          icon: 'delete',
          tooltip: 'Eliminar Auditoría',
          onClick: (event, rowData: any) => {
            if (
              // eslint-disable-next-line no-restricted-globals
              confirm(
                `¿Realmente quieres eliminar la Auditoría ${rowData.id}?\n Esta acción es irreversible`,
              )
            ) {
              removeAuditAction(rowData.id);
            }
          },
          disabled: !isAllowed('AUD', PERMISSIONS.DELETE),
        },
      ]}
      isLoading={loading}
    />
  );
};
