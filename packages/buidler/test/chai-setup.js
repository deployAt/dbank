const chai = require('chai')
const waffleChai = require('@ethereum-waffle/chai').waffleChai

chai.use(waffleChai)
module.exports = chai
