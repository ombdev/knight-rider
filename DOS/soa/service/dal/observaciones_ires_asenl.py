import math

from dal.helper import run_stored_procedure, exec_steady
from dal.entity import (
    page_entities_join_tables,
    count_entities_join_tables,
    get_joins_and_conditions,
    fetch_entity,
    delete_entity,
)
from misc.helperpg import EmptySetError

def _alter_observation(**kwargs):
    """Calls database function in charge of creation and edition of an observation (ASENL ires)"""

    sql = """SELECT * FROM alter_observacion_ires_asenl(
        {}::integer,
        {}::integer,
        '{}'::character varying,
        '{}'::date,
        {}::integer,
        '{}'::character varying,
        '{}'::text,
        {}::boolean,
        '{}'::character varying,
        {}::double precision,
        '{}'::text,
        {}::integer,
        {}::double precision,
        '{}'::text,
        {}::integer,
        {}::double precision,
        {}::double precision,
        {}::double precision,
        '{}'::integer[],
        '{}'::text,
        '{}'::character varying,
        '{}'::date,
        '{}'::date,
        '{}'::character varying,
        '{}'::date,
        '{}'::date,
        '{}'::character varying,
        '{}'::date,
        '{}'::text,
        '{}'::character varying,
        '{}'::date,
        '{}'::character varying,
        '{}'::character varying,
        {}::integer)
        AS result( rc integer, msg text )""".format(
            kwargs['id'],
            kwargs['observacion_pre_id'],
            kwargs['num_oficio_of'].replace("'", "''"),
            kwargs['fecha_publicacion'],
            kwargs['tipo_observacion_id'],
            kwargs['num_observacion'].replace("'", "''"),
            kwargs['observacion_final'].replace("'", "''"),
            kwargs['observacion_reincidente'],
            kwargs['anios_reincidencia'],
            kwargs['monto_observado'],
            kwargs['compartida_observacion'].replace("'", "''"),
            kwargs['compartida_tipo_observacion_id'],
            kwargs['compartida_monto'],
            kwargs['comentarios'].replace("'", "''"),
            kwargs['clasif_final_cytg'],
            kwargs['monto_solventado'],
            kwargs['monto_pendiente_solventar'],
            kwargs['monto_a_reintegrar'],
            str(set(kwargs['acciones'])),
            kwargs['recomendaciones'].replace("'", "''"),
            kwargs['num_oficio_recomendacion'].replace("'", "''"),
            kwargs['fecha_oficio_recomendacion'],
            kwargs['fecha_vencimiento_enviar_asenl'],
            kwargs['num_oficio_dependencia'].replace("'", "''"),
            kwargs['fecha_oficio_dependencia'],
            kwargs['fecha_vencimiento_interna_cytg'],
            kwargs['num_oficio_resp_dependencia'].replace("'", "''"),
            kwargs['fecha_acuse_resp_dependencia'],
            kwargs['resp_dependencia'].replace("'", "''"),
            kwargs['num_oficio_enviar_resp_asenl'].replace("'", "''"),
            kwargs['fecha_oficio_enviar_resp_asenl'],
            kwargs['unidad_investigadora'].replace("'", "''"),
            kwargs['num_vai'].replace("'", "''"),
            kwargs['tipificacion_id'],
        )

    rcode, rmsg = run_stored_procedure(sql)
    if rcode < 1:
        if kwargs['id'] != 0:
            raise EmptySetError(rmsg)
        else:
            raise Exception(rmsg)
    else:
        id = rcode

    ent = fetch_entity("observaciones_ires_asenl", id)
    return add_observacion_data(ent)


def create(**kwargs):
    ''' Creates an observation entity '''
    kwargs['id'] = 0
    return _alter_observation(**kwargs)


def read(id):
    ''' Fetches an observation entity '''
    ent = fetch_entity("observaciones_ires_asenl", id)
    return add_observacion_data(ent)


def update(id, **kwargs):
    ''' Updates an observation entity '''
    kwargs['id'] = id
    return _alter_observation(**kwargs)


