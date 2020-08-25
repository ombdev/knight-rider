from flask_restplus import Resource, fields
from flask import request
from psycopg2 import Error as pg_err

from genl.restplus import api
from dal import reporte_55
from misc.helperpg import ServerError
from misc.helper import verify_token


reporte_55_ns_captions = {
    'dependencia':          'Secretaría / Entidad / Municipio',
    'cant_obs':             'Tipo de Observacion',
    'monto_aten':           'Monto (solventados)',
    'cant_obs_aten':        'Cantidad observada (solventados)',
    'monto_aten':           'Monto (solventados)',
    'cant_obs_no_aten':     'Cantidad observada (solventados)',
    'monto_no_aten':        'Monto (solventados)',
    'ejercicio_ini':        'Ejercicio (desde)',
    'ejercicio_fin':        'Ejercicio (hasta)',
}

ns = api.namespace("reporte_55", description="Concentrado de Observaciones por Ente Fiscalizador y Entidad del Informe de Resultados")

data_row = api.model('Data row (Reporte 55)', {
    'dep':         fields.String(description=reporte_55_ns_captions['dependencia']),
    'c_asf':       fields.Integer(description=reporte_55_ns_captions['cant_obs']),           
    'm_asf':       fields.Float(description=reporte_55_ns_captions['monto_aten']),
    'c_na_asf':    fields.Integer(description=reporte_55_ns_captions['cant_obs_no_aten']),
    'm_na_asf':    fields.Float(description=reporte_55_ns_captions['monto_no_aten']),
    'c_a_asf':     fields.Integer(description=reporte_55_ns_captions['cant_obs_aten']),
    'm_a_asf':     fields.Float(description=reporte_55_ns_captions['monto_aten']),
    'c_asenl':     fields.Integer(description=reporte_55_ns_captions['cant_obs']),           
    'm_asenl':     fields.Float(description=reporte_55_ns_captions['monto_aten']),
    'c_na_asenl':  fields.Integer(description=reporte_55_ns_captions['cant_obs_no_aten']),
    'm_na_asenl':  fields.Float(description=reporte_55_ns_captions['monto_no_aten']),
    'c_a_asenl':   fields.Integer(description=reporte_55_ns_captions['cant_obs_aten']),
    'm_a_asenl':   fields.Float(description=reporte_55_ns_captions['monto_aten']),
    'c_cytg':      fields.Integer(description=reporte_55_ns_captions['cant_obs']),           
    'm_cytg':      fields.Float(description=reporte_55_ns_captions['monto_aten']),
    'c_na_cytg':   fields.Integer(description=reporte_55_ns_captions['cant_obs_no_aten']),
    'm_na_cytg':   fields.Float(description=reporte_55_ns_captions['monto_no_aten']),
    'c_a_cytg':    fields.Integer(description=reporte_55_ns_captions['cant_obs_aten']),
    'm_a_cytg':    fields.Float(description=reporte_55_ns_captions['monto_aten']),
    'c_na_total':  fields.Integer(description=reporte_55_ns_captions['cant_obs_no_aten']),
    'm_na_total':  fields.Float(description=reporte_55_ns_captions['monto_no_aten']),
    'c_a_total':   fields.Integer(description=reporte_55_ns_captions['cant_obs_aten']),
    'm_a_total':   fields.Float(description=reporte_55_ns_captions['monto_aten']),
})

report = api.model('Reporte 55', {
    'data_rows': fields.List(fields.Nested(data_row)),
    'ignored_audit_ids': fields.List(fields.Integer()),
})


@ns.route('/')
@ns.response(400, 'Client error')
@ns.response(500, 'Server error')
@ns.response(401, 'Unauthorized')
class Reporte55(Resource):

    @ns.marshal_with(report)
    @ns.param('ejercicio_ini', reporte_55_ns_captions['ejercicio_ini'], required=True)
    @ns.param('ejercicio_fin', reporte_55_ns_captions['ejercicio_fin'], required=True)
    def get(self):
        ''' To fetch an instance of Reporte 55 '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        ejercicio_ini = request.args.get('ejercicio_ini', '2000')
        ejercicio_fin = request.args.get('ejercicio_fin', '2040')

        try:
            rep = reporte_55.get(ejercicio_ini, ejercicio_fin)
        except ServerError as err:
            ns.abort(500, message=err)
        except Exception as err:
            ns.abort(400, message=err)
        
        return rep
