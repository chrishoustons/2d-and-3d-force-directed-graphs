<!DOCTYPE html>
<html>

<head>
<script src="https://d3js.org/d3.v5.min.js"></script>

<script src="scripts/gl_matrix.js"></script>
<script src="scripts/three.js"></script>
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

<style>
.edge {
  stroke: #000;
  stroke-width: 1.5px;
}

.node {
  cursor: move;
  fill: #ccc;
  stroke: #000;
  stroke-width: 1.5px;
}

.node.fixed {
  fill: #f00;
}
</style>

</head>

<body>

<?php
require_once 'C:/Users/Chris/vendor/autoload.php';

use GraphAware\Neo4j\Client\ClientBuilder;

$client = ClientBuilder::create()
    ->addConnection('default', 'http://neo4j:admin@localhost:7474')
    ->build();


function getAllNodes()
{
    //Take in label. Return all nodes of that type
    global $client;
    $the_query = "MATCH(n) WHERE (n)-[]-() RETURN n ORDER BY id(n);";
    $the_result =  $client->run($the_query);
    $result_nodes = [];

    foreach($the_result->getRecords() as $result_node)
    {
        $result_nodes[] = ["uid"=>$result_node->get("n")->identity(),"values"=>$result_node->get("n")->values(), "labels"=>$result_node->get("n")->labels()];
    }
    return $result_nodes;
}

function getAllEdges()
{
    //Take in type, get all relationships of that type
    global $client;
    $the_query = "MATCH()-[r]->() RETURN r, id(endNode(r)) as endNode, id(startNode(r)) as startNode ORDER BY id(r);";
    $the_result =  $client->run($the_query);
    $result_edges = [];

    foreach($the_result->getRecords() as $result_edge)
    {
        $result_edges[] = [
                            "uid"=>$result_edge->get("r")->identity(),
                            "values"=>$result_edge->get("r")->values(), 
                            "source"=>$result_edge->get("endNode"),
                            "target"=>$result_edge->get("startNode"),
                            "type"=>$result_edge->get("r")->type()
        ];
    }
    return $result_edges;
}


$allNodes = getAllNodes();

// print_r($allAstronauts[0]);

$allEdges = getAllEdges();

// print_r($allCreweds);

$nodes_json = json_encode($allNodes );
$edges_json = json_encode($allEdges);

$nodes_json = str_replace("'", "\'" ,$nodes_json); 
$nodes_json = str_replace("\\\"", "" ,$nodes_json); 


$count = 0;
$storage_array = array(1, 2, 3, 4);

// foreach ($result->getRecords() as $record) {
    
//     $mission_name = $record->get('m')->value('name');
//     $mission_time = $record->get('m')->value('start_date_time');
//     $mission_wiki = $record->get('m')->value('wiki_link');
//     $first_name = $record->get('n')->value('first_name');
//     $surname = $record->get('n')->value('surname');
//     $uniqueachievement = $record->get('n')->value('unique_achievement',null);

//     $wikilink = $record->get('n')->value('wiki_link');
//     $abbrev = $record->get('c')->value('abbrev');
//     $inswiki = $record->get('c')->value('wiki_link');
//     echo "<a href=\"http://en.wikipedia.org/wiki/$mission_wiki\" target=\"_blank\">$mission_name</a>, ($mission_time)" ;
//     echo " <a href=\"http://en.wikipedia.org/wiki/$wikilink\" target=\"_blank\">$first_name  $surname</a>";
//     echo ": <a href=\"http://en.wikipedia.org/wiki/$inswiki\" target=\"_blank\">$abbrev</a> ";
//     if($uniqueachievement!=null){
//         echo " -- $uniqueachievement";
//     }
    


//     echo '<br>';
//     $count++;
// // }
// $nodes = [];

// $query = 'MATCH (m:Mission)-[s:CREWED]-(n:Astronaut)-[:EMPLOYED_BY]-(p:Institution) RETURN n,min(m.start_date_time)as earliestMission, count(s) as theCount, p.abbrev as institutionName, duration.between(n.dob,min(m.start_date_time)).years as ageAtFirstMission  ORDER BY theCount DESC;';
// $result = $client->run($query);

// foreach($result->getRecords() as $node )
// {   


//     $nodes[] = [
                 
//                  'firstName' => $node->get('n')->value('first_name'),
//                  'surname' =>  $node->get('n')->value('surname'),
//                  'dob' => $node->get('n')->value('dob'),
//                  'missions' => $node->get('theCount'),
//                  'institution' => $node->get('institutionName'),
//                  'earliestMission' => $node->get('earliestMission'),
//                  'ageAtFirstMission'=> $node->get('ageAtFirstMission'),
                 
//                 ];

// }



// $result_json =  json_encode($nodes);

// ?>



<canvas id ="theCanvas">



</canvas>
<!-- <div id="yoop">

<p>"Error!: This is Dummy Error"</p>

<p>"Warning!: This is Dummy Warning"</p>
<?php echo $nodes_json ?>
</div> -->