def delete(id):
    ''' Deletes an observation entity '''
    ent = delete_entity("observaciones_ires_asenl", id)
    return add_observacion_data(ent)


def read_per_page(offset, limit, order_by, order, search_params, per_page, page, indirect_search_params):
    ''' Reads a page of observations '''
    
    # Some validations
    offset = int(offset)
    if offset < 0:
        raise Exception("Value of param 'offset' should be >= 0")
    
    limit = int(limit)
    if limit < 1:
        raise Exception("Value of param 'limit' should be >= 1")

    order_by_values = (
        'id', 'tipo_observacion_id', 'observacion_final', 'num_observacion'
    )
    if order_by not in order_by_values:
        raise Exception("Value of param 'order_by' should be one of the following: " + str(order_by_values))
    
    order_values = ('ASC', 'DESC', 'asc', 'desc')
    if order not in order_values:
        raise Exception("Value of param 'order' should be one of the folowing: " + str(order_values))

    per_page = int(per_page)
    page = int(page)
    if per_page < 1 or page < 1:
        raise Exception("Value of params 'per_page' and 'page' should be >= 1")

    # Counting total number of items and fetching target page
    table = 'observaciones_ires_asenl'
    join_details = {
        'direccion_id'   : ('observaciones_pre_asenl',    'id',           table,                     'observacion_pre_id', '',             False),
        'auditoria_id'   : ('observaciones_pre_asenl',    'id',           table,                     'observacion_pre_id', '',             False),
        'dependencia_id' : ('auditoria_dependencias',     'auditoria_id', 'observaciones_pre_asenl', 'auditoria_id',       'auditoria_id', False),
        'anio_cuenta_pub': ('auditoria_anios_cuenta_pub', 'auditoria_id', 'observaciones_pre_asenl', 'auditoria_id',       'auditoria_id', False),
    }
    selects = ', observaciones_pre_asenl.direccion_id, observaciones_pre_asenl.auditoria_id'
    joins, conditions, join_list = get_joins_and_conditions(indirect_search_params, join_details)
    join = ' JOIN observaciones_pre_asenl ON observaciones_pre_asenl.id = {}.observacion_pre_id'.format(table)
    if join not in join_list:
        joins += join

    total_items = count_entities_join_tables(table, search_params, joins, conditions)
    if total_items > limit:
        total_items = limit
    
    total_pages = math.ceil(total_items / per_page)

    whole_pages_offset = per_page * (page - 1)
    if whole_pages_offset >= total_items:
        return [], total_items, total_pages
    
    target_items = total_items - whole_pages_offset
    if target_items > per_page:
        target_items = per_page

    entities = page_entities_join_tables(
        table, offset + whole_pages_offset, target_items, order_by, order, search_params, selects, joins, conditions
    )

    return (entities, total_items, total_pages)


