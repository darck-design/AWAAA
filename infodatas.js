const app = new Vue({
    el: '#app',
    template: '#contenidoVue',
    data: {
      mostrar: true,
      preguntas8: [
        { name: "1. ¿Cuáles son los datos iniciales del problema?" },
        { name: "2. ¿Qué es necesario preguntar para completar los datos iniciales?" },
        { name: "3. ¿De dónde se tomarán los datos iniciales?" },
        { name: "4. ¿Cuáles son los supuestos?" },
        { name: "5. ¿Cuál es la incógnita?" },
        { name: "6. ¿Qué es lo que se quiere resolver o calcular?" },
        { name: "7. ¿Qué información debe presentarse como resultado?" },
        { name: "8. ¿A través de qué forma se presentarán los resultados?" },
      ],
      enun_inicial: "",
      enunciado_final: ""
    },
    mounted() {
      if(localStorage.enun_inicial) this.enun_inicial = localStorage.enun_inicial;
    },
    watch:{
      name(newName) {
        localStorage.enun_inicial = newName;
      }
    },
    methods: {
      toggleMostrar: function () {
        this.mostrar = !this.mostrar
      }
    }
  })