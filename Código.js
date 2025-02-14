var gData;
var url =  'https://script.google.com/macros/s/AKfycby66pO8D9GaWu11-5qgPc6kPO8GVZD3tYtKYkyownmlSxPezRtG2WOH0zdB74qSHKc1/exec?action=getData
'
' 

function getDataAPI() {  
  $('#d_table').html('<div class="col">Please Wait.....</div>') 
  const url1 = url+'?action=getData'   
 
  fetch(url1)
  .then(response =>{      
    return response.json()        
  })
  .then(data => {
    gData = data.data
    showSendPatientTable(gData)
    console.log(data.data);
  })
  .catch(error => {
    console.error("Error in fetch:", error.message);
  });
}

function addRecord(){
  document.getElementById("btn1").disabled = true
  const piso = $('#piso').val()
  const codigo = $('#codigo').val()
  const corredor = $('#corredor').val()
  const prateleira = $('#prateleira').val()
  const data = $('#data').val()
  const obj = {
    piso:piso,
    codigo:codigo,
    corredor:corredor,
    prateleira:prateleira,
    data:data
  }
  const obj_json = JSON.stringify(obj)
  let formData = new FormData();
  formData.append('action', 'addData');
  formData.append('data',obj_json);        
  fetch(url, {
    method: 'POST',
    body: formData,
  })
  .then(response => {        
    return response.json()})
  .then(data => {
    console.log(data)        
    if(data.status == "success"){          
      document.getElementById("piso").value = "";
      document.getElementById("codigo").value = "";
      document.getElementById("corredor").value = "";
      document.getElementById("prateleira").value = "";
      document.getElementById("data").value = "";
      document.getElementById("btn1").disabled = false
      getDataAPI()
    }
  })
  .catch(error => {
    console.error(error);
    document.getElementById("btn1").disabled = false
  });
}

function showSendPatientTable(){    
  if(gData && gData !== undefined && gData.length != 0){
    let row_number = 0
    let table_result = `<h5>Edit Table</h5><table class="table table-responsive table-bordered" id="mainTable" style="text-align:center;">
      <thead>
        <tr>
          <th scope='col' class="dt-center">ID</th>
          <th scope='col' class="dt-center">PISO</th>
          <th scope='col' class="dt-center">CÓDIGO</th>
          <th scope='col' class="dt-center">CORREDOR</th>
          <th scope='col' class="dt-center">PRATELEIRA</th>
          <th scope='col' class="dt-center">DATA</th>
          <th scope='col' class="dt-center">AÇÕES</th>
        </tr>
      </thead>        
    `
    gData.forEach(r =>{
      table_result += `<tr id="ROWNUMBER:${row_number}">                     
        <td><input type="hidden" id="idM${row_number}" value="${r['id']}">${r['id']}</td>
        <td>${r['piso']}</td>
        <td>${r['codigo']}</td>
        <td>${r['corredor']}</td>
        <td>${r['prateleira']}</td>
        <td>${r['data']}</td>
        <td>
          <p style="color:blue;" type="button" onclick="editData(${row_number})"><i class="fa-solid fa-pen-to-square"></i></p>
          <p style="color:red;" type="button" onclick="delData(${row_number})"><i class="fa-solid fa-trash-can"></i></p>
        </td>
      </tr>` 
      row_number++        
    })
    table_result += "</table>"        
    $('#d_table').html(table_result)  

    $('#mainTable').DataTable({       
      lengthMenu: [[20,50,100], [20,50,100]] ,
      order: [[0, 'asc']],          
    });
  }else{
    alert('data not found!')
  }
}

function delData(row_number){
  const id = $('#idM'+row_number).val()
  Swal.fire({
    position: 'center',
    title: 'Confirm Delete?',         
    icon: 'warning',          
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if(result.isConfirmed){ 
      Swal.fire({
        position: 'center',
        icon: 'warning',
        text: "Please Wait...",
        showConfirmButton: false
      }) 
      const obj = { id:id }
      const obj_json = JSON.stringify(obj)
        
      let formData = new FormData();
      formData.append('action', 'deleteData');
      formData.append('data',obj_json);        
      fetch(url, {
        method: 'POST',
        body: formData,       
      })
      .then(response => {        
        return response.json()})
      .then(data => {
        console.log(data)        
        if(data.status == "success"){                            
          document.getElementById('mainTable').deleteRow(document.getElementById('ROWNUMBER:'+row_number).rowIndex); 
          Swal.fire({
            position: 'center',
            icon: 'success',
            text: "Deleted!",
            timer:2000                     
          })
        }                               
      })
      .catch(error => {
        console.error(error);                         
      });           
    }//if result.isConfirmed
  })//then
}

function editData(row_number){
  const id = $('#idM'+row_number).val()
  const filterVal = gData.filter(r=>r['id'] === id)
  const piso = filterVal.map(r=>r['piso'])[0]
  const codigo = filterVal.map(r=>r['codigo'])[0]
  const corredor = filterVal.map(r=>r['corredor'])[0]
  const prateleira = filterVal.map(r=>r['prateleira'])[0]
  const data = filterVal.map(r=>r['data'])[0]
  $('#up_id').val(id)
  $('#up_piso').val(piso)
  $('#up_codigo').val(codigo)
  $('#up_corredor').val(corredor)
  $('#up_prateleira').val(prateleira)
  $('#up_data').val(data)
  $('#edit_form').show()
  $('#d_table').hide()    
}

function submitEdit(){
  document.getElementById("btn2").disabled = true
  const id =  $('#up_id').val()
  const piso = $('#up_piso').val()
  const codigo = $('#up_codigo').val()
  const corredor = $('#up_corredor').val()
  const prateleira = $('#up_prateleira').val()
  const data = $('#up_data').val()
  const obj = {
    id:id,
    piso:piso,
    codigo:codigo,
    corredor:corredor,
    prateleira:prateleira,
    data:data
  }
  const obj_json = JSON.stringify(obj)

  let formData = new FormData();
  formData.append('action', 'editData');
  formData.append('data',obj_json);        
  fetch(url, {
    method: 'POST',
    body: formData,       
  })
  .then(response => {        
    return response.json()})
  .then(data => {
    console.log(data)        
    if(data.status == "success"){   
      document.getElementById("btn2").disabled = false
      getDataAPI()
      closeEditEl()
    }
  })
  .catch(error => {
    console.error(error);
    document.getElementById("btn2").disabled = false
  });
}

function closeEditEl(){
  $('#up_id').val('')
  $('#up_piso').val('')
  $('#up_codigo').val('')
  $('#up_corredor').val('')
  $('#up_prateleira').val('')
  $('#up_data').val('')
  $('#edit_form').hide()
  $('#d_table').show()
}

document.getElementById('btn1').addEventListener("click",e=>{
  addRecord()
})
document.getElementById('btn2').addEventListener("click",e=>{
  submitEdit()
})
document.getElementById('btn3').addEventListener("click",e=>{
  closeEditEl()
})

document.addEventListener('DOMContentLoaded',getDataAPI)
