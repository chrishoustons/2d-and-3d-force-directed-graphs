

const collisionRadius = 32;
const arrowLength = 2;
const largeTextHeight = 16;
const smallTextHeight = 8;
const fontsize = 4;
const nodeSize = 4;

const whiteOpaque = "rgba(255,255,255,1)";
const whiteTransparent = "rgba(255,255,255,0.2)";


const threeRed = new THREE.Color(1,0,0);
const threeGreen = new THREE.Color(0,1,0);
const threeBlue = new THREE.Color(0,0,1);
const threeMagenta = new THREE.Color(1,0,1);
const threeCyan = new THREE.Color(0,1,1);
const threeYellow = new THREE.Color(1,1,0);
const threeOrange = new THREE.Color(1,0.5,0);
const threeWhite = new THREE.Color(1,1,1);

const redMaterial = new THREE.MeshLambertMaterial({color:0xff0000, transparent: true, opacity:0.75, name:"red"});
const greenMaterial = new THREE.MeshLambertMaterial({color:0x00ff00, transparent: true, opacity:0.75, name:"green"});
const blueMaterial = new THREE.MeshLambertMaterial({color:0x0000ff, transparent: true, opacity:0.75, name:"blue"});
const magentaMaterial = new THREE.MeshLambertMaterial({color:0xff00ff, transparent: true, opacity:0.75, name:"magenta"});
const cyanMaterial = new THREE.MeshLambertMaterial({color:0x00ffff, transparent: true, opacity:0.75, name:"cyan"});
const yellowMaterial = new THREE.MeshLambertMaterial({color:0xffff00, transparent: true, opacity:0.75, name:"yellow"});
const orangeMaterial = new THREE.MeshLambertMaterial({color:0xff8000, transparent: true, opacity:0.75, name:"orange"});
const whiteMaterial = new THREE.MeshLambertMaterial({color:0xffffff, transparent: true, opacity:0.75, name:"white"});
const violetMaterial = new THREE.MeshLambertMaterial({color:0x8000ff, transparent: true, opacity:0.75, name:"violet"});

const redMaterialTrans = new THREE.MeshLambertMaterial({color:0xff0000, transparent: true, opacity:0.1, name:"redTrans"});
const greenMaterialTrans  = new THREE.MeshLambertMaterial({color:0x00ff00, transparent: true, opacity:0.1, name:"greenTrans"});
const blueMaterialTrans  = new THREE.MeshLambertMaterial({color:0x0000ff, transparent: true, opacity:0.1, name:"blueTrans"});
const magentaMaterialTrans  = new THREE.MeshLambertMaterial({color:0xff00ff, transparent: true, opacity:0.1, name:"magentaTrans"});
const cyanMaterialTrans  = new THREE.MeshLambertMaterial({color:0x00ffff, transparent: true, opacity:0.1, name:"cyanTrans"});
const yellowMaterialTrans  = new THREE.MeshLambertMaterial({color:0xffff00, transparent: true, opacity:0.1, name:"yellowTrans"});
const orangeMaterialTrans  = new THREE.MeshLambertMaterial({color:0xff8000, transparent: true, opacity:0.1, name:"orangeTrans"});
const whiteMaterialTrans  = new THREE.MeshLambertMaterial({color:0xffffff, transparent: true, opacity:0.1, name:"whiteTrans"});
const violetMaterialTrans  = new THREE.MeshLambertMaterial({color:0x8000ff, transparent: true, opacity:0.1, name:"violetTrans"});


//Materials for custom geometry
var personMaterial = new THREE.MeshLambertMaterial({color:0xff0000,
    transparent: true,
    opacity: 0.75});
var launchVehicleMaterial = new THREE.MeshLambertMaterial({color:0x00ff00,
    transparent: true,
    opacity: 0.75});
var missionMaterial = new THREE.MeshLambertMaterial({color:0xff8000,
    transparent: true,
    opacity: 0.75});

var linkMaterial  = new THREE.MeshLambertMaterial({color:0xffffff,
    transparent: true,
    opacity: 0.4});

var linkSelectedMaterial =  new THREE.MeshLambertMaterial({color:0xff0000,
    transparent: true,
    opacity: 0.75});

var linkTransparentMaterial  = new THREE.MeshLambertMaterial({color:0xffffff,
    transparent: true,
    opacity: 0.1});



