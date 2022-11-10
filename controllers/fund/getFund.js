const Fund = require("../../models/fund.model");
const { getNumOfDonations } = require("./getNumOfDonations");

const getFund = (req, res) => {
    try {
        Fund.findById(req.params.id)
            .then(async (fund) => {
                let numOfDonations = await getNumOfDonations(fund._id);
                res.status(200).send({
                    fund, numOfDonations
                });
            })
            .catch((err) => {
                res.status(500).send({
                    msg: "Error fetching data",
                    error: err,
                });
            });
    } catch (error) {
        console.log(error);
    }
}

// Get fund by status
const getFundByStatus = (req, res) => {
    try {
        Fund.find({ status: req.params.status })
            .then(async (funds) => {
                let result = await Promise.all(
                    funds.map(async (fund) => {
                        return {
                            ...fund._doc,
                            numOfDonations: await getNumOfDonations(fund._id)
                        }
                    })
                )
                res.status(200).send({
                    funds: result
                });
            })
            .catch((err) => {
                res.status(500).send({
                    msg: "Error fetching data",
                    error: err,
                });
            });
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    getFund,
    getFundByStatus
};