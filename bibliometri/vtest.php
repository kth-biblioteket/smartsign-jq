<?php
$serverName = "bibmet-prod.ug.kth.se"; //serverName\instanceName
$connectionInfo = array( "Database"=>"bibmet_218", "UID"=>"tobias", "PWD"=>"zTx_sX52.Y");
$conn = sqlsrv_connect( $serverName, $connectionInfo);

$query = "SELECT t1.*,1 as level
FROM bibclust.dbo.lev1_labels_18q2 as t1";

$result = sqlsrv_query($conn, $query, array($myID));
$row = sqlsrv_fetch_array($result);

while( $row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC) ) {
    $data[] = $row;
}

$results = [ $data ];

$jsonstring = json_encode($data);

if( $conn ) {
     echo "Connection established.<br />";
}else{
     echo "Connection could not be established.<br />";
     die( print_r( sqlsrv_errors(), true));
}
?>

<!DOCTYPE html>
<meta charset="utf-8">

<style type="text/css">
/* 13. Basic Styling with CSS */

/* Style the lines by removing the fill and applying a stroke */
.line {
    fill: none;
    stroke: #ffab00;
    stroke-width: 3;
}
  
.overlay {
  fill: none;
  pointer-events: all;
}

/* Style the dots by assigning a fill and stroke */
.dot {
    fill: #ffab00;
    stroke: #fff;
}
  
  .focus circle {
  fill: none;
  stroke: steelblue;
}

</style>
<!-- Body tag is where we will append our SVG and SVG objects-->
<body>
<div class="container">
  <h2>PHP - Jquery Datatables Example</h2>
  <table id="my-example">
    <thead>
      <tr>
          <th>cluster_lev1_RC</th>
          <th>label</th>
      </tr>
    </thead>
  </table>
</div>
</body>

<!-- Load in the d3 library -->
<script src="https://d3js.org/d3.v5.min.js"></script>
<script type="text/javascript" src="https://code.jquery.com/jquery-1.9.1.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/css/jquery.dataTables.css">
<script type="text/javascript" charset="utf8" src="https://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/jquery.dataTables.min.js"></script>

<script type="text/javascript">
var jsonString = JSON.stringify(<?php echo $jsonstring ?>  )
  $(document).ready(function() {
      $('#my-example').dataTable({
        aaData: <?php echo $jsonstring ?>,
        "aoColumns": [{
                mData: 'cluster_lev1_RC'
           }, {
                mData: 'label' 
           }
        ]
      });  
  });
</script>

<script>

// 2. Use the margin convention practice 
var margin = {top: 50, right: 50, bottom: 50, left: 50}
  , width = window.innerWidth - margin.left - margin.right // Use the window's width 
  , height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

// The number of datapoints
var n = 21;

// 5. X scale will use the index of our data
var xScale = d3.scaleLinear()
    .domain([0, n-1]) // input
    .range([0, width]); // output

// 6. Y scale will use the randomly generate number 
var yScale = d3.scaleLinear()
    .domain([0, 1]) // input 
    .range([height, 0]); // output 

// 7. d3's line generator
var line = d3.line()
    .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } })


console.log(dataset)

// 1. Add the SVG to the page and employ #2
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 3. Call the x axis in a group tag
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

// 9. Append the path, bind the data, and call the line generator 
svg.append("path")
    .datum(dataset) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line); // 11. Calls the line generator 

// 12. Appends a circle for each datapoint 
svg.selectAll(".dot")
    .data(dataset)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return xScale(i) })
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", 5)
      .on("mouseover", function(a, b, c) { 
  			console.log(a) 
        this.attr('class', 'focus')
		})
      .on("mouseout", function() {  })
</script>
