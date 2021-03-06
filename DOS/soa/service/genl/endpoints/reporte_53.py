from flask_restplus import Resource, fields
from flask import request
from psycopg2 import Error as pg_err

from genl.restplus import api
from dal import reporte_53
from misc.helperpg import ServerError
from misc.helper import verify_token, get_auth


reporte_53_ns_captions = {
    'dependencia': 'Secretaría / Entidad / Municipio',
    'ejercicio': 'Ejercicio',
    'cant_obs_asf': 'Cant. Obs. (ASF)',
    'monto_asf': 'Monto (ASF)',
    'cant_obs_sfp': 'Cant. Obs. (SFP)',
    'monto_sfp': 'Monto (SFP)',
    'cant_obs_asenl': 'Cant. Obs. (ASENL)',
    'monto_asenl': 'Monto (ASENL)',
    'cant_obs_cytg': 'Cant. Obs. (CyTG)',
    'monto_cytg': 'Monto (CyTG)',
    'ejercicio_ini': 'Ejercicio (desde)',
    'ejercicio_fin': 'Ejercicio (hasta)',
    'division_id': 'Id de la direccion del usuario',
}

ns = api.namespace("reporte_53", description="Servicios para los reportes 52 y 53")

data_row = api.model('Data row (Reporte 53)', {
    'dep': fields.String(description=reporte_53_ns_captions['dependencia']),
    'ej': fields.Integer(description=reporte_53_ns_captions['ejercicio']),
    'c_asf': fields.Integer(description=reporte_53_ns_captions['cant_obs_asf']),
    'm_asf': fields.Float(description=reporte_53_ns_captions['monto_asf']),
    'c_sfp': fields.Integer(description=reporte_53_ns_captions['cant_obs_sfp']),
    'm_sfp': fields.Float(description=reporte_53_ns_captions['monto_sfp']),
    'c_asenl': fields.Integer(description=reporte_53_ns_captions['cant_obs_asenl']),
    'm_asenl': fields.Float(description=reporte_53_ns_captions['monto_asenl']),
    'c_cytg': fields.Integer(description=reporte_53_ns_captions['cant_obs_cytg']),
    'm_cytg': fields.Float(description=reporte_53_ns_captions['monto_cytg']),
})

report = api.model('Reporte 53', {
    'data_rows': fields.List(fields.Nested(data_row)),
    'ignored_audit_ids': fields.List(fields.Integer()),
})


@ns.route('/')
@ns.response(400, 'Client error')
@ns.response(500, 'Server error')
@ns.response(401, 'Unauthorized')
class Reporte53(Resource):

    @ns.marshal_with(report)
    @ns.param('ejercicio_ini', reporte_53_ns_captions['ejercicio_ini'], required=True)
    @ns.param('ejercicio_fin', reporte_53_ns_captions['ejercicio_fin'], required=True)
    @ns.param('division_id',   reporte_53_ns_captions['division_id'],   required=True)
    def get(self):
        ''' Obtiene un arreglo con Entidad, Ejercicio, Cant Obs y Monto de los Informe de Resultados para todos los entes '''
        try:
            verify_token(request.headers)
            auth = get_auth(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        ejercicio_ini = request.args.get('ejercicio_ini', '2000')
        ejercicio_fin = request.args.get('ejercicio_fin', '2040')
        division_id   = request.args.get('division_id',   '0')

        try:
            rep = reporte_53.get(ejercicio_ini, ejercicio_fin, division_id, auth)
        except ServerError as err:
            ns.abort(500, message=err)
        except Exception as err:
            ns.abort(400, message=err)
        
        return rep
