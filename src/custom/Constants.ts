import {Concept, Month} from './../app/interfaces';
import { environment } from 'src/environments/environment';

class Constants {
  private environment = 'production'; // local | production
  private base_url = this.environment === 'local' ? 'http://localhost:4200/' : 'https://business-choice.herokuapp.com/';

  private socket_server = {
    local: 'http://localhost:4200',
    production: 'https://business-choice.herokuapp.com/'
  };

  private routes = { banking_entities_img: '/assets/img/banking_entities/' };

  private validationErrorMessages = {
      required: 'Campo requerido',
      mismatch: 'El campo no coincide',
      numeric: 'El campo debe ser un valor numérico'
  };

  private months: Month[] = [
    {name: 'Enero', key: 'january'},
    {name: 'Febrero', key: 'february'},
    {name: 'Marzo', key: 'march'},
    {name: 'Abril', key: 'april'},
    {name: 'Mayo', key: 'may'},
    {name: 'Junio', key: 'june'},
    {name: 'Julio', key: 'july'},
    {name: 'Agosto', key: 'august'},
    {name: 'Septiembre', key: 'september'},
    {name: 'Octubre', key: 'october'},
    {name: 'Noviembre', key: 'november'},
    {name: 'Diciembre', key: 'december'}
  ];

  private income_types: Concept[]  = [
    {id: 1, name: 'Inversion', tax: 0},
    {id: 2, name: 'Capital', tax: 0},
    {id: 3, name: 'Prestamos', tax: 0},
    {id: 4, name: 'Ventas al contado', tax: 11},
    {id: 5, name: 'Credito a cobrar', tax: 11},
    {id: 6, name: 'Cobro por servicios', tax: 11}
  ];

  private egress_categories: Concept[] = [
    {id: 1, name: 'Egresos de consumo'},
    {id: 2, name: 'Egresos Operativos'}
  ];

  private egress_types: Concept[] = [
    {id: 1, parent_id: 1, name : 'Alquiler', tax: 21},
    {id: 2, parent_id: 1, name : 'Luz', tax: 11},
    {id: 3, parent_id: 1, name : 'Agua', tax: 11},
    {id: 4, parent_id: 1, name : 'Teléfono', tax: 11},
    {id: 6, parent_id: 2, name : 'Maquinarias', tax: 11},
    {id: 7, parent_id: 2, name : 'Muebles y Equipos', tax: 11},
    {id: 8, parent_id: 2, name : 'Deudas por pagar', tax: 0},
    {id: 9, parent_id: 2, name : 'Comp. Mercaderia', tax: 0},
    {id: 10, parent_id: 2, name : 'Comp. Mat prima', tax: 0},
    {id: 11, parent_id: 2, name : 'Marketing y publicidad', tax: 11},
    {id: 12, parent_id: 2, name : 'Salarios admin.', tax: 0},
    {id: 13, parent_id: 2, name : 'Comisiones', tax: 11}
  ];

  getRoute(k = '', c = '') { return (this.routes[k] || '').concat(c); }
  baseUrl(uri = '') { return this.base_url.concat(uri); }
  getMonths() { return this.months; }
  getIncomeTypes(): Concept[] { return this.income_types; }
  getEgressCategories(): Concept[] { return this.egress_categories; }
  getEgressTypes(): Concept[] { return this.egress_types; }
  getEnvironment(): string { return this.environment; }
  getValidationErrorMessages(): any { return this.validationErrorMessages; }
}

export default new Constants();
