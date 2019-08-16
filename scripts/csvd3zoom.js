

//Get the nodes and edges from the php json
var allLabels = { 'nodes':[], 'links':[]};
var edgeyLabels = {"edges":[], "debug":[]};
console.log(allNodes);
console.log(allEdges);
allNodes.forEach( function(d, i){
    allLabels.nodes.push({node:d});
    
    });
allEdges.forEach(function(d, i){edgeyLabels.edges.push({edge:d})});

console.log(allLabels);

console.log(edgeyLabels);





//Canvas or SVG parameters, set up canvas d3
var width = 1820;
var height = 1024;

const svg = d3.select("#vis").attr("width",width).attr("height",height);
const container = svg.append("g");
var theWholeThing = null;

var nodeLabelxOffset = 10;
var nodeLabelyOffset = 3;
//Simulation parameters
var charge = -20;
var linkDistance =100;
var maxChargeDistance = 300;
var collisionRadius = 30;

var labelLayout = d3.forceSimulation(allLabels.nodes)
    .force("charge", d3.forceManyBody().distanceMax(maxChargeDistance))
    .force("link", d3.forceLink(allLabels.links).distance(0))
    .force("collide", d3.forceCollide(collisionRadius));


//Set up simulation
var simulation = d3.forceSimulation(allNodes)
    .force("charge", d3.forceManyBody().distanceMax(maxChargeDistance))
    .force("link", d3.forceLink(allEdges).id(function(d) { return d.id; }))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(collisionRadius))
    .on("tick", ticked);
    
simulation.force("charge").strength(charge);
simulation.force("link").distance(linkDistance);

labelLayout.force("charge").strength(charge);
labelLayout.force("link").distance(linkDistance);


var zoomer = d3.zoom()
        .scaleExtent([0.5,4])
        .on("zoom", function(){container.attr("transform", d3.event.transform);})

//Set up zooming
svg.call( zoomer
    

);

//Add edges to container
var link = container.append("g").attr("class", "links")
    .selectAll("path")
    .data(allEdges)
    .enter()
    .append("path")
    .attr("fill", function(d){return getNodeColor(d.source)})
   // .attr("fill", "#aaa")
    .style("opacity", "0.6  ")
    .attr("id", function(d){return "edge"+d.id;})
   
    console.log("hello");
//Add nodes to container
var node = container.append("g").attr("class", "nodes")
    .selectAll("g")
    .data(allNodes)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("stroke", "#fff")
    .attr("stroke-width", "1px")
    .attr("fill", function(d){return getNodeColor(d)})
    




//create adjacency list

var adjacencyList= [];

allEdges.forEach(function(d){
    adjacencyList[d.source.id + "-"+ d.target.id]=true;
    adjacencyList[d.target.id+ "-" +d.source.id]=true;
});


//Returns whether or not two nodes are neighbours
function areNeighbours(a,b)
{
    return a ==b || adjacencyList[a+"-"+b];
  //  return a ==b || adjacencyList[a+"-"+b]|| adjacencyList[b+"-"+a];
}

console.log(adjacencyList);


node.on("mouseover", focus).on("mouseout", unfocus);

node.on("dblclick", function(d){
    window.open("http://en.wikipedia.org/wiki/"+d.values.wiki_link, '_blank');
})
//add labels to container

var nodeLabels = container.append("g").attr("class","nodeLabels")
    .selectAll("text")
    .data(allLabels.nodes)
    .enter()
    .append("text")
    .text(function(d, i){return getLabelName(d.node) ;})
    .style("fill", "#fff")
    .style("font-family", "Arial")
    .style("font-size", "6px")
    .style("pointer-events", "none");
  
var edgeLabels = container.append("g").attr("class","edgeLabels")
    .selectAll("text")
    .data(edgeyLabels.edges)
    .enter()
    .append("text")
    .text(function(d, i){return constantCaseToReadableCase(getEdgeType(d.edge));})
    .attr("display","none")
    .style("fill", "#fff")
    .style("font-family", "Arial")
    .style("font-size", "8px")
    .style("pointer-events", "none")
    ;
    

console.log(edgeLabels);


node.call(
    d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
);



node.on("mouseover", focus).on("mouseout", unfocus);

// var theWholeGraph = function ()
// {
//     this.colors = true;
//     this.spaceStations = true;
//     this.beginningDate = 1961;
//     this.endDate = 1975;
// };


// window.onload = function()
// {
//     theWholeThing = new theWholeGraph();
//     var gui = new dat.GUI();
//     gui.add(theWholeThing, 'colors');
//     gui.add(theWholeThing, "spaceStations");
//     gui.add(theWholeThing, "beginningDate",1961,1975);
//     gui.add(theWholeThing, "endDate", 1961,1975);

// }