<script>


var allNodes;




var allNodes =  JSON.parse('<?php echo $nodes_json; ?>');
var allEdges;
var allEdges = JSON.parse('<?php echo $edges_json; ?>')

console.log(allEdges);

// for(var i = 0; i<ar.length; i++)
// {
//     foo += ar[i].firstName + " "+  ar[i].surname +" " + ar[i].missions + " " +ar[i].earliestMission+ " "+ ar[i].institution+ "<br />";
// }



//     $("#yo").html(foo);

// d3.select("#yo").style("color","green");
// d3.select("#yo")
//     .insert("p")
//     .text("Hello there world");

// d3.select("#yoop")
//     .selectAll("p")
//     .style("color", function(d,i){
//         var text = this.innerText;

//         if(text.indexOf("Error")>=0)
//         {
//             return "red";
//         }
//         else if(text.indexOf("Warning")>= 0)
//         {
//             return "yellow";
//         }

//     });


// d3.select("body")
//     .append("ul")
//     .attr("class","list-group")
//     .append("li")
//     .data(ar)
//     .enter()
//     .append("p")
//     .text(function(d, i){
//         return d.firstName + " " + d.surname +" : "+ d.missions + " : "+d.earliestMission +" : "+ d.institution+" : "+d.ageAtFirstMission + ": "+toString(d);

//     })
//     .attr("class",function(d)
//     {
//         if(d.institution == "NASA")
//         {
//             return "list-group-item bg-primary text-light";
//         }
//         else
//         {
//             return "list-group-item bg-danger text-light";
//         }
//     }
    
//     );


var width = 1024;
var height = 1024;
var charge = -20;
var linkDistance =100;



const theCanvas = d3.select("#theCanvas").attr("width",width).attr("height",height);
const context = theCanvas.node().getContext("2d");
theCanvas.width = width;
theCanvas.height = height;

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.uid; }))
    .force("charge", d3.forceManyBody().distanceMax(300))
    .force("center", d3.forceCenter(width / 2, height / 2));
    
simulation.force("charge").strength(charge);
simulation.force("link").distance(linkDistance);

function zoom(){
    //get the current transform of the mouse with the event.
    var transform = d3.event.transform;

}



  
    

simulation
    .nodes(allNodes)
    .on("tick", ticked);


console.log(simulation.nodes());

simulation.force("link")
    .links(allEdges);

theCanvas
    .call(d3.drag()
        
        .subject(dragsubject)
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));


//Here we have the "primary drawing loop " called every tick
function ticked() {

    console.log(d3.mouse.x);


    context.clearRect(0, 0, width, height);


    simulation.force("link")
        .links()
        .forEach(drawLink);

    simulation.nodes()
        .forEach(drawNode);



}

function dragsubject() {
    return simulation.find(d3.event.x, d3.event.y);
}




function dragstarted() {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d3.event.subject.fx = d3.event.subject.x;
  d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
}

function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
}

function drawLink(d) {
    context.beginPath();
    context.moveTo(d.source.x, d.source.y);
    context.lineTo(d.target.x, d.target.y);
    context.strokeStyle = "#aaa";
    context.stroke();
    drawLinkLabel(d);
   
  
}

function drawNode(d) {
    context.beginPath();
    context.moveTo(d.x + 3, d.y);
    context.arc(d.x, d.y, 6, 0, 2 * Math.PI);
    context.fillStyle = getNodeColor(d);
    context.fill();
    context.strokeStyle = "#fff";
    context.stroke();
    drawNodeLabel(d);
  
}

function drawLinkLabel(d)
{
    context.fillStyle = "#000";
    context.font = "10pt Arial";
    // Draw text half way between the source and target node
     //context.fillText(d.type,d.target.x-((d.target.x - d.source.x)/2) ,d.target.y - ((d.target.y - d.source.y))/2 );
}

function drawNodeLabel(d)
{
   
    context.fillStyle = "#000";
    context.font = "10pt Arial";
   
    context.fillText(getLabelName(d),d.x,d.y);
}

function getNodeColor(d)
{
    if(d.labels.includes("Astronaut"))
    {
        return "#f00";
    }
    else if(d.labels.includes("Mission"))
    {
        return "#ff8000";
    }
    else if(d.labels.includes("Institution"))
    {
        return "#00f";
    }
    else if(d.labels.includes("Country"))
    {
        return "#ffff00";
    }
    else if(d.labels.includes("SpaceStation"))
    {
        return "#ff00ff";
    }
    else if(d.labels.includes("Program"))
    {
        return "#00ffff";
    }
    else if(d.labels.includes("Component"))
    {
        return "#8000ff";
    }


    else{
        return "#0f0";
    }
}

function getLabelName(d)
{
    if(d.labels.includes("Astronaut"))
    {
        return d.values.first_name + " "+ d.values.surname;
    }
    else{
        return d.values.name;
    }
}
    

</script>

</body>


</html>