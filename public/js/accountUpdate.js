'use strict'

 // Build account type items into HTML table components and inject into DOM 
 function buildAccountTypeList(data) { 
    let updateAccTypeDisplay = document.getElementById("updateAccTypeDisplay"); 
    // Set up the table labels 
    let dataTable = '<thead>'; 
    dataTable += '<tr><th>Account Types</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all user names in the array and put each in a row 
    data.forEach(function (element) { 
     console.log(element.account_firstname + ", " + element.account_lastname); 
     dataTable += `<tr><td>${element.account_firstname} ${element.account_lastname}</td>`; 
     dataTable += `<td><a href='/account/edit/${element.account_id}' title='Click to update'>Modify</a></td>`; 
     dataTable += `<td><a href='/account/delete/${element.account_id}' title='Click to delete'>Delete</a></td></tr>`; 
    }) 
    dataTable += '</tbody>'; 
    // Display the contents in the Account type view 
    updateAccTypeDisplay.innerHTML = dataTable; 
   }