const checkMillionDollarIdea = (req, res, next) => {
    const numWeeks = req.body.numWeeks;
    const weeklyRevenue = req.body.weeklyRevenue;
    const totalValue = Number(numWeeks) * Number(weeklyRevenue);
    if(!numWeeks || !weeklyRevenue || isNaN(totalValue) || totalValue < 1000000){
        res.sendStatus(400);
    }
    else{
        next();
    }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
