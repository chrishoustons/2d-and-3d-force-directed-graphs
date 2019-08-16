
<?php
require_once 'C:/Users/Chris/vendor/autoload.php';

use GraphAware\Neo4j\Client\ClientBuilder;

$client = ClientBuilder::create()
    ->addConnection('default', 'http://neo4j:admin@localhost:7474')
    ->build();

function performQuery($the_query)
{
    //Take in label. Return all nodes of that type
    global $client;
    
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

$name = "\"".$_REQUEST["q"]."\"";

$allNodes = performQuery('MATCH(n) WHERE  toLower(n.first_name) STARTS WITH toLower('.$name.') OR toLower(n.surname) STARTS WITH toLower('.$name.') OR toLower(n.nickname) STARTS WITH toLower('.$name.') RETURN n;');

$nodes_json = json_encode($allNodes);

echo $nodes_json;