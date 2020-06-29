const db = require("../models/index")
const clientInfo = {
    clientVersion: async function (req, res) {

        var model = await db.Client.findOne({
            where: {
                id: 1
            }
        }).then(model => {
            // console.dir(model);
            if (model != null) {
                console.log("model.dataValues.version ", model.dataValues.version)
                res.status(200).send(JSON.stringify(model.dataValues.version))
            }
        }).catch(error => {
            console.log(error);

        })
    },
}
module.exports = clientInfo;