//Behaviour when mouseover a node
function focus(d) {
    
    var index = d3.select(d3.event.target).datum().id;
    var uid = d3.select(d3.event.target).datum().id;
    //console.log(d3.select(d3.event.target).datum());
 
    node.style("opacity", function(o) {
       
      
        return areNeighbours(index, o.id) ?  1 : 0.05;
    });
    node.attr("r", function(d){
        if(index == d.id){return 10;} return 5;
    });

    nodeLabels.attr("display", function(d){
        return areNeighbours(index, d.node.id)?"block" :"none";
    });

    nodeLabels.style("font-size", function(d){
        return areNeighbours(index, d.node.id)?"8px" :"6px";
    });
    

    edgeLabels.attr("display", function(d)
    {
        return d.edge.source.id ==index ||d.edge.target.id ==index? "block": "none";
    });
    
    link.style("opacity", function(o) {
       
        return o.source.id == index || o.target.id== index ? 1 : 0.05;
    });
 

}
//Behaviour when mouse leaves a node
function unfocus() {
  
   node.style("opacity", 1);
   node.attr("r",5);
   node.attr("stroke","#fff");
   node.attr("stroke-width","1px");
   link.style("opacity", 0.6);
   nodeLabels.attr("display", "block");
   edgeLabels.attr("display", "none");
  
   nodeLabels.style("font-size", "6px");
}

function ticked() {

    node.call(updateNode);
    link.call(updateLink);
    edgeLabels.call(updateEdgeLabel);
    nodeLabels.each( function(d){
        d.x = d.node.x +nodeLabelxOffset;
        d.y = d.node.y+ nodeLabelyOffset;
    });
    nodeLabels.call(updateNode);

    
}

function updateEdgeLabel(edgeLabel)
{
    
    
    edgeLabel.attr("x", function(d) { return d.edge.target.x -  ((d.edge.target.x - d.edge.source.x) /2); }) 
    .attr("y", function(d) { return d.edge.target.y -  ((d.edge.target.y - d.edge.source.y) /2); });

    

    edgeLabel.attr("transform", function(d){ var bbox = this.getBBox(); var dx = bbox.width/2; var dy = bbox.height/2; return "translate("+(-dx)+", "+(-dy)+")"; } )
}


function updateLink(link) {

    var x1, y1,x2,y2;

    // // if(!theWholeThing.colors )
    // // {
    //     link.attr("fill", function(d){return "#888"})
    // }
    // else
    // {
        link.attr("fill", function(d){return getNodeColor(d.source)})
    // }

    link.attr("d", function(f){
        
        x1= fixna(f.source.x);
        y1 = fixna(f.source.y);
        x2 = fixna(f.target.x);
        y2 = fixna(f.target.y);
        
        var thickness= 1.5;
        

        if((x2 > x1 && y2 < y1) || (x2 < x1  && y2> y1) )
        {
            return "M"+(x1-thickness)+" "+(y1-thickness)+" "+"L"+(x1+thickness)+" "+(y1+thickness)+" "+"L"+x2+" "+y2+"Z";
        }
    
        

        return "M"+(x1-thickness)+" "+(y1+thickness)+" "+"L"+(x1+thickness)+" "+(y1-thickness)+" "+"L"+x2+" "+y2+"Z";
    })

    // link.attr("x1", function(d) { return fixna(d.source.x); })
    //     .attr("y1", function(d) { return fixna(d.source.y); })
    //     .attr("x2", function(d) { return fixna(d.target.x); })
    //     .attr("y2", function(d) { return fixna(d.target.y); });
}

//Update nodes positions
function updateNode(node) {
    node.attr("transform", function(d) {
        return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
    });
}

function fixna(x) {
    if (isFinite(x)) return x;
    return 0;
}

function dragstarted(d) {
    //d3.event.sourceEvent.stopPropagation();
    if (!d3.event.active)simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}



function getNodeColor(d){
    if(d.labels.includes("Astronaut")){
        return "#f00";
    }
    else if(d.labels.includes("Mission")){
        return "#ff8000";
    }
    else if(d.labels.includes("Institution")){
        return "#00f";
    }
    else if(d.labels.includes("Country"))
    {
        return "#ffff00";
    }
    else if(d.labels.includes("SpaceStation")){
        return "#ff00ff";
    }
    else if(d.labels.includes("Program")){
        return "#00ffff";
    }
    else if(d.labels.includes("Component")){
        return "#8000ff";
    }
    
    return "#0f0";
    
}

function getLabelName(d){
    if(d.labels.includes("Astronaut"))
    {
        var nickname ="";
        if(d.values.nickname!= null)
        {
            nickname+=  "\""+d.values.nickname+  "\" ";
        }

        return d.values.first_name +" "+ nickname+ d.values.surname;
    }
    else if(d.labels.includes("Institution"))
    {
        return d.values.abbrev;
    }

    else{
        return d.values.name;
    }
}

function getEdgeType(d)
{
    return d.type;
}
//Remove the underscore and convert text to lowercase for labels
function constantCaseToReadableCase(text)
{

    result = text;
    result = result.replace(/_/g, " ");
    result = result.toLowerCase();

    return result;
}
    