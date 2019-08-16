<!DOCTYPE html>
<html>

<head>
<script src="https://d3js.org/d3.v5.min.js"></script>

<script src="scripts/gl_matrix.js"></script>
<script src="scripts/three.js"></script>
<script src="//unpkg.com/3d-force-graph"></script>
<script src="//unpkg.com/three-spritetext"></script>
<script src="scripts/GLTFLoader.js"></script>
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

<style>
    body{margin: 0;}
    canvas{width: 100%; height:100%}

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
        $result_nodes[] = [
                            "id"=>$result_node->get("n")->identity(),
                            "values"=>$result_node->get("n")->values(), 
                            "labels"=>$result_node->get("n")->labels()];
    }
    return $result_nodes;
}

function getAllEdges()
{
    
    global $client;
   // $the_query = "MATCH()-[r]->() WHERE type(r) <> \"EMPLOYED_BY\" RETURN r, id(endNode(r)) as endNode, id(startNode(r)) as startNode ORDER BY id(r);";
    $the_query = "MATCH()-[r]->() RETURN r, id(endNode(r)) as endNode, id(startNode(r)) as startNode ORDER BY id(r);";
    $the_result =  $client->run($the_query);
    $result_edges = [];

    foreach($the_result->getRecords() as $result_edge)
    {
        $result_edges[] = [
                            "id"=>$result_edge->get("r")->identity(),
                            "values"=>$result_edge->get("r")->values(), 
                            "source"=>$result_edge->get("startNode"),
                            "target"=>$result_edge->get("endNode"),
                            "type"=>$result_edge->get("r")->type()
        ];
    }
    return $result_edges;
}


$allNodes = getAllNodes();
$allEdges = getAllEdges();

$nodes_json = json_encode($allNodes );
$edges_json = json_encode($allEdges);

$nodes_json = str_replace("'", "\'" ,$nodes_json); 
$nodes_json = str_replace("\\\"", "" ,$nodes_json); 

?>

<div id="3d-graph"></div>

<script>
// Pass the PHP JSON to the javascript

const allNodesJSON  = '<?php echo $nodes_json ?>';


const allEdgesJSON  = '<?php echo $edges_json ?>';
const allNodes= JSON.parse(allNodesJSON);
const allEdges = JSON.parse(allEdgesJSON);
</script>

<script src = "scripts/threejstest.js"></script>




</body>

</html>