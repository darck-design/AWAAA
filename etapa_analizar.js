
    var preguntas = [
      "1. ¿Cuáles son los datos iniciales del problema?",
      "2. ¿Qué es necesario preguntar para completar los datos iniciales?",
      "3. ¿De dónde se tomarán los datos iniciales?",
      "4. ¿Cuáles son los supuestos?",
      "5. ¿Cuál es la incógnita?",
      "6. ¿Qué es lo que se quiere resolver o calcular?",
      "7. ¿Qué información debe presentarse como resultado?",
      "8. ¿A través de qué forma se presentarán los resultados?"
    ];

    var indice = 0;
    var contestadas = []; //se guardan los indices de las preguntas ya contestadas para activar el numero en la navegacion
    var respuestas_temp1 = ["","","","","","","",""];

    nueva_p();

    function nueva_p(){
      document.getElementById("pregunta").innerHTML = preguntas[indice];
      var rpt = "";
      if(respuestas_temp1[indice]!="")
        rpt = "active";
      var textbox = '<textarea id="p'+indice+'" class="materialize-textarea" data-length="512">'+respuestas_temp1[indice]+'</textarea><label for"p'+indice+'" class="'+rpt+'">Escriba aquí la respuesta a la pregunta</label>';
      document.getElementById("res").innerHTML = textbox;

      for(i in contestadas){
        $("#pp"+contestadas[i]).addClass('active');
      }
    }

    function siguiente(){
      var idta = "p"+indice;
      var respuesta = $("textarea#"+idta).val();
      if(respuesta != ""){
        contestadas.push(indice);
        respuestas_temp1[indice] = respuesta;
      }
      indice++;
      if(indice>7)
        indice=0;
      nueva_p();
    }

    function anterior(){
      var idta = "p"+indice;
      var respuesta = $("textarea#"+idta).val();
      if(respuesta != ""){
        contestadas.push(indice);
        respuestas_temp1[indice] = respuesta;
      }
      indice--;
      if(indice<0)
        indice=7;
      nueva_p();
    }
