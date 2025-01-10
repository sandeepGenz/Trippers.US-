module.exports = function(req,res){ 
    res.writeHead(200, { 'Content-Type': 'text/html' }); 
        
    // set response content    
    res.write('<html><body><p>This is preferences</p></body></html>');
    res.end();
  }