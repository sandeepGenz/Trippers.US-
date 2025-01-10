module.exports = async function(req,res){ 
    let SSRFlags = ["lowSpiceFood", "headphones", "MAAS", "veganFood", "vegFood", "wheelchair"];

        res.status(200).send({ SSRFlags: SSRFlags });

}