const pool = require('../database/');

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }

  /* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Updates account info
* ***************************** */
async function updateAcc(account_id, account_firstname, account_lastname, account_email){
  try{
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ])
    return data.rows[0]

  }catch(error){
    console.error ("model " + error)
  }
}

// This will update account password
async function updatePassword(account_id, account_password){
  try{
    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    const data = await pool.query(sql, [
      account_password,
      account_id
    ])
    return data.rows[0]

  }catch(error){
    console.error ("model " + error)
  }
}

//This will update the account type
async function updateAccountType(account_id, account_type){
  try {
    const sql = "UPDATE public.account SET account_type = $1 WHERE account_id = $2 RETURNING *"
    const data = await pool.query(sql, [
      account_type,
      account_id
    ])
    return data.rows[0]
  } catch(error){
    console.error ("model " + error)
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountInfo(){
  return await pool.query("SELECT * FROM public.account")
}

/* ***************************
 *  Get all account type data
 * ************************** */
async function getAccountType(){
  return await pool.query("SELECT DISTINCT account_type FROM public.account")
  // return await pool.query("SELECT * FROM public.account ORDER BY account_type")
}

async function getAccountsByType(account_type) {
  console.log("Queried account type:", account_type); 
  try {
    const query = 'SELECT * FROM account WHERE account_type = $1';
    const values = [account_type];
    console.log("Executing query:", query);
    console.log("With parameters:", values);
    const result = await pool.query(query, values);
    console.log("Query result:", result.rows);
    return result.rows;
  } catch (error) {
    console.error('Error querying accounts by type:', error);
    throw error;
  }
}
// async function getAccountsByType(account_type) {
//   try {
//     const query = 'SELECT * FROM account';
//     const result = await pool.query(query);
//     console.log("Fetched accounts:", result.rows);
//     return result.rows;
//   } catch (error) {
//     console.error('Error querying account by type:', error);
//     throw error;
//   }
// }



module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, getAccountInfo, updateAcc, updatePassword, getAccountType, updateAccountType, getAccountsByType}