//Offsets for the array of SpriteTexts
const hiddenTextOffset = 1000;
const largeTextOffset = 2000;

//
const gData = {
    
    nodes: allNodes,
    links: allEdges
    
};

//Create adjacency list
var adjacencyList= [];

allEdges.forEach(function(d){
   
    adjacencyList[d.source + "-"+ d.target]=true;
    adjacencyList[d.target+ "-" +d.source]=true;
});

//Create edge material lookup list

const edgeLookUpNorm = [];
const edgeLookUpTrans = [];



//Create Labels
const nodeLabels=[];

const edgeLabels=[];





//Create all the node labels up front so we're not constantly creating and destroying them
allNodes.forEach( function(node){

    
     var theLabel  =getLabelName(node);
     var smallText = new SpriteText(theLabel);
     smallText.fontsize = fontsize;
     smallText.material.depthFunc = THREE.AlwaysDepth;
     smallText.material.depthTest = false;
     smallText.renderOrder = 12;
     smallText.textHeight=smallTextHeight;
     smallText.color = whiteOpaque;
     nodeLabels[node.id] = smallText;
     var hiddenText = new SpriteText(theLabel)
     hiddenText.fontsize = fontsize;
     hiddenText.textHeight=smallTextHeight;
     hiddenText.material.depthFunc = THREE.AlwaysDepth;
     hiddenText.material.depthTest = false;
     hiddenText.renderOrder = 12;
     hiddenText.color = whiteTransparent;
     nodeLabels[node.id+hiddenTextOffset] = hiddenText;
     var largeText = new SpriteText(theLabel)
     largeText.fontsize = fontsize;
     largeText.textHeight=largeTextHeight;
     largeText.material.depthFunc = THREE.AlwaysDepth;
     largeText.material.depthTest = false;
     largeText.renderOrder = 12;
     largeText.color = whiteOpaque;
     nodeLabels[node.id+largeTextOffset] = largeText;

});
console.log(allEdges);
console.log(allNodes);

console.log(nodeLabels[1].material);


allEdges.forEach(function(edge){
    
   
    var sprite;
    sprite = new SpriteText(constantCaseToReadableCase(edge.type) );
    sprite.color = "white";
    sprite.textHeight = smallTextHeight;
    sprite.fontsize = fontsize;
    sprite.material.depthFunc = THREE.AlwaysDepth;
    sprite.material.depthTest = false;
    sprite.renderOrder = 12;
    edgeLabels[edge.id] = sprite;
    console.log(edge);
    console.log(getLinkMaterial(allNodes.find(function(element){ return element.id == edge.source;})));
    
    edgeLookUpNorm[edge.id] = getLinkMaterial(allNodes.find(function(element){ return element.id === edge.source}),false) ;
    edgeLookUpTrans[edge.id] = getLinkMaterial(allNodes.find(function(element){ return element.id === edge.source}),true) ;
});



//are Neighbours function
function areNeighbours(a,b)
{
    return a ==b || adjacencyList[a+"-"+b];
}

//Create cone geometry

const coneGeo = new THREE.ConeBufferGeometry( 1, 1, 8);
coneGeo.rotateX(Math.PI/2);
coneGeo.translate(0,0,0.5);


//Start Force Graph 3d, initalise with data
const Graph = ForceGraph3D({controlType:"trackball" })
    (document.getElementById('3d-graph'))
    .graphData(gData)
    .enableNodeDrag(false)
    .nodeResolution(5)
    .linkResolution(5);
    
//Hack to remove tooltip
d3.selectAll(".scene-tooltip").remove();

//Set graph force strengths
Graph.d3Force('link').distance(150);
Graph.d3Force('charge').strength(-150);
Graph.d3Force("collide", d3.forceCollide(collisionRadius))

//Create link types

Graph.nodeRelSize(nodeSize); 


var loader = new THREE.GLTFLoader();

//Geometry holders
var person,  rocket, mission;


    
//currently highlighted nodes array

let neighbours =[];
let linkNeighbours = [];
let currentNode = null;




// loader.load( "models/person.glb", function ( obj ) {
    
//     person = obj.scene.children[0].geometry;
//     //Graph.scene().add(obj.scene);
    
//     obj.asset;

// }, undefined, function ( error ) {

// 	console.error( error );

// } );


// loader.load( "models/rocket.glb", function ( obj ) {
    
