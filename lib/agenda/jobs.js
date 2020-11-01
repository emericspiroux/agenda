"use strict";
const utils = require("../utils");

const createJob = utils.createJob;

const jobFunctionCb = function (query, cb) {
  const self = this;
  this._collection.find(query).toArray((error, result) => {
    let jobs;
    if (!error) {
      jobs = result.map(createJob.bind(null, self));
    }
    cb(error, jobs);
  });
};

const jobFunctionAsync = async function (query) {
  const result = await this._collection.find(query).toArray();

  return result.map((job) => createJob(this, job));
};

/**
 * Finds all jobs matching 'query'
 * @param {Object} query object for MongoDB
 * @param {Function} cb called when fails or passes
 * @returns {undefined}
 */
module.exports = function (query, cb) {
  if (cb) {
    jobFunctionCb.bind(this)(query, cb);
  } else {
    return new Promise(async (s, f) => {
      try {
        s(await jobFunctionAsync.bind(this)(query));
      } catch (err) {
        f(err);
      }
    });
  }
};
