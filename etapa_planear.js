 //funcion para agregar un nuevo elemento
 function add(){
   //------ se agregan elementos a la tabla de elementos -------

   var nf=document.getElementById("tabla_lemen").rows.length;
   var nuevaFila="<tr>";
   //columna 1/4 Nombre del elemento
   nuevaFila+= '<td> <div class="input-field col s12"><input placeholder="null" id="nombre'+nf+'" type="text" class="validate" value="Elemento'+nf+'"></div> </td>';
   //columna 2/4 Entrada
   nuevaFila+= '<td><p><label><input type="checkbox" id="entrada'+nf+'" value=1 /><span></span></label></p></td>';
   //columna 3/4 Salida
   nuevaFila+= '<td><p><label><input type="checkbox" id="salida'+nf+'" value=2 /><span></span></label></p></td>';
   //columna 4/4 Auxiliar
   nuevaFila+= '<td><p><label><input type="checkbox" id="auxiliar'+nf+'" value=3 /><span></span></label></p></td>';

   $("#tabla_lemen").append(nuevaFila);

   // ----- se agregan elementos a la tabla de asignacion de identificadores ---

   //primeto borra los elementos en la tabla de asignacion
   var nuevaFila_t2 = "";
   for(var i=1; i<nf; i++){
     $("#tabla_asigid tr:last").remove();
   }
   // ya borrados se crean y se agregan a la tabla con el nombre dados en la tabla de elementos
   var nf=document.getElementById("tabla_lemen").rows.length;
   for(var i=1; i<nf; i++){
     var ne = document.getElementById("nombre"+i).value;
     //columna 1/5 Elemento
     nuevaFila_t2+= '<tr><td>'+ne+'</td>';
     //columna 2/5 Tipo de dato
     nuevaFila_t2+= '<td><div class="input-field"><select class="browser-default" id="tipod'+i+'"><option value="" disabled selected>Selecciona una opción</option><option value="1">Entero</option><option value="2">Real</option><option value="3">Cadena</option></select></div></td>';
     //columna 3/5 Identificador
     nuevaFila_t2+= '<td><div class="input-field"><input placeholder="null" id="identificador'+i+'" type="text" class="validate"></div></td>';
     //columna 4/5 Tipo de identificador
     nuevaFila_t2+= '<td><div class="input-field"><select class="browser-default" id="tipoi'+i+'"><option value="" disabled selected>Selecciona una opción</option><option value="1">Variable</option><option value="2">Constante</option></select></div></td>';
     //columna 5/5 Valor inicial
     nuevaFila_t2+= '<td><div class="input-field"><input placeholder="null" id="vali'+i+'" type="text" class="validate"></div></td></tr>';
   }
   $("#tabla_asigid").append(nuevaFila_t2);;
 }

 //funcion para borrar un elemento, siempre borra el ultimo añadido
 function rem(){
   // Obtenemos el total de columnas (tr) del id "tabla"
   var nf=document.getElementById("tabla_lemen").rows.length - 1;
   if(nf>0)
   {
       // Eliminamos la ultima columna
       $("#tabla_lemen tr:last").remove();
       $("#tabla_asigid tr:last").remove();
   }
 }