//     rocket = obj.scene.children[0].geometry;
//     //Graph.scene().add(obj.scene);
  
//     obj.asset;

// }, undefined, function ( error ) {

// 	console.error( error );

// } );

// loader.load( "models/mission.glb", function ( obj ) {
    
//     mission = obj.scene.children[0].geometry;
//     //Graph.scene().add(obj.scene);

//     obj.asset;

// }, undefined, function ( error ) {

// 	console.error( error );

// } );




Graph.d3Force('charge').strength(-350);


Graph.nodeLabel(
    function(d){return getLabelName(d);

    })
    .nodeColor(function(d)
    {

         //else{d.__threeObj.material.depthFunc = THREE.LessEqualDepth;}
        return getNodeColor(d);
    });



Graph.nodeThreeObjectExtend(true)
    .nodeThreeObject(theNode =>
        {
            //Check if any neighbours at present and that this node isn't one of them, returns hidden text if so
            var label;
            if(neighbours.length<1)
            {
                label = nodeLabels[theNode.id];
                label.material.color = getLabelColor(theNode);
             
                
                return label;
            }
     
            
            
            else if(neighbours.length>0&&neighbours.indexOf(theNode)===-1 ){
            
               label =nodeLabels[theNode.id+hiddenTextOffset];
               label.material.color = getLabelColor(theNode);
       
               return label;
                
            }

            label =  nodeLabels[theNode.id+largeTextOffset];
            label.material.color = getLabelColor(theNode);
            
            return label;
       
        }

    );



   

//Set link labels and styles
Graph.linkLabel("type")
    
    .linkDirectionalParticles(link => linkNeighbours.indexOf(link)===-1 ? 0 : 4)
    .linkDirectionalParticleWidth(4)
    .linkThreeObject(theEdge=>
        {
         
            
            geometry= coneGeo;
            
            var material = edgeLookUpNorm[theEdge.id];
            var cone = new THREE.Mesh(geometry,material);
            var sprite;
            
            
          
            if(neighbours.length>0)
            {
                if(linkNeighbours.indexOf(theEdge)===-1)
                {
                    cone.material = edgeLookUpTrans[theEdge.id];
                    
                    
                    //cone.material.color = getNodeColor(theEdge.source);

                  // cone.material = edgeLookUp.transparent[theEdge.id];
               
                }
                else{
                    cone.material = edgeLookUpNorm[theEdge.id];
                    
              
                   
                }
            }
            else
            {
                cone.material = edgeLookUpNorm[theEdge.id];
              //  cone.material.color = getNodeColor(theEdge.source);
               // cone.material = edgeLookUp.normal[theEdge.id];
               
            }


            if(linkNeighbours.indexOf(theEdge)!==-1 && linkNeighbours.length>0 ){
                sprite = edgeLabels[theEdge.id];
                cone.add(sprite);
                
            }
            
            return cone;

            
        }
        ) .linkPositionUpdate((cone, { start, end }, link) => {

            
            if(!cone.children[0]){return;}
            var sprite = cone.children[0];
            const middlePos = new THREE.Vector3( start.x +(end.x-start.x)/2, 
                                                start.y +(end.y-start.y)/2, 
                                                start.z+(end.z-start.z)/2);

            sprite.parent =null;        
            Object.assign(sprite.position,middlePos);

        })
        .linkWidth(function(d){return getLinkWidth(d);});



        








Graph.onLinkHover(link=>{  if(link){console.log(link);}   })

    
Graph.onNodeClick(function(d)
{

    window.open("http://en.wikipedia.org/wiki/"+d.values.wiki_link, '_blank');
});



Graph.onNodeHover(node=>
    {
        console.log(node);
        
        if(!node){neighbours =[]; linkNeighbours=[]; currentNode=null;  updateGeo(); return;}
        if(node===currentNode){return;}
        currentNode = node!==null? node: null;
        
        

        //else if((neighbours.length>1 && neighbours[0] ===node)){ return;}
        Graph.graphData().nodes.forEach(
            node2 => {
                if(node2&&node&&areNeighbours(node.id, node2.id)) neighbours.push(node2); 
                

            } );
        
        
        Graph.graphData().links.forEach(
            edge =>
            {
                if(node&&edge&&((edge.source.id === node.id)||(edge.target.id === node.id))){
                    linkNeighbours.push(edge);
                }
               
               
            }

        );



        updateGeo();
    }
    
    
    
)


