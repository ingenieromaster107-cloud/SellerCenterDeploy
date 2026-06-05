import 'dayjs/locale/es';
import 'dayjs/locale/en';

import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(updateLocale);

dayjs.updateLocale('es', {
  months: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthsShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  weekdays: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  weekdaysShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
  weekdaysMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
});
