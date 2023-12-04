const { Entity } = require("../models/entity")

function checkIfExists(id) {
    return Entity.findOne({
        id
    }).catch(() => {
        console.log('throw')
        throw { status: 400, message: `Entity do not exist id:${entityId}`}
    })
}

module.exports = {
    checkIfExists
}