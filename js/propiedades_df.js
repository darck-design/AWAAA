    // Show the diagram's model in JSON format that the user may edit
    function save() {
      document.getElementById("mySavedModel").value = myDiagram.model.toJson();
      myDiagram.isModified = false;
    }

    function load() {
      myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
      console.log("Se cargo correctamente");
    }

    // print the diagram by opening a new window holding SVG images of the diagram contents for each page
    function printDiagram() {
      var svgWindow = window.open();
      if (!svgWindow) return;  // failure to open a new Window
      var printSize = new go.Size(700, 960);
      var bnds = myDiagram.documentBounds;
      var x = bnds.x;
      var y = bnds.y;
      while (y < bnds.bottom) {
        while (x < bnds.right) {
          var svg = myDiagram.makeSVG({ scale: 1.0, position: new go.Point(x, y), size: printSize });
          svgWindow.document.body.appendChild(svg);
          x += printSize.width;
        }
        x = bnds.x;
        y += printSize.height;
      }
      setTimeout(function() { svgWindow.print(); }, 1);
    }

    function init() {
      //if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
      var $ = go.GraphObject.make;  // for conciseness in defining templates

      /* ****************** Se crea el canvas y se agregan sus propiedades ************************* */
      myDiagram =
        $(go.Diagram, "myDiagramDiv",  // canvas para el grafico
          {
            //"LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
            //"LinkRelinked": showLinkLabel,
            initialContentAlignment: go.Spot.Top,
            initialAutoScale: go.Diagram.UniformToFill,
            layout: $(go.LayeredDigraphLayout,
              { direction: 90 }),
            "undoManager.isEnabled": true  // enable undo & redo
          });

      // cuando ocurre una modificacion se agrega un asterisco en el titulo y se habilita el boton guardar
      myDiagram.addDiagramListener("Modified", function(e) {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
          if (idx < 0) document.title += "*";
        } else {
          if (idx >= 0) document.title = document.title.substr(0, idx);
        }
      });

      // helper definitions for node templates

      function nodeStyle() {
        return [
          // The Node.location comes from the "loc" property of the node data,
          // converted by the Point.parse static method.
          // If the Node.location is changed, it updates the "loc" property of the node data,
          // converting back using the Point.stringify static method.
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          {
            // the Node.location is at the center of each node
            locationSpot: go.Spot.Center
          }
        ];
      }

      //todos los elementos del diagrama tienen solo una salida
      // a excepcion de las condiciones
      //estos puertos seran las salidas de los elementos que no son
      // las condiciones
      function puerto_salida(name, align, spot, output, input) {
        var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
        // the port is basically just a transparent rectangle that stretches along the side of the node,
        // and becomes colored when the mouse passes over it
        console.log("entro puerto salida");
        return $(go.Shape,
          {
            fill: "transparent",  // changed to a color in the mouseEnter event handler
            strokeWidth: 0,  // no stroke
            width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
            height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
            alignment: align,  // align the port on the main Shape
            stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
            portId: name,  // declare this object to be a "port"
            //toMaxLinks: 1,  // don't allow more than one link into a port
            fromMaxLinks: 1,
            fromSpot: spot,  // declare where links may connect at this port
            fromLinkable: true,  // declare whether the user may draw links from here
            toSpot: spot,  // declare where links may connect at this port
            //toLinkable: false,  // declare whether the user may draw links to here
            cursor: "pointer",  // show a different cursor to indicate potential link point
            mouseEnter: function(e, port) {  // the PORT argument will be this Shape
              if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
            },
            mouseLeave: function(e, port) {
              port.fill = "transparent";
            }
          });
      }

      //cada elemento puede tener varias entradas, no datos de entrada, sino, varias flechas como entrada

      function puerto_entrada(name, align, spot, output, input) {
        var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
        // the port is basically just a transparent rectangle that stretches along the side of the node,
        // and becomes colored when the mouse passes over it
        return $(go.Shape,
          {
            fill: "transparent",  // changed to a color in the mouseEnter event handler
            strokeWidth: 0,  // no stroke
            width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
            height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
            alignment: align,  // align the port on the main Shape
            stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
            portId: name,  // declare this object to be a "port"
            toMaxLinks: 1,
            //fromMaxLinks: 1,
            fromSpot: spot,  // declare where links may connect at this port
            //fromLinkable: false,  // declare whether the user may draw links from here
            toSpot: spot,  // declare where links may connect at this port
            toLinkable: true,  // declare whether the user may draw links to here
            cursor: "pointer",  // show a different cursor to indicate potential link point
            mouseEnter: function(e, port) {  // the PORT argument will be this Shape
              if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
            },
            mouseLeave: function(e, port) {
              port.fill = "transparent";
            }
          });
      }

      function textStyle() {
        return {
          font: "bold 11pt Helvetica, Arial, sans-serif",
          stroke: "whitesmoke"
        }
      }

      /* ***************************** Termina la creacion del canvas ***********************************/
      
      /* ***************** Declaracion de las figuras para el toolbox **********************/
      
      /*

      // leer
      go.Shape.defineFigureGenerator("Input", "Parallelogram1");
      
      // calcular 
      go.Shape.defineFigureGenerator("Rectangle", function(shape, w, h) {  // predefined in 2.0
        var geo = new go.Geometry(go.Geometry.Rectangle);
        geo.startX = 0;
        geo.startY = 0;
        geo.endX = w;
        geo.endY = h;
        return geo;
      });

      // escribir
      go.Shape.defineFigureGenerator("Document", function(shape, w, h) {
        var geo = new go.Geometry();
        h = h / .8;
        var fig = new go.PathFigure(0, .7 * h, true);
        geo.add(fig);

        fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, 0));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, .7 * h));
        fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, .7 * h, .5 * w, .4 * h, .5 * w, h).close());
        geo.spot1 = go.Spot.TopLeft;
        geo.spot2 = new go.Spot(1, .6);
        return geo;
      });

      // condicion
      go.Shape.defineFigureGenerator("Diamond", function(shape, w, h) {  // predefined in 2.0
        return new go.Geometry()
               .add(new go.PathFigure(0.5 * w, 0)
                    .add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h))
                    .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
                    .add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h).close()))
               .setSpots(0.25, 0.25, 0.75, 0.75);
      }); 
      
      */

      myDiagram.nodeTemplateMap.add("Start",
        $(go.Node, "Table", nodeStyle(),
          $(go.Panel, "Auto",
            $(go.Shape, "Circle",
              { minSize: new go.Size(40, 40), fill: "#DC3C00", strokeWidth: 0 }),
            $(go.TextBlock, "Inicio", textStyle(),
              new go.Binding("text"))
          ),
          // puertos para las entradas
          puerto_salida("OUT", go.Spot.Bottom, go.Spot.BottomSide, true, false)
        ));

      myDiagram.nodeTemplateMap.add("Leer",
        $(go.Node, "Table", nodeStyle(),
          $(go.Panel, "Auto",
            $(go.Shape, "Input",
              { fill: "#41b3ef", strokeWidth: 0 }),
            $(go.TextBlock, "Leer", textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text").makeTwoWay())
          ),
          // puertos para las entradas
          puerto_entrada("IN", go.Spot.Top, go.Spot.TopSide, false, true),
          puerto_salida("OUT", go.Spot.Bottom, go.Spot.BottomSide, true, false)
        ));

      myDiagram.nodeTemplateMap.add("Calcular",
        $(go.Node, "Table", nodeStyle(),
          $(go.Panel, "Auto",
            $(go.Shape, "Rectangle",
              { minSize: new go.Size(40, 40), fill: "#41b3ef", strokeWidth: 0 }),
            $(go.TextBlock, "Calcular", textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text").makeTwoWay())
          ),
          // puertos para las entradas
          puerto_entrada("IN", go.Spot.Top, go.Spot.TopSide, false, true),
          puerto_salida("OUT", go.Spot.Bottom, go.Spot.BottomSide, true, false)
        ));

      myDiagram.nodeTemplateMap.add("Escribir",
        $(go.Node, "Table", nodeStyle(), 
          $(go.Panel, "Auto",
            $(go.Shape, "Document",
              { minSize: new go.Size(40, 40), fill: "#41b3ef", strokeWidth: 0 }),
            $(go.TextBlock, textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text").makeTwoWay())
          ),
          // puertos para las entradas
          puerto_entrada("IN", go.Spot.Top, go.Spot.TopSide, false, true),
          puerto_salida("OUT", go.Spot.Bottom, go.Spot.BottomSide, true, false)
        ));

      myDiagram.nodeTemplateMap.add("Condicion",
        $(go.Node, "Table", nodeStyle(),
          $(go.Panel, "Auto",
            $(go.Shape, "Diamond",
              { fill: "#e3da0b", strokeWidth: 0 }),
            $(go.TextBlock, textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text").makeTwoWay())
          ),
          // puertos para las entradas
          puerto_entrada("IN", go.Spot.Top, go.Spot.TopSide, false, true),
          puerto_salida("OUT", go.Spot.Left, go.Spot.LeftSide, true, false),
          puerto_salida("OUT", go.Spot.Right, go.Spot.RightSide, true, false)
        ));

      myDiagram.nodeTemplateMap.add("End",
        $(go.Node, "Table", nodeStyle(),
          $(go.Panel, "Auto",
            $(go.Shape, "Circle",
              { minSize: new go.Size(40, 40), fill: "#DC3C00", strokeWidth: 0 }),
            $(go.TextBlock, "End", textStyle(),
              new go.Binding("text"))
          ),
          // puertos para las entradas
          puerto_entrada("IN", go.Spot.Top, go.Spot.TopSide, false, true)
        ));
      /* ************************************************************************************ */
              /*
      // replace the default Link template in the linkTemplateMap
      myDiagram.linkTemplate =
        $(go.Link,  // the whole link panel
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5, toShortLength: 4,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            //mouse-overs subtly highlight links:
            mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
            mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; },
            selectionAdorned: false
          },
          new go.Binding("points").makeTwoWay(),
          $(go.Shape,  // the highlight shape, normally transparent
            { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
          $(go.Shape,  // the link path shape
            { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
            new go.Binding("stroke", "isSelected", function(sel) { return sel ? "dodgerblue" : "gray"; }).ofObject()),
          $(go.Shape,  // the arrowhead
            { toArrow: "standard", strokeWidth: 0, fill: "gray" }),
          $(go.Panel, "Auto",  // true para mostrar etiqueta en la flecha
            { visible: true, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
            new go.Binding("visible", "visible").makeTwoWay(),
            $(go.Shape, "RoundedRectangle",  // the label shape
              { fill: "#F8F8F8", strokeWidth: 0 }),
            $(go.TextBlock, "Yes",  // the label
              {
                textAlign: "center",
                font: "10pt helvetica, arial, sans-serif",
                stroke: "#333333"
                //editable: true
              },
              new go.Binding("text").makeTwoWay())
          )
        );

        */

      myDiagram.linkTemplate =
        $(go.Link,
          {
            routing: go.Link.Orthogonal, corner: 5,
            relinkableFrom: true, relinkableTo: true
          },
          $(go.Shape, { stroke: "gray", strokeWidth: 2 }),
          $(go.Shape, { stroke: "gray", fill: "gray", toArrow: "Standard" })
        );


      // Make link labels visible if coming out of a "conditional" node.
      // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
      function showLinkLabel(e) {
        var label = e.subject.findObject("LABEL");
        if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
      }

      // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
      myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
      myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

      // initialize the Palette that is on the left side of the page
      myPalette =
        $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
          {
            nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
            model: new go.GraphLinksModel([  // specify the contents of the Palette
              { category: "Start", text: "Inicio" },
              { category: "Leer", text: "Leer" },
              { category: "Calcular", text: "Calcular" },
              { category: "Escribir", text: "Escribir" },
              { category: "Condicion", text: "if" },
              { category: "End", text: "Fin" }
            ])
          });

        load();  // carga un diagrama inicial
        
    } // end init