def get_catalogs(table_name_list):
    ''' Fetches values and captions from a list of tables. These pairs can be used on input screens '''
    fields_d = {}

    for table in table_name_list:
        values_l = []
        
        if table == 'audits':
            
            sql = '''
                SELECT aud.id, dep.dependencia_id
                FROM audits AS aud
                JOIN auditoria_dependencias AS dep ON aud.id = dep.auditoria_id
                WHERE NOT aud.blocked;
            '''

            dependencias = exec_steady(sql)
            d = transform_list_into_dict(dependencias)
            
            sql = '''
                SELECT aud.id, ani.anio_cuenta_pub
                FROM audits AS aud
                JOIN auditoria_anios_cuenta_pub AS ani ON aud.id = ani.auditoria_id
                WHERE NOT aud.blocked;
            '''

            anios = exec_steady(sql)
            a = transform_list_into_dict(anios)

            sql = '''
                SELECT id, title, org_fiscal_id, direccion_id
                FROM audits
                WHERE NOT blocked
                ORDER BY title;
            '''

            rows = exec_steady(sql)

            for row in rows:
                r = dict(row)
                r['dependency_ids'] = d[row[0]]
                r['years'] = a[row[0]]
                values_l.append(r)

        elif table == 'dependencies':
            sql = '''
                SELECT dep.id, dep.title, dep.description, clasif.title as clasif_title
                FROM dependencies as dep
                JOIN dependencia_clasif AS clasif ON dep.clasif_id = clasif.id
                ORDER BY dep.id;
            '''.format(table)

            rows = exec_steady(sql)
            for row in rows:
                values_l.append(dict(row))
        
        elif table == 'clasifs_internas_cytg':
            sql = '''
                SELECT clas.direccion_id, clas.sorting_val, clas.title
                FROM fiscals AS fisc
                JOIN clasifs_internas_cytg AS clas ON fisc.id = clas.org_fiscal_id
                WHERE fisc.title = '{}'
                ORDER BY clas.direccion_id, clas.sorting_val;
            '''.format('ASENL')

            rows = exec_steady(sql)

            first_dir = 0

            for row in rows:
                if row[0] != first_dir:
                    clasif = {
                        'direccion_id': row[0],
                        'clasifs_internas_pairs': [{
                            'sorting_val': row[1],
                            'title': row[2]
                        }]
                    }
                    values_l.append(clasif)
                else:
                    clasif['clasifs_internas_pairs'].append({
                        'sorting_val': row[1],
                        'title': row[2]
                    })
                
                first_dir = row[0]

        else:
            sql = '''
                SELECT *
                FROM {}
                ORDER BY id;
            '''.format(table)

            rows = exec_steady(sql)
            for row in rows:
                values_l.append(dict(row))
        
        fields_d[table] = values_l

    return fields_d


def add_observacion_data(ent):
    attributes = set([
        'id',
        'observacion_pre_id',
        'num_oficio_of',
        'fecha_publicacion',
        'tipo_observacion_id',
        'num_observacion',
        'observacion_final',
        'observacion_reincidente',
        'anios_reincidencia',
        'monto_observado',
        'compartida_observacion',
        'compartida_tipo_observacion_id',
        'compartida_monto',
        'comentarios',
        'clasif_final_cytg',
        'monto_solventado',
        'monto_pendiente_solventar',
        'monto_a_reintegrar',
        'recomendaciones',
        'num_oficio_recomendacion',
        'fecha_oficio_recomendacion',
        'fecha_vencimiento_enviar_asenl',
        'num_oficio_dependencia',
        'fecha_oficio_dependencia',
        'fecha_vencimiento_interna_cytg',
        'num_oficio_resp_dependencia',
        'fecha_acuse_resp_dependencia',
        'resp_dependencia',
        'num_oficio_enviar_resp_asenl',
        'fecha_oficio_enviar_resp_asenl',
        'unidad_investigadora',
        'num_vai',
        'tipificacion_id',
    ])
    mod_ent = {attr: ent[attr] for attr in attributes}

    sql = '''
        SELECT *
        FROM acciones_obs_asenl
        WHERE observacion_id = {}
        ORDER BY accion_id ASC;
    '''.format(mod_ent['id'])
    
    rows = exec_steady(sql)
    
    mod_ent['acciones'] = []
    for row in rows:
        mod_ent['acciones'].append(row[1])

    # Add obs preliminar data
    add_preliminar_data(mod_ent)

    return mod_ent


def add_preliminar_data(ent):
    if ent['observacion_pre_id'] <= 0:
        ent['direccion_id'] = None
        ent['auditoria_id'] = None
    else:
        sql = '''
            SELECT direccion_id, auditoria_id
            FROM observaciones_pre_asenl
            WHERE id = {}
            AND NOT blocked;
        '''.format(ent['observacion_pre_id'])

        try:
            rows = exec_steady(sql)
            row = dict(rows[0])
            ent['direccion_id'] = row['direccion_id']
            ent['auditoria_id'] = row['auditoria_id']
        except Exception as err:
            ent['direccion_id'] = None
            ent['auditoria_id'] = None


def transform_list_into_dict(input_list):
    output_dict = {}
    
    for i in input_list:
        if i[0] not in output_dict:
            output_dict[i[0]] = [i[1]]
        else:
            output_dict[i[0]].append(i[1])

    return output_dict
