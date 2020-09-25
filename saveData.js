 // variables para el guardado temporal de los datos ingresados por el usuario en esta etapa
 var a_ids = [];
 var a_valor_ini = [];

function descargarArchivo(contenidoEnBlob, nombreArchivo) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = nombreArchivo || 'archivo.dat';
        var clicEvent = new MouseEvent('click', {
            'view': window,
                'bubbles': true,
                'cancelable': true
        });
        save.dispatchEvent(clicEvent);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(contenidoEnBlob);
};

//Función de ayuda: reúne los datos a exportar en un solo objeto
function obtenerDatos() {
    return {
        enuI: document.getElementById('enun_inicial').value,
        enuF: document.getElementById('enun_final').value,
        fecha: (new Date()).toLocaleDateString()
    };
};

//Genera un objeto Blob con los datos en un archivo TXT
function generarTexto(datos) {
    var texto = [];
    var tipo_dato = ["Entero", "Real", "Cadena"];
    var tipo_id = ["Variable", "Constante"];
    texto.push('@analisis\n@enunciado @inicial\n@{');
    texto.push(datos.enuI);
    texto.push('@}\n');
    texto.push('@r0\n@{');
    texto.push(respuestas_temp1[0]);
    texto.push('@}\n');
    texto.push('@r1\n@{');
    texto.push(respuestas_temp1[1]);
    texto.push('@}\n');
    texto.push('@r2\n@{');
    texto.push(respuestas_temp1[2]);
    texto.push('@}\n');
    texto.push('@r3\n@{');
    texto.push(respuestas_temp1[3]);
    texto.push('@}\n');
    texto.push('@r4\n@{');
    texto.push(respuestas_temp1[4]);
    texto.push('@}\n');
    texto.push('@r5\n@{');
    texto.push(respuestas_temp1[5]);
    texto.push('@}\n');
    texto.push('@r6\n@{');
    texto.push(respuestas_temp1[6]);
    texto.push('@}\n');
    texto.push('@r7\n@{');
    texto.push(respuestas_temp1[7]);
    texto.push('@}\n');
    texto.push('@enunciado @final\n@{');
    texto.push(datos.enuF);
    texto.push('@}\n\n');


    texto.push('@planteamiento\n');
    var numf=document.getElementById("tabla_lemen").rows.length;
    console.log(numf)
    for(var i=1; i<numf; i++){
        texto.push('@nombre @{'+document.getElementById("nombre"+i).value+'@} ');
        texto.push('@entrada '+Number(document.getElementById("entrada"+i).checked)+' ');
        texto.push('@salida '+Number(document.getElementById("salida"+i).checked)+' ');
        texto.push('@auxiliar '+Number(document.getElementById("auxiliar"+i).checked)+' ');
        texto.push('@tipo '+tipo_dato[document.getElementById("tipod"+i).value-1]+' ');
        texto.push('@id '+document.getElementById("identificador"+i).value+' ');
        texto.push('@tipoid '+tipo_id[document.getElementById("tipoi"+i).value-1]+' ');
        texto.push('@valini '+document.getElementById("vali"+i).value+'\n');

        a_ids.push(document.getElementById("identificador"+i).value);
        a_valor_ini.push(document.getElementById("vali"+i).value);
    }
    texto.push('\n@diagrama\n\n');
    //texto.push('Fecha: ');
    //texto.push(datos.fecha);
    //texto.push('\n');
    //El contructor de Blob requiere un Array en el primer parámetro
    //así que no es necesario usar toString. el segundo parámetro
    //es el tipo MIME del archivo
    return new Blob(texto, {
        type: 'text/plain'
    });
};

function down(){
    var datos = obtenerDatos();
    descargarArchivo(generarTexto(datos), 'proyecto.abea');
};
