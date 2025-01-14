<?php 
 
 include 'db.php';
  
$sql = "SELECT id, nome FROM eventos";
$result = $conn->query($sql);

$eventos = [];

if($result->num_rows > 0){
    while($row = $result->fetch_assoc()) {
        $eventos[] = $row;
    }
}
echo json_encode($eventos);

$conn->close();
?>