//Graph.nodeOpacity(1);






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

function getLinkWidth(d)
{
    if(neighbours.length<1){return 1;}
    return (neighbours.length >0 && (linkNeighbours.indexOf(d)===-1)? 1:2);
}


function getNodeColor(d){

    var colorvalue = 255;
   // var alphaValue = neighbours.length>0 &&(neighbours.indexOf(d)===-1)?0.5:1;
    if(neighbours.length>0 ){

        if(neighbours.indexOf(d)===-1){
            alphaValue = 0.5;
        }

        else{
            alphaValue = 1;
        }
        
    }

    else{
        alphaValue = 1;
    }
    

    if(d.labels.includes("Astronaut")){
        return `rgba(`+colorvalue+`,0,0, `+alphaValue+`)`;
    }
    else if(d.labels.includes("Mission")){
        return `rgba(`+colorvalue+`,`+colorvalue/2+`,0,`+alphaValue+`)`;
    }
    else if(d.labels.includes("Institution")){
        return `rgba(0,0,`+colorvalue+`,`+alphaValue+`)`;
    }
    else if(d.labels.includes("Country"))
    {
        return `rgba(`+colorvalue+`,`+colorvalue+`,0,`+alphaValue+`)`;
    }
    else if(d.labels.includes("SpaceStation")){
        return `rgba(`+colorvalue+`,0,`+colorvalue+`, `+alphaValue+`)`;
    }
    else if(d.labels.includes("Program")){
        return `rgba(0,`+colorvalue+`,`+colorvalue+`,`+alphaValue+`)`;
    }
    else if(d.labels.includes("Component")){
        return `rgba(`+colorvalue/2+`,0,`+colorvalue+`,`+alphaValue+`)`;
    }
    
    return `rgba(0,`+colorvalue+`,0,`+alphaValue+`)`;
    
}


function getLabelColor(d)
{
  


    if(d.labels.includes("Astronaut")){
        return threeRed;
    }
    else if(d.labels.includes("Mission")){
        return threeOrange;
    }
    else if(d.labels.includes("Institution")){
        return threeWhite;
    }
    else if(d.labels.includes("Country"))
    {
        return threeYellow;
    }
    else if(d.labels.includes("SpaceStation")){
        return threeMagenta;
    }
    else if(d.labels.includes("Program")){
        return threeCyan;
    }
    else if(d.labels.includes("Component")){
        return threeWhite;
    }
    
    return threeGreen;
}





function getLinkMaterial(d, isTrans)
{
    
    
    if(!d)
    {
        return linkMaterial;
    }

    if(d.labels.includes("Astronaut")){
        
            return isTrans?redMaterialTrans :redMaterial;
    }

    else if(d.labels.includes("Mission")){
        
            return isTrans?orangeMaterialTrans: orangeMaterial;

    }
    else if(d.labels.includes("Institution")){
 
        return isTrans?blueMaterialTrans:blueMaterial;

    }
    else if(d.labels.includes("Country"))
    {  

        return isTrans?yellowMaterialTrans:yellowMaterial;

    }
    else if(d.labels.includes("SpaceStation")){     
        
        return isTrans?magentaMaterialTrans:magentaMaterial;

    }
    else if(d.labels.includes("Program")){
 
        return isTrans?cyanMaterialTrans:cyanMaterial;
    }
    else if(d.labels.includes("Component")){
   
        return isTrans?violetMaterialTrans:violetMaterial;
    }
    
    else
    {       
   
        return isTrans?greenMaterialTrans:greenMaterial;
    }

  
}



function getNodeMesh(d)
{
    if(d.labels.includes("Astronaut"))
    {     
        return new THREE.Mesh(person, personMaterial);
    }
    else if(d.labels.includes("Mission"))
    {
        return new THREE.Mesh(mission, missionMaterial);
    }
    else if(d.labels.includes("LaunchVehicle"))
    {
        return new THREE.Mesh(rocket, launchVehicleMaterial);
    }
    else return ;
}
// trigger update of 3d objects in scene
function updateGeo() {
    Graph.nodeRelSize(nodeSize); 
  }

function constantCaseToReadableCase(text)
{
    result = text;
    result = result.replace(/_/g, " ");
    result = result.toLowerCase();

    return result;
}
    