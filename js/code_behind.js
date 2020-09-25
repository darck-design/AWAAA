var Diagram = MindFusion.Diagramming.Diagram;
var GlassEffect = MindFusion.Diagramming.GlassEffect;

var diagram;

$(document).ready(function () {
    // create a Diagram component that wraps the "diagram" canvas
    diagram = Diagram.create($("#diagram")[0]);
    diagram.getNodeEffects().push(new GlassEffect());
    diagram.setAllowInplaceEdit(true);


    // create a NodeListView component that wraps the "nodeList" canvas
    var nodeList = MindFusion.Diagramming.NodeListView.create($("#nodeList")[0]);
    nodeList.setTargetView($("diagram")[0]);
    initNodeList(nodeList, diagram);
});

function initNodeList(nodeList, diagram) {
    // add some nodes to the NodeListView
    var formas = ["Save", "Rectangle", "Document", "Decision"];
    var nombres = ["Leer", "Calcular", "Escribir", "Condición", "Para", "Mientras", "Hasta"];
    for (var i = 0; i < nombres.length; ++i) {
        var node = new MindFusion.Diagramming.ShapeNode(diagram);
        node.setText(nombres[i]);
        if(i<4){
            node.setShape(formas[i]);
        }
        nodeList.addNode(node, nombres[i]);
    }
}

function saveDiagram() {

    if (storageAvailable('localStorage')) {

        localStorage.setItem('jsdiagram', diagram.toJson());
    }
    else {
        alert("Sorry, no local storage!");
    }
}

function storageAvailable(type) {
    try {
        var storage = window[type],
			x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return false;
    }
}

function loadDiagram() {

    var diagramString = localStorage.getItem('jsdiagram');
    alert(diagramString);
    diagram.fromJson(diagramString);

}