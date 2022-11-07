const FundDonation = require("../../models/fundDonation.model");

const getNumOfDonations = async (fundid) => {
    try {
        let numDonations = await FundDonation.find({
            fundID: fundid
        }).then(async (contributions) => {
            // get the number of donors
            const donors = new Set();
            for (const contribution of contributions) {
                donors.add(contribution.userID);
            }
            // res.status(500).send({
            //     donors: donors.size
            // });
            return donors.size;
        }).catch((err) => {
            // res.status(500).send({
            //     donors: 0,
            // });
            return 0;
        });

        return numDonations;
    } catch (error) {
        console.log(error);
        // res.status(500).send({
        //     donors: 0,
        // });
        return 0;
    }
}

module.exports = {
    getNumOfDonations
};