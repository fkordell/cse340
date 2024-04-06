'use strict'

 
 // Get a list of items in account based on the account_id 
document.addEventListener('DOMContentLoaded', function() {
    const accountTypeSelect = document.querySelector("#accountTypeSelect");
    accountTypeSelect.addEventListener("change", function(e) {
      console.log(e);
      const account_type = this.value;
      console.log("Selected account type:", account_type); 
      fetch(`/account/getAccountsByType/${account_type}`)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not OK');
          return response.json();
        })
        .then(data => {
        console.log("Fetched data:", data); 
        buildAccountTypeList(data);
        })
        .catch(error => console.error('There was a problem:', error));
    });
  });